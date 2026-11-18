import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { closeSync, mkdirSync, mkdtempSync, openSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { hash, verifyReplay } from './replay-evidence.mjs';

const usage = 'Usage: node replay.mjs <run-id> <attempt> [--package grid-lite] [--artifact <extracted-artifact-directory>]';
if (process.argv[2] === '--help') {
    console.log(usage);
    process.exit(0);
}

function api(path) {
    return JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8' }));
}

function download(runId, attempt, name) {
    const repository = 'repos/highcharts/highcharts/actions';
    const run = api(`${repository}/runs/${runId}/attempts/${attempt}`);
    assert.equal(String(run.run_attempt), attempt, 'GitHub returned a different run attempt');
    assert.equal(run.path.split('@')[0], '.github/workflows/nightly.yml', 'Run is not Nightly');
    const { artifacts } = api(`${repository}/runs/${runId}/artifacts?name=${name}`);
    const artifact = artifacts.find(artifact => artifact.name === name);
    assert(artifact, `Evidence ${name} unavailable for run ${runId}; it may be expired or was never uploaded`);
    assert(!artifact.expired, `Evidence ${name} has expired`);
    assert(artifact.digest?.startsWith('sha256:'), 'GitHub artifact digest unavailable');

    const root = mkdtempSync(join(tmpdir(), 'highcharts-nightly-replay-'));
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
    const extracted = join(root, 'evidence');
    mkdirSync(extracted);
    execFileSync('unzip', ['-q', archive, '-d', extracted]);
    return { extracted, sourceSha: run.head_sha };
}

try {
    const { positionals, values } = parseArgs({
        allowPositionals: true,
        options: { package: { type: 'string' }, artifact: { type: 'string' } }
    });
    const [runId, attempt] = positionals;
    const gridLite = values.package === 'grid-lite';
    assert(positionals.length === 2 && /^[1-9]\d*$/u.test(runId) && /^[1-9]\d*$/u.test(attempt) &&
        (values.package === undefined || gridLite) && values.artifact !== '', usage);
    const artifactName = gridLite ? `nightly-grid-lite-validation-${attempt}` : `nightly-package-validation-${attempt}`;
    const { extracted, sourceSha } = values.artifact ?
        { extracted: resolve(values.artifact) } : download(runId, attempt, artifactName);
    const prefix = gridLite ? 'grid-lite-package-prototype-' : 'highcharts-package-prototype-';
    const roots = readdirSync(extracted, { withFileTypes: true }).filter(
        entry => entry.isDirectory() && entry.name.startsWith(prefix)
    );
    assert(roots.length === 1, 'Retained consumer results directory unavailable or ambiguous');
    const evidence = join(extracted, roots[0].name);
    const { manifest, inputs } = verifyReplay(evidence);
    assert.equal(inputs.packageName ?? 'highcharts', gridLite ? '@highcharts/grid-lite' : 'highcharts',
        'Evidence package differs from requested package');
    assert.equal(manifest.runId, runId, 'Evidence run ID differs from requested run');
    assert.equal(manifest.attempt, attempt, 'Evidence attempt differs from requested attempt');
    if (sourceSha) {
        assert.equal(manifest.sourceSha, sourceSha, 'Evidence source SHA differs from requested attempt');
    }
    const runner = fileURLToPath(new URL('./run.mjs', import.meta.url));
    const runnerArgs = gridLite ? ['--package', 'grid-lite'] : [];
    const { status, error } = spawnSync(process.execPath, [runner, '--replay', evidence, ...runnerArgs], {
        stdio: 'inherit'
    });
    if (error) {
        throw error;
    }
    process.exitCode = status ?? 1;
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
