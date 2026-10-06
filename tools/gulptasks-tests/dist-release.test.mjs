import { describe, it } from 'node:test';
import { deepEqual, ok, strictEqual } from 'node:assert';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

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
