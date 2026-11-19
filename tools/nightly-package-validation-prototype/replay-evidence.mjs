import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, lstatSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { candidateFiles, hash, readJSON, verifyCandidateEvidence, writeJSON } from './package-evidence.mjs';

export { hash, readJSON, writeJSON };

export const fixtureFiles = [
    'app', 'browser-cases.mjs', 'browser-results.mjs', 'consumer.spec.mjs',
    'package-lock.json', 'package.json', 'playwright.config.mjs', 'tsconfig.json',
    'vite.config.mjs'
];
const productFiles = ['app', 'browser-cases.mjs', 'package-lock.json', 'package.json', 'tsconfig.json'];
export const lanes = ['control', 'candidate'];
const laneFiles = ['install-inputs.json', 'package.json', 'package-lock.json'];
export const runnerFiles = [
    'run.mjs', 'replay-evidence.mjs', 'replay-worker.mjs', 'package-evidence.mjs',
    'npm-pack.mjs'
];
const runnerDirectory = fileURLToPath(new URL('.', import.meta.url));

function runnerDigests() {
    return Object.fromEntries(runnerFiles.map(file => {
        const source = readFileSync(join(runnerDirectory, file), 'utf8');
        return [file, createHash('sha256').update(source.replaceAll('\r\n', '\n')).digest('hex')];
    }));
}

export function copyFixture(source, destination, gridLite) {
    mkdirSync(destination);
    for (const file of fixtureFiles) {
        const directory = gridLite && productFiles.includes(file) ? join(source, 'grid-lite') : source;
        cpSync(join(directory, file), join(destination, file), { recursive: true });
    }
}

