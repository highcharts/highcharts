/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable max-len, complexity */

const { createHash } = require('node:crypto');
const FS = require('node:fs/promises');
const Path = require('node:path');

const PRODUCTS = ['highcharts', 'highstock', 'highmaps', 'gantt'];
const MANIFEST = 'react-static-manifest.json';
const INVENTORY = 'react-static-files.jsonl';
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};
const PRESERVED_PREFIXES = [
    ...PRODUCTS.map(product => `${product}/react/`),
    'react-assets/',
    'react-data/'
];

function sha256(content) {
    return createHash('sha256').update(content).digest('hex');
}

function fail(message) {
    throw new Error(`Invalid static React artifact: ${message}`);
}

function samePaths(actual, expected) {
    return Array.isArray(actual) && actual.length === expected.length &&
        new Set(actual).size === actual.length &&
        expected.every(value => actual.includes(value));
}

function isReactOwnedKey(key) {
    return key === MANIFEST || key === INVENTORY ||
        PRESERVED_PREFIXES.some(prefix =>
            key === prefix.slice(0, -1) || key.startsWith(prefix));
}

function validatePath(key) {
    if (typeof key !== 'string' || !key || key.includes('\\') ||
        key.includes('\0') || key.split('/').some(part =>
        !part || part === '.' || part === '..')) {
        fail(`unsafe inventory path ${JSON.stringify(key)}`);
    }
}

// Check each component, including directories, before reading or staging files.
async function filePath(root, key, createDirectories = false) {
    validatePath(key);
    let directory = root;
    const parts = key.split('/');
    for (const part of parts.slice(0, -1)) {
        directory = Path.join(directory, part);
        if (createDirectories) {
            await FS.mkdir(directory).catch(error => {
                if (error.code !== 'EEXIST') {
                    throw error;
                }
            });
        }
        const info = await FS.lstat(directory);
        if (!info.isDirectory() || info.isSymbolicLink()) {
            fail(`unsafe directory ${key}`);
        }
    }
    const result = Path.join(directory, parts.at(-1));
    const info = await FS.lstat(result).catch(error => {
        if (createDirectories && error.code === 'ENOENT') {
            return;
        }
        throw error;
    });
    if (info && (!info.isFile() || info.isSymbolicLink())) {
        fail(`inventory path is not a regular file: ${key}`);
    }
    return result;
}

async function readRecord(root, record) {
    const content = await FS.readFile(await filePath(root, record.path));
    if (content.length !== record.bytes || sha256(content) !== record.sha256) {
        fail(`size or SHA-256 mismatch for ${record.path}`);
    }
    return content;
}

