/* eslint-env node, es6 */
/* eslint-disable */
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const os = require('os');

/**
 * Get browserstack credentials from the environment variables.
 * e.g for Mac/Linux run the below with correct credentials or
 * add to a env.file which you add by running `source env.file`
 * in your terminal:
 *  export BROWSERSTACK_USER="username"
 *  export BROWSERSTACK_KEY="key"
 * @return {Object} The properties
 */
function getProperties() {
    let properties = {};

    try {
        // add BROWSERSTACK_USER and BROWSERSTACK_KEY as envfile containing the
        properties['browserstack.username'] = process.env.BROWSERSTACK_USER;
        properties['browserstack.accesskey'] = process.env.BROWSERSTACK_KEY;

        if (!process.env.BROWSERSTACK_USER) {
            // fallback to good old property file
            let lines = fs.readFileSync(
                './git-ignore-me.properties', 'utf8'
            );
            lines.split('\n').forEach(function (line) {
                line = line.split('=');
                if (line[0]) {
                    properties[line[0]] = line[1];
                }
            });
        }
    } catch (e) {}
    return properties;
}

/**
 * Get the contents of demo.html and strip out JavaScript tags.
 * @param  {String} path The sample path
 * @return {String}      The stripped HTML
 */
function getHTML(path) {
    let html = fs.readFileSync(`samples/${path}/demo.html`, 'utf8');

    html = html
        .replace(
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            ''
        )
        // Google fonts mess up the calculation of bounding boxes because they
        // load async, so sometimes they're loaded prior to screenshot,
        // sometimes not
        .replace(
            /<link[a-z"=:\.\/ ]+(fonts.googleapis.com|fonts.gstatic.com)[^>]+>/gi,
            ''
        );

    return html + '\n';
}

/**
 * Look for Highcharts.getJSON calls in the demos and add hook to local sample data.
 * @param  {String} js
 *         The contents of demo.js
 * @return {String}
 *         JavaScript extended with the sample data.
 */
function resolveJSON(js) {
    const regex = /(?:(\$|Highcharts)\.getJSON|fetch)\([ \n]*'([^']+)/g;
    let match;
    const codeblocks = [];

    while (match = regex.exec(js)) {
        let src = match[2],
            innerMatch,
            filename,
            data;

        // Look for sources that can be matched to samples/data
        innerMatch = src.match(
            /^(https:\/\/cdn.jsdelivr.net\/gh\/highcharts\/highcharts@[a-z0-9\.]+|https:\/\/www.highcharts.com)\/samples\/data\/([a-z0-9\-\.]+$)/
        ) || src.match(
            /^(https:\/\/demo-live-data.highcharts.com)\/([a-z0-9\-\.]+$)/
        );

        if (innerMatch) {

            filename = innerMatch[2];
            data = fs.readFileSync(
                path.join(
                    __dirname,
                    '..',
                    'samples/data',
                    filename
                ),
                'utf8'
            );
        }

        // Look for sources that can be matched to the map collection
        innerMatch = src.match(
            /^(https:\/\/code.highcharts.com\/mapdata\/([a-z\/\.\-]+))$/
        );
        if (innerMatch) {
            filename = innerMatch[2];
            data = fs.readFileSync(
                path.join(
                    __dirname,
                    '..',
                    'node_modules/@highcharts/map-collection',
                    filename
                ),
                'utf8'
            );
        }

        if (data) {

            if (/json$/.test(filename)) {
                codeblocks.push(`window.JSONSources['${src}'] = ${data};`);
            }
            if (/csv$/.test(filename)) {
                codeblocks.push(`window.JSONSources['${src}'] = \`${data}\`;`);
            }
        }
    }
    codeblocks.push(js);
    return codeblocks.join('\n');
}

/**
 * Decide whether to skip the test based on flags in demo.details.
 * @param  {String} path The sample path
 * @return {Boolean}     False if we should skip the test
 */
function handleDetails(path) {
    // Skip it?
    if (fs.existsSync(`samples/${path}/demo.details`)) {
        let details = fs.readFileSync(
            `samples/${path}/demo.details`,
            'utf8'
        );
        details = details && yaml.load(details);
        if (details && details.skipTest) {
            // console.log(`- skipTest: ${path}`.gray);
            return false;
        }
        if (details && details.requiresManualTesting) {
            // console.log(`- requiresManualTesting: ${path}`.gray);
            return false;
        }
        return true;
    }
    return true;
}

const browserStackBrowsers = require('./karma-bs-es5.json');

