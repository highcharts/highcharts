/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const logLib = require('./lib/log');
const argv = require('yargs').argv;
const { uploadFiles } = require('./lib/uploadS3');
const { createPRComment, updatePRComment, fetchPRComments } = require('./lib/github');
const glob = require('glob');

const S3_PULLREQUEST_PATH = 'visualtests/diffs/pullrequests';
const DEFAULT_COMMENT_TITLE = '## Cypress visual test results';

const VISUAL_TESTS_BUCKET = process.env.HIGHCHARTS_VISUAL_TESTS_BUCKET || 'staging-vis-dev.highcharts.com';

// eslint-disable-next-line no-unused-vars,require-jsdoc
function completeTask(message) {
    if (!argv.failSilently) {
        return Promise.reject(new Error(message));
    }
    logLib.warn('Forcing success, but error occured: ' + message);
    return Promise.resolve(message);
}

/* eslint-disable require-jsdoc,valid-jsdoc */
function buildImgS3Path(filename, pr) {
    return `${S3_PULLREQUEST_PATH}/${pr}/${filename}`;
}

function createPRCommentBody(uploadedDiffs) {
    let commentTemplate = `${DEFAULT_COMMENT_TITLE}`;

    uploadedDiffs.files.forEach(file => {
        commentTemplate += `\n\n * [${file.from}](${'https://vrevs.highsoft.com/api/assets/' + file.to})`;
    });

    return commentTemplate;
}

async function uploadVisualTestFiles(pr) {
    const result = {};

    const diffFiles = glob.sync('cypress/snapshots/diff/**/*-diff.png')
        .map(path => ({
            from: path,
            to: buildImgS3Path(path, pr)
        }));

    result.files = diffFiles;

    if (diffFiles.length > 0) {
        if (!argv.dryrun) {
            try {
                result.status = await uploadFiles({
                    files: diffFiles,
                    bucket: VISUAL_TESTS_BUCKET,
                    profile: argv.profile,
                    name: 'image diff'
                });
            } catch (err) {
                logLib.failure('One or more files were not uploaded. Continuing to let task finish gracefully. ' +
                    'Original error: ' + err.message);
            }

        } else {
            logLib.message('Dry run - Skipping upload of files.');
        }
    }
    return result;
}

/**
 * Task for adding a visual test result as a comment to a PR.
 * It also updates the status for the commit with github.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function commentOnPR() {
    const {
        pr,
        user,
        alwaysAdd = false,
        token
    } = argv;

    // if (!token && !process.env.GITHUB_TOKEN) {
    //     return completeTask('No --token or GITHUB_TOKEN env var specified for github access.');
    // }
    //
    if (!pr || !user) {
        return completeTask('No --pr (pull request number) specified, or missing --user (github username)');
    }
    const prNumber = parseInt(pr, 10);
    const uploaded = await uploadVisualTestFiles(prNumber);

    const commentTemplate = createPRCommentBody(uploaded);
    const { containsText = DEFAULT_COMMENT_TITLE } = argv;

    const existingComments = await fetchPRComments(pr, user, containsText);

    try {
        if (!alwaysAdd && existingComments.length > 0) {
            logLib.message(`Updating existing comment for #${pr}`);
            return await updatePRComment(existingComments[0].id, commentTemplate);
        }
        logLib.message(`Creating new comment for #${pr}`);
        return await createPRComment(pr, commentTemplate);
    } catch (err) {
        return completeTask(err || err.message);
    }
}

commentOnPR.description = 'Updates/creates reviews for pr and comments any diffs from test/visual-test-results.json';
commentOnPR.flags = {
    '--pr': 'Pull request number',
    '--user': 'Github user',
    '--token': 'Github token (can also be specified with GITHUB_TOKEN env var)',
    '--contains-text': 'Filter text used to find PR comment to overwrite',
    '--always-add': 'If present any old test results comment won\'t be overwritten',
    '--fail-silently': 'Will always return exitCode 0 (success)',
    '--dryrun': 'Just runs through the task for testing purposes without doing external requests. ',
    '--profile': 'AWS profile to load from AWS credentials file. If no profile is provided the default profile or ' +
        'standard AWS environment variables for credentials will be used. (optional)'
};

gulp.task('update-pr-testresults-cypress', commentOnPR);
