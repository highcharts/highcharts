/*
 * Copyright (C) Highsoft AS
 */

/* eslint-disable func-style, no-use-before-define, quotes */


/* *
 *
 *  Imports
 *
 * */


const fs = require('fs');
const gulp = require('gulp');
const path = require('path');


/* *
 *
 *  Constants
 *
 * */


const HELP_MESSAGE = [
    'Uploads API documentation of "build/api" folder.',
    '',
    '--bucket  S3 bucket to upload to.',
    '--docs    Subfolders of "build/api" to upload. (optional)',
    '--dryrun  Test run with "tmp/s3" instead of uploading. (optional)',
    '--expected-highcharts-version  Required with --react-artifact.',
    '--expected-react-version      Required with --react-artifact.',
    '--helpme  This help.',
    '--profile AWS profile to load from AWS credentials file. If no profile',
    '          is provided the default profile or standard AWS environment',
    '          variables for credentials will be used. (optional)',
    '--region  AWS region of S3 bucket. (optional)',
    '--react-artifact  Validated React static artifact directory. (optional)',
    '--react-report  Publication report path. (optional)',
    '--react-only  Publish all React files and skip legacy upload/navigation.',
    '--react-shells-only  Publish only React shells and skip legacy upload/sync.',
    '--speak   Says if task failed or succeeded. (optional)',
    '--sync    Synchronize the S3 bucket; deletes remote files that are not',
    '          found in the local folder, except React-owned paths. (optional)'
].join('\n');

const HTML_HEAD_STATIC = [
    [
        '',
        '<script',
        'id="Cookiebot"',
        'src="https://consent.cookiebot.com/uc.js"',
        'data-cbid="8be0770c-8b7f-4e2d-aeb5-2cfded81e177"',
        'data-blockingmode="auto"',
        'type="text/javascript"',
        '></script>'
    ].join('\n        '),
    [
        '',
        '<!-- Google Tag Manager -->',
        `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':`,
        `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],`,
        `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=`,
        `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);`,
        `})(window,document,'script','dataLayer','GTM-5WLVCCK');</script>`,
        `<!-- End Google Tag Manager -->`
    ].join('\n        ')
].join('\n');

const SOURCE_ROOT = 'build/api';


/* *
 *
 *  Functions
 *
 * */


/**
 * Updates some file content with additional HTML file content.
 *
 * @param {string} filePath
 * Local source path of the file.
 *
 * @param {Buffer} fileContent
 * File content to update.
 *
 * @return {Buffer}
 * Updated file content.
 */
function updateFileContent(filePath, fileContent) {
    const basename = path.basename(filePath);

    switch (path.extname(filePath)) {
        case '.htm':
        case '.html':
            if (
                !/^(?:(?:foot|head)(?:er)?|index)|-frame\.html?/u.test(basename) &&
                !fileContent.includes('<frame') &&
                !fileContent.includes('<iframe')
            ) {
                fileContent = Buffer.from(
                    fileContent
                        .toString()
                        .replace(/^(.*<\/head>.*)$/mu, HTML_HEAD_STATIC + '\n$1')
                );
            }
            break;
        default:
    }

    return fileContent;
}


/* *
 *
 *  Task
 *
 * */


/**
 * Uploads API documentation.
 *
 * @return {Promise}
 * Promise to keep.
 */
async function apiUpload() {
    return runApiUpload(require('yargs').argv);
}


/**
 * Parses and validates a relative --docs selection.
 *
 * @param {string} docs
 * Comma-separated paths relative to build/api.
 *
 * @param {Function} isReactOwnedKey
 * React path ownership predicate.
 *
 * @return {Array<string>}
 * Normalized relative paths.
 */
function normalizeDocs(docs, isReactOwnedKey) {
    if (typeof docs !== 'string') {
        throw new Error('--docs must be a comma-separated relative path list.');
    }

    return docs.split(',').map(item => {
        const input = item.trim().replace(/\\/gu, '/');

        if (
            !input ||
            input.startsWith('/') ||
            /^[A-Za-z]:/u.test(input) ||
            input.split('/').includes('..')
        ) {
            throw new Error(`Invalid --docs path "${item}".`);
        }

        const normalized = path.posix.normalize(input);

        if (
            normalized === '.' ||
            normalized === '..' ||
            normalized.startsWith('../')
        ) {
            throw new Error(`Invalid --docs path "${item}".`);
        }

        if (isReactOwnedKey(normalized)) {
            throw new Error(
                `--docs cannot select React-owned path "${normalized}"; ` +
                'use --react-artifact instead.'
            );
        }

        return normalized;
    });
}


