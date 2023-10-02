/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const { isDirectory, isDotEntry } = require('./lib/fs');
const { uploadFiles, toS3Path } = require('./lib/uploadS3');


const SOURCE_DIR = ['samples/data', 'samples/graphics', 'samples/static'];
const S3_DEST_PATH = 'demos';
const BUCKET = 'assets.highcharts.com';


/**
 * Upload samples data to S3.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function distUploadSamplesData() {
    const argv = require('yargs').argv;
    const bucket = argv.bucket || BUCKET;
    let sourceDir = argv.sourceDir || SOURCE_DIR;

    if (!Array.isArray(sourceDir)) {
        sourceDir = [sourceDir];
    }

    let rootFiles = [];

    rootFiles = sourceDir.flatMap(dir => {
        if (!dir.endsWith('/')) {
            dir = dir + '/';
        }

        const sourceFiles = glob
            .sync(`${dir}/**/*`)
            .filter(file => !isDirectory(file) && !isDotEntry(file));
        return sourceFiles.map(file => toS3Path(file, dir + '/', S3_DEST_PATH));
    });

    return uploadFiles({
        files: [...rootFiles],
        name: 'highcharts-samples-data',
        bucket,
        profile: argv.profile
    });
}

distUploadSamplesData.description = 'Uploads sample resources to S3';
distUploadSamplesData.flags = {
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)'
};

gulp.task('dist-upload-samples-resources', distUploadSamplesData);
