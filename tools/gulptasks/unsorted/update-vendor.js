/* eslint no-console: 0 */
const gulp = require('gulp');
/**
 * Update the vendor files for distribution
 *
 * @return {Promise<Array<*>>}
 *         Promises to keep
 */
function updateVendor() {

    const {
        copyFile
    } = require('../../filesystem.js');

    console.log((
        'Note: This task only copies the files into the vendor folder.\n' +
        'To upgrade, run npm update jspdf-yworks && npm update svg2pdf.js`'
    ).yellow);

    const promises = [
        [
            './node_modules/jspdf-yworks/dist/jspdf.debug.js',
            './vendor/jspdf.src.js'
        ],
        [
            './node_modules/jspdf-yworks/dist/jspdf.min.js',
            './vendor/jspdf.js'
        ],
        [
            './node_modules/svg2pdf.js/dist/svg2pdf.js',
            './vendor/svg2pdf.src.js'
        ],
        [
            './node_modules/svg2pdf.js/dist/svg2pdf.min.js',
            './vendor/svg2pdf.js'
        ]
    ].map(([source, target]) => copyFile(source, target));

    return Promise.all(promises);

}
gulp.task('update-vendor', updateVendor);
