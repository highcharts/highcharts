/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

/* *
 *
 *  Imports
 *
 * */


const AWS = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-providers');
const FS = require('node:fs');
const NativePath = require('node:path');
const Path = require('node:path/posix');

/* *
 *
 *  Declarations
 *
 * */


/**
 * @typedef {object} S3Session
 * @property {string} bucket
 * @property {boolean} dryrun
 * @property {string} profile
 * @property {AWS.S3} region
 */


/* *
 *
 *  Constants
 *
 * */


const MIME_TYPE = {
    '.css': 'text/css',
    '.eot': 'application/vnd.ms-fontobject',
    '.gif': 'image/gif',
    '.htm': 'text/html',
    '.html': 'text/html',
    '.php': 'text/plain',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'application/font-sfnt',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff',
    '.zip': 'application/zip'
};


/* *
 *
 *  Variables
 *
 * */


/** @type {S3Session} */
let defaultSession = void 0;


/* *
 *
 *  Functions
 *
 * */


/**
 * Delays promise chain for given time.
 *
 * @param {number} milliseconds
 * Seconds to delay
 *
 * @return {Promise}
 * Promise to keep.
 */
function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


/**
 * Gets the local path for dry-run deletion evidence.
 *
 * @param {string} path
 * S3 key of the deleted object.
 *
 * @param {S3Session} session
 * Session whose marker path should be returned.
 *
 * @return {string}
 * Path of the dry-run deletion marker.
 */
function getDryRunDeleteMarkerPath(path, session) {
    return Path.join(
        'tmp',
        's3-delete-markers',
        session.bucket,
        Path.dirname(path),
        `DELETE ${Path.basename(path)}`
    );
}


/**
 * Rejects paths outside a dry-run tree or paths that traverse symlinks.
 *
 * @param {string} path
 * Path to validate.
 *
 * @param {string} rootPath
 * Root of the dry-run tree.
 */
function assertNoDryRunSymlinkAncestors(path, rootPath) {
    const resolvedRootPath = NativePath.resolve(rootPath);
    const resolvedPath = NativePath.resolve(path);
    const relativePath = NativePath.relative(resolvedRootPath, resolvedPath);

    if (
        relativePath === '..' ||
        relativePath.startsWith(`..${NativePath.sep}`) ||
        NativePath.isAbsolute(relativePath)
    ) {
        throw new Error(`Dry-run path escapes its root: "${path}".`);
    }

    let currentPath = resolvedRootPath;

    for (const part of ['', ...relativePath.split(NativePath.sep)]) {
        if (part) {
            currentPath = NativePath.join(currentPath, part);
        }

        try {
            if (FS.lstatSync(currentPath).isSymbolicLink()) {
                throw new Error(
                    `Dry-run path cannot traverse a symbolic link: "${currentPath}".`
                );
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                break;
            }

            throw error;
        }
    }
}


/**
 * Deletes an S3 object from the active bucket.
 *
 * @param {string} path
 * Path of the S3 object in the bucket.
 *
 * @param {S3Session} session
 * Session to use. (Default: first created session)
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function deleteS3Object(
    path,
    session
) {
    if (session.dryrun) {
        const objectPath = Path.join(
            'tmp',
            's3',
            session.bucket,
            path
        );
        const deleteMarkerPath = getDryRunDeleteMarkerPath(path, session);
        const tempRoot = NativePath.resolve('tmp');
        const mirrorBucketPath = NativePath.resolve(
            'tmp',
            's3',
            session.bucket
        );
        const markerBucketPath = NativePath.resolve(
            'tmp',
            's3-delete-markers',
            session.bucket
        );

        assertNoDryRunSymlinkAncestors(mirrorBucketPath, tempRoot);
        assertNoDryRunSymlinkAncestors(objectPath, mirrorBucketPath);
        assertNoDryRunSymlinkAncestors(markerBucketPath, tempRoot);
        assertNoDryRunSymlinkAncestors(deleteMarkerPath, markerBucketPath);
        await FS.promises.mkdir(
            NativePath.dirname(deleteMarkerPath),
            { recursive: true }
        );
        assertNoDryRunSymlinkAncestors(objectPath, mirrorBucketPath);
        assertNoDryRunSymlinkAncestors(deleteMarkerPath, markerBucketPath);

        await FS.promises.rm(objectPath, { force: true });
        await FS.promises.writeFile(deleteMarkerPath, '', 'utf-8');
    } else {
        await session.region.deleteObject({
            Bucket: session.bucket,
            Key: path
        });
    }
}


/**
 * Converts an array of items into chunks of sub-arrays with 100 items.
 *
 * @param {Array<T>} items
 * Array to split into chunks.
 *
 * @param {number} [size=100]
 * Maximum size of each chunk.
 *
 * @return {Array<Array<T>>}
 * Array of chunks.
 *
 * @template T
 */
