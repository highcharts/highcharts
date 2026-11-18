import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
    fixtureFiles, hash, lanes, readJSON, recordReplay, verifyReplay, writeJSON
} from '../nightly-package-validation-prototype/replay-evidence.mjs';

function writeEvidence(root, packageName) {
    mkdirSync(join(root, 'fixture', 'app'), { recursive: true });
    writeFileSync(join(root, 'fixture', 'app', 'stock.ts'), 'fixture');
    for (const file of fixtureFiles.filter(file => file !== 'app')) {
        writeFileSync(join(root, 'fixture', file), 'fixture');
    }
    for (const lane of lanes) {
        const dir = join(root, lane);
        mkdirSync(dir);
        for (const file of ['package.json', 'package-lock.json', `${lane}.tgz`]) {
            writeFileSync(join(dir, file), '{}');
        }
        writeJSON(join(dir, 'install-inputs.json'), {
            manifestSha256: hash(join(dir, 'package.json')),
            lockSha256: hash(join(dir, 'package-lock.json')),
            tarballSha256: hash(join(dir, `${lane}.tgz`))
        });
    }
    writeJSON(join(root, 'inputs.json'), {
        packageName,
        candidate: { sha256: hash(join(root, 'candidate', 'candidate.tgz')) },
        control: { integrity: `sha512-${hash(join(root, 'control', 'control.tgz'), 'sha512', 'base64')}` }
    });
    recordReplay(root);
}

test('records portable evidence paths and rejects a different runner', t => {
    const root = mkdtempSync(join(tmpdir(), 'hc-nightly-replay-test-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    writeEvidence(root);
    const pathname = join(root, 'replay.json');
    const manifest = readJSON(pathname);
    assert.ok(manifest.files['fixture/app/stock.ts']);
    assert.ok(Object.keys(manifest.files).every(path => !path.includes('\\')));
    verifyReplay(root);
    manifest.sourceSha = '0123456789abcdef0123456789abcdef01234567';
    manifest.runner['run.mjs'] = 'different runner';
    writeJSON(pathname, manifest);
    assert.throws(() => verifyReplay(root),
        /Replay runner differs: run\.mjs\. Check out 0123456789abcdef/u);
});

test('selects Grid Lite evidence and checks the package before launching replay', t => {
    const extracted = mkdtempSync(join(tmpdir(), 'hc-nightly-replay-test-'));
    t.after(() => rmSync(extracted, { recursive: true, force: true }));
    const root = join(extracted, 'grid-lite-package-prototype-fixture');
    const replay = fileURLToPath(new URL('../nightly-package-validation-prototype/replay.mjs', import.meta.url));
    const args = [replay, '12', '2', '--artifact', extracted];

    writeEvidence(root, 'highcharts');
    const legacy = spawnSync(process.execPath, args, { encoding: 'utf8' });
    assert.equal(legacy.status, 1);
    assert.match(legacy.stderr, /Retained consumer results directory unavailable/u);
    const mismatch = spawnSync(process.execPath, [...args, '--package', 'grid-lite'], { encoding: 'utf8' });
    assert.equal(mismatch.status, 1);
    assert.match(mismatch.stderr, /Evidence package differs from requested package/u);
});
