/* eslint-disable playwright/no-conditional-in-test */
import type { BrowserContextOptions, JSHandle, Page } from '@playwright/test';
import { setupRoutes, test as base } from '~/fixtures.ts';
import { getSample, transpileTS } from '~/utils.ts';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { appendFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { glob } from 'glob';
import ts from 'typescript';

import {
    initializeFreshPage,
    initializeWarmPage,
    installWarmSampleHooks,
    prepareWarmSample,
    qunitViewport,
    writeQUnitSetupFile
} from '~/qunit/page.ts';
import { getCapturedConsoleLogs } from '~/qunit/utils/console-capture.ts';
import { captureQUnitErrorDetails } from '~/qunit/utils/error-capture.ts';
import { formatQUnitErrorDetails } from '~/qunit/utils/error-formatter.ts';
import { waitForQUnitWithTimeout, waitForScriptLoadWithTimeout, attemptTimeoutRecovery, type TimeoutError } from '~/qunit/utils/timeout-handler.ts';
import { getOutputConfig, createVerbosePassedOutput } from '~/qunit/utils/output-config.ts';

const scriptLoadTimeout = 10_000;
const qunitTimeout = 30_000;

function readSample(path: string): ReturnType<typeof getSample> {
    const sample = getSample(dirname(path));
    if (sample.script && path.endsWith('.ts')) {
        sample.script = transpileTS(sample.script);
    }
    return sample;
}

function requiresFreshPage(source: string): boolean {
    const file = ts.createSourceFile('sample.js', source, ts.ScriptTarget.Latest);
    function declaresBinding(node: ts.Node): boolean | undefined {
        if (ts.isVariableDeclarationList(node) ||
            ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
            return true;
        }
        if (!ts.isFunctionLike(node)) {
            return ts.forEachChild(node, declaresBinding);
        }
    }
    // Global var and lexical bindings cannot be reset. Also check top-level
    // blocks, which can contain function-scoped var declarations.
    return !!declaresBinding(file);
}

const test = base.extend<{
    samplePage: {
        page: Page;
        sample?: ReturnType<typeof getSample>;
        warm?: Awaited<ReturnType<typeof prepareWarmSample>>;
    };
}, {
    setupFile: string;
    warmPage: {
        contextOptions: BrowserContextOptions;
        page: Page;
        source: JSHandle<{ source: string }>;
    };
}>({
    setupFile: [async ({}, use) => {
        const directory = await mkdtemp(join(tmpdir(), 'highcharts-qunit-'));
        try {
            const path = join(directory, 'setup.json');
            await writeQUnitSetupFile(path);
            await use(path);
        } finally {
            await rm(directory, { recursive: true, force: true });
        }
    }, { scope: 'worker' }],
    warmPage: [async ({ browser, setupFile }, use, workerInfo) => {
        const { contextOptions, ...projectUse } = workerInfo.project.use;
        const options: BrowserContextOptions = {
            ...contextOptions,
            ...projectUse,
            viewport: qunitViewport
        };
        const context = await browser.newContext(options);
        try {
            const page = await context.newPage();
            await setupRoutes(page);
            const source = await initializeWarmPage(page, setupFile);
            try {
                await use({ page, source, contextOptions: options });
            } finally {
                if (!page.isClosed()) {
                    await page.evaluate(() => window.__qunitWarmState.finish());
                }
            }
        } finally {
            await context.close();
        }
    }, { scope: 'worker' }],
    samplePage: process.env.QUNIT_FRESH_PAGE !== '1' ?
        async ({ browser, warmPage }, use, testInfo) => {
            const sample = readSample(testInfo.title);
            // Earlier packed-bubble charts can leave parent nodes in the layout.
            if (
                testInfo.title.endsWith(
                    '/samples/unit-tests/series-packedbubble/packedbubble/demo.js'
                ) ||
                requiresFreshPage(sample.script ?? '')
            ) {
                const context = await browser.newContext(
                    warmPage.contextOptions
                );
                try {
                    const page = await context.newPage();
                    await setupRoutes(page);
                    await use({ page, sample });
                } finally {
                    await context.close();
                }
                return;
            }
            const { page, source } = warmPage;
            const warm = await prepareWarmSample(page, source, testInfo.title);
            try {
                await installWarmSampleHooks(page, warm);
                await use({ page, sample, warm });
            } finally {
                try {
                    await warm.evaluate(sample => sample.restore());
                } finally {
                    await warm.dispose();
                }
            }
        } :
        async ({ page }, use) => {
            await use({ page });
        }
});

const QUNIT_CONSOLE_LOG_NOTE_MARKER = join(
    'tests',
    'qunit',
    '.console-log-note-printed.log'
);

function getQUnitConsoleLogPath(parallelIndex: number): string {
    return join('tests', 'qunit', `console-worker-${parallelIndex}.log`);
}

async function ensureQUnitConsoleLogFile(logFilePath: string): Promise<void> {
    try {
        await writeFile(
            logFilePath,
            `QUnit browser logs (${new Date().toISOString()})\n\n`,
            {
                encoding: 'utf8',
                flag: 'wx'
            }
        );
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code !== 'EEXIST') {
            throw error;
        }
    }
}