function getChunks(
    items,
    size = 100
) {
    items = items.slice();

    if (items.length <= size) {
        return [items];
    }

    const chunks = [];

    while (items.length) {
        chunks.push(items.splice(0, size));
    }

    return chunks;
}


/**
 * Gets an S3 object from the active bucket.
 *
 * @param {string} path
 * Path of the S3 object in the bucket.
 *
 * @param {S3Session} [session]
 * Session to use. (Default: first created session)
 *
 * @return {Promise<string>}
 * Content of the S3 object.
 */
async function getS3Object(
    path,
    session = defaultSession
) {
    const obj = await session.region.getObject({
        Bucket: session.bucket,
        Key: path
    });

    return obj.Body.toString('utf-8');
}


/**
 * Get last modification date of S3 objects in specific path prefix of the
 * bucket.
 *
 * @param {string} pathPrefix
 * Path prefix of the S3 objects in the bucket.
 *
 * @param {S3Session} session
 * Session to use. (Default: first created session)
 *
 * @return {Promise<Record<string,Date>>}
 * Object paths with their last modification dates.
 */
async function getS3LastModified(
    pathPrefix,
    session = defaultSession
) {
    if (session.dryrun) {
        return getDryRunS3LastModified(pathPrefix, session);
    }

    const bucket = session.bucket;
    const region = session.region;
    const files = {};

    let continueToken;
    let isTruncated = true;
    const seenTokens = new Set();

    while (isTruncated) {
        const params = {
            Bucket: bucket,
            Prefix: pathPrefix
        };

        if (continueToken) {
            params.ContinuationToken = continueToken;
        }

        const response = await region.listObjectsV2(params);

        if (response.Contents) {
            for (const item of response.Contents) {
                if (item.Key.startsWith(pathPrefix)) {
                    files[item.Key] = item.LastModified;
                }
            }
        }

        isTruncated = Boolean(response.IsTruncated);

        if (isTruncated) {
            const nextToken = response.NextContinuationToken;

            if (!nextToken || seenTokens.has(nextToken)) {
                throw new Error(
                    `Incomplete S3 listing for "${pathPrefix}": ` +
                    `${nextToken ? 'repeated' : 'missing'} continuation token.`
                );
            }

            seenTokens.add(nextToken);
            continueToken = nextToken;
        }
    }

    return files;
}


/**
 * Gets last modification dates from the local S3 dry-run mirror.
 *
 * @param {string} pathPrefix
 * S3 key prefix to list.
 *
 * @param {S3Session} session
 * Session whose local bucket mirror should be read.
 *
 * @return {Record<string,Date>}
 * Matching object keys and their modification dates.
 */
