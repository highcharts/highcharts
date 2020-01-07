/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const log = require('./lib/log');
const build = require('./lib/build');
const { uploadFiles, uploadProductPackage, getGitIgnoreMeProperties } = require('./lib/uploadS3');


const DIST_DIR = 'build/dist';

/**
 * Upload code for all products (see example https://code.highcharts.com).
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distUploadCode() {
    const argv = require('yargs').argv;
    const properties = build.getBuildProperties();
    const products = ((argv.products && argv.products.split(',')) || Object.keys(properties)); // one or more of 'highcharts', 'highstock', 'highmaps', 'gantt', ...

    let bucket = argv.bucket;
    if (argv.useGitIgnoreMe) {
        bucket = getGitIgnoreMeProperties()['amazon.s3.bucketname'].replace('s3://', '');
        log.message(`Using bucket ${bucket} as defined in git-ignore-me.properties.`);
    }

    if (!bucket) {
        throw new Error('No --bucket or --use-git-ignore-me argument specified.');
    }

    const productJs = glob.sync(`${DIST_DIR}/products.js`).map(file => ({
        from: file,
        to: [...file.split('/')].pop()
    }));
    const promises = products.map(productName => {
        if (!properties[productName]) {
            return Promise.reject(new Error(`Could not find entry in build.properties for: ${productName}`));
        }
        const productProps = Object.assign(properties[productName].product, { productName });
        return uploadProductPackage(productProps, { bucket });
    });

    promises.push(uploadFiles({ files: productJs, name: 'products.js', bucket, profile: argv.profile }));
    return Promise.all(promises);
}

distUploadCode.description = 'Uploads distribution files (zipped/binary) to code bucket.';
distUploadCode.flags = {
    '--bucket': 'S3 bucket to upload to. Is overridden if --use-git-ignore-me is defined.',
    '--products': 'Comma-separated list of products to upload. E.g highcharts,highmaps (optional - default is all products defined in build.properties).',
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)',
    '--use-git-ignore-me': 'Will look for bucket in git-ignore-me.properties file (fallback as previously used by ant build). Required if ---bucket not specified.'
};

gulp.task('dist-upload-code', distUploadCode);
