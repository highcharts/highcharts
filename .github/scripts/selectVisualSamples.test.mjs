import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { selectVisualSamples } from './selectVisualSamples.mjs';

const script = fileURLToPath(new URL('./selectVisualSamples.mjs', import.meta.url));
const repositoryRoot = resolve(dirname(script), '../..');
const require = createRequire(import.meta.url);
const { require: requireTS } = require('tsx/cjs/api');
const { selectVisualSamples: discoverEligibleVisualSamples } = requireTS(
    '../../tests/visual/visual-samples.ts',
    import.meta.url
);
const eligibleSampleIds = discoverEligibleVisualSamples(repositoryRoot)
    .map(sample => sample.id);

test('selects samples for one product in canonical order', () => {
    const selected = selectVisualSamples(['maps']);
    assert.deepEqual(selected, eligibleSampleIds.filter(id => id.startsWith('maps/')));
});

test('selects multiple products and preserves canonical order', () => {
    const selected = selectVisualSamples(['stock', 'highcharts']);
    assert.deepEqual(selected, eligibleSampleIds.filter(id =>
        id.startsWith('stock/') || id.startsWith('highcharts/')
    ));
});

test('deduplicates products and overlapping selections', () => {
    const selected = selectVisualSamples(['stock', 'stock']);
    assert.equal(new Set(selected).size, selected.length);
    assert.deepEqual(selected, eligibleSampleIds.filter(id => id.startsWith('stock/')));
});

test('rejects unknown products', () => {
    assert.throws(() => selectVisualSamples(['widgets']), /Unknown visual sample product/);
});

test('empty product selection returns an empty list', () => {
    assert.deepEqual(selectVisualSamples([]), []);
    assert.deepEqual(JSON.parse(execFileSync(process.execPath, [script], {
        encoding: 'utf8'
    })), []);
});

test('CLI emits selected IDs and rejects unknown input', () => {
    const output = JSON.parse(execFileSync(process.execPath, [
        script, '--products', 'gantt, maps, gantt'
    ], { encoding: 'utf8' }));
    assert.equal(Array.isArray(output), true);
    assert.equal(new Set(output).size, output.length);
    assert.deepEqual(output, eligibleSampleIds.filter(id =>
        id.startsWith('gantt/') || id.startsWith('maps/')
    ));
    assert.throws(() => execFileSync(process.execPath, [script, 'unknown'], {
        encoding: 'utf8',
        stdio: 'pipe'
    }), error => error.status === 1 &&
        error.stderr.includes('Unknown visual sample product: unknown'));
    assert.deepEqual(output.every(id => typeof id === 'string'), true);
});
