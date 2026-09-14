import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { getFilesChanged } from '../libs/git.js';

function git(root, ...args) {
    return execFileSync('git', args, {
        cwd: root,
        encoding: 'utf8'
    });
}

test('returns net changed files once from a detached HEAD', async () => {
    const root = await mkdtemp(join(tmpdir(), 'highcharts-git-'));
    const previousCwd = process.cwd();
    try {
        git(root, 'init');
        git(root, 'checkout', '-b', 'master');
        git(root, 'config', 'user.email', 'test@example.com');
        git(root, 'config', 'user.name', 'Highcharts Test');

        await writeFile(join(root, 'kept.txt'), 'base\n');
        await writeFile(join(root, 'reverted.txt'), 'base\n');
        git(root, 'add', '.');
        git(root, 'commit', '-m', 'base');
        git(root, 'update-ref', 'refs/remotes/origin/master', 'HEAD');

        await writeFile(join(root, 'kept.txt'), 'first change\n');
        await writeFile(join(root, 'reverted.txt'), 'temporary change\n');
        await writeFile(join(root, 'added.txt'), 'added\n');
        git(root, 'add', '.');
        git(root, 'commit', '-m', 'first change');

        await writeFile(join(root, 'kept.txt'), 'second change\n');
        await writeFile(join(root, 'reverted.txt'), 'base\n');
        git(root, 'add', '.');
        git(root, 'commit', '-m', 'second change');
        git(root, 'checkout', '--detach', 'HEAD');

        process.chdir(root);
        assert.equal(
            getFilesChanged(),
            'A\tadded.txt\nM\tkept.txt\n'
        );
    } finally {
        process.chdir(previousCwd);
        await rm(root, { recursive: true, force: true });
    }
});
