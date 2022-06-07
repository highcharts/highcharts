// Libraries sorted by require path
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const zip = require('gulp-zip');
const log = require('./lib/log');

// Constants
const DIR_BUILD = 'build';
const DIR_ZIPS = 'build/api/zips';
const DIR_API = 'build/api';
const DIR_LIB = 'tools/gulptasks/lib/api';

/**
 * Copy lib files to api directory.
 *
 * @return {Promise<void>} Returns a promise that resolves when the copy is
 * completed.
 */
function copyLibFiles() {
    const promises = ['server.js', 'README.md'].map(
        filename => fs.promises.copyFile(
            `${DIR_LIB}/${filename}`,
            `${DIR_API}/${filename}`
        )
    );
    return Promise.all(promises);
}

/**
 * Creates a zip archive for a single product API.
 *
 * @param {Record<string,string>} distPath
 * Product folder path.
 *
 * @param {Record<string,string>} zipName
 * Product zip file.
 *
 * @return {Promise<void>} Returns a Promise that resolves when the zip archive
 * is built.
 */
function zipProductAPI(distPath, zipName) {
    const DIR_CLASS_REFERENCE = `${DIR_API}/class-reference`;

    const DIR_PRODUCT = path.join(DIR_API, distPath);

    if (!fs.existsSync(DIR_PRODUCT)) {
        return Promise.reject(new Error(`Missing folder: ${DIR_PRODUCT}. Has the other dist tasks been run in advance?`));
    }

    log.message(`Zipping file ${zipName}`);

    return new Promise((resolve, reject) => {
        gulp.src([
            `${DIR_PRODUCT}/**`,
            `${DIR_CLASS_REFERENCE}/**`,
            `${DIR_API}/server.js`,
            `${DIR_API}/README.md`
        ], {
            base: DIR_BUILD
        })
            .pipe(zip(zipName))
            .pipe(gulp.dest(DIR_ZIPS))
            .on('error', reject)
            .on('end', resolve);
    });
}

/**
 * Creates zip archives for all the product API's.
 *
 * @return {Promise<void>} Returns a Promise that resolves when all the zip
 * archives is built.
 */
function jsdocZips() {

    const properties = require('../../build-properties.json');
    const { products } = properties;
    let { version } = properties;
    if (version.endsWith('-modified')) {
        version = version.substr(0, version.length - 9);
    }

    // Check if the class references exists
    const DIR_CLASS_REFERENCE = `${DIR_API}/class-reference`;
    if (!fs.existsSync(DIR_CLASS_REFERENCE)) {
        return Promise.reject(new Error(
            `Missing folder: ${DIR_CLASS_REFERENCE}. Has the other dist tasks been run in advance?`
        ));
    }

    // Copy lib files, then zip all product api archives
    let promiseChain = copyLibFiles();

    Object
        .keys(products)
        .forEach(name => {
            promiseChain = promiseChain.then(() => zipProductAPI(
                products[name].distpath,
                `${name.replace(/ /gu, '-')}-${version}-API.zip`
            ));
        });

    return promiseChain;
}

/* *
 *
 *  Tasks
 *
 * */

require('./jsdoc');

gulp.task('jsdoc-zips', gulp.series(
    'jsdoc',
    'test-tree',
    jsdocZips
));
