/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */

/* *
 *
 *  Imports
 *
 * */

const fs = require('fs');
const glob = require('glob');
const gulp = require('gulp');
const path = require('path');

/* *
 *
 *  Constants
 *
 * */

const HELP_MESSAGE = [
    'Uploads API documentation of "build/api" folder.',
    '',
    '--bucket  S3 bucket to upload to.',
    '--docs    Subfolders of "build/api" to upload. (optional)',
    '--helpme  This help.',
    '--profile AWS profile to load from AWS credentials file. If no profile',
    '          is provided the default profile or standard AWS environment',
    '          variables for credentials will be used. (optional)',
    '--speak   Says if task failed or succeeded. (optional)',
    '--sync    Synchronize the S3 bucket; deletes remote files that are not',
    '          found in the local folder. (optional)',
    '--test    Test run without uploading. (optional)'
].join('\n');

const HTML_HEAD_STATIC = [
    [
        '',
        '<script',
        'id="Cookiebot"',
        'src="https://consent.cookiebot.com/uc.js"',
        'data-cbid="8be0770c-8b7f-4e2d-aeb5-2cfded81e177"',
        'data-blockingmode="auto"',
        'type="text/javascript"',
        '></script>'
    ].join('\n        '),
    [
        '',
        '<!-- Google Tag Manager -->',
        `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
        `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
        `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
        `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
        `})(window,document,'script','dataLayer','GTM-5WLVCCK');</script>`,
        `<!-- End Google Tag Manager -->`
    ].join('\n        ')
].join('\n');

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

const SOURCE_ROOT = 'build/api';

const TEST_ROOT = 'build/api-test';

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
 * Converts an array of items into chunks of sub-arrays with 100 items.
 *
 * @param {Array<T>} items
 * Array to split into chunks.
 *
 * @return {Array<Array<T>>}
 * Array of chunks.
 *
 * @template T
 */
function getChunks(items) {
    items = items.slice();

    if (items.length <= 100) {
        return [items];
    }

    const chunks = [];

    while (items.length) {
        chunks.push(items.splice(0, 100));
    }

    return chunks;
}

/**
 * Deletes file keys in a S3 bucket.
 *
 * @param {AWS.S3} storage
 * AWS S3 storage to use.
 *
 * @param {string} bucket
 * AWS S3 bucket to use.
 *
 * @param {string} fileKey
 * File key to delete.
 *
 * @param {boolean} test
 * Does not delete, just test local.
 *
 * @return {Promise}
 * Promise to keep.
 */
function deleteFileKey(storage, bucket, fileKey, test) {
    const log = require('./lib/log');

    if (test) {
        log.warn(fileKey, 'would be deleted');
        return Promise.resolve();
    }

    return storage
        .deleteObject({
            Bucket: bucket,
            Key: fileKey
        })
        .promise()
        .then(() => log.warn(fileKey, 'deleted'));
}

/**
 * Fetches keys with modification time from an S3 bucket.
 *
 * @param {AWS.S3} storage
 * AWS S3 instance to fetch from.
 *
 * @param {string} bucket
 * AWS S3 bucket to fetch from.
 *
 * @param {string} [keyPrefix]
 * Limit fetch to items with given key prefix.
 *
 * @return {Promise<Record<string, Date>>}
 * Fetched file items.
 */
function fetchFileModificationTimes(storage, bucket, keyPrefix) {
    return new Promise((resolve, reject) => {
        const files = {};

        // eslint-disable-next-line require-jsdoc
        function fetch(continuationToken) {
            storage.listObjectsV2({
                Bucket: bucket,
                ContinuationToken: continuationToken,
                StartAfter: keyPrefix
            }).promise().then(response => {
                if (response.Contents) {
                    response.Contents.forEach(item => {
                        if (item.Key.startsWith(keyPrefix)) {
                            files[item.Key] = item.LastModified;
                        } else { // abort after items with key prefix
                            delete response.NextContinuationToken;
                        }
                    });
                }

                if (
                    response.IsTruncated &&
                    response.NextContinuationToken
                ) {
                    return fetch(response.NextContinuationToken);
                }

                return resolve(files);
            }).catch(reject);
        }

        fetch();
    });
}

/**
 * Synchronizes a folder with the bucket.
 *
 * @param {string} sourceFolder
 * Source path to load from.
 *
 * @param {AWS.S3} targetStorage
 * AWS S3 instance to synchronize with.
 *
 * @param {string} bucket
 * AWS S3 bucket to synchronize with.
 *
 * @param {boolean} test
 * Does not upload or delete, just test local.
 *
 * @return {Promise}
 * Promise to keep.
 */
