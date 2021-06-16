const gulp = require('gulp');
const errors = require('../../errors/errors.json');
const log = require('./lib/log');
const { putS3Object } = require('./lib/uploadS3');

const bucket = 'assets.highcharts.com';
const errorLocation = 'errors';


// eslint-disable-next-line require-jsdoc
function makeHTML(errorNo, obj) {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Highcharts Error #${errorNo}</title>
        <script src="https://code.highcharts.com/products.js"></script>
    </head>
    <body>
        ${obj.text}
    </body>
    </html>`;
}

/**
 * Makes full HTML documents of each error in `errors.json`
 * and uploads it to S3
 * @return {Promise} Promise for Gulp to keep
 */
async function uploadErrors() {
    await Promise.all(
        Object.keys(errors)
            .filter(key => key !== 'meta')
            .map(err => putS3Object(`${errorLocation}/${err}/index.html`, null, {
                Bucket: bucket,
                Body: makeHTML(err, errors[err]),
                ContentType: 'text/html; charset=utf-8'
            }))
    ).catch(error => {
        throw error;
    });
    log.success('Finished uploading errors');
}

gulp.task('dist-upload-errors', uploadErrors);
