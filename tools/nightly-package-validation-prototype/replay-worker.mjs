import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readJSON, retainedEvidenceRoot, verifyReplaySource } from './replay-evidence.mjs';
import { runConsumer } from './run.mjs';

try {
    const identity = readJSON('/replay/identity.json');
    const fixture = '/replay/fixture';
    let root = '/replay/evidence';
    if (existsSync('/replay/validation.zip')) {
        const extracted = mkdtempSync(join(tmpdir(), 'nightly-validation-'));
        execFileSync('unzip', ['-q', '/replay/validation.zip', '-d', extracted]);
        root = retainedEvidenceRoot(extracted, identity.gridPackage);
    }
    const evidence = verifyReplaySource(root, fixture, identity);
    process.exitCode = await runConsumer({ gridPackage: identity.gridPackage, replay: { root, fixture, ...evidence } });
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
