/* eslint-disable playwright/no-conditional-in-test */
import { Page } from '@playwright/test';
import { test, setupRoutes } from '~/fixtures.ts';
import { getKarmaScripts, getSample, transpileTS } from '~/utils.ts';
import { join, dirname } from 'node:path';
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

test.describe('QUnit tests', () => {
    const pathEnv = process.env.QUNIT_TEST_PATH ?? 'unit-tests/*/*';

    test.describe.configure({
        timeout: 30_000,
        retries: 1 // retry once
    });

    // Set up page in advance to share browser between tests
    // which saves setup time for each test
    let page: Page;

    // Track test results for summary
    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    test.beforeAll(async ({ browser }) => {
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
                    const scriptLoadTime = scriptLoadEnd - scriptLoadStart;
                    errorDetails.timing.scriptLoad = scriptLoadTime;
                    errorDetails.timing.total = Date.now() - testStartTime;

                    // Create formatted error output
                    const outputConfig = getOutputConfig();
                    const detailedError = formatQUnitErrorDetails(
                        errorDetails, 
                        {
                            verbose: outputConfig.verbose
                        }
                    );

                    // Fail the Playwright test with the detailed error message
                    // Don't use expect() to avoid duplicated output
                    throw new Error(detailedError);
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
                    throw new Error(errorMessage);
                } else {
                    // Re-throw the error as-is if it's already an Error
                    // (e.g., from QUnit test failures above - count already incremented)
                    if (error instanceof Error) {
                        throw error;
                    }
                    // Handle other types of errors
                    testResults.failed++;
                    const errorMessage = `❌ Test execution error: ${error}\nTest: ${qunitTest}`;
                    throw new Error(errorMessage);
                }
            }
        });
    }
});
