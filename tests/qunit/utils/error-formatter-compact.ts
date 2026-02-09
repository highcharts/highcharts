/**
 * Enhanced error formatting utilities for QUnit test failures
 */

import colors from 'colors/safe';
import type { QUnitFailedTest, QUnitFailedAssertion, QUnitErrorDetails } from '~/qunit/types.ts';

/**
 * Formats a failed test with enhanced error information
 */
export function formatFailedTest(test: QUnitFailedTest): string {
    const header = colors.red(
        `${test.module ? `${test.module} > ` : ''}${test.name}`
    ) + colors.gray(` ${test.runtime}ms`);

    const failures = test.failures.map((failure, index) => {
        return `   ${index + 1}. ${failure}`;
    }).join('\n');

    const stack = test.stack ? `\n   Stack trace:\n${formatStackTrace(test.stack)}` : '';

    return test.stack ? `${header}\n${failures}${stack}` : '';
}

/**
 * Formats a failed assertion with detailed information
 */
export function formatFailedAssertion(
    assertion: QUnitFailedAssertion,
    errorDetails: QUnitErrorDetails
): string {
    const header = colors.red(
        `${assertion.module ? `${assertion.module} > ` : ''}${assertion.name}`
    ) + colors.gray(` ${assertion.runtime}ms`);
    const message = `   ${assertion.message}`;
    const expected = '   - Expected: ' + colors.green(formatValue(assertion.expected));
    const actual = '   - Actual: ' + colors.red(formatValue(assertion.actual));

    const stack = assertion.stack ?
        `\n   - Stack trace:\n${formatStackTrace(assertion.stack, errorDetails)}` :
        '';
    return `${header}\n${message}\n${expected}\n${actual}${stack}`;
}

/**
 * Formats the complete error details for a test failure
 */
export function formatQUnitErrorDetails(
    errorDetails: QUnitErrorDetails
): string {

    const summary = colors.gray(`\nSummary: total: ${
        errorDetails.qunitResults.total
    }, passed: ${
        errorDetails.qunitResults.passed
    }, failed: ${errorDetails.qunitResults.failed}
Timing: script load: ${
    errorDetails.timing.scriptLoad
}ms, test execution: ${
    errorDetails.timing.testExecution
}ms, total: ${errorDetails.timing.total}ms\n`);

    // Deduplicate failed assertions by grouping them by test
    const deduplicatedAssertions =
        deduplicateFailedAssertions(errorDetails.failedAssertions);

    const failedAssertions = deduplicatedAssertions.length > 0
        ? deduplicatedAssertions.map((ass) => formatFailedAssertion(ass, errorDetails)).join('\n\n')
        : '';

    const browserLogSet = new Set(errorDetails.browserLogs);
    const nonDuplicateConsoleErrors = errorDetails.consoleErrors.filter(
        error => !browserLogSet.has(error)
    );

    const browserLogs = errorDetails.browserLogs.length > 0
        ? `\n\nBrowser Logs:\n${errorDetails.browserLogs.map(log => `   ${log}`).join('\n')}`
        : '';

    const consoleErrors = nonDuplicateConsoleErrors.length > 0
        ? `\n\nConsole Errors:\n${nonDuplicateConsoleErrors.map(error => `   ${error}`).join('\n')}`
        : '';

    return `${summary}\n${failedAssertions}${browserLogs}${consoleErrors}\n`;
}

/**
 * Formats the complete error details for a test failure
 */
