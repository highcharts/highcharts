import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
    fixtureFiles, hash, lanes, readJSON, recordReplay, verifyReplay, writeJSON
} from '../nightly-package-validation-prototype/replay-evidence.mjs';

test('records portable evidence paths and rejects a different runner', () => {
    const root = mkdtempSync(join(tmpdir(), 'hc-nightly-replay-test-'));
    try {
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
            candidate: { sha256: hash(join(root, 'candidate', 'candidate.tgz')) },
            control: { integrity: `sha512-${hash(join(root, 'control', 'control.tgz'), 'sha512', 'base64')}` }
        });
        recordReplay(root);
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
    } finally {
        rmSync(root, { recursive: true, force: true });
    }
});
