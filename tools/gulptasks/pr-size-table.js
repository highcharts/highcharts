const { join } = require('path');
const argv = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const { sync: gzipSize } = require('gzip-size');
const scriptsCompile = require('./scripts-compile');
const dashboardsDistMinify = require('./dashboards/dist-minify');
const { createPRComment, updatePRComment, fetchPRComments } = require('./lib/github');
const log = require('./lib/log');

/* *
 *
 *  Constants
 *
 * */

const files = argv.files ? argv.files.split(',') : [
    'highcharts.src.js',
    'highstock.src.js',
    'highmaps.src.js',
    'highcharts-gantt.src.js',
    'indicators/indicators-all.src.js',
    'modules/accessibility.src.js',
    'modules/annotations.src.js',
    'modules/annotations-advanced.src.js',
    'modules/boost.src.js',
    'modules/data.src.js',
    'modules/exporting.src.js',
    'modules/heatmap.src.js',
    'modules/offline-exporting.src.js',
    'dashboards/dashboards.src.js',
    'dashboards/datagrid.src.js',
    'dashboards/modules/dashboards-plugin.src.js'
];

/* *
 *
 *  Functions
 *
 * */

function getFileSizes(out) {
    const sourceFolder = './code/';

    // Finds
    function getSizeOfSourceCompiledAndGzip(filenames) {
        return filenames.reduce((obj, filename) => {
            const compileName = filename.replace('.src.js', '.js');
            const compiled = fs.readFileSync(
                join(sourceFolder, compileName),
                { encoding: 'utf-8' }
            );
            obj[filename] = {
                gzip: gzipSize(compiled),
                size: fs.statSync(join(sourceFolder, filename)).size,
                compiled: compiled.length
            };
            return obj;
        }, {});
    }

    return Promise.resolve()
        .then(() => scriptsCompile(files.map(file => join('code', file))))
        .then(() => dashboardsDistMinify())
        .then(() => getSizeOfSourceCompiledAndGzip(files))

        // Output the result to the console, or a file if filePath is defined
        .then(result => {
            const str = JSON.stringify(result, null, '  ');
            return out ?
                fs.promises.writeFile(out, str) :
                Promise.resolve(log.message(str));
        });
}

/**
 * Writes file size.
 *
 * @param {string} outputFolder
 *        Output path.
 *
 * @param {string} outputFileName
 *        Output path.
 *
 * @return {Promise<void>}
 *         Writes file size as json doc.
 */
async function writeFileSize(outputFolder, outputFileName) {
    try {
        await fs.promises.mkdir(outputFolder, { recursive: true });
        await getFileSizes(join(outputFolder, outputFileName)).catch(err => log.failure(err));
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
    // eslint-disable-next-line require-jsdoc
    function tableTemplate(body) {
        return '### File size comparison' +
        '\nSizes for compiled+gzipped (bold) and compiled files.' +
        '\n| | master | candidate | difference |' +
        '\n|-------------|-------------:|-------------:|-------------:|' +
        body;
    }

    try {
        const masterSizes = JSON.parse(fs.readFileSync(master));
        const proposedSizes = JSON.parse(fs.readFileSync(proposed));

        let tableBody = '';
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
                const difference = proposedSizes[key].compiled -
                        masterSizes[key].compiled,
                    gzipDifference = proposedSizes[key].gzip -
                        masterSizes[key].gzip;

                if (difference) {
                    tableBody += `\n| ${package}.js | ` +
                        `**${toFixedKiloBytes(masterSizes[key].gzip)} kB**<br>${toFixedKiloBytes(masterSizes[key].compiled)} kB | ` +
                        `**${toFixedKiloBytes(proposedSizes[key].gzip)} kB**<br>${toFixedKiloBytes(proposedSizes[key].compiled)} kB | ` +
                        `**${gzipDifference} B**<br>${difference} B |`;
                }
            }
        });

        return tableBody.length > 0 ? tableTemplate(tableBody) : '### File size comparison\nNo differences found';

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
    const { master, proposed } = argv;
    if (master && proposed) {
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        return fs.promises.writeFile('./tmp/filesizes/comparison.md', makeTable(master, proposed));
    }
    throw new Error('Please provide all required arguments');
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
            const existingComment = await fetchPRComments(pr, user || '', '### File size comparison');
            const commentBody = fs.readFileSync('./tmp/filesizes/comparison.md').toString();
            if (existingComment.length) {
                await updatePRComment(existingComment[0].id, commentBody);
            } else if (commentBody) {
                await createPRComment(pr, commentBody);
            }
        } else {
            log.failure('Please specify a PR id with \'--pr\' and a user with \'--user\' ');
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
gulp.task('compare-size-and-comment', gulp.series(writeTable, comment));
