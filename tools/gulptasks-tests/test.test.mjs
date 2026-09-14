import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const taskSource = await readFile(new URL('../gulptasks/test.js', import.meta.url), 'utf8');

for (const flag of ['reference', 'visualcompare']) {
    test(`rejects --${flag} with Playwright guidance`, () => {
        const result = spawnSync(
            'npx',
            ['gulp', 'test', `--${flag}`, '--product', 'Core'],
            { encoding: 'utf8' }
        );
        const output = result.stdout + result.stderr;

        assert.notEqual(result.status, 0);
        assert.match(output, new RegExp(`--${flag}`));
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
