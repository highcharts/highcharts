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

    const { mkdirSync } = require('fs');
    const { writeFile } = require('fs/promises');

    let fetch;

    if ('fetch' in global) {
        fetch = global.fetch;
    } else {
        console.log('Using node-fetch');
        fetch = require('node-fetch');
    }

    // Create the vendor folder if it doesn't exist
    mkdirSync('./vendor', { recursive: true });

    console.log((
        'Note: This task only copies the files into the vendor folder.\n' +
        'To upgrade, run npm update'
    ).yellow);

    const promises = [
        [
            './node_modules/jspdf/dist/jspdf.umd.js',
            './vendor/jspdf.src.js'
        ],
        [
            './node_modules/jspdf/dist/jspdf.umd.min.js',
            './vendor/jspdf.js'
        ],
        [
            './node_modules/svg2pdf.js/dist/svg2pdf.umd.js',
            './vendor/svg2pdf.src.js'
        ],
        [
            './node_modules/svg2pdf.js/dist/svg2pdf.umd.min.js',
            './vendor/svg2pdf.js'
        ],
        [
            './node_modules/moment/min/moment.min.js',
            './vendor/moment.js'
        ],
        [
            './node_modules/moment-timezone/builds/moment-timezone-with-data-2012-2022.js',
            './vendor/moment-timezone-with-data-2012-2022.js'
        ],
        [
            './node_modules/requirejs/require.js',
            './vendor/require.js'
        ],
        [
            './node_modules/proj4/dist/proj4.js',
            './vendor/proj4.js'
        ],
        [
            './node_modules/jquery/dist/jquery.min.js',
            './vendor/jquery.js'
        ],
        [
            './node_modules/topojson-client/dist/topojson-client.min.js',
            './vendor/topojson-client.min.js'
        ]
    ].map(([source, target]) => copyFile(source, target));


    // Download files from CDN with optional checksum check
    const dowloadFiles = [
        {
            url: 'https://code.highcharts.com/lib/rgbcolor.js',
            outFile: './vendor/rgbcolor.js',
            checksum: '44e5e565ddfb294672a214bfdb021ddb31e324d734979571cc2c4285ff34e724'
        }
    ];

    function validateChecksum(text, expected) {
        const crypto = require('node:crypto');
        const checksum = crypto.createHash('sha256')
            .update(text).digest('hex');

        if (checksum !== expected) {
            console.log({ checksum, expected });
            throw new Error('Checksum mismatch');
        }
    }

    dowloadFiles.forEach(({ url, outFile, checksum }) => {
        promises.push(
            fetch(url)
                .then(response => response.text())
                .then(text => {
                    if (checksum) {
                        validateChecksum(text, checksum);
                    }
                    return writeFile(outFile, text);
                })
        );
    });

    return Promise.all(promises);

}
gulp.task('update-vendor', updateVendor);
