import { strictEqual, deepStrictEqual, throws } from 'node:assert';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { selectVisualSamples } from '../../../tests/visual/visual-samples.ts';
import { getSample } from '../../../tests/utils.ts';

function withSamples(run: (root: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), 'visual-selection-'));
    try {
        for (const [id, details] of [
            ['highcharts/demo/area-missing', 'name: Area'],
            ['highcharts/demo/gauge-clock', 'name: Clock'],
            ['highcharts/demo/manual', 'requiresManualTesting: true'],
            ['stock/demo/skipped', 'skipTest: true'],
            ['gantt/demo/allowed', 'name: Gantt'],
            ['grid-pro/demo/not-a-chart', 'name: Grid']
        ]) {
            const dir = join(root, 'samples', id);
            mkdirSync(dir, { recursive: true });
            writeFileSync(join(dir, 'demo.js'), '');
            writeFileSync(join(dir, 'demo.details'), details);
        }
        run(root);
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
}

test('discovery excludes Karma ignores and manual/skip metadata', () => {
    withSamples(root => {
        deepStrictEqual(selectVisualSamples(root).map(sample => sample.id), [
            'gantt/demo/allowed',
            'highcharts/demo/area-missing'
        ]);
        throws(() => selectVisualSamples(root, {
            filter: 'samples/highcharts/demo/gauge-clock'
        }), /No eligible Karma/);
    });
});

test('manifest preserves exact selection and rejects ignored or missing IDs', () => {
    withSamples(root => {
        const manifest = join(root, 'samples.json');
        const ids = ['highcharts/demo/area-missing', 'gantt/demo/allowed'];
        writeFileSync(manifest, JSON.stringify(ids));
        deepStrictEqual(selectVisualSamples(root, { manifest })
            .map(sample => sample.id), ids);

        for (const id of [
            'highcharts/demo/gauge-clock',
            'highcharts/demo/manual',
            'stock/demo/skipped'
        ]) {
            writeFileSync(manifest, JSON.stringify([id]));
            throws(() => selectVisualSamples(root, { manifest }), /Karma excludes/);
        }
        writeFileSync(manifest, '["highcharts/demo/not-found"]');
        throws(() => selectVisualSamples(root, { manifest }), /not found/);
    });
});

test('selection rejects empty, duplicate and malformed manifests', () => {
    withSamples(root => {
        const manifest = join(root, 'samples.json');
        for (const value of [[], {}, [42], [null], [
            'highcharts/demo/area-missing', 'highcharts/demo/area-missing'
        ]]) {
            writeFileSync(manifest, JSON.stringify(value));
            throws(() => selectVisualSamples(root, { manifest }), /unique sample IDs/);
        }
        writeFileSync(manifest, '{');
        throws(() => selectVisualSamples(root, { manifest }), SyntaxError);
        throws(() => selectVisualSamples(root, {
            manifest, filter: 'area-missing'
        }), /not both/);
    });
});

test('source and generated script produce one sample and filters cannot bypass ignores', () => {
    withSamples(root => {
        writeFileSync(join(root, 'samples/highcharts/demo/area-missing/demo.ts'),
            'const value: number = 1;');
        const samples = selectVisualSamples(root, {
            filter: 'samples/highcharts;gauge-clock'
        });
        strictEqual(samples.length, 1);
        strictEqual(samples[0].id, 'highcharts/demo/area-missing');
        strictEqual(samples[0].path.endsWith('demo.js'), true);
        const sample = getSample(
            dirname(samples[0].path), true, basename(samples[0].path)
        );
        strictEqual(sample.script?.includes('const value: number'), false);
    });
});
