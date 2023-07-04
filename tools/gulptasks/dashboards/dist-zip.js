/*
 * Copyright (C) Highsoft AS
 */


const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const stream = require('stream');
const zlib = require('zlib');


/* *
 *
 *  Tasks
 *
 * */


/**
 * Creates zip files.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function distZip() {

    const argv = require('yargs').argv;
    const config = require('./_config.json');
    const logLib = require('../lib/log');
    const zip = require('gulp-zip');

    const release = argv.release;

    if (!/^\d+\.\d+\.\d+(?:-\w+)?$/su.test(release)) {
        throw new Error('No valid `--release x.x.x` provided.');
    }

    const buildFolder = config.buildFolder;
    const product = config.product;
    const zipCacheFolder = path.join(buildFolder, 'js-gzip');
    const zipDistFile = `${product.replace(/ /gu, '-')}-${release}.zip`;

    await new Promise(
        (resolve, reject) => gulp
            .src([
                `${buildFolder}/**`,
                `!${zipCacheFolder}/**`
            ])
            .pipe(zip(zipDistFile))
            .pipe(gulp.dest(buildFolder))
            .on('error', reject)
            .on('end', resolve)
    );

    logLib.message(`Created ZIP archive: ${buildFolder}/${zipDistFile}...`);

}


/**
 * Creates gzipped versions in ./js-gzip.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function distJSGZip() {

    const argv = require('yargs').argv;
    const config = require('./_config.json');
    const glob = require('glob');
    const fsLib = require('../lib/fs');
    const logLib = require('../lib/log');

    const buildFolder = config.buildFolder;
    const zipCacheFolder = path.join(buildFolder, 'js-gzip');

    fsLib.deleteDirectory(zipCacheFolder, true);
    logLib.success(`Deleted ${zipCacheFolder}`);

    const sourceFolder = `${buildFolder}/code`;
    const files = glob.sync(`${sourceFolder}/**/*+(.css|.js|.map|.svg)`);

    let streamChain = Promise.resolve();

    for (const fileSource of files) {

        if (argv.verbose) {
            logLib.message('Processing file: ', fileSource);
        }

        const fileContents = fs.createReadStream(fileSource);
        const fileTarget = fileSource.replace('/code/', '/js-gzip/');

        fs.mkdirSync(path.dirname(fileTarget), { recursive: true });

        streamChain = streamChain.then(() => stream.promises.pipeline(
            fileContents,
            zlib.createGzip(),
            fs.createWriteStream(fileTarget)
        ));
    }

    await streamChain;

    logLib.success('Created GZIP cache');

}


gulp.task('dashboards/dist-zip', gulp.series(distJSGZip, distZip));
