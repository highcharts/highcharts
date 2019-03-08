/*
 * Copyright (C) Highsoft AS
 */

/* eslint no-use-before-define: 0 */

const Fs = require('fs');
const mkDirP = require('mkdirp');
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

    mkDirP.sync(Path.dirname(fileTargetPath));

    Fs.writeFileSync(fileTargetPath, Fs.readFileSync(fileSourcePath));
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

    if (Fs.existsSync(directoryPath)) {
        Fs.readdirSync(directoryPath).forEach(entry => {

            entryPath = Path.join(directoryPath, entry);
            entryStat = Fs.lstatSync(entryPath);

            if (entryStat.isDirectory()) {

                directoryPaths.push(entryPath);

                if (includeSubDirectories) {
                    directoryPaths.push(...getDirectoryPaths(entryPath));
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

    if (Fs.existsSync(directoryPath)) {
        Fs.readdirSync(directoryPath).forEach(entry => {

            entryPath = Path.join(directoryPath, entry);
            entryStat = Fs.lstatSync(entryPath);

            if (entryStat.isFile()) {
                filePaths.push(entryPath);
            } else if (includeSubDirectories && entryStat.isDirectory()) {
                filePaths.push(...getFilePaths(entryPath));
            }
        });
    }

    return filePaths;
}

/* *
 *
 *  Exports
 *
 * */

module.exports = {
    copyAllFiles,
    copyFile,
    getDirectoryPaths,
    getFilePaths
};
