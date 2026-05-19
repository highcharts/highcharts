/* eslint-env node, es6 */
/* eslint valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/**
 * Usage: node changelog/upload
 *
 * This node script is used to call generation of the changelog HTML and JSON,
 * then upload them to S3.
 */

const { exit } = require('node:process');
const { uploadFiles } = require('../tools/gulptasks/lib/uploadS3');
const { generateHTML, generateJSON } = require('./generate-html');

async function uploadChangelogFiles(htmlFile, jsonFile) {
    uploadFiles({
        bucket: 'assets.highcharts.com',
        files: [{
            from: htmlFile,
            to: 'changelog/changelog.html'
        }, {
            from: jsonFile,
            to: 'changelog/changelog-tree.json'
        }],
        name: 'changelog files'
    });
}

Promise.all([generateHTML(), generateJSON()])
    .then(([htmlResult, jsonResult]) => uploadChangelogFiles(
        htmlResult.outputFile,
        jsonResult.outputFile
    ))
    .catch(error => {
        console.error(error);
        exit(1);
    });
