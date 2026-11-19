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
const passedLane = { outcome: 'passed', stage: 'browser' };
const passedReport = {
    verdict: 'passed',
    provenance: 'nightly',
    runId: '12',
    attempt: '2',
    control: passedLane,
    candidate: passedLane
};

function summarize({ build, validation, checks, evidence, results, setupStep = '', setupError = '', gridLite = false }) {
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
                GRID_LITE: String(gridLite),
                GRID_LITE_MISSING_CSS: String(gridLite),
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

test('labels the Grid Lite synthetic failure and names the missing import', () => {
    const diagnostic = 'Could not resolve @highcharts/grid-lite/css/grid-lite.css';
    const [status, summary] = summarize({
        build: 'success', validation: 'failure', checks: 'failed', evidence: '1234', gridLite: true,
        results: JSON.stringify({
            control: { outcome: 'passed', stage: 'browser' },
            candidate: { outcome: 'failed', stage: 'bundle', error: diagnostic }
        })
    });
    deepEqual(status, 1);
    ok(summary.includes('Nightly Grid Lite npm package validation — failed'));
    ok(summary.includes('Synthetic candidate with `css/grid-lite.css` removed.'));
    match(summary, /Stable <code>passed<\/code> at <code>browser<\/code>/u);
    match(summary, /Candidate <code>failed<\/code> at <code>bundle<\/code>/u);
    ok(summary.includes(`<pre>${diagnostic}</pre>`));
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
        ['success', 'failure', 'passed', '1234', 'blocked'],
        ['success', 'failure', 'blocked', '1234', 'blocked'],
        ['success', 'success', '', '1234', 'blocked'],
        ['failure', 'success', 'passed', '1234', 'blocked'],
        ['success', 'cancelled', '', '', 'blocked']
    ]) {
        const [status, summary] = summarize({
            build, validation, checks, evidence, results: JSON.stringify(passedReport)
        });
        deepEqual(status, expected === 'passed' ? 0 : 1);
        ok(summary.includes(`validation — ${expected}`));
    }
});

for (const [product, gridLite] of [['Highcharts', false], ['Grid Lite', true]]) {
    test(`${product} requires a complete passing report`, () => {
        const input = { build: 'success', validation: 'success', checks: 'passed', evidence: '1234', gridLite };
        const [passedStatus, passedSummary] = summarize({ ...input, results: JSON.stringify(passedReport) });
        deepEqual(passedStatus, 0);
        ok(passedSummary.includes('validation — passed'));

        const { provenance, ...unboundReport } = passedReport;
        for (const [label, results] of [
            ['missing report', ''],
            ['invalid JSON', '{'],
            ['wrong report type', '[]'],
            ['missing result verdict', JSON.stringify({ provenance, control: passedLane, candidate: passedLane })],
            ['missing nightly provenance', JSON.stringify(unboundReport)],
            ['tarball-only provenance', JSON.stringify({ ...passedReport, provenance: 'tarball-only' })],
            ['missing run ID', JSON.stringify({ ...passedReport, runId: null })],
            ['invalid attempt', JSON.stringify({ ...passedReport, attempt: '0' })],
            ['missing stable lane', JSON.stringify({ verdict: 'passed', provenance, candidate: passedLane })],
            ['missing candidate lane', JSON.stringify({ verdict: 'passed', provenance, control: passedLane })],
            ['incomplete stable lane', JSON.stringify({ ...passedReport, control: { outcome: 'passed' } })],
            ['unfinished candidate', JSON.stringify({ ...passedReport, candidate: { ...passedLane, stage: 'bundle' } })],
            ['invalid candidate outcome', JSON.stringify({ ...passedReport, candidate: { ...passedLane, outcome: true } })],
            ['blocked lane', JSON.stringify({ ...passedReport, candidate: { ...passedLane, outcome: 'blocked' } })],
            ['passing lane with an error', JSON.stringify({ ...passedReport, candidate: { ...passedLane, error: 'Missing case' } })],
            ['blocked report verdict', JSON.stringify({ ...passedReport, verdict: 'blocked' })]
        ]) {
            const [status, summary] = summarize({ ...input, results });
            deepEqual(status, 1, label);
            ok(summary.includes('validation — blocked'), label);
            ok(summary.includes('Consumer report is incomplete or inconsistent.'), label);
        }
    });

    test(`${product} preserves a reported failure when other evidence is unavailable or inconsistent`, () => {
        const input = { build: 'success', validation: 'failure', checks: '', evidence: '', gridLite };
        const failedLane = { outcome: 'failed', stage: 'browser', error: 'Consumer assertion failed' };
        for (const override of [
            { checks: 'failed', results: '{' },
            { results: JSON.stringify({ verdict: 'failed' }) },
            { results: JSON.stringify({ control: failedLane }) },
            { results: JSON.stringify({ verdict: 'failed', provenance: 'tarball-only', candidate: failedLane }) },
            {
                checks: 'passed',
                evidence: '1234',
                results: JSON.stringify({ ...passedReport, candidate: failedLane }),
                validation: 'success'
            }
        ]) {
            const [status, summary] = summarize({ ...input, ...override });
            deepEqual(status, 1);
            ok(summary.includes('validation — failed'));
        }
    });
}

test('blocks a passing report when workflow setup failed', () => {
    for (const setup of [{ setupStep: 'Install Chromium' }, { setupError: 'Chromium download failed' }]) {
        const [status, summary] = summarize({
            build: 'success',
            validation: 'success',
            checks: 'passed',
            evidence: '1234',
            results: JSON.stringify(passedReport),
            ...setup
        });
        deepEqual(status, 1);
        ok(summary.includes('validation — blocked'));
    }
});

test('identifies outputs from an earlier attempt without giving the retry a consumer verdict', () => {
    for (const [checks, validation] of [['passed', 'success'], ['failed', 'failure']]) {
        const results = JSON.stringify({
            ...passedReport,
            attempt: '1',
            verdict: checks,
            candidate: { ...passedLane, outcome: checks }
        });
        const [status, summary] = summarize({
            build: 'success',
            validation,
            checks,
            evidence: '1234',
            results
        });
        deepEqual(status, 1);
        ok(summary.includes('validation — blocked'));
        ok(summary.includes('Run 12, attempt 2'));
        ok(summary.includes('Consumer results are from run 12, attempt 1.'));
        ok(summary.includes(`Candidate <code>${checks}</code>`));
        ok(summary.includes('[Validation evidence from run 12, attempt 1]('));
    }
});

test('rejects a passing report from a different run', () => {
    const [status, summary] = summarize({
        build: 'success',
        validation: 'success',
        checks: 'passed',
        evidence: '1234',
        results: JSON.stringify({ ...passedReport, runId: '34' })
    });
    deepEqual(status, 1);
    ok(summary.includes('validation — blocked'));
    ok(summary.includes('Consumer results are from run 34, attempt 2.'));
});
