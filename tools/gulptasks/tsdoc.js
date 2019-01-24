/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const gulpTypeDoc = require('gulp-typedoc');
const Log = require('./lib/log');
const Path = require('path');
const Yargs = require('yargs');

const SOURCE_PATH = Path.join(
    '.', 'ts'
);
const TARGET_JSON = Path.join(
    '.', 'tree-typescript.json'
);
const TARGET_PATH = Path.join(
    'build', 'api'
);
const TEMPLATE_PATH = Path.join(
    '..', 'highcharts-documentation-generators', 'typedoc', 'theme'
);

/**
 * Generates the API documentation.
 *
 * @return {Promise}
 *         Promise to keep
 */
function tsdoc() {

    const sourceFiles = [
        Path.join(SOURCE_PATH, '**', '*.ts')
    ];

    const gulpOptions = {
        read: false
    };
    const gulpTypeDocOptions = {
        ignoreCompilerErrors: false,
        includeDeclarations: false,
        json: TARGET_JSON,
        module: 'amd',
        name: 'Highcharts',
        out: TARGET_PATH,
        readme: 'README.md',
        target: 'es6',
        theme: TEMPLATE_PATH,
        version: false
        /*
        navOptions: {
            theme: 'highsoft'
        },
        opts: {
            destination: targetPath,
            private: false,
            template: Path.join(templatePath, 'template')
        },
        plugins: [
            Path.join(templatePath, 'plugins', 'add-namespace'),
            Path.join(templatePath, 'plugins', 'markdown'),
            Path.join(templatePath, 'plugins', 'sampletag')
        ],
        source: {
            includePattern: '.+\\.ts$'
        },
        templates: {
            logoFile: 'img/highcharts-logo.svg',
            systemName: 'Highcharts',
            theme: 'highsoft'
        }
        */
    };

    return new Promise((resolve, reject) => {

        const message = 'Generating JSDoc class reference';
        const starting = Log.starting(message);

        Gulp.src(sourceFiles, gulpOptions)
            .pipe(gulpTypeDoc(gulpTypeDocOptions))
            .on('error', reject)
            .on('end', () => {
                Log.finished(message, starting);
                resolve();
            });
    });
}

/**
 * Watches for changes of the API documentation sources.
 *
 * @return {Promise}
 *         Promise to keep
 */
function tsdocWatch() {

    if (Yargs.argv.watch) {
        Gulp.watch(
            Path.join(SOURCE_PATH, '**', '*'),
            Gulp.task('tsdoc')
        );
        Gulp.watch(
            Path.join(TEMPLATE_PATH, '**', '*'),
            Gulp.task('tsdoc')
        );
    }

    return Promise.resolve();
}

module.exports = Gulp.series('clean-api', tsdoc, tsdocWatch);