function sanitizeFailureOutput(output: string): string {
    const sanitizedLines = output
        .split('\n')
        .filter(line => {
            const normalized = line.toLowerCase();
            const trimmed = line.trimStart().toLowerCase();
            const isStackFrame = trimmed.startsWith('at ');
            const isNoisyStackFrame =
                isStackFrame && (
                    normalized.includes('chrome://juggler/') ||
                    normalized.includes('debugger eval code') ||
                    normalized.includes('evaluate@') ||
                    normalized.includes('node:internal') ||
                    normalized.includes('@playwright')
                );

            return !isNoisyStackFrame;
        });

    const cleanedLines = sanitizedLines.filter((line, index) => {
        if (!line.toLowerCase().includes('stack trace:')) {
            return true;
        }

        for (let i = index + 1; i < sanitizedLines.length; i++) {
            const candidate = sanitizedLines[i].trim();
            if (!candidate) {
                continue;
            }
            return candidate.startsWith('at ');
        }

        return false;
    });

    return cleanedLines
        .join('\n   ')
        .replace(/^\s\s\s:/mg, '   ');
}

function createMessageOnlyError(output: string): Error {
    const message = sanitizeFailureOutput(output);
    const error = new Error(message);
    // Suppress Playwright/Node stack frame rendering for formatted QUnit failures.
    error.stack = undefined;
    return error;
}

async function appendBrowserLogsToFile(
    testPath: string,
    browserLogs: string[],
    logFilePath: string
): Promise<void> {
    if (browserLogs.length === 0) {
        return;
    }

    const separator = '-'.repeat(80);
    const content = [
        `[${new Date().toISOString()}] ${testPath}`,
        ...browserLogs.map(log => `  ${log}`),
        separator,
        ''
    ].join('\n');

    await appendFile(logFilePath, content, 'utf8');
}

async function markBrowserLogsNoteNeeded(): Promise<void> {
    try {
        await writeFile(
            QUNIT_CONSOLE_LOG_NOTE_MARKER,
            `${new Date().toISOString()}\n`,
            { flag: 'wx' }
        );
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code !== 'EEXIST') {
            throw error;
        }
    }
}

async function writeQUnitFailureLogs(
    page: Page,
    testPath: string,
    logFilePath: string
): Promise<void> {
    try {
        const { logs } = await getCapturedConsoleLogs(page);
        await appendBrowserLogsToFile(
            testPath,
            logs.map(log => log.message),
            logFilePath
        );
        await markBrowserLogsNoteNeeded();
    } catch (error) {
        console.warn('Could not save QUnit browser logs', error);
    }
}

