const log = require('./log');
const AWSS3 = require('aws-sdk').S3;
const S3 = new AWSS3({
    region: process.env.AWS_REGION || 'eu-west-1'
});

/**
 * Adds number of days to the given date.
 * @param {Date} date to add to
 * @param {integer} days to add to the date.
 * @return {Date} the new date with the added days.
 */
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const DIST_DIR = 'build/dist';

const HTTP_MAX_AGE = {
    oneDay: 86400,
    month: 2592001,
    fiveYears: 157680000
};
const TODAY = new Date();
const HTTP_EXPIRES = {
    // approximate dates
    oneDay: addDays(TODAY, 1),
    month: addDays(TODAY, 30),
    fiveYears: addDays(TODAY, 365 * 5)
};

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
                    log.warn(`An error occured while storing an object to ${config.BUCKET}/${key}`, error);
                    reject(error);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Returns the s3 bucket to use. Either defined
 * in HIGHCHARTS_S3_BUCKET env var or in git-ignore-me.properties file.
 * in HIGHCHARTS_S3_BUCKET env var or in git-ignore-me.properties file.
 * @return {string} the s3bucket to upload to.
 */
function getS3BucketConfig() {
    const fs = require('fs-extra');

    if (process.env.HIGHCHARTS_S3_BUCKET) {
        return process.env.HIGHCHARTS_S3_BUCKET.replace('s3://', '');
    }
    log.message('No HIGHCHARTS_S3_BUCKET env var found. Checking git-ignore-me.properties file.');

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

    const s3Bucket = properties['amazon.s3.bucketname'];
    if (!s3Bucket) {
        throw new Error('No env var HIGHCHARTS_S3_BUCKET defined and no amazon.s3.bucketname property in git-ignore-me.properties.');
    }
    return s3Bucket.replace('s3://', '');

}

/**
 * Checks if source is a directory or system file.
 *
 * @param {string} source path to check
 * @return {boolean} true, if directory or system file.
 */
function isDirectoryOrSystemFile(source) {
    const fs = require('fs-extra');

    return fs.lstatSync(source).isDirectory() || source.indexOf('.') === 0;
}

/**
 * Transforms a filepath to a similar named S3 destination path.
 * @param {string} filePath to create a S3 destination path for.
 * @param {string} localPath where the file resides. E.g 'highstock'. Will be substituted with cdnPath.
 * @param {string} cdnPath where the files should be uploaded. E.g 'stock'.
 * @param {string} version for the distribution/release
 * @return {object} containing from and to parameters
 */
function toS3FilePath(filePath, localPath, cdnPath, version = false) {
    let toPath = filePath.replace(`${DIST_DIR}`, '').replace(`/${localPath}`, cdnPath).replace('/', '');
    if (version) {
        toPath = toPath.replace('js-gzip/', `${version}/`).replace('gfx/', `${version}/gfx/`);
    } else {
        toPath = toPath.replace('js-gzip/', '');
    }
    return {
        from: filePath.trim(),
        to: toPath
    };
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
    const s3Bucket = bucket || getS3BucketConfig();

    log.starting(`Uploading ${files.length} files for ${name} to bucket ${s3Bucket}:\n`);

    if (files.length === 0) {
        log.message('Upload initiated, but no files specified.');
        return Promise.resolve('No files to upload!');
    }

    const defaultParams = {
        batchSize: 400,
        bucket: s3Bucket,
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
 * Uploads files for a specific product to S3.
 *
 * @param {string} localPath where the files should be uploaded. E.g 'highstock'.
 * @param {string} cdnPath where the files should be uploaded. E.g 'stock'.
 * @param {string} prettyName of the product, e.g "Highcharts Gantt"
 * @param {string} version for the distribution/release
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function uploadProductPackage(localPath, cdnPath, prettyName, version) {
    const fs = require('fs-extra');
    const glob = require('glob');
    const promises = [];
    const fromDir = `${DIST_DIR}/${localPath}`;
    const zipFilePaths = glob.sync(`${DIST_DIR}/${prettyName.replace(/ /g, '-')}-${version}.zip`);

    if (zipFilePaths.length < 1) {
        throw new Error('No zip files found. Did you forget to run gulp dist-compress?');
    }

    const zipFile = {
        from: zipFilePaths[0],
        to: 'zips/' + zipFilePaths[0].substring(zipFilePaths[0].lastIndexOf('/') + 1)
    };

    const gfxFromDir = `${fromDir}/gfx`;
    const gfxFiles = glob.sync(`${gfxFromDir}/**/*.*`);
    const gfxFilesToRootDir = gfxFiles.map(file => toS3FilePath(file, localPath, cdnPath));

    const gzippedFileDir = `${fromDir}/js-gzip`;
    if (!fs.existsSync(gzippedFileDir)) {
        throw new Error(`Missing folder ${gzippedFileDir}`);
    }

    const gzippedFiles = glob.sync(`${gzippedFileDir}/**/*`);
    const gzippedFilesToRootDir = gzippedFiles.map(file => toS3FilePath(file, localPath, cdnPath));

    const versionPaths = getVersionPaths(version);
    let gzippedFilesToVersionDir = [];
    let gfxFilesToVersionedDir = [];

    versionPaths.forEach(versionPath => {
        gzippedFilesToVersionDir = [...gzippedFilesToVersionDir, ...gzippedFiles.map(file => toS3FilePath(file, localPath, cdnPath, versionPath))];
        gfxFilesToVersionedDir = [...gfxFilesToVersionedDir, ...gfxFiles.map(file => toS3FilePath(file, localPath, cdnPath, versionPath))];
    });

    promises.push(uploadFiles({
        files: [zipFile],
        name: prettyName
    }));

    promises.push(uploadFiles({
        files: gzippedFilesToRootDir.filter(path => !isDirectoryOrSystemFile(path.from)),
        name: prettyName,
        s3Params: {
            CacheControl: `public, max-age=${HTTP_MAX_AGE.oneDay}`,
            Expires: HTTP_EXPIRES.oneDay,
            ContentEncoding: 'gzip'
        }
    }));

    promises.push(uploadFiles({
        files: gfxFilesToRootDir.filter(path => !isDirectoryOrSystemFile(path.from)),
        name: prettyName,
        s3Params: {
            CacheControl: `public, max-age=${HTTP_MAX_AGE.oneDay}`,
            Expires: HTTP_EXPIRES.oneDay
        }
    }));

    promises.push(uploadFiles({
        files: gzippedFilesToVersionDir.filter(path => !isDirectoryOrSystemFile(path.from)),
        name: prettyName,
        s3Params: {
            CacheControl: `public, max-age=${HTTP_MAX_AGE.fiveYears}`,
            Expires: HTTP_EXPIRES.fiveYears,
            ContentEncoding: 'gzip'
        }
    }));

    promises.push(uploadFiles({
        files: gfxFilesToVersionedDir.filter(path => !isDirectoryOrSystemFile(path.from)),
        name: prettyName,
        s3Params: {
            CacheControl: `public, max-age=${HTTP_MAX_AGE.fiveYears}`,
            Expires: HTTP_EXPIRES.fiveYears
        }
    }));

    return Promise.all(promises);
}


module.exports = {
    uploadFiles,
    uploadProductPackage,
    getS3Object,
    putS3Object
};
