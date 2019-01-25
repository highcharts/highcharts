/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define:off */

const Gulp = require('gulp');
const Fs = require('fs');
const gulpTypeDoc = require('gulp-typedoc');
const Log = require('./lib/log');
const Path = require('path');
const Yargs = require('yargs');

const GULP_TASK = Gulp.series('clean-api', tsdoc);

const SOURCE_CONFIG = Path.join(
    '.', 'ts', 'masters-not-in-use-yet', 'tsconfig-bullet.json'
);

const SOURCE_PATH = Path.join('.', 'ts');

const TARGET_JSON = Path.join('.', 'tree-typescript.json');

const TARGET_PATH = Path.join('.', 'build', 'api');

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

    return new Promise((resolve, reject) => {

        const sourceFiles = JSON.parse(Fs.readFileSync(SOURCE_CONFIG))
            .files
            .map(file => Path.join(Path.dirname(SOURCE_CONFIG), file));

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

        const message = 'Generating TypeScript documentation';
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

if (Yargs.argv.watch) {
    Log.warn('Watching', SOURCE_PATH, '...');
    Log.warn('Watching', TEMPLATE_PATH, '...');
    Gulp.watch(
        [
            Path.join(SOURCE_PATH, '**', '*'),
            Path.join(TEMPLATE_PATH, '**', '*')
        ],
        GULP_TASK
    );
}

module.exports = GULP_TASK;
