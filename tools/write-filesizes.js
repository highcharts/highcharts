const mkdirp = require('mkdirp');
const { join } = require('path');
const yargs = require('yargs').argv;
const { getFileSizes } = require('./compareFilesize');
const log = require('./gulptasks/lib/log');

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

module.exports = {
    default: (async () => {
        let filename = 'master.json';
        if (yargs.filename) {
            filename = yargs.filename;
        }
        await writeFileSize('./tmp/filesizes/', filename);
    })()
};
