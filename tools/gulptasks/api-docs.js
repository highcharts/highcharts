/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */


/* *
 *
 *  Imports
 *
 * */


const Gulp = require('gulp');


/* *
 *
 *  Constants
 *
 * */


const INFO = `
npx gulp api-docs [OPTIONS]

OPTIONS:
  --info           This information.
  --debug          Includes source code of the related node.
  --expected-highcharts-version  Required with --react-artifact.
  --expected-react-version      Required with --react-artifact.
  --react-artifact  Validated React static artifact directory to stage.
  --source [PATH]  Only loads source files from the given path. (recursive)
`;


const OPTIONS_TREE = 'tree-v2.json';


const TARGET_DIRECTORY = 'build/api/';


/* *
 *
 *  Functions
 *
 * */


/**
 * Creates API docs.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function apiDocs() {
    const ProcessLib = require('../libs/process');
    const Yargs = require('yargs');
    const path = require('node:path');

    const args = Yargs.argv;

    if (args.info) {
        process.stdout.write(INFO);
        return;
    }

    let verifiedReactArtifact;

    if (args.reactArtifact !== void 0) {
        if (
            typeof args.reactArtifact !== 'string' ||
            !args.reactArtifact.trim() ||
            typeof args.expectedReactVersion !== 'string' ||
            !args.expectedReactVersion.trim() ||
            typeof args.expectedHighchartsVersion !== 'string' ||
            !args.expectedHighchartsVersion.trim()
        ) {
            throw new Error(
                '--react-artifact requires --expected-react-version and ' +
                '--expected-highcharts-version.'
            );
        }

        const reactStatic = require('./lib/reactStatic');

        verifiedReactArtifact = await reactStatic.verifyArtifact(
            path.resolve(args.reactArtifact.trim()),
            {
                expectedHighchartsVersion:
                    args.expectedHighchartsVersion.trim(),
                expectedReactVersion: args.expectedReactVersion.trim()
            }
        );
    } else if (
        args.expectedHighchartsVersion !== void 0 ||
        args.expectedReactVersion !== void 0
    ) {
        throw new Error(
            'Expected React version flags require --react-artifact.'
        );
    }

    const source = (args.source || 'ts');

    await ProcessLib.exec(
        'node --import tsx tools/api-docs/api-classes.ts' +
            ` --source "${source}"`
    );

    await ProcessLib.exec(
        'node --import tsx tools/api-docs/api-options.ts' +
            ` --source "${source}"`
    );

    await createApiDocumentation();

    if (verifiedReactArtifact) {
        const reactStatic = require('./lib/reactStatic');

        await reactStatic.stageArtifact(
            verifiedReactArtifact,
            path.resolve(TARGET_DIRECTORY)
        );
    }
}


/**
 * Creates the Highcharts API
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function createApiDocumentation() {

    const apidocs = require('@highcharts/highcharts-documentation-generators')
            .ApiDocs,
        argv = require('yargs').argv,
        fs = require('fs'),
        log = require('../libs/log');

    return new Promise((resolve, reject) => {

        log.message('Generating', TARGET_DIRECTORY + '...');

        const sourceJSON = JSON.parse(fs.readFileSync(OPTIONS_TREE)),
            products = argv.products && argv.products.split(',');

        apidocs(sourceJSON, TARGET_DIRECTORY, products, error => {

            if (error) {
                log.failure(error);
                reject(error);
            } else {
                log.success('Created', TARGET_DIRECTORY);
                resolve();
            }
        });
    });
}


/* *
 *
 *  Tasks
 *
 * */

require('./api-tree');

Gulp.task('api-docs', apiDocs);
