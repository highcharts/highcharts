/**
 * Output configuration utilities for QUnit test reporting
 */

export interface OutputConfig {
    verbose: boolean;
}

/**
 * Get output configuration from environment variables and command line flags
 */
export function getOutputConfig(): OutputConfig {
    // Check for verbose flag in various ways:
    // 1. Environment variable QUNIT_VERBOSE
    // 2. Process arguments --verbose
    // 3. Process arguments -v
    const isVerbose =
        process.env.QUNIT_VERBOSE === 'true' ||
        process.argv.includes('--verbose') ||
        process.argv.includes('-v') ||
        process.env.PLAYWRIGHT_VERBOSE === 'true';

    return {
        verbose: isVerbose
    };
}

/**
 * Format test name for display
 */
function formatTestName(testPath: string): string {
    const parts = testPath.split('/');
    const fileName = parts.pop() || testPath;
    const parentDir = parts.length > 0 ? parts[parts.length - 1] : '';

    if (parentDir && parentDir !== 'unit-tests') {
        return `${parentDir}/${fileName}`;
    }

    return fileName;
}

/**
 * Create detailed output for passed tests in verbose mode
 */
export function createVerbosePassedOutput(
    testPath: string, 
    total: number, 
    timing?: number
): string {
    const testName = formatTestName(testPath);
    let output = `✅ ${testName}: All ${total} tests passed`;

    if (timing !== undefined) {
        output += ` (${timing}ms)`;
    }

    return output;
}
