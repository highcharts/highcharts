/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const build = require('./lib/build');
const { uploadFiles, uploadProductPackage } = require('./lib/uploadS3');


const DIST_DIR = 'build/dist';

/**
 * Upload a distribution version for all products.
 *
 * @param {string} productName from build properties, e.g 'highstock'.
 * @param {object} productProps containing product name and version (build.properties).
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function uploadPackage(productName, productProps) {
    const { name, version, cdnpath } = productProps;
    return uploadProductPackage(productName, cdnpath, name, version);
}

/**
 * Upload a distribution version for all products.
 *
 * @param {Array<string>} products (product names) to initiate an upload for.
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distUpload() {
    const argv = require('yargs').argv;
    const properties = build.getBuildProperties();
    const products = ((argv.products && argv.products.split(',')) || Object.keys(properties)); // one or more of 'highcharts', 'highstock', 'highmaps', 'gantt', ...

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
}

gulp.task('dist-upload', distUpload);