/**
 * Builds and validates the artifact input flags shared by API tasks.
 *
 * @param {object} args
 * Parsed yargs arguments.
 *
 * @param {object} options
 * Task-specific options.
 *
 * @return {object|undefined}
 * Validated artifact input flags.
 */
function getReactArtifactInput(args, options = {}) {
    const {
        expectedHighchartsVersion,
        expectedReactVersion,
        reactArtifact,
        reactOnly,
        reactReport,
        reactShellsOnly
    } = args;

    if (reactArtifact === void 0) {
        if (
            expectedHighchartsVersion !== void 0 ||
            expectedReactVersion !== void 0 ||
            reactReport !== void 0 ||
            reactOnly !== void 0 ||
            reactShellsOnly !== void 0
        ) {
            throw new Error(
                'React artifact options require --react-artifact.'
            );
        }
        return void 0;
    }

    if (
        typeof reactArtifact !== 'string' ||
        !reactArtifact.trim() ||
        typeof expectedReactVersion !== 'string' ||
        !expectedReactVersion.trim() ||
        typeof expectedHighchartsVersion !== 'string' ||
        !expectedHighchartsVersion.trim()
    ) {
        throw new Error(
            '--react-artifact requires --expected-react-version and ' +
            '--expected-highcharts-version.'
        );
    }

    if (
        reactReport !== void 0 &&
        (typeof reactReport !== 'string' || !reactReport.trim())
    ) {
        throw new Error('--react-report must be a file path.');
    }

    if (reactShellsOnly && !options.allowShellsOnly) {
        throw new Error('--react-shells-only is not supported by this task.');
    }

    if (reactOnly && reactShellsOnly) {
        throw new Error('--react-only cannot be combined with --react-shells-only.');
    }

    return {
        directory: path.resolve(reactArtifact.trim()),
        expectedHighchartsVersion: expectedHighchartsVersion.trim(),
        expectedReactVersion: expectedReactVersion.trim(),
        reportPath: reactReport ? path.resolve(reactReport.trim()) : void 0,
        reactOnly: !!reactOnly,
        shellsOnly: !!reactShellsOnly
    };
}


/**
 * Uploads API documentation, with an optional validated React artifact.
 *
 * @param {object} args
 * Parsed yargs arguments.
 *
 * @param {object} dependencies
 * Injectable dependencies for task tests.
 *
 * @return {Promise<void>}
 * Promise to keep.
 */
