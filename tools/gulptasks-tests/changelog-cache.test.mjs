import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const source = fs.readFileSync(
    new URL('../../changelog/pr-log.js', import.meta.url), 'utf8'
);

async function withCache(check) {
    const root = await fs.promises.mkdtemp(join(tmpdir(), 'hc-changelog-'));
    const shared = join(root, 'shared');
    const cache = join(root, 'tmp', 'changelog-pulls.json');
    await fs.promises.mkdir(shared);
    await fs.promises.mkdir(join(root, 'changelog'));
    const pulls = [{
        number: 1,
        body: 'Fixed Highcharts.',
        labels: [
            { name: 'Product: Highcharts' },
            { name: 'Changelog: Bugfix' }
        ],
        // eslint-disable-next-line camelcase
        merged_at: '2025-01-01T00:00:00Z'
    }];
    let requests = 0;
    function load() {
        const module = { exports: {} };
        runInNewContext(source, {
            module,
            __dirname: join(root, 'changelog'),
            process: { env: {} },
            console: { log() {}, error() {} },
            require(name) {
                if (name === 'os') {
                    return { tmpdir: () => shared };
                }
                if (name === '@octokit/rest') {
                    return {
                        Octokit: class {
                            constructor() {
                                this.repos = {
                                    async listTags() {
                                        requests++;
                                        return { data: [{ commit: { sha: 'base' } }] };
                                    },
                                    async getCommit() {
                                        return {
                                            headers: {
                                                'last-modified': '2020-01-01T00:00:00Z'
                                            }
                                        };
                                    }
                                };
                                this.pulls = {
                                    async list({ page }) {
                                        return { data: page === 1 ? pulls : [] };
                                    }
                                };
                            }
                        }
                    };
                }
                return require(name);
            }
        });
        return module.exports;
    }
    try {
        await check({
            root,
            shared,
            cache,
            pulls,
            load,
            requestCount: () => requests
        });
    } finally {
        await fs.promises.rm(root, { recursive: true, force: true });
    }
}

test('persists a private checkout-local cache across invocations', async () => {
    await withCache(async ({ cache, pulls, load, requestCount }) => {
        const first = await load()();
        assert.deepEqual(JSON.parse(await fs.promises.readFile(cache)), pulls);
        const cached = await load()('ignored', true);
        assert.equal(requestCount(), 1);
        assert.deepEqual(JSON.parse(JSON.stringify(cached)),
            JSON.parse(JSON.stringify(first)));
        if (process.platform !== 'win32') {
            assert.equal((await fs.promises.stat(cache)).mode & 0o777, 0o600);
        }
    });
});

test('never writes the shared OS cache or follows a cache symlink', async () => {
    await withCache(async ({ root, shared, cache, load }) => {
        const sentinel = join(root, 'unrelated.json');
        await fs.promises.writeFile(sentinel, 'untouched');
        await fs.promises.symlink(sentinel, join(shared, 'pulls.json'));
        await fs.promises.mkdir(join(root, 'tmp'));
        await fs.promises.symlink(sentinel, cache);
        await load()();
        assert.equal(await fs.promises.readFile(sentinel, 'utf8'), 'untouched');
        assert.equal(JSON.parse(await fs.promises.readFile(cache)).length, 1);
        assert.equal((await fs.promises.lstat(cache)).isSymbolicLink(), false);
    });
});

test('refreshing a cache hardlink leaves the other file untouched', async () => {
    await withCache(async ({ root, cache, load }) => {
        const sentinel = join(root, 'unrelated.json');
        await fs.promises.writeFile(sentinel, 'untouched');
        await fs.promises.mkdir(join(root, 'tmp'));
        await fs.promises.link(sentinel, cache);
        await load()();
        assert.equal(await fs.promises.readFile(sentinel, 'utf8'), 'untouched');
        assert.equal(JSON.parse(await fs.promises.readFile(cache)).length, 1);
    });
});
