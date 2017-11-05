/* eslint-env node,es6 */

/**
 * This reporter captures info from the browser tests containing image data
 * and writes the image to images on the file system. The payload is passed from
 * the test using __karma__.info.
 */

const fs = require('fs');

function ImageCaptureReporter( // eslint-disable-line require-jsdoc
    baseReporterDecorator,
    emitter
) {
    baseReporterDecorator(this);

    /**
     * Basic pretty-print SVG, each tag on a new line.
     * @param  {String} svg The SVG
     * @return {String}     Pretty SVG
     */
    function prettyXML(svg) {
        let idx = svg.indexOf('>');
        let lineNo = 0;
        while (idx !== -1 && lineNo < 500) {

            // Make sure to not introduce white-space in text and tspans
            if (
                svg.substr(idx + 1, 1) === '<' &&
                svg.substr(idx - 5, 5) !== 'tspan' &&
                svg.substr(idx - 5, 5) !== 'text'
            ) {
                svg = svg.substr(0, idx + 1) + '\n' + svg.substr(idx + 1);
                lineNo++;
            }

            idx = svg.indexOf('>', idx + 1);
        }
        return svg;
    }

    emitter.on('browser_info', (browser, info) => {

        let data = info.data;
        let filename = info.filename;
        if (/\.svg$/.test(filename)) {
            fs.writeFileSync(filename, prettyXML(data));

        } else if (/\.png$/.test(filename)) {
            data = data.replace(/^data:image\/\w+;base64,/, '');
            let buf = new Buffer(data, 'base64');
            fs.writeFileSync(filename, buf);
        }
    });

}

ImageCaptureReporter.$inject = [
    'baseReporterDecorator',
    'emitter'
];

// PUBLISH DI MODULE
module.exports = {
    'reporter:imagecapture': ['type', ImageCaptureReporter]
};