function synchronizeFolder(
    sourceFolder,
    targetStorage,
    bucket,
    test
) {
    const log = require('./lib/log');

    log.warn(`Start synchronization of "${sourceFolder}"...`);

    return fetchFileModificationTimes(
        targetStorage,
        bucket,
        path.relative(SOURCE_ROOT, sourceFolder)
    ).then(fileModificationTimes => {
        const fileKeys = Object.keys(fileModificationTimes);
        const versionPattern = /\d+\.\d+/;

        let synchronizePromises = delay(1000),
            didSomeWork = false;

        getChunks(fileKeys).forEach(fileKeysChunk => {
            synchronizePromises = synchronizePromises.then(() => Promise.all(
                fileKeysChunk.map(fileKey => {
                    const filePath = path.join(SOURCE_ROOT, fileKey);

                    if (fileKey.match(versionPattern)) {
                        return Promise.resolve();
                    }

                    if (!fs.existsSync(filePath)) {
                        didSomeWork = true;
                        return deleteFileKey(
                            targetStorage,
                            bucket,
                            fileKey,
                            test
                        );
                    }

                    if (
                        fileModificationTimes[fileKey] <
                        fs.lstatSync(filePath).mtime
                    ) {
                        didSomeWork = true;
                        return uploadFile(
                            filePath,
                            targetStorage,
                            bucket,
                            test
                        );
                    }

                    return Promise.resolve();
                })
            ));
        });

        const filePaths = glob
            .sync(path.posix.join(sourceFolder, '**/*'))
            .filter(sourcePath => (
                path.basename(sourcePath).indexOf('.') !== 0 &&
                fs.lstatSync(sourcePath).isFile() &&
                !fileKeys.includes(path.relative(SOURCE_ROOT, sourcePath))
            ));

        getChunks(filePaths).forEach(filePathsChunk => {
            synchronizePromises = synchronizePromises.then(() => Promise.all(
                filePathsChunk.map(filePath => {
                    didSomeWork = true;
                    return uploadFile(
                        filePath,
                        targetStorage,
                        bucket,
                        test
                    );
                })
            ));
        });

        synchronizePromises = synchronizePromises.then(() => {
            if (!didSomeWork) {
                log.warn('Found nothing new to delete or upload.');
            }
        });

        return synchronizePromises;
    });
}

/**
 * Updates some file content with additional HTML file content.
 *
 * @param {string} filePath
 * Local source path of the file.
 *
 * @param {Buffer} fileContent
 * File content to update.
 *
 * @return {Buffer}
 * Updated file content.
 */
function updateFileContent(filePath, fileContent) {
    const basename = path.basename(filePath);

    switch (path.extname(filePath)) {
        case '.htm':
        case '.html':
            if (
                !/^(?:(?:foot|head)(?:er)?|index)|-frame\.html?/.test(basename) &&
                !fileContent.includes('<frame') &&
                !fileContent.includes('<iframe')
            ) {
                fileContent = Buffer.from(
                    fileContent
                        .toString()
                        .replace(/^(.*\<\/head\>.*)$/m, HTML_HEAD_STATIC + '\n$1')
                );
            }
            break;
        default:
    }

    return fileContent;
}


/**
 * Uploads a file to the bucket.
 *
 * @param {string} sourceFile
 * File to upload.
 *
 * @param {AWS.S3} targetStorage
 * AWS S3 instance to upload to.
 *
 * @param {string} targetBucket
 * AWS S3 bucket to upload to.
 *
 * @param {boolean} test
 * Does not upload, just test local.
 *
 * @return {Promise}
 * Promise to keep.
 */
