import { deepStrictEqual, strictEqual, match } from 'node:assert';
import { test } from 'node:test';
import {
    existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type {
    FullConfig, FullResult, Suite, TestCase
} from '@playwright/test/reporter';
import VisualReporter from '../../../tests/visual/visual-reporter.ts';
import {
    recordCandidateResult, writeReference
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
