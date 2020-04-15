const mkdirp = require('mkdirp');
const { join } = require('path');
const argv = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const { getFileSizes } = require('../compareFilesize');
const log = require('./lib/log');
const { createPRComment, updatePRComment, fetchPRComments } = require('./lib/github');

const files = argv.files ? argv.files.split(',') : ['highcharts.src.js', 'highstock.src.js', 'highmaps.src.js', 'highcharts-gantt.src.js'];

/**
 * @param {string} outputFolder output path
 * @param {string} outputFileName output path
 * @return {promise} Writes file size as json doc
 */
async function writeFileSize(outputFolder, outputFileName) {
    try {
        await mkdirp(outputFolder);
        await getFileSizes(files, join(outputFolder, outputFileName)).catch(err => log.failure(err));
        log.success(`Wrote to ${join(outputFolder, outputFileName)}`);
    } catch (error) {
        log.failure(error);
    }
}

/**
 * Makes a markdown table that compares two sets of filesizes
 * @param {string} master file sizes before changes
 * @param {string} proposed file sizes with changes
 * @return {string} Markdown table
 */
function makeTable(master, proposed) {
    let table = '### File size comparison table' +
        '\n| | master | candidate | difference |' +
        '\n|-------------|-------------:|-------------:|-------------:|';

    try {
        const masterSizes = JSON.parse(fs.readFileSync(master));
        const proposedSizes = JSON.parse(fs.readFileSync(proposed));

        Object.keys(masterSizes).forEach(key => {
            const package = key.replace('.src.js', '');

            // eslint-disable-next-line require-jsdoc
            function toFixedKiloBytes(bytes) {
                if (typeof bytes === 'number') {
                    return (bytes / 1024).toFixed(1);
                }
                return NaN;
            }

            if (masterSizes[key] && proposedSizes[key]) {
                table += `\n| ${package} | ${toFixedKiloBytes(masterSizes[key].compiled)} kB | ${toFixedKiloBytes(proposedSizes[key].compiled)} kB | ` +
                    `${proposedSizes[key].compiled - masterSizes[key].compiled} B |`;
                table += `\n| ${package}, gzipped | ${toFixedKiloBytes(masterSizes[key].gzip)} kB | ${toFixedKiloBytes(proposedSizes[key].gzip)} kB | ` +
                    `${proposedSizes[key].gzip - masterSizes[key].gzip} B|`;
            }
        });

        return table;

    } catch (error) {
        log.failure(error);
        return null;
    }
}

/**
 * Task that writes filesizes to ./tmp/filesizes/
 * @return {void}
 */
async function writeFileSizes() {
    const filename = argv.filename || 'master.json';
    await writeFileSize('./tmp/filesizes/', filename);
}

/**
 * Task that writes a markdown table that compares filesizes
 * of master and PR
 * @return {void}
 */
async function writeTable() {
    try {
        const { master, proposed } = argv;
        if (master && proposed) {
            fs.writeFileSync('./tmp/filesizes/comparison.md', makeTable(master, proposed));
        } else {
            log.failure('Please provide all required arguments');
        }
    } catch (error) {
        log.failure(error);
    }
}

/**
 * Adds or updates a comment to a pull request containing
 * a file comparison table. Pull request id is specified with `--pr <id>`.
 * Updates are limited to the user specified with `--user <username>`
 * @return {void}
 */
async function comment() {
    try {
        const { pr, user } = argv;
        if (pr) {
            const existingComment = await fetchPRComments(pr, user || '', '### File size comparison table');
            const commentBody = fs.readFileSync('./tmp/filesizes/comparison.md').toString();
            if (existingComment.length) {
                await updatePRComment(existingComment[0].id, commentBody);
            } else if (commentBody) {
                await createPRComment(pr, commentBody);
            }
        } else {
            log.error('Please specify a a PR id with \'--pr\' and a user with \'--user\' ');
        }
    } catch (error) {
        log.failure(error);
    }
}

comment.description = 'Updates/creates file size comparison for pull requests';
comment.flags = {
    '--pr': 'Pull request number',
    '--user': 'Github user',
    '--token': 'Github token (can also be specified with GITHUB_TOKEN env var)',
    '--fail-silently': 'Will always return exitCode 0 (success)',
    '--dryrun': 'Just runs through the task for testing purposes without doing external requests. '
};

gulp.task('write-size-table', writeTable);
gulp.task('write-file-sizes', writeFileSizes);
gulp.task('pr-comment-sizes', comment);