function uploadFile(
    sourceFile,
    targetStorage,
    targetBucket,
    test
) {
    const log = require('./lib/log');
    const fileContent = updateFileContent(
        sourceFile,
        fs.readFileSync(sourceFile)
    );

    const filePath = path.relative(SOURCE_ROOT, sourceFile);

    if (test) {
        return new Promise((resolve, reject) => {
            const testPath = path.join(TEST_ROOT, filePath);
            const testFolderPath = path.dirname(testPath);
            try {
                if (!fs.existsSync(testFolderPath)) {
                    fs.mkdirSync(testFolderPath, { recursive: true });
                }
                fs.writeFileSync(
                    testPath,
                    fileContent,
                    { encoding: 'binary' }
                );
                log.message(testPath, 'would be uploaded');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    return targetStorage
        .putObject({
            Bucket: targetBucket,
            Key: filePath,
            Body: fileContent,
            ContentType: MIME_TYPE[path.extname(filePath)]
        })
        .promise()
        .then(() => log.message(filePath, 'uploaded'));
}

/**
 * Uploads a folder to the bucket.
 *
 * @param {string} sourceFolder
 * Source path to load from.
 *
 * @param {AWS.S3} targetStorage
 * AWS S3 instance to upload to.
 *
 * @param {string} bucket
 * AWS S3 bucket to upload to.
 *
 * @param {boolean} test
 * Does not upload or delete, just test local.
 *
 * @return {Promise}
 * Promise to keep.
 */
function uploadFolder(
    sourceFolder,
    targetStorage,
    bucket,
    test
) {
    const log = require('./lib/log');

    log.warn(`Start upload of "${sourceFolder}"...`);

    const filePaths = glob
        .sync(path.posix.join(sourceFolder, '**/*'))
        .filter(sourcePath => (
            path.basename(sourcePath).indexOf('.') !== 0 &&
            fs.lstatSync(sourcePath).isFile()
        ));

    let uploadPromises = delay(1000);

    getChunks(filePaths).forEach(filePathsChunk => {
        uploadPromises = uploadPromises.then(() => Promise.all(
            filePathsChunk.map(filePath => uploadFile(
                filePath,
                targetStorage,
                bucket,
                test
            ))
        ));
    });

    return uploadPromises;
}

/**
 * Uploads API documentation.
 *
 * @return {Promise}
 * Promise to keep.
 */
function jsdocUpload() {
    const aws = require('aws-sdk');
    const lfs = require('./lib/fs');
    const log = require('./lib/log');
    const {
        bucket,
        docs,
        helpme,
        profile,
        speak,
        sync,
        test
    } = require('yargs').argv;

    if (helpme) {
        // eslint-disable-next-line no-console
        console.log(HELP_MESSAGE);
        return Promise.resolve();
    }

    if (!bucket) {
        throw new Error('No --bucket specified.');
    }

    if (
        !fs.existsSync(SOURCE_ROOT) ||
        !fs.lstatSync(SOURCE_ROOT).isDirectory()
    ) {
        throw new Error(`Source directory "${SOURCE_ROOT}" not found.`);
    }

    const sourceItems = (
        typeof docs === 'string' ?
            docs.split(',').map(folder => path.join(SOURCE_ROOT, folder)) :
            lfs.getDirectoryPaths(SOURCE_ROOT)
    );
    const targetStorage = new aws.S3({
        region: (process.env.AWS_REGION || 'eu-west-1'),
        credentials: (
            profile ?
                new aws.SharedIniFileCredentials({ profile }) :
                void 0
        )
    });

    let promiseChain = Promise.resolve();

    if (test) {
        if (fs.existsSync(TEST_ROOT)) {
            promiseChain = promiseChain.then(() => fs.rmdirSync(
                TEST_ROOT,
                { recursive: true }
            ));
        }
        promiseChain = promiseChain.then(() => fs.mkdirSync(
            TEST_ROOT,
            { recursive: true }
        ));
    }

    sourceItems.forEach(sourceItem => {
        promiseChain = promiseChain.then(() => (
            fs.lstatSync(sourceItem).isFile() ?
                (
                    log.warn(`Start upload of "${sourceItem}"...`),
                    uploadFile(
                        sourceItem,
                        targetStorage,
                        bucket,
                        test
                    )
                ) :
                sync && !sourceItem.endsWith('zips') ?
                    synchronizeFolder(
                        sourceItem,
                        targetStorage,
                        bucket,
                        test
                    ) :
                    uploadFolder(
                        sourceItem,
                        targetStorage,
                        bucket,
                        test
                    )
        ));
    });

    promiseChain = promiseChain
        .then(() => {
            log.success('Done.');
            if (speak) {
                log.say(`${sync ? 'Synchronization' : 'Upload'} done.`);
            }
        })
        .catch(error => {
            log.failure(error);
            if (speak) {
                log.say(`${sync ? 'Synchronization' : 'Upload'} failed!`);
            }
        });

    return promiseChain;
}

/* *
 *
 *  Tasks
 *
 * */

gulp.task('jsdoc-upload', jsdocUpload);
