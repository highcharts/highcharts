/*
 * Copyright (C) Highsoft AS
 */

/* eslint func-style: 0, no-console: 0, max-len: 0 */
const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs');
const log = require('./lib/log');
const { isDirectory, isDotEntry } = require('./lib/fs');
const {
    uploadFiles,
    getGitIgnoreMeProperties,
    getVersionPaths
} = require('./lib/uploadS3');


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

let purgeCacheRequests = 0;
let error429 = false;
async function cloudflarePurgeCode(files) {
    const argv = require('yargs').argv;

    if (!argv.useGitIgnoreMe) {
        return;
    }

    const props = getGitIgnoreMeProperties();
    const cf = require('cloudflare')({
        token: props['cloudflare.token']
    });

    purgeCacheRequests++;

    if (error429) {
        console.log(`Stopped purgeCache after ${purgeCacheRequests} requests`);
    } else {
        const resp = await cf.zones
            .purgeCache(props['cloudflare.zone'], { files })
            .catch(e => {
                if (e.statusCode === 429) {
                    error429 = true;
                }
                console.log(
                    'CloudFlare Error',
                    e.statusCode,
                    e.statusMessage,
                    purgeCacheRequests
                );
            });
        if (resp && resp.success) {
            console.log(`CloudFlare: purged ${files.length} files`);
        }
    }
}

/**
 * Transforms a filepath to a similar named S3 destination path. Specific for highcharts js upload.
 * @param {string} filePath to create a S3 destination path for.
 * @param {string} localPath where the file resides. E.g 'highstock'. Will be substituted with cdnPath.
 * @param {string} cdnPath where the files should be uploaded. E.g 'stock'.
 * @param {string} version for the distribution/release
 * @return {object} containing from and to parameters
 */