function inventory(root, paths) {
    return Object.fromEntries(paths.sort().map(path => {
        try {
            const file = join(root, path);
            assert(lstatSync(file).isFile(), `Unexpected replay file type: ${path}`);
            return [path, hash(file)];
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Required replay input unavailable: ${path}`);
            }
            throw error;
        }
    }));
}

function fixtureInventory(root) {
    const appDirectory = join(root, 'app');
    assert(lstatSync(appDirectory).isDirectory(), 'Replay fixture app must be a directory');
    const app = readdirSync(appDirectory, {
        recursive: true, withFileTypes: true
    }).filter(entry => !entry.isDirectory());
    for (const entry of app) {
        assert(entry.isFile(), `Unexpected fixture file type: ${entry.name}`);
    }
    return [
        ...fixtureFiles.filter(name => name !== 'app'),
        ...app.map(entry => relative(root, join(entry.parentPath, entry.name)).split(sep).join('/'))
    ];
}

export function replayFiles(root) {
    for (const directory of ['fixture', ...lanes]) {
        assert(lstatSync(join(root, directory)).isDirectory(), `Replay ${directory} must be a directory`);
    }
    const inputsPath = join(root, 'inputs.json');
    assert(lstatSync(inputsPath).isFile(), 'Replay inputs must be a regular file');
    const { packageName, candidate } = readJSON(inputsPath);
    return [
        'inputs.json',
        ...candidateFiles(packageName, candidate?.provenance),
        ...fixtureInventory(join(root, 'fixture')).map(name => `fixture/${name}`),
        ...lanes.flatMap(lane => [...laneFiles, `${lane}.tgz`].map(name => `${lane}/${name}`))
    ];
}

export function recordReplay(root, { sourceSha, runId, attempt }) {
    writeJSON(join(root, 'replay.json'), {
        version: 2,
        runId,
        attempt,
        sourceSha,
        runner: runnerDigests(),
        files: inventory(root, replayFiles(root))
    });
}

export function verifyReplay(root) {
    let manifest;
    try {
        const manifestPath = join(root, 'replay.json');
        assert(lstatSync(manifestPath).isFile(), 'Replay manifest must be a regular file');
        manifest = readJSON(manifestPath);
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('Replay manifest unavailable. This run predates replay support or stopped before both locks were verified.');
        }
        throw error;
    }
    assert.equal(manifest.version, 2, 'Unsupported replay manifest version. Capture a fresh attempt with linked package evidence.');
    const revision = manifest.sourceSha ?? 'the revision that produced this evidence';
    assert(manifest.runner, `Recorded runner digests unavailable for ${revision}; replay cannot verify the validation logic`);
    for (const [file, digest] of Object.entries(runnerDigests())) {
        assert.equal(digest, manifest.runner[file],
            `Recorded runner differs: ${file} at ${revision}. Use a reviewed checkout with the safe replay changes, or capture a fresh attempt.`);
    }
    const files = inventory(root, replayFiles(root));
    for (const [name, digest] of Object.entries(files)) {
        assert.equal(digest, manifest.files[name], `Replay digest mismatch or missing digest: ${name}`);
    }
    assert.deepEqual(Object.keys(files), Object.keys(manifest.files), 'Replay file inventory differs');
    for (const lane of lanes) {
        const install = readJSON(join(root, lane, 'install-inputs.json'));
        for (const [file, key] of [
            ['package.json', 'manifestSha256'],
            ['package-lock.json', 'lockSha256'],
            [`${lane}.tgz`, 'tarballSha256']
        ]) {
            assert.equal(files[`${lane}/${file}`], install[key],
                `Replay input changed after lock verification: ${lane}/${file}`);
        }
    }
    const inputs = readJSON(join(root, 'inputs.json'));
    const control = join(root, 'control', 'control.tgz');
    assert.equal(files['candidate/candidate.tgz'], inputs.candidate.sha256, 'Replay candidate digest mismatch');
    if (inputs.candidate.provenance === 'nightly') {
        const { provenanceSha256 } = verifyCandidateEvidence(root, inputs.packageName, manifest, inputs.candidate.sha256);
        assert.equal(inputs.candidate.provenanceSha256, provenanceSha256, 'Replay candidate provenance digest mismatch');
        assert.equal(readJSON(join(root, 'candidate', 'install-inputs.json')).provenanceSha256, provenanceSha256,
            'Replay candidate provenance changed after lock verification');
    } else {
        assert(!('runId' in manifest) && !('attempt' in manifest),
            'Hosted replay requires linked package evidence');
    }
    assert.equal(`sha512-${hash(control, 'sha512', 'base64')}`, inputs.control.integrity,
        'Replay stable control integrity mismatch');
    return { manifest, inputs };
}

export function verifyReplaySource(root, fixture, identity) {
    const { manifest, inputs } = verifyReplay(root);
    assert.equal(manifest.sourceSha, identity.sourceSha,
        'Evidence source SHA differs from the reviewed checkout. Use a separate checkout at the recorded revision.');
    if (identity.runId) {
        assert.equal(inputs.candidate.provenance, 'nightly', 'Hosted replay requires linked package evidence');
        assert.equal(manifest.runId, identity.runId, 'Evidence run ID differs from requested run');
        assert.equal(manifest.attempt, identity.attempt, 'Evidence attempt differs from requested attempt');
    }
    const packageName = identity.gridLite ? '@highcharts/grid-lite' : 'highcharts';
    assert.equal(inputs.packageName, packageName, 'Evidence package differs from requested package');
    const reviewed = inventory(fixture, fixtureInventory(fixture));
    const retained = Object.fromEntries(Object.entries(manifest.files).filter(([name]) => name.startsWith('fixture/'))
        .map(([name, digest]) => [name.slice('fixture/'.length), digest]));
    assert.deepEqual(retained, reviewed, 'Retained fixture differs from the reviewed revision');
    const pkg = readJSON(join(fixture, 'package.json'));
    for (const lane of lanes) {
        pkg.dependencies[packageName] = `file:${lane}.tgz`;
        assert.deepEqual(readJSON(join(root, lane, 'package.json')), pkg,
            `Retained ${lane} manifest differs from the reviewed fixture`);
    }
    return { manifest, inputs };
}