function validateManifest(manifest, options) {
    if (!options.expectedReactVersion || !options.expectedHighchartsVersion) {
        fail('both expected React and Highcharts versions are required');
    }
    if (manifest?.formatVersion !== 1 || manifest.complete !== true ||
        manifest.publishable !== true || manifest.pageSuffix !== '.html' ||
        !samePaths(manifest.products, PRODUCTS) ||
        typeof manifest.release !== 'string' ||
        !/^[a-z0-9][a-z0-9._-]{0,79}$/u.test(manifest.release) ||
        manifest.assetsBase !== `/react-assets/${manifest.release}/` ||
        manifest.dataBase !== `/react-data/${manifest.release}/` ||
        manifest.inventory?.path !== INVENTORY ||
        !/^[a-f0-9]{64}$/u.test(manifest.inventory?.sha256 || '') ||
        !Number.isSafeInteger(manifest.inventory.files) || manifest.inventory.files < 1 ||
        !Number.isSafeInteger(manifest.inventory.bytes) || manifest.inventory.bytes < 0 ||
        !Array.isArray(manifest.warnings?.malformedPaths) || manifest.warnings.malformedPaths.length ||
        !Array.isArray(manifest.warnings?.emptyResponses) || manifest.warnings.emptyResponses.length ||
        !/^[a-f0-9]{64}$/u.test(manifest.source?.contentSha256 || '') ||
        !/^[a-f0-9]{64}$/u.test(manifest.generator?.sourceSha256 || '')) {
        fail('manifest is incomplete, not publishable, or uses an unsupported contract');
    }
    const shells = PRODUCTS.map(product => `${product}/react/index.html`);
    if (!samePaths(manifest.publication?.immutablePrefixes, [manifest.assetsBase, manifest.dataBase]) ||
        !samePaths(manifest.publication?.mutableShells, shells) ||
        !samePaths(Object.keys(manifest.routing?.shells || {}), PRODUCTS) ||
        PRODUCTS.some(product => manifest.routing.shells[product] !== `${product}/react/index.html`) ||
        manifest.routing.unknownDocumentStatus !== 200 || manifest.routing.missingDataStatus !== 404 ||
        (manifest.routing.leafData !== void 0 && manifest.routing.leafData !== 'parent')) {
        fail('routing or publication prefixes do not match the contract');
    }
    const versions = manifest.source.sourceVersions;
    if (versions?.react !== options.expectedReactVersion ||
        PRODUCTS.some(product => versions?.[product] !== options.expectedHighchartsVersion)) {
        fail('source version mismatch');
    }
    if (!samePaths(Object.keys(manifest.stats || {}), PRODUCTS) ||
        PRODUCTS.some(product =>
            !Number.isSafeInteger(manifest.stats[product]?.pages) || manifest.stats[product].pages < 0 ||
            !Number.isSafeInteger(manifest.stats[product]?.jsonBytes) || manifest.stats[product].jsonBytes < 0)) {
        fail('invalid product statistics');
    }
}

function recordKind(record, manifest) {
    validatePath(record?.path);
    if (!Number.isSafeInteger(record.bytes) || record.bytes < 0 ||
        !/^[a-f0-9]{64}$/u.test(record.sha256 || '')) {
        fail(`invalid file metadata for ${record.path}`);
    }
    const type = CONTENT_TYPES[Path.posix.extname(record.path)];
    const shell = PRODUCTS.some(product => record.path === `${product}/react/index.html`);
    if (!type || record.contentType !== type ||
        record.cacheControl !== (shell ? 'no-cache' : IMMUTABLE_CACHE)) {
        fail(`invalid publication metadata for ${record.path}`);
    }
    if (shell) {
        return 'shell';
    }
    const assetPrefix = manifest.assetsBase.slice(1);
    if (record.path.startsWith(assetPrefix) &&
        !record.path.slice(assetPrefix.length).includes('/') &&
        Path.posix.extname(record.path) !== '.html') {
        return 'asset';
    }
    const dataPrefix = manifest.dataBase.slice(1);
    if (record.path.startsWith(dataPrefix)) {
        const [product, directory, filename, ...extra] = record.path.slice(dataPrefix.length).split('/');
        if (PRODUCTS.includes(product) && !extra.length) {
            if (directory === 'search.json' && filename === void 0) {
                return 'search';
            }
            if (directory === 'nav' && filename === 'index.json') {
                return 'index';
            }
            if (directory === 'nav' && typeof filename === 'string' &&
                Buffer.byteLength(filename) <= 255 &&
                /^(?:[a-z0-9_$-]|~[a-z])+(?:\.(?:[a-z0-9_$-]|~[a-z])+)*\.json$/u.test(filename) &&
                filename.slice(0, -5).split('.').length <= 32) {
                return 'detail';
            }
        }
    }
    return fail(`unowned inventory path ${record.path}`);
}

async function inBatches(items, callback) {
    for (let offset = 0; offset < items.length; offset += 16) {
        const results = await Promise.allSettled(items.slice(offset, offset + 16).map(callback));
        const failure = results.find(result => result.status === 'rejected');
        if (failure) {
            throw failure.reason;
        }
    }
}

