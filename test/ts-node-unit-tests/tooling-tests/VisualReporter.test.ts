import { deepStrictEqual, strictEqual, match } from 'node:assert';
import { test } from 'node:test';
import {
    existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type {
    FullConfig, FullResult, Suite, TestCase, WorkerInfo
} from '@playwright/test/reporter';
import VisualReporter from '../../../tests/visual/visual-reporter.ts';
import {
    appendError, recordCandidateResult, writeReference
} from '../../../tests/visual/visual-results.ts';

const ids = ['highcharts/demo/area-missing', 'highcharts/demo/line-labels'];
const passed = { status: 'passed' } as FullResult;

function withReporter(
    run: (root: string, reporter: VisualReporter, cases: TestCase[]) => void,
    referenceMode = false
): void {
    const root = mkdtempSync(join(tmpdir(), 'visual-reporter-'));
    try {
        const cases = ids.map(title => ({
            title,
            annotations: [],
            location: { file: join(root, 'tests/visual/visual.spec.ts') },
            results: [{ status: 'passed' }]
        } as TestCase));
        const reporter = new VisualReporter({ root, referenceMode });
        reporter.onBegin({} as FullConfig, {
            allTests: () => cases
        } as Suite);
        for (const id of ids) {
            writeReference(root, id, '<svg/>');
        }
        mkdirSync(join(root, 'test'), { recursive: true });
        writeFileSync(join(root, 'test/visual-test-complete'), 'stale');
        run(root, reporter, cases);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
}

test('reporter resets once and completes only after every candidate result', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
        recordCandidateResult(root, ids[0], 0);
        reporter.onTestBegin(cases[1]);
        recordCandidateResult(root, ids[1], 0);
        strictEqual(reporter.onEnd(passed), undefined);
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), true);
        deepStrictEqual(JSON.parse(readFileSync(
            join(root, 'test/visual-test-results.json'), 'utf8'
        )), Object.fromEntries(ids.map(id => [id, 0])));
    });
});

test('listing tests does not clear references or create completion', () => {
    withReporter((root, reporter) => {
        strictEqual(reporter.onEnd(passed), undefined);
        strictEqual(readFileSync(
            join(root, 'test/visual-test-complete'), 'utf8'
        ), 'stale');
        for (const id of ids) {
            strictEqual(readFileSync(
                join(root, 'samples', id, 'reference.svg'), 'utf8'
            ), '<svg/>');
        }
    }, true);
});

test('interrupted run cannot reuse stale completion', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        recordCandidateResult(root, ids[0], 0);
        deepStrictEqual(reporter.onEnd({ status: 'interrupted' } as FullResult), {
            status: 'failed'
        });
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
        match(readFileSync(join(root, 'test/visual-test-errors.log'), 'utf8'),
            /did not finish every sample/);
    });
});

test('missing candidate result fails even when Playwright reports passing', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        recordCandidateResult(root, ids[0], 0);
        deepStrictEqual(reporter.onEnd(passed), { status: 'failed' });
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
    });
});

test('skipped sample fails even with a complete results file', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        for (const id of ids) {
            recordCandidateResult(root, id, 0);
        }
        cases[1].results[0].status = 'skipped';
        deepStrictEqual(reporter.onEnd(passed), { status: 'failed' });
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
    });
});

test('successful reference run requires fresh files and omits candidate completion', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        for (const id of ids) {
            strictEqual(existsSync(join(root, 'samples', id, 'reference.svg')), false);
            writeReference(root, id, '<svg/>');
        }
        strictEqual(reporter.onEnd(passed), undefined);
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
    }, true);
});

for (const status of ['failed', 'timedOut'] as const) {
    test(`completed run with a ${status} sample retains its error classification`, () => {
        withReporter((root, reporter, cases) => {
            reporter.onTestBegin(cases[0]);
            recordCandidateResult(root, ids[0], 0);
            reporter.onTestBegin(cases[1]);
            cases[1].results[0].status = status;
            cases[1].annotations.push({ type: 'visual-sample-error' });
            appendError(root, 'Sample script failed.');

            deepStrictEqual(reporter.onEnd({ status: 'failed' } as FullResult), {
                status: 'failed'
            });
            strictEqual(existsSync(join(root, 'test/visual-test-complete')), true);
            strictEqual(readFileSync(join(root, 'test/visual-test-errors.log'), 'utf8'),
                'Sample script failed.\n');
        });
    });
}

test('a run where every sample fails still completes without numeric results', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        for (const entry of cases) {
            entry.results[0].status = 'failed';
            entry.annotations.push({ type: 'visual-sample-error' });
            appendError(root, `Sample ${entry.title} failed.`);
        }
        deepStrictEqual(reporter.onEnd({ status: 'failed' } as FullResult), {
            status: 'failed'
        });
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), true);
        strictEqual(existsSync(join(root, 'test/visual-test-results.json')), false);
    });
});

test('fixture or browser failure cannot be treated as a completed sample error', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        recordCandidateResult(root, ids[0], 0);
        cases[1].results[0].status = 'failed';
        deepStrictEqual(reporter.onEnd({ status: 'failed' } as FullResult), {
            status: 'failed'
        });
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
    });
});

test('a global runner error prevents completion after all samples finish', () => {
    withReporter((root, reporter, cases) => {
        reporter.onTestBegin(cases[0]);
        for (const id of ids) {
            recordCandidateResult(root, id, 0);
        }
        reporter.onError({ message: 'Worker crashed.' });
        deepStrictEqual(reporter.onEnd({ status: 'failed' } as FullResult), {
            status: 'failed'
        });
        strictEqual(existsSync(join(root, 'test/visual-test-complete')), false);
        match(readFileSync(join(root, 'test/visual-test-errors.log'), 'utf8'),
            /Worker crashed/);
    });
});

for (const project of ['visual', 'qunit']) {
    test(`worker errors from ${project} only affect completion for visual`, () => {
        withReporter((root, reporter, cases) => {
            reporter.onTestBegin(cases[0]);
            for (const id of ids) {
                recordCandidateResult(root, id, 0);
            }
            reporter.onError({ message: 'Worker crashed.' }, {
                project: { name: project }
            } as WorkerInfo);
            deepStrictEqual(
                reporter.onEnd({ status: 'failed' } as FullResult),
                project === 'visual' ? { status: 'failed' } : undefined
            );
            strictEqual(
                existsSync(join(root, 'test/visual-test-complete')),
                project !== 'visual'
            );
        });
    });
}
