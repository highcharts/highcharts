/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const glob = require('glob');
const { uploadFiles } = require('./lib/uploadS3');

const BASE_RESULTS_SRC_DIR = 'tmp/benchmarks/base';
const DESTINATION_DIR = 'benchmarks';
const REFERENCE_DEST_DIR = `${DESTINATION_DIR}/reference`;

/**
 * Upload cached benchmark base results to S3.
 *
 * Looks for `tmp/benchmarks/base/**\/*.json` files (produced by
 * `bench.ts --context base`) and uploads them to the `benchmarks/reference/`
 * prefix, preserving the category sub-path (e.g. `Stock/Stock-Base.json`).
 * These act as the cached baseline that pull request workflows compare
 * against, instead of rebuilding master on every run.
 *
 * @return {Promise<*>} Promise to keep
 */
function uploadBenchmarkResults() {
    const argv = require('yargs').argv;
    const defaultParams = {
        profile: argv.profile,
        dryrun: argv.dryrun,
        s3Params: {
            ACL: void 0
        }
    };

    if (argv.bucket) {
        defaultParams.bucket = argv.bucket;
    } else {
        return Promise.reject(new Error('Please specify argument --bucket to upload to.'));
    }

    // Path relative to the base results dir, e.g. `Stock/Stock-Base.json`.
    function relativeResultPath(file) {
        return file.slice(`${BASE_RESULTS_SRC_DIR}/`.length);
    }

    const resultFiles = glob.sync(`${BASE_RESULTS_SRC_DIR}/**/*.json`);
    const promises = [];

    promises.push(uploadFiles(Object.assign({}, defaultParams, {
        files: resultFiles.map(file => ({
            from: file,
            to: `${REFERENCE_DEST_DIR}/latest/${relativeResultPath(file)}`
        })),
        name: 'Benchmark base results (latest)'
    })));

    if (argv.tag) {
        // Keep a versioned copy alongside the latest one.
        promises.push(uploadFiles(Object.assign({}, defaultParams, {
            files: resultFiles.map(file => ({
                from: file,
                to: `${REFERENCE_DEST_DIR}/${argv.tag}/${relativeResultPath(file)}`
            })),
            name: `Benchmark base results (${argv.tag})`
        })));
    }

    return Promise.all(promises);
}

uploadBenchmarkResults.description = 'Uploads cached benchmark base results ' +
    '(tmp/benchmarks/base/**\/*.json) to S3 for use as a baseline in PR benchmarks.';
uploadBenchmarkResults.flags = {
    '--bucket': 'The S3 bucket to upload to.',
    '--tag': 'If present, additionally uploads the results to a versioned path ' +
        '(benchmarks/reference/<tag>/).',
    '--dryrun': 'If present, writes to ./tmp/s3 instead of uploading to S3.',
    '--profile': 'AWS profile to use, as defined in ~/.aws/credentials.'
};

gulp.task('dist-benchmark-results', uploadBenchmarkResults);
