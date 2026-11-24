/**
 * Enhanced error capture utilities for QUnit tests
 */

import type { Page } from '@playwright/test';
import type { QUnitErrorDetails } from '~/qunit/types.ts';
import { getCapturedConsoleLogs } from '~/qunit/utils/console-capture.ts';

/**
 * Captures comprehensive error details from a QUnit test execution
 */
export async function captureQUnitErrorDetails(
    page: Page,
    testPath: string
): Promise<QUnitErrorDetails> {
    // Capture QUnit-specific error information
    const [qunitResults, failedTests, failedAssertions] = await Promise.all([
        page.evaluate(() => window.__qunitResults__),
        page.evaluate(() => window.__qunitFailedTests__ || []),
        page.evaluate(() => window.__qunitFailedAssertions__ || [])
    ]);

    // Capture console/browser logs
    const consoleLogs = await getCapturedConsoleLogs(page);

    return {
        testPath,
        qunitResults: qunitResults ?? {
            failed: 0, passed: 0, skipped: 0, todo: 0, total: 0,
            status: 'failed', runtime: 0
        },
        failedTests: failedTests || [],
        failedAssertions: failedAssertions || [],
        browserLogs: consoleLogs.logs.map(log => log.message),
        consoleErrors: consoleLogs.errors.map(error => error.message),
        timing: {
            scriptLoad: 0, // Will be set by the caller
            testExecution: qunitResults?.runtime ?? 0,
            total: 0
        }
    };
}

/**
 * Registers reporters before a sample loads so script errors are captured.
 */
export async function setupEnhancedQUnitCallbacks(page: Page): Promise<void> {
    await page.evaluate(() => {
        const qunit = window.QUnit;
        const failedTests: NonNullable<Window['__qunitFailedTests__']> = [];
        const failedAssertions: NonNullable<
            Window['__qunitFailedAssertions__']
        > = [];
        window.__qunitFailedTests__ = failedTests;
        window.__qunitFailedAssertions__ = failedAssertions;

        qunit.on('runEnd', ({ status, testCounts, runtime }) => {
            window.__qunitResults__ = { ...testCounts, status, runtime };
        });

        qunit.on('testEnd', ({ fullName, status, errors, runtime }) => {
            if (status !== 'failed') {
                return;
            }

            const name = fullName.at(-1) ?? '';
            const module = fullName.slice(0, -1).join(' > ');
            failedTests.push({
                module,
                name,
                failures: [`${errors.length} assertion failure(s)`],
                runtime,
                stack: errors[0]?.stack
            });

            // QUnit releases actual/expected after dispatching testEnd.
            for (const { actual, expected, message, stack } of errors) {
                failedAssertions.push({
                    result: false,
                    actual,
                    expected,
                    message: message ?? '',
                    source: stack,
                    module,
                    name,
                    runtime,
                    stack
                });
            }
        });

        qunit.on('error', error => {
            const message = typeof error === 'string' ? error :
                error instanceof Error ? error.message : 'Unknown error';
            failedAssertions.push({
                result: false,
                name: 'Uncaught error',
                message,
                actual: error instanceof Error ? undefined : error,
                expected: undefined,
                runtime: 0,
                stack: error instanceof Error ? error.stack : undefined
            });
        });
    });
}
