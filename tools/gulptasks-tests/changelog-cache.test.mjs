import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);

test('refreshing the cache replaces a symlink with a private file', async () => {
    const root = await fs.mkdtemp(join(tmpdir(), 'hc-changelog-'));
    const cache = join(root, 'tmp', 'changelog-pulls.json');
    const sentinel = join(root, 'unrelated.json');
    try {
        await fs.mkdir(join(root, 'tmp'));
        await fs.writeFile(sentinel, 'untouched');
        await fs.symlink(sentinel, cache);
        const module = { exports: {} };
        const source = await fs.readFile(
            new URL('../../changelog/pr-log.js', import.meta.url), 'utf8'
        );
        runInNewContext(source, {
            module,
            __dirname: join(root, 'changelog'),
            process: { env: {} },
            console: { log() {}, error() {} },
            require(name) {
                if (name === 'os') {
                    return { tmpdir: () => root };
                }
                if (name === '@octokit/rest') {
                    return {
                        Octokit: class {
                            constructor() {
                                this.repos = {
                                    async listTags() {
                                        return { data: [{ commit: { sha: 'base' } }] };
                                    },
                                    async getCommit() {
                                        return { headers: { 'last-modified': '2020-01-01' } };
                                    }
                                };
                                this.pulls = {
                                    async list() {
                                        return { data: [] };
                                    }
                                };
                            }
                        }
                    };
                }
                return require(name);
            }
        });
        await module.exports();
        assert.equal(await fs.readFile(sentinel, 'utf8'), 'untouched');
        assert.deepEqual(JSON.parse(await fs.readFile(cache, 'utf8')), []);
        const stats = await fs.lstat(cache);
        assert.equal(stats.isFile(), true);
        if (process.platform !== 'win32') {
            assert.equal(stats.mode & 0o777, 0o600);
        }
    } finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});
