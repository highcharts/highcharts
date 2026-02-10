/* eslint-disable playwright/no-conditional-in-test */
import { Page } from '@playwright/test';
import { test, setupRoutes } from '~/fixtures.ts';
import { getKarmaScripts, getSample, transpileTS } from '~/utils.ts';
import { join, dirname } from 'node:path';
import { appendFile, writeFile, unlink } from 'node:fs/promises';
import { glob } from 'glob';

import '~/qunit/types.ts'; // Import for global type declarations
import { setupErrorCapture, setupEnhancedQUnitCallbacks, captureQUnitErrorDetails, clearErrorCapture } from '~/qunit/utils/error-capture.ts';
import { formatQUnitErrorDetails } from '~/qunit/utils/error-formatter.ts';
import { setupConsoleCapture } from '~/qunit/utils/console-capture.ts';
import { waitForQUnitWithTimeout, waitForScriptLoadWithTimeout, attemptTimeoutRecovery, type TimeoutError } from '~/qunit/utils/timeout-handler.ts';
import { getOutputConfig, createVerbosePassedOutput } from '~/qunit/utils/output-config.ts';

const QUNIT_VERSION = '2.4.0';
const QUNIT_SCRIPT = join('tests', 'qunit', 'vendor', `qunit-${QUNIT_VERSION}.js`);
const QUNIT_STYLES = join('tests', 'qunit', 'vendor', `qunit-${QUNIT_VERSION}.css`);
const QUNIT_CONSOLE_LOG_GLOB = join('tests', 'qunit', 'console-worker-*.log');
const QUNIT_CONSOLE_LOG_NOTE_MARKER = join(
    'tests',
    'qunit',
    '.console-log-note-printed.log'
);

function getQUnitConsoleLogPath(workerIndex: number): string {
    return join('tests', 'qunit', `console-worker-${workerIndex}.log`);
}

async function unlinkIfExists(filePath: string): Promise<void> {
    try {
        await unlink(filePath);
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code !== 'ENOENT') {
            throw error;
        }
    }
}

async function clearPreviousWorkerLogs(): Promise<void> {
    const existingWorkerLogs = glob.sync(QUNIT_CONSOLE_LOG_GLOB, {
        nodir: true
    });

    await Promise.all(existingWorkerLogs.map(unlinkIfExists));
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
                    normalized.includes('evalute@') ||
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

async function logBrowserLogsNoteOnce(
    logFilePath: string = QUNIT_CONSOLE_LOG_GLOB
): Promise<void> {
    try {
        await writeFile(
            QUNIT_CONSOLE_LOG_NOTE_MARKER,
            `${new Date().toISOString()}\n`,
            { flag: 'wx' }
        );
        console.log(`🗒 Browser logs: ${logFilePath}`);
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code !== 'EEXIST') {
            throw error;
        }
    }
}

