import { describe, it } from 'node:test';
import { deepEqual, ok, rejects, strictEqual, throws } from 'node:assert';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runInNewContext } from 'node:vm';

const require = createRequire(import.meta.url);
const {
    releaseRepositoryMetadata,
    removeFilesInFolder,
    updateReleaseJSON
} = require('../gulptasks/dist-release.js');

async function writeFixtureFile(root, filePath) {
    const fullPath = join(root, ...filePath.split('/'));

    await mkdir(join(fullPath, '..'), { recursive: true });
    await writeFile(fullPath, 'fixture');
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

function loadRelease({ argv = {}, products = {}, answer = 'Y' } = {}) {
    const module = { exports: {} };
    const calls = [];
    const questions = [];
    const source = readFileSync(new URL('../gulptasks/dist-release.js', import.meta.url), 'utf8');
    runInNewContext(source + '\nmodule.exports = { getReleaseVersion, runGit, release };', {
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
            if (name === 'readline') {
                return {
                    createInterface() {
                        return {
                            question(text, callback) {
                                questions.push(text);
                                callback(answer);
                            },
                            close() {}
                        };
                    }
                };
            }
            return require(name);
        }
    });
    return { ...module.exports, calls, questions };
}

describe('dist-release manifest and Git boundary', () => {
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

    it('rejects missing, malformed and differing versions before repository changes', async () => {
        const { getReleaseVersion } = loadRelease();
        for (const nr of [void 0, null, 123, '', '1.2.3; echo unexpected',
            '1.2.3$(echo unexpected)', 'v1.2.3', ' 1.2.3', '1.2.3\n']) {
            throws(() => getReleaseVersion({ Highcharts: { nr } }, 'Highcharts'),
                /invalid release version/u);
        }
        throws(() => getReleaseVersion({ 'Other Highcharts': { nr: '1.2.3' } },
            'Highcharts'), /invalid release version/u);
        throws(() => getReleaseVersion({}, 'constructor'), /Unsupported release product/u);
        for (const products of [{ 'Highcharts Grid Lite': { nr: '1.2.3' } }, {
            'Highcharts Grid Lite': { nr: '1.2.3+build.1' },
            'Highcharts Grid Pro': { nr: '1.2.3+build.2' }
        }]) {
            const fixture = loadRelease({ argv: { product: 'Grid' }, products });
            await rejects(fixture.release(), /invalid release version|versions must match/u);
            deepEqual(fixture.calls, []);
        }
    });

    it('passes Git arguments literally in order for every release repository', async () => {
        for (const [product, repos] of [
            ['Highcharts', ['highcharts-dist']],
            ['Dashboards', ['dashboards-dist']],
            ['Grid', ['grid-lite-dist', 'grid-pro-dist']]
        ]) {
            const fixture = loadRelease({ argv: { forceYes: true } });
            const version = '1.2.3-rc.1+build.42';
            await fixture.runGit(version, true, product);
            deepEqual(fixture.calls, repos.flatMap(repo => [
                ['add', '--all'],
                ['commit', '-m', 'v' + version],
                ['tag', '-a', 'v' + version, '-m', `Tagged ${repo} version ${version}`],
                ['push'],
                ['push', 'origin', 'v' + version]
            ].map(args => ({ file: 'git', args, cwd: join('..', repo) }))));
            deepEqual(fixture.questions, []);
        }
    });

    it('preserves per-repository approval, dry runs and literal message boundaries', async () => {
        const approved = loadRelease();
        const version = '1.2.3$(echo unexpected)';
        await approved.runGit(version, true, 'Grid');
        strictEqual(approved.questions.length, 2);
        deepEqual(approved.calls[1].args, ['commit', '-m', 'v' + version]);
        const dryRun = loadRelease();
        await dryRun.runGit('1.2.3', false, 'Highcharts');
        deepEqual(dryRun.calls, []);
        deepEqual(dryRun.questions, []);
        for (const answer of ['n', 'y', '']) {
            const declined = loadRelease({ answer });
            await rejects(declined.runGit('1.2.3', true, 'Highcharts'), /Aborted/u);
            deepEqual(declined.calls, []);
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
