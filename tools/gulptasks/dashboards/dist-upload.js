/*
 * Copyright (C) Highsoft AS
 */


const fs = require('fs');
const gulp = require('gulp');
const path = require('path').posix;

const { dryrun } = require('yargs').argv;


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

const NOW = Date.UTC(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
);


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
 * @param {number} [maxAge]
 * Max age for cache control.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadFile(
    sourceFolder,
    sourceFile,
    targetStorage,
    targetBucket,
    targetFolder,
    maxAge = HTTP_MAX_AGE.oneDay
) {
    const logLib = require('../lib/log');
    const fileContent = fs.readFileSync(sourceFile);
    const isGzip = Buffer.from(fileContent).readUInt16BE() === 8075;

    const filePath = path.join(
        targetFolder,
        path.relative(sourceFolder, sourceFile)
    );

    if (!dryrun) {
        await targetStorage.putObject({
            Bucket: targetBucket,
            Key: filePath,
            Body: fileContent,
            ACL: 'public-read',
            ContentType: MIME_TYPE[path.extname(filePath)],
            ...(!maxAge ? {} : {
                CacheControl: `public, max-age=${maxAge}`,
                Expires: new Date(NOW + (maxAge * 1000))
            }),
            ...(!isGzip ? {} : {
                ContentEncoding: 'gzip'
            })
        });
    }

    logLib.message(filePath, 'uploaded', dryrun ? '(dryrun)' : '');
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
 * @param {number} [maxAge]
 * Max age for cache control.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function uploadFolder(
    sourceFolder,
    targetStorage,
    targetBucket,
    targetFolder,
    maxAge
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
                targetFolder,
                maxAge
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
                targetFolder,
                0
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

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const sourceFolder = path.join(buildFolder, 'js-gzip/');

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

    logLib.warn('Uploading products.js...');
    await uploadFile(
        path.join(buildFolder, '..'),
        path.join(buildFolder, '..', 'products.js'),
        targetStorage,
        bucket,
        '.'
    );


    // Upload versioned paths
    const [major, minor] = release.split('.');
    const versions = [
        release,
        `${major}.${minor}`,
        major
    ];

    for (const version of versions) {
        const cdnVersionFolder = path.join(cdnFolder, version, '/');

        logLib.warn(`Uploading to ${cdnVersionFolder}...`);
        await uploadFolder(
            sourceFolder,
            targetStorage,
            bucket,
            cdnVersionFolder,
            HTTP_MAX_AGE.fiveYears
        );
    }

    // Upload to path without version
    logLib.warn(`Uploading to ${cdnFolder}...`);
    await uploadFolder(sourceFolder, targetStorage, bucket, cdnFolder);

    // Hack
    const sourceCssFolder = path.join(sourceFolder, 'css');
    const sourceGfxFolder = path.join(sourceFolder, 'gfx');
    logLib.warn('Uploading to css & gfx...');
    await uploadFolder(sourceCssFolder, targetStorage, bucket, 'css');
    await uploadFolder(sourceGfxFolder, targetStorage, bucket, 'gfx');

    logLib.warn('Uploading to zips/...');
    await uploadZips(buildFolder, targetStorage, bucket, 'zips/');

    logLib.success('Uploading Done.');

}


gulp.task('dashboards/dist-upload', distUpload);
