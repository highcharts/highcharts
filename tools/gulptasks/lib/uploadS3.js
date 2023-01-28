const log = require('./log');
const AWSS3 = require('aws-sdk').S3;
const fs = require('fs');
const S3 = new AWSS3({
    region: process.env.AWS_REGION || 'eu-west-1'
});

/**
 * Fetch an object from S3.
 *
 * @param {string} bucket to fetch from
 * @param {string} key or path to fetch
 *
 * @return {Promise<unknown>} result which is assumed to be parsable to string.
 */
async function getS3Object(bucket, key) {
    return new Promise((resolve, reject) => {
        S3.getObject({
            Bucket: bucket,
            Key: key
        }, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Body.toString('utf-8'));
            }
        });
    });
}

/**
 * Put a object to s3 using the specfied config.
 * The config can override all defaults.
 *
 * @param {string} key to store
 * @param {body} body to store. Expects a json serializable object as default.
 *                  Can override both key and payload in specified in config.
 * @param {object} config to use. See AWS SDK for putObject.
 * @return {Promise<unknown>} result
 */
async function putS3Object(key, body, config = {}) {
    log.message(`Put to ${config.Bucket}/${key}`);
    return new Promise((resolve, reject) => {
        try {
            S3.putObject({
                Bucket: config.Bucket,
                Key: key,
                Body: JSON.stringify(body),
                ContentType: 'application/json; charset=utf-8',
                ACL: 'public-read',
                ...config
            }, function (error, resp) {
                if (!error) {
                    log.success(`Saved object to ${key}`);
                    resolve(resp);
                } else {
                    log.warn(`An error occured while storing an object to ${config.Bucket}/${key}`, error);
                    reject(error);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Utility function for gettin properties defined in git-ignore-me.properties
 * @return {Object} properties in file, or empty object.
 */
function getGitIgnoreMeProperties() {
    const properties = {};
    const lines = fs.readFileSync(
        './git-ignore-me.properties', 'utf8'
    );
    lines.split('\n').forEach(function (line) {
        line = line.split('=');
        if (line[0]) {
            properties[line[0]] = line[1];
        }
    });
    return properties;
}

/**
 * Checks if source is a directory or system file.
 *
 * @param {string} source path to check
 * @return {boolean} true, if directory.
 */
function isDirectory(source) {
    return fs.lstatSync(source).isDirectory();
}

/**
 * Checks if source is a directory or system file.
 *
 * @param {string} source path to check
 * @return {boolean} true, if directory or system file.
 */
function isDirectoryOrSystemFile(source) {
    return isDirectory(source) || (source.startsWith('../') ? source.substring(3, source.length - 1).indexOf('.') === 0 : source.indexOf('.') === 0);
}

/**
 * Creates an array of the version paths that are used when uploading to S3.
 *
 * @param {string} version, typically from package.json.
 * @return {string[]} an array of paths where contents should be stored. E.g 7.1.1 as input would return ['7.1.1', '7.1', '7'].
 */
function getVersionPaths(version) {
    const semver = require('semver');

    version = (version || require(('../../../package.json')).version);

    const preleaseVersion = semver.prerelease(version) ? `-${semver.prerelease(version).join('.')}` : '';

    return [
        `${semver.major(version)}${preleaseVersion}`,
        `${semver.major(version)}.${semver.minor(version)}${preleaseVersion}`,
        `${version}`
    ];
}


/**
 * Upload w/progress bar.
 *
 * @param {object} params containing batchSize, bucket, files, onError callback and callback per processed file.
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function uploadFiles(params) {
    const upload = require('../../upload');
    const { files, name, bucket } = params;

    const nFiles = files.length === 1 ? '1 file' : `${files.length} files`;
    log.starting(`Uploading ${nFiles} for ${name} to bucket ${bucket}:\n`);

    if (files.length === 0) {
        log.message('Upload initiated, but no files specified.');
        return Promise.resolve('No files to upload!');
    }

    const defaultParams = {
        batchSize: 1500,
        bucket,
        onError: err => {
            log.failure(`File(s) errored:\n${err && err.message} ${err.from ? ' - ' + err.from : ''}`);
        },
        callback: (from, to) => {
            log.message(`Uploaded ${from} --> ${to}`);
        }
    };

    return upload.uploadFiles(
        Object.assign(defaultParams, params)
    ).then(result => {
        const { errors } = result;
        if (errors.length) {
            errors.forEach(err => log.failure(`Failed to process file ${err.from} --> ${err.to}`));
            return Promise.reject(new Error(`${errors[0].message}: ${errors[0].from}`));
        }
        return Promise.resolve(result);
    });
}

/**
 * Transforms a filepath to a similar named S3 destination path.
 * @param {string} fromPath file to create a S3 destination path for.
 * @param {string} removeFromDestPath, anything in the fromPath that you want to remove from destination path.
 * @param {string} prefix for S3 destination key.
 * @return {{from: *, to: string}} object for upload api.
 */
function toS3Path(fromPath, removeFromDestPath, prefix) {
    return {
        from: fromPath,
        to: `${prefix ? prefix + '/' : ''}${fromPath.replace(removeFromDestPath, '')}`
    };
}


module.exports = {
    uploadFiles,
    getVersionPaths,
    isDirectory,
    isDirectoryOrSystemFile,
    getS3Object,
    putS3Object,
    getGitIgnoreMeProperties,
    toS3Path
};
