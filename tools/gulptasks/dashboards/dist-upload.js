/*
 * Copyright (C) Highsoft AS
 */


const fs = require('fs');
const gulp = require('gulp');
const path = require('path').posix;


/* *
 *
 *  Constants
 *
 * */


const HELPME = `
Highcharts Dashboards - Dist Upload Task
========================================

npx gulp dashboards/upload --bucket [...] --region [...] --release [x.x.x]

OPTIONS:
  --bucket   S3 bucket to upload to. (required)
  --region   AWS region of S3 bucket. (required)
  --release  Release version that gets uploaded. (required)
  --dryrun   Dry run without uploading. (optional)
  --helpme   This help.
  --profile  AWS profile to load from AWS credentials file. If no profile is
             provided the default profile or standard AWS environment variables
             for credentials will be used. (optional)
`;


const HTTP_MAX_AGE = {
    oneDay: 86400,
    month: 2592001,
    fiveYears: 157680000
};


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
 * @param {Array<*>} items
 * Array to split into chunks.
 *
 * @return {Array<Array<*>>}
 * Array of chunks.
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
 * Uploads a file to the bucket.
 *
 * @param {string} sourceFolder
 * Base folder of file.
 *
 * @param {string} sourceFile
 * File to upload.
 *
 * @param {object} targetStorage
 * AWS S3 instance to upload to.
 *
 * @param {string} targetBucket
 * AWS S3 bucket to upload to.
 *
 * @param {string} targetFolder
 * Base folder to upload to.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadFile(
    sourceFolder,
    sourceFile,
    targetStorage,
    targetBucket,
    targetFolder
) {
    const logLib = require('../lib/log');
    const fileContent = fs.readFileSync(sourceFile);

    const filePath = path.join(
        targetFolder,
        path.relative(sourceFolder, sourceFile)
    );

    await targetStorage.putObject({
        Bucket: targetBucket,
        Key: filePath,
        Body: fileContent,
        CacheControl: `public, max-age=${HTTP_MAX_AGE.oneDay}`,
        ContentType: MIME_TYPE[path.extname(filePath)],
        ...(path.includes('/js-gzip/') ? { ContentEncoding: 'gzip' } : {})
    });

    logLib.message(filePath, 'uploaded');
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
 * @param {string} targetBucket
 * AWS S3 bucket to upload to.
 *
 * @param {string} targetFolder
 * Base folder to upload to.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadFolder(
    sourceFolder,
    targetStorage,
    targetBucket,
    targetFolder
) {

    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');

    logLib.warn(`Start upload of "${sourceFolder}"...`);

    const filePaths = fsLib
        .getFilePaths(sourceFolder, true)
        .filter(sourcePath => path.basename(sourcePath)[0] !== '.');

    for (const filePathsChunk of getChunks(filePaths)) {
        delay(1000);
        await Promise.all(
            filePathsChunk.map(filePath => uploadFile(
                sourceFolder,
                filePath,
                targetStorage,
                targetBucket,
                targetFolder
            ))
        );
    }

}


/**
 * Uploads zips to the bucket.
 *
 * @param {string} sourceFolder
 * Source path to load from.
 *
 * @param {AWS.S3} targetStorage
 * AWS S3 instance to upload to.
 *
 * @param {string} targetBucket
 * AWS S3 bucket to upload to.
 *
 * @param {string} targetFolder
 * Base folder to upload to.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadZips(
    sourceFolder,
    targetStorage,
    targetBucket,
    targetFolder
) {

    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');

    logLib.warn(`Start upload of "${sourceFolder}"...`);

    const filePaths = fsLib
        .getFilePaths(sourceFolder, true)
        .filter(sourcePath => {
            const fileName = path.basename(sourcePath);
            return (fileName[0] !== '.' && fileName.endsWith('.zip'));
        });

    for (const filePathsChunk of getChunks(filePaths)) {
        delay(1000);
        await Promise.all(
            filePathsChunk.map(filePath => uploadFile(
                sourceFolder,
                filePath,
                targetStorage,
                targetBucket,
                targetFolder
            ))
        );
    }

}


/* *
 *
 *  Tasks
 *
 * */


/**
 * Uploads distribution files.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distUpload() {

    const aws = require('@aws-sdk/client-s3');
    const awsCredentials = require('@aws-sdk/credential-provider-ini');
    const logLib = require('../lib/log');

    const {
            bucket,
            helpme,
            profile,
            region,
            release
        } = require('yargs').argv,
        {
            buildFolder,
            cdnFolder
        } = require('./_config.json');

    if (helpme) {
        // eslint-disable-next-line no-console
        console.log(HELPME);
        return;
    }

    if (!bucket) {
        throw new Error('No `--bucket s3` provided.');
    }

    if (!region) {
        throw new Error('No `--region aws` provided.');
    }

    if (!/^\d+\.\d+\.\d(?:-\w+)$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const sourceFolder = path.join(buildFolder, 'code/');

    if (!fs.existsSync(sourceFolder)) {
        throw new Error(`Folder "${sourceFolder}" not found.`);
    }

    const targetStorage = new aws.S3({
        region,
        credentials: (
            profile ?
                awsCredentials.fromIni({ profile }) :
                void 0
        )
    });

    logLib.warn(`Uploading to ${cdnFolder}...`);
    await uploadFolder(sourceFolder, targetStorage, bucket, cdnFolder);

    const cdnVersionFolder = path.join(cdnFolder, release, '/');

    logLib.warn(`Uploading to ${cdnVersionFolder}...`);
    await uploadFolder(sourceFolder, targetStorage, bucket, cdnVersionFolder);

    const cdnJSgzipFolder = path.join(cdnFolder, 'js-gzip/');

    logLib.warn(`Uploading to ${cdnJSgzipFolder}...`);
    await uploadFolder(buildFolder, targetStorage, bucket, cdnJSgzipFolder);

    const cdnJSgzipVersionFolder = path.join(
        cdnFolder,
        'js-gzip',
        release,
        '/'
    );

    logLib.warn(`Uploading to ${cdnJSgzipVersionFolder}...`);
    await uploadFolder(
        buildFolder,
        targetStorage,
        bucket,
        cdnJSgzipVersionFolder
    );

    logLib.warn('Uploading to zips/...');
    await uploadZips(buildFolder, targetStorage, bucket, 'zips/');


    logLib.success('Uploading Done.');

}


gulp.task('dashboards/dist-upload', distUpload);
