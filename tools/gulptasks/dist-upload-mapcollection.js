/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const log = require('./lib/log');
const { isDirectory, isDotEntry } = require('./lib/fs');
const { uploadFiles, getVersionPaths } = require('./lib/uploadS3');


const SOURCE_DIR = '../map-collection/';
const S3_DEST_PATH = 'mapdata';

/**
 * Transforms a filepath to a similar named S3 destination path.
 * @param {string} fromPath file to create a S3 destination path for.
 * @param {string} removeFromDestPath, anything in the fromPath that you want to remove from destination path.
 * @param {string} prefix for S3 destination key.
 * @return {{from: *, to: string}} object for upload api.
 */
function toS3Path(fromPath, removeFromDestPath, prefix) {
    return {
        from: fromPath,
        to: `${S3_DEST_PATH}/${prefix ? prefix + '/' : ''}${fromPath.replace(removeFromDestPath, '')}`
    };
}

/**
 * Upload code for map-collection to S3 (see example https://code.highcharts.com).
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distUploadMapCollection() {
    const argv = require('yargs').argv;
    const bucket = argv.bucket;
    const version = argv.releaseVersion;
    let rootSourceDir = argv.sourceDir || SOURCE_DIR;

    if (!rootSourceDir.endsWith('/')) {
        rootSourceDir = rootSourceDir + '/';
    }

    if (!version) {
        throw new Error('No --release-version specified.');
    }
    log.starting('Starting upload of map-collection v' + version);

    if (!argv.sourceDir) {
        log.message(`Using default folder ${SOURCE_DIR} as source. Use --source-dir to specify a different folder as source.`);
    }

    const sourceDir = rootSourceDir + 'Export/' + version;
    if (!isDirectory(sourceDir)) {
        throw new Error(`Could not find source directory ${rootSourceDir}. Have you cloned the map-collection repo into ../map-collection or tried to specify a different path with --source-dir?`);
    }

    if (!bucket) {
        throw new Error('No --bucket specified.');
    }

    const sourceFiles = glob.sync(`${sourceDir}/**/*`).filter(file => !isDirectory(file) && !isDotEntry(file));
    const rootFiles = sourceFiles.map(file => toS3Path(file, sourceDir + '/'));
    rootFiles.push({
        from: rootSourceDir + 'Export/changelog.html',
        to: `${S3_DEST_PATH}/changelog.html`
    });

    const versionedFiles = [];
    const versionedPaths = getVersionPaths(version);
    versionedPaths.forEach(versionPath => {
        versionedFiles.push(...sourceFiles.map(file => toS3Path(file, sourceDir + '/', versionPath)));
        versionedFiles.push({
            from: rootSourceDir + 'Export/changelog.html',
            to: `${S3_DEST_PATH}/${versionPath}/changelog.html`
        });
    });

    return uploadFiles({
        files: [...rootFiles, ...versionedFiles],
        name: 'map-collection',
        bucket,
        profile: argv.profile
    });
}

distUploadMapCollection.description = 'Uploads distribution for map-collection to code bucket.';
distUploadMapCollection.flags = {
    '--bucket': 'S3 bucket to upload to. Normally this is code.highcharts.com',
    '--release-version': 'Version to upload.', // --version seems to be reserved by gulp
    '--source-dir': 'Path to root folder of map-collection. .../map-collection is default. (optional) ',
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)'
};

gulp.task('dist-upload-mapcollection', distUploadMapCollection);
