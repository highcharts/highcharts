import { randomUUID } from 'node:crypto';
import {
    mkdirSync,
    mkdtempSync,
    existsSync,
    readFileSync,
    rmSync,
    statSync,
    utimesSync,
    writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import Path from 'node:path';
import { after, describe, it } from 'node:test';
import assert from 'node:assert';
import FS from 'node:fs';
import S3 from '../gulptasks/lib/uploadS3.js';

const testFixtures = [];

function makeFixture() {
    const directory = mkdtempSync(Path.join(tmpdir(), 'highcharts-s3-'));
    const bucket = `gulptasks-s3-test-${randomUUID()}`;
    const bucketPath = Path.join(process.cwd(), 'tmp', 's3', bucket);
    const deleteMarkersPath = Path.join(
        process.cwd(),
        'tmp',
        's3-delete-markers',
        bucket
    );
    const sourcePath = Path.join(directory, 'source');

    mkdirSync(sourcePath, { recursive: true });

    const fixture = {
        bucket,
        bucketPath,
        deleteMarkersPath,
        directory,
        sourcePath,
        session: {
            bucket,
            dryrun: true,
            region: {
                listObjectsV2() {
                    throw new Error('Dry-run listing must not call S3.');
                }
            }
        }
    };

    testFixtures.push(fixture);

    return fixture;
}

function writeSourceFile(sourcePath, name, content) {
    const filePath = Path.join(sourcePath, name);

    mkdirSync(Path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);

    return filePath;
}

function toWindowsStylePath(path) {
    return Path.sep === '\\' ?
        path.replace(/[\\/]/gu, '\\') :
        path;
}

function writeDryRunObject(bucketPath, key, content, modified) {
    const filePath = Path.join(bucketPath, key);

    mkdirSync(Path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);

    if (modified) {
        utimesSync(filePath, modified, modified);
    }

    return filePath;
}

after(() => {
    for (const fixture of testFixtures) {
        rmSync(fixture.directory, { force: true, recursive: true });
        rmSync(fixture.bucketPath, { force: true, recursive: true });
        rmSync(fixture.deleteMarkersPath, { force: true, recursive: true });
    }
});

describe('S3 utils', async () => {
    const { toS3Path } = S3;

    await it('toS3Path', async () => {
        assert.deepEqual(
            toS3Path(
                'samples/graphics/cyber-monday/core.svg',
                'samples/',
                'demos'
            ), {
                from: 'samples/graphics/cyber-monday/core.svg',
                to: 'demos/graphics/cyber-monday/core.svg'
            }
        );

        assert.deepEqual(
            toS3Path(
                'samples/graphics/cyber-monday/core.svg',
                'samples/graphics',
                'demos'
            ), {
                from: 'samples/graphics/cyber-monday/core.svg',
                to: 'demos/cyber-monday/core.svg'
            }
        );

        assert.deepEqual(
            toS3Path(
                'samples/graphics/cyber-monday/core.svg',
                void 0,
                'demos'
            ),
            {
                from: 'samples/graphics/cyber-monday/core.svg',
                to: 'demos/samples/graphics/cyber-monday/core.svg'
            }
        );
    });

    await it('paginates with NextContinuationToken', async () => {
        const requests = [];
        const pages = [
            {
                Contents: [{
                    Key: 'assets/first.js',
                    LastModified: new Date('2026-01-01T00:00:00Z')
                }],
                IsTruncated: true,
                NextContinuationToken: 'page-two'
            },
            {
                Contents: [{
                    Key: 'assets/second.js',
                    LastModified: new Date('2026-01-02T00:00:00Z')
                }],
                IsTruncated: true,
                NextContinuationToken: 'page-three'
            },
            {
                Contents: [{
                    Key: 'assets/third.js',
                    LastModified: new Date('2026-01-03T00:00:00Z')
                }],
                IsTruncated: false
            }
        ];
        const session = {
            bucket: 'test-bucket',
            region: {
                async listObjectsV2(params) {
                    requests.push(params);
                    return pages.shift();
                }
            }
        };

        const files = await S3.getS3LastModified('assets/', session);

        assert.deepEqual(Object.keys(files), [
            'assets/first.js',
            'assets/second.js',
            'assets/third.js'
        ]);
        assert.deepEqual(
            requests.map(request => request.ContinuationToken),
            [void 0, 'page-two', 'page-three']
        );
    });

    await it('rejects incomplete and repeated S3 continuation tokens', async () => {
        const missingTokenSession = {
            bucket: 'test-bucket',
            region: {
                async listObjectsV2() {
                    return { IsTruncated: true };
                }
            }
        };
        const repeatedTokenSession = {
            bucket: 'test-bucket',
            region: {
                async listObjectsV2() {
                    return {
                        IsTruncated: true,
                        NextContinuationToken: 'same-token'
                    };
                }
            }
        };

        await assert.rejects(
            S3.getS3LastModified('assets/', missingTokenSession),
            /missing continuation token/u
        );
        await assert.rejects(
            S3.getS3LastModified('assets/', repeatedTokenSession),
            /repeated continuation token/u
        );
    });

    await it('limits dry-run listing to the selected prefix directory', async () => {
        const fixture = makeFixture();
        const visitedDirectories = [];
        const originalReaddirSync = FS.readdirSync;

        writeDryRunObject(
            fixture.bucketPath,
            'docs/file.txt',
            'in prefix'
        );
        writeDryRunObject(
            fixture.bucketPath,
            'react-data/file.txt',
            'outside prefix'
        );

        FS.readdirSync = function (directoryPath, options) {
            visitedDirectories.push(Path.resolve(directoryPath));

            return originalReaddirSync.call(FS, directoryPath, options);
        };

        let files;

        try {
            files = await S3.getS3LastModified('docs/', fixture.session);
        } finally {
            FS.readdirSync = originalReaddirSync;
        }

        assert.deepEqual(Object.keys(files), ['docs/file.txt']);
        assert.deepEqual(visitedDirectories, [
            Path.resolve(fixture.bucketPath, 'docs')
        ]);
    });

    await it('keeps dry-run synchronization inside its prefix and respects key filters', async () => {
        const fixture = makeFixture();
        const oldDate = new Date('2020-01-01T00:00:00Z');

        writeDryRunObject(
            fixture.bucketPath,
            'docs/delete.txt',
            'delete me'
        );
        writeDryRunObject(
            fixture.bucketPath,
            'docs/preserved-delete.txt',
            'preserve me'
        );
        writeDryRunObject(
            fixture.bucketPath,
            'docs/update.txt',
            'old update',
            oldDate
        );
        writeDryRunObject(
            fixture.bucketPath,
            'docs/preserved-update.txt',
            'old preserved update',
            oldDate
        );
        writeDryRunObject(
            fixture.bucketPath,
            'docs2/sibling.txt',
            'sibling'
        );

        writeSourceFile(fixture.sourcePath, 'update.txt', 'new update');
        writeSourceFile(
            fixture.sourcePath,
            'preserved-update.txt',
            'new preserved update'
        );
        writeSourceFile(fixture.sourcePath, 'new.txt', 'new object');
        writeSourceFile(
            fixture.sourcePath,
            'preserved-new.txt',
            'new excluded object'
        );

        function includeKey(key) {
            return ![
                'docs/preserved-delete.txt',
                'docs/preserved-update.txt',
                'docs/preserved-new.txt'
            ].includes(key);
        }

        await S3.synchronizeDirectory(
            toWindowsStylePath(fixture.sourcePath),
            'docs',
            fixture.session,
            void 0,
            includeKey
        );

        assert.equal(
            readFileSync(Path.join(fixture.bucketPath, 'docs/update.txt'), 'utf8'),
            'new update'
        );
        assert.equal(
            readFileSync(
                Path.join(fixture.bucketPath, 'docs/preserved-update.txt'),
                'utf8'
            ),
            'old preserved update'
        );
        assert.equal(
            readFileSync(Path.join(fixture.bucketPath, 'docs/new.txt'), 'utf8'),
            'new object'
        );
        assert.equal(
            existsSync(Path.join(fixture.bucketPath, 'docs/preserved-new.txt')),
            false
        );
        assert.equal(
            readFileSync(
                Path.join(fixture.bucketPath, 'docs/preserved-delete.txt'),
                'utf8'
            ),
            'preserve me'
        );
        assert.equal(
            existsSync(Path.join(
                fixture.deleteMarkersPath,
                'docs/DELETE delete.txt'
            )),
            true
        );
        assert.equal(
            existsSync(Path.join(
                fixture.deleteMarkersPath,
                'docs/DELETE preserved-delete.txt'
            )),
            false
        );
        assert.equal(
            existsSync(Path.join(
                fixture.deleteMarkersPath,
                'docs2/DELETE sibling.txt'
            )),
            false
        );
        assert.equal(
            readFileSync(
                Path.join(fixture.bucketPath, 'docs2/sibling.txt'),
                'utf8'
            ),
            'sibling'
        );
    });

    await it('removes dry-run deletions and clears the marker when a key returns', async () => {
        const fixture = makeFixture();
        const oldDate = new Date('2020-01-01T00:00:00Z');
        const newerRemoteDate = new Date('2026-01-01T00:00:00Z');
        const objectPath = Path.join(fixture.bucketPath, 'docs/restore.txt');
        const deleteMarkerPath = Path.join(
            fixture.deleteMarkersPath,
            'docs/DELETE restore.txt'
        );

        writeDryRunObject(
            fixture.bucketPath,
            'docs/restore.txt',
            'stale remote content',
            newerRemoteDate
        );

        await S3.synchronizeDirectory(
            toWindowsStylePath(fixture.sourcePath),
            'docs',
            fixture.session
        );

        assert.equal(existsSync(objectPath), false);
        assert.equal(existsSync(deleteMarkerPath), true);
        assert.deepEqual(
            Object.keys(await S3.getS3LastModified('docs/', fixture.session)),
            []
        );

        const sourceFile = writeSourceFile(
            fixture.sourcePath,
            'restore.txt',
            'restored source content'
        );
        utimesSync(sourceFile, oldDate, oldDate);

        await S3.synchronizeDirectory(
            toWindowsStylePath(fixture.sourcePath),
            'docs',
            fixture.session
        );

        assert.ok(statSync(sourceFile).mtime < newerRemoteDate);
        assert.equal(readFileSync(objectPath, 'utf8'), 'restored source content');
        assert.equal(existsSync(deleteMarkerPath), false);
        assert.deepEqual(
            Object.keys(await S3.getS3LastModified('docs/', fixture.session)),
            ['docs/restore.txt']
        );
    });

    if (Path.sep === '/') {
        await it('preserves literal backslashes in POSIX source paths during live synchronization', async () => {
            const fixture = makeFixture();
            const sourcePath = Path.join(
                fixture.directory,
                'source\\literal'
            );
            const deleteCalls = [];

            mkdirSync(sourcePath, { recursive: true });
            writeSourceFile(sourcePath, 'keep.txt', 'local content');

            const session = {
                bucket: 'test-bucket',
                region: {
                    async listObjectsV2() {
                        return {
                            Contents: [{
                                Key: 'docs/keep.txt',
                                LastModified: new Date('2099-01-01T00:00:00Z')
                            }],
                            IsTruncated: false
                        };
                    },
                    async deleteObject(params) {
                        deleteCalls.push(params.Key);
                    }
                }
            };

            await S3.synchronizeDirectory(
                sourcePath,
                'docs',
                session
            );

            assert.deepEqual(deleteCalls, []);
        });
    }

    await it('applies the key filter to uploadDirectory', async () => {
        const fixture = makeFixture();

        writeSourceFile(fixture.sourcePath, 'include.txt', 'include');
        writeSourceFile(fixture.sourcePath, 'exclude.txt', 'exclude');

        await S3.uploadDirectory(
            toWindowsStylePath(fixture.sourcePath),
            'upload',
            fixture.session,
            void 0,
            key => key === 'upload/include.txt'
        );

        assert.equal(
            readFileSync(
                Path.join(fixture.bucketPath, 'upload/include.txt'),
                'utf8'
            ),
            'include'
        );
        assert.equal(
            existsSync(Path.join(fixture.bucketPath, 'upload/exclude.txt')),
            false
        );
    });

    await it('writes dry-run deletion markers without an fs callback error', async () => {
        const fixture = makeFixture();

        await S3.deleteS3Object('docs/delete.txt', fixture.session);

        assert.equal(
            statSync(
                Path.join(fixture.deleteMarkersPath, 'docs/DELETE delete.txt')
            ).isFile(),
            true
        );
    });

    await it('preserves mirrored objects named like dry-run deletion markers', async () => {
        const fixture = makeFixture();
        const sourceFile = writeSourceFile(
            fixture.sourcePath,
            'report.html',
            'new report'
        );

        writeDryRunObject(
            fixture.bucketPath,
            'docs/DELETE report.html',
            'legitimate mirrored object'
        );

        await S3.deleteS3Object('docs/report.html', fixture.session);
        await S3.uploadFile(
            sourceFile,
            'docs/report.html',
            fixture.session
        );

        assert.equal(
            readFileSync(
                Path.join(fixture.bucketPath, 'docs/DELETE report.html'),
                'utf8'
            ),
            'legitimate mirrored object'
        );
        assert.equal(
            existsSync(Path.join(
                fixture.deleteMarkersPath,
                'docs/DELETE report.html'
            )),
            false
        );
        assert.deepEqual(
            Object.keys(await S3.getS3LastModified('docs/', fixture.session))
                .sort(),
            ['docs/DELETE report.html', 'docs/report.html']
        );
    });
});
