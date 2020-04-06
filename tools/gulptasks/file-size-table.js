const mkdirp = require('mkdirp');
const { join } = require('path');
const yargs = require('yargs').argv;
const fs = require('fs');
const gulp = require('gulp');
const { getFileSizes } = require('../compareFilesize');
const log = require('./lib/log');

const files = ['highcharts.src.js'];

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
    let table = '| | master | candidate | difference |' +
        '\n|-------------|-------------|-------------|-------------|';

    try {
        const masterSizes = JSON.parse(fs.readFileSync(master));
        const proposedSizes = JSON.parse(fs.readFileSync(proposed));

        Object.keys(masterSizes).forEach(key => {
            const package = key.replace('.src.js', '');
            if (masterSizes[key] && proposedSizes[key]) {
                table += `\n| ${package} | ${masterSizes[key].compiled} | ${proposedSizes[key].compiled} | ` +
                    `${proposedSizes[key].compiled - masterSizes[key].compiled} |`;
                table += `\n| ${package}, gzipped | ${masterSizes[key].gzip} | ${proposedSizes[key].gzip} | ` +
                    `${proposedSizes[key].gzip - masterSizes[key].gzip} |`;
            }
        });

        return table;

    } catch (error) {
        return error;
    }
}

/**
 * Task that writes filesizes to ./tmp/filesizes/
 * @return {void}
 */
async function writeFileSizes() {
    const filename = yargs.filename || 'master.json';
    await writeFileSize('./tmp/filesizes/', filename);
}
/**
 * Task that writes a markdown table that compares filesizes
 * of master and PR
 * @return {void}
 */
async function writeTable() {
    const { master, proposed } = yargs;
    if (master && proposed) {
        fs.writeFileSync('./tmp/filesizes/comparison.md', makeTable(master, proposed));
        log.message(makeTable(master, proposed));
    } else {
        log.failure('Please provide all required arguments');
    }
}

gulp.task('file-size-table', writeTable);
gulp.task('write-file-sizes', writeFileSizes);
