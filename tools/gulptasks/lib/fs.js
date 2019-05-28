/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const Crypto = require('crypto');
const FS = require('fs');
const Path = require('path');

/* *
 *
 *  Functions
 *
 * */

/**
 * Copies all files of a directory.
 *
 * @param {string} directorySourcePath
 *        Directory to get files from
 *
 * @param {string} directoryTargetPath
 *        Directory to copy files into
 *
 * @param {boolean} [includeSubDirectories]
 *        Set to true to copy files from sub-directories
 *
 * @param {Function} [filterFunction]
 *        Return true to include a file, return a string to change the
 *        targetPath
 *
 * @return {void}
 */
function copyAllFiles(
    directorySourcePath,
    directoryTargetPath,
    includeSubDirectories,
    filterFunction
) {

    const filePaths = getFilePaths(directorySourcePath, includeSubDirectories);

    if (filePaths.length === 0) {
        return;
    }

    const pathIndex = (directorySourcePath.length + 1);

    if (typeof filterFunction === 'function') {

        let targetPath, filterResult;
        filePaths.forEach(sourcePath => {

            targetPath = Path.join(
                directoryTargetPath, sourcePath.substr(pathIndex)
            );

            filterResult = filterFunction(sourcePath, targetPath);

            if (!filterResult) {
                return;
            }

            if (typeof filterResult === 'string') {
                copyFile(sourcePath, filterResult);
            } else {
                copyFile(sourcePath, targetPath);
            }
        });
    } else {
        filePaths.forEach(filePath => copyFile(
            filePath, Path.join(directoryTargetPath, filePath.substr(pathIndex))
        ));
    }
}

/**
 * Copies a file.
 *
 * @param {string} fileSourcePath
 *        File to copy
 *
 * @param {string} fileTargetPath
 *        New file
 *
 * @return {void}
 */
function copyFile(fileSourcePath, fileTargetPath) {

    const mkDirP = require('mkdirp');

    mkDirP.sync(Path.dirname(fileTargetPath));

    FS.writeFileSync(fileTargetPath, FS.readFileSync(fileSourcePath));
}

/**
 * Deletes a directory.
 *
 * @param {string} directoryPath
 *        Directory path
 *
 * @param {boolean} [includeEntries]
 *        Set to true to remove containing entries as well
 *
 * @return {void}
 *
 * @throws {Error}
 */
function deleteDirectory(directoryPath, includeEntries) {

    if (!FS.existsSync(directoryPath)) {
        return;
    }

    if (includeEntries) {
        getDirectoryPaths(directoryPath).forEach(
            path => deleteDirectory(path, true)
        );
        getFilePaths(directoryPath).forEach(path => deleteFile(path, true));
    }

    FS.rmdirSync(directoryPath);
}

/**
 * Deletes a file.
 *
 * @param {string} filePath
 *        File path
 *
 * @return {void}
 *
 * @throws {Error}
 */
function deleteFile(filePath) {

    if (!FS.existsSync(filePath)) {
        return;
    }

    FS.unlinkSync(filePath);
}

/**
 * Calculates the SHA256 hash of a directories content.
 *
 * @param {string} directoryPath
 *        Directory path
 *
 * @param {boolean} [useFileContent]
 *        Set to true to check the file content instead of meta data
 *
 * @param {Function} [contentFilter]
 *        Filter file content like source comments
 *
 * @return {string}
 *         Hexadecimal hash value
 */
