import { strictEqual, deepStrictEqual, throws } from 'node:assert';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { load } from 'js-yaml';
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

test('CI manifest covers demos and API samples from all four products', () => {
    const root = join(__dirname, '../../..');
    const samples = selectVisualSamples(root, {
        manifest: 'tests/visual/samples.json'
    });
    deepStrictEqual(samples.map(sample => sample.id).sort(),
        selectVisualSamples(root).map(sample => sample.id).sort());
    for (const demos of [true, false]) {
        const products = samples.filter(sample =>
            (sample.id.split('/')[1] === 'demo') === demos
        ).map(sample => sample.id.split('/')[0]);
        deepStrictEqual([...new Set(products)].sort(),
            ['gantt', 'highcharts', 'maps', 'stock']);
    }
});

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

test('discovery excludes module-only samples that Karma does not load', () => {
    withSamples(root => {
        const dir = join(root, 'samples/highcharts/demo/module-only');
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'demo.mjs'), 'export default {};');
        throws(() => selectVisualSamples(root, {
            filter: 'module-only'
        }), /No eligible Karma/);
    });
});

test('CI selects only samples eligible in both revisions', () => {
    const workflow = load(readFileSync(join(__dirname,
        '../../../.github/workflows/visual-compare-playwright.yml'), 'utf8')) as {
        jobs: { visual_playwright_compare: {
            steps: { name?: string; run?: string }[];
        } };
    };
    const command = workflow.jobs.visual_playwright_compare.steps.find(step =>
        step.name === 'Select comparable visual samples'
    )?.run || '';
    const script = command.split("<<'NODE'\n")[1].replace(/\nNODE\s*$/, '');

    withSamples(root => {
        const modules = {
            'node:fs': { writeFileSync },
            'node:path': { join },
            './tests/visual/visual-samples.ts': { selectVisualSamples },
            './tests/visual/samples.json': [
                'highcharts/demo/area-missing',
                'highcharts/demo/candidate-only',
                'highcharts/demo/manual',
                'highcharts/demo/gauge-clock'
            ]
        };
        runInNewContext(script, {
            require: (name: string) => modules[name],
            process: { cwd: () => root, env: { RUNNER_TEMP: root } },
            console: { log() {} }
        });
        deepStrictEqual(JSON.parse(readFileSync(
            join(root, 'visual-samples.json'), 'utf8'
        )), ['highcharts/demo/area-missing']);
    });
});