function getDryRunS3LastModified(
    pathPrefix,
    session
) {
    const bucketPath = NativePath.resolve('tmp', 's3', session.bucket);
    const tempRoot = NativePath.resolve('tmp');
    const mirrorRoot = NativePath.resolve('tmp', 's3');
    const files = {};
    let scanPath = bucketPath;

    assertNoDryRunSymlinkAncestors(mirrorRoot, tempRoot);
    assertNoDryRunSymlinkAncestors(bucketPath, mirrorRoot);

    if (pathPrefix.startsWith('/')) {
        return files;
    }

    if (pathPrefix.endsWith('/')) {
        scanPath = NativePath.resolve(
            bucketPath,
            ...pathPrefix.split('/').filter(Boolean)
        );
    }

    const relativeScanPath = NativePath.relative(bucketPath, scanPath);

    if (
        relativeScanPath === '..' ||
        relativeScanPath.startsWith(`..${NativePath.sep}`) ||
        NativePath.isAbsolute(relativeScanPath)
    ) {
        return files;
    }

    assertNoDryRunSymlinkAncestors(scanPath, bucketPath);

    function visitDirectory(directoryPath) {
        assertNoDryRunSymlinkAncestors(directoryPath, bucketPath);

        if (!FS.existsSync(directoryPath)) {
            return;
        }

        for (const entry of FS.readdirSync(directoryPath, {
            withFileTypes: true
        })) {
            const entryPath = NativePath.join(directoryPath, entry.name);

            if (entry.isDirectory()) {
                visitDirectory(entryPath);
            } else if (entry.isFile()) {
                const key = NativePath.relative(bucketPath, entryPath)
                    .split(NativePath.sep)
                    .join('/');

                if (key.startsWith(pathPrefix)) {
                    files[key] = FS.statSync(entryPath).mtime;
                }
            }
        }
    }

    visitDirectory(scanPath);

    return files;
}


/**
 * Adds a trailing slash to a directory prefix, unless it represents the
 * bucket root.
 *
 * @param {string} prefix
 * S3 directory prefix.
 *
 * @return {string}
 * Normalized directory prefix.
 */
function normalizeDirectoryPrefix(prefix) {
    const normalizedPrefix = (prefix || '').replace(/\/+$/u, '');

    return normalizedPrefix ? `${normalizedPrefix}/` : '';
}


/**
 * Normalizes a native filesystem path for use with POSIX path operations.
 *
 * @param {string} sourcePath
 * Native source directory path.
 *
 * @return {string}
 * Source directory path with forward slashes.
 */
function normalizeSourcePath(sourcePath) {
    return NativePath.sep === '\\' ?
        sourcePath.replace(/\\/gu, '/') :
        sourcePath;
}


/**
 * Puts an S3 object into the active bucket.
 *
 * @param {string} path
 * Path of the S3 object in the bucket.
 *
 * @param {string} content
 * Content of the S3 object.
 *
 * @param {AWS.PutObjectCommandInput} [options]
 * Additional options for the S3 object.
 *
 * @param {S3Session} [session]
 * Session to use. (Default: first created session)
 *
 * @return {Promise<string>}
 * Content of the S3 object.
 */
async function putS3Object(
    path,
    content,
    options = {},
    session = defaultSession
) {
    if (session && session.dryrun) {
        const fsLib = require('../../libs/fs');

        path = Path.join('tmp', 's3', session.bucket, path);
        const tempRoot = NativePath.resolve('tmp');
        const mirrorRoot = NativePath.resolve('tmp', 's3');
        const bucketPath = NativePath.resolve(mirrorRoot, session.bucket);

        assertNoDryRunSymlinkAncestors(mirrorRoot, tempRoot);
        assertNoDryRunSymlinkAncestors(bucketPath, mirrorRoot);
        assertNoDryRunSymlinkAncestors(path, bucketPath);

        fsLib.makePath(Path.dirname(path));
        assertNoDryRunSymlinkAncestors(path, bucketPath);

        await FS.writeFile(
            path,
            JSON.stringify({ ...options, content }),
            'utf-8'
        );
    } else {
        await session.region.putObject({
            Bucket: session.bucket,
            Key: path,
            Body: content,
            ContentType: `${MIME_TYPE[Path.extname(path)]}; charset=utf-8`,
            ACL: 'public-read',
            ...options
        });
    }
}


/**
 * Creates a S3 session in an AWS region.
 *
 * @param {string} bucket
 * Initial bucket of the session.
 *
 * @param {string} [profile]
 * AWS profile to use. This needs to be setup in `~/.aws/credentials`.
 *
 * @param {string} [region="eu-west-1"]
 * Region of the session, e.g. `us-west-2`.
 *
 * @param {boolean} [dryrun]
 * Whether to really upload or write to `./tmp/s3` for a dryrun.
 *
 * @return {Promise<S3Session>}
 * S3 session to use. If this is the first session it also becomes default.
 */
