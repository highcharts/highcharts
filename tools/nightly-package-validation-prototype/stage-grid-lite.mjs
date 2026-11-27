#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { stageGridPackage } from '../gulptasks/lib/release-package.js';
import { getReleaseVersion } from '../gulptasks/lib/release-version.js';
import { readPackResult } from './npm-pack.mjs';
import { fileInventory, gridPackages, sha256 } from './package-evidence.mjs';
import { copyReleaseMetadata } from './release-metadata.mjs';
const usage = 'Usage: node stage-grid-lite.mjs <source-sha> <source-checkout> <dist-checkout> <metadata-revision> <new-output-dir> [--package grid-lite|grid-pro] [--missing-css]';
if (process.argv.includes('--help')) {
    console.log(usage);
    process.exit(0);
}
const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
        package: { type: 'string', default: 'grid-lite' },
        'missing-css': { type: 'boolean', default: false }
    }
});
const [sourceSha, sourceRepoArg, metadataRepoArg, metadataRevision, outputArg] = positionals;
const packageKey = values.package;
assert(positionals.length === 5 && /^[a-f0-9]{40}$/u.test(sourceSha) && sourceRepoArg && metadataRepoArg &&
    /^[a-f0-9]{40}$/u.test(metadataRevision) && outputArg &&
    gridPackages.includes(packageKey), usage);

const sourceRepo = resolve(sourceRepoArg);
const codeDirectory = join(sourceRepo, 'build', 'dist', packageKey, 'code');
const productsPath = join(sourceRepo, 'build', 'dist', 'products.js');
const metadataRepo = resolve(metadataRepoArg);
const outputDirectory = resolve(outputArg);
const packageDirectory = join(outputDirectory, 'package');
const missingCss = values['missing-css'];
const packageName = `@highcharts/${packageKey}`;

let createdOutput = false;
try {
    const sourceHead = spawnSync('git', ['rev-parse', 'HEAD'], {
        cwd: sourceRepo,
        encoding: 'utf8'
    });
    assert.equal(sourceHead.status, 0, 'Built Grid code must be inside a Git source checkout');
    assert.equal(sourceHead.stdout.trim(), sourceSha,
        'Built Grid source SHA differs from the requested source revision');

    const productsSource = readFileSync(productsPath, 'utf8').replace(/^\s*var products = /u, '');
    const products = JSON.parse(productsSource);
    const gridVersion = getReleaseVersion(products, 'Grid');

    mkdirSync(outputDirectory, { recursive: false });
    createdOutput = true;
    mkdirSync(packageDirectory);

    await copyReleaseMetadata(metadataRepo, metadataRevision, packageDirectory);
    const metadataPackageJsonSha256 = sha256(readFileSync(join(packageDirectory, 'package.json')));
    const packageJson = stageGridPackage(codeDirectory, packageDirectory, gridVersion);
    assert.equal(packageJson.name, packageName, `Expected ${packageName} metadata`);
    if (missingCss) {
        rmSync(join(packageDirectory, 'css', `${packageKey}.css`), { force: true });
    }

    const files = fileInventory(packageDirectory);
    const packageManifest = files.find(([name]) => name === 'package.json');
    assert(packageManifest, 'Missing staged package manifest');
    const [, packageManifestSha256] = packageManifest;
    const pack = spawnSync('npm', ['pack', packageDirectory, '--ignore-scripts', '--json', '--pack-destination', outputDirectory], {
        cwd: outputDirectory,
        encoding: 'utf8'
    });
    assert.equal(pack.status, 0, pack.stderr || 'npm pack failed');
    const packed = readPackResult(pack.stdout, packageName);
    assert.equal(packed.version, gridVersion, 'npm packed an unexpected version');
    assert.deepEqual(fileInventory(packageDirectory), files, 'Grid staging changed during npm pack');
    const tarball = join(outputDirectory, packed.filename);
    const manifest = {
        package: packageName,
        version: gridVersion,
        sourceSha,
        runId: process.env.GITHUB_RUN_ID,
        attempt: process.env.GITHUB_RUN_ATTEMPT,
        metadataRevision,
        metadataPackageJsonSha256,
        packageManifestSha256,
        missingCssControl: missingCss,
        stagedFiles: files,
        stagedInventorySha256: sha256(JSON.stringify(files)),
        packedFiles: packed.files.map(file => file.path.replace(/^\.\//u, '')).sort(),
        tarball: packed.filename,
        tarballSha256: sha256(readFileSync(tarball)),
        integrity: packed.integrity
    };
    writeFileSync(join(outputDirectory, 'staging-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
    console.log(JSON.stringify({
        outputDirectory,
        package: packageName,
        version: gridVersion,
        tarball,
        tarballSha256: manifest.tarballSha256,
        stagedInventorySha256: manifest.stagedInventorySha256,
        missingCssControl: missingCss
    }, null, 2));
} catch (error) {
    if (createdOutput) {
        rmSync(outputDirectory, { recursive: true, force: true });
    }
    console.error(error.message);
    process.exitCode = 1;
}
