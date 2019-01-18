/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const gulpTypeDoc = require('gulp-typedoc');
const Log = require('./lib/log');
// const Path = require('path');

const templatePath = './node_modules/highcharts-docstrap';
const targetPath = './build/api/class-reference/';
const targetJsonPath = './tsdoc.json';

/**
 * Generates class references.
 *
 * @return {Promise}
 *         Promise to keep
 */
function generateClassReferences() {

    const sourceFiles = [
        'ts/**/*.ts'
    ];

    const gulpOptions = {
        read: false
    };

    const gulpTypeDocOptions = {
        ignoreCompilerErrors: false,
        includeDeclarations: false,
        json: targetJsonPath,
        module: 'umd',
        name: 'Highcharts',
        out: targetPath,
        readme: 'README.md',
        target: 'es6',
        theme: templatePath,
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
 * Generates the API documentation.
 *
 * @return {Promise}
 *         Promise to keep
 */
function tsdoc() {
    return Promise.all([
        generateClassReferences()
    ]);
}

module.exports = tsdoc;