async function startS3Session(
    bucket,
    profile = void 0,
    region = (process.env.AWS_REGION || 'eu-west-1'),
    dryrun = void 0
) {
    /** @type {S3Session} */
    const session = {
        bucket,
        profile,
        region: new AWS.S3({
            region,
            credentials: (
                profile ?
                    fromIni({ profile }) :
                    // Torstein commented this out 2023-10-30. The `fromEnv()`
                    // approach fails because I have my credentials defined in
                    // ~/.aws/credentials
                    // fromEnv() || void 0
                    void 0
            )
        })
    };

    if (dryrun) {
        session.bucket = (session.bucket || 'bucket');
        session.dryrun = true;
    }

    defaultSession = defaultSession || session;

    return session;
}


/**
 * Synchronize a local directory with a remote directory in a S3 bucket.
 *
 * @param {string} sourcePath
 * Source path of the local directory to synchronize.
 *
 * @param {string} targetPathPrefix
 * Target path to the remote directory to synchronize.
 *
 * @param {S3Session} [session]
 * Session to use. (Default: first created session)
 *
 * @param {Function} [filterCallback]
 * Callback to filter file content.
 *
 * @param {Function} [includeKey]
 * Return true for S3 keys that may be deleted or uploaded.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function synchronizeDirectory(
    sourcePath,
    targetPathPrefix,
    session = defaultSession,
    filterCallback = void 0,
    includeKey = void 0
) {
    const fsLib = require('../../libs/fs');
    const glob = require('glob');
    const log = require('../../libs/log');
    const shouldIncludeKey = typeof includeKey === 'function' ?
        includeKey :
        () => true;

    sourcePath = normalizeSourcePath(sourcePath);
    targetPathPrefix = normalizeDirectoryPrefix(targetPathPrefix);

    log.warn(`Start synchronization of "${sourcePath}"...`);

    const fileModificationTimes = await getS3LastModified(
        targetPathPrefix,
        session
    );
    const fileKeys = Object.keys(fileModificationTimes).filter(
        shouldIncludeKey
    );
    const fileKeySet = new Set(fileKeys);
    const versionPattern = /\d+\//u;

    let didSomeWork = false;

    for (const fileKeysChunk of getChunks(fileKeys)) {
        const chunkPromises = [];

        for (const fileKey of fileKeysChunk) {
            const filePath = Path.join(
                sourcePath,
                Path.relative(targetPathPrefix, fileKey)
            );

            // skip versioned files
            if (fileKey.match(versionPattern)) {
                continue;
            }

            if (!FS.existsSync(filePath)) {
                chunkPromises.push(deleteS3Object(fileKey, session));
            } else if (
                fileModificationTimes[fileKey] < FS.lstatSync(filePath).mtime
            ) {
                chunkPromises.push(
                    uploadFile(
                        filePath,
                        fileKey,
                        session,
                        filterCallback
                    )
                );
            }
        }

        didSomeWork = chunkPromises.length > 0;

        await Promise.all(chunkPromises);
    }

    const toDoFiles = glob
        .sync(Path.join(sourcePath, '**/*'))
        .map(normalizeSourcePath)
        .filter(path => {
            if (fsLib.isDotEntry(path) || !fsLib.isFile(path)) {
                return false;
            }

            const key = Path.join(
                targetPathPrefix,
                Path.relative(sourcePath, path)
            );

            return !fileKeySet.has(key) && shouldIncludeKey(key);
        });

    for (const toDoFileChunk of getChunks(toDoFiles)) {
        const chunkPromises = [];

        for (const filePath of toDoFileChunk) {
            const targetPath = Path.join(
                targetPathPrefix,
                Path.relative(sourcePath, filePath)
            );

            chunkPromises.push(
                uploadFile(
                    filePath,
                    targetPath,
                    session,
                    filterCallback
                )
            );
        }

        didSomeWork = chunkPromises.length > 0;

        await Promise.all(chunkPromises);
    }

    if (!didSomeWork) {
        log.warn('Found nothing new to upload or delete.');
    }
}


