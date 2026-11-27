import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { lstatSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { stageCorePackage } from '../gulptasks/lib/release-package.js';
import { getReleaseVersion } from '../gulptasks/lib/release-version.js';
import { copyReleaseMetadata } from './release-metadata.mjs';

const usage = 'Usage: node stage-core.mjs <source-sha> <source-checkout> <dist-checkout> <metadata-revision> <new-output-dir>';
const args = process.argv.slice(2);
if (args[0] === '--help') {
    console.log(usage);
    process.exit(0);
}
const [sourceSha, sourceCheckout, distCheckout, metadataRevision, output] = args;
assert(args.length === 5 && args.every(Boolean) && /^[a-f0-9]{40}$/u.test(sourceSha), usage);

const sourceRoot = resolve(sourceCheckout);
const metadataRepo = resolve(distCheckout);
const destination = resolve(output);
const head = cwd => execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim();
assert.equal(head(sourceRoot), sourceSha, 'Built Core source SHA differs from the requested source revision');
assert.equal(head(metadataRepo), metadataRevision, 'Core metadata checkout differs from the requested revision');

const productsPath = join(sourceRoot, 'build', 'dist', 'products.js');
const products = JSON.parse(readFileSync(productsPath, 'utf8').replace(/^\s*var products = /u, ''));
const version = getReleaseVersion(products, 'Highcharts');
const entry = lstatSync(join(sourceRoot, 'code', 'highcharts.js'), { throwIfNoEntry: false });
assert(entry?.isFile() && entry.size > 0, 'Missing built Core entry: code/highcharts.js');

mkdirSync(destination);
try {
    await copyReleaseMetadata(metadataRepo, metadataRevision, destination);
    stageCorePackage({ sourceRoot, destination, version });
} catch (error) {
    rmSync(destination, { recursive: true, force: true });
    throw error;
}
