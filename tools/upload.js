/* eslint-env node, es6 */
/* eslint-disable func-style */

'use strict';

const isString = x => typeof x === 'string';
const isFunction = x => typeof x === 'function';
const isArray = x => Array.isArray(x);

const getFile = require('highcharts-assembler/src/utilities.js').getFile;

const asyncForeach = (arr, fn) => {
    const length = arr.length;
    const generator = (j) => {
        let promise;
        if (j < length) {
            promise = fn(arr[j], j, arr).then(() => generator(j + 1));
        }
        return promise;
    };
    return generator(0);
};

const asyncBatchForeach = (batchSize, arr, fn) => {
    const length = arr.length;
    const generator = (from, to) => {
        let result;
        if (from < length) {
            const batch = arr.slice(from, to);
            const promises = batch.map((el, i) => fn(el, from + i, arr));
            const next = () => generator(to, to + batchSize);
            result = Promise.all(promises).then(next);
        }
        return result;
    };
    return generator(0, batchSize);
};

const uploadFiles = (params) => {
    const storage = require('./tools/jsdoc/storage/cdn.storage');
    const mimeType = {
        'css': 'text/css',
        'html': 'text/html',
        'js': 'text/javascript',
        'json': 'application/json',
        'svg': 'image/svg+xml'
    };
    const {
        batchSize,
        bucket,
        callback,
        onError = Promise.reject,
        files
    } = params;
    const errors = [];
    let result;
    if (isString(bucket) && isArray(files)) {
        const cdn = storage.strategy.s3({
            Bucket: bucket
        });
        const uploadFile = (file) => {
            const { from, to } = file;
            let filePromise;
            if (isString(from) && isString(to)) {
                const content = getFile(from);
                if (isString(content)) {
                    const fileType = from.split('.').pop();
                    filePromise = storage.push(cdn, to, content, mimeType[fileType])
                        .then(() => isFunction(callback) && callback())
                        .catch((err) => {
                            const error = {
                                message: `S3: ${err.pri && err.pri.message}`,
                                from: from,
                                to: to
                            };
                            errors.push(error);
                            return onError(error);
                        });
                } else {
                    const error = {
                        message: 'Path is not a file',
                        from: from,
                        to: to
                    };
                    errors.push(error);
                    filePromise = onError(error);
                }
            } else {
                const error = {
                    message: 'Invalid file information!',
                    from: from,
                    to: to
                };
                errors.push(error);
                filePromise = onError(error);
            }
            return filePromise;
        };
        result = asyncBatchForeach(batchSize, files, uploadFile).then(() => ({
            errors
        }));
    } else {
        result = Promise.reject();
    }
    return result;
};

module.exports = {
    asyncForeach,
    uploadFiles
};
