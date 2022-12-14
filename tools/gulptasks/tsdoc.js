/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const TREE_TARGET = 'tree-next.json';

const TEMPLATE_SOURCE = (
    'node_modules/@highcharts/highcharts-documentation-generators/templates'
);

/* *
 *
 *  Tasks
 *
 * */

/**
 * TSDoc-next task
 * @return {Promise<void>}
 *         Promise to keep
 */
function task() {

    const args = require('yargs').argv;
    const fs = require('fs');
    const generators = require(
        '@highcharts/highcharts-documentation-generators'
    );
    const logLib = require('./lib/log');

    if (args.old) {
        const generator = generators.TypeScript4;

        return Promise
            .resolve()
            .then(() => generator.ProjectDoc.load('ts'))
            .then(project => fs.promises.writeFile(
                TREE_TARGET,
                generator.JSON.stringify(project.toJSON())
            ))
            .then(logLib.success)
            .catch(logLib.failure);
    }

    const generator = generators.Generator;
    const parser = generators.Parser;
    const source = (
        fs.existsSync('code/es-modules/') ?
            'code/es-modules/' :
            'ts/'
    );

    if (source === 'ts/') {
        logLib.warn('ES modules not found, using ./ts/ folder.');
    }

    return parser.Project
        .load('ts', args)
        .then(project => {
            fs.promises.writeFile(
                TREE_TARGET,
                parser.JSON.stringify(project.toJSON())
            );
        })
        .then(() => generator.Template.loadFolder(TEMPLATE_SOURCE))
        .then(() => generator.Project.load(TREE_TARGET))
        .then(project => {
            generator.Template.types.classes.write(
                'build/classes.html',
                project.ast
            );
        })
        .then(logLib.success)
        .catch(error => logLib.failure(error, error.stack));

}

gulp.task('tsdoc', task);
