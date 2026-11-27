import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { gridPackages } from './package-evidence.mjs';
import { hash, retainedEvidenceRoot } from './replay-evidence.mjs';
import { runReplay } from './replay-isolation.mjs';

const usage = 'Usage: node replay.mjs <run-id> <attempt> [--package grid-lite|grid-pro] [--artifact <extracted-artifact-directory>]';
if (process.argv[2] === '--help') {
    console.log(usage);
    process.exit(0);
}

function api(path) {
    return JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8' }));
}

function download(root, runId, attempt, name) {
    const repository = 'repos/highcharts/highcharts/actions';
    const run = api(`${repository}/runs/${runId}/attempts/${attempt}`);
    assert.equal(String(run.id), runId, 'GitHub returned a different run ID');
    assert.equal(String(run.run_attempt), attempt, 'GitHub returned a different run attempt');
    assert.equal(run.path.split('@')[0], '.github/workflows/nightly.yml', 'Run is not Nightly');
    const { artifacts } = api(`${repository}/runs/${runId}/artifacts?name=${name}`);
    const artifact = artifacts.find(artifact => artifact.name === name);
    assert(artifact, `Evidence ${name} unavailable for run ${runId}; it may be expired or was never uploaded`);
    assert(!artifact.expired, `Evidence ${name} has expired`);
    assert(/^sha256:[a-f0-9]{64}$/u.test(artifact.digest), 'GitHub artifact digest unavailable');

    const archive = join(root, 'validation.zip');
    const fd = openSync(archive, 'wx');
    try {
        execFileSync('gh', ['api', `${repository}/artifacts/${artifact.id}/zip`], {
            stdio: ['ignore', fd, 'inherit']
        });
    } finally {
        closeSync(fd);
    }
    assert.equal(`sha256:${hash(archive)}`, artifact.digest, 'GitHub artifact digest mismatch');
    return { archive, sourceSha: run.head_sha };
}

let staging;
try {
    const { positionals, values } = parseArgs({
        allowPositionals: true,
        options: {
            package: { type: 'string' }, artifact: { type: 'string' }
        }
    });
    const [runId, attempt] = positionals;
    const gridPackage = values.package;
    assert(positionals.length === 2 && /^[1-9]\d*$/u.test(runId) && /^[1-9]\d*$/u.test(attempt) &&
        (gridPackage === undefined || gridPackages.includes(gridPackage)) && values.artifact !== '', usage);
    let input;
    if (values.artifact) {
        input = { evidence: retainedEvidenceRoot(resolve(values.artifact), gridPackage) };
    } else {
        staging = mkdtempSync(join(tmpdir(), 'highcharts-nightly-replay-'));
        const artifactName = `nightly-${gridPackage ?? 'package'}-validation-${attempt}`;
        input = download(staging, runId, attempt, artifactName);
        assert(/^[0-9a-f]{40}$/u.test(input.sourceSha), 'GitHub run source SHA unavailable');
    }
    process.exitCode = runReplay({ ...input, runId, attempt, gridPackage });
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    if (staging) {
        rmSync(staging, { recursive: true, force: true });
    }
}
