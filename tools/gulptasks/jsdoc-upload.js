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

const HELP = [
    'Uploads API documentation of "build/api" folder.',
    '',
    '--bucket  S3 bucket to upload to.',
    '--docs    Subfolders of "build/api" to upload. (optional)',
    '--profile AWS profile to load from AWS credentials file. If no profile',
    '          is provided the default profile or standard AWS environment',
    '          variables for credentials will be used. (optional)',
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
 * Tests files in source folder.
 *
 * @param {string} sourceFolder
 * Source folder to test.
 *
 * @return {Promise}
 * Promise to keep.
 */
function testSource(sourceFolder) {
    const log = require('./lib/log');

    log.message(`Test files in "${sourceFolder}"...`);

    let promiseChain = Promise.resolve();

    glob
        .sync(sourceFolder)
        .filter(sourcePath => (
            path.basename(sourcePath).indexOf('.') !== 0 &&
            fs.lstatSync(sourcePath).isFile()
        ))
        .forEach(filePath => {
            promiseChain = promiseChain.then(() => {
                const fileContent = fs.readFileSync(filePath);
                if (updateFileContent(filePath, fileContent) !== fileContent) {
                    log.message(
                        path.relative(SOURCE_ROOT, filePath),
                        'will be modified'
                    );
                }
            });
        });

    return promiseChain;
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
        !fileContent.includes('<frame')
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
 * Uploads a folder to the bucket.
 *
 * @param {string} sourceFolder
 * Source path to load from.
 *
 * @param {S3} targetStorage
 * AWS S3 instance to upload to.
 *
 * @param {string} targetBucket
 * AWS S3 bucket to upload to.
 *
 * @return {Promise}
 * Promise to keep.
 */
function uploadSource(sourceFolder, targetStorage, targetBucket) {
    const log = require('./lib/log');

    log.message(`Start upload of "${sourceFolder}"...`);

    let promiseChain = Promise.resolve();

    glob
        .sync(sourceFolder)
        .filter(sourcePath => (
            path.basename(sourcePath).indexOf('.') !== 0 &&
            fs.lstatSync(sourcePath).isFile()
        ))
        .forEach(filePath => {
            promiseChain = promiseChain.then(() => {
                const fileContent = updateFileContent(
                    filePath,
                    fs.readFileSync(filePath)
                );

                filePath = path.relative(SOURCE_ROOT, filePath);

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
            });
        });

    return promiseChain;
}

/**
 * Upload code for wrapper API docs (iOS/Android) to S3.
 *
 * @return {Promise}
 * Promise to keep.
 */
function jsdocUpload() {
    const aws = require('aws-sdk');
    const log = require('./lib/log');
    const {
        bucket,
        docs,
        help,
        profile,
        test
    } = require('yargs').argv;
    const sourceFolders = (docs || '/')
        .split(',')
        .map(docFolder => path.posix.join(SOURCE_ROOT, docFolder, '**/*'));

    if (help) {
        log.message(HELP);
        return Promise.resolve();
    }

    if (!bucket) {
        throw new Error('No --bucket specified.');
    }

    if (!fs.lstatSync(SOURCE_ROOT).isDirectory()) {
        throw new Error(`Source directory "${SOURCE_ROOT}" not found.`);
    }

    let promiseChain = Promise.resolve();

    if (test) {
        sourceFolders.forEach(sourceFolder => {
            promiseChain = promiseChain.then(() => testSource(sourceFolder));
        });
    } else {
        const targetStorage = new aws.S3({
            region: (process.env.AWS_REGION || 'eu-west-1'),
            credentials: (
                profile ?
                    new aws.SharedIniFileCredentials({ profile }) :
                    void 0
            )
        });

        sourceFolders.forEach(sourceFolder => {
            promiseChain = promiseChain.then(() => uploadSource(
                sourceFolder,
                targetStorage,
                bucket
            ));
        });
    }

    promiseChain.catch(log.failure);

    return promiseChain;
}

/* *
 *
 *  Tasks
 *
 * */

gulp.task('jsdoc-upload', jsdocUpload);
