#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
    copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync,
    rmSync, writeFileSync
} from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { getReleaseVersion } from '../gulptasks/lib/release-version.js';
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
const requiredMetadata = [
    '.gitignore', 'LICENSE.txt', 'README.md', 'package.json'
];
const optionalMetadata = ['.npmignore', 'SECURITY.md'];

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

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

function copyCodeFiles(source, destination, paths = []) {
    for (const entry of readdirSync(source, { withFileTypes: true })) {
        const sourcePath = join(source, entry.name);
        const destinationPath = join(destination, entry.name);
        const relativePath = [...paths, entry.name].join('/');
        assert(!entry.isSymbolicLink(), `Unexpected symlink in build output: ${relativePath}`);
        if (entry.isDirectory()) {
            assert(!existsSync(destinationPath),
                `Grid Lite build output collides with release metadata: ${relativePath}`);
            mkdirSync(destinationPath);
            copyCodeFiles(sourcePath, destinationPath, [...paths, entry.name]);
        } else {
            assert(entry.isFile(), `Unexpected build output type: ${relativePath}`);
            assert(!existsSync(destinationPath),
                `Grid Lite build output collides with release metadata: ${relativePath}`);
            copyFileSync(sourcePath, destinationPath);
        }
    }
}

function inventory(root) {
    const files = [];
    function visit(directory) {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) {
                visit(path);
            } else {
                assert(entry.isFile(), `Unexpected staged package file type: ${path}`);
                const name = relative(root, path).split(sep).join('/');
                files.push([name, sha256(readFileSync(path))]);
            }
        }
    }
    visit(root);
    files.sort(([left], [right]) => left < right ? -1 : Number(left > right));
    return files;
}

let createdOutput = false;
try {
    assert(lstatSync(codeDirectory).isDirectory(), `Grid Lite build directory unavailable: ${codeDirectory}`);
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

    for (const file of [...requiredMetadata, ...optionalMetadata]) {
        if (optionalMetadata.includes(file) &&
            spawnSync('git', ['cat-file', '-e', `${revision}:${file}`], {
                cwd: metadataRepo,
                stdio: 'ignore'
            }).status !== 0) {
            continue;
        }
        writeFileSync(join(packageDirectory, file), metadataAtRevision(file));
    }
    const packageJson = JSON.parse(readFileSync(join(packageDirectory, 'package.json'), 'utf8'));
    assert.equal(packageJson.name, packageName, 'Metadata is not for Grid Lite');
    packageJson.version = liteVersion;
    writeFileSync(join(packageDirectory, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n');

    copyCodeFiles(codeDirectory, packageDirectory);
    const cssPath = join(packageDirectory, 'css', 'grid-lite.css');
    assert(lstatSync(cssPath).isFile(), 'Grid Lite build is missing css/grid-lite.css');
    if (missingCss) {
        rmSync(cssPath);
    }

    const files = inventory(packageDirectory);
    for (const entry of [packageJson.main, packageJson.module, packageJson.types]) {
        assert(files.some(([path]) => path === entry || path === entry.replace(/^\.\//u, '')),
            `Grid Lite package entry is missing from staging: ${entry}`);
    }
    const packageManifestSha256 = sha256(readFileSync(join(packageDirectory, 'package.json')));
    const pack = spawnSync('npm', ['pack', packageDirectory, '--ignore-scripts', '--json', '--pack-destination', outputDirectory], {
        cwd: outputDirectory,
        encoding: 'utf8'
    });
    assert.equal(pack.status, 0, pack.stderr || 'npm pack failed');
    const [packed] = JSON.parse(pack.stdout);
    assert.equal(packed.name, packageName, 'npm packed an unexpected package');
    assert.equal(packed.version, liteVersion, 'npm packed an unexpected version');
    const packedFiles = new Set(packed.files.map(file => file.path.replace(/^\.\//u, '')));
    for (const entry of [packageJson.main, packageJson.module, packageJson.types]) {
        assert(packedFiles.has(entry.replace(/^\.\//u, '')),
            `npm pack omitted declared Grid Lite package entry: ${entry}`);
    }
    assert.equal(packedFiles.has('css/grid-lite.css'), !missingCss,
        'npm pack CSS contents do not match the requested staging mode');
    const tarball = join(outputDirectory, packed.filename);
    const manifest = {
        package: packageName,
        version: liteVersion,
        sourceSha,
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