/**
 * Verify the consumer contract and every inventoried file before staging.
 * @param {string} directory Artifact directory.
 * @param {object} options Expected source versions.
 * @return {Promise<object>} Verified artifact and inventory.
 */
async function verifyArtifact(directory, options = {}) {
    const root = await FS.realpath(directory);
    const manifest = JSON.parse(await FS.readFile(await filePath(root, MANIFEST), 'utf8'));
    validateManifest(manifest, options);
    const inventory = await FS.readFile(await filePath(root, INVENTORY));
    if (sha256(inventory) !== manifest.inventory.sha256 || !inventory.toString().endsWith('\n')) {
        fail('inventory SHA-256 or line ending mismatch');
    }
    const records = inventory.toString().slice(0, -1).split('\n').map(line => JSON.parse(line));
    const keys = new Set();
    const foldedKeys = new Set();
    const stats = Object.fromEntries(PRODUCTS.map(product => [product, { pages: 0, jsonBytes: 0 }]));
    let bytes = 0;
    for (const record of records) {
        const kind = recordKind(record, manifest);
        if (foldedKeys.has(record.path.toLowerCase())) {
            fail(`duplicate inventory path ${record.path}`);
        }
        keys.add(record.path);
        foldedKeys.add(record.path.toLowerCase());
        bytes += record.bytes;
        if (kind === 'detail') {
            const product = record.path.slice(manifest.dataBase.length - 1).split('/')[0];
            stats[product].pages++;
            stats[product].jsonBytes += record.bytes;
        }
    }
    const required = ['api.js', 'style.css', 'frontend-products.json'].map(name => manifest.assetsBase.slice(1) + name);
    for (const product of PRODUCTS) {
        required.push(`${product}/react/index.html`, `${manifest.dataBase.slice(1)}${product}/nav/index.json`, `${manifest.dataBase.slice(1)}${product}/search.json`);
    }
    if (records.length !== manifest.inventory.files || bytes !== manifest.inventory.bytes ||
        required.some(key => !keys.has(key)) || PRODUCTS.some(product =>
        stats[product].pages !== manifest.stats[product].pages || stats[product].jsonBytes !== manifest.stats[product].jsonBytes)) {
        fail('inventory counts, required files or product statistics mismatch');
    }
    await inBatches(records, record => readRecord(root, record));
    // Extra files must not silently become release inputs.
    const directories = new Set();
    for (const key of keys) {
        const parts = key.split('/');
        for (let index = 1; index < parts.length; index++) {
            directories.add(parts.slice(0, index).join('/'));
        }
    }
    async function walk(relativeDirectory = '') {
        for (const entry of await FS.readdir(Path.join(root, relativeDirectory), { withFileTypes: true })) {
            const key = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
            if (entry.isDirectory() && directories.has(key)) {
                await walk(key);
            } else if (!entry.isFile() || (!keys.has(key) && key !== MANIFEST && key !== INVENTORY)) {
                fail(`unowned or unsafe artifact entry ${key}`);
            }
        }
    }
    await walk();
    return { root, sourceRoot: root, manifest, records };
}

// Extend the shared legacy script rather than rewriting every generated page.
async function addReactNavigation(root) {
    const marker = '\n/* React API navigation */\n';
    for (const product of PRODUCTS) {
        const script = await filePath(root, `${product}/api.js`, true);
        const content = await FS.readFile(script, 'utf8').catch(error => {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        });
        if (content === void 0 || content.includes(marker)) {
            continue;
        }
        await FS.writeFile(script, content + marker + `(function () {
    function addReactLink() {
        var menu = document.querySelector('#platform-selector .group-list');
        if (!menu || menu.querySelector('a[href="/${product}/react/"]')) {
            return;
        }
        var item = document.createElement('li');
        var link = document.createElement('a');
        item.className = 'group';
        link.href = '/${product}/react/';
        link.textContent = 'React';
        item.appendChild(link);
        menu.appendChild(item);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addReactLink);
    } else {
        addReactLink();
    }
}());
`);
    }
}

