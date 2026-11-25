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

type QUnitStatus = 'passed' | 'failed' | 'skipped' | 'todo';

interface QUnitCounts {
    failed: number;
    passed: number;
    skipped: number;
    todo: number;
    total: number;
}

export interface QUnitTestCounts extends QUnitCounts {
    status: QUnitStatus;
    runtime: number;
}

interface QUnitTestEnd {
    fullName: string[];
    status: QUnitStatus;
    runtime: number;
    errors: {
        actual: unknown;
        expected: unknown;
        message?: string;
        stack?: string;
    }[];
}

interface QUnitEventMap {
    error: unknown;
    testStart: { fullName: string[] };
    testEnd: QUnitTestEnd;
    runEnd: {
        testCounts: QUnitCounts;
        status: QUnitStatus;
        runtime: number;
    };
}

interface BrowserQUnit {
    config: {
        autostart: boolean;
        failOnZeroTests?: boolean;
        testTimeout?: number;
    };
    version: string;
    start(): void;
    on<K extends keyof QUnitEventMap>(
        name: K,
        callback: (details: QUnitEventMap[K]) => void
    ): void;
}

declare global {
    interface Window {
        __qunitResults__?: QUnitTestCounts;
        __qunitFailedTests__?: QUnitFailedTest[];
        __qunitFailedAssertions__?: QUnitFailedAssertion[];
        __qunitBrowserLogs__?: string[];
        __qunitConsoleErrors__?: string[];
        QUnit: BrowserQUnit;
        getFinalQUnitResults(): Promise<QUnitTestCounts>;
    }
}