function getDirectoryHash(directoryPath, useFileContent, contentFilter) {

    const directoryHash = Crypto.createHash('sha256');

    if (useFileContent) {

        getFilePaths(directoryPath, true)
            .sort()
            .forEach(path => {

                directoryHash.update(Path.basename(path));
                directoryHash.update(
                    contentFilter ?
                        (
                            contentFilter(FS.readFileSync(path).toString()) ||
                            ''
                        ) :
                        FS.readFileSync(path).toString()
                );
            });
    } else {

        let meta;

        [directoryPath]
            .concat(...getDirectoryPaths(directoryPath, true))
            .concat(...getFilePaths(directoryPath, true))
            .sort()
            .forEach(path => {

                meta = FS.lstatSync(path);

                directoryHash.update(Path.basename(path));
                directoryHash.update([
                    meta.dev,
                    meta.gid,
                    meta.mode,
                    meta.mtimeMs,
                    meta.size,
                    meta.uid
                ].join(':'));
            });
    }

    return directoryHash.digest('hex');
}

/**
 * Get sub-directory paths from a directory.
 *
 * @param {string} directoryPath
 *        Directory to get directories from
 *
 * @param {boolean} [includeSubDirectories]
 *        Set to true to get directories inside sub-directories
 *
 * @return {Array<string>}
 *         Sub-directory paths
 */
function getDirectoryPaths(directoryPath, includeSubDirectories) {

    const directoryPaths = [];

    let entryPath;
    let entryStat;

    if (FS.existsSync(directoryPath)) {
        FS.readdirSync(directoryPath).forEach(entry => {

            entryPath = Path.join(directoryPath, entry);
            entryStat = FS.lstatSync(entryPath);

            if (entryStat.isDirectory()) {

                directoryPaths.push(entryPath);

                if (includeSubDirectories) {
                    directoryPaths.push(
                        ...getDirectoryPaths(entryPath, includeSubDirectories)
                    );
                }
            }
        });
    }

    return directoryPaths;
}

/**
 * Calculates the SHA256 hash of a files content.
 *
 * @param {string} filePath
 *        File path
 *
 * @param {Function} [contentFilter]
 *        Filter file content like source comments
 *
 * @return {string}
 *         Hexadecimal hash value
 */
function getFileHash(filePath, contentFilter) {

    return Crypto
        .createHash('sha256')
        .update(
            contentFilter ?
                (contentFilter(FS.readFileSync(filePath).toString()) || '') :
                FS.readFileSync(filePath).toString()
        )
        .digest('hex');
}

/**
 * Get file paths from a directory.
 *
 * @param {string} directoryPath
 *        Directory to get files from
 *
 * @param {boolean} [includeSubDirectories]
 *        Set to true to get files from sub-directories
 *
 * @return {Array<string>}
 *         File paths
 */
function getFilePaths(directoryPath, includeSubDirectories) {

    const filePaths = [];

    let entryPath;
    let entryStat;

    if (FS.existsSync(directoryPath)) {
        FS.readdirSync(directoryPath).forEach(entry => {

            entryPath = Path.join(directoryPath, entry);
            entryStat = FS.lstatSync(entryPath);

            if (entryStat.isFile()) {
                filePaths.push(entryPath);
            } else if (includeSubDirectories && entryStat.isDirectory()) {
                filePaths.push(
                    ...getFilePaths(entryPath, includeSubDirectories)
                );
            }
        });
    }

    return filePaths;
}


/**
 * GZIPs a single file.
 *
 * @todo Use in dist task.
 *
 * @param {string} fileSourcePath
 *        Path to source file.
 *
 * @param {string} fileTargetPath
 *        Path to target file.
 *
 * @return {Promise<string>}
 *         Promise to keep
 */
function gzipFile(fileSourcePath, fileTargetPath) {

    const ZLib = require('zlib');

    return new Promise((resolve, reject) => {

        FS
            .createReadStream(fileSourcePath)
            .pipe(ZLib.createGzip())
            .pipe(FS.createWriteStream(fileTargetPath))
            .on('close', () => resolve(fileTargetPath))
            .on('error', reject);
    });
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    copyAllFiles,
    copyFile,
    deleteDirectory,
    deleteFile,
    getDirectoryHash,
    getDirectoryPaths,
    getFileHash,
    getFilePaths,
    gzipFile
};
