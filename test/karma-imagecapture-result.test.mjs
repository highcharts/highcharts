import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
    classifyRunResult,
    classifySpecResult,
    formatRunFailure,
    formatSpecFailure
} from './karma-imagecapture-result.js';

const require = createRequire(import.meta.url);
const imageCapturePlugin = require('./karma-imagecapture-reporter.js');
const ImageCaptureReporter = imageCapturePlugin['reporter:imagecapture'][1];

function createReporter(config) {
    return new ImageCaptureReporter(
        reporter => {
            reporter.onRunComplete = () => {};
        },
        config,
        {
            create: () => ({
                info() {},
                warn() {},
                error() {}
            })
        },
        { on() {} }
    );
}

test('classifies successful and skipped specs', () => {
    assert.deepEqual(classifySpecResult({ success: true }), { type: 'success' });
    assert.deepEqual(classifySpecResult({ skipped: true }), { type: 'skip' });
});

test('classifies generated pixel differences with numeric Actual values', () => {
    assert.deepEqual(
        classifySpecResult({
            log: ['Different pixels\nActual: 42']
        }),
        { type: 'pixel-diff', pixels: 42 }
    );
});

test('does not classify arbitrary numeric assertion failures as pixel differences', () => {
    assert.deepEqual(
        classifySpecResult({ log: ['Expected: 0\nActual: 42'] }),
        { type: 'execution-error' }
    );
});

test('classifies TypeError-like failures as execution errors', () => {
    assert.deepEqual(
        classifySpecResult({
            log: ['TypeError: can\'t access property \'series\', point is undefined']
        }),
        { type: 'execution-error' }
    );
});

test('classifies an empty failure log as an execution error', () => {
    assert.deepEqual(
        classifySpecResult({ log: [] }),
        { type: 'execution-error' }
    );
});

test('formats spec failures with test, browser, and log context', () => {
    assert.equal(
        formatSpecFailure(
            { name: 'ChromeHeadless' },
            { suite: ['stock'], description: 'static-stock', log: ['TypeError'] }
        ),
        'Execution error\nTest: stock static-stock\nBrowser: ChromeHeadless\nLog:\nTypeError\n'
    );
});

test('classifies terminal run outcomes after retry handling', () => {
    assert.deepEqual(
        classifyRunResult({
            success: 1,
            failed: 0,
            error: false,
            disconnected: false,
            exitCode: 0
        }),
        { type: 'success' }
    );
    assert.deepEqual(
        classifyRunResult({ disconnected: true, exitCode: 1 }),
        { type: 'browser-disconnect' }
    );
    assert.deepEqual(
        classifyRunResult({ error: true, exitCode: 1 }),
        { type: 'browser-error' }
    );
    assert.deepEqual(
        classifyRunResult({ failed: 0, exitCode: 1 }),
        { type: 'run-error' }
    );
    assert.deepEqual(
        classifyRunResult({ failed: 1, exitCode: 1 }),
        { type: 'success' }
    );
    assert.deepEqual(
        classifyRunResult({ skipped: 1, exitCode: 1 }),
        { type: 'success' }
    );
});

test('formats terminal browser failures with browser identity', () => {
    assert.equal(
        formatRunFailure(
            [{ id: 'browser-1' }],
            { disconnected: true, exitCode: 1 }
        ),
        'Browser error\nBrowser: browser-1\nLog:\nBrowser disconnected\n'
    );
});

test('writes candidate completion markers but not reference markers', () => {
    const directory = mkdtempSync(join(tmpdir(), 'karma-imagecapture-'));
    const marker = join(directory, 'complete');
    const errors = join(directory, 'errors.log');
    const config = {
        imageCapture: {
            completionOutputPath: marker,
            errorsOutputPath: errors
        },
        referenceRun: false
    };

    try {
        createReporter(config).onRunComplete([], {
            success: 1,
            failed: 0,
            skipped: 0,
            error: false,
            disconnected: false,
            exitCode: 0
        });
        assert.equal(existsSync(marker), true);

        rmSync(marker);
        createReporter({ ...config, referenceRun: true }).onRunComplete([], {
            success: 1,
            failed: 0,
            skipped: 0,
            error: false,
            disconnected: false,
            exitCode: 0
        });
        assert.equal(existsSync(marker), false);

        createReporter(config).onRunComplete([], {
            success: 0,
            failed: 0,
            skipped: 0,
            error: true,
            disconnected: false,
            exitCode: 1
        });
        assert.match(readFileSync(errors, 'utf8'), /Browser error/u);
        assert.equal(existsSync(marker), true);
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
