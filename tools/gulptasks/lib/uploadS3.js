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
const { fromEnv, fromIni } = require('@aws-sdk/credential-providers');
const FS = require('node:fs/promises');
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
        const fsLib = require('./fs');

        path = Path.join(
            'tmp',
            's3',
            session.bucket,
            Path.dirname(path),
            `DELETE ${Path.basename(path)}`
        );

        fsLib.makePath(Path.dirname(path));

        await FS.writeFile(path, '', 'utf-8');
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
    const bucket = session.bucket;
    const region = session.region;
    const files = {};

    var continueToken;
    var response;

    do {
        response = await region.listObjectsV2({
            Bucket: bucket,
            ContinuationToken: continueToken,
            StartAfter: pathPrefix

        });

        if (response.Contents) {
            for (const item of response.Contents) {
                if (item.Key.startsWith(pathPrefix)) {
                    files[item.Key] = item.LastModified;
                } else { // abort after items with key prefix
                    delete response.NextContinuationToken;
                }
            }
        }

        continueToken = response.ContinuationToken;
    }
    while (response.IsTruncated);

    return files;
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
    if (session.dryrun) {
        const fsLib = require('./fs');

        path = Path.join('tmp', 's3', session.bucket, path);

        fsLib.makePath(Path.dirname(path));

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
                    fromEnv() || void 0
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
 * @return {Promise}
 * Promise to keep.
 */
async function synchronizeDirectory(
    sourcePath,
    targetPathPrefix,
    session = defaultSession,
    filterCallback = void 0
) {
    const fsLib = require('./fs');
    const glob = require('glob');
    const log = require('./log');

    log.warn(`Start synchronization of "${sourcePath}"...`);

    const fileModificationTimes = await getS3LastModified(
        targetPathPrefix,
        session
    );
    const fileKeys = Object.keys(fileModificationTimes);
    const versionPattern = /\d+\//u;

    let didSomeWork = false;

    for (const fileKeysChunk of getChunks(fileKeys)) {
        const chunkPromises = [];

        for (const fileKey of fileKeysChunk) {
            const filePath = Path.join(sourcePath, fileKey);

            // skip versioned files
            if (fileKey.match(versionPattern)) {
                continue;
            }

            if (!FS.existsSync(filePath)) {
                chunkPromises.push(deleteS3Object(filePath, session));
            }

            if (
                fileModificationTimes[fileKey] <
                FS.lstatSync(filePath).mtime
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
        .filter(path => (
            !fsLib.isDotEntry(path) &&
            fsLib.isFile(path) &&
            !fileKeys.includes(Path.relative(sourcePath, path))
        ));

    for (const toDoFileChunk of getChunks(toDoFiles)) {
        const chunkPromises = [];

        for (const filePath of toDoFileChunk) {
            chunkPromises.push(
                uploadFile(
                    filePath,
                    Path.join(
                        targetPathPrefix,
                        Path.relative(sourcePath, filePath)
                    ),
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
        to: Path.join(prefix || '', Path.relative(removeFromDestPath, fromPath))
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
 * @return {Promise}
 * Promise to keep.
 */
async function uploadDirectory(
    sourcePath,
    targetPathPrefix,
    session = defaultSession,
    filterCallback = void 0
) {
    const fsLib = require('./fs');
    const glob = require('glob');
    const log = require('./log');

    log.warn(`Start upload of "${sourcePath}"...`);

    const files = glob
        .sync(Path.join(sourcePath, '**/*'))
        .filter(path => (
            Path.basename(path).indexOf('.') !== 0 &&
            fsLib.isFile(path)
        ));

    await delay(1000);

    for (const fileChunk of getChunks(files)) {
        const chunkPromises = [];

        for (const filePath of fileChunk) {
            chunkPromises.push(uploadFile(
                filePath,
                Path.join(
                    targetPathPrefix,
                    Path.relative(sourcePath, filePath)
                ),
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
    const log = require('./log');

    let fileContent = await FS.readFile(sourcePath);

    if (filterCallback) {
        fileContent = filterCallback(sourcePath, fileContent);
    }

    if (session.dryrun) {
        const fsLib = require('./fs');

        targetPath = Path.join('tmp', 's3', session.bucket, targetPath);

        fsLib.makePath(Path.dirname(targetPath));

        await FS.writeFile(targetPath, fileContent, { encoding: 'binary' });

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
    const log = require('./log');
    const { files, name, bucket, s3Params } = params;

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
            region: 'eu-west-1'
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