/**
 * Stage inventory files and extend legacy navigation, retaining old releases.
 * @param {object} artifact Verified artifact.
 * @param {string} directory Staging directory.
 * @return {Promise<object>} Artifact with its staged root.
 */
async function stageArtifact(artifact, directory) {
    await FS.mkdir(directory, { recursive: true });
    if ((await FS.lstat(directory)).isSymbolicLink()) {
        fail('staging directory cannot be a symlink');
    }
    const root = await FS.realpath(directory);
    await inBatches(artifact.records, async record => {
        const content = await readRecord(artifact.root, record);
        const destination = await filePath(root, record.path, true);
        if (!record.path.endsWith('/react/index.html')) {
            const existing = await FS.readFile(destination).catch(error => {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            });
            if (existing && sha256(existing) !== record.sha256) {
                fail(`immutable staged key already contains different bytes: ${record.path}`);
            }
        }
        await FS.writeFile(destination, content);
    });
    await addReactNavigation(root);
    return { ...artifact, root };
}

function matchesRemote(info, record, inventoryHash) {
    return info.ContentLength === record.bytes && info.Metadata?.sha256 === record.sha256 &&
        info.Metadata?.inventorysha256 === inventoryHash &&
        info.ContentType === record.contentType && info.CacheControl === record.cacheControl;
}

async function verifyRemote(session, record, inventoryHash) {
    const info = await session.region.headObject({ Bucket: session.bucket, Key: record.path });
    if (!matchesRemote(info, record, inventoryHash)) {
        throw new Error(`Immutable remote key conflicts with artifact: ${record.path}`);
    }
}

async function dryrunPath(session, record) {
    // Bucket names are supplied by the API caller, never by the artifact.
    if (!/^[a-z0-9][a-z0-9.-]*$/u.test(session.bucket)) {
        throw new Error('Invalid dry-run bucket name');
    }
    const root = Path.resolve('tmp/s3', session.bucket);
    await FS.mkdir(root, { recursive: true });
    if ((await FS.lstat(root)).isSymbolicLink()) {
        throw new Error('Dry-run bucket directory cannot be a symlink');
    }
    return filePath(root, record.path, true);
}

// Resolve existing ancestors too: macOS /var and /private/var name the same tree.
async function physicalPath(file) {
    let ancestor = Path.resolve(file);
    const suffix = [];
    for (;;) {
        try {
            return Path.join(await FS.realpath(ancestor), ...suffix);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            const parent = Path.dirname(ancestor);
            if (parent === ancestor) {
                throw error;
            }
            suffix.unshift(Path.basename(ancestor));
            ancestor = parent;
        }
    }
}

/**
 * Validate the report destination before any publication side effects.
 * @param {object} artifact Staged, verified artifact.
 * @param {string} destination Optional evidence report destination.
 * @return {Promise<string>} Validated, resolved report path.
 */
async function preparePublicationReport(artifact, destination) {
    const reportPath = await physicalPath(destination || 'tmp/react-static-publication.json');
    for (const contentRoot of [artifact.root, artifact.sourceRoot || artifact.root, Path.resolve('build/api'), Path.resolve('tmp/s3')]) {
        const relativePath = Path.relative(await physicalPath(contentRoot), reportPath);
        if (relativePath !== '..' && !relativePath.startsWith(`..${Path.sep}`) && !Path.isAbsolute(relativePath)) {
            throw new Error('Publication report must be outside release content');
        }
    }
    const reportDirectory = Path.dirname(reportPath);
    await FS.mkdir(reportDirectory, { recursive: true });
    const reportInfo = await FS.stat(reportPath).catch(error => {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    });
    if (reportInfo && !reportInfo.isFile()) {
        throw new Error('Publication report must be a regular file');
    }
    await FS.access(reportInfo ? reportPath : reportDirectory, FS.constants.W_OK);
    return reportPath;
}

