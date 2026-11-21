import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
    copyFixture, hash, lanes, readJSON, recordReplay, verifyReplay,
    verifyReplaySource, writeJSON
} from '../nightly-package-validation-prototype/replay-evidence.mjs';
import { recordCandidateEvidence } from '../nightly-package-validation-prototype/package-evidence.mjs';
import { writeCandidateProvenance } from './fixtures/nightly-package-evidence.mjs';

const prototype = fileURLToPath(new URL('../nightly-package-validation-prototype/', import.meta.url));
const sourceSha = execFileSync('git', ['-C', prototype, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const nightly = { sourceSha, runId: '123', attempt: '2' };

function temporaryDirectory(t) {
    const path = mkdtempSync(join(tmpdir(), 'hc-nightly-replay-test-'));
    t.after(() => rmSync(path, { recursive: true, force: true }));
    return path;
}

function recordInstall(dir, lane, provenanceSha256) {
    writeJSON(join(dir, 'install-inputs.json'), {
        manifestSha256: hash(join(dir, 'package.json')),
        lockSha256: hash(join(dir, 'package-lock.json')),
        tarballSha256: hash(join(dir, `${lane}.tgz`)),
        provenanceSha256
    });
}

function writeEvidence(root, gridLite, identity, buildAttempt) {
    const fixture = join(root, 'fixture');
    const packageName = gridLite ? '@highcharts/grid-lite' : 'highcharts';
    mkdirSync(root, { recursive: true });
    copyFixture(prototype, fixture, gridLite);
    const pkg = readJSON(join(fixture, 'package.json'));
    for (const lane of lanes) {
        const dir = join(root, lane);
        mkdirSync(dir);
        pkg.dependencies[packageName] = `file:${lane}.tgz`;
        writeJSON(join(dir, 'package.json'), pkg);
        for (const file of ['package-lock.json', `${lane}.tgz`]) {
            writeFileSync(join(dir, file), '{}');
        }
        recordInstall(dir, lane);
    }
    const provenanceSha256 = identity && writeCandidateProvenance(root, packageName, identity, {
        'package.json': JSON.stringify({ name: packageName, version: '13.1.1' })
    }, buildAttempt);
    if (identity) {
        recordInstall(join(root, 'candidate'), 'candidate', provenanceSha256);
    }
    writeJSON(join(root, 'inputs.json'), {
        packageName,
        candidate: {
            sha256: hash(join(root, 'candidate', 'candidate.tgz')),
            provenance: identity ? 'nightly' : 'tarball-only',
            provenanceSha256
        },
        control: { integrity: `sha512-${hash(join(root, 'control', 'control.tgz'), 'sha512', 'base64')}` }
    });
    recordReplay(root, identity ?? { sourceSha });
    return fixture;
}

test('records portable evidence paths and rejects a different original runner', t => {
    const root = temporaryDirectory(t);
    writeEvidence(root);
    const pathname = join(root, 'replay.json');
    const manifest = readJSON(pathname);
    assert.ok(manifest.files['fixture/app/stock.ts']);
    assert.ok(Object.keys(manifest.files).every(path => !path.includes('\\')));
    verifyReplay(root);
    manifest.runner['run.mjs'] = 'different runner';
    writeJSON(pathname, manifest);
    assert.throws(() => verifyReplay(root), /Recorded runner differs: run\.mjs/u);
});

test('binds both products to the reviewed fixture and checks the source and attempt', t => {
    for (const gridLite of [false, true]) {
        const root = temporaryDirectory(t);
        const identity = { ...nightly, gridLite };
        const fixture = writeEvidence(root, gridLite, nightly, '1');
        assert.doesNotThrow(() => verifyReplaySource(root, fixture, identity));
        assert.throws(() => verifyReplaySource(root, fixture, { ...identity, sourceSha: 'bad' }),
            /Evidence source SHA differs/u);
        assert.throws(() => verifyReplaySource(root, fixture, { ...identity, runId: '12' }),
            /Evidence run ID differs/u);
        assert.throws(() => verifyReplaySource(root, fixture, { ...identity, attempt: '1' }),
            /Evidence attempt differs/u);
        assert.throws(() => verifyReplaySource(root, fixture, { ...identity, gridLite: !gridLite }),
            /Evidence package differs/u);
    }
});

test('rejects a Highcharts build from an attempt later than the recorded validation', t => {
    const root = temporaryDirectory(t);
    const fixture = writeEvidence(root, false, nightly, '3');
    assert.throws(() => verifyReplaySource(root, fixture, nightly), /Build manifest attempt mismatch/u);
});

test('requires hosted provenance and validates the manifest linked to each candidate', t => {
    for (const gridLite of [false, true]) {
        const root = temporaryDirectory(t);
        const fixture = writeEvidence(root, gridLite, nightly);
        const identity = { ...nightly, gridLite };
        const manifest = join(root, 'candidate', gridLite ? 'staging-manifest.json' : 'build-manifest.json');
        const original = readJSON(manifest);
        rmSync(manifest);
        assert.throws(() => verifyReplaySource(root, fixture, identity),
            /Required replay input unavailable: candidate\/.*manifest\.json/u);

        writeJSON(manifest, { ...original, sourceSha: '0'.repeat(40) });
        assert.throws(() => verifyReplaySource(root, fixture, identity), /Replay digest mismatch/u);
        recordReplay(root, nightly);
        assert.throws(() => verifyReplaySource(root, fixture, identity), /Candidate manifest digest mismatch/u);
        const inputs = readJSON(join(root, 'inputs.json'));
        recordCandidateEvidence(root, inputs.packageName, nightly);
        recordReplay(root, nightly);
        assert.throws(() => verifyReplaySource(root, fixture, identity), /Candidate manifest source SHA mismatch/u);
    }

    const local = temporaryDirectory(t);
    const fixture = writeEvidence(local);
    assert.throws(() => verifyReplaySource(local, fixture, nightly), /Hosted replay requires linked package evidence/u);
});

test('rejects retained executable fixture changes even if all evidence hashes match', t => {
    const root = temporaryDirectory(t);
    writeEvidence(root);
    writeFileSync(join(root, 'fixture', 'browser-results.mjs'), 'throw new Error(\'artifact fixture ran\');\n');
    recordReplay(root, { sourceSha });
    assert.doesNotThrow(() => verifyReplay(root));
    assert.throws(() => verifyReplaySource(root, prototype, { sourceSha }),
        /Retained fixture differs from the reviewed revision/u);
});

test('rejects retained npm scripts even if the install and replay hashes match', t => {
    const root = temporaryDirectory(t);
    const fixture = writeEvidence(root);
    const candidate = join(root, 'candidate');
    const pkg = readJSON(join(candidate, 'package.json'));
    pkg.scripts.test = 'echo unexpected fixture script';
    writeJSON(join(candidate, 'package.json'), pkg);
    recordInstall(candidate, 'candidate');
    recordReplay(root, { sourceSha });
    assert.doesNotThrow(() => verifyReplay(root));
    assert.throws(() => verifyReplaySource(root, fixture, { sourceSha }),
        /Retained candidate manifest differs from the reviewed fixture/u);
});

test('stages only read-only inputs for sandbox execution through both replay entry points', {
    skip: process.platform === 'win32'
}, t => {
    const bin = temporaryDirectory(t);
    const extracted = temporaryDirectory(t);
    const evidence = join(extracted, 'grid-lite-package-prototype-fixture');
    writeEvidence(evidence, true, { ...nightly, runId: '12' });
    const callLog = join(bin, 'container.jsonl');
    const docker = join(bin, 'docker');
    writeFileSync(docker, `#!${process.execPath}
const assert = require('node:assert/strict');
const { appendFileSync, lstatSync, readdirSync, writeFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const args = process.argv.slice(2);
function checkPermissions(path) {
    const stat = lstatSync(path);
    assert.equal(stat.mode & 0o777, stat.isDirectory() ? 0o755 : 0o644, path);
    if (stat.isDirectory()) {
        for (const name of readdirSync(path)) {
            checkPermissions(join(path, name));
        }
    } else {
        assert.ok(stat.isFile(), path);
    }
}
appendFileSync(process.env.REPLAY_TEST_CALLS, JSON.stringify(args) + '\\n');
if (args[0] === 'build') {
    const build = args.at(-1);
    assert.equal(lstatSync(dirname(build)).mode & 0o777, 0o700);
    checkPermissions(build);
    writeFileSync(args[args.indexOf('--iidfile') + 1], 'sha256:' + 'a'.repeat(64));
} else if (args[0] === 'run') {
    const mount = args[args.indexOf('--mount') + 1];
    const source = /^type=bind,source=(.*),target=\\/replay,readonly$/u.exec(mount)[1];
    assert.equal(lstatSync(dirname(source)).mode & 0o777, 0o700);
    assert.ok(readdirSync(source).includes(process.env.REPLAY_TEST_INPUT));
    checkPermissions(source);
}
`, { mode: 0o755 });
    const archive = join(bin, 'download.zip');
    writeFileSync(archive, 'mock downloaded archive');
    writeFileSync(join(bin, 'gh'), `#!${process.execPath}
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const [command, path] = process.argv.slice(2);
assert.equal(command, 'api');
switch (path) {
    case 'repos/highcharts/highcharts/actions/runs/12/attempts/2':
        console.log(JSON.stringify({
            id: 12, run_attempt: 2, path: '.github/workflows/nightly.yml', head_sha: '${sourceSha}'
        }));
        break;
    case 'repos/highcharts/highcharts/actions/runs/12/artifacts?name=nightly-grid-lite-validation-2':
        console.log(JSON.stringify({
            artifacts: [{ id: 34, name: 'nightly-grid-lite-validation-2', digest: 'sha256:${hash(archive)}' }]
        }));
        break;
    case 'repos/highcharts/highcharts/actions/artifacts/34/zip':
        process.stdout.write(readFileSync(${JSON.stringify(archive)}));
        break;
    default:
        assert.fail(path);
}
`, { mode: 0o755 });
    const invoke = (input, ...args) => spawnSync(process.execPath, [
        '--import', 'data:text/javascript,process.umask(0o077)', ...args
    ], {
        env: { ...process.env, PATH: `${bin}${delimiter}${process.env.PATH}`,
            NIGHTLY_REPLAY_CONTAINER: 'docker', REPLAY_TEST_CALLS: callLog, REPLAY_TEST_INPUT: input },
        encoding: 'utf8'
    });
    const direct = invoke('evidence', join(prototype, 'run.mjs'), '--replay', evidence, '--package', 'grid-lite');
    assert.equal(direct.status, 0, direct.stderr);
    const wrapper = invoke('evidence', join(prototype, 'replay.mjs'), '12', '2', '--artifact', extracted, '--package', 'grid-lite');
    assert.equal(wrapper.status, 0, wrapper.stderr);
    const download = invoke('validation.zip', join(prototype, 'replay.mjs'), '12', '2', '--package', 'grid-lite');
    assert.equal(download.status, 0, download.stderr);
    const records = readFileSync(callLog, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    assert.deepEqual(records.map(args => args[0]), [
        'build', 'run', 'rm', 'build', 'run', 'rm', 'build', 'run', 'rm'
    ]);
    for (const args of records.filter(args => args[0] === 'run')) {
        assert.equal(args[args.indexOf('--network') + 1], 'none');
        assert.equal(args[args.indexOf('--user') + 1], 'pwuser');
        assert.equal(args[args.indexOf('--cap-drop') + 1], 'ALL');
        assert.equal(args[args.indexOf('--security-opt') + 1], 'no-new-privileges');
        assert.equal(args.filter(arg => arg === '--mount').length, 1);
        assert.match(args[args.indexOf('--mount') + 1], /highcharts-replay-[^/]+\/input,target=\/replay,readonly$/u);
        assert.ok(args.includes('-i'));
        assert.equal(args.at(-1), '/replay/replay-worker.mjs');
    }
    rmSync(join(evidence, 'fixture', 'browser-results.mjs'));
    symlinkSync(join(prototype, 'browser-results.mjs'), join(evidence, 'fixture', 'browser-results.mjs'));
    const symlink = invoke('evidence', join(prototype, 'run.mjs'), '--replay', evidence, '--package', 'grid-lite');
    assert.equal(symlink.status, 1);
    assert.match(symlink.stderr, /Unexpected replay file type/u);
});

test('runs the CLI when invoked through a symlinked directory', t => {
    const shortcut = join(temporaryDirectory(t), 'prototype');
    symlinkSync(prototype, shortcut, 'junction');
    const evidenceHelp = spawnSync(process.execPath, [join(shortcut, 'package-evidence.mjs'), '--help'], {
        encoding: 'utf8'
    });
    assert.equal(evidenceHelp.status, 0, evidenceHelp.stderr);
    assert.match(evidenceHelp.stdout, /^Usage: node package-evidence\.mjs/u);
    const script = join(shortcut, 'run.mjs');
    const help = spawnSync(process.execPath, [script, '--help'], { encoding: 'utf8' });
    assert.equal(help.status, 0, help.stderr);
    assert.match(help.stdout, /^Usage: node run\.mjs/u);

    const invalid = spawnSync(process.execPath, [script], { encoding: 'utf8' });
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /^Usage: node run\.mjs/u);
});
