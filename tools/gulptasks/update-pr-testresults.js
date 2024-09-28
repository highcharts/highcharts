/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('fs');
const logLib = require('../libs/log');
const argv = require('yargs').argv;
const highchartsVersion = require('../../package').version;
const { getFilesChanged, getLatestCommitShaSync } = require('../libs/git');
const { uploadFiles, putS3Object } = require('./lib/uploadS3');
const { doRequest } = require('./lib/github');

const S3_PULLREQUEST_PATH = 'visualtests/diffs/pullrequests';
const S3_REVIEWS_PATH = 'visualtests/reviews';
const DEFAULT_COMMENT_TITLE = 'Visual test results';
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
 * Updates the status of the commit on github with the provided status in order to display it in pr.
 *
 * @param {string|number} pr that the commit is for
 * @param {object} newReview containing diffing samples and already approved samples.
 * @return {object} response from github or undefined;
 */
async function postGitCommitStatusUpdate(pr, newReview) {
    let response;
    if (argv.dryrun) {
        logLib.message('Dryrun (skipping github status update)..');
        return response;
    }

    const commitSha = getLatestCommitShaSync();
    let commitState = 'failure'; // https://docs.github.com/en/rest/reference/repos#statuses
    let description = 'Review of changed samples needed. Click on details.';

    if (newReview.samples.length === 0) {
        description = 'No diffing samples found.';
        commitState = 'success';
        logLib.message('No diffing samples found.');
    } else {
        if (newReview.samples.every(sample => sample.approved)) {
            // on every subsequent run we don't need to re-approve same samples.
            description = 'Diffing samples are approved';
            commitState = 'success';
        }
        logLib.message('All samples are already approved.');
    }

    try {
        response = await doRequest({
            ...DEFAULT_OPTIONS,
            url: `https://api.github.com/repos/highcharts/highcharts/statuses/${commitSha}`,
            method: 'POST',
            body: {
                owner: 'highcharts',
                repo: 'highcharts',
                sha: commitSha,
                state: commitState,
                // eslint-disable-next-line camelcase
                target_url: `https://vrevs.highsoft.com/pr/${pr}/review`,
                description,
                context: 'Highcharts review tool'
            }
        });
        logLib.message(`Github status for ${commitSha} created with ${commitState}`);
    } catch (error) {
        // catch error as we dont wan't to terminate the gulp task if given failure of status update.
        logLib.warn(`Failed to create github status for sha ${commitSha}: ${error.message}`);
    }
    return response;
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

/* eslint-disable require-jsdoc,valid-jsdoc */
function buildImgS3Path(filename, sample, pr) {
    return `${S3_PULLREQUEST_PATH}/${pr}/${sample}/${filename}`;
}

function createMarkdownLink(link, message = 'link') {
    return `[${message}](${link})`;
}

/**
 * Retrieves changes from samples/ folder and returns a markdown
 * template that lists the changed files (compared with master).
 * @return {string} markdown template with the changed files.
 */
function createTemplateForChangedSamples() {
    const gitChangedFiles = getFilesChanged();
    logLib.message(`Changed files:\n${gitChangedFiles}`);

    const changedPaths = new Set(
        gitChangedFiles.split('\n')
            .filter(line => line && /samples\/(highcharts|maps|stock|gantt).*demo.js$/u.test(line))
    );

    let samplesChangedTemplate = '';
    if (gitChangedFiles && gitChangedFiles.length > 0) {
        samplesChangedTemplate = '---\n<details>\n<summary>Samples changed</summary><p>\n\n| Change type | Sample |\n| --- | --- |\n' +
            Array.from(changedPaths).map(line => {
                const parts = line.split('\t');
                return `|  ${resolveGitFileStatus(parts[0])} | ${parts[1]} |`;
            }).join('\n');
        samplesChangedTemplate += '\n\n</p>\n</details>\n';
    }
    return samplesChangedTemplate;
}

function createPRCommentBody(newReview, prNumber) {
    let commentTemplate = `${DEFAULT_COMMENT_TITLE} - No difference found`;
    if (newReview.samples.length > 0) {
        if (newReview.samples.every(sample => sample.approved)) {
            commentTemplate = `${DEFAULT_COMMENT_TITLE} - All diffing samples already approved`;
        } else {
            commentTemplate = `${DEFAULT_COMMENT_TITLE} - Differences found\n` +
                `Found **${newReview.samples.length}** diffing sample(s). ${createMarkdownLink(
                    'https://vrevs.highsoft.com/pr/' + prNumber + '/review',
                    'Please review the differences.'
                )}\n`;
        }
    }
    const changedSamplesTemplate = createTemplateForChangedSamples();
    commentTemplate += `\n\n${changedSamplesTemplate}`;

    return commentTemplate;
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
        const request = new Request(
            `https://vrevs.highsoft.com/api/assets/visualtests/diffs/pullrequests/${pr}/visual-test-results.json`
        );

        const response = await fetch(request);

        if (response.ok && response.status === 200) {
            existingReview = await response.json();
        }
        // if we have and existing review we want to keep certains parts of it.
        logLib.message('Found existing review for pr: ' + pr);
    } catch (err) {
        logLib.message('No existing review found or error occured: ' + err);
    }

    return existingReview;
}

