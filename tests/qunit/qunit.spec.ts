/* eslint-disable playwright/no-conditional-in-test */
import { test } from '~/fixtures.ts';
import { getKarmaScripts, getSample, transpileTS } from '~/utils.ts';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { glob } from 'glob';

import { qunitScript, qunitStyles } from '~/qunit/assets.ts';
import { setupEnhancedQUnitCallbacks, captureQUnitErrorDetails } from '~/qunit/utils/error-capture.ts';
import { formatQUnitErrorDetails } from '~/qunit/utils/error-formatter.ts';
import { setupConsoleCapture } from '~/qunit/utils/console-capture.ts';
import { waitForQUnitWithTimeout, waitForScriptLoadWithTimeout, attemptTimeoutRecovery, type TimeoutError } from '~/qunit/utils/timeout-handler.ts';
import { getOutputConfig, createVerbosePassedOutput } from '~/qunit/utils/output-config.ts';

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

test.describe('QUnit tests', () => {
    const pathEnv = process.env.QUNIT_TEST_PATH ?? 'unit-tests/*/*';

    test.use({ viewport: { width: 800, height: 600 } });
    test.describe.configure({
        timeout: 30_000,
    });

    let qunitConsoleLogPath = getQUnitConsoleLogPath(0);
    let setupScripts: string[];

    test.beforeAll(async ({}, testInfo) => {
        qunitConsoleLogPath = getQUnitConsoleLogPath(testInfo.parallelIndex);
        await ensureQUnitConsoleLogFile(qunitConsoleLogPath);

        const scripts = [
            ...(await getKarmaScripts()),
            join('test', 'call-analyzer.js'),
            join('test', 'test-controller.js'),
            join('test', 'test-utilities.js'),
            join('tmp', 'json-sources.js'),
            join('test', 'test-template.js'),
            ...(await glob('test/templates/**/*.js')),
            join('test', 'visual-comparator.js'),
            join('test', 'karma-setup.js')
        ];

        setupScripts = await Promise.all(scripts.map(async path => {
            const source = await readFile(path, 'utf8');
            return `${source}\n//# sourceURL=${pathToFileURL(path).href}`;
        }));
    });

    test.beforeEach(async ({ page }) => {
        await setupConsoleCapture(page);

        // Keep the chart layout independent of QUnit 3's body margin reset.
        await page.setContent(`<body style="margin: 8px">
        <div id="qunit"></div>
        <div id="qunit-fixture"></div>
        <div id="container" style="width: 600px"></div>
        <div id="output"></div>
        </body>`);

        // An already loaded document would otherwise start before registration.
        await page.evaluate(() => {
            window.QUnit = {
                config: { autostart: false }
            } as typeof window.QUnit;
        });

        await page.addScriptTag({ path: qunitScript });
        await page.addStyleTag({ path: qunitStyles });
        await setupEnhancedQUnitCallbacks(page);

        // Keep classic scripts separate and ordered while sending them together.
        await page.evaluate(sources => {
            for (const source of sources) {
                const script = document.createElement('script');
                script.text = source;
                document.head.append(script);
            }
        }, setupScripts);

        await page.evaluate(() => {
            const qunit = window.QUnit;

            qunit.on('testStart', () => {
                if (window.Highcharts) {
                    window.Highcharts.setOptions({
                        chart: {
                            events: {
                                load: function () {
                                    window.setHCStyles(this);
                                }
                            }
                        }
                    });
                }
            });

            qunit.on('testEnd', () => {
                document.querySelector('#test-hc-styles')?.remove();
            });
        });
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
        test(qunitTest, async ({ page }) => {
            const testStartTime = Date.now();
            const sample = getSample(dirname(qunitTest));

            if (sample.script && qunitTest.endsWith('.ts')) {
                sample.script = transpileTS(sample.script);
            }

            if (!sample.script.includes('QUnit.test')) {
                sample.script =
                    sample.script +
                    'QUnit.test("", (assert) => { assert.ok(true)  })';
            }

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
                await script.evaluate((s: HTMLScriptElement) => {
                    s.id = 'test-script';
                });
                const scriptLoadEnd = Date.now();

                await page.evaluate(() => window.QUnit.start());

                const results = await waitForQUnitWithTimeout(
                    page,
                    qunitTest,
                    20000
                );

                if (results.status === 'failed') {
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
                    // Log success output only in verbose mode
                    const outputConfig = getOutputConfig();
                    if (outputConfig.verbose) {
                        const testExecutionTime = Date.now() - testStartTime;
                        const verboseOutput = createVerbosePassedOutput(
                            qunitTest,
                            results,
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
                            if (results && results.status !== 'failed') {
                                const outputConfig = getOutputConfig();
                                if (outputConfig.verbose) {
                                    const timing = Date.now() - testStartTime;
                                    const verboseOutput =
                                        createVerbosePassedOutput(
                                            qunitTest,
                                            results,
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

                    await markBrowserLogsNoteNeeded();
                    throw createMessageOnlyError(errorMessage);
                }

                await markBrowserLogsNoteNeeded();
                throw error;
            }
        });
    }
});
