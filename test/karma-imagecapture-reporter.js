/* eslint-env node,es6 */

/**
 * This reporter captures info from the browser tests containing image data
 * and writes the image to images on the file system. The payload is passed from
 * the test using __karma__.info.
 */

const fs = require('fs');
const { getLatestCommitShaSync } = require('../tools/gulptasks/lib/git');

/* eslint-disable require-jsdoc */
function ImageCaptureReporter(baseReporterDecorator, config, logger, emitter) {
    baseReporterDecorator(this);
    const LOG = logger.create('reporter.imagecapture');
    const gitSha = getLatestCommitShaSync();
    const {
        imageCapture = {
            resultsOutputPath: 'test/visual-test-results.json'
        }
    } = config;

    /**
     * Basic pretty-print SVG, each tag on a new line.
     * @param  {String} svg The SVG
     * @return {String}     Pretty SVG
     */
    function prettyXML(svg) {
        svg = svg
            .replace(/>/g, '>\n')

            // Don't introduce newlines inside tspans, it will make the text
            // render differently
            .replace(/<tspan([^>]*)>\n/g, '<tspan$1>')
            .replace(/<\/tspan>\n/g, '</tspan>');

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
        // 0 for repeat, -1 for no-repeat
        encoder.setRepeat(0);
        // frame delay in ms
        encoder.setDelay(500);
        // image quality. 10 is default.
        encoder.setQuality(10);

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

    function readExistingResult(filePath) {
        var existingFile = fs.readFileSync(filePath, { flag: 'a+' });
        if (existingFile && existingFile.length !== 0) {
            try {
                return JSON.parse(existingFile.toString());
            } catch (e) {
                LOG.warn('Failed to parse existing visual test results.');
            }
        }
        return {}; // empty object
    }

    // "browser_start" - a test run is beginning in _this_ browser
    this.onBrowserStart = function (browser) {
        const filename = imageCapture.resultsOutputPath;
        LOG.info('Starting visual tests. Results stored in ' + filename);
        const today = new Date().toISOString().slice(0, 10);
        const testResults = readExistingResult(filename);
        testResults.meta = {
            browser: browser.name,
            runId: browser.id,
            runDate: today,
            gitSha: gitSha || 'unknown'
        };
        fs.writeFileSync(filename, JSON.stringify(testResults, null, ' '));
    };

    /**
     * Logs results to file specified in the config.
     * @param {object} browser data
     * @param {object} testResult data
     * @return {void}
     */
    this.specSuccess = this.specSkipped = this.specFailure = function (browser, testResult) {
        const { log = [], skipped, success } = testResult;
        const filename = imageCapture.resultsOutputPath;
        const diffResults = readExistingResult(filename);

        if (skipped) {
            diffResults[testResult.description] = undefined;
        } else if (success) {
            diffResults[testResult.description] = 0;
        } else if (!success && log.length > 0) {
            const matches = log[0].match(/Actual: (\d+)/);
            if (matches[1]) {
                LOG.info(`Test ${testResult.description} differs with ${matches[1]} pixels`);
                diffResults[testResult.description] = parseInt(matches[1], 10);
            } else {
                LOG.warn(`Test ${testResult.description} failed, but unable to determine the diff. Has the test assert(..) changed?`);
            }
        }
        fs.writeFileSync(filename, JSON.stringify(diffResults, null, ' '));
    };

    /**
     * Writes image data to file
     */
    emitter.on('browser_info', (browser, info) => {
        let data = info.data;
        const filename = info.filename;
        try {
            if (/\.svg$/.test(filename)) {
                fs.writeFileSync(filename, prettyXML(data));

            } else if (/\.png$/.test(filename)) {
                data = data.replace(/^data:image\/\w+;base64,/, '');
                fs.writeFileSync(filename, Buffer.from(data, 'base64'));

            } else if (/\.gif$/.test(filename)) {
                createAnimatedGif(filename, info.frames);
            }
        } catch (err) {
            LOG.error(`Failed to write file ${filename}\n\n${err}`);
        }

    });

}
/* eslint-enable require-jsdoc */

ImageCaptureReporter.$inject = [
    'baseReporterDecorator',
    'config',
    'logger',
    'emitter'
];

// PUBLISH DI MODULE
module.exports = {
    'reporter:imagecapture': ['type', ImageCaptureReporter]
};
