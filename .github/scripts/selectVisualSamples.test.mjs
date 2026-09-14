import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { selectVisualSamples } from './selectVisualSamples.mjs';

const script = fileURLToPath(new URL('./selectVisualSamples.mjs', import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(
    dirname(script), '../../tests/visual/samples.json'
), 'utf8'));

test('selects samples for one product in canonical order', () => {
    const selected = selectVisualSamples(['maps']);
    assert.deepEqual(selected, manifest.filter(id => id.startsWith('maps/')));
});

test('selects multiple products and preserves canonical order', () => {
    const selected = selectVisualSamples(['stock', 'highcharts']);
    assert.deepEqual(selected, manifest.filter(id =>
        id.startsWith('stock/') || id.startsWith('highcharts/')
    ));
});

test('deduplicates products and overlapping selections', () => {
    const selected = selectVisualSamples(['stock', 'stock']);
    assert.equal(new Set(selected).size, selected.length);
    assert.deepEqual(selected, manifest.filter(id => id.startsWith('stock/')));
});

test('rejects unknown products', () => {
    assert.throws(() => selectVisualSamples(['widgets']), /Unknown visual sample product/);
});

test('empty selection is an explicit empty manifest', () => {
    assert.deepEqual(selectVisualSamples([]), []);
    assert.deepEqual(JSON.parse(execFileSync(process.execPath, [script], {
        encoding: 'utf8'
    })), []);
});

test('CLI emits the manifest schema and rejects unknown input', () => {
    const output = JSON.parse(execFileSync(process.execPath, [
        script, '--products', 'gantt, maps, gantt'
    ], { encoding: 'utf8' }));
    assert.equal(Array.isArray(output), true);
    assert.equal(new Set(output).size, output.length);
    assert.deepEqual(output, manifest.filter(id =>
        id.startsWith('gantt/') || id.startsWith('maps/')
    ));
    assert.throws(() => execFileSync(process.execPath, [script, 'unknown'], {
        encoding: 'utf8',
        stdio: 'pipe'
    }), error => error.status === 1 &&
        error.stderr.includes('Unknown visual sample product: unknown'));
    assert.deepEqual(output.every(id => typeof id === 'string'), true);
});
