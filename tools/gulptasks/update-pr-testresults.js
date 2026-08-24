/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');
const fs = require('fs');
const logLib = require('../libs/log');
const argv = require('yargs').argv;
const highchartsVersion = require('../../package').version;
const { getFilesChanged, getLatestCommitShaSync } = require('../libs/git');
const {
    normalizeApiUrl,
    submitPullRequestVisualReview
} = require('./lib/visualReviewApi');

const DEFAULT_COMMENT_TITLE = 'Visual test results';

function getVisualReviewApiUrl() {
    return argv.visualReviewApiUrl || process.env.VISUAL_REVIEW_API_URL;
}

/**
 * Reads a JSON file from the specified filePath.
 *
 * @param {string} filePath File path.
 * @return {boolean|any} Parsed JSON file, or false if not found.
 */
function readTestResultsFile(filePath) {
    try {
        const json = fs.readFileSync(filePath);
        return JSON.parse(json);
    } catch (err) {
        logLib.warn(`Failed to read file ${filePath}: ${err}`);
    }
    return false;
}

function completeTask(message) {
    const errorMessage = message instanceof Error ? message.message : message;
    if (!argv.failSilently) {
        return Promise.reject(new Error(errorMessage));
    }
    logLib.warn('Forcing success, but error occurred: ' + errorMessage);
    return Promise.resolve(errorMessage);
}

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

function createMarkdownLink(link, message = 'link') {
    return `[${message}](${link})`;
}

/**
 * Retrieves changes from samples/ and returns a markdown template listing the
 * changed files.
 *
 * @return {string} Markdown template.
 */
function createTemplateForChangedSamples() {
    const gitChangedFiles = getFilesChanged();
    logLib.message(`Changed files:\n${gitChangedFiles}`);

    const changedPaths = new Set(
        gitChangedFiles.split('\n')
            .filter(line => line && /samples\/(highcharts|maps|stock|gantt).*demo\.js$/u.test(line))
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

function createPRCommentBody(diffingSamples, prNumber) {
    const reviewUrl = `${normalizeApiUrl(getVisualReviewApiUrl())}/pr/${prNumber}/review`;
    let commentTemplate = `${DEFAULT_COMMENT_TITLE} - No difference found`;
    if (diffingSamples.length > 0) {
        commentTemplate = `${DEFAULT_COMMENT_TITLE} - Differences found\n` +
            `Found **${diffingSamples.length}** diffing sample(s). ${createMarkdownLink(
                reviewUrl,
                'Please review the differences.'
            )}\n`;
    }
    const changedSamplesTemplate = createTemplateForChangedSamples();
    commentTemplate += `\n\n${changedSamplesTemplate}`;

    return commentTemplate;
}

function createSubmissionSamples(testResults) {
    return Object.entries(testResults)
        .filter(([, value]) => typeof value === 'number' && value > 0)
        .map(([name, comparisonValue]) => ({
            name,
            comparisonValue
        }));
}

function hasVisualTestErrors(errorPath = 'test/visual-test-errors.log') {
    try {
        return fs.statSync(errorPath).size > 0;
    } catch {
        return false;
    }
}

function getPullRequestSha() {
    return process.env.VISUAL_REVIEW_PR_SHA ||
        process.env.GITHUB_SHA ||
        getLatestCommitShaSync();
}

function getSubmissionOptions(testResults, prNumber) {
    const runId = process.env.GITHUB_RUN_ID || String(Date.now());
    const runNumber = process.env.GITHUB_RUN_NUMBER || runId;
    return {
        apiKey: argv.visualReviewApiKey || process.env.VISUAL_REVIEW_API_KEY,
        apiUrl: getVisualReviewApiUrl(),
        prNumber,
        prSha: getPullRequestSha(),
        productVersion: highchartsVersion,
        runAttempt: process.env.GITHUB_RUN_ATTEMPT || '1',
        runId,
        runNumber,
        samples: createSubmissionSamples(testResults),
        testReport: testResults
    };
}

async function submitReview(testResults, prNumber) {
    if (argv.dryrun) {
        logLib.message('Dryrun (skipping visual review API submission)..');
        return true;
    }
    if (hasVisualTestErrors()) {
        logLib.warn('Visual test errors found; skipping visual review API finalization.');
        return false;
    }

    const result = await submitPullRequestVisualReview(getSubmissionOptions(testResults, prNumber));
    logLib.message(`Visual review submission ${result.submissionId} finalized.`);
    return true;
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
}

/**
 * Publishes PR visual results through the Visual Review API and writes the PR
 * comment payload. Configure the service with VISUAL_REVIEW_API_URL and
 * VISUAL_REVIEW_API_KEY. The URL defaults to https://vrevs.highsoft.com.
 *
 * @return {Promise<*>} Promise to keep.
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
        return completeTask(`Unable to read file ${resultsPath}`);
    }

    const diffingSamples = createSubmissionSamples(testResults);
    try {
        const reviewSubmitted = await submitReview(testResults, prNumber);
        if (reviewSubmitted === false) {
            return false;
        }
        return writeCommentFile(createPRCommentBody(diffingSamples, prNumber));
    } catch (err) {
        if (!argv.failSilently) {
            throw err;
        }
        logLib.warn(`Visual review submission failed: ${err.message}`);
        return false;
    }
}

commentOnPR.description = 'Publishes PR visual results through the Visual Review API and comments diffs.';
commentOnPR.flags = {
    '--pr': 'Pull request number',
    '--fail-silently': 'Will always return exitCode 0 (success)',
    '--dryrun': 'Skips the Visual Review API submission.',
    '--results-path': 'Path to the visual test results JSON file.',
    '--visual-review-api-url': 'Use VISUAL_REVIEW_API_URL to select the service origin. Defaults to https://vrevs.highsoft.com.',
    '--visual-review-api-key': 'Use VISUAL_REVIEW_API_KEY to authenticate with the ingestion API.'
};

gulp.task('update-pr-testresults', commentOnPR);

module.exports = {
    createSubmissionSamples,
    default: commentOnPR,
    hasVisualTestErrors,
    writeCommentFile
};
