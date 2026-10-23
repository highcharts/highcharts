import assert from 'node:assert/strict';
import {
    appendFileSync,
    existsSync,
    mkdtempSync,
    readFileSync,
    writeFileSync,
    rmSync
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { main, runVisualCompare } = require('./runVisualCompare.js');

function temporaryPaths() {
    const directory = mkdtempSync(join(tmpdir(), 'visual-compare-'));
    return {
        directory,
        completionPath: join(directory, 'complete'),
        errorPath: join(directory, 'errors.log')
    };
}

function runWithFakeChild(child) {
    const paths = temporaryPaths();
    try {
        const result = runVisualCompare('Highcharts', 'highcharts/*/*', {
            completionPath: paths.completionPath,
            errorPath: paths.errorPath,
            runChild: child
        });
        return { ...paths, result };
    } catch (error) {
        rmSync(paths.directory, { recursive: true, force: true });
        throw error;
    }
}

test('rejects missing and extra CLI arguments', () => {
    assert.equal(main([]), 1);
    assert.equal(main(['Highcharts']), 1);
    assert.equal(main(['Highcharts', 'highcharts/*/*', 'extra']), 1);
});

test('runs the exact Karma command with inherited stdio', () => {
    let invocation;
    const result = runWithFakeChild((...args) => {
        invocation = args;
    });

    assert.equal(result.result, 0);
    assert.equal(invocation[0], process.execPath);
    assert.deepEqual(invocation[1], [
        require.resolve('karma/bin/karma'),
        'start',
        'test/karma-conf.js',
        '--tests',
        'highcharts/*/*',
        '--ts',
        '--single-run',
        '--browsercount',
        '2',
        '--visualcompare'
    ]);
    assert.deepEqual(invocation[2], { stdio: 'inherit' });
    rmSync(result.directory, { recursive: true, force: true });
});

test('removes a stale marker and accepts a fresh marker', () => {
    const paths = temporaryPaths();
    writeFileSync(paths.completionPath, 'stale');
    try {
        const result = runVisualCompare('Stock', 'stock/*/*', {
            ...paths,
            runChild: () => {
                assert.equal(existsSync(paths.completionPath), false);
                writeFileSync(paths.completionPath, 'fresh');
            }
        });
        assert.equal(result, 0);
        assert.equal(existsSync(paths.errorPath), false);
    } finally {
        rmSync(paths.directory, { recursive: true, force: true });
    }
});

test('records missing completion after a nonzero child result', () => {
    const result = runWithFakeChild(() => ({ status: 1 }));
    assert.equal(result.result, 0);
    assert.equal(
        readFileSync(result.errorPath, 'utf8'),
        'Highcharts candidate run did not reach image-capture reporter completion.\n'
    );
    rmSync(result.directory, { recursive: true, force: true });
});

test('records spawn failures and continues', () => {
    const result = runWithFakeChild(() => {
        throw new Error('spawn failed');
    });
    assert.equal(result.result, 0);
    assert.match(
        readFileSync(result.errorPath, 'utf8'),
        /Highcharts candidate run did not reach image-capture reporter completion/u
    );
    rmSync(result.directory, { recursive: true, force: true });
});

test('appends product-specific errors without overwriting existing errors', () => {
    const paths = temporaryPaths();
    appendFileSync(paths.errorPath, 'existing error\n');
    try {
        assert.equal(
            runVisualCompare('Maps', 'maps/*/*', {
                ...paths,
                runChild() {}
            }),
            0
        );
        assert.equal(
            readFileSync(paths.errorPath, 'utf8'),
            'existing error\nMaps candidate run did not reach image-capture reporter completion.\n'
        );
    } finally {
        rmSync(paths.directory, { recursive: true, force: true });
    }
});
