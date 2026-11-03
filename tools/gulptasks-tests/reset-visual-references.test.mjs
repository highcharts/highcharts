import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
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
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const require = createRequire(import.meta.url);
require('tsx/cjs');
const gulp = require('gulp');
const GulpForwardReference = require('undertaker-forward-reference');

gulp.registry(new GulpForwardReference());
require('../gulptasks/dist-testresults.js');

const {
    getVisualSampleIds,
    runVisualReferenceTests
} = require('../gulptasks/reset-visual-references.js');

test('registered reset task renders and uploads after configuration', () => {
    const result = spawnSync(process.execPath, [
        '--import', 'tsx', '--input-type=commonjs', '-e', `
        const assert = require('node:assert/strict');
        const fs = require('node:fs');
        const path = require('node:path');
        const root = fs.mkdtempSync(path.join(require('node:os').tmpdir(),
            'highcharts-reset-series-'));
        const repositoryRoot = process.cwd();
        const samplePath = path.join(root, 'samples/highcharts/demo/basic-line');
        const referencePath = path.join(samplePath, 'reference.svg');
        const calls = [];
        const gulp = require('gulp');
        const processLib = require('./tools/libs/process');
        const yargs = require('yargs');
        const cleanup = () => {
            process.chdir(repositoryRoot);
            fs.rmSync(root, { recursive: true, force: true });
        };
        fs.mkdirSync(samplePath, { recursive: true });
        fs.writeFileSync(path.join(samplePath, 'demo.js'), '');
        fs.writeFileSync(referencePath, '<svg>stale</svg>');
        processLib.exec = async (command, options) => {
            calls.push('render');
            assert.equal(command, 'npm run test:pw:visual');
            assert.equal(fs.existsSync(referencePath), false);
            assert.deepEqual(JSON.parse(fs.readFileSync(
                options.env.VISUAL_TEST_MANIFEST, 'utf8'
            )), ['highcharts/demo/basic-line']);
            fs.writeFileSync(referencePath, '<svg>new</svg>');
        };
        gulp.task('dist-testresults', async () => {
            calls.push('upload');
            assert.equal(fs.readFileSync(referencePath, 'utf8'), '<svg>new</svg>');
        });
        process.chdir(root);
        yargs.parse(['--tests', 'highcharts/demo/basic-line']);
        require(path.join(repositoryRoot, 'tools/gulptasks/reset-visual-references.js'));
        const timeout = setTimeout(() => {
            cleanup();
            throw new Error('Reset task did not signal completion');
        }, 1000);
        gulp.task('reset-visual-references')(error => {
            clearTimeout(timeout);
            try {
                assert.ifError(error);
                assert.deepEqual(calls, ['render', 'upload']);
            } finally {
                cleanup();
            }
        });
        `
    ], {
        cwd: fileURLToPath(new URL('../..', import.meta.url)),
        encoding: 'utf8',
        timeout: 5000
    });

    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('expands sample globs using shared discovery and exclusions', t => {
    const root = mkdtempSync(join(tmpdir(), 'highcharts-visual-reset-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));

    const scripts = [
        'samples/highcharts/demo/line-labels/demo.js',
        'samples/highcharts/demo/line-labels/demo.ts',
        'samples/highcharts/demo/line-skipped/demo.js',
        'samples/highcharts/plotoptions/line-step/demo.js',
        'samples/stock/demo/candles/demo.ts'
    ];

    for (const script of scripts) {
        const scriptPath = join(root, script);
        mkdirSync(dirname(scriptPath), { recursive: true });
        writeFileSync(scriptPath, '');
    }
    writeFileSync(
        join(root, 'samples/highcharts/demo/line-skipped/demo.details'),
        'skipTest: true'
    );

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
    for (const pattern of ['../outside', '/tmp', 'C:/tmp']) {
        assert.throws(() => getVisualSampleIds(pattern, root),
            /Invalid visual sample path/u);
    }
    assert.throws(() => getVisualSampleIds('highcharts/demo/line-skipped', root),
        /No eligible visual samples matched/u);
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

    await assert.rejects(runVisualReferenceTests({
        execute: async () => {
            throw new Error('Render failed');
        },
        manifestPath,
        sampleIds
    }), /Render failed/u);
    assert.equal(existsSync(manifestPath), false);
});