module.exports = function (config) {
    const argv = require('yargs').argv;

    let frameworks = ['qunit'];

    // Browsers
    let browsers = argv.browsers ?
        argv.browsers.split(',') :
        // Use karma.defaultbrowser=FirefoxHeadless to bypass WebGL problems in
        // Chrome 109
        [getProperties()['karma.defaultbrowser'] || 'Edge'];

    if (argv.browsers === 'all') {
        browsers = Object.keys(browserStackBrowsers);
    }

    const browserCount = argv.browsercount || (Math.max(1, os.cpus().length - 2));

    if (!argv.browsers && browserCount && !isNaN(browserCount) && browserCount > 1) {
        // Sharding / splitting tests across multiple browser instances
        frameworks = [...frameworks, 'sharding'];
        // create a duplicate of the added browsers ${numberOfInstances} times.
        browsers = argv.splitbrowsers ? argv.splitbrowsers.split(',').reduce((browserInstances, current) => {
            for (let i = 0; i < browserCount; i++) {
                browserInstances.push(current);
            }
            return browserInstances;
        }, [])
        : new Array(browserCount).fill(browsers[0]);
    } else {
        if (argv.splitbrowsers) {
            browsers = argv.splitbrowsers.split(',');
        }
    }

    const tests = (
            argv.tests ? argv.tests.split(',') :
            (
                argv.testsAbsolutePath ? argv.testsAbsolutePath.split(',') :
                ['unit-tests/es5/*'] // default tests
            )
        )
        .filter(path => !!path)
        .map(path => argv.testsAbsolutePath ? path : `samples/${path}/demo.js`);

    // Get the files
    let files = require('./karma-files.json');
    // if (argv.oldie) {
    //     files = files.filter(f =>
    //         f.indexOf('vendor/jquery') !== 0 &&
    //         f.indexOf('vendor/moment') !== 0 &&
    //         f.indexOf('vendor/proj4') !== 0 &&
    //         f.indexOf('vendor/rgbcolor') !== 0 &&
    //         f.indexOf('node_modules/lolex') !== 0 &&
    //         f.indexOf('topojson-client') === -1 &&

    //         // Complains on chart.renderer.addPattern
    //         f.indexOf('code/modules/pattern-fill.src.js') !== 0 &&
    //         // Uses classList extensively
    //         f.indexOf('code/modules/stock-tools.src.js') !== 0
    //     );
    //     files.splice(0, 0, 'code/modules/oldie-polyfills.src.js');
    //     files.splice(2, 0, 'code/modules/oldie.src.js');
    // }

    let options = {
        basePath: '../', // Root relative to this file
        frameworks: frameworks,
        files: [
            // Essentials
            'test/call-analyzer.js',
            'test/test-controller.js',
            'test/test-touch.js',
            'test/test-utilities.js',
            'test/json-sources.js',

            // Highcharts
            ...files,

            // Set up
            'test/karma-setup.js',

            // Tests
            ...tests,

            // Samples
            {
                pattern: 'test/*.png', // testimage.png
                watched: false,
                included: false,
                served: true
            },
            {
                pattern: '**/*.svg', // reference images
                watched: false,
                included: false,
                served: true
            },

            // Templates
            'test/test-template.js',
            {
                pattern: 'test/templates/**/*.js',
                type: 'js',
                watched: false,
                included: true,
                served: true,
                nocache: false
            }
        ],

        // These ones fail
        // exclude: argv.oldie ? [] : [
        //     // Themes alter the whole default options structure. Set up a
        //     // separate test suite? Or perhaps somehow decouple the options so
        //     // they are not mutated for later tests?
        //     'samples/unit-tests/themes/*/demo.js',

        //     // --- VISUAL TESTS ---

        //     // Custom data source
        //     'samples/highcharts/blog/annotations-aapl-iphone/demo.js',
        //     'samples/highcharts/blog/gdp-growth-annual/demo.js',
        //     'samples/highcharts/blog/gdp-growth-multiple-request-v2/demo.js',
        //     'samples/highcharts/blog//gdp-growth-multiple-request/demo.js',

        //     // Error #13, renders to other divs than #container. Sets global
        //     // options.
        //     'samples/highcharts/demo/bullet-graph/demo.js',
        //     // Network loading?
        //     'samples/highcharts/demo/combo-meteogram/demo.js',

        //     // CSV data, parser fails - why??
        //     'samples/highcharts/demo/line-ajax/demo.js',

        //     // Clock
        //     'samples/highcharts/demo/dynamic-update/demo.js',
        //     'samples/highcharts/demo/gauge-clock/demo.js',
        //     'samples/highcharts/demo/gauge-vu-meter/demo.js',

        //     // Too heavy
        //     'samples/highcharts/demo/parallel-coordinates/demo.js',
        //     'samples/highcharts/demo/sparkline/demo.js',

        //     // Maps
        //     'samples/maps/demo/map-pies/demo.js', // advanced data
        //     'samples/maps/demo/us-counties/demo.js', // advanced data
        //     'samples/maps/plotoptions/series-animation-true/demo.js', // animation
        //     'samples/highcharts/blog/map-europe-electricity-price/demo.js', // strange fails, remove this later

        //     // Unknown error
        //     'samples/highcharts/boost/scatter-smaller/demo.js',
        //     'samples/highcharts/data/google-spreadsheet/demo.js',

        //     // Various
        //     'samples/highcharts/data/delimiters/demo.js', // data island
        //     'samples/highcharts/css/exporting/demo.js', // advanced demo
        //     'samples/highcharts/css/pattern/demo.js', // styled mode, setOptions
        //     'samples/highcharts/studies/logistics/demo.js', // overriding

        //     // Failing on Edge only
        //     'samples/unit-tests/pointer/members/demo.js',

        //     // Skip the special oldie tests (which don't run QUnit)
        //     'samples/unit-tests/oldie/*/demo.js',

        //     // visual tests excluded for now due to failure
        //     'samples/highcharts/demo/funnel3d/demo.js',
        //     'samples/highcharts/demo/live-data/demo.js',
        //     'samples/highcharts/demo/organization-chart/demo.js',
        //     'samples/highcharts/demo/pareto/demo.js',
        //     'samples/highcharts/demo/pyramid3d/demo.js',
        //     'samples/highcharts/demo/synchronized-charts/demo.js',
        // ],
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: browsers,
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        reportSlowerThan: 3000,
        plugins: [
            'karma-*',
            require('./karma-imagecapture-reporter.js')
        ],
        sharding: {
          specMatcher: /(spec|test|demo)s?\.js/i
        },

        formatError: function (s) {
            let ret = s.replace(
                /(\@samples\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+\n)/,
                function (a, b, c) {
                    return `http://utils.highcharts.local/samples/#test/${c}`.cyan + '\n' +
                    '\t' + a.replace(/^@/, '@ ') + '\n<<<splitter>>>';
                }
            );

            // Insert link to utils
            let regex = /(samples\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+)/;
            let match = s.match(regex);

            if (match) {
                // Insert the utils link before the first line with mixed indent
                ret = s.replace(
                    '\t    ',
                    '\tDebug: ' + `http://utils.highcharts.local/samples/#test/${match[2]}`.cyan + '\n\t    '
                );

                ret = ret.replace(regex, a => a.cyan);
            }

            // Skip the call stack, it's internal QUnit stuff
            ret = ret.split('<<<splitter>>>')[0];

            return ret;
        },

        preprocessors: {
            '**/unit-tests/*/*/demo.js': ['generic']
        },

        /*
         The preprocessor intervenes with the visual tests and transform them
         to unit tests by comparing a bitmap of the genearated SVG to the
         reference image and asserting the difference.
         */
        genericPreprocessor: {
            rules: [{
                process: function (js, file, done) {
                    const path = file.path.replace(
                        /^.*?samples\/(highcharts|stock|maps|gantt|unit-tests|issues)\/([a-z0-9\-\.]+\/[a-z0-9\-,]+)\/demo.js$/g,
                        '$1/$2'
                    );

                    // Warn about things that may potentially break downstream
                    // samples
                    if (argv.debug) {
                        if (js.indexOf('Highcharts.setOptions') !== -1) {
                            console.log(
                                `Warning - Highcharts.setOptions found in: ${file.path}`.yellow
                            );
                        }
                        if (
                            js.indexOf('Highcharts.wrap') !== -1 ||
                            js.indexOf('H.wrap') !== -1
                        ) {
                            console.log(
                                `Warning - Highcharts.wrap found in: ${file.path}`.yellow
                            );
                        }
                    }

                    done(js);
                }
            }]
        }
    };

    if (browsers.some(browser => /^(Mac|Win)\./.test(browser))) {
        let properties = getProperties();

        if (!properties['browserstack.username']) {
            throw new Error(
                'BrowserStack credentials not given. Add BROWSERSTACK_USER and ' +
                'BROWSERSTACK_KEY environment variables or create a git-ignore-me.properties file.'
            );
        }

        const randomString = Math.random().toString(36).substring(7);

        options.browserStack = {
            username: properties['browserstack.username'],
            accessKey: properties['browserstack.accesskey'],
            project: 'highcharts',
            build: `highcharts-build-${process.env.CIRCLE_BUILD_NUM || randomString} `,
            name: `circle-ci-karma-highcharts-${randomString}`,
            localIdentifier: randomString, // to avoid instances interfering with each other.
            video: false,
            retryLimit: 1,
            pollingTimeout: 5000, // to avoid rate limit errors with browserstack.
            'browserstack.timezone': argv.timezone || 'UTC'
        };
        options.customLaunchers = browserStackBrowsers;
        options.logLevel = config.LOG_INFO;

        // to avoid DISCONNECTED messages when connecting to BrowserStack
        options.concurrency = 2;
        options.browserDisconnectTimeout = 30000; // default 2000
        options.browserDisconnectTolerance = 1; // default 0
        options.browserNoActivityTimeout = 4 * 60 * 1000; // default 10000
        options.browserSocketTimeout = 30000;
        options.captureTimeout = 120000;

        options.plugins = [
            'karma-browserstack-launcher',
            'karma-sharding',
            'karma-generic-preprocessor',
            'karma-qunit'
        ];

        options.reporters = ['progress'];

        if (browsers.some(browser => /(Edge)/.test(browser))) {
            // fallback to polling for Edge browsers as websockets disconnects a lot.
            options.transports = ['polling'];
        }

        console.log(
            'BrowserStack initialized. Please wait while tests are uploaded and VMs prepared. ' +
            `Any other test runs must complete before this test run will start. Current Browserstack concurrency rate is ${options.concurrency}.`
        );
    } else {
        // Local tests
        options.browserDisconnectTimeout = 30 * 1000;
        options.browserNoActivityTimeout = 30 * 1000;
    }

    config.set(options);
};
