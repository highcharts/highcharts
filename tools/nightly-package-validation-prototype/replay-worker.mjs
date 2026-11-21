import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readJSON, verifyReplaySource } from './replay-evidence.mjs';
import { runConsumer } from './run.mjs';

try {
    const identity = readJSON('/replay/identity.json');
    const fixture = '/replay/fixture';
    let root = '/replay/evidence';
    if (existsSync('/replay/validation.zip')) {
        const extracted = mkdtempSync(join(tmpdir(), 'nightly-validation-'));
        execFileSync('unzip', ['-q', '/replay/validation.zip', '-d', extracted]);
        const prefix = identity.gridLite ? 'grid-lite-package-prototype-' : 'highcharts-package-prototype-';
        const roots = readdirSync(extracted, { withFileTypes: true }).filter(
            entry => entry.isDirectory() && entry.name.startsWith(prefix)
        );
        assert.equal(roots.length, 1, 'Retained consumer results directory unavailable or ambiguous');
        root = join(extracted, roots[0].name);
    }
    const evidence = verifyReplaySource(root, fixture, identity);
    process.exitCode = await runConsumer({ gridLite: identity.gridLite, replay: { root, fixture, ...evidence } });
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
