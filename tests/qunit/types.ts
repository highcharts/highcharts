/**
 * QUnit 2.4.0 TypeScript type definitions
 * 
 * These types are specifically tailored for QUnit 2.4.0 API compatibility
 * and provide proper typing for the QUnit test runner integration.
 */

export interface QUnit240TestDoneDetails {
    name: string;
    module?: string;
    failed: number;
    passed: number;
    total: number;
    runtime: number;
    errors?: unknown[];
    assertions?: unknown[];
}

export interface QUnit240LogDetails {
    result: boolean;
    actual: unknown;
    expected: unknown;
    message: string;
    source?: string;
    module?: string;
    name?: string;
    runtime?: number;
}

export interface QUnitFailedTest {
    module?: string;
    name: string;
    failures: string[];
    runtime: number;
    source?: string;
    stack?: string;
}

export interface QUnitFailedAssertion {
    module?: string;
    name: string;
    message: string;
    actual: unknown;
    expected: unknown;
    source?: string;
    stack?: string;
    runtime: number;
    result: boolean;
}

export interface QUnitErrorDetails {
    testPath: string;
    qunitResults: QUnitTestCounts;
    failedTests: QUnitFailedTest[];
    failedAssertions: QUnitFailedAssertion[];
    browserLogs: string[];
    consoleErrors: string[];
    timing: {
        scriptLoad: number;
        testExecution: number;
        total: number;
    };
}

export interface QUnit240TestCounts {
    failed: number;
    passed: number;
    total: number;
}

export interface QUnit240DoneDetails {
    failed: number;
    passed: number;
    total: number;
    runtime: number;
}

export interface QUnit240 {
    done(callback: (details: QUnit240DoneDetails) => void): void;
    testDone(callback: (details: QUnit240TestDoneDetails) => void): void;
    log(callback: (details: QUnit240LogDetails) => void): void;
    testStart(callback: () => void): void;
}

export type QUnitTestCounts = QUnit240TestCounts;

declare global {
    interface Window {
        __qunitResults__?: QUnitTestCounts | null;
        __qunitFailedTests__?: QUnitFailedTest[] | null;
        __qunitFailedAssertions__?: QUnitFailedAssertion[] | null;
        __qunitErrorDetails__?: QUnitErrorDetails | null;
        __qunitBrowserLogs__?: string[] | null;
        __qunitConsoleErrors__?: string[] | null;
        QUnit: QUnit240;
        Highcharts: unknown;
    }
}
