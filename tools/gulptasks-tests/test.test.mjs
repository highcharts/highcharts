import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const taskSource = readFileSync(
    new URL('../gulptasks/test.js', import.meta.url),
    'utf8'
);
const resetTaskSource = readFileSync(
    new URL('../gulptasks/reset-visual-references.js', import.meta.url),
    'utf8'
);
const gulpPath = fileURLToPath(
    new URL('../../node_modules/gulp/bin/gulp.js', import.meta.url)
);
const rootPath = fileURLToPath(new URL('../..', import.meta.url));

for (const flag of ['reference', 'visualcompare']) {
    test(`rejects --${flag} with Playwright guidance`, () => {
        const result = spawnSync(
            process.execPath,
            [gulpPath, 'test', `--${flag}`, '--product', 'Core'],
            { cwd: rootPath, encoding: 'utf8' }
        );
        const output = result.stdout + result.stderr;

        assert.notEqual(result.status, 0);
        assert.match(output, new RegExp(`--${flag}`, 'u'));
        assert.match(output, /npm run test:pw:visual/u);
        assert.match(output, /VISUAL_TEST_REFERENCE=1/u);
    });
}

test('rejects retired flags before any ordinary test routing', () => {
    assert.doesNotMatch(taskSource, /karma/u);
});

test('keeps Playwright unit-test routing and filters', () => {
    assert.match(taskSource, /npx playwright test/u);
    assert.match(taskSource, /argv\.modified/u);
    assert.match(taskSource, /argv\.product/u);
    assert.match(taskSource, /productTests/u);
});

test('registers Playwright reference generation before uploading', () => {
    assert.match(
        resetTaskSource,
        /gulp\.series\(\s*configureVisualTestRun,\s*runVisualReferenceTests,\s*'dist-testresults'/u
    );
});
