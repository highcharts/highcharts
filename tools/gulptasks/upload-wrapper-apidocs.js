/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const log = require('./lib/log');
const { uploadFiles, isDirectoryOrSystemFile, isDirectory } = require('./lib/uploadS3');


const SOURCE_DIR = 'build/api';
const WRAPPERS = ['ios', 'android'];

/**
 * Transforms a filepath to a similar named S3 destination path for the given wrapper product.
 * @param {string} fromPath file to create a S3 destination path for.
 * @param {string} prefix for S3 destination key.
 * @return {{from: *, to: string}} object for upload api.
 */
function toS3Path(fromPath, prefix) {
    const regex = new RegExp(`build/api/(${WRAPPERS.join('|')})`, 'gi');
    const matches = regex.exec(fromPath);
    if (matches.length > 2) {
        throw new Error('Failed to extract wrapper name from path! Did you enter --only-upload-wrappers correct?');
    }

    const wrapper = matches[1];
    return {
        from: fromPath,
        to: `${wrapper}/highcharts/${prefix ? prefix + '/' : ''}${fromPath.replace(`build/api/${wrapper}/`, '')}`
    };
}
/**
 * Upload code for wrapper api docs (iOS/Android) to S3 (see example https://api-docs-bucket.highcharts.com).
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function uploadWrapperAPIDocs() {
    const argv = require('yargs').argv;
    const bucket = argv.bucket;
    const version = argv.releaseVersion;

    if (!version) {
        throw new Error('No --release-version specified.');
    }

    if (!isDirectory(SOURCE_DIR)) {
        throw new Error(`Could not find source directory ${SOURCE_DIR}. Has the gulp jsdoc-wrappers task been run prior to this task?`);
    }

    if (!bucket) {
        throw new Error('No --bucket specified.');
    }

    const wrappersToUpload = argv.onlyUploadWrappers ? argv.onlyUploadWrappers.split(',') : WRAPPERS;
    log.starting(`Starting upload of wrapper API ${wrappersToUpload.join(' and ')} version ${version}...`);

    const globPattern = wrappersToUpload.length > 1 ? `build/api/{${wrappersToUpload.join(',')}}/**/*` : `build/api/${wrappersToUpload[0]}/**/*`;
    const sourceFiles = glob.sync(globPattern).filter(file => !isDirectoryOrSystemFile(file));
    const rootDirFiles = sourceFiles.map(file => toS3Path(file));
    const versionedFiles = [...sourceFiles.map(file => toS3Path(file, version))];

    return uploadFiles({
        files: [...rootDirFiles, ...versionedFiles],
        name: 'Highcharts Wrapper API docs for ' + wrappersToUpload.join(' and '),
        bucket,
        profile: argv.profile
    });
}

uploadWrapperAPIDocs.description = 'Uploads Wrapper API docs (ios, android) to S3';
uploadWrapperAPIDocs.flags = {
    '--bucket': 'S3 bucket to upload to. Normally this is api-docs-bucket.highcharts.com',
    '--release-version': 'Version to upload.', // --version seems to be reserved by gulp
    '--only-upload-wrappers': 'Comma separated list of wrappers to upload. I.e ios,android (optional)',
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)'
};

gulp.task('upload-wrapper-apidocs', uploadWrapperAPIDocs);
