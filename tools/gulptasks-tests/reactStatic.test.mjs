import assert from 'node:assert/strict';
import {
    mkdir,
    realpath,
    readFile,
    rm,
    symlink,
    unlink,
    writeFile
} from 'node:fs/promises';
import { after, describe, it } from 'node:test';
import Path from 'node:path';
import { JSDOM } from 'jsdom';
import Templates from '@highcharts/highcharts-documentation-generators/api-docs/lib/templates.js';
import ReactStatic from '../gulptasks/lib/reactStatic.js';
import {
    createReactStaticFixture,
    EXPECTED_VERSIONS,
    PRODUCTS,
    recordFor
} from './fixtures/reactStatic.mjs';

const fixtures = [];

async function makeFixture(options) {
    const fixture = await createReactStaticFixture(options);
    fixtures.push(fixture);
    return fixture;
}

async function stage(fixture) {
    const artifact = await ReactStatic.verifyArtifact(
        fixture.artifactDirectory,
        EXPECTED_VERSIONS
    );
    return ReactStatic.stageArtifact(artifact, fixture.stagingDirectory);
}

function remoteSession(bucket, { putObject, headObject } = {}) {
    return {
        bucket,
        dryrun: false,
        region: {
            putObject(params) {
                return putObject?.(params);
            },
            async headObject(params) {
                if (headObject) {
                    return headObject(params);
                }
                throw new Error(`Unexpected HEAD for ${params.Key}`);
            }
        }
    };
}

function remoteInfo(record, inventorySha256) {
    return {
        ContentLength: record.bytes,
        ContentType: record.contentType,
        CacheControl: record.cacheControl,
        Metadata: {
            sha256: record.sha256,
            inventorysha256: inventorySha256
        }
    };
}

function isShell(record) {
    return record.path.endsWith('/react/index.html');
}

after(async () => {
    await Promise.all(fixtures.map(fixture => fixture.cleanup()));
});

