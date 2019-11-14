/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const logLib = require('./lib/log');
const argv = require('yargs').argv;
const { getFilesChanged } = require('./lib/git');
const { uploadFiles } = require('./lib/uploadS3');

const DEFAULT_PR_ASSET_S3_BASEPATH = 'visualtests/diffs/pullrequests';
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

const VISUAL_TESTS_BUCKET = process.env.HIGHCHARTS_VISUAL_TESTS_BUCKET || 'staging-vis-dev.highcharts.com';

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
 * Takes a git file change status character and returns
 * a human readable string.
 * @param {string} changeCharacter from git command output
 * @return {string} a human readable status string.
 */
function resolveGitFileStatus(changeCharacter) {
    switch (changeCharacter) {
        case 'M': return 'Modified';
        case 'A': return 'Added';
        case 'D': return 'Deleted';
        case 'R': return 'Renamed';
        case 'C': return 'Copied';
        case 'U': return 'Unmerged';
        case 'T': return 'Changed file type';
        case 'X': return 'Unknown';
        default: return '?';
    }
}

/**
 * Retrieves changes from samples/ folder and returns a markdown
 * template that lists the changed files (compared with master).
 * @return {string} markdown template with the changed files.
 */
function createTemplateForChangeSamples() {
    let gitChangedFiles = getFilesChanged();
    logLib.message(`Changed files:\n${gitChangedFiles}`);
    gitChangedFiles = gitChangedFiles.split('\n').filter(line => line && /samples\/(highcharts|maps|stock|gantt).*demo.js$/.test(line));
    let samplesChangedTemplate = '';
    if (gitChangedFiles && gitChangedFiles.length > 0) {
        samplesChangedTemplate = '<details>\n<summary>Samples changed</summary><p>\n\n| Change type | Sample |\n| --- | --- |\n' +
            gitChangedFiles.map(line => {
                const parts = line.split('\t');
                return `|  ${resolveGitFileStatus(parts[0])} | ${parts[1]} |`;
            }).join('\n');
        samplesChangedTemplate += '\n\n</p>\n</details>\n';
    }
    return samplesChangedTemplate;
}


/* eslint-disable require-jsdoc */
function buildImgS3Path(filename, sample, pr) {
    return `${DEFAULT_PR_ASSET_S3_BASEPATH}/${pr}/${sample}/${filename}`;
}

function buildImgURL(filename, sample, pr) {
    return `http://${VISUAL_TESTS_BUCKET}.s3.eu-central-1.amazonaws.com/${buildImgS3Path(filename, sample, pr)}`;
}

function buildImgMarkdownLinks(sample, pr) {
    return `[diff](${buildImgURL('diff.gif', sample, pr)}) &#124; [reference](${buildImgURL('reference.svg', sample, pr)}) &#124; [candidate](${buildImgURL('candidate.svg', sample, pr)})`;
}

/* eslint-enable require-jsdoc */

/**
 * Based on a list of diffing samples (that contain visual test differences compared to a baseline/reference)
 * this function uploads the reference/candidate/diff images + JSON report that are produced
 * from a visual test run to S3 in order to make them easily available.
 * @param {Array} diffingSamples list
 * @param {string} pr number to upload for
 * @return {undefined} void
 */
function uploadVisualTestDiffImages(diffingSamples = [], pr) {
    if (diffingSamples.length > 0) {
        const files = diffingSamples.reduce((resultingFiles, sample) => {
            resultingFiles.push({
                from: `samples/${sample[0]}/reference.svg`,
                to: buildImgS3Path('reference.svg', sample[0], pr)
            });
            resultingFiles.push({
                from: `samples/${sample[0]}/candidate.svg`,
                to: buildImgS3Path('candidate.svg', sample[0], pr)
            });
            resultingFiles.push({
                from: `samples/${sample[0]}/diff.gif`,
                to: buildImgS3Path('diff.gif', sample[0], pr)
            });
            return resultingFiles;
        }, []);

        files.push({
            from: 'test/visual-test-results.json',
            to: `${DEFAULT_PR_ASSET_S3_BASEPATH}/${pr}/visual-test-results.json`
        });

        uploadFiles({ files, bucket: VISUAL_TESTS_BUCKET, name: `image diff on PR #${pr}` })
            .catch(err => logLib.warn('Failed to upload PR diff images. Reason ' + err));
    }
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

    const diffs = Object.entries(testResults).filter(entry => {
        const value = entry[1];
        return typeof value === 'number' && value > 0;
    });

    uploadVisualTestDiffImages(diffs, pr);

    let commentTemplate = diffs.length === 0 ?
        `${DEFAULT_COMMENT_MATCH} - No difference found` :
        `${DEFAULT_COMMENT_MATCH} - diffs found\n| Test name | Pixels diff | Images |\n| --- | --- | --- |\n` +
            `${diffs.map(diff => '| `' + diff[0] + '` | ' + diff[1] + ' | ' + buildImgMarkdownLinks(diff[0], pr) + ' |').join('\n')}\n`;

    const changedSamplesTemplate = createTemplateForChangeSamples();
    commentTemplate += `\n\n${changedSamplesTemplate}`;

    const { containsText = DEFAULT_COMMENT_MATCH } = argv;
    const existingComments = await fetchPRComments(pr, user, containsText);

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
    '--token': 'Github token (can also be specified with GITHUB_TOKEN env var)',
    '--contains-text': 'Filter text used to find PR comment to overwrite',
    '--always-add': 'If present any old test results comment won\'t be deleted',
    '--fail-silently': 'Will always return exitCode 0 (success)'
};

gulp.task('update-pr-testresults', commentOnPR);
