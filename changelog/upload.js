/* eslint-env node, es6 */
/* eslint valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/**
 * Usage: node changelog/upload
 *
 * This node script is used to call generation of the changelog HTML, then
 * upload it to S3.
 */

const { exit } = require('node:process');
const { uploadFiles } = require('../tools/gulptasks/lib/uploadS3');
const { generateHTML } = require('./generate-html');

async function uploadFile(filename) {
    uploadFiles({
        bucket: 'assets.highcharts.com',
        files: [{
            from: filename,
            to: 'changelog/changelog.html'
        }],
        name: 'changelog'
    });
}

generateHTML()
    .then(params => uploadFile(params.outputFile))
    .catch(error => {
        console.error(error);
        exit(1);
    });
