/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('fs-extra');
const zlib = require('zlib');
const glob = require('glob');
const log = require('./lib/log');
const build = require('./lib/build');
const yargs = require('yargs');
const zip = require('gulp-zip');
const stream = require('stream');
const util = require('util');


const DIST_DIR = 'build/dist';


/**
 * Creates zip files for highcharts, highstock, highmaps, highcharts-gantt.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distZip() {
    const properties = build.getBuildProperties();

    const zipTasks = Object.keys(properties).map(key => {

        const { product } = properties[key];
        const { name, version } = product;

        const dirToZip = `${DIST_DIR}/${key}`;
        if (!fs.existsSync(dirToZip)) {
            return Promise.reject(new Error(`Missing folder: ${dirToZip}. Has the other dist tasks been run in advance?`));
        }

        const zipFileName = `${name.replace(/ /g, '-')}-${version}.zip`;
        const excludedDir = `!${dirToZip}/js-gzip/**`;
        log.message(`Zipping file: ${zipFileName}, excluding sub-directory ${excludedDir}`);

        return new Promise((resolve, reject) => {
            gulp.src([dirToZip + '/**', excludedDir])
                .pipe(zip(zipFileName))
                .pipe(gulp.dest(DIST_DIR))
                .on('error', reject)
                .on('end', resolve);
        });
    });

    return Promise.all(zipTasks);
}

/**
 * Creates gzipped version of files in build/dist/{productname}/code and stores them
 * in build/dist/{productname}/js-gzip. E.g. build/dist/highcharts/code --> gzip and store in build/dist/highcharts/code/js-gzip
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distGZip() {
    const properties = build.getBuildProperties();

    const gzipDirs = glob.sync(`${DIST_DIR}/**/js-gzip`);
    gzipDirs.forEach(dir => {
        log.message('Deleting dir ', dir);
        fs.removeSync(dir);
    });

    log.starting('GZipping files..');

    let streams = [];
    Object.keys(properties).forEach(key => {
        const dirToZip = `${DIST_DIR}/${key}/code`;
        const files = glob.sync(`${dirToZip}/**/*+(.js|.css|.map)`);

        log.message(`Gzipping files for ${key}... `);
        streams = files.map(filename => {
            if (yargs.argv.verbose) {
                log.message('Processing file: ', filename);
            }
            const fileContents = fs.createReadStream(filename);
            const destination = `${filename.replace('/code/', '/js-gzip/')}`;
            fs.mkdirSync(destination.substring(0, destination.lastIndexOf('/') + 1), { recursive: true });

            const gzip = zlib.createGzip();
            const writeStream = fs.createWriteStream(destination);
            const pipeline = util.promisify(stream.pipeline);

            return pipeline(
                fileContents,
                gzip,
                writeStream,
            );
        });
    });

    return Promise.all(streams);


}


gulp.task('dist-compress', gulp.series(distZip, distGZip));
