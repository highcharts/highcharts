/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */


/* *
 *
 *  Imports
 *
 * */


const gulp = require('gulp');
const path = require('node:path');


/* *
 *
 *  Constants
 *
 * */


const TARGET_DIRECTORY = 'build/api';

const HELP_MESSAGE = [
    'Stages a verified React static artifact into build/api.',
    'Adds React links to the existing product API navigation when present.',
    '',
    'Usage:',
    '  npx gulp api-react-stage --react-artifact <directory> \\',
    '    --expected-react-version <version> \\',
    '    --expected-highcharts-version <version>',
    '',
    '--react-artifact  Artifact directory containing its manifest/inventory.',
    '--expected-react-version  Expected React version recorded by the artifact.',
    '--expected-highcharts-version  Expected Highcharts version in the artifact.',
    '--helpme  This help.'
].join('\n');


/* *
 *
 *  Functions
 *
 * */


/**
 * Validates and stages a React static artifact into build/api.
 *
 * @param {object} args
 * Parsed task arguments.
 *
 * @param {object} dependencies
 * Injectable task dependencies.
 *
 * @return {Promise<object|undefined>}
 * Staged artifact, or undefined when help was requested.
 */
async function runApiReactStage(args, dependencies = {}) {
    const log = require('../libs/log');

    if (args.helpme || args.info) {
        process.stdout.write(HELP_MESSAGE + '\n');
        return void 0;
    }

    if (
        typeof args.reactArtifact !== 'string' ||
        typeof args.expectedReactVersion !== 'string' ||
        !args.expectedReactVersion.trim() ||
        typeof args.expectedHighchartsVersion !== 'string' ||
        !args.expectedHighchartsVersion.trim()
    ) {
        throw new Error(
            'api-react-stage requires --react-artifact, ' +
            '--expected-react-version, and --expected-highcharts-version.'
        );
    }

    const reactStatic = dependencies.reactStatic || require('./lib/reactStatic');
    const targetRoot = path.resolve(
        dependencies.targetRoot || TARGET_DIRECTORY
    );
    const verifiedArtifact = await reactStatic.verifyArtifact(
        path.resolve(args.reactArtifact),
        {
            expectedHighchartsVersion:
                args.expectedHighchartsVersion.trim(),
            expectedReactVersion: args.expectedReactVersion.trim()
        }
    );
    const stagedArtifact = await reactStatic.stageArtifact(
        verifiedArtifact,
        targetRoot
    );

    log.success('Staged React static artifact into', targetRoot);

    return stagedArtifact;
}


/**
 * Gulp task entry point.
 *
 * @return {Promise<object|undefined>}
 * Promise to keep.
 */
async function apiReactStage() {
    return runApiReactStage(require('yargs').argv);
}


/* *
 *
 *  Tasks
 *
 * */


gulp.task('api-react-stage', apiReactStage);


module.exports = {
    HELP_MESSAGE,
    runApiReactStage
};
