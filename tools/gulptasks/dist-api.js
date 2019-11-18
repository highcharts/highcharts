// Libraries sorted by require path
const { existsSync } = require('fs');
const gulp = require('gulp');
const zip = require('gulp-zip');
const build = require('./lib/build');
const log = require('./lib/log');

const DIST_DIR = 'build/dist';
const API_DIR = 'build/api';

/**
 * Creates zip file for the api.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function apiZip() {
    const properties = build.getBuildProperties();
    const DIR_CLASS_REFERENCE = `${API_DIR}/class-reference`;
    if (!existsSync(DIR_CLASS_REFERENCE)) {
        return Promise.reject(new Error(`Missing folder: ${DIR_CLASS_REFERENCE}. Has the other dist tasks been run in advance?`));
    }
    const zipTasks = Object.keys(properties).map(key => {
        const DIR_PRODUCT = `${API_DIR}/${key}`;
        if (!existsSync(DIR_PRODUCT)) {
            return Promise.reject(new Error(`Missing folder: ${DIR_PRODUCT}. Has the other dist tasks been run in advance?`));
        }

        const zipFileName = `${key}/api.zip`;
        log.message(`Zipping file ${zipFileName}`);

        return new Promise((resolve, reject) => {
            gulp.src([`${DIR_PRODUCT}/**`, `${DIR_CLASS_REFERENCE}/**`], {
                base: API_DIR
            })
                .pipe(zip(zipFileName))
                .pipe(gulp.dest(DIST_DIR))
                .on('error', reject)
                .on('end', resolve);
        });
    });
    return Promise.all(zipTasks);
}


gulp.task('dist-api', apiZip);
