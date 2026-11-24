import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
    closeSync, constants, existsSync, fstatSync, lstatSync, openSync, readFileSync,
    readdirSync, realpathSync, writeFileSync
} from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPackResult } from './npm-pack.mjs';

const sha256Pattern = /^[a-f0-9]{64}$/u;
const shaPattern = /^[a-f0-9]{40}$/u;
const runNumber = /^[1-9]\d*$/u;
const link = 'candidate/provenance.json';
export const gridPackages = ['grid-lite', 'grid-pro'];

export function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

export function hash(path, algorithm = 'sha256', encoding = 'hex') {
    return createHash(algorithm).update(readFileSync(path)).digest(encoding);
}

export function readJSON(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJSON(path, value) {
    writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
}

export function fileInventory(root, excludeGit = false) {
    assert(lstatSync(root).isDirectory(), 'Expected a package directory');
    const files = [];
    function visit(folder = '') {
        for (const entry of readdirSync(join(root, folder), { withFileTypes: true })) {
            const { name } = entry;
            if (excludeGit && !folder && name === '.git') {
                continue;
            }
            const relativePath = folder ? `${folder}/${name}` : name;
            const path = join(root, relativePath);
            assert(name !== '.git', `Unexpected Git metadata: ${relativePath}`);
            if (entry.isDirectory()) {
                visit(relativePath);
            } else {
                assert(entry.isFile(), `Unexpected file type: ${relativePath}`);
                const fd = openSync(path, constants.O_RDONLY |
                    (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
                try {
                    assert(fstatSync(fd).isFile(), `Unexpected file type: ${relativePath}`);
                    files.push([relativePath, sha256(readFileSync(fd))]);
                } finally {
                    closeSync(fd);
                }
            }
        }
    }
    visit();
    return files.sort(([left], [right]) => (left < right ? -1 : Number(left > right)));
}

export function candidateFiles(packageName, provenance) {
    if (provenance === 'tarball-only') {
        return [];
    }
    assert.equal(provenance, 'nightly', 'Unknown candidate provenance');
    if (gridPackages.some(gridPackage => packageName === `@highcharts/${gridPackage}`)) {
        return [link, 'candidate/staging-manifest.json'];
    }
    assert.equal(packageName, 'highcharts', 'Unexpected candidate package');
    return [link, 'candidate/build-manifest.json', 'candidate/pack.json'];
}

function requiredFile(root, name) {
    const path = join(root, name);
    assert(lstatSync(path, { throwIfNoEntry: false })?.isFile(), `Required package evidence unavailable: ${name}`);
    return path;
}

export function nightlyIdentity() {
    return {
        sourceSha: process.env.GITHUB_SHA,
        runId: process.env.GITHUB_RUN_ID,
        attempt: process.env.GITHUB_RUN_ATTEMPT
    };
}

export function recordCandidateEvidence(root, packageName, identity) {
    const [, ...names] = candidateFiles(packageName, 'nightly');
    const records = {};
    for (const name of names) {
        records[name] = hash(requiredFile(root, name));
    }
    const tarballSha256 = hash(requiredFile(root, 'candidate/candidate.tgz'));
    writeJSON(join(root, link), {
        sourceSha: identity.sourceSha,
        runId: identity.runId,
        attempt: identity.attempt,
        packageName,
        tarballSha256,
        records
    });
    return tarballSha256;
}

export function verifyCandidateEvidence(root, packageName, identity, expectedDigest) {
    const attempt = Number(identity.attempt);
    assert(shaPattern.test(identity.sourceSha) && runNumber.test(identity.runId) &&
        runNumber.test(identity.attempt) && Number.isSafeInteger(attempt),
    'Expected the Nightly source SHA, run ID and attempt');
    const [linkName, buildName, packName] = candidateFiles(packageName, 'nightly');
    const linkPath = requiredFile(root, linkName);
    const record = readJSON(linkPath);
    assert.equal(record.packageName, packageName, 'Candidate provenance package mismatch');
    for (const key of ['sourceSha', 'runId', 'attempt']) {
        assert.equal(record[key], identity[key], `Candidate provenance ${key} mismatch`);
    }
    const tarball = requiredFile(root, 'candidate/candidate.tgz');
    const digest = hash(tarball);
    assert.equal(digest, expectedDigest, 'Candidate tarball digest mismatch');
    assert.equal(record.tarballSha256, digest, 'Candidate provenance tarball digest mismatch');
    const buildPath = requiredFile(root, buildName);
    assert.equal(hash(buildPath), record.records?.[buildName], `Candidate manifest digest mismatch: ${buildName}`);
    const build = readJSON(buildPath);
    assert.equal(build.sourceSha, identity.sourceSha, 'Candidate manifest source SHA mismatch');

    let staged, inventoryDigest, paths, version, integrity;
    if (packName) {
        assert.equal(build.runId, identity.runId, 'Build manifest run ID mismatch');
        // A failed-job retry can reuse the successful distribution from an earlier attempt.
        assert(runNumber.test(build.buildAttempt) && Number(build.buildAttempt) <= attempt,
            'Build manifest attempt mismatch');
        const packPath = requiredFile(root, packName);
        assert.equal(hash(packPath), record.records?.[packName], 'Candidate pack record digest mismatch');
        const pack = readPackResult(readFileSync(packPath, 'utf8'), packageName);
        ({ version, integrity } = pack);
        paths = pack.files?.map(file => file.path?.replace(/^\.\//u, ''));
        ({ files: staged, directorySha256: inventoryDigest } = build);
    } else {
        const product = packageName === '@highcharts/grid-lite' ? 'Grid Lite' : 'Grid Pro';
        assert.equal(build.package, packageName, `${product} staging package mismatch`);
        assert.equal(build.runId, identity.runId, `${product} staging run ID mismatch`);
        assert.equal(build.attempt, identity.attempt, `${product} staging attempt mismatch`);
        assert.equal(build.tarballSha256, digest, `${product} staging tarball digest mismatch`);
        ({ version, integrity, packedFiles: paths, stagedFiles: staged, stagedInventorySha256: inventoryDigest } = build);
        assert.equal(staged?.find(([name]) => name === 'package.json')?.[1], build.packageManifestSha256,
            `${product} staged package manifest digest mismatch`);
    }
    assert.equal(`sha512-${hash(tarball, 'sha512', 'base64')}`, integrity, 'Candidate pack integrity mismatch');
    assert(typeof version === 'string' && version, 'Candidate pack version unavailable');
    assert(Array.isArray(staged) && sha256(JSON.stringify(staged)) === inventoryDigest,
        'Candidate manifest inventory digest mismatch');
    assert(Array.isArray(paths) && paths.includes('package.json') && paths.length === new Set(paths).size,
        'Candidate pack file inventory unavailable or ambiguous');
    const stagedDigests = new Map(staged);
    assert.equal(stagedDigests.size, staged.length, 'Candidate manifest file inventory contains duplicates');
    const files = paths.sort().map(name => {
        assert(typeof name === 'string' && !name.includes('\\') &&
            name.split('/').every(part => part && part !== '.' && part !== '..'),
        `Unexpected candidate pack path: ${name}`);
        const fileDigest = stagedDigests.get(name);
        assert(sha256Pattern.test(fileDigest), `Packed file missing from candidate manifest: ${name}`);
        return [name, fileDigest];
    });
    return { provenanceSha256: hash(linkPath), packageName, version, files };
}

export function verifyInstalledCandidate(installed, expected) {
    const files = new Map(fileInventory(installed));
    for (const [name, digest] of expected.files) {
        assert(files.has(name), `Installed candidate is missing a packed file: ${name}`);
        assert.equal(files.get(name), digest, `Installed candidate file digest mismatch: ${name}`);
        files.delete(name);
    }
    assert.equal(files.size, 0, `Installed candidate contains an unpacked file: ${files.keys().next().value}`);
    const pkg = readJSON(join(installed, 'package.json'));
    assert.equal(pkg.name, expected.packageName, 'Installed candidate package differs from npm pack');
    assert.equal(pkg.version, expected.version,
        'Installed candidate version differs from npm pack');
}

const isMain = import.meta.main ?? (
    process.argv[1] && existsSync(process.argv[1]) &&
    realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
);
if (isMain) {
    const [root, packageName] = process.argv.slice(2);
    const usage = 'Usage: node package-evidence.mjs <prepared-consumer-directory> <highcharts|@highcharts/grid-lite|@highcharts/grid-pro>';
    if (root === '--help') {
        process.stdout.write(usage + '\n');
    } else {
        assert(root && packageName, usage);
        const identity = nightlyIdentity();
        const digest = recordCandidateEvidence(root, packageName, identity);
        verifyCandidateEvidence(root, packageName, identity, digest);
    }
}