async function recoverQUnitTimeout(
    page: Page,
    error: unknown
): Promise<void> {
    if (!error || typeof error !== 'object' || !('context' in error)) {
        throw error;
    }

    const timeoutError = error as TimeoutError;
    const recovery = await attemptTimeoutRecovery(page, timeoutError);
    if (!recovery.results) {
        throw createMessageOnlyError([
            `⏰ Timeout Error in ${timeoutError.context.phase}`,
            `Recovery: ${recovery.message}`,
            timeoutError.message
        ].join('\n'));
    }
}

test.describe('QUnit tests', () => {
    const pathEnv = process.env.QUNIT_TEST_PATH ?? 'unit-tests/*/*';

    test.use({ viewport: qunitViewport });
    test.describe.configure({
        // Allow script loading, timeout recovery, and failure diagnostics.
        timeout: scriptLoadTimeout + qunitTimeout + 10_000,
    });

    let qunitConsoleLogPath = getQUnitConsoleLogPath(0);

    test.beforeAll(async ({}, testInfo) => {
        qunitConsoleLogPath = getQUnitConsoleLogPath(testInfo.parallelIndex);
        await ensureQUnitConsoleLogFile(qunitConsoleLogPath);
    });

    const unitTests = glob.sync(`samples/${pathEnv}/demo.{js,mjs,ts}`, {
        absolute: true,
        posix: true,
        nodir: true,
        follow: false,
        windowsPathsNoEscape: true
    });

    for (const qunitTest of unitTests){
        // QUnit runs assertions inside the browser.
        // eslint-disable-next-line playwright/expect-expect
        test(qunitTest, async ({ samplePage, setupFile }) => {
            const { page, warm } = samplePage;
            try {
                if (!warm) {
                    await initializeFreshPage(page, setupFile);
                }

                const testStartTime = Date.now();
                const sample = samplePage.sample ?? readSample(qunitTest);
                const scriptLoadStart = Date.now();
                let scriptLoadTime = 0;
                let recovered = false;

                try {
                    const script = await waitForScriptLoadWithTimeout(
                        page,
                        // Playwright requires nonempty content, even for demos
                        // with an empty script.
                        page.addScriptTag({ content: sample.script || ' ' }),
                        qunitTest,
                        scriptLoadTimeout
                    );
                    await script.evaluate((element: HTMLScriptElement) => {
                        element.id = 'test-script';
                    });
                    scriptLoadTime = Date.now() - scriptLoadStart;

                    const isQUnitSample = sample.details?.resources?.some(
                        resource => resource.includes('qunit')
                    );
                    await page.evaluate(isQUnitSample => {
                        // Chart-only demos exercise setup without registering cases.
                        if (!isQUnitSample) {
                            window.QUnit.config.failOnZeroTests = false;
                        }
                        window.QUnit.start();
                    }, isQUnitSample);

                    await waitForQUnitWithTimeout(
                        page,
                        qunitTest,
                        qunitTimeout
                    );
                } catch (error) {
                    await recoverQUnitTimeout(page, error);
                    recovered = true;
                }

                await warm?.evaluate(sample => sample.reset());
                const results = await page.evaluate(() =>
                    window.getFinalQUnitResults()
                );

                const outputConfig = getOutputConfig();
                if (results.status === 'failed') {
                    const errorDetails = await captureQUnitErrorDetails(
                        page,
                        qunitTest
                    );
                    errorDetails.timing.scriptLoad = scriptLoadTime;
                    errorDetails.timing.total = Date.now() - testStartTime;

                    const detailedError = formatQUnitErrorDetails(
                        errorDetails,
                        {
                            verbose: outputConfig.verbose,
                            logFilePath: qunitConsoleLogPath,
                            includeLogFileNote: false
                        }
                    );
                    throw createMessageOnlyError(detailedError);
                }

                if (outputConfig.verbose) {
                    const verboseOutput = createVerbosePassedOutput(
                        qunitTest,
                        results,
                        Date.now() - testStartTime
                    );
                    console.log(recovered ?
                        `🔄 Recovered: ${verboseOutput}` : verboseOutput);
                }
            } catch (error) {
                await writeQUnitFailureLogs(
                    page,
                    qunitTest,
                    qunitConsoleLogPath
                );
                throw error;
            }
        });
    }
});
