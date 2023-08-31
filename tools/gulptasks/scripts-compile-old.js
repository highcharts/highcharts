/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const {
    Worker, parentPort, workerData
// eslint-disable-next-line node/no-unsupported-features/node-builtins
} = require('worker_threads');
const os = require('os');
const argv = require('yargs').argv;

const SOURCE_DIRECTORY = 'code';


/**
 * Split an array into multiple new arrays/chuncks
 *
 * @param {Array} arr to split
 * @param {Number} numParts to split array in
 * @return {Array} Array of arrays/chunks
 */
function chunk(arr, numParts) {
    const result = [];
    for (let p = 0; p < numParts; p++) {
        result[p] = [];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        const arrIndex = Math.floor(i % numParts);
        result[arrIndex].push(arr[i]);
    }
    return result;
}

/**
 * Compile the JS files in the /code folder
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
async function task() {
    const fsLib = require('./lib/fs');
    const logLib = require('./lib/log');

    const fileBatches = [];

    if (workerData) {
        const compileTool = require('../compile');

        fileBatches.push(
            compileTool.compile(workerData.files, (SOURCE_DIRECTORY + '/'))
        );

        parentPort.postMessage({ done: true });

        logLib.success(`Compilation of batch #${workerData.batchNum} complete`);
    } else {
        logLib.warn('Warning: This task may take a few minutes.');

        const files = (
            (argv.files) ?
                argv.files.split(',') :
                fsLib
                    .getFilePaths(SOURCE_DIRECTORY, true)
                    .filter(path => (
                        path.endsWith('.src.js') &&
                        !path.includes('es-modules')
                    ))
                    .map(path => path.substr(SOURCE_DIRECTORY.length + 1))
        );

        const numThreads = argv.numThreads ?
            argv.numThreads :
            Math.min(
                files.length,
                Math.max(2, os.cpus().length - 2)
            );
        const batches = chunk(files, numThreads);

        logLib.message(`Splitting files to compile in ${batches.length} batches/threads..`);
        logLib.message('Compiling', SOURCE_DIRECTORY + '...');

        batches.forEach((batch, index) => {
            fileBatches.push(new Promise((resolve, reject) => {

                const worker = new Worker(
                    __filename,
                    { workerData: { files: batch, batchNum: (index + 1) } }
                );
                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', code => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });

            }));
        });
    }

    return Promise.all(fileBatches);
}

gulp.task('scripts-compile-old', task);

if (workerData) {
    task();
}
