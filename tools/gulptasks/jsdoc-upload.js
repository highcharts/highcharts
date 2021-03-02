/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-console, no-use-before-define, quotes */
/* eslint func-style: 0, no-console: 0, max-len: 0 */

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
    '--profile AWS profile to load from AWS credentials file. If no profile',
    '          is provided the default profile or standard AWS environment',
    '          variables for credentials will be used. (optional)',
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

/* *
 *
 *  Functions
 *
 * */

/**
 * Deletes file keys in a S3 bucket.
 *
 * @param {AWS.S3} storage
 * AWS S3 storage to use.
 *
 * @param {string} bucket
 * AWS S3 bucket to use.
 *
 * @param {Array<string>} fileKeys
 * File keys to delete.
 *
 * @return {Promise}
 * Promise to keep.
 */
function deleteFileKeys(storage, bucket, ...fileKeys) {
    return storage
        .deleteObjects({
            Bucket: bucket,
            Delete: { Objects: fileKeys.map(fileKey => ({ Key: fileKey })) }
        })
        .promise()
        .then(response => {
            if (response.Errors) {
                throw new Error(
                    'Deletion of file keys failed!',
                    response.Errors
                );
            }
        });
}

/**
 * Fetches keys from an S3 bucket.
 *
 * @param {AWS.S3} storage
 * AWS S3 instance to fetch from.
 *
 * @param {string} bucket
 * AWS S3 bucket to fetch from.
 *
 * @param {string} [keyPrefix]
 * Limit fetch to keys with given prefix.
 *
 * @return {Array<string>}
 * Fetched file keys.
 */
function fetchFileKeys(storage, bucket, keyPrefix) {
    return new Promise((resolve, reject) => {
        const files = [];
        // eslint-disable-next-line require-jsdoc
        function fetch(continuationToken) {
            storage
                .listObjectsV2({
                    Bucket: bucket,
                    ContinuationToken: continuationToken,
                    StartAfter: keyPrefix
                })
                .promise()
                .then(response => {
                    if (response.Contents) {
                        files.push(
                            ...response.Contents
                                .map(item => item.Key)
                                .filter(key => {
                                    if (key.startsWith(keyPrefix)) {
                                        return true;
                                    }

                                    delete response.NextContinuationToken;
                                    return false;
                                })
                        );
                    }

                    if (
                        response.IsTruncated &&
                        response.NextContinuationToken
                    ) {
                        return fetch(response.NextContinuationToken);
                    }

                    return resolve(files);
                })
                .catch(reject);
        }
        fetch();
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
    if (
        !/^(?:foot|head)(?:er)?/g.test(path.basename(filePath)) &&
        !fileContent.includes('<frame') &&
        !fileContent.includes('<iframe')
    ) {
        switch (path.extname(filePath)) {
            case '.htm':
            case '.html':
                fileContent = Buffer.from(
                    fileContent
                        .toString()
                        .replace(/^(.*\<\/head\>.*)$/m, HTML_HEAD_STATIC + '\n$1')
                );
                break;
            default:
        }
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
 * @return {Promise}
 * Promise to keep.
 */
function uploadFile(sourceFile, targetStorage, targetBucket) {
    const log = require('./lib/log');

    const fileContent = updateFileContent(
        sourceFile,
        fs.readFileSync(sourceFile)
    );
    const filePath = path.relative(SOURCE_ROOT, sourceFile);

    return targetStorage
        .putObject({
            Bucket: targetBucket,
            Key: filePath,
            Body: fileContent,
            ContentType: MIME_TYPE[path.extname(filePath)],
            ACL: 'public-read'
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
 * @param {boolean} synchronize
 * Deletes all files in the AWS S3 bucket, that do not exist locally.
 *
 * @param {boolean} test
 * Does not upload or delete.
 *
 * @return {Promise}
 * Promise to keep.
 */
function uploadFolder(
    sourceFolder,
    targetStorage,
    bucket,
    synchronize,
    test
) {
    const log = require('./lib/log');

    let promiseChain = Promise.resolve();

    log.message(`Start upload of "${sourceFolder}"...`);

    const files = glob
        .sync(path.posix.join(sourceFolder, '**/*'))
        .filter(sourcePath => (
            path.basename(sourcePath).indexOf('.') !== 0 &&
            fs.lstatSync(sourcePath).isFile()
        ));

    files.forEach(filePath => {
        promiseChain = promiseChain.then(() => {
            if (test) {
                log.message(filePath, 'would be uploaded');
            } else {
                uploadFile(filePath, targetStorage, bucket);
            }
        });
    });

    if (synchronize) {
        promiseChain = promiseChain
            .then(() => log.message(`Start synchronization of "${sourceFolder}"...`))
            .then(() => fetchFileKeys(
                targetStorage,
                bucket,
                path.relative(SOURCE_ROOT, sourceFolder)
            ))
            .then(fileKeys => {
                const versionPattern = /\d+\.\d+/;

                fileKeys = fileKeys
                    .filter(fileKey => !fileKey.match(versionPattern))
                    .filter(fileKey => !fs.existsSync(path.join(SOURCE_ROOT, fileKey)));

                if (test) {
                    fileKeys.forEach(fileKey => {
                        log.message(fileKey, 'would be deleted');
                    });
                } else {
                    deleteFileKeys(targetStorage, bucket, fileKeys);
                }
            });
    }

    return promiseChain;
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
        help,
        profile,
        sync,
        test
    } = require('yargs').argv;

    if (help) {
        log.message(HELP_MESSAGE);
        return Promise.resolve();
    }

    if (!bucket) {
        throw new Error('No --bucket specified.');
    }

    if (!fs.lstatSync(SOURCE_ROOT).isDirectory()) {
        throw new Error(`Source directory "${SOURCE_ROOT}" not found.`);
    }

    const sourceFolders = (
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

    sourceFolders.forEach(sourceFolder => {
        promiseChain = promiseChain.then(() => uploadFolder(
            sourceFolder,
            targetStorage,
            bucket,
            sync,
            test
        ));
    });

    promiseChain = promiseChain.catch(log.failure);

    return promiseChain;
}

/* *
 *
 *  Tasks
 *
 * */

gulp.task('jsdoc-upload', jsdocUpload);
