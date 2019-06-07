/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const build = require('./lib/build');
const { uploadFiles, uploadProductPackage } = require('./unsorted/uploadS3');


const DIST_DIR = 'build/dist';

/**
 * Upload a distribution version for all products.
 *
 * @param {string} productName from build properties, e.g 'highstock'.
 * @param {object} productProps containing product name and version (build.properties).
 * @return {Promise<any> | Promise | Promise} Promise to keep
 */
function uploadPackage(productName, productProps) {
    const { name, version, cdnpath } = productProps;
    return uploadProductPackage(productName, cdnpath, name, version);
}


const distUpload = products => {
    const properties = build.getBuildProperties();

    const productJs = glob.sync(`${DIST_DIR}/products.js`).map(file => ({
        from: file,
        to: [...file.split('/')].pop()
    }));
    const promises = products.map(product => {
        if (!properties[product]) {
            return Promise.reject(new Error(`Could not find entry in build.properties for: ${product}`));
        }
        return uploadPackage(product, properties[product].product);
    });

    promises.push(uploadFiles({ files: productJs, name: 'products.js' }));
    return Promise.all(promises);

    // TODO: ant push-all-versions-to-S3: push whole versions structure from local machine to Amazon S3
    // TODO: ant copy-to-site: Copy files from this repo to repository www.highcharts.com (joomla?)
};


gulp.task('dist-upload',
    gulp.series(
        'dist-compress',
        () => distUpload(['highcharts', 'highstock', 'highmaps', 'gantt'])
    ));

gulp.task('dist-upload-highcharts',
    gulp.series(
        'dist-compress',
        () => distUpload(['highcharts'])
    ));

gulp.task('dist-upload-highstock',
    gulp.series(
        'dist-compress',
        () => distUpload(['highstock'])
    ));

gulp.task('dist-upload-highmaps',
    gulp.series(
        'dist-compress',
        () => distUpload(['highmaps'])
    ));

gulp.task('dist-upload-gantt',
    gulp.series(
        'dist-compress',
        () => distUpload(['gantt'])
    ));
