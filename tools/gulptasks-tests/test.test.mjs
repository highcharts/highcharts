import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const gulpPath = fileURLToPath(
    new URL('../../node_modules/gulp/bin/gulp.js', import.meta.url)
);
const rootPath = fileURLToPath(new URL('../..', import.meta.url));

function runTask(...args) {
    const result = spawnSync(
        process.execPath,
        [gulpPath, 'test', '--helpme', ...args],
        { cwd: rootPath, encoding: 'utf8', timeout: 15000 }
    );
    assert.ifError(result.error);
    return { status: result.status, output: result.stdout + result.stderr };
}

for (const flag of ['reference', 'visualcompare']) {
    test(`rejects --${flag} with Playwright visual guidance`, () => {
        const { status, output } = runTask(`--${flag}`);

        assert.notEqual(status, 0);
        assert.match(output, new RegExp(`--${flag}`, 'u'));
        assert.match(output, /npm run test:pw:visual/u);
        assert.match(output, /VISUAL_TEST_REFERENCE=1/u);
    });
}

test('rejects legacy options instead of silently ignoring them', () => {
    for (const args of [
        ['--browsers', 'Firefox'],
        ['--browsercount', '2'],
        ['--splitbrowsers', 'Chrome'],
        ['--debug'],
        ['--tests', 'unit-tests/chart/*'],
        ['--testsAbsolutePath', '/tmp/demo.js'],
        ['--ts'],
        ['--dots'],
        ['--timeout', '5000']
    ]) {
        const { status, output } = runTask(...args);

        assert.notEqual(status, 0, args[0]);
        assert.ok(
            output.includes(`${args[0]} is no longer supported by gulp test.`),
            output
        );
        assert.match(output, /npx playwright test/u);
    }
});

test('help describes supported options and direct Playwright commands', () => {
    const { status, output } = runTask();

    assert.equal(status, 0, output);
    assert.deepEqual(
        output.match(/^--\w+/gmu),
        ['--force', '--modified', '--product', '--speak']
    );
    assert.match(output, /npx playwright test tests\/highcharts\/chart/u);
    assert.match(output, /npm run test:pw:visual/u);
});