describe('static React artifact consumer', async () => {
    await it('recognizes only React-owned product and shared prefixes', () => {
        for (const product of PRODUCTS) {
            assert.equal(
                ReactStatic.isReactOwnedKey(`${product}/react/index.html`),
                true
            );
            assert.equal(ReactStatic.isReactOwnedKey(`${product}/react`), true);
        }
        for (const key of [
            'react-assets/',
            'react-assets/test-r1/api.js',
            'react-data/test-r1/highcharts/search.json',
            'react-static-manifest.json',
            'react-static-files.jsonl'
        ]) {
            assert.equal(ReactStatic.isReactOwnedKey(key), true);
        }
        for (const key of [
            'highcharts/react-old/index.html',
            'highcharts/react-samples/index.html',
            'react-assets-old/api.js',
            'react-data-old/search.json',
            'samples/react/index.html'
        ]) {
            assert.equal(ReactStatic.isReactOwnedKey(key), false);
        }
    });

    await it('verifies a complete artifact and rejects malformed metadata and paths', async () => {
        const fixture = await makeFixture();

        const artifact = await ReactStatic.verifyArtifact(
            fixture.artifactDirectory,
            EXPECTED_VERSIONS
        );
        assert.equal(artifact.manifest.release, 'test-r1');
        assert.equal(artifact.records.length, fixture.records.length);
        assert.equal(artifact.records.filter(isShell).length, PRODUCTS.length);

        await writeFile(
            Path.join(fixture.artifactDirectory, 'react-static-manifest.json'),
            '{ malformed json'
        );
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            SyntaxError
        );

        await fixture.rewrite();
        await fixture.patchManifest(manifest => {
            manifest.publishable = false;
        });
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /manifest is incomplete/u
        );

        await fixture.rewrite();
        await fixture.patchManifest(manifest => {
            manifest.source.sourceVersions.highcharts = '12.0.0';
        });
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /source version mismatch/u
        );

        await fixture.rewrite([
            ...fixture.records,
            recordFor('../outside.js', 'not part of the artifact')
        ]);
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /unsafe inventory path/u
        );
    });

    await it('rejects inventory, file hash, duplicate, missing, and extra-file failures', async () => {
        const fixture = await makeFixture();
        const originalRecords = fixture.records;
        const inventoryPath = Path.join(
            fixture.artifactDirectory,
            'react-static-files.jsonl'
        );

        await writeFile(inventoryPath, `${await readFile(inventoryPath, 'utf8')}\n`);
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /inventory SHA-256/u
        );

        await fixture.rewrite();
        const asset = Path.join(
            fixture.artifactDirectory,
            'react-assets',
            'test-r1',
            'api.js'
        );
        await writeFile(asset, 'tampered but same length?');
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /size or SHA-256 mismatch/u
        );

        await fixture.rewrite([
            ...fixture.records,
            fixture.records[0]
        ]);
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /duplicate inventory path/u
        );

        await fixture.rewrite(originalRecords);
        await unlink(asset);
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            { code: 'ENOENT' }
        );

        const withoutRequiredAsset = fixture.records.filter(record =>
            record.path !== 'react-assets/test-r1/api.js');
        await fixture.rewrite(withoutRequiredAsset);
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /required files/u
        );

        await fixture.rewrite(originalRecords);
        const extraPath = Path.join(fixture.artifactDirectory, 'unlisted.txt');
        await writeFile(extraPath, 'extra content');
        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /unowned or unsafe artifact entry/u
        );
    });

    await it('rejects symlinked inventory files', async t => {
        const fixture = await makeFixture();
        const asset = Path.join(
            fixture.artifactDirectory,
            'react-assets',
            'test-r1',
            'api.js'
        );
        const target = Path.join(fixture.directory, 'outside.js');

        await writeFile(target, fixture.contents.get('react-assets/test-r1/api.js'));
        await unlink(asset);
        try {
            await symlink(target, asset);
        } catch (error) {
            if (process.platform === 'win32' && ['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
                t.skip('Creating symlinks is not permitted on this Windows host.');
                return;
            }
            throw error;
        }

        await assert.rejects(
            ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS),
            /not a regular file/u
        );
    });

    await it('stages inventory files while preserving legacy output and refusing immutable conflicts', async () => {
        const fixture = await makeFixture();
        const legacyFile = Path.join(fixture.stagingDirectory, 'samples', 'legacy.js');
        const shellPath = Path.join(
            fixture.stagingDirectory,
            'highcharts',
            'react',
            'index.html'
        );

        await mkdir(Path.dirname(legacyFile), { recursive: true });
        await writeFile(legacyFile, 'legacy build output');
        await mkdir(Path.dirname(shellPath), { recursive: true });
        await writeFile(shellPath, 'previous shell');

        const artifact = await ReactStatic.verifyArtifact(
            fixture.artifactDirectory,
            EXPECTED_VERSIONS
        );
        const staged = await ReactStatic.stageArtifact(
            artifact,
            fixture.stagingDirectory
        );

        assert.equal(staged.root, await realpath(fixture.stagingDirectory));
        assert.equal(await readFile(legacyFile, 'utf8'), 'legacy build output');
        assert.equal(
            await readFile(shellPath, 'utf8'),
            fixture.contents.get('highcharts/react/index.html').toString()
        );
        assert.deepEqual(
            await readFile(Path.join(
                fixture.stagingDirectory,
                'react-assets',
                'test-r1',
                'api.js'
            )),
            fixture.contents.get('react-assets/test-r1/api.js')
        );
        await assert.rejects(readFile(Path.join(
            fixture.stagingDirectory,
            'react-static-manifest.json'
        )), { code: 'ENOENT' });
        await assert.rejects(readFile(Path.join(
            fixture.stagingDirectory,
            'react-static-files.jsonl'
        )), { code: 'ENOENT' });

        const conflictDirectory = Path.join(fixture.directory, 'conflicting-stage');
        const immutablePath = Path.join(
            conflictDirectory,
            'react-assets',
            'test-r1',
            'api.js'
        );
        await mkdir(Path.dirname(immutablePath), { recursive: true });
        await writeFile(immutablePath, 'a prior release has different bytes');
        await assert.rejects(
            ReactStatic.stageArtifact(artifact, conflictDirectory),
            /immutable staged key already contains different bytes/u
        );
        assert.equal(await readFile(immutablePath, 'utf8'), 'a prior release has different bytes');
    });

    await it('leaves legacy navigation untouched when disabled during staging', async () => {
        const fixture = await makeFixture();
        const script = Path.join(fixture.stagingDirectory, 'highcharts', 'api.js');
        await mkdir(Path.dirname(script), { recursive: true });
        await writeFile(script, 'legacy navigation');
        const artifact = await ReactStatic.verifyArtifact(fixture.artifactDirectory, EXPECTED_VERSIONS);
        await ReactStatic.stageArtifact(artifact, fixture.stagingDirectory, { addNavigation: false });
        assert.equal(await readFile(script, 'utf8'), 'legacy navigation');
        assert.deepEqual(await readFile(Path.join(fixture.stagingDirectory, 'highcharts/react/index.html')),
            fixture.contents.get('highcharts/react/index.html'));
    });

    await it('adds product-specific React links through the legacy navigation script', async () => {
        const fixture = await makeFixture();
        const originalScript = 'window.legacyLoaded = true;\n';
        await new Promise((resolve, reject) => Templates.load(error =>
            (error ? reject(error) : resolve())));

        for (const product of PRODUCTS) {
            const directory = Path.join(fixture.stagingDirectory, product);
            await mkdir(directory, { recursive: true });
            await writeFile(Path.join(directory, 'api.js'), originalScript);
        }
        const artifact = await stage(fixture);
        for (const [index, product] of PRODUCTS.entries()) {
            const scriptPath = Path.join(artifact.root, product, 'api.js');
            const script = await readFile(scriptPath, 'utf8');
            assert.ok(script.startsWith(originalScript));
            const html = Templates.compile('main', {
                platform: 'JS',
                platforms: {
                    JS: `/${product}/`,
                    iOS: `/ios/${product}/`,
                    Android: `/android/${product}/`
                },
                toc: {
                    [product]: {
                        displayName: product,
                        versions: { current: `/${product}/` },
                        active: true
                    }
                },
                node: { doclet: {}, meta: {}, children: [] },
                version: '13.1.1'
            });
            const dom = new JSDOM(html, {
                url: `http://localhost:9005/${product}/plotOptions.area`,
                runScripts: 'outside-only'
            });
            try {
                const { document, Event } = dom.window;
                if (index % 2) {
                    Object.defineProperty(document, 'readyState', {
                        value: 'complete'
                    });
                }
                dom.window.eval(script);
                document.dispatchEvent(new Event('DOMContentLoaded'));
                document.dispatchEvent(new Event('DOMContentLoaded'));
                const links = [...document.querySelectorAll(
                    '#platform-selector .group-list a'
                )];
                assert.deepEqual(links.map(link => link.textContent.trim()), [
                    'JS', 'iOS', 'Android', 'React'
                ]);
                assert.equal(links[3].href, `http://localhost:9005/${product}/react/`);
                assert.equal(links[3].classList.contains('dropdown-link'), false);
                assert.equal(dom.window.legacyLoaded, true);
            } finally {
                dom.window.close();
            }
            await ReactStatic.stageArtifact(artifact, fixture.stagingDirectory);
            assert.equal(await readFile(scriptPath, 'utf8'), script);
        }
        for (const record of fixture.records) {
            assert.deepEqual(
                await readFile(Path.join(artifact.root, record.path)),
                fixture.contents.get(record.path)
            );
        }
    });

    await it('does not create legacy navigation scripts for a React-only stage', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        for (const product of PRODUCTS) {
            await assert.rejects(
                readFile(Path.join(artifact.root, product, 'api.js')),
                { code: 'ENOENT' }
            );
        }
    });

    await it('publishes raw bytes with inventory metadata and uploads shells after immutable files', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const calls = [];
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                calls.push(params);
            }
        });

        const report = await ReactStatic.publishArtifact(artifact, session, {
            reportPath: fixture.reportPath
        });
        const shellIndex = calls.findIndex(call => call.Key.endsWith('/react/index.html'));
        const lastImmutableIndex = calls.reduce((last, call, index) =>
            (call.Key.endsWith('/react/index.html') ? last : index),
        -1);

        assert.equal(report.complete, true);
        assert.equal(report.completedUploads, fixture.records.length);
        assert.equal(report.reusedObjects, 0);
        assert.deepEqual(report.deletions, []);
        assert.ok(shellIndex > lastImmutableIndex);
        assert.ok(calls.every(call => Buffer.isBuffer(call.Body)));

        for (const call of calls) {
            const record = fixture.records.find(candidate => candidate.path === call.Key);
            assert.ok(record, `unexpected uploaded key ${call.Key}`);
            assert.deepEqual(call.Body, fixture.contents.get(record.path));
            assert.equal(call.ContentType, record.contentType);
            assert.equal(call.CacheControl, record.cacheControl);
            assert.deepEqual(call.Metadata, {
                sha256: record.sha256,
                inventorysha256: fixture.manifest.inventory.sha256
            });
            assert.equal(Object.hasOwn(call, 'IfNoneMatch'), !isShell(record));
            if (!isShell(record)) {
                assert.equal(call.IfNoneMatch, '*');
            }
        }
    });

    await it('rejects publication reports inside staged content before uploading', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const calls = [];
        const reportPath = Path.join(artifact.root, 'publication-report.json');
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                calls.push(params);
            }
        });

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, { reportPath }),
            /Publication report must be outside release content/u
        );
        assert.deepEqual(calls, []);
        await assert.rejects(readFile(reportPath), { code: 'ENOENT' });
    });

    await it('rejects invalid report destination types before uploading', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const calls = [];
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                calls.push(params);
            }
        });

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                reportPath: fixture.directory
            }),
            /Publication report must be a regular file/u
        );
        const parentFile = Path.join(fixture.directory, 'parent-file');
        await writeFile(parentFile, 'not a directory');
        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                reportPath: Path.join(parentFile, 'report.json')
            }),
            error => ['ENOTDIR', 'EEXIST'].includes(error.code)
        );
        assert.deepEqual(calls, []);
    });

    await it('preserves an upload failure if writing the report also fails', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const uploadFailure = new Error('mock upload failure');
        const session = remoteSession(fixture.bucket, {
            async putObject() {
                // Make the destination invalid after report preflight succeeds.
                await mkdir(fixture.reportPath, { recursive: true });
                throw uploadFailure;
            }
        });

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                reportPath: fixture.reportPath
            }),
            error => {
                assert.equal(error, uploadFailure);
                assert.equal(error.reportError.code, 'EISDIR');
                return true;
            }
        );
    });

    await it('propagates a late report failure after successful uploads', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const calls = [];
        const session = remoteSession(fixture.bucket, {
            async putObject(params) {
                calls.push(params);
                await mkdir(fixture.reportPath, { recursive: true });
            }
        });

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                reportPath: fixture.reportPath
            }),
            { code: 'EISDIR' }
        );
        assert.equal(calls.length, fixture.records.length);
    });

    await it('rejects a publication report through a symlink to staged content', async t => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const alias = Path.join(fixture.directory, 'staged-alias');
        const reportPath = Path.join(alias, 'publication-report.json');
        const calls = [];

        try {
            await symlink(artifact.root, alias);
        } catch (error) {
            if (process.platform === 'win32' && ['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
                t.skip('Creating symlinks is not permitted on this Windows host.');
                return;
            }
            throw error;
        }

        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                calls.push(params);
            }
        });
        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, { reportPath }),
            /Publication report must be outside release content/u
        );
        assert.deepEqual(calls, []);
        await assert.rejects(readFile(reportPath), { code: 'ENOENT' });
    });

    await it('keeps an incomplete report and never uploads shells after immutable failure', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const attempted = [];
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                attempted.push(params.Key);
                if (!params.Key.endsWith('/react/index.html')) {
                    throw new Error('mock immutable upload failure');
                }
            }
        });

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                reportPath: fixture.reportPath
            }),
            /mock immutable upload failure/u
        );

        const report = JSON.parse(await readFile(fixture.reportPath, 'utf8'));
        assert.equal(report.complete, false);
        assert.match(report.error, /mock immutable upload failure/u);
        assert.deepEqual(report.phases.map(phase => phase.kind), ['immutable']);
        assert.equal(report.phases[0].completed, 0);
        assert.ok(attempted.length > 0);
        assert.ok(attempted.every(key => !key.endsWith('/react/index.html')));
    });

    await it('reuses a 412 immutable object only when HEAD metadata matches the inventory', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const calls = [];
        const target = fixture.records.find(record => record.path.endsWith('/api.js'));
        let headCount = 0;
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                calls.push(params);
                if (params.Key === target.path) {
                    const error = new Error('precondition failed');
                    error.$metadata = { httpStatusCode: 412 };
                    throw error;
                }
            },
            headObject({ Key }) {
                headCount++;
                assert.equal(Key, target.path);
                return remoteInfo(target, fixture.manifest.inventory.sha256);
            }
        });

        const report = await ReactStatic.publishArtifact(artifact, session, {
            reportPath: fixture.reportPath
        });

        assert.equal(report.complete, true);
        assert.equal(report.reusedObjects, 1);
        assert.equal(headCount, 1);
        assert.equal(calls.find(call => call.Key === target.path).IfNoneMatch, '*');
        const firstShell = calls.findIndex(call => isShell({ path: call.Key }));
        const lastImmutable = calls.reduce((last, call, index) =>
            (isShell({ path: call.Key }) ? last : index),
        -1);
        assert.ok(firstShell > lastImmutable);
    });

    await it('rejects a 412 object from a different inventory before uploading shells', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const target = fixture.records.find(record => record.path.endsWith('/api.js'));
        const puts = [];
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                puts.push(params.Key);
                if (params.Key === target.path) {
                    const error = new Error('precondition failed');
                    error.$metadata = { httpStatusCode: 412 };
                    throw error;
                }
            },
            headObject() {
                return {
                    ...remoteInfo(target, fixture.manifest.inventory.sha256),
                    Metadata: {
                        sha256: target.sha256,
                        inventorysha256: '0'.repeat(64)
                    }
                };
            }
        });

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                reportPath: fixture.reportPath
            }),
            /Immutable remote key conflicts/u
        );
        assert.ok(puts.every(key => !key.endsWith('/react/index.html')));
        const report = JSON.parse(await readFile(fixture.reportPath, 'utf8'));
        assert.equal(report.complete, false);
        assert.match(report.error, /Immutable remote key conflicts/u);
    });

    await it('checks every rollback immutable key before changing shells', async () => {
        const fixture = await makeFixture();
        const artifact = await stage(fixture);
        const events = [];
        const brokenRecord = fixture.records.find(record => record.path.endsWith('/style.css'));
        const session = remoteSession(fixture.bucket, {
            putObject(params) {
                events.push(`put:${params.Key}`);
            },
            headObject({ Key }) {
                events.push(`head:${Key}`);
                const record = fixture.records.find(candidate => candidate.path === Key);
                return remoteInfo(record, fixture.manifest.inventory.sha256);
            }
        });

        const report = await ReactStatic.publishArtifact(artifact, session, {
            shellsOnly: true,
            reportPath: fixture.reportPath
        });
        const firstPut = events.findIndex(event => event.startsWith('put:'));
        const lastHead = events.reduce((last, event, index) =>
            (event.startsWith('head:') ? index : last),
        -1);

        assert.equal(report.complete, true);
        assert.equal(report.completedUploads, PRODUCTS.length);
        assert.equal(events.filter(event => event.startsWith('head:')).length,
            fixture.records.filter(record => !isShell(record)).length);
        assert.ok(firstPut > lastHead);
        assert.ok(events.filter(event => event.startsWith('put:')).every(event =>
            event.endsWith('/react/index.html')));

        events.length = 0;
        session.region.headObject = async ({ Key }) => {
            events.push(`head:${Key}`);
            const record = fixture.records.find(candidate => candidate.path === Key);
            if (record.path === brokenRecord.path) {
                return remoteInfo(record, 'wrong-inventory');
            }
            return remoteInfo(record, fixture.manifest.inventory.sha256);
        };

        await assert.rejects(
            ReactStatic.publishArtifact(artifact, session, {
                shellsOnly: true,
                reportPath: fixture.reportPath
            }),
            /Immutable remote key conflicts/u
        );
        assert.ok(events.every(event => event.startsWith('head:')));
        assert.equal(events.some(event => event.startsWith('put:')), false);
    });

    await it('keeps prior release assets for cached pages and supports a verified dry-run rollback', async () => {
        const previous = await makeFixture({ release: 'test-old' });
        const current = await makeFixture({ release: 'test-new' });
        const previousArtifact = await stage(previous);
        const currentArtifact = await stage(current);
        const session = {
            bucket: previous.bucket,
            dryrun: true,
            region: {
                putObject() {
                    throw new Error('Dry-run publication must stay local.');
                },
                headObject() {
                    throw new Error('Dry-run publication must stay local.');
                }
            }
        };

        const first = await ReactStatic.publishArtifact(
            previousArtifact,
            session,
            { reportPath: previous.reportPath }
        );
        const second = await ReactStatic.publishArtifact(
            currentArtifact,
            session,
            { reportPath: current.reportPath }
        );
        const previousAsset = Path.join(
            previous.bucketDirectory,
            'react-assets',
            'test-old',
            'api.js'
        );
        const currentAsset = Path.join(
            previous.bucketDirectory,
            'react-assets',
            'test-new',
            'api.js'
        );
        const highchartsShell = Path.join(
            previous.bucketDirectory,
            'highcharts',
            'react',
            'index.html'
        );
        const oldShell = previous.contents.get('highcharts/react/index.html');
        const newShell = current.contents.get('highcharts/react/index.html');

        assert.equal(first.complete, true);
        assert.equal(second.complete, true);
        assert.deepEqual(await readFile(previousAsset), previous.contents.get('react-assets/test-old/api.js'));
        assert.deepEqual(await readFile(currentAsset), current.contents.get('react-assets/test-new/api.js'));
        assert.deepEqual(await readFile(highchartsShell), newShell);

        await rm(previousAsset);
        await assert.rejects(
            ReactStatic.publishArtifact(previousArtifact, session, {
                shellsOnly: true,
                reportPath: previous.reportPath
            }),
            /Immutable dry-run key missing or conflicting/u
        );
        assert.deepEqual(await readFile(highchartsShell), newShell);

        await mkdir(Path.dirname(previousAsset), { recursive: true });
        await writeFile(previousAsset, previous.contents.get('react-assets/test-old/api.js'));
        const rollback = await ReactStatic.publishArtifact(previousArtifact, session, {
            shellsOnly: true,
            reportPath: previous.reportPath
        });

        assert.equal(rollback.complete, true);
        assert.equal(rollback.completedUploads, PRODUCTS.length);
        assert.deepEqual(await readFile(highchartsShell), oldShell);
        assert.deepEqual(await readFile(currentAsset), current.contents.get('react-assets/test-new/api.js'));
        assert.deepEqual(await readFile(previousAsset), previous.contents.get('react-assets/test-old/api.js'));
    });
});
