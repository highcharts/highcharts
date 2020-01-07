/* eslint-env node,es6 */

/**
 * This reporter captures info from the browser tests containing image data
 * and writes the image to images on the file system. The payload is passed from
 * the test using __karma__.info.
 */

const fs = require('fs');
const { getLatestCommitShaSync } = require('../tools/gulptasks/lib/git');
const version = require('../package.json').version;

/* eslint-disable require-jsdoc */
function ImageCaptureReporter(baseReporterDecorator, config, logger, emitter) {
    baseReporterDecorator(this);
    const LOG = logger.create('reporter.imagecapture');
    const gitSha = getLatestCommitShaSync();
    const {
        imageCapture = {
            resultsOutputPath: 'test/visual-test-results.json'
        },
        referenceRun = false
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
     * @param {number} width
     *          Width of the created gif
     * @param {number} height
     *          Height of the created gif
     * @return {void}
     */
    function createAnimatedGif(filename, frames, width, height) {
        var GIFEncoder = require('gifencoder');

        var encoder = new GIFEncoder(width, height);
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
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const testResults = readExistingResult(filename);
        testResults.meta = Object.assign(testResults.meta || {}, {
            browser: browser.name,
            runId: process.env.CIRCLE_BUILD_NUM || browser.id,
            runDate: today,
            runDateTs: now.getTime(),
            gitSha: gitSha || 'unknown',
            version: version
        });
        fs.writeFileSync(filename, JSON.stringify(testResults, null, ' '));
    };

    /**
     * Logs results to file specified in the config.
     * @param {object} browser data
     * @param {object} testResult data
     * @return {void}
     */
    this.specSuccess = this.specSkipped = this.specFailure = function (browser, testResult) {
        if (referenceRun) {
            // no need to log results test results if the test run is for references/baselines
            return;
        }
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
                const canvasWidth = info.canvasWidth || 600;
                const canvasHeight = info.canvasHeight || 400;
                createAnimatedGif(filename, info.frames, canvasWidth, canvasHeight);
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