/**
 * Transforms a filepath to a similar named S3 destination path.
 *
 * @param {string} fromPath
 * File to create a S3 destination path for.
 *
 * @param {string} removeFromDestPath
 * Anything in the fromPath that you want to remove from destination path.
 *
 * @param {string} prefix
 * Prefix for S3 destination key.
 *
 * @return {{from: *, to: string}} object for upload api.
 */
function toS3Path(fromPath, removeFromDestPath, prefix) {
    return {
        from: fromPath,
        to: Path.join(
            prefix || '',
            Path.relative(removeFromDestPath || '', fromPath)
        )
    };
}


/**
 * Uploads a directory to the bucket.
 *
 * @param {string} sourcePath
 * Directory path to upload.
 *
 * @param {string} targetPathPrefix
 * Target path prefix to upload to.
 *
 * @param {S3Session} [session]
 * Session to use. (Default: first created session)
 *
 * @param {Function} [filterCallback]
 * Callback to filter file content.
 *
 * @param {Function} [includeKey]
 * Return true for S3 keys that may be uploaded.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadDirectory(
    sourcePath,
    targetPathPrefix,
    session = defaultSession,
    filterCallback = void 0,
    includeKey = void 0
) {
    const fsLib = require('../../libs/fs');
    const glob = require('glob');
    const log = require('../../libs/log');
    const shouldIncludeKey = typeof includeKey === 'function' ?
        includeKey :
        () => true;

    sourcePath = normalizeSourcePath(sourcePath);

    log.warn(`Start upload of "${sourcePath}"...`);

    const files = glob
        .sync(Path.join(sourcePath, '**/*'))
        .map(normalizeSourcePath)
        .filter(path => (
            Path.basename(path).indexOf('.') !== 0 &&
            fsLib.isFile(path)
        ));

    await delay(1000);

    for (const fileChunk of getChunks(files)) {
        const chunkPromises = [];

        for (const filePath of fileChunk) {
            const targetPath = Path.join(
                targetPathPrefix,
                Path.relative(sourcePath, filePath)
            );

            if (!shouldIncludeKey(targetPath)) {
                continue;
            }

            chunkPromises.push(uploadFile(
                filePath,
                targetPath,
                session,
                filterCallback
            ));
        }

        await Promise.all(chunkPromises);
    }

    log.success('Done.');
}


/**
 * Uploads a file to the bucket.
 *
 * @param {string} sourcePath
 * File path to upload.
 *
 * @param {object} targetPath
 * Key path to upload to.
 *
 * @param {S3Session} [session]
 * Session to use. (Default: first created session)
 *
 * @param {Function} [filterCallback]
 * Callback to filter file content.
 *
 * @param {object} s3Params
 * Additional options for the S3 object.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadFile(
    sourcePath,
    targetPath,
    session = defaultSession,
    filterCallback = void 0,
    s3Params = {}
) {
    const log = require('../../libs/log');

    let fileContent = FS.readFileSync(sourcePath);

    if (filterCallback) {
        fileContent = filterCallback(sourcePath, fileContent);
    }

    if (session.dryrun) {
        const s3Key = targetPath;
        targetPath = Path.join('tmp', 's3', session.bucket, targetPath);
        const deleteMarkerPath = getDryRunDeleteMarkerPath(s3Key, session);
        const tempRoot = NativePath.resolve('tmp');
        const mirrorRoot = NativePath.resolve('tmp', 's3');
        const mirrorBucketPath = NativePath.resolve(mirrorRoot, session.bucket);
        const markerBucketPath = NativePath.resolve(
            'tmp',
            's3-delete-markers',
            session.bucket
        );

        assertNoDryRunSymlinkAncestors(mirrorRoot, tempRoot);
        assertNoDryRunSymlinkAncestors(mirrorBucketPath, mirrorRoot);
        assertNoDryRunSymlinkAncestors(targetPath, mirrorBucketPath);
        assertNoDryRunSymlinkAncestors(markerBucketPath, tempRoot);
        assertNoDryRunSymlinkAncestors(deleteMarkerPath, markerBucketPath);
        FS.mkdirSync(Path.dirname(targetPath), { recursive: true });
        assertNoDryRunSymlinkAncestors(targetPath, mirrorBucketPath);
        assertNoDryRunSymlinkAncestors(deleteMarkerPath, markerBucketPath);

        FS.writeFileSync(targetPath, fileContent, { encoding: 'binary' });
        await FS.promises.rm(
            deleteMarkerPath,
            { force: true }
        );

        log.message(targetPath, 'would be uploaded');
    } else {

        await putS3Object(targetPath, fileContent, s3Params, session);

        log.message(sourcePath, 'uploaded');
    }
}


/* *
 *
 *  Legacy
 *
 * */


