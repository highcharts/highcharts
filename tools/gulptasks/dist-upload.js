/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const build = require('./lib/build');
const { uploadFiles, uploadProductFiles } = require('./unsorted/uploadS3');


const DIST_DIR = 'build/dist';

/**
 * Upload a distribution version for all products.
 *
 * @param {productProps} productProps containing product name and version (build.properties).
 * @return {Promise<any> | Promise | Promise} Promise to keep
 */
function uploadPackage(productName, productProps) {
    const { name, version, cdnpath } = productProps;
    return uploadProductFiles(productName, cdnpath, name, version);
}


const distUploadAll = () => {
    const properties = build.getBuildProperties();
    const { highcharts, highstock, highmaps, gantt } = properties;

    const productJs = glob.sync(`${DIST_DIR}/products.js`).map(file => ({
        from: file,
        to: [...file.split('/')].pop()
    }));


    const promises = [];
    promises.push(uploadFiles({ files: productJs }));
    //promises.push(uploadPackage('highcharts', highcharts.product));
    //promises.push(uploadPackage('highstock', highstock.product));
    promises.push(uploadPackage('highmaps', highmaps.product));
    promises.push(uploadPackage('gantt', gantt.product));

    return Promise.all(promises);

    // TODO: ant push-all-versions-to-S3: push whole versions structure from local machine to Amazon S3
    // TODO: ant copy-to-site: Copy files from this repo to repository www.highcharts.com (joomla?)
};


gulp.task('dist-upload',
    // TODO: why do we have different folder names in build/dist vs in s3 bucket/cdn (e.g highstock --> stock)
    gulp.series(
        'dist-compress',
        distUploadAll
    ));
