/**
 * Enhanced error formatting utilities for QUnit test failures
 */

import colors from 'colors/safe';
import type { QUnitFailedAssertion, QUnitErrorDetails } from '~/qunit/types.ts';

// Disables the line linking to the playwright trace file
process.env.PLAYWRIGHT_NO_COPY_PROMPT = '1';

const MAX_STACK_TRACE_LINES = 3;

interface FormatQUnitErrorDetailsOptions {
    verbose?: boolean;
    logFilePath?: string;
    includeLogFileNote?: boolean;
}

/**
 * Formats a failed assertion with detailed information
 */
export function formatFailedAssertion(
    assertion: QUnitFailedAssertion,
    testPath?: string
): string {
    const header = colors.red(
        `❌ ${assertion.module ? `${assertion.module} > ` : ''}${assertion.name}`
    );
    const message = `Message: ${assertion.message}`;
    const actual = `Actual: ${colors.red(formatValue(assertion.actual))}`;
    const expected = `Expected: ${colors.green(formatValue(assertion.expected))}`;

    const stackTrace = formatStackTrace(assertion.stack, testPath);
    const stack = stackTrace.trim().length > 0 ?
        `\n${colors.gray('   Stack trace:')}\n${stackTrace}` :
        '';

    const hasMultiLineValues = [actual, expected].some(v => v.includes('\n'));
    const valueSeparator = hasMultiLineValues ? `\n${' '.repeat(3)}` : ' - ';

    return `${header}
   ${actual}${valueSeparator}${expected}
   ${message}
   ${stack}`;
}

/**
 * Formats the complete error details for a test failure
 */
export function formatQUnitErrorDetails(
    errorDetails: QUnitErrorDetails,
    options: FormatQUnitErrorDetailsOptions = {}
): string {
    const {
        verbose = false,
        logFilePath = 'tests/qunit/console-worker-*.log',
        includeLogFileNote = true
    } = options;

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

    const failedAssertions = deduplicatedAssertions.length > 0
        ? `${
            deduplicatedAssertions.map(
                assertion => formatFailedAssertion(
                    assertion, 
                    errorDetails.testPath
                )
            ).join('\n\n')
        }`
        : errorDetails.failedTests.length > 0
            ? `\n${colors.yellow('🚫 Failed Tests:')}\n${
                errorDetails.failedTests.map(
                    test => `   x ${test.name}`
                ).join('\n')
            }`
            : '';

    const browserLogs = verbose && errorDetails.browserLogs.length > 0
        ? `\n${colors.cyan('📝 Browser Logs:')}\n${
            errorDetails.browserLogs.map(log => `   ${log}`).join('\n')
        }`
        : '';

    const browserErrorCount = errorDetails.consoleErrors.length;
    const browserErrors = browserErrorCount > 0
        ? `${colors.red(
            `🚨 ${browserErrorCount} browser error${browserErrorCount === 1 ? '' : 's'}`
        )}${
            verbose
                ? `\n${errorDetails.consoleErrors
                    .map(error => `   ${colors.red(error)}`)
                    .join('\n')}`
                : ''
        }`
        : '';

    const summarySection = verbose ? colors.gray(summary) : '';
    const logFileNote = includeLogFileNote && browserErrorCount > 0
        ? `\n${colors.gray(`🗒 Browser logs: ${logFilePath}`)}`
        : '';

    return `${summarySection}${failedAssertions}${failedAssertions.length ? '\n' : ''}${browserErrors}${browserLogs}${logFileNote}`;
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
function formatStackTrace(stack?: string, testPath?: string): string {
    if (!stack) {
        return '';
    }

    return stack
        .split('\n')
        .map(line => testPath ? line.replace('<anonymous>:', `${testPath}:`) : line)
        .map(line => `     ${line.trim()}`)
        .filter(line => line.trim().length > 0)
        .slice(0, MAX_STACK_TRACE_LINES)
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
        failureTypes.push(`${errorDetails.consoleErrors.length} browser error(s)`);
    }
    
    return `❌ ${testPath}: ${failedCount}/${totalCount} failed - ${failureTypes.join(', ')}`;
}
