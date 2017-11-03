/* eslint-env node,es6 */

/**
 * This reporter captures logs from the browser tests containing image data
 * and writes the image to a PNG on the file system. The payload is passed from
 * the test using __karma__.log.
 *
 * @example
 * // pngImg is a base64 encoded PNG
 * __karma__.log('imagecapture', ['path/to/file.png ' + pngImg])
 */

const fs = require('fs');

function ImageCaptureReporter( // eslint-disable-line require-jsdoc
    config,
    baseReporterDecorator,
    emitter
) {
    baseReporterDecorator(this);

    this.captured = [];

    var origBrowserLog = this.onBrowserLog;
    this.onBrowserLog = function (browser, log, type) {
        if (type === 'imagecapture') {
            if (this.captured) {
                this.captured.push(
                    log
                );
                let path, png;
                [path, png] = log.replace(/^'/, '').replace(/1$/, '')
                    .split(' ');
                let data = png.replace(/^data:image\/\w+;base64,/, '');
                let buf = new Buffer(data, 'base64');
                fs.writeFileSync(path, buf);
            }
        } else {
            origBrowserLog.call(this, browser, log, type);
        }
    };

    /*
    this.onSpecComplete = function (browser, result) {

        if (!result.success && !result.skipped && this.captured.length) {
            result.log.push(
                '\nCaptured logs:\n  ' + this.captured.join('\n')
            );
        }

        this.captured = [];
    };
    */

    // HACK: Override log notification for the other reporters
    var self = this;
    var origBind = emitter.bind;
    emitter.bind = function (obj) {
        if (obj !== self) {
            obj.onBrowserLog = self.onBrowserLog;
        }
        return origBind.call(this, obj);
    };
}

ImageCaptureReporter.$inject = [
    'config',
    'baseReporterDecorator',
    'emitter'
];

// PUBLISH DI MODULE
module.exports = {
    'reporter:imagecapture': ['type', ImageCaptureReporter]
};
