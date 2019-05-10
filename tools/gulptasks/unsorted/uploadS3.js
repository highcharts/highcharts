const semver = require('semver');
const fs = require('fs-extra');
const glob = require('glob');
const progressBar = require('../../progress-bar.js');
const upload = require('../../upload');
const log = require('../lib/log');
const pkgJsonVersion = require(('../../../package.json')).version;


const DIST_DIR = 'build/dist';
const S3_BUCKET_NAME = process.env.HIGHCHARTS_S3_BUCKET; // TODO: support git-ignore-me.properties?

// refactorer her


/**
 * Checks if source is a directory or system file.
 *
 * @param {source} the source path to check
 * @returns {boolean} true, if directory or system file.
 */
function isDirectoryOrSystemFile(source) {
    return fs.lstatSync(source).isDirectory() || source.indexOf('.') === 0;
}


function toS3FilePath(filePath, localPath, cdnPath, version = false) {
    let toPath = filePath.replace(`${DIST_DIR}`, '').replace(`/${localPath}`, cdnPath).replace('/', '');
    if (version) {
        toPath = toPath.replace('js-gzip/', `${version}/`).replace('gfx/', `${version}/gfx/`);
    } else {
        toPath = toPath.replace('js-gzip/', '');
    }
    log.message(`${filePath} --> ${S3_BUCKET_NAME}/${toPath}`);

    return {
        from: filePath,
        to: toPath
    };
}

/**
 * Creates an array of the version paths that are used when uploading to S3.
 *
 * @param {version} version, typically from package.json.
 * @return {string[]} an array of paths where contents should be stored. E.g 7.1.1 as input would return ['7.1.1', '7.1', '7'].
 */
function getVersionPaths(version = pkgJsonVersion) {
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
 * @param {params} params containing batchSize, bucket, files, onError callback and callback per processed file.
 * @return {Promise<any> | Promise | Promise} Promise to keep
 */
function uploadFiles(params) {
    const { files, name } = params;

    log.starting(`Uploading files to bucket ${S3_BUCKET_NAME}:\n`);

    const bar = new progressBar({
        error: '',
        total: files.length,
        message: `\n[:bar] - Uploaded :count of :total ${name ? name : ''} files. :error`
    });

    const defaultParams = {
        batchSize: 50,
        bucket: S3_BUCKET_NAME.replace('s3://', ''),
        files,
        onError: err => {
            bar.tick({
                error: `File(s) errored:\n${err && err.message} ${err.from ? ' - ' + err.from : ''}`
            });
        },
        callback: (from, to) => {
            log.message(`Uploaded ${from} --> ${to}`);
            // bar.tick();
        }
    };

    return upload.uploadFiles(
        Object.assign(defaultParams, params)
    ).then(result => {
        const { errors } = result;
        if (errors.length) {
            errors.forEach(err => log.failure(`Failed to process file ${err.from} --> ${err.to}`));
        }
    });
}


/**
 * Uploads files for a specific product to S3.
 *
 * @param {localPath} localPath where the files should be uploaded. E.g 'highstock'.
 * @param {cdnPath} cdnPath where the files should be uploaded. E.g 'stock'.
 * @param {name} name of the product, e.g "Highcharts Gantt"
 * @param {version} version for the distribution/release
 * @return {Promise<any> | Promise | Promise} Promise to keep
 */
function uploadProductFiles(localPath, cdnPath, name, version) {
    // FIXME: set maxage && http.expires

    return new Promise((resolve, reject) => {
        const fromDir = `${DIST_DIR}/${localPath}`;
        const zipFilePaths = glob.sync(`${DIST_DIR}/${name.replace(/ /g, '-')}-${version}.zip`);
        const zipFile = {
            from: zipFilePaths[0],
            to: '/'
        };

        const gfxFromDir = `${fromDir}/gfx`;
        const gfxFiles = glob.sync(`${gfxFromDir}/**/*.*`);
        const gfxFilesToRootPath = gfxFiles.map(file => toS3FilePath(file, localPath, cdnPath));
        log.starting(`Preparing ${gfxFilesToRootPath.length} files in ', ${gfxFromDir}`);

        const gzippedFileDir = `${fromDir}/js-gzip`;
        if (!fs.existsSync(gzippedFileDir)) {
            reject(new Error(`Missing folder ${gzippedFileDir}`));
        }

        const gzippedFiles = glob.sync(`${gzippedFileDir}/**/*`);
        const gzippedFilesToRoot = gzippedFiles.map(file => toS3FilePath(file, localPath, cdnPath));

        log.starting(`Preparing ${gzippedFilesToRoot.length} files in ', ${gzippedFileDir}`);

        const versionPaths = getVersionPaths(version);
        let versionedFolderFiles = [];
        versionPaths.forEach(versionPath => {
            // ideally only a single folder should be uploaded while the rest should be copied.
            const gzippedFilesToVersionDir = gzippedFiles.map(file => toS3FilePath(file, localPath, cdnPath, versionPath));
            const gfxFilesToVersionedDir = gfxFiles.map(file => toS3FilePath(file, localPath, cdnPath, versionPath));
            versionedFolderFiles = versionedFolderFiles.concat(gzippedFilesToVersionDir).concat(gfxFilesToVersionedDir);
        });

        const files = [
            zipFile,
            ...gfxFilesToRootPath,
            ...gzippedFilesToRoot,
            ...versionedFolderFiles
        ].filter(path => !isDirectoryOrSystemFile(path.from));

        uploadFiles({ files, name })
            .then(
                result => {
                    log.success(`Finished uploading ${name} files!`);
                    resolve(result);
                },
                err => {
                    log.failure(`Failed when uploading ${name} files. Reason: ${err && err.message}`);
                    reject(err);
                }
            );
    });
}


module.exports = {
    uploadFiles,
    uploadProductFiles
};