function toS3FilePath(filePath, localPath, cdnPath, version = false) {
    let toPath = filePath.replace(DIST_DIR, '').replace(localPath, cdnPath).replace('/', '');
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
 * Uploads files for a specific highcharts product to S3.
 *
 * @param {object} productProps containing name, prettyName, cdnPath and version
 * @param {object} options that includes s3 options that will be passed to the sdk.
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function uploadProductPackage(productProps, options = {}) {
    const { distpath: localPath, name: prettyName, version, cdnpath } = productProps;
    const promises = [];
    const fromDir = `${DIST_DIR}${localPath}`;
    const zipFilePaths = glob.sync(`${DIST_DIR}/${prettyName.replace(/ /g, '-')}-${version}.zip`);
    const cdnFiles = [{ to: 'products.js' }];

    // For testing cache purging without uploading:
    /*
    const uploadFiles = () => console.log('@uploadFiles overridden');
    zipFilePaths[0] = '';
    // */

    if (zipFilePaths.length < 1) {
        throw new Error('No zip files found. Did you forget to run gulp dist-compress?');
    }

    const zipFile = {
        from: zipFilePaths[0],
        to: 'zips/' + zipFilePaths[0].substring(zipFilePaths[0].lastIndexOf('/') + 1)
    };

    const gfxFromDir = `${fromDir}/gfx`;
    const gfxFiles = glob.sync(`${gfxFromDir}/**/*.*`);
    const gfxFilesToRootDir = gfxFiles.map(file => toS3FilePath(file, localPath, cdnpath));

    const gzippedFileDir = `${fromDir}/js-gzip`;
    if (!fs.existsSync(gzippedFileDir)) {
        throw new Error(`Missing folder ${gzippedFileDir}`);
    }

    const gzippedFiles = glob.sync(`${gzippedFileDir}/**/*`);
    const gzippedFilesToRootDir = gzippedFiles.map(file => toS3FilePath(file, localPath, cdnpath));

    const versionPaths = getVersionPaths(version);
    let gzippedFilesToVersionDir = [];
    let gfxFilesToVersionedDir = [];

    versionPaths.forEach(versionPath => {
        gzippedFilesToVersionDir = [...gzippedFilesToVersionDir, ...gzippedFiles.map(file => toS3FilePath(file, localPath, cdnpath, versionPath))];
        gfxFilesToVersionedDir = [...gfxFilesToVersionedDir, ...gfxFiles.map(file => toS3FilePath(file, localPath, cdnpath, versionPath))];
    });

    promises.push(uploadFiles({
        bucket: options.bucket,
        files: [zipFile],
        name: prettyName
    }));

    const rootJSFiles = gzippedFilesToRootDir.filter(
        path => !isDirectory(path.from) && !isDotEntry(path.from)
    );
    cdnFiles.push.apply(cdnFiles, rootJSFiles);
    promises.push(uploadFiles({
        bucket: options.bucket,
        files: rootJSFiles,
        name: prettyName,
        s3Params: {
            ...options.s3Params,
            CacheControl: `public, max-age=${HTTP_MAX_AGE.oneDay}`,
            Expires: HTTP_EXPIRES.oneDay,
            ContentEncoding: 'gzip'
        }
    }));

    const rootGfxFiles = gfxFilesToRootDir.filter(
        path => !isDirectory(path.from) && !isDotEntry(path.from)
    );
    cdnFiles.push.apply(cdnFiles, rootGfxFiles);
    promises.push(uploadFiles({
        bucket: options.bucket,
        files: rootGfxFiles,
        name: prettyName,
        s3Params: {
            ...options.s3Params,
            CacheControl: `public, max-age=${HTTP_MAX_AGE.oneDay}`,
            Expires: HTTP_EXPIRES.oneDay
        }
    }));

    const versionJSFiles = gzippedFilesToVersionDir.filter(
        path => !isDirectory(path.from) && !isDotEntry(path.from)
    );
    cdnFiles.push.apply(cdnFiles, versionJSFiles);
    promises.push(uploadFiles({
        bucket: options.bucket,
        files: versionJSFiles,
        name: prettyName,
        s3Params: {
            ...options.s3Params,
            CacheControl: `public, max-age=${HTTP_MAX_AGE.fiveYears}`,
            Expires: HTTP_EXPIRES.fiveYears,
            ContentEncoding: 'gzip'
        }
    }));

    const versionGfxFiles = gfxFilesToVersionedDir.filter(
        path => !isDirectory(path.from) && !isDotEntry(path.from)
    );
    cdnFiles.push.apply(cdnFiles, versionGfxFiles);
    promises.push(uploadFiles({
        bucket: options.bucket,
        files: versionGfxFiles,
        name: prettyName,
        s3Params: {
            ...options.s3Params,
            CacheControl: `public, max-age=${HTTP_MAX_AGE.fiveYears}`,
            Expires: HTTP_EXPIRES.fiveYears
        }
    }));

    // Purge CloudFlare cache POC. Currently stopped by rate limiting?
    const cloudflarePaths = cdnFiles.reduce((paths, f) => {
        if (
            // f.to.indexOf('es-modules') === -1 &&
            // f.to.indexOf('.js.map') === -1 &&
            !/\/[0-9]+\.[0-9]+\.[0-9]+\//u.test(f.to)
        ) {
            paths.push(`https://code.highcharts.com/${f.to}`);
        }
        return paths;
    }, []);

    // fs.writeFileSync('files-to-purge.txt', cloudflarePaths.join('\n'));

    while (cloudflarePaths.length) {
        promises.push(cloudflarePurgeCode(cloudflarePaths.splice(0, 30)));
    }

    return Promise.all(promises);
}

/**
 * Upload code for all products (see example https://code.highcharts.com).
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function distUploadCode() {
    const argv = require('yargs').argv;
    const properties = require('../../build-properties.json');
    const products = ((argv.products && argv.products.split(',')) || properties.products); // one or more of 'highcharts', 'highstock', 'highmaps', 'gantt', ...

    console.log(products);

    let bucket = argv.bucket;
    if (argv.useGitIgnoreMe) {
        bucket = getGitIgnoreMeProperties()['amazon.s3.bucketname'].replace('s3://', '');
        log.message(`Using bucket ${bucket} as defined in git-ignore-me.properties.`);
    }

    if (!bucket) {
        throw new Error('No --bucket or --use-git-ignore-me argument specified.');
    }

    const productJs = glob.sync(`${DIST_DIR}/products.js`).map(file => ({
        from: file,
        to: [...file.split('/')].pop()
    }));
    const promises = Object.keys(products).map(productName => {
        if (!properties.products[productName]) {
            return Promise.reject(new Error(`Could not find entry in build-properties.json for: ${productName}`));
        }
        const productProps = { name: productName, ...products[productName], version: properties.version };
        return uploadProductPackage(productProps, { bucket });
    });

    promises.push(uploadFiles({ files: productJs, name: 'products.js', bucket, profile: argv.profile }));
    return Promise.all(promises);
}

distUploadCode.description = 'Uploads distribution files (zipped/binary) to code bucket.';
distUploadCode.flags = {
    '--bucket': 'S3 bucket to upload to. Is overridden if --use-git-ignore-me is defined.',
    '--products': 'Comma-separated list of products to upload. E.g highcharts,highmaps (optional - default is all products defined in build-properties.json).',
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)',
    '--use-git-ignore-me': 'Will look for bucket in git-ignore-me.properties file (fallback as previously used by ant build). Required if ---bucket not specified.'
};

gulp.task('dist-upload-code', distUploadCode);
