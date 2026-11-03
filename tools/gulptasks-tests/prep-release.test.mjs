import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const sourceURL = new URL('../gulptasks/prep-release.js', import.meta.url);
const require = createRequire(sourceURL);
const nativeReleaseTools = ['grep', 'sed'].every(tool =>
    !spawnSync(tool, ['--version'], { stdio: 'ignore' }).error);

async function withRelease(argv, check, dependencies = {}) {
    const root = fs.mkdtempSync(join(tmpdir(), 'hc-prep-release-'));
    const cwd = process.cwd();
    const calls = [];
    fs.writeFileSync(join(root, 'package.json'),
        '{\n  "version": "1.2.3",\n  "description": "unchanged"\n}\n');
    fs.writeFileSync(join(root, 'bower.json'),
        '{\n    "name": "fixture",\n    "version": "2.3.4"\n}\n');
    fs.writeFileSync(join(root, 'build-properties.json'),
        JSON.stringify({ version: '1.2.3-modified', date: '', other: true }));
    let task;
    runInNewContext(fs.readFileSync(sourceURL, 'utf8'), {
        Buffer,
        require: name => {
            if (name === 'gulp') {
                return {
                    task(taskName, callback) {
                        task = callback;
                    }
                };
            }
            if (name === 'yargs') {
                return { argv };
            }
            if (name.startsWith('../../') && name.endsWith('.json')) {
                return JSON.parse(fs.readFileSync(join(root, name.slice(6)), 'utf8'));
            }
            if (name === '../libs/log') {
                return { message() {}, warn() {}, success() {} };
            }
            if (name === 'child_process') {
                return {
                    execSync() {
                        throw new Error('Unexpected shell execution');
                    },
                    execFileSync(file, args, options) {
                        if (file === 'grep' || file === 'sed') {
                            if (file === 'sed' && dependencies.failSed) {
                                throw new Error('fixture replacement failure');
                            }
                            return execFileSync(file, args, options);
                        }
                        assert.equal(file, 'git');
                        calls.push([...args]);
                        return Buffer.from(dependencies.stagedChanges || '');
                    }
                };
            }
            if (name === 'fs' && dependencies.fs) {
                return dependencies.fs;
            }
            return require(name);
        }
    });
    process.chdir(root);
    try {
        await check({ root, task, calls });
        assert.deepEqual(fs.readdirSync(root).filter(name =>
            name.startsWith('.prep-release-')), []);
    } finally {
        process.chdir(cwd);
        fs.rmSync(root, { recursive: true, force: true });
    }
}

