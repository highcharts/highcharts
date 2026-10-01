import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const gulp = require('gulp');
const GulpForwardReference = require('undertaker-forward-reference');

gulp.registry(new GulpForwardReference());
require('../gulptasks/dist-testresults.js');

const {
    getVisualSampleIds,
    runVisualReferenceTests
} = require('../gulptasks/reset-visual-references.js');

test('expands comma-separated sample globs to Playwright sample IDs', t => {
    const root = mkdtempSync(join(tmpdir(), 'highcharts-visual-reset-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));

    const scripts = [
        'samples/highcharts/demo/line-labels/demo.js',
        'samples/highcharts/plotoptions/line-step/demo.js',
        'samples/stock/demo/candles/demo.ts'
    ];

    for (const script of scripts) {
        const scriptPath = join(root, script);
        mkdirSync(dirname(scriptPath), { recursive: true });
        writeFileSync(scriptPath, '');
    }

    assert.deepEqual(
        getVisualSampleIds(
            'highcharts/*/line-*, samples/stock/demo/candles',
            root
        ),
        [
            'highcharts/demo/line-labels',
            'highcharts/plotoptions/line-step',
            'stock/demo/candles'
        ]
    );
});

test('runs Playwright in reference mode with an exact manifest', async t => {
    const root = mkdtempSync(join(tmpdir(), 'highcharts-visual-reset-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));

    const manifestPath = join(root, 'visual-samples.json');
    const sampleIds = ['highcharts/demo/line-labels'];
    let calls = 0;

    await runVisualReferenceTests({
        execute: async (command, options) => {
            calls++;
            assert.equal(command, 'npm run test:pw:visual');
            assert.equal(options.env.VISUAL_TEST_REFERENCE, '1');
            assert.equal(options.env.VISUAL_TEST_PATH, '');
            assert.equal(options.env.VISUAL_TEST_MANIFEST, manifestPath);
            assert.deepEqual(
                JSON.parse(readFileSync(manifestPath, 'utf8')),
                sampleIds
            );
        },
        manifestPath,
        sampleIds
    });

    assert.equal(calls, 1);
    assert.equal(existsSync(manifestPath), false);
});