/**
 * Upload immutable files before shells, or restore only verified earlier shells.
 * @param {object} artifact Staged, verified artifact.
 * @param {object} session S3 session, optionally a local dry run.
 * @param {object} options Rollback mode and evidence report destination.
 * @return {Promise<object>} Publication evidence.
 */
async function publishArtifact(artifact, session, options = {}) {
    const S3 = require('./uploadS3');
    const reportPath = await preparePublicationReport(artifact, options.reportPath);
    const reportDirectory = Path.dirname(reportPath);
    const started = Date.now();
    let publicationError;
    const immutable = artifact.records.filter(record => !record.path.endsWith('/react/index.html'));
    const shells = artifact.records.filter(record => record.path.endsWith('/react/index.html'));
    const report = {
        release: artifact.manifest.release,
        inventorySha256: artifact.manifest.inventory.sha256,
        source: artifact.manifest.source,
        generator: artifact.manifest.generator,
        bucket: session.bucket,
        dryrun: Boolean(session.dryrun),
        shellsOnly: Boolean(options.shellsOnly),
        complete: false,
        files: artifact.records.length,
        bytes: artifact.manifest.inventory.bytes,
        preservedPrefixes: PRESERVED_PREFIXES,
        deletions: [],
        completedUploads: 0,
        reusedObjects: 0,
        phases: [],
        objects: artifact.records
    };
    try {
        // Preflight staged bytes too, before the first object is sent.
        await inBatches(artifact.records, record => readRecord(artifact.root, record));
        for (const [kind, records] of [['immutable', immutable], ['shells', shells]]) {
            const phase = { kind, files: records.length, completed: 0 };
            report.phases.push(phase);
            await inBatches(records, async record => {
                const content = await readRecord(artifact.root, record);
                if (session.dryrun) {
                    const destination = await dryrunPath(session, record);
                    if (kind === 'immutable') {
                        const existing = await FS.readFile(destination).catch(error => {
                            if (error.code !== 'ENOENT') {
                                throw error;
                            }
                        });
                        if ((options.shellsOnly && !existing) || (existing && sha256(existing) !== record.sha256)) {
                            throw new Error(`Immutable dry-run key missing or conflicting: ${record.path}`);
                        }
                    }
                    if (!(options.shellsOnly && kind === 'immutable')) {
                        await FS.writeFile(destination, content);
                        report.completedUploads++;
                    }
                } else if (options.shellsOnly && kind === 'immutable') {
                    await verifyRemote(session, record, artifact.manifest.inventory.sha256);
                } else {
                    try {
                        await S3.putS3Object(record.path, content, {
                            ContentType: record.contentType,
                            CacheControl: record.cacheControl,
                            Metadata: {
                                sha256: record.sha256,
                                inventorysha256: artifact.manifest.inventory.sha256
                            },
                            ...(kind === 'immutable' ? { IfNoneMatch: '*' } : {})
                        }, session);
                        report.completedUploads++;
                    } catch (error) {
                        if (kind !== 'immutable' || error.$metadata?.httpStatusCode !== 412) {
                            throw error;
                        }
                        await verifyRemote(session, record, artifact.manifest.inventory.sha256);
                        report.reusedObjects++;
                    }
                }
                phase.completed++;
            });
        }
        report.complete = true;
    } catch (error) {
        publicationError = error;
        report.error = error.message;
    }
    report.elapsedMs = Date.now() - started;
    try {
        await FS.mkdir(reportDirectory, { recursive: true });
        await FS.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
    } catch (error) {
        if (!publicationError) {
            throw error;
        }
        publicationError.reportError = error;
    }
    if (publicationError) {
        throw publicationError;
    }
    return report;
}

module.exports = { isReactOwnedKey, verifyArtifact, stageArtifact, preparePublicationReport, publishArtifact };
