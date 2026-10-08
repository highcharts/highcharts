import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import Path from 'node:path';

export const PRODUCTS = ['highcharts', 'highstock', 'highmaps', 'gantt'];
export const EXPECTED_VERSIONS = {
    expectedReactVersion: '5.0.1',
    expectedHighchartsVersion: '13.1.1'
};

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
};
const MANIFEST = 'react-static-manifest.json';
const INVENTORY = 'react-static-files.jsonl';

function sha256(content) {
    return createHash('sha256').update(content).digest('hex');
}

export function recordFor(path, content) {
    const body = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const shell = PRODUCTS.some(product => path === `${product}/react/index.html`);

    return {
        path,
        bytes: body.length,
        sha256: sha256(body),
        contentType: CONTENT_TYPES[Path.posix.extname(path)],
        cacheControl: shell ? 'no-cache' : IMMUTABLE_CACHE
    };
}

export function inventoryText(records) {
    return `${records.map(record => JSON.stringify(record)).join('\n')}\n`;
}

function makeRecords(release) {
    const assetsBase = `react-assets/${release}/`;
    const dataBase = `react-data/${release}/`;
    const contents = new Map();
    function add(path, content) {
        const body = Buffer.from(content);
        contents.set(path, body);
        return recordFor(path, body);
    }
    const records = [
        add(`${assetsBase}api.js`, `window.reactStaticRelease = '${release}';`),
        add(`${assetsBase}style.css`, `/* ${release} */`),
        add(`${assetsBase}frontend-products.json`, JSON.stringify(PRODUCTS))
    ];

    for (const product of PRODUCTS) {
        records.push(
            add(`${dataBase}${product}/nav/index.json`, JSON.stringify({ product })),
            add(`${dataBase}${product}/search.json`, JSON.stringify([])),
            add(`${dataBase}${product}/nav/axis.json`, JSON.stringify({ product, name: 'Axis' })),
            add(`${product}/react/index.html`, `<!doctype html><title>${release}:${product}</title>`)
        );
    }

    return { records, contents };
}

function statsFor(records, release) {
    const stats = Object.fromEntries(PRODUCTS.map(product => [product, {
        pages: 0,
        jsonBytes: 0
    }]));
    const prefix = `react-data/${release}/`;

    for (const record of records) {
        if (record.path.startsWith(prefix)) {
            const [, , product, folder, filename] = record.path.split('/');
            if (folder === 'nav' && filename !== 'index.json') {
                stats[product].pages++;
                stats[product].jsonBytes += record.bytes;
            }
        }
    }

    return stats;
}

function manifestFor(records, release) {
    const inventory = Buffer.from(inventoryText(records));
    const shells = PRODUCTS.map(product => `${product}/react/index.html`);
    const assetsBase = `/react-assets/${release}/`;
    const dataBase = `/react-data/${release}/`;

    return {
        formatVersion: 1,
        complete: true,
        publishable: true,
        pageSuffix: '.html',
        products: PRODUCTS,
        release,
        assetsBase,
        dataBase,
        inventory: {
            path: INVENTORY,
            sha256: sha256(inventory),
            files: records.length,
            bytes: records.reduce((total, record) => total + record.bytes, 0)
        },
        warnings: { malformedPaths: [], emptyResponses: [] },
        source: {
            contentSha256: sha256('react-static-source-fixture'),
            sourceVersions: {
                react: EXPECTED_VERSIONS.expectedReactVersion,
                ...Object.fromEntries(PRODUCTS.map(product => [
                    product,
                    EXPECTED_VERSIONS.expectedHighchartsVersion
                ]))
            }
        },
        generator: { sourceSha256: sha256('react-static-generator-fixture') },
        publication: {
            immutablePrefixes: [assetsBase, dataBase],
            mutableShells: shells
        },
        routing: {
            shells: Object.fromEntries(PRODUCTS.map(product => [
                product,
                `${product}/react/index.html`
            ])),
            unknownDocumentStatus: 200,
            missingDataStatus: 404,
            leafData: 'parent'
        },
        stats: statsFor(records, release)
    };
}

/**
 * Create a complete, tiny artifact fixture with all required product paths.
 * The returned artifact directory can be passed to verifyArtifact directly.
 * @param {object} root0 Fixture options.
 * @param {string} [root0.release='test-r1'] Release identifier used in paths.
 */
export async function createReactStaticFixture({ release = 'test-r1' } = {}) {
    const directory = await mkdtemp(Path.join(tmpdir(), 'highcharts-react-static-'));
    const artifactDirectory = Path.join(directory, 'artifact');
    const stagingDirectory = Path.join(directory, 'staged');
    const reportPath = Path.join(directory, 'publication-report.json');
    const bucket = `react-static-test-${release.replace(/[^a-z0-9.-]/gu, '-')}`;
    const bucketDirectory = Path.resolve('tmp/s3', bucket);
    const { records: initialRecords, contents } = makeRecords(release);
    let records = initialRecords;
    let manifest = manifestFor(records, release);

    async function rewrite(nextRecords = records) {
        records = nextRecords;
        manifest = manifestFor(records, release);
        await rm(artifactDirectory, { recursive: true, force: true });
        await mkdir(artifactDirectory, { recursive: true });

        for (const record of records) {
            const body = contents.get(record.path);
            if (!body || record.path.startsWith('/') || record.path.split('/').includes('..')) {
                continue;
            }
            const filePath = Path.join(artifactDirectory, record.path);
            await mkdir(Path.dirname(filePath), { recursive: true });
            await writeFile(filePath, body);
        }

        await writeFile(
            Path.join(artifactDirectory, INVENTORY),
            inventoryText(records)
        );
        await writeFile(
            Path.join(artifactDirectory, MANIFEST),
            `${JSON.stringify(manifest, null, 2)}\n`
        );
    }

    await rewrite();

    return {
        directory,
        artifactDirectory,
        stagingDirectory,
        reportPath,
        bucket,
        bucketDirectory,
        get records() {
            return records;
        },
        get manifest() {
            return manifest;
        },
        get contents() {
            return contents;
        },
        rewrite,
        async patchManifest(mutator) {
            const current = JSON.parse(await readFile(
                Path.join(artifactDirectory, MANIFEST),
                'utf8'
            ));
            mutator(current);
            await writeFile(
                Path.join(artifactDirectory, MANIFEST),
                `${JSON.stringify(current, null, 2)}\n`
            );
        },
        async cleanup() {
            await rm(directory, { recursive: true, force: true });
            await rm(bucketDirectory, { recursive: true, force: true });
        }
    };
}
