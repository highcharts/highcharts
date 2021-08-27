/* eslint-env node, es6 */
/* eslint valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/**
 * Usage: node changelog/upload
 *
 * This node script is used to call generation of the changelog HTML, then
 * upload it to S3.
 */
const path = require('path');
const { uploadFiles } = require(
    path.join(__dirname, '../tools/gulptasks/lib/uploadS3')
);
const { generateHTML } = require(path.join(__dirname, 'generate-html'));

function uploadFile(filename) {
    uploadFiles({
        bucket: 'assets.highcharts.com',
        files: [{
            from: filename,
            to: 'changelog/changelog.html'
        }],
        name: 'changelog'
    });
}

generateHTML().then(params => {
    uploadFile(params.outputFile);
});
