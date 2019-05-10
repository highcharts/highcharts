/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('fs-extra');
const zlib = require('zlib');
const glob = require('glob');
const childProcess = require('child_process');
const log = require('./lib/log');
const build = require('./lib/build');
const yargs = require('yargs');


const DIST_DIR = 'build/dist';


/**
 * Creates zip files for highcharts, highstock, highmaps, highcharts-gantt.
 *
 * @return {Promise<any> | Promise | Promise} Promise to keep
 */
function distZip() {
    const properties = build.getBuildProperties();

    const zipTasks = Object.keys(properties).map(key => {

        return new Promise((resolve, reject) => {
            if (!fs.existsSync(DIST_DIR)) {
                reject(new Error('Missing build/dist folder..'));
            }

            const { product } = properties[key];
            const { name, version } = product;

            const dirToZip = `${DIST_DIR}/${key}`;
            const zipFileName = `${name.replace(/ /g, '-')}-${version}.zip`;
            const zipCommand = `cd ${dirToZip} && zip -r ../${zipFileName} * -x "build/* *.zip*"`;

            log.message(`Zipping file using command: ${zipCommand}`);

            childProcess.exec(
                zipCommand,
                error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(properties);
                }
            );
        });
    });

    return Promise.all(zipTasks);

}

/**
 * Creates gzipped version of files in build/dist/{productname}/code and stores them
 * in build/dist/{productname}/js-gzip. E.g. build/dist/highcharts/code --> gzip and store in build/dist/highcharts/code/js-gzip
 *
 * @return {Promise<any> | Promise | Promise} Promise to keep
 */
function distGZip() {
    const properties = build.getBuildProperties();

    log.starting('GZipping files..');
    const gzipDirs = glob.sync(`${DIST_DIR}/**/js-gzip`);
    gzipDirs.forEach(dir => {
        log.message('Deleting dir ', dir);
        fs.removeSync(dir);
    });

    return new Promise((resolve, reject) => {
        const errors = [];
        Object.keys(properties).forEach(key => {
            const dirToZip = `${DIST_DIR}/${key}/code`;
            const files = glob.sync(`${dirToZip}/**/*+(.js|.css|.map)`);

            log.message(`Gzipping files for ${key}... `);
            files.forEach(filename => {
                if (yargs.argv.verbose) {
                    log.message('Processing file: ', filename);
                }
                const fileContents = fs.createReadStream(filename);
                const destination = `${filename.replace('/code/', '/js-gzip/')}`;
                fs.mkdirSync(destination.substring(0, destination.lastIndexOf('/') + 1), { recursive: true });
                const writeStream = fs.createWriteStream(destination);
                const gzip = zlib.createGzip();
                fileContents.pipe(gzip).pipe(writeStream).on('finish', err => {
                    if (err) {
                        errors.push(err);
                    }
                });

            });
        });

        if (errors.length > 0) {
            reject(errors);
        } else {
            log.success('Gzip done..');
            resolve();
        }
    });

}


gulp.task('dist-compress', gulp.series(distZip, distGZip));