test('prep-release preserves versions, formatting, backups and doclet semantics', {
    skip: !nativeReleaseTools && 'requires the existing grep and sed release tools'
}, async () => {
    const version = '13.2.0-rc.1+build.42';
    await withRelease({ nextversion: version }, async ({ root, task, calls }) => {
        const originals = ['package.json', 'bower.json'].map(file => fs.readFileSync(file));
        fs.mkdirSync('docs');
        const text = 'é @since\t next @since next @deprecated next @deprecated next\n' +
            '@since\nnext\n@since {next}\n@since nextThing\n';
        fs.writeFileSync('docs/file with spaces.ts', text);
        if (process.platform !== 'win32') {
            fs.writeFileSync('docs/line\nbreak.ts', '@since next');
        }
        const binary = Buffer.concat([Buffer.from([0x01, 0]),
            Buffer.from('@since next\n'), Buffer.from([0x02])]);
        fs.writeFileSync('docs/bytes.dat', binary);
        fs.chmodSync('docs/bytes.dat', 0o664);
        fs.writeFileSync('docs/unicode.ts', '@since\u00a0next @deprecated\u3000next');
        const unicodeExpected = execFileSync('sed', ['-e',
            `s/@since\\([[:space:]][[:space:]]*\\)next/@since\\1${version}/;` +
            `s/@deprecated\\([[:space:]][[:space:]]*\\)next/@deprecated\\1${version}/`,
            'docs/unicode.ts'], { encoding: 'utf8' });
        const untouched = ['node_modules/skip.ts', 'code/skip.ts',
            'docs/node_modules/skip.ts', 'docs/code/skip.ts', 'docs/skip.md', 'docs/skip.bak'];
        for (const file of untouched) {
            fs.mkdirSync(dirname(file), { recursive: true });
            fs.writeFileSync(file, '@since next');
        }
        fs.symlinkSync(join(root, 'node_modules/skip.ts'), 'docs/link.ts');
        fs.symlinkSync(join(root, 'node_modules'), 'docs/linked-directory');
        fs.mkdirSync('.hidden');
        fs.writeFileSync('.hidden/doc.txt', '@deprecated next');
        fs.writeFileSync('docs/include.MD', '@since next');
        fs.writeFileSync('sentinel', 'untouched');
        fs.symlinkSync(join(root, 'sentinel'), 'package.json.bak');

        await task();

        for (const [index, file] of ['package.json', 'bower.json'].entries()) {
            assert.deepEqual(fs.readFileSync(file + '.bak'), originals[index]);
            assert.equal(fs.readFileSync(file, 'utf8'), originals[index].toString()
                .replace(index ? '2.3.4' : '1.2.3', version));
        }
        assert.equal(fs.readFileSync('sentinel', 'utf8'), 'untouched');
        const build = JSON.parse(fs.readFileSync('build-properties.json', 'utf8'));
        assert.equal(build.version, version);
        assert.equal(build.date, new Date().toISOString().split('T')[0]);
        assert.equal(build.other, true);
        assert.equal(fs.readFileSync('docs/file with spaces.ts', 'utf8'),
            `é @since\t ${version} @since next @deprecated ${version} @deprecated next\n` +
            `@since\nnext\n@since {next}\n@since ${version}Thing\n`);
        assert.equal(fs.readFileSync('docs/file with spaces.ts.bak', 'utf8'), text);
        assert.equal(fs.readFileSync('docs/unicode.ts', 'utf8'), unicodeExpected);
        if (process.platform !== 'win32') {
            assert.equal(fs.statSync('docs/bytes.dat').mode & 0o777, 0o664);
            assert.equal(fs.statSync('docs/bytes.dat.bak').mode & 0o777, 0o664);
            assert.equal(fs.readFileSync('docs/line\nbreak.ts', 'utf8'), `@since ${version}`);
        }
        assert.deepEqual(fs.readFileSync('docs/bytes.dat.bak'), binary);
        assert.deepEqual(fs.readFileSync('docs/bytes.dat'), Buffer.concat([
            Buffer.from([0x01, 0]), Buffer.from(`@since ${version}\n`), Buffer.from([0x02])
        ]));
        for (const file of untouched) {
            assert.equal(fs.readFileSync(file, 'utf8'), '@since next');
        }
        assert.equal(fs.readFileSync('.hidden/doc.txt', 'utf8'), `@deprecated ${version}`);
        assert.equal(fs.readFileSync('docs/include.MD', 'utf8'), `@since ${version}`);
        assert.deepEqual(calls, []);
    });
});

test('prep-release rejects malformed and injected versions before writes', async () => {
    for (const nextversion of [void 0, true, ['1.2.3'], '1.2.3; echo injected',
        '1.2.3$(echo injected)', '1.2.3+$(echo injected)', 'v1.2.3', ' 1.2.3',
        '1.2.3\n', '1.2', '1.2.3-01']) {
        await withRelease({ nextversion }, async ({ task, calls }) => {
            const files = ['package.json', 'bower.json', 'build-properties.json'];
            const before = files.map(file => fs.readFileSync(file));
            await assert.rejects(task(), /provide either|complete semantic version/u);
            assert.deepEqual(files.map(file => fs.readFileSync(file)), before);
            assert.deepEqual(fs.readdirSync('.').sort(), files.sort());
            assert.deepEqual(calls, []);
        });
    }
});

test('prep-release handles absent doclets and stops after replacement errors', {
    skip: !nativeReleaseTools && 'requires the existing grep and sed release tools'
}, async () => {
    await withRelease({ nextversion: '13.2.0' }, async ({ task }) => {
        await task();
        assert.equal(JSON.parse(fs.readFileSync('package.json')).version, '13.2.0');
    });
    await withRelease({ nextversion: '13.2.0' }, async ({ task }) => {
        const before = fs.readFileSync('package.json');
        await assert.rejects(task(), /fixture replacement failure/u);
        assert.deepEqual(fs.readFileSync('package.json'), before);
    }, { failSed: true });
});

test('prep-release cleanup uses literal Git arguments and refuses staged commits', async () => {
    await withRelease({ cleanup: true, commit: true }, async ({ task, calls }) => {
        await task();
        assert.deepEqual(calls, [
            ['diff', '--cached', '--name-only'],
            ['add', 'build-properties.json'],
            ['commit', '-m', 'Cleaned up after v1.2.3.']
        ]);
        assert.equal(JSON.parse(fs.readFileSync('build-properties.json')).version, '1.2.3-modified');
    });
    await withRelease({ cleanup: true, commit: true }, async ({ task, calls }) => {
        await assert.rejects(task(), /other staged changes/u);
        assert.deepEqual(calls, [['diff', '--cached', '--name-only']]);
    }, { stagedChanges: 'other.ts\n' });
});
