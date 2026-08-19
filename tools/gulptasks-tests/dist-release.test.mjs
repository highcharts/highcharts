import { describe, it } from 'node:test';
import { ok } from 'node:assert';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const require = createRequire(import.meta.url);
const {
    releaseRepositoryMetadata,
    removeFilesInFolder
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