async function runApiUpload(args, dependencies = {}) {
    const uploadS3 = dependencies.uploadS3 || require('./lib/uploadS3');
    const fsLib = require('../libs/fs');
    const log = require('../libs/log');
    const sourceRoot = dependencies.sourceRoot || SOURCE_ROOT;
    const reactStatic = dependencies.reactStatic || require('./lib/reactStatic');
    const {
        bucket,
        dryrun,
        helpme,
        profile,
        region,
        speak,
        sync
    } = args;

    if (helpme) {
        // eslint-disable-next-line no-console
        console.log(HELP_MESSAGE);
        return;
    }

    if (!bucket && !dryrun) {
        throw new Error('No --bucket specified.');
    }

    const reactArtifactInput = getReactArtifactInput(args, {
        allowShellsOnly: true
    });
    let normalizedDocs;

    if (!reactArtifactInput?.shellsOnly && !reactArtifactInput?.reactOnly && args.docs !== void 0) {
        normalizedDocs = normalizeDocs(
            args.docs,
            reactStatic.isReactOwnedKey
        );
    }

    const sourceRootExists = fs.existsSync(sourceRoot) &&
        fs.lstatSync(sourceRoot).isDirectory();

    const skipLegacy = reactArtifactInput?.reactOnly || reactArtifactInput?.shellsOnly;
    if (!skipLegacy && !sourceRootExists) {
        throw new Error(`Source directory "${sourceRoot}" not found.`);
    }
    const sourceItems = skipLegacy ? [] : normalizedDocs ?
        normalizedDocs.map(doc => path.join(sourceRoot, ...doc.split('/'))) :
        fsLib.getDirectoryPaths(sourceRoot);

    if (sync && reactArtifactInput && !skipLegacy) {
        const products = ['highcharts', 'highstock', 'highmaps', 'gantt'];
        const selectedProducts = products.filter(product => sourceItems.some(item =>
            path.relative(sourceRoot, item).split(path.sep)[0] === product));
        for (const product of selectedProducts) {
            for (const name of ['api.js', 'index.html']) {
                const legacyFile = path.join(sourceRoot, product, name);
                if (!fs.existsSync(legacyFile) || !fs.lstatSync(legacyFile).isFile()) {
                    throw new Error(`Legacy API build missing ${legacyFile}; generate legacy docs or use --react-only.`);
                }
            }
        }
    }

    let stagedReactArtifact;

    if (reactArtifactInput) {
        const verifiedArtifact = await reactStatic.verifyArtifact(
            reactArtifactInput.directory,
            {
                expectedHighchartsVersion:
                    reactArtifactInput.expectedHighchartsVersion,
                expectedReactVersion: reactArtifactInput.expectedReactVersion
            }
        );
        stagedReactArtifact = await reactStatic.stageArtifact(
            verifiedArtifact,
            sourceRoot,
            { addNavigation: !reactArtifactInput.reactOnly }
        );
    }

    if (
        !fs.existsSync(sourceRoot) ||
        !fs.lstatSync(sourceRoot).isDirectory()
    ) {
        throw new Error(`Source directory "${sourceRoot}" not found.`);
    }

    for (const sourceItem of sourceItems) {
        if (!fs.existsSync(sourceItem)) {
            throw new Error(`Source path "${sourceItem}" not found.`);
        }
    }

    if (stagedReactArtifact) {
        await reactStatic.preparePublicationReport(
            stagedReactArtifact,
            reactArtifactInput.reportPath
        );
    }

    const session = await uploadS3.startS3Session(
        bucket,
        profile,
        region,
        dryrun
    );
    const includeKey = key => !reactStatic.isReactOwnedKey(
        String(key).replace(/\\/gu, '/')
    );
    const filterLegacyContent = (file, content) => {
        if (!stagedReactArtifact && path.basename(file) === 'api.js') {
            const marker = content.indexOf('\n/* React API navigation */\n');
            if (marker >= 0) {
                content = content.subarray(0, marker);
            }
        }
        return updateFileContent(file, content);
    };

    try {
        if (stagedReactArtifact) {
            await reactStatic.publishArtifact(
                stagedReactArtifact,
                session,
                {
                    shellsOnly: reactArtifactInput.shellsOnly,
                    reportPath: reactArtifactInput.reportPath
                }
            );
        }

        for (const sourceItem of sourceItems) {
            const targetKey = path.relative(
                sourceRoot,
                sourceItem
            ).replace(/\\/gu, '/');

            if (!includeKey(targetKey)) {
                continue;
            }

            if (fsLib.isFile(sourceItem)) {
                await uploadS3.uploadFile(
                    sourceItem,
                    targetKey,
                    session,
                    filterLegacyContent
                );
            } else if (
                sync &&
                !sourceItem.endsWith('zips')
            ) {
                await uploadS3.synchronizeDirectory(
                    sourceItem,
                    targetKey,
                    session,
                    filterLegacyContent,
                    includeKey
                );
            } else {
                await uploadS3.uploadDirectory(
                    sourceItem,
                    targetKey,
                    session,
                    filterLegacyContent,
                    includeKey
                );
            }
        }

        log.success('Done.');

        if (speak) {
            log.say(`${sync ? 'Synchronization' : 'Upload'} done.`);
        }
    } catch (error) {

        log.failure(error);

        if (speak) {
            log.say(`${sync ? 'Synchronization' : 'Upload'} failed!`);
        }

        throw error;

    } finally {
        session.region.destroy();
    }
}


/* *
 *
 *  Tasks
 *
 * */


gulp.task('api-upload', apiUpload);

module.exports = {
    getReactArtifactInput,
    normalizeDocs,
    runApiUpload
};
