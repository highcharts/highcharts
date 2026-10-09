import { deepStrictEqual, strictEqual, match } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = join(process.cwd(), '.github/scripts/collectReferenceFailures.js');

function runWithLog(log?: string, referenceFailed = false) {
    const root = mkdtempSync(join(tmpdir(), 'reference-failures-'));
    const logPath = join(root, 'errors.log');
    const outputPath = join(root, 'failures.json');
    if (log !== undefined) {
        writeFileSync(logPath, log);
    }
    const result = spawnSync(process.execPath, [
        script, '--log', logPath, '--output', outputPath,
        ...(referenceFailed ? ['--reference-failed'] : [])
    ], { encoding: 'utf8' });
    return { root, outputPath, result };
}

test('per-spec failures are collected, sorted, and deduplicated', () => {
    const run = runWithLog('Execution error\nTest: highcharts/demo/zeta\nBrowser: Chrome\nLog:\nOops\nExecution error\nTest: highcharts/demo/alpha\nBrowser: Chrome\nLog:\nOops\n');
    try {
        strictEqual(run.result.status, 0);
        deepStrictEqual(JSON.parse(readFileSync(run.outputPath, 'utf8')), [
            { sample: 'highcharts/demo/alpha', error: 'Execution error' },
            { sample: 'highcharts/demo/zeta', error: 'Execution error' }
        ]);
    } finally { rmSync(run.root, { recursive: true, force: true }); }
});

test('terminal errors fail the collector', () => {
    const run = runWithLog('Browser error\nBrowser: Chrome\nLog:\nBrowser disconnected\n');
    try { strictEqual(run.result.status, 1); } finally { rmSync(run.root, { recursive: true, force: true }); }
});

for (const details of ['Log:\nOops', 'Test: unknown-sample\nLog:\nOops']) {
    test(`unparseable execution error fails alongside a listed sample: ${details}`, () => {
        const run = runWithLog(`Execution error\nTest: highcharts/demo/alpha\nLog:\nOops\nExecution error\n${details}\n`, true);
        try {
            strictEqual(run.result.status, 1);
            match(run.result.stderr, /::error::Reference run failed/);
            deepStrictEqual(JSON.parse(readFileSync(run.outputPath, 'utf8')), [
                { sample: 'highcharts/demo/alpha', error: 'Execution error' }
            ]);
        } finally { rmSync(run.root, { recursive: true, force: true }); }
    });
}

test('failed reference run without parsed sample failures fails even for missing log', () => {
    const run = runWithLog(undefined, true);
    try { strictEqual(run.result.status, 1); } finally { rmSync(run.root, { recursive: true, force: true }); }
});

test('no failures succeeds and omits the output', () => {
    const run = runWithLog('');
    try {
        strictEqual(run.result.status, 0);
        strictEqual(existsSync(run.outputPath), false);
    } finally { rmSync(run.root, { recursive: true, force: true }); }
});
