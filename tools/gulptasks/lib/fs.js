/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

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
 * @return {boolean}
 *         True if deleted
 */
function deleteDirectory(directoryPath, includeEntries) {

    try {

        if (!FS.existsSync(directoryPath)) {
            return true;
        }

        if (includeEntries) {
            getDirectoryPaths(directoryPath).forEach(deleteDirectory);
            getFilePaths(directoryPath).forEach(deleteFile);
        }

        FS.rmdirSync(directoryPath);

        return true;
    } catch (error) {

        return false;
    }
}

/**
 * Deletes a file.
 *
 * @param {string} filePath
 *        File path
 *
 * @return {boolean}
 *         True if deleted
 */
function deleteFile(filePath) {

    try {

        if (!FS.existsSync(filePath)) {
            return true;
        }

        FS.unlinkSync(filePath);

        return true;
    } catch (error) {

        return false;
    }
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
    getDirectoryPaths,
    getFilePaths,
    gzipFile
};
