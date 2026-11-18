import { deepEqual, match, ok } from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL(
    '../nightly-package-validation-prototype/summary.mjs', import.meta.url
));

function summarize({ build, validation, checks, evidence, results, setupStep = '', setupError = '' }) {
    const dir = mkdtempSync(join(tmpdir(), 'nightly-package-summary-'));
    const report = join(dir, 'summary.md');
    try {
        const { status, stderr, error } = spawnSync(process.execPath, [script], {
            encoding: 'utf8',
            env: {
                ...process.env,
                BUILD: build,
                CHECKS: checks,
                EVIDENCE: evidence,
                GITHUB_REPOSITORY: 'highcharts/highcharts',
                GITHUB_RUN_ATTEMPT: '2',
                GITHUB_RUN_ID: '12',
                GITHUB_SERVER_URL: 'https://github.com',
                GITHUB_STEP_SUMMARY: report,
                RESULTS: results,
                SETUP_STEP: setupStep,
                SETUP_ERROR: setupError,
                VALIDATION: validation
            }
        });
        ok(!error, error?.message);
        ok(status === 0 || status === 1, stderr);
        return [status, readFileSync(report, 'utf8')];
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
}

test('shows an actionable setup failure before either lane starts', () => {
    const [status, summary] = summarize({
        build: 'success', validation: 'failure', checks: '', evidence: '1234',
        results: '', setupStep: 'Install Chromium',
        setupError: 'Error: Chromium download returned 503\nretry details'
    });
    deepEqual(status, 1);
    ok(summary.includes('validation — blocked'));
    ok(summary.includes('Setup <code>blocked</code> at <code>Install Chromium</code>'));
    ok(summary.includes('<pre>Error: Chromium download returned 503</pre>'));
    ok(summary.includes('Stable <code>unavailable</code>'));
    ok(!summary.includes('retry details'));
});

test('shows the failed lane, stage, and first actionable compiler diagnostic', () => {
    const diagnostic = "app/stock.ts(1,21): error TS2307: Cannot find module 'highcharts/highstock'.";
    const [status, summary] = summarize({
        build: 'success',
        checks: 'failed',
        evidence: '1234',
        results: JSON.stringify({
            control: { outcome: 'passed', stage: 'browser' },
            candidate: {
                outcome: 'failed',
                stage: 'types',
                error: `\x1b[31m${diagnostic}\x1b[0m\nsecond diagnostic`
            }
        }),
        validation: 'failure'
    });
    deepEqual(status, 1);
    match(summary, /Stable <code>passed<\/code> at <code>browser<\/code>/u);
    match(summary, /Candidate <code>failed<\/code> at <code>types<\/code>/u);
    ok(summary.includes(`<pre>${diagnostic}</pre>`));
    ok(!summary.includes('second diagnostic'));
    ok(!summary.includes('\x1b'));
    const links = summary.split(/\r?\n/u).filter(line => line.startsWith('[Validation evidence]('));
    deepEqual(links, [
        '[Validation evidence](https://github.com/highcharts/highcharts/actions/runs/12/artifacts/1234)'
    ]);
});

test('renders diagnostics as text and identifies a lane that never started', () => {
    const [, summary] = summarize({
        build: 'success',
        checks: 'failed',
        evidence: '',
        results: JSON.stringify({
            control: {
                outcome: 'failed',
                stage: 'browser',
                error: 'Expected <svg> & chart data'
            }
        }),
        validation: 'failure'
    });
    ok(summary.includes('<pre>Expected &lt;svg&gt; &amp; chart data</pre>'));
    ok(summary.includes('Candidate <code>unavailable</code>'));
    ok(summary.includes('Validation evidence unavailable'));
});

test('preserves advisory verdicts when validation or evidence is incomplete', () => {
    for (const [build, validation, checks, evidence, expected] of [
        ['success', 'success', 'passed', '1234', 'passed'],
        ['success', 'success', 'passed', '', 'blocked'],
        ['success', 'failure', 'passed', '', 'blocked'],
        ['success', 'failure', 'blocked', '1234', 'blocked'],
        ['success', 'failure', 'failed', '', 'failed'],
        ['success', 'failure', '', '1234', 'blocked'],
        ['failure', 'skipped', '', '', 'blocked'],
        ['success', 'cancelled', '', '', 'blocked']
    ]) {
        const [status, summary] = summarize({
            build, validation, checks, evidence, results: ''
        });
        deepEqual(status, expected === 'passed' ? 0 : 1);
        ok(summary.includes(`validation — ${expected}`));
        ok(summary.includes('Stable <code>unavailable</code>'));
    }
});