/**
 * Utility function for gettin properties defined in git-ignore-me.properties
 * @return {Object} properties in file, or empty object.
 */
function getGitIgnoreMeProperties() {
    const fs = require('node:fs');

    if (!fs.existsSync('./git-ignore-me.properties')) {
        return {};
    }

    const properties = {};
    const lines = fs.readFileSync(
        './git-ignore-me.properties', 'utf-8'
    );

    lines.split('\n').forEach(function (line) {
        line = line.split('=');
        if (line[0]) {
            properties[line[0]] = line[1];
        }
    });

    return properties;
}


/**
 * Creates an array of the version paths that are used when uploading to S3.
 *
 * @param {string} version, typically from package.json.
 * @return {string[]} an array of paths where contents should be stored.
 * E.g 7.1.1 as input would return ['7.1.1', '7.1', '7'].
 */
function getVersionPaths(version) {
    const semver = require('semver');

    version = (version || require(('../../../package.json')).version);

    const preleaseVersion = semver.prerelease(version) ? `-${semver.prerelease(version).join('.')}` : '';

    return [
        `${semver.major(version)}${preleaseVersion}`,
        `${semver.major(version)}.${semver.minor(version)}${preleaseVersion}`,
        `${version}`
    ];
}


/**
 * Upload w/progress bar.
 *
 * @param {object} params
 * Containing batchSize, bucket, files, onError callback and callback per
 * processed file.
 *
 * @return {Promise}
 * Promise to keep
 */
async function uploadFiles(params) {
    const log = require('../../libs/log');
    const { files, name, bucket, s3Params, region } = params;

    const stagingBuckets = [
        'staging-code.highcharts.com'
    ];

    params = Object.assign(
        {
            batchSize: 1500,
            bucket,
            onError: err => {
                log.failure(`File(s) errored:\n${err && err.message} ${err.from ? ' - ' + err.from : ''}`);
            },
            callback: (from, to) => {
                log.message(`Uploaded ${from} --> ${to}`);
            },
            region: region || stagingBuckets.includes(bucket) ?
                'eu-central-1' :
                'eu-west-1'
        },
        params
    );

    const nFiles = files.length === 1 ? '1 file' : `${files.length} files`;

    log.starting(`Uploading ${nFiles} for ${name} to bucket ${bucket}:\n`);

    if (files.length === 0) {
        log.message('Upload initiated, but no files specified.');
        return;
    }

    const session = await startS3Session(
        params.bucket,
        params.profile,
        params.region,
        params.dryrun
    );

    for (const fileChunk of getChunks(files, params.batchSize)) {
        const chunkPromises = [];

        for (const file of fileChunk) {
            chunkPromises.push(
                uploadFile(file.from, file.to, session, void 0, s3Params)
                    .then(() => params.callback(file.from, file.to))
                    .catch(params.onError)
            );
        }

        await Promise.all(chunkPromises);
    }

}


/* *
 *
 *  Default Export
 *
 * */


module.exports = {
    deleteS3Object,
    getGitIgnoreMeProperties,
    getS3LastModified,
    getS3Object,
    getVersionPaths,
    putS3Object,
    startS3Session,
    synchronizeDirectory,
    toS3Path,
    uploadDirectory,
    uploadFile,
    uploadFiles
};
