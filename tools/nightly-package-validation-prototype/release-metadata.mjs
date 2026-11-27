import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { chmodSync, closeSync, mkdirSync, openSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { releaseRepositoryMetadata } from '../gulptasks/lib/release-package.js';

async function* listTree(repository, revision) {
    const child = spawn('git', ['ls-tree', '-r', '-z', '--full-tree', revision], {
        cwd: repository, stdio: ['ignore', 'pipe', 'inherit']
    });
    child.once('error', error => child.stdout.destroy(error));
    const completed = new Promise(resolve => child.once('close', resolve));
    try {
        let partial = '';
        for await (const chunk of child.stdout.setEncoding('utf8')) {
            const entries = (partial + chunk).split('\0');
            partial = entries.pop();
            yield* entries;
        }
        assert.equal(await completed, 0, 'Could not list committed release metadata');
        assert.equal(partial, '', 'Incomplete Git tree entry');
    } finally {
        child.kill();
    }
}

export async function copyReleaseMetadata(repository, revision, directory) {
    assert(/^[a-f0-9]{40}$/u.test(revision), 'Pass a full immutable metadata commit SHA');
    const commit = execFileSync('git', ['rev-parse', '--verify', `${revision}^{commit}`], {
        cwd: repository, encoding: 'utf8'
    });
    assert.equal(commit.trim(), revision, 'Pass a full immutable metadata commit SHA');

    for await (const entry of listTree(repository, revision)) {
        const file = entry.slice(entry.indexOf('\t') + 1);
        if (!releaseRepositoryMetadata.some(pattern => file.match(pattern))) {
            continue;
        }
        assert(!file.includes('\\') && !file.split('/').includes('.git'),
            `Unexpected metadata path: ${file}`);
        const mode = entry.slice(0, 6);
        assert(mode === '100644' || mode === '100755', `Expected regular release metadata: ${file}`);
        const target = join(directory, file);
        mkdirSync(dirname(target), { recursive: true });
        const fd = openSync(target, 'wx');
        try {
            execFileSync('git', ['show', `${revision}:${file}`], {
                cwd: repository, stdio: ['ignore', fd, 'pipe']
            });
        } finally {
            closeSync(fd);
        }
        chmodSync(target, mode === '100755' ? 0o755 : 0o644);
    }
}