test.describe('QUnit tests', () => {
    const pathEnv = process.env.QUNIT_TEST_PATH ?? 'unit-tests/*/*';

    test.describe.configure({
        timeout: 30_000,
    });

    // Set up page in advance to share browser between tests
    // which saves setup time for each test
    let page: Page;
    let qunitConsoleLogPath = getQUnitConsoleLogPath(0);

    // Track test results for summary
    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    test.beforeAll(async ({ browser }, testInfo) => {
        qunitConsoleLogPath = getQUnitConsoleLogPath(testInfo.workerIndex);

        if (testInfo.workerIndex === 0) {
            await unlinkIfExists(QUNIT_CONSOLE_LOG_NOTE_MARKER);
            await clearPreviousWorkerLogs();
        }

        await writeFile(
            qunitConsoleLogPath,
            `QUnit browser logs (${new Date().toISOString()})\n\n`,
            'utf8'
        );

        const context = await browser.newContext({
            viewport: { width: 800, height: 600 }
        });
        page = await context.newPage();
        await setupRoutes(page); // need to setup routes separately

        // Setup enhanced error capture and console logging
        await setupErrorCapture(page);
        await setupConsoleCapture(page);

        await page.setContent(`<div id="qunit"></div>
        <div id="qunit-fixture"></div>
        <div id="container" style="width: 600px; margin 0 auto"></div>
        <div id="output"></div>`);

        const scripts = [
            ...(await getKarmaScripts()),
            join('test', 'call-analyzer.js'),
            join('test', 'test-controller.js'),
            join('test', 'test-utilities.js'),
            join('tmp', 'json-sources.js'),
            join('test', 'test-template.js'),
            ...(await glob('test/templates/**/*.js')),
            join('test', 'karma-setup.js')
        ];

        await page.addScriptTag({ path: QUNIT_SCRIPT });
        await page.addStyleTag({ path: QUNIT_STYLES });

        for (const script of scripts) {
            await page.addScriptTag({
                path: script
            });
        }

        await page.evaluate(() => {
            const qunit = window.QUnit;

            qunit.testStart(() => {
                if (window.Highcharts) {
                    window.Highcharts.setOptions({
                        chart: {
                            events: {
                                load: function () {
                                    (window as any).setHCStyles(this);
                                }
                            }
                        }
                    });
                }
            });

            qunit.testDone(() => {
                document.querySelector('#test-hc-styles')?.remove();
            });
        });
    });

    test.afterAll(async ({ browser }) => {
        if (testResults.failed > 0) {
            await logBrowserLogsNoteOnce();
        }
        await browser.close();
    });

    test.afterEach(async () => {
        await page.evaluate(() => {
            const testScript = document.querySelector('#test-script');
            if (testScript) testScript.remove();
        });

        // Clear all error capture data
        await clearErrorCapture(page);
    });

    const unitTests = glob.sync(`samples/${pathEnv}/demo.{js,mjs,ts}`, {
        absolute: true,
        posix: true,
        nodir: true,
        follow: false,
        windowsPathsNoEscape: true
    });

    for (const qunitTest of unitTests){
        test(qunitTest + '', async () =>{
            const testStartTime = Date.now();
            const sample = getSample(dirname(qunitTest));

            if (sample.script && qunitTest.endsWith('.ts')) {
                sample.script = transpileTS(sample.script);
            }

            testResults.total++;

            if (!sample.script.includes('QUnit.test')) {
                sample.script =
                    sample.script +
                    'QUnit.test("", (assert) => { assert.ok(true)  })';
            }

            // Setup enhanced QUnit callbacks
            await setupEnhancedQUnitCallbacks(page);

            const scriptLoadStart = Date.now();

            try {
                // Load script with timeout handling
                const scriptPromise = page.addScriptTag({
                    content: sample.script
                });
                const script = await waitForScriptLoadWithTimeout(
                    page,
                    scriptPromise,
                    qunitTest,
                    10000 // 10 second timeout for script loading
                );
                await (script as any).evaluate((s: HTMLScriptElement) => {
                    s.id = 'test-script';
                });
                const scriptLoadEnd = Date.now();

                // Wait for QUnit results with enhanced timeout handling
                const results = await waitForQUnitWithTimeout(
                    page,
                    qunitTest,
                    30000
                );

                const { failed, total } = await (results as any).jsonValue();

                if (Number(failed) > 0){
                    // Track failed test
                    testResults.failed++;

                    // Capture comprehensive error details
                    const errorDetails = await captureQUnitErrorDetails(
                        page,
                        qunitTest
                    );
                    await appendBrowserLogsToFile(
                        qunitTest,
                        errorDetails.browserLogs,
                        qunitConsoleLogPath
                    );
                    const scriptLoadTime = scriptLoadEnd - scriptLoadStart;
                    errorDetails.timing.scriptLoad = scriptLoadTime;
                    errorDetails.timing.total = Date.now() - testStartTime;

                    // Create formatted error output
                    const outputConfig = getOutputConfig();
                    const detailedError = formatQUnitErrorDetails(
                        errorDetails, 
                        {
                            verbose: outputConfig.verbose,
                            logFilePath: qunitConsoleLogPath,
                            includeLogFileNote: false
                        }
                    );

                    // Fail the Playwright test with the detailed error message
                    // Don't use expect() to avoid duplicated output
                    throw createMessageOnlyError(detailedError);
                } else {
                    // Track passed test
                    testResults.passed++;

                    // Log success output only in verbose mode
                    const outputConfig = getOutputConfig();
                    if (outputConfig.verbose) {
                        const testExecutionTime = Date.now() - testStartTime;
                        const verboseOutput = createVerbosePassedOutput(
                            qunitTest,
                            Number(total),
                            testExecutionTime
                        );
                        console.log(verboseOutput);
                    }
                    // Non-verbose mode: no output for passing tests
                }

            } catch (error) {
                // Handle timeout errors with enhanced diagnostics
                if (error && typeof error === 'object' && 'context' in error) {
                    const timeoutError = error as TimeoutError;

                    // Attempt recovery
                    const recovery = await attemptTimeoutRecovery(
                        page,
                        timeoutError
                    );

                    let errorMessage = `⏰ Timeout Error in ${timeoutError.context.phase}:\n`;
                    errorMessage += `Test: ${qunitTest}\n`;
                    errorMessage += `Timeout: ${timeoutError.context.timeout}ms\n`;
                    errorMessage += `Recovery: ${recovery.message}\n\n`;
                    errorMessage += timeoutError.message;
                    errorMessage = sanitizeFailureOutput(errorMessage);

                    console.error(errorMessage);

                    if (recovery.recovered) {
                        // If recovery was successful, try to get results
                        try {
                            const results = await page.evaluate(() => {
                                return window.__qunitResults__;
                            });
                            if (results && results.failed === 0) {
                                // Track recovered test as passed
                                testResults.passed++;

                                const outputConfig = getOutputConfig();
                                if (outputConfig.verbose) {
                                    const timing = Date.now() - testStartTime;
                                    const verboseOutput =
                                        createVerbosePassedOutput(
                                            qunitTest,
                                            results.total,
                                            timing
                                        );
                                    const recoveredMsg = `🔄 Recovered: ${verboseOutput}`;
                                    console.log(recoveredMsg);
                                }
                                // Non-verbose mode: no output for recovered tests
                                return;
                            }
                        } catch {
                            // Recovery didn't work, fall through to error
                        }
                    }

                    // Track failed test
                    testResults.failed++;
                    throw createMessageOnlyError(errorMessage);
                } else {
                    // Re-throw the error as-is if it's already an Error
                    // (e.g., from QUnit test failures above - count already incremented)
                    if (error instanceof Error) {
                        throw error;
                    }
                    // Handle other types of errors
                    testResults.failed++;
                    const errorMessage = `❌ Test execution error: ${error}\nTest: ${qunitTest}`;
                    throw createMessageOnlyError(errorMessage);
                }
            }
        });
    }
});
