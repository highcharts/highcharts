/* eslint-env node, es6 */
/* eslint no-console: 0, camelcase: 0 */

/**
 * Take an URL and translate to a local file path.
 * @param  {String} path The global URL
 * @returns {String} The local path
 * /
function fileNameToLocal(path) {

    path = path

        // Don't use product folders
        .replace(
            '/code.highcharts.com/stock/',
            '/code.highcharts.com/'
        )
        .replace(
            '/code.highcharts.com/maps/',
            '/code.highcharts.com/'
        )

        // Load Highstock and Highmaps as modules
        .replace(
            '/code.highcharts.com/highmaps.js',
            '/code.highcharts.com/modules/map.js'
        )
        .replace(
            '/code.highcharts.com/highstock.js',
            '/code.highcharts.com/modules/stock.js'
        )

        // Use local files
        .replace(
            /https:\/\/code.highcharts.com\/(.*?)\.js$/,
            'code/$1.src.js'
        )
        .replace(
            /^code\/mapdata\/(.*?)\.src.js$/,
            'https://code.highcharts.com/mapdata/$1.js'
        );
    return path;
}
*/
/**
 * Get the resources from demo.html files
 * @returns {Array.<String>} The file names
 * /
function getFiles() { // eslint-disable-line no-unused-vars
    const fs = require('fs');
    const glob = require('glob-fs')({ gitignore: true });
    require('colors');

    const files = glob.readdirSync('samples/unit-tests/** / * * /demo.html');
    const exclude = [
        /^https:\/\/code\.highcharts\.com\/js/,
        /^https:\/\/code\.highcharts\.com\/maps\/js/,
        /^https:\/\/code\.highcharts\.com\/stock\/js/,
        /^https:\/\/code\.highcharts\.com\/themes/
    ];

    let dependencies = [];

    let i = 0;

    files.forEach(file => {
        if (i < Infinity) {
            let html = fs.readFileSync(file, 'utf8');

            let regex = /src="(.*?)"/g;
            let match = regex.exec(html);
            let excluded = false;
            while (match) {

                let filename = match[1];
                exclude.forEach(pattern => { // eslint-disable-line no-loop-func
                    if (pattern.test(filename)) {
                        excluded = true;
                    }
                });

                filename = fileNameToLocal(filename);

                if (dependencies.indexOf(filename) === -1 && !excluded) {
                    dependencies.push(filename);
                }
                match = regex.exec(html);
            }
        }

        i++;
    });
    // console.log(('Found ' + dependencies.length + ' dependencies').green);

    return dependencies;
}
*/

module.exports = function (config) {

    console.log(
`_______________________________________________________________________________

HIGHCHARTS TEST RUNNER

Available arguments for 'gulp test':

--browsers
    Comma separated list of browsers to test. Available browsers are
    'ChromeHeadless,Chrome,Firefox,Safari,Edge,IE'. Defaults to ChromeHeadless.

--browsersstack
    If given, runs the test against selected browsers on BrowserStack. Requires
    the username and accesskey to be set in git-ignore-me.properties.

--tests
    Comma separated list of tests to run. Defaults to '*.*' that runs all tests
    in the 'samples/unit-tests' directory.
    Example: 'gulp test --tests chart/*' runs all tests in the chart directory.
________________________________________________________________________________

`.green);

    // The tests to run by default
    const defaultTests = [
        '*/*'
    ];

    const argv = require('yargs').argv;
    const browserStack = Boolean(argv.browserstack);

    // Browsers
    let browsers = argv.browsers && argv.browsers.split(',');
    if (!browsers) {
        browsers = browserStack ?
            ['BS.Firefox.Mac', 'BS.Edge', 'BS.IE'] :
            ['ChromeHeadless'];
    }

    const tests = (argv.tests ? argv.tests.split(',') : defaultTests)
        .map(path => `samples/unit-tests/${path}/demo.js`);

    // let files = getFiles();
    let files = require('./karma-files.json');

    let options = {
        basePath: '../', // Root relative to this file
        frameworks: ['qunit'],
        files: files.concat([
            {
                pattern: 'utils/samples/*.png', // testimage.png
                watched: false,
                included: false,
                served: true
            },

            // Set up
            'utils/samples/test-controller.js',
            'test/karma-setup.js'
        ], tests),

        // These ones fail
        exclude: [
            // The configuration currently loads classic mode only. Styled mode
            // needs to be a separate instance.
            'samples/unit-tests/series-pie/styled-mode/demo.js',
            // Themes alter the whole default options structure. Set up a
            // separate test suite? Or perhaps somehow decouple the options so
            // they are not mutated for later tests?
            'samples/unit-tests/themes/*/demo.js'
        ],
        /*
        formatError: function (e) {
            console.log(arguments);
        },
        */
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_WARN,
        browsers: browsers,
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    };


    if (browserStack) {

        console.log('Please wait while tests are uploaded and VMs prepared. ' +
            'This may take some time...');

        // Get BrowserStack credentials from properties file
        let fs = require('fs');
        let lines = fs.readFileSync(
            './git-ignore-me.properties', 'utf8'
        );
        let properties = {};
        lines.split('\n').forEach(function (line) {
            line = line.split('=');
            if (line[0]) {
                properties[line[0]] = line[1];
            }
        });

        if (!properties['browserstack.username']) {
            throw `BrowserStack credentials not given. Add username and
                accesskey to the git-ignore-me.properties file`;
        }
        options.browserStack = {
            username: properties['browserstack.username'],
            accessKey: properties['browserstack.accesskey']
        };
        options.customLaunchers = {
            'BS.Firefox.Mac': {
                base: 'BrowserStack',
                browser: 'firefox',
                browser_version: '56.0',
                os: 'OS X',
                os_version: 'Sierra'
            },
            'BS.Edge': {
                base: 'BrowserStack',
                browser: 'edge',
                browser_version: '15.0',
                os: 'Windows',
                os_version: '10'
            },
            'BS.IE': {
                base: 'BrowserStack',
                browser: 'ie',
                browser_version: '11.0',
                os: 'Windows',
                os_version: '10'
            }
        };

        // to avoid DISCONNECTED messages when connecting to BrowserStack
        options.browserDisconnectTimeout = 10000; // default 2000
        options.browserDisconnectTolerance = 1; // default 0
        options.browserNoActivityTimeout = 4 * 60 * 1000; // default 10000
        options.captureTimeout = 4 * 60 * 1000; // default 60000
    }

    config.set(options);
};
