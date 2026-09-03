/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/* *
 *
 *  Constants
 *
 * */

const GENERATED_METADATA_PATH = 'ts/Grid/Core/DeprecatedOptionsMetadata.ts';

const GRID_SOURCE_PATH = 'ts/Grid';

const METADATA_INPUT_PATHS = [
    GRID_SOURCE_PATH,
    'tools/api-docs/grid-deprecated-options.ts',
    'tools/api-docs/grid-options.ts'
];


/* *
 *
 *  Functions
 *
 * */

/**
 * Parse `git status --porcelain` output.
 *
 * @param {string} output
 * Git status output.
 *
 * @return {Array<{filePath: string, status: string}>}
 * Status entries.
 */
function parseGitStatus(output) {
    return output
        .split('\n')
        .filter(Boolean)
        .map(line => {
            const status = line.slice(0, 2);
            let filePath = line.slice(3).trim();

            if (filePath.includes(' -> ')) {
                filePath = filePath.split(' -> ').pop() || filePath;
            }

            return {
                filePath: filePath.replace(/\\/gu, '/'),
                status
            };
        });
}

/**
 * Normalize output from `git diff --name-only`.
 *
 * @param {string} output
 * Git diff output.
 *
 * @return {Array<string>}
 * Changed files.
 */
function parseGitNameOnly(output) {
    return output
        .split('\n')
        .filter(Boolean)
        .map(filePath => filePath.replace(/\\/gu, '/'));
}

/**
 * Check whether a path is the generated metadata file.
 *
 * @param {string} filePath
 * File path.
 *
 * @return {boolean}
 * True for the generated metadata file.
 */
function isGeneratedMetadataFile(filePath) {
    return filePath === GENERATED_METADATA_PATH;
}

/**
 * Check whether a path can affect generated metadata.
 *
 * @param {string} filePath
 * File path.
 *
 * @return {boolean}
 * True if the file can affect generated metadata.
 */
function isMetadataInputFile(filePath) {
    return !isGeneratedMetadataFile(filePath) && METADATA_INPUT_PATHS.some(
        inputPath => (
            filePath === inputPath ||
            filePath.startsWith(`${inputPath}/`)
        )
    );
}

/**
 * Get staged files that should make the task stage generated metadata.
 *
 * @param {string} output
 * Git diff output.
 *
 * @return {Array<string>}
 * Staged metadata files.
 */
function getStagedMetadataFilesFromOutput(output) {
    const files = parseGitNameOnly(output)
        .filter(filePath => (
            isGeneratedMetadataFile(filePath) ||
            isMetadataInputFile(filePath)
        ));

    return [...new Set(files)].sort();
}

/**
 * Get unstaged files that can affect generated metadata.
 *
 * @param {string} output
 * Git status output.
 *
 * @return {Array<string>}
 * Unstaged source files.
 */
function getUnstagedMetadataInputFilesFromStatus(output) {
    const files = parseGitStatus(output)
        .filter(({ filePath, status }) => {
            if (
                status === '!!' ||
                isGeneratedMetadataFile(filePath) ||
                !isMetadataInputFile(filePath)
            ) {
                return false;
            }

            return status === '??' || status[1] !== ' ';
        })
        .map(({ filePath }) => filePath);

    return [...new Set(files)].sort();
}

/**
 * Get git command output.
 *
 * @param {Array<string>} args
 * Git command arguments.
 * @param {boolean} [optional]
 * Whether git failures should return an empty output.
 *
 * @return {string}
 * Git command output.
 */
function getGitOutput(args, optional) {
    const childProcess = require('node:child_process');

    try {
        return childProcess.execFileSync(
            'git',
            args,
            {
                cwd: process.cwd(),
                encoding: 'utf-8',
                stdio: optional ?
                    ['ignore', 'pipe', 'ignore'] :
                    ['ignore', 'pipe', 'pipe']
            }
        );
    } catch (error) {
        if (optional) {
            return '';
        }

        throw error;
    }
}

/**
 * Get staged files that should make the task stage generated metadata.
 *
 * @param {boolean} [optional]
 * Whether git failures should return no staged files.
 *
 * @return {Array<string>}
 * Staged metadata files.
 */
function getStagedMetadataFiles(optional) {
    const output = getGitOutput(
        ['diff', '--cached', '--name-only', '--', ...METADATA_INPUT_PATHS],
        optional
    );

    return getStagedMetadataFilesFromOutput(output);
}

/**
 * Get unstaged files that can affect generated metadata.
 *
 * @return {Array<string>}
 * Unstaged source files.
 */
function getUnstagedMetadataInputFiles() {
    const output = getGitOutput(
        ['status', '--porcelain', '--', ...METADATA_INPUT_PATHS]
    );

    return getUnstagedMetadataInputFilesFromStatus(output);
}

/**
 * Stage the generated deprecated options metadata file.
 *
 * @return {void}
 */
function stageGeneratedMetadata() {
    getGitOutput(['add', '--', GENERATED_METADATA_PATH]);
}

/* *
 *
 *  Tasks
 *
 * */

/**
 * Generate Grid runtime metadata for deprecated options.
 *
 * @return {Promise<void>}
 * Promise to keep
 */
async function generateDeprecatedOptions() {
    const argv = require('yargs').argv;
    const log = require('../../libs/log');
    const processLib = require('../../libs/process');
    const shouldStage = (
        argv.stage ||
        getStagedMetadataFiles(true).length > 0
    );

    if (shouldStage) {
        const unstagedFiles = getUnstagedMetadataInputFiles();

        if (unstagedFiles.length) {
            const preview = unstagedFiles.slice(0, 20);

            log.failure(
                'Cannot stage Grid deprecated options metadata while ' +
                'metadata input files have unstaged changes:'
            );
            preview.forEach(file => log.warn(`- ${file}`));

            if (unstagedFiles.length > preview.length) {
                log.warn(
                    `- ... and ${unstagedFiles.length - preview.length} more`
                );
            }

            throw new Error(
                'Stage or stash the metadata input changes and retry the commit.'
            );
        }
    }

    await processLib.exec(
        'npx ts-node tools/api-docs/grid-deprecated-options.ts ' +
        `--source "${GRID_SOURCE_PATH}"`
    );

    if (shouldStage) {
        stageGeneratedMetadata();
        log.success('Staged', GENERATED_METADATA_PATH);
    }
}

gulp.task('grid/deprecated-options', generateDeprecatedOptions);

module.exports = {
    getGitOutput,
    getStagedMetadataFilesFromOutput,
    getUnstagedMetadataInputFilesFromStatus,
    parseGitStatus
};