async function fetchReviewFile(pr) {
    try {
        const response = await fetch(
            `https://vrevs.highsoft.com/api/assets/visualtests/diffs/pullrequests/${pr}/review-pr-${pr}.json`
        );

        if (response && response.ok) {
            return await response.json();
        }
    } catch (error) {
        logLib.message(error);
    }

    return null;
}

async function fetchAllReviewsForVersion(version) {
    let allReviews;
    try {
        const request = new Request(
            `https://vrevs.highsoft.com/api/assets/visualtests/reviews/all-reviews-${version}.json`
        );

        const response = await fetch(request);

        if (response.ok && response.status === 200) {
            allReviews = await response.json();
        }
    } catch (err) {
        logLib.message(`Couldn't fetch all reviews for version ${version}` + err);
    }

    return allReviews;
}

/**
 * Checks if the approved reviews contains a match for a sample
 * for the given pull request (pr). I.e if a review has been approved
 * and then the pr changes so that the sample no longer is diffing we
 * need to remove the approval.
 *
 * @param {*} diffingSampleEntries Diffing samples
 * @param {number} pr PR number
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
            return putS3Object(
                key,
                allReviews,
                {
                    Bucket: VISUAL_TESTS_BUCKET,
                    ACL: void 0
                }
            );
        }
    }
    return Promise.resolve(allReviews);
}

/**
 * Creates and saves a review file for a PR in order to be used by
 * the visual review tool application. It will check for an existing
 * review for the given pr an merge any already approved samples given
 * that the diffing value is the same.
 * @param {*} testResults test results JSON
 * @param {number} pr PR number
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
        if (alreadyApprovedSample) {
            logLib.message(`${alreadyApprovedSample.name} has already been approved for the diffing value` +
                alreadyApprovedSample.diff);
        }
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
 * @param {number} pr number to upload for
 * @param {boolean} includeReview file
 * @return {object|undefined} result of upload or undefined
 */
async function uploadVisualTestFiles(
    diffingSamples,
    pr,
    includeReview = true
) {
    let result;
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
        try {
            result = await uploadFiles({
                files,
                bucket: VISUAL_TESTS_BUCKET,
                profile: argv.profile,
                name: `image diff on PR #${pr}`,
                s3Params: {
                    ACL: void 0 // use bucket permissions
                }
            });
        } catch (err) {
            logLib.failure('One or more files were not uploaded. Continuing to let task finish gracefully. ' +
                'Original error: ' + err.message);
        }

    } else {
        logLib.message('Dry run - Skipping upload of files.');
    }
    return result;
}


async function writeCommentFile(content) {
    const { writeFile, mkdir } = require('node:fs/promises');
    const { join } = require('node:path');

    await mkdir('tmp', { recursive: true });

    const JSONFilePath = join('tmp', 'pr-visual-test-comment.json');

    const [title, ...body] = content.split('\n');

    await writeFile(JSONFilePath, JSON.stringify({
        title,
        body: body.join('\n')
    }));

    logLib.message('Wrote file to', JSONFilePath);
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
        resultsPath = 'test/visual-test-results.json'
    } = argv;
    if (!pr) {
        return completeTask('No --pr (pull request number) specified');
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

    let shouldSaveReview = newReview.samples.length > 0;
    if (!shouldSaveReview) {
        const existingReview = await fetchReviewFile(prNumber);
        shouldSaveReview = !!(existingReview && existingReview.samples?.length);
    }

    await uploadVisualTestFiles(
        diffingSamples,
        prNumber,
        shouldSaveReview
    );

    await checkAndUpdateApprovedReviews(diffingSamples, prNumber);
    await postGitCommitStatusUpdate(pr, newReview);

    try {
        const commentTemplate = createPRCommentBody(newReview, prNumber);
        return writeCommentFile(commentTemplate);
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

gulp.task('update-pr-testresults', commentOnPR);

module.exports = {
    default: commentOnPR,
    fetchExistingReview,
    fetchAllReviewsForVersion,
    writeCommentFile
};
