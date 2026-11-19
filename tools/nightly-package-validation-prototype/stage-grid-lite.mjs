#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
    chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { releaseRepositoryMetadata, stageGridPackage } from '../gulptasks/lib/release-package.js';
import { getReleaseVersion } from '../gulptasks/lib/release-version.js';
import { readPackResult } from './npm-pack.mjs';
import { fileInventory, sha256 } from './package-evidence.mjs';
const [sourceSha, sourceRepoArg, metadataRepoArg, metadataRevision, outputArg, ...flags] =
    process.argv.slice(2);
const usage = 'Usage: node stage-grid-lite.mjs <source-sha> <source-checkout> <grid-lite-dist-checkout> <metadata-revision> <new-output-dir> [--missing-css]';
if (process.argv.includes('--help')) {
    console.log(usage);
    process.exit(0);
}
assert(/^[a-f0-9]{40}$/u.test(sourceSha) && sourceRepoArg && metadataRepoArg &&
    metadataRevision && outputArg &&
    flags.every(flag => flag === '--missing-css') && flags.length <= 1, usage);

const sourceRepo = resolve(sourceRepoArg);
const codeDirectory = join(sourceRepo, 'build', 'dist', 'grid-lite', 'code');
const productsPath = join(sourceRepo, 'build', 'dist', 'products.js');
const metadataRepo = resolve(metadataRepoArg);
const outputDirectory = resolve(outputArg);
const packageDirectory = join(outputDirectory, 'package');
const missingCss = flags.includes('--missing-css');
const packageName = '@highcharts/grid-lite';

function git(args) {
    const result = spawnSync('git', args, {
        cwd: metadataRepo,
        encoding: 'utf8'
    });
    assert.equal(result.status, 0, result.stderr || `git ${args.join(' ')} failed`);
    return result.stdout.trim();
}

function metadataAtRevision(file) {
    const result = spawnSync('git', ['show', `${metadataRevision}:${file}`], {
        cwd: metadataRepo,
        encoding: null
    });
    assert.equal(result.status, 0, `Metadata file unavailable at ${metadataRevision}: ${file}`);
    return result.stdout;
}

let createdOutput = false;
try {
    const revision = git(['rev-parse', '--verify', `${metadataRevision}^{commit}`]);
    assert.equal(revision, metadataRevision, 'Pass a full immutable metadata commit SHA');
    const sourceHead = spawnSync('git', ['rev-parse', 'HEAD'], {
        cwd: sourceRepo,
        encoding: 'utf8'
    });
    assert.equal(sourceHead.status, 0, 'Built Grid Lite code must be inside a Git source checkout');
    assert.equal(sourceHead.stdout.trim(), sourceSha,
        'Built Grid Lite source SHA differs from the requested source revision');

    const productsSource = readFileSync(productsPath, 'utf8').replace(/^\s*var products = /u, '');
    const products = JSON.parse(productsSource);
    const liteVersion = getReleaseVersion(products, 'Grid');

    mkdirSync(outputDirectory, { recursive: false });
    createdOutput = true;
    mkdirSync(packageDirectory);

    const entries = git(['ls-tree', '-r', '-z', '--full-tree', revision]).split('\0').filter(Boolean);
    for (const entry of entries) {
        const separator = entry.indexOf('\t');
        const file = entry.slice(separator + 1);
        if (releaseRepositoryMetadata.some(pattern => file.match(pattern))) {
            assert(!file.includes('\\'), `Unexpected metadata path: ${file}`);
            const mode = entry.slice(0, 6);
            assert(mode === '100644' || mode === '100755', `Expected regular release metadata: ${file}`);
            const destination = join(packageDirectory, file);
            mkdirSync(dirname(destination), { recursive: true });
            writeFileSync(destination, metadataAtRevision(file));
            chmodSync(destination, mode === '100755' ? 0o755 : 0o644);
        }
    }
    const packageJson = stageGridPackage(codeDirectory, packageDirectory, liteVersion);
    assert.equal(packageJson.name, packageName, 'Metadata is not for Grid Lite');
    if (missingCss) {
        rmSync(join(packageDirectory, 'css', 'grid-lite.css'), { force: true });
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
    assert.equal(packed.version, liteVersion, 'npm packed an unexpected version');
    assert.deepEqual(fileInventory(packageDirectory), files, 'Grid Lite staging changed during npm pack');
    const tarball = join(outputDirectory, packed.filename);
    const manifest = {
        package: packageName,
        version: liteVersion,
        sourceSha,
        runId: process.env.GITHUB_RUN_ID,
        attempt: process.env.GITHUB_RUN_ATTEMPT,
        metadataRevision: revision,
        metadataPackageJsonSha256: sha256(metadataAtRevision('package.json')),
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
        version: liteVersion,
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
