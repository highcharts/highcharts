import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const fixtureFiles = [
    'app', 'browser-cases.mjs', 'browser-results.mjs', 'consumer.spec.mjs',
    'package-lock.json', 'package.json', 'playwright.config.mjs', 'tsconfig.json',
    'vite.config.mjs'
];
export const lanes = ['control', 'candidate'];
const laneFiles = ['install-inputs.json', 'package.json', 'package-lock.json'];
const runnerFiles = ['run.mjs', 'replay-evidence.mjs'];
const runnerDirectory = fileURLToPath(new URL('.', import.meta.url));

function runnerDigests() {
    return Object.fromEntries(runnerFiles.map(file => {
        const source = readFileSync(join(runnerDirectory, file), 'utf8');
        return [file, createHash('sha256').update(source.replaceAll('\r\n', '\n')).digest('hex')];
    }));
}

export function hash(path, algorithm = 'sha256', encoding = 'hex') {
    return createHash(algorithm).update(readFileSync(path)).digest(encoding);
}

export function readJSON(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJSON(path, value) {
    writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

function inventory(root, paths) {
    return Object.fromEntries(paths.sort().map(path => {
        try {
            return [path, hash(join(root, path))];
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Required replay input unavailable: ${path}`);
            }
            throw error;
        }
    }));
}

function replayFiles(root) {
    const app = readdirSync(join(root, 'fixture', 'app'), {
        recursive: true, withFileTypes: true
    }).filter(entry => !entry.isDirectory());
    for (const entry of app) {
        assert(entry.isFile(), `Unexpected fixture file type: ${entry.name}`);
    }
    return [
        'inputs.json',
        ...fixtureFiles.filter(name => name !== 'app').map(name => `fixture/${name}`),
        ...app.map(entry => relative(root, join(entry.parentPath, entry.name)).split(sep).join('/')),
        ...lanes.flatMap(lane => [...laneFiles, `${lane}.tgz`].map(name => `${lane}/${name}`))
    ];
}

export function recordReplay(root) {
    writeJSON(join(root, 'replay.json'), {
        version: 1,
        runId: process.env.GITHUB_RUN_ID,
        attempt: process.env.GITHUB_RUN_ATTEMPT,
        sourceSha: process.env.GITHUB_SHA,
        runner: runnerDigests(),
        files: inventory(root, replayFiles(root))
    });
}

export function verifyReplay(root) {
    let manifest;
    try {
        manifest = readJSON(join(root, 'replay.json'));
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('Replay manifest unavailable. This run predates replay support or stopped before both locks were verified.');
        }
        throw error;
    }
    assert.equal(manifest.version, 1, 'Unsupported replay manifest version');
    const revision = manifest.sourceSha ?? 'the revision that produced this evidence';
    assert(manifest.runner, `Recorded runner digests unavailable for ${revision}; replay cannot verify the validation logic`);
    const runner = runnerDigests();
    for (const [file, digest] of Object.entries(runner)) {
        assert.equal(digest, manifest.runner[file],
            `Replay runner differs: ${file}. Check out ${revision} on a separate worktree and retry.`);
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
    assert.equal(`sha512-${hash(control, 'sha512', 'base64')}`, inputs.control.integrity,
        'Replay stable control integrity mismatch');
    return { manifest, inputs };
}
