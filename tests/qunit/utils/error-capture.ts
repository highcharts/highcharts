/**
 * Enhanced error capture utilities for QUnit tests
 */

import type { Page } from '@playwright/test';
import type { QUnitErrorDetails } from '~/qunit/types.ts';
import { getCapturedConsoleLogs, filterRelevantLogs } from '~/qunit/utils/console-capture.ts';

/**
 * Captures comprehensive error details from a QUnit test execution
 */
export async function captureQUnitErrorDetails(
    page: Page,
    testPath: string
): Promise<QUnitErrorDetails> {
    const startTime = Date.now();

    // Capture QUnit-specific error information
    const [qunitResults, failedTests, failedAssertions] = await Promise.all([
        page.evaluate(() => window.__qunitResults__),
        page.evaluate(() => window.__qunitFailedTests__ || []),
        page.evaluate(() => window.__qunitFailedAssertions__ || [])
    ]);

    // Capture and filter console logs
    const consoleLogs = await getCapturedConsoleLogs(page);
    const filteredLogs = filterRelevantLogs(consoleLogs);

    const endTime = Date.now();

    return {
        testPath,
        qunitResults: qunitResults || { failed: 0, passed: 0, total: 0 },
        failedTests: failedTests || [],
        failedAssertions: failedAssertions || [],
        browserLogs: filteredLogs.logs.map(log => log.message),
        consoleErrors: filteredLogs.errors.map(error => error.message),
        timing: {
            scriptLoad: 0, // Will be set by the caller
            testExecution: endTime - startTime,
            total: endTime - startTime
        }
    };
}

/**
 * Sets up enhanced error capture in the browser context
 * Note: Console capture is handled separately by console-capture.ts
 */
export async function setupErrorCapture(page: Page): Promise<void> {
    await page.evaluate(() => {
        // Initialize error capture arrays
        window.__qunitBrowserLogs__ = [];
        window.__qunitConsoleErrors__ = [];
    });
}

/**
 * Enhanced QUnit callback setup with better error capture
 */
export async function setupEnhancedQUnitCallbacks(page: Page): Promise<void> {
    await page.evaluate(() => {
        const qunit = window.QUnit;

        // Enhanced done callback
        qunit.done(function (details) {
            window.__qunitResults__ = {
                failed: details.failed,
                passed: details.passed,
                total: details.total
            };
        });

        // Enhanced testDone callback with better error capture
        qunit.testDone(function (data) {
            if (data.failed > 0) {
                window.__qunitFailedTests__ ??= [];

                // Create a summary of the failed test (without duplicating assertion details)
                const testKey = `${data.module || 'Unknown'} > ${data.name}`;
                
                // Check if we already have this test recorded
                const existingTest = window.__qunitFailedTests__.find(test => {
                    const mod = test.module || 'Unknown';
                    return `${mod} > ${test.name}` === testKey;
                });
                
                if (!existingTest) {
                    // Count the number of failed assertions for this test
                    const failureCount = data.failed;
                    const failures = [`${failureCount} assertion failure(s)`];

                    // Try to extract stack trace from the first error
                    let stack: string | undefined;
                    if (data.errors && data.errors.length > 0) {
                        const firstError = data.errors[0];
                        if (firstError && typeof firstError === 'object' && 'stack' in firstError) {
                            const errorObj = 
                                firstError as Record<string, unknown>;
                            if (errorObj.stack && typeof errorObj.stack === 'string') {
                                stack = errorObj.stack;
                            }
                        }
                    }

                    window.__qunitFailedTests__.push({
                        module: data.module,
                        name: data.name,
                        failures,
                        runtime: data.runtime,
                        stack
                    });
                }
            }
        });

        // Enhanced log callback with better assertion capture
        qunit.log(function (details) {
            if (!details.result) {
                window.__qunitFailedAssertions__ ??= [];

                // Try to extract stack trace
                let stack: string | undefined;
                if (details.source) {
                    stack = details.source;
                }

                window.__qunitFailedAssertions__.push({
                    result: details.result,
                    actual: details.actual,
                    expected: details.expected,
                    message: details.message,
                    source: details.source || '',
                    module: details.module || '',
                    name: details.name || '',
                    runtime: details.runtime || 0,
                    stack
                });
            }
        });
    });
}

/**
 * Clears all error capture data
 */
export async function clearErrorCapture(page: Page): Promise<void> {
    await page.evaluate(() => {
        window.__qunitResults__ = null;
        window.__qunitFailedTests__ = null;
        window.__qunitFailedAssertions__ = null;
        window.__qunitBrowserLogs__ = null;
        window.__qunitConsoleErrors__ = null;
        window.__qunitErrorDetails__ = null;
    });
}