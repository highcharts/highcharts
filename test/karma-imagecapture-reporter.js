/* eslint-env node,es6 */

/**
 * This reporter captures info from the browser tests containing image data
 * and writes the image to images on the file system. The payload is passed from
 * the test using __karma__.info.
 */

const fs = require('fs');

function ImageCaptureReporter( // eslint-disable-line require-jsdoc
    emitter
) {

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

    /**
     * Create an animated gif of the reference and the candidata image, in order to
     * see the differences.
     * @param  {String} filename
     *         The file name
     * @param  {Array}  frames
     *         The image data of the GIF frames
     * @return {void}
     */
    function createAnimatedGif(filename, frames) {

        var GIFEncoder = require('gifencoder');

        var encoder = new GIFEncoder(300, 200);
        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(500);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.

        frames.forEach(frame => {
            encoder.addFrame(frame);
        });
        encoder.finish();

        var buf = encoder.out.getData();
        fs.writeFile(filename, buf, function (err) {
            if (err) {
                throw err;
            }
        });

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

        } else if (/\.gif$/.test(filename)) {
            createAnimatedGif(filename, info.frames);
        }
    });

}

ImageCaptureReporter.$inject = [
    'emitter'
];

// PUBLISH DI MODULE
module.exports = {
    'reporter:imagecapture': ['type', ImageCaptureReporter]
};
