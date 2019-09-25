/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const logLib = require('./lib/log');
const argv = require('yargs').argv;

const DEFAULT_COMMENT_MATCH = '## Visual test results';
const DEFAULT_OPTIONS = {
    method: 'GET',
    json: true,
    headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${process.env.GITHUB_TOKEN || argv.token}`,
        'User-Agent': 'Highcharts PR Commenter'
    }
};

/**
 * Executes a request with the specified options
 *
 * @param {any} options to add (see node request module)
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
function doRequest(options = {}) {
    logLib.message(options.method + ' request to ' + options.url);
    return new Promise((resolve, reject) => {
        request(options, (error, response, data) => {
            if (error || response.statusCode >= 400) {
                reject(error ? error : `HTTP ${response.statusCode} - ${data.message}`);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Fetches the pull request comments and filters them by user and filter text.
 *
 * @param {number} pr to fetch comments for
 * @param {string} user to filter on
 * @param {string} filterText to filter on
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function fetchPRComments(pr, user, filterText) {
    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/${pr}/comments`
        }).then(response => {
            let comments = [];
            if (response.length > 0) {
                comments =
                    response.filter(
                        comment => comment.user.login === user && comment.body && comment.body.includes(filterText)
                    );
            }
            resolve(comments);
        })
            .catch(err => {
                reject(new Error(`Failed to fetch comments for PR #${pr}.: ` + err));
            });
    });
}

/**
 * Updates an existing Github comment
 *
 * @param {number} commentId to update
 * @param {string} newComment to overwrite existing one
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function updatePRComment(commentId, newComment) {
    logLib.message('Updating existing comment with id ' + commentId);
    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/comments/${commentId}`,
            method: 'PATCH',
            body: { body: newComment }
        })
            .then(response => {
                logLib.message('Successfully updated comment with id ' + commentId);
                resolve(response);
            })
            .catch(err => {
                logLib.warn('Failed to update existing PR comment: ' + err);
                reject(err);
            });
    });
}

/**
 * Creates a Github PR comment
 * @param {number} pr number
 * @param {string} comment to post
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function createPRComment(pr, comment) {
    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/${pr}/comments`,
            method: 'POST',
            body: { body: comment }
        })
            .then(result => {
                logLib.success(`Created comment on PR #${pr}`);
                resolve(result);
            })
            .catch(err => {
                const failureMsg = 'Failed to create PR comment: ' + err;
                logLib.warn(failureMsg);
                if (argv.failSilently) {
                    resolve(failureMsg);
                }
                reject(new Error(failureMsg));
            });
    });
}

/**
 * Reads a json file from the specified filePath.
 *
 * @param {string} filePath path to JSON file.
 * @return {boolean|any} parsed JSON file, or false if not found.
 */
function readTestResultsFile(filePath) {
    try {
        const json = fs.readFileSync(filePath);
        return JSON.parse(json);
    } catch (err) {
        // swallow and log error
        logLib.warn(`Failed to read file ${filePath}: ${err}`);
    }
    return false;
}

// eslint-disable-next-line no-unused-vars,require-jsdoc
function completeTask(message) {
    if (!argv.failSilently) {
        return Promise.reject(new Error(message));
    }
    logLib.warn('Forcing success, but error occured: ' + message);
    return Promise.resolve(message);
}

/**
 * Task for adding a visual test result as a comment to a PR.
 *
 * @return {Promise<*> | Promise | Promise} Promise to keep
 */
async function commentOnPR() {
    const {
        pr,
        user,
        alwaysAdd = false,
        resultsPath = 'test/visual-test-results.json',
        token
    } = argv;

    if (!token && !process.env.GITHUB_TOKEN) {
        return completeTask('No --token or GITHUB_TOKEN env var specified for github access.');
    }

    if (!pr || !user) {
        return completeTask('No --pr (pull request number) specified, or missing --user (github username)');
    }

    const testResults = readTestResultsFile(resultsPath);
    if (!testResults) {
        const errMsg = `Unable to read file ${resultsPath}`;
        logLib.warn(errMsg);
        return completeTask(errMsg);
    }

    const { containsText = DEFAULT_COMMENT_MATCH } = argv;
    const existingComments = await fetchPRComments(pr, user, containsText);


    const diffs = Object.entries(testResults).filter(entry => {
        const value = entry[1];
        return typeof value === 'number' && value > 0;
    });

    const commentTemplate = diffs.length === 0 ?
        `${DEFAULT_COMMENT_MATCH} - No difference found` :
        `${DEFAULT_COMMENT_MATCH} - diffs found\n| Test name | Pixels diff |\n| --- | --- |\n${diffs.map(diff => '| `' + diff[0] + '` | ' + diff[1] + ' |').join('\n')}`;

    try {
        let result;

        if (!alwaysAdd && existingComments.length > 0) {
            logLib.message(`Updating existing comment for #${pr}`);
            result = await updatePRComment(existingComments[0].id, commentTemplate);
            logLib.message(`Comment updated at ${result.html_url}`);
        } else {
            logLib.message(`Creating new comment for #${pr}`);
            result = await createPRComment(pr, commentTemplate);
            logLib.message(`Comment created at ${result.html_url}`);
        }
        return Promise.resolve(result);
    } catch (err) {
        return completeTask(err || err.message);
    }
}

commentOnPR.description = 'Comments any diff from test/visual-test-results.json';
commentOnPR.flags = {
    '--pr': 'Pull request number',
    '--user': 'Github user',
    '--contains-text': 'Filter text used to find PR comment to overwrite',
    '--always-add': 'If present any old test results comment won\'t be deleted',
    '--fail-silently': 'Will always return exitCode 0 (success)'
};

gulp.task('update-pr-testresults', commentOnPR);
