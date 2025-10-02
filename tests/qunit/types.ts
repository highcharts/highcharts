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
        __qunitFailedTests__?: Array<{
            module?: string;
            name: string;
            failures: string[];
        }> | null;
        __qunitFailedAssertions__?: Array<QUnit240LogDetails> | null;
        QUnit: QUnit240;
        Highcharts: unknown;
    }
}