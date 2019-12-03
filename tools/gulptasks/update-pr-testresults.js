/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const logLib = require('./lib/log');
const argv = require('yargs').argv;
const highchartsVersion = require('../../package').version;
const { getFilesChanged } = require('./lib/git');
const { uploadFiles, getS3Object, putS3Object } = require('./lib/uploadS3');

const S3_PULLREQUEST_PATH = 'visualtests/diffs/pullrequests';
const S3_REVIEWS_PATH = 'visualtests/reviews';
const DEFAULT_COMMENT_TITLE = '## Visual test results';
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
    if (argv.dryrun) {
        return Promise.resolve('Dryrun (skipping fetch of PR comments)..');
    }
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
    if (argv.dryrun) {
        logLib.message('Dryrun (skipping update of PR comment): ', newComment);
        // eslint-disable-next-line camelcase
        return Promise.resolve({ html_url: 'No where' });
    }

    logLib.message('Updating existing comment with id ' + commentId);
    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/comments/${commentId}`,
            method: 'PATCH',
            body: { body: newComment }
        })
            .then(response => {
                logLib.message(`Comment updated at ${response.html_url}`);

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
    if (argv.dryrun) {
        logLib.message('(Dryrun) Skipping creation of pr comment: ', comment);
        // eslint-disable-next-line camelcase
        return Promise.resolve({ html_url: 'No where' });
    }

    return new Promise((resolve, reject) => {
        doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/issues/${pr}/comments`,
            method: 'POST',
            body: { body: comment }
        })
            .then(result => {
                logLib.message(`Comment created at ${result.html_url}`);
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
function createTemplateForChangedSamples() {
    let gitChangedFiles = getFilesChanged();
    logLib.message(`Changed files:\n${gitChangedFiles}`);
    gitChangedFiles = gitChangedFiles.split('\n').filter(line => line && /samples\/(highcharts|maps|stock|gantt).*demo.js$/.test(line));
    let samplesChangedTemplate = '';
    if (gitChangedFiles && gitChangedFiles.length > 0) {
        samplesChangedTemplate = '---\n<details>\n<summary>Samples changed</summary><p>\n\n| Change type | Sample |\n| --- | --- |\n' +
            gitChangedFiles.map(line => {
                const parts = line.split('\t');
                return `|  ${resolveGitFileStatus(parts[0])} | ${parts[1]} |`;
            }).join('\n');
        samplesChangedTemplate += '\n\n</p>\n</details>\n';
    }
    return samplesChangedTemplate;
}


/* eslint-disable require-jsdoc,valid-jsdoc */
function buildImgS3Path(filename, sample, pr) {
    return `${S3_PULLREQUEST_PATH}/${pr}/${sample}/${filename}`;
}

function createMarkdownLink(link, message = 'link') {
    return `[${message}](${link})`;
}

/**
 * Fetches an existing review file for a PR. Example of this is when CI already has created an
 * review file in a previous build.
 *
 * @param {string} pr to approve
 * @return {Promise<*>} with the result or undefined if none found.
 */
async function fetchExistingReview(pr) {
    let existingReview;
    try {
        // if we have and existing review we want to keep certains parts of it.
        existingReview = await JSON.parse(await getS3Object(VISUAL_TESTS_BUCKET, `${S3_PULLREQUEST_PATH}/${pr}/review-pr-${pr}.json`));
        logLib.message('Found existing review for pr: ' + existingReview.meta.pr);
    } catch (err) {
        logLib.message('No existing review found or error occured: ' + err);
    }
    return existingReview;
}

async function fetchAllReviewsForVersion(version) {
    let alLReviews;
    try {
        // if we have and existing review we want to keep certains parts of it.
        alLReviews = await JSON.parse(await getS3Object(VISUAL_TESTS_BUCKET, `${S3_REVIEWS_PATH}/all-reviews-${version}.json`));
    } catch (err) {
        logLib.message(`Couldn't fetch all reviews for version ${version}` + err);
    }
    return alLReviews;
}

/**
 * Checks if the approved reviews contains a match for a sample
 * for the given pull request (pr). I.e if a review has been approved
 * and then the pr changes so that the sample no longer is diffing we
 * need to remove the approval.
 *
 * @return {Promise<void>}
 */
async function checkAndUpdateApprovedReviews(diffingSampleEntries, pr) {
    const allReviews = await fetchAllReviewsForVersion(highchartsVersion);
    if (allReviews && allReviews.samples) {
        const approvedSamplesToRemove = Object.keys(allReviews.samples).filter(sampleName => (
            // only keep approvals for this pr that are still having a diff > 0 in the test results.
            allReviews.samples[sampleName].some(s => s.pr === pr && !diffingSampleEntries.some(e => e[0] === sampleName))
        ));

        approvedSamplesToRemove.forEach(s => {
            logLib.message(`Removing previously approved sample ${s} for current pr #${pr} as it is no longer different.`);
            allReviews.samples[s] = allReviews.samples[s].filter(approvedSample => approvedSample.pr !== pr);
        });

        if (approvedSamplesToRemove && approvedSamplesToRemove.length && !argv.dryrun) {
            const key = `${S3_REVIEWS_PATH}/all-reviews-${highchartsVersion}.json`;
            return putS3Object(key, allReviews, { Bucket: VISUAL_TESTS_BUCKET });
        }
    }
    return Promise.resolve();
}

/**
 * Creates and saves a review file for a PR in order to be used by
 * the visual review tool application.
 */
async function createPRReviewFile(testResults, pr) {
    const samplesWithDiffs = Object.entries(testResults).filter(
        entry => entry[0] !== 'meta' && !isNaN(entry[1]) && entry[1] > 0
    ) || [];

    let existingApprovedSamples = [];
    const existingReview = await fetchExistingReview(pr);
    if (existingReview && existingReview.samples) {
        // this is not first run, so get which samples are already approved
        existingApprovedSamples = existingReview.samples.filter(sample => sample.approved);
    }

    const samples = samplesWithDiffs.map(([key, value]) => {
        const alreadyApprovedSample = existingApprovedSamples.find(s => s.name === key && s.diff === value);
        return alreadyApprovedSample || {
            name: key,
            comment: '',
            diff: value
        };
    }) || [];

    const review = {
        meta: {
            ...testResults.meta,
            pr
        },
        samples
    };

    fs.writeFileSync(`test/review-pr-${pr}.json`, JSON.stringify(review, null, ' '));
    return review;
}

/* eslint-enable require-jsdoc,valid-jsdoc */

/**
 * Based on a list of diffing samples (that contain visual test differences compared to a baseline/reference)
 * this function uploads the reference/candidate/diff images + JSON report + review file that are produced
 * from a visual test run to S3 in order to make them easily available.
 * @param {Array} diffingSamples list
 * @param {string} pr number to upload for
 * @param {boolean} includeReview file
 * @return {undefined} void
 */
function uploadVisualTestFiles(diffingSamples = [], pr, includeReview = true) {
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
            to: `${S3_PULLREQUEST_PATH}/${pr}/visual-test-results.json`
        });

        if (includeReview) {
            const reviewFilename = `review-pr-${pr}.json`;
            files.push({
                from: `test/${reviewFilename}`,
                to: `${S3_PULLREQUEST_PATH}/${pr}/${reviewFilename}`
            });
        }

        if (!argv.dryrun) {
            uploadFiles({ files, bucket: VISUAL_TESTS_BUCKET, name: `image diff on PR #${pr}` })
                .catch(err => logLib.warn('Failed to upload PR diff images. Reason ' + err));
        }
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
    const prNumber = parseInt(pr, 10);
    const testResults = readTestResultsFile(resultsPath);
    if (!testResults) {
        const errMsg = `Unable to read file ${resultsPath}`;
        logLib.warn(errMsg);
        return completeTask(errMsg);
    }

    const diffingSamples = Object.entries(testResults).filter(entry => {
        const value = entry[1];
        return typeof value === 'number' && value > 0;
    });

    const newReview = await createPRReviewFile(testResults, prNumber);
    uploadVisualTestFiles(diffingSamples, prNumber, newReview.samples.length > 0);
    checkAndUpdateApprovedReviews(diffingSamples, prNumber);

    let commentTemplate = diffingSamples.length === 0 ?
        `${DEFAULT_COMMENT_TITLE} - No difference found` :
        `${DEFAULT_COMMENT_TITLE} - Differences found\n` +
            `Found **${newReview.samples.length}** diffing sample(s). ${createMarkdownLink(
                'https://vrevs.highsoft.com/pr/' + prNumber + '/review',
                'Please review the differences.'
            )}\n`;

    const changedSamplesTemplate = createTemplateForChangedSamples();
    commentTemplate += `\n\n${changedSamplesTemplate}`;

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
    '--dryrun': 'Just runs through the task for testing purposes without doing external requests. '
};

gulp.task('update-pr-testresults', commentOnPR);
