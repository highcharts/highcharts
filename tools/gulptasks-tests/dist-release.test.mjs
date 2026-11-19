import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { deepEqual, ok, rejects, strictEqual, throws } from 'node:assert';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { readPackResult } from '../nightly-package-validation-prototype/npm-pack.mjs';

const require = createRequire(import.meta.url);
const {
    releaseRepositoryMetadata,
    removeFilesInFolder,
    updateReleaseJSON
} = require('../gulptasks/dist-release.js');

async function writeFixtureFile(root, filePath, contents = 'fixture') {
    const fullPath = join(root, ...filePath.split('/'));

    await mkdir(join(fullPath, '..'), { recursive: true });
    await writeFile(fullPath, contents);
}

describe('dist-release cleanup', () => {
    it('preserves explicit repository metadata and removes stale files', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-dist-release-'));

        try {
            for (const filePath of [
                '.git/config',
                '.github/workflows/codeql.yml',
                '.gitignore',
                '.npmignore',
                'README.md',
                'LICENSE.txt',
                'SECURITY.md',
                'package.json',
                'bower.json',
                '.hidden-cruft',
                'highcharts.js',
                'modules/accessibility.js'
            ]) {
                await writeFixtureFile(root, filePath);
            }

            await removeFilesInFolder(root, releaseRepositoryMetadata);

            for (const filePath of [
                '.git/config',
                '.github/workflows/codeql.yml',
                '.gitignore',
                '.npmignore',
                'README.md',
                'LICENSE.txt',
                'SECURITY.md',
                'package.json',
                'bower.json'
            ]) {
                ok(
                    existsSync(join(root, ...filePath.split('/'))),
                    `${filePath} should survive cleanup`
                );
            }

            for (const filePath of [
                '.hidden-cruft',
                'highcharts.js',
                'modules/accessibility.js'
            ]) {
                ok(
                    !existsSync(join(root, ...filePath.split('/'))),
                    `${filePath} should be removed by cleanup`
                );
            }
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });

    it('preserves exact root repository metadata files', async () => {
        const root = await mkdtemp(join(tmpdir(), 'hc-dist-release-'));

        try {
            for (const filePath of [
                '.git',
                '.github',
                'highcharts.js'
            ]) {
                await writeFixtureFile(root, filePath);
            }

            await removeFilesInFolder(root, releaseRepositoryMetadata);

            for (const filePath of ['.git', '.github']) {
                ok(
                    existsSync(join(root, filePath)),
                    `${filePath} should survive cleanup`
                );
            }

            ok(
                !existsSync(join(root, 'highcharts.js')),
                'highcharts.js should be removed by cleanup'
            );
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });
});

describe('Grid release and pilot staging', () => {
    const { stageGridPackage } = require('../gulptasks/lib/release-package');

    it('reads a single npm pack result in both npm formats', () => {
        const name = '@highcharts/grid-lite';
        const packed = {
            name,
            filename: 'highcharts-grid-lite-3.2.1.tgz',
            integrity: 'sha512-example'
        };
        assert.deepEqual(readPackResult(JSON.stringify([packed]), name), packed);
        assert.deepEqual(readPackResult(JSON.stringify({ [name]: packed }), name), packed);
        assert.throws(() => readPackResult(JSON.stringify([packed, packed]), name),
            /Expected one npm pack result/u);
    });

    it('rejects a symlinked release manifest', {
        skip: process.platform === 'win32' && 'symlink creation requires privileges on Windows'
    }, async t => {
        const root = await mkdtemp(join(tmpdir(), 'hc-grid-manifest-'));
        t.after(() => rm(root, { recursive: true, force: true }));
        const source = join(root, 'source');
        const destination = join(root, 'destination');
        const manifest = join(destination, 'package.json');
        const original = '{"name":"@highcharts/grid-lite","version":"3.2.0"}';
        await writeFixtureFile(root, 'metadata.json', original);
        await mkdir(source);
        await mkdir(destination);
        fs.symlinkSync('../metadata.json', manifest);

        assert.throws(() => stageGridPackage(source, destination, '3.2.1'),
            /ELOOP|Expected Grid release manifest/u);
        assert.equal(fs.readFileSync(join(root, 'metadata.json'), 'utf8'), original);
        assert(fs.lstatSync(manifest).isSymbolicLink());
    });

    it('packs pinned release metadata and applies the same build filters', {
        skip: process.platform === 'win32' && 'nightly npm pack uses a POSIX runner'
    }, async t => {
        const root = fs.mkdtempSync(join(tmpdir(), 'hc-grid-package-'));
        t.after(() => fs.rmSync(root, { recursive: true, force: true }));
        const metadata = join(root, 'grid-lite-dist');
        const dist = join(root, 'build/dist');
        const code = join(dist, 'grid-lite/code');
        const version = '3.2.1';
        const css = '.grid { display: grid; }';
        const stageCLI = fileURLToPath(new URL(
            '../nightly-package-validation-prototype/stage-grid-lite.mjs', import.meta.url));
        const env = { ...process.env, npm_config_cache: join(root, 'npm-cache') };
        function git(cwd, ...args) {
            return execFileSync('git', [
                '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
                '-c', 'commit.gpgSign=false', ...args
            ], { cwd, encoding: 'utf8' }).trim();
        }
        function pilot(output, ...flags) {
            const directory = join(root, output);
            execFileSync(process.execPath, [
                stageCLI, sha, root, metadata, revision, directory, ...flags
            ], { env, stdio: 'pipe' });
            const manifest = JSON.parse(fs.readFileSync(join(directory, 'staging-manifest.json'), 'utf8'));
            ok(fs.statSync(join(directory, manifest.tarball)).size > 0);
            return manifest;
        }

        fs.mkdirSync(metadata);
        for (const [file, contents] of Object.entries({
            'package.json': JSON.stringify({
                name: '@highcharts/grid-lite', version: '3.2.0', main: 'grid.js',
                module: './esm/grid.js', types: './esm/grid.d.ts'
            }),
            '.github/workflows/release.yml': 'name: release',
            '.npmignore': 'ignored.js',
            'README.md': 'old README',
            'bower.json': '{}',
            'LICENSE.txt': 'license',
            'stale.js': 'previous build'
        })) {
            await writeFixtureFile(metadata, file, contents);
        }
        git(metadata, 'init', '-q');
        git(metadata, 'add', '.');
        git(metadata, 'commit', '-qm', 'Metadata');
        let revision = git(metadata, 'rev-parse', 'HEAD');

        git(root, 'init', '-q');
        git(root, 'commit', '--allow-empty', '-qm', 'Source');
        const sha = git(root, 'rev-parse', 'HEAD');
        for (const [file, contents] of Object.entries({
            'grid.js': 'module.exports = {};',
            'esm/grid.js': 'export default {};',
            'esm/grid.d.ts': 'export {};',
            'css/grid-lite.css': css,
            'README.md': 'built README',
            'package.json': '{}',
            'esm/package.json': '{}',
            'esm/ignored-package.json': '{}',
            '.hidden-build-file': 'unused',
            'ignored.js': 'npm exclusion'
        })) {
            await writeFixtureFile(code, file, contents);
        }
        fs.writeFileSync(join(dist, 'products.js'), 'var products = ' + JSON.stringify({
            'Highcharts Grid Lite': { nr: version }, 'Highcharts Grid Pro': { nr: version }
        }));

        // The pilot must still use the committed metadata after a local edit.
        const release = join(root, 'release');
        git(root, 'clone', '-q', metadata, release);
        fs.writeFileSync(join(metadata, 'bower.json'), 'uncommitted');
        await removeFilesInFolder(release, releaseRepositoryMetadata);
        stageGridPackage(code, release, version);
        const packed = readPackResult(execFileSync('npm', [
            'pack', release, '--ignore-scripts', '--json'
        ], { cwd: root, env, encoding: 'utf8' }), '@highcharts/grid-lite');
        const normal = pilot('normal');
        strictEqual(normal.integrity, packed.integrity);
        const files = normal.stagedFiles.map(([file]) => file);
        deepEqual(files, [
            '.github/workflows/release.yml', '.npmignore', 'LICENSE.txt',
            'README.md', 'bower.json', 'css/grid-lite.css', 'esm/grid.d.ts',
            'esm/grid.js', 'grid.js', 'ignored.js', 'package.json'
        ]);
        ok(!normal.packedFiles.includes('ignored.js'));
        strictEqual(fs.readFileSync(join(release, 'README.md'), 'utf8'), 'built README');
        const synthetic = pilot('synthetic', '--missing-css');
        fs.rmSync(join(code, 'css/grid-lite.css'));
        const real = pilot('missing');
        strictEqual(real.integrity, synthetic.integrity);
        ok(!real.packedFiles.includes('css/grid-lite.css'));
        strictEqual(real.missingCssControl, false);
        strictEqual(synthetic.missingCssControl, true);

        await writeFixtureFile(code, 'css/grid-lite.css', css);
        await writeFixtureFile(metadata, '.npmignore', 'css/grid-lite.css\nesm/grid.d.ts\n');
        git(metadata, 'commit', '-qm', 'Omit CSS and declarations from npm', '--', '.npmignore');
        revision = git(metadata, 'rev-parse', 'HEAD');
        const ignored = pilot('ignored');
        ok(ignored.stagedFiles.some(([path]) => path === 'css/grid-lite.css'));
        ok(!ignored.packedFiles.includes('css/grid-lite.css'));
        ok(ignored.stagedFiles.some(([path]) => path === 'esm/grid.d.ts'));
        ok(!ignored.packedFiles.includes('esm/grid.d.ts'));
        strictEqual(ignored.missingCssControl, false);

        revision = normal.metadataRevision;
        fs.rmSync(join(code, 'esm/grid.d.ts'));
        const missingEntry = pilot('missing-entry');
        ok(!missingEntry.stagedFiles.some(([path]) => path === 'esm/grid.d.ts'));
        ok(!missingEntry.packedFiles.includes('esm/grid.d.ts'));
    });
});

function loadRelease({ argv = {}, products = {} } = {}) {
    const module = { exports: {} };
    const calls = [];
    const source = readFileSync(new URL('../gulptasks/dist-release.js', import.meta.url), 'utf8');
    runInNewContext(source + '\nmodule.exports = { getReleaseVersion, release };', {
        module,
        process,
        require: name => {
            if (name === 'gulp') {
                return { task() {} };
            }
            if (name === 'yargs') {
                return { argv };
            }
            if (name === '../libs/log') {
                return { message() {} };
            }
            if (name.startsWith('./lib/')) {
                return require('../gulptasks/' + name.slice(2));
            }
            if (name === 'child_process') {
                return {
                    execSync() {
                        throw new Error('Unexpected shell execution');
                    },
                    execFileSync(file, args, options) {
                        calls.push({ file, args: [...args], cwd: options.cwd });
                    }
                };
            }
            if (name === 'fs-extra') {
                return {
                    readFile(file, encoding, callback) {
                        strictEqual(file, 'build/dist/products.js');
                        callback(null, 'var products = ' + JSON.stringify(products));
                    }
                };
            }
            return require(name);
        }
    });
    return { ...module.exports, calls };
}

describe('dist-release manifest validation', () => {
    it('selects exact product keys and preserves prerelease and build versions', () => {
        const { getReleaseVersion } = loadRelease();
        const version = '13.2.0-rc.1+build.42';
        const products = {
            'Other Highcharts': { nr: '13.2.0$(echo unexpected)' },
            Highcharts: { nr: version },
            'Highcharts Dashboards': { nr: version },
            'Highcharts Grid Lite': { nr: version },
            'Highcharts Grid Pro': { nr: version }
        };
        for (const product of ['Highcharts', 'Dashboards', 'Grid']) {
            strictEqual(getReleaseVersion(products, product), version);
        }
    });

    it('rejects injected, missing-product and differing versions before repository changes', async () => {
        const { getReleaseVersion } = loadRelease();
        for (const nr of ['1.2.3; echo unexpected', '1.2.3$(echo unexpected)', '1.2.3\n']) {
            throws(() => getReleaseVersion({ Highcharts: { nr } }, 'Highcharts'),
                /invalid release version/u);
        }
        throws(() => getReleaseVersion({ 'Other Highcharts': { nr: '1.2.3' } },
            'Highcharts'), /invalid release version/u);
        for (const products of [{ 'Highcharts Grid Lite': { nr: '1.2.3' } }, {
            'Highcharts Grid Lite': { nr: '1.2.3+build.1' },
            'Highcharts Grid Pro': { nr: '1.2.3+build.2' }
        }]) {
            const fixture = loadRelease({ argv: { product: 'Grid' }, products });
            await rejects(fixture.release(), /invalid release version|versions must match/u);
            deepEqual(fixture.calls, []);
        }
    });
});

describe('dist-release package metadata', () => {
    it('does not expose an ESM entry point in the release package', () => {
        // The UMD submodules in `modules/*.js` read the shared namespace from
        // `window._Highcharts`, which only the UMD bundle assigns. A `module`
        // field makes bundlers resolve the bare specifier to the pure ESM
        // bundle, while subpath imports still load UMD, so the namespace is
        // never assigned (#25072).
        const json = updateReleaseJSON(
            {
                main: 'highcharts.js',
                module: 'esm/highcharts.js'
            },
            'Highcharts'
        );

        ok(!('module' in json), 'module field should be stripped');
    });

    it('keeps types and optional peer dependencies in sync', () => {
        const json = updateReleaseJSON(
            {
                main: 'highcharts.js',
                dependencies: {
                    jspdf: '^4.1.0',
                    'svg2pdf.js': '^2.7.0'
                }
            },
            'Highcharts'
        );

        strictEqual(json.types, 'highcharts.d.ts');
        deepEqual(json.dependencies, {});
        deepEqual(json.peerDependencies, {
            jspdf: '^4.1.0',
            'svg2pdf.js': '^2.7.0'
        });
        deepEqual(json.peerDependenciesMeta, {
            jspdf: { optional: true },
            'svg2pdf.js': { optional: true }
        });
    });

    it('leaves other products untouched', () => {
        const json = updateReleaseJSON(
            { main: 'dashboards.js', module: 'esm/dashboards.js' },
            'Dashboards'
        );

        deepEqual(json, {
            main: 'dashboards.js',
            module: 'esm/dashboards.js'
        });
    });
});

describe('prep-release safe replacements', () => {
    const prepReleaseURL = new URL('../gulptasks/prep-release.js', import.meta.url);
    const nativeReleaseTools = ['grep', 'sed'].every(tool =>
        !spawnSync(tool, ['--version'], { stdio: 'ignore' }).error);

    async function withRelease(argv, check) {
        const root = fs.mkdtempSync(join(tmpdir(), 'hc-prep-release-'));
        const cwd = process.cwd();
        fs.writeFileSync(join(root, 'package.json'),
            '{\n  "version": "1.2.3",\n  "description": "unchanged"\n}\n');
        fs.writeFileSync(join(root, 'bower.json'),
            '{\n    "name": "fixture",\n    "version": "2.3.4"\n}\n');
        fs.writeFileSync(join(root, 'build-properties.json'),
            JSON.stringify({ version: '1.2.3-modified', date: '', other: true }));
        let task;
        runInNewContext(fs.readFileSync(prepReleaseURL, 'utf8'), {
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
                return require(name);
            }
        });
        process.chdir(root);
        try {
            await check({ root, task });
        } finally {
            process.chdir(cwd);
            fs.rmSync(root, { recursive: true, force: true });
        }
    }

    it('prep-release preserves versions, formatting, backups and doclet semantics', {
        skip: !nativeReleaseTools && 'requires the existing grep and sed release tools'
    }, async () => {
        const version = '13.2.0';
        // Keep the placeholder separate so release preparation cannot rewrite this test.
        const next = 'next';
        await withRelease({ nextversion: version }, async ({ root, task }) => {
            const originals = ['package.json', 'bower.json'].map(file => fs.readFileSync(file));
            fs.mkdirSync('docs');
            const text = `é @since\t ${next} @since ${next} @deprecated ${next} @deprecated ${next}\n` +
                `@since\n${next}\n@since {${next}}\n@since ${next}Thing\n`;
            fs.writeFileSync('docs/file with spaces.ts', text);
            if (process.platform !== 'win32') {
                fs.writeFileSync('docs/line\nbreak.ts', `@since ${next}`);
            }
            const binary = Buffer.concat([Buffer.from([0x01, 0]),
                Buffer.from(`@since ${next}\n`), Buffer.from([0x02])]);
            fs.writeFileSync('docs/bytes.dat', binary);
            fs.chmodSync('docs/bytes.dat', 0o664);
            fs.writeFileSync('docs/unicode.ts', '@since\u00a0next @deprecated\u3000next');
            const unicodeExpected = execFileSync('sed', ['-e',
                `s/@since\\([[:space:]][[:space:]]*\\)next/@since\\1${version}/; ` +
                `s/@deprecated\\([[:space:]][[:space:]]*\\)next/@deprecated\\1${version}/`,
                'docs/unicode.ts'], { encoding: 'utf8' });
            const untouched = ['node_modules/skip.ts', 'code/skip.ts',
                'docs/node_modules/skip.ts', 'docs/code/skip.ts', 'docs/skip.md', 'docs/skip.bak'];
            for (const file of untouched) {
                fs.mkdirSync(dirname(file), { recursive: true });
                fs.writeFileSync(file, `@since ${next}`);
            }
            fs.symlinkSync(join(root, 'node_modules/skip.ts'), 'docs/link.ts');
            fs.symlinkSync(join(root, 'node_modules'), 'docs/linked-directory');
            fs.mkdirSync('.hidden');
            fs.writeFileSync('.hidden/doc.txt', `@deprecated ${next}`);
            fs.writeFileSync('docs/include.MD', `@since ${next}`);
            fs.writeFileSync('sentinel', 'untouched');
            fs.symlinkSync(join(root, 'sentinel'), 'package.json.bak');

            await task();

            for (const [index, file] of ['package.json', 'bower.json'].entries()) {
                assert.deepEqual(fs.readFileSync(file + '.bak'), originals[index]);
                assert.equal(fs.readFileSync(file, 'utf8'), originals[index].toString()
                    .replace(index ? '2.3.4' : '1.2.3', version));
            }
            assert.equal(fs.readFileSync('sentinel', 'utf8'), 'untouched');
            assert.equal(fs.readFileSync('docs/file with spaces.ts', 'utf8'),
                `é @since\t ${version} @since ${next} @deprecated ${version} @deprecated ${next}\n` +
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
                assert.equal(fs.readFileSync(file, 'utf8'), `@since ${next}`);
            }
            assert.equal(fs.readFileSync('.hidden/doc.txt', 'utf8'), `@deprecated ${version}`);
            assert.equal(fs.readFileSync('docs/include.MD', 'utf8'), `@since ${version}`);
        });
    });

    it('prep-release preserves pending doclets for suffixed versions', {
        skip: !nativeReleaseTools && 'requires the existing grep and sed release tools'
    }, async () => {
        const next = 'next';
        for (const version of ['13.2.0-rc.1', '13.2.0+build.42',
            '13.2.0-rc.1+build.42']) {
            await withRelease({ nextversion: version }, async ({ task }) => {
                const files = ['package.json', 'bower.json'];
                const originals = files.map(file => fs.readFileSync(file));
                const doclet = `/**\n * @since ${next}\n * @deprecated ${next}\n */\n`;
                fs.mkdirSync('docs');
                fs.writeFileSync('docs/pending.ts', doclet);

                await task();

                for (const file of [...files, 'build-properties.json']) {
                    strictEqual(JSON.parse(fs.readFileSync(file, 'utf8')).version, version);
                }
                for (const [index, file] of files.entries()) {
                    assert.deepEqual(fs.readFileSync(file + '.bak'), originals[index]);
                }
                strictEqual(fs.readFileSync('docs/pending.ts', 'utf8'), doclet);
                strictEqual(fs.existsSync('docs/pending.ts.bak'), false);
            });
        }
    });

    it('prep-release rejects injected versions before writes', async () => {
        for (const nextversion of ['1.2.3; echo injected',
            '1.2.3$(echo injected)', '1.2.3+$(echo injected)', '1.2.3\n']) {
            await withRelease({ nextversion }, async ({ task }) => {
                const files = ['package.json', 'bower.json', 'build-properties.json'];
                const before = files.map(file => fs.readFileSync(file));
                await assert.rejects(task(), /complete semantic version/u);
                assert.deepEqual(files.map(file => fs.readFileSync(file)), before);
                assert.deepEqual(fs.readdirSync('.').sort(), files.sort());
            });
        }
    });
});
