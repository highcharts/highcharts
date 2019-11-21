// Libraries sorted by require path
const fs = require('fs');
const gulp = require('gulp');
const zip = require('gulp-zip');
const { promisify } = require('util');
const build = require('./lib/build');
const log = require('./lib/log');

/* Promisify utility functions. NOTE: When configured Node.js version is
>=11.14.0, switch to require().promises. */
const copyFile = promisify(fs.copyFile);
const { existsSync } = fs;

// Constants
const DIST_BUILD = 'build';
const DIST_DIR = 'build/dist';
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
        filename => copyFile(`${DIR_LIB}/${filename}`, `${DIR_API}/${filename}`)
    );
    return Promise.all(promises);
}

/**
 * Creates a zip archive for a single product API.
 *
 * @param {string} product The product folder name.
 * @return {Promise<void>} Returns a Promise that resolves when the zip archive
 * is built.
 */
function zipProductAPI(product) {
    const DIR_CLASS_REFERENCE = `${DIR_API}/class-reference`;

    const DIR_PRODUCT = `${DIR_API}/${product}`;
    if (!existsSync(DIR_PRODUCT)) {
        return Promise.reject(new Error(`Missing folder: ${DIR_PRODUCT}. Has the other dist tasks been run in advance?`));
    }

    const zipFileName = `${product}/api.zip`;
    log.message(`Zipping file ${zipFileName}`);

    return new Promise((resolve, reject) => {
        gulp.src([
            `${DIR_PRODUCT}/**`,
            `${DIR_CLASS_REFERENCE}/**`,
            `${DIR_API}/server.js`,
            `${DIR_API}/README.md`
        ], { base: DIST_BUILD })
            .pipe(zip(zipFileName))
            .pipe(gulp.dest(DIST_DIR))
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
function createProductsAPIArchives() {

    // Check if the class references exists
    const DIR_CLASS_REFERENCE = `${DIR_API}/class-reference`;
    if (!existsSync(DIR_CLASS_REFERENCE)) {
        return Promise.reject(new Error(`Missing folder: ${DIR_CLASS_REFERENCE}. Has the other dist tasks been run in advance?`));
    }

    // Copy lib files, then zip all product api archives
    return copyLibFiles().then(() => {
        const properties = build.getBuildProperties();
        const zipTasks = Object.keys(properties).map(zipProductAPI);
        return Promise.all(zipTasks);
    });
}


require('./jsdoc');
gulp.task('dist-api', gulp.series(
    'jsdoc',
    createProductsAPIArchives
));