export function formatQUnitErrorDetailsVerbose(
    errorDetails: QUnitErrorDetails
): string {
    const header = `🔍 QUnit Test Failure Details for: ${errorDetails.testPath}`;
    const separator = '='.repeat(80);

    const summary = `
📊 Test Summary:
   Total: ${errorDetails.qunitResults.total}
   Passed: ${errorDetails.qunitResults.passed}
   Failed: ${errorDetails.qunitResults.failed}

⏱️  Timing Information:
   Script Load: ${errorDetails.timing.scriptLoad}ms
   Test Execution: ${errorDetails.timing.testExecution}ms
   Total: ${errorDetails.timing.total}ms
`;

    // Deduplicate failed assertions by grouping them by test
    const deduplicatedAssertions =
        deduplicateFailedAssertions(errorDetails.failedAssertions);

    const failedTests = errorDetails.failedTests.length > 0
        ? `\n🚫 Failed Tests:\n${errorDetails.failedTests.map(formatFailedTest).join('\n\n')}`
        : '';

    const failedAssertions = deduplicatedAssertions.length > 0
        ? `\n❗ Failed Assertions:\n${deduplicatedAssertions.map(formatFailedAssertion).join('\n\n')}`
        : '';

    const browserLogSet = new Set(errorDetails.browserLogs);
    const nonDuplicateConsoleErrors = errorDetails.consoleErrors.filter(
        error => !browserLogSet.has(error)
    );

    const browserLogs = errorDetails.browserLogs.length > 0
        ? `\n📝 Browser Logs:\n${errorDetails.browserLogs.map(log => `   ${log}`).join('\n')}`
        : '';

    const consoleErrors = nonDuplicateConsoleErrors.length > 0
        ? `\n🚨 Console Errors:\n${nonDuplicateConsoleErrors.map(error => `   ${error}`).join('\n')}`
        : '';

    return `${header}\n${separator}${summary}${failedTests}${failedAssertions}${browserLogs}${consoleErrors}\n${separator}`;
}

/**
 * Deduplicates failed assertions to avoid showing the same assertion multiple times
 */
function deduplicateFailedAssertions(
    assertions: QUnitFailedAssertion[]
): QUnitFailedAssertion[] {
    const seen = new Set<string>();
    return assertions.filter(assertion => {
        // Create a unique key for each assertion based on test, message, and values
        const key = `${assertion.module || 'Unknown'} > ${assertion.name} | ${assertion.message} | ${JSON.stringify(assertion.actual)} | ${JSON.stringify(assertion.expected)}`;

        if (seen.has(key)) {
            return false; // Skip duplicate
        }

        seen.add(key);
        return true;
    });
}

/**
 * Formats a value for display in error messages
 */
function formatValue(value: unknown): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return '[object Object]';
        }
    }
    return '[Unknown Type]';
}

/**
 * Formats a stack trace for better readability
 */
function formatStackTrace(
    stack: string,
    errorDetails: QUnitErrorDetails
): string {
    return stack
        .split('\n')
        .map(line => line
            // By inserting the actual test path, Playwright magically picks it
            // up and prints a nice report in the console
            .replace('<anonymous>:', `${errorDetails.testPath}:`)
        )
        .map(line => `     ${line.trim()}`)
        .filter(line => line.trim().length > 0)
        .join('\n');
}

/**
 * Extracts stack trace from an error object
 */
export function extractStackTrace(error: Error): string | undefined {
    if (error instanceof Error && error.stack) {
        return error.stack;
    }
    return undefined;
}

/**
 * Creates a structured error summary for quick debugging
 */
export function createErrorSummary(errorDetails: QUnitErrorDetails): string {
    const failedCount = errorDetails.qunitResults.failed;
    const totalCount = errorDetails.qunitResults.total;
    const testPath = errorDetails.testPath.split('/').pop() || errorDetails.testPath;

    if (failedCount === 0) {
        return `✅ ${testPath}: All ${totalCount} tests passed`;
    }

    const failureTypes = [];
    if (errorDetails.failedTests.length > 0) {
        failureTypes.push(`${errorDetails.failedTests.length} test failure(s)`);
    }
    if (errorDetails.failedAssertions.length > 0) {
        failureTypes.push(`${errorDetails.failedAssertions.length} assertion failure(s)`);
    }
    if (errorDetails.consoleErrors.length > 0) {
        failureTypes.push(`${errorDetails.consoleErrors.length} console error(s)`);
    }

    return `❌ ${testPath}: ${failedCount}/${totalCount} failed - ${failureTypes.join(', ')}`;
}
