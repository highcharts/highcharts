/* eslint-env node, es6 */
/* eslint no-console: 0, camelcase: 0 */
const fs = require('fs');
const yaml = require('js-yaml');

// Internal reference
const hasJSONSources = {};

/**
 * Get browserstack credentials from the properties file.
 * @return {Object} The properties
 */
function getProperties() {
    let properties = {};
    try {
        let lines = fs.readFileSync(
            './git-ignore-me.properties', 'utf8'
        );
        lines.split('\n').forEach(function (line) {
            line = line.split('=');
            if (line[0]) {
                properties[line[0]] = line[1];
            }
        });

        if (!properties['browserstack.username']) {
            throw 'No username';
        }
    } catch (e) {
        throw 'BrowserStack credentials not given. Add username and ' +
            'accesskey to the git-ignore-me.properties file';
    }
    return properties;
}

/**
 * Get the contents of demo.html and strip out JavaScript tags.
 * @param  {String} path The sample path
 * @return {String}      The stripped HTML
 */
function getHTML(path) {
    let html = fs.readFileSync(`samples/${path}/demo.html`, 'utf8');

    html = html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        ''
    );

    return html + '\n';
}

/**
 * Look for $.getJSON calls in the demos and add hook to local sample data.
 * @param  {String} js
 *         The contents of demo.js
 * @return {String}
 *         JavaScript extended with the sample data.
 */
function resolveJSON(js) {
    const match = js.match(/\$\.getJSON\('([^']+)/);
    if (match) {
        let src = match[1];
        if (!hasJSONSources[src]) {
            let innerMatch = src.match(/filename=([^&']+)/);
            if (innerMatch) {
                let data = fs.readFileSync(
                    'samples/data/' + innerMatch[1],
                    'utf8'
                );

                if (data) {
                    hasJSONSources[src] = true;

                    if (/json$/.test(innerMatch[1])) {
                        return `
                        window.JSONSources['${src}'] = ${data};
                        ${js}
                        `;
                    }
                    if (/csv$/.test(innerMatch[1])) {
                        return `
                        window.JSONSources['${src}'] = \`${data}\`;
                        ${js}
                        `;
                    }
                }
            }
        }
    }
    return js;
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

const browserStackBrowsers = {
    'Mac.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '68.0',
        os: 'OS X',
        os_version: 'High Sierra'
    },
    'Mac.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '61.0',
        os: 'OS X',
        os_version: 'High Sierra'
    },
    'Mac.Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '11.1',
        os: 'OS X',
        os_version: 'High Sierra'
    },
    'Win.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '68.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.Edge': {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '42.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '61.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.IE': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '10'
    }
};

module.exports = function (config) {

    const argv = require('yargs').argv;

    // The tests to run by default
    const defaultTests = [
        'unit-tests/*/*'
    ];

    // Browsers
    let browsers = argv.browsers ?
        argv.browsers.split(',') :
        ['ChromeHeadless'];
    if (argv.browsers === 'all') {
        browsers = Object.keys(browserStackBrowsers);
    }

    const tests = (argv.tests ? argv.tests.split(',') : defaultTests)
        .map(path => `samples/${path}/demo.js`);

    // let files = getFiles();
    let files = require('./karma-files.json');

    let options = {
        basePath: '../', // Root relative to this file
        frameworks: ['qunit'],
        files: files.concat([
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
            // Test templates
            'test/test-template.js',
            {
                pattern: 'test/templates/**/*.js',
                type: 'js',
                watched: false,
                included: true,
                served: true,
                nocache: false
            },

            // Set up
            'test/call-analyzer.js',
            'test/test-controller.js',
            'test/test-utilities.js',
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
            'samples/unit-tests/themes/*/demo.js',


            // --- VISUAL TESTS ---

            // Error #13, renders to other divs than #container. Sets global
            // options.
            'samples/highcharts/demo/bullet-graph/demo.js',
            // Network loading?
            'samples/highcharts/demo/combo-meteogram/demo.js',

            // CSV data, parser fails - why??
            'samples/highcharts/demo/line-ajax/demo.js',

            // Clock
            'samples/highcharts/demo/dynamic-update/demo.js',
            'samples/highcharts/demo/gauge-clock/demo.js',
            'samples/highcharts/demo/gauge-vu-meter/demo.js',

            // Too heavy
            'samples/highcharts/demo/parallel-coordinates/demo.js',
            'samples/highcharts/demo/sparkline/demo.js',

            // Maps
            'samples/maps/demo/map-pies/demo.js', // advanced data
            'samples/maps/demo/us-counties/demo.js', // advanced data
            'samples/maps/demo/data-class-ranges/demo.js', // Google Spreadsheets
            'samples/maps/demo/data-class-two-ranges/demo.js', // Google Spr

            // Unknown error
            'samples/highcharts/boost/scatter-smaller/demo.js',

            // CommonJS
            'samples/highcharts/common-js/browserify/demo.js',
            'samples/highcharts/common-js/webpack/demo.js',

            // Various
            'samples/highcharts/data/google-spreadsheet/demo.js', // advanced demo
            'samples/highcharts/css/exporting/demo.js', // advanced demo
            'samples/highcharts/css/map-dataclasses/demo.js', // Google Spreadsheets
            'samples/highcharts/css/pattern/demo.js' // styled mode, setOptions
        ],
        reporters: ['imagecapture', 'progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_WARN,
        browsers: browsers,
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        plugins: [
            'karma-*',
            require('./karma-imagecapture-reporter.js')
        ],

        formatError: function (s) {
            let ret = s.replace(
                /(\@samples\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+\n)/,
                function (a, b, c) {
                    return `http://utils.highcharts.local/samples/#test/${c}`.cyan + '\n' +
                    '\t' + a.replace(/^@/, '@ ') + '\n<<<splitter>>>';
                }
            );

            ret = s.replace(
                /(samples\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+)/,
                function (a, b, c) {
                    return `http://utils.highcharts.local/samples/#test/${c}`.cyan;
                }
            );

            // Skip the call stack, it's internal QUnit stuff
            ret = ret.split('<<<splitter>>>')[0];

            return ret;
        },

        preprocessors: {
            '**/unit-tests/*/*/demo.js': ['generic'],
            // Preprocess the visual tests
            '**/highcharts/*/*/demo.js': ['generic'],
            '**/maps/*/*/demo.js': ['generic'],
            '**/stock/*/*/demo.js': ['generic']
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
                        /^.*?samples\/(highcharts|stock|maps|unit-tests)\/([a-z0-9\-]+\/[a-z0-9\-]+)\/demo.js$/g,
                        '$1/$2'
                    );

                    if (path.indexOf('unit-tests') !== -1) {
                        if (argv.debug) {
                            if (js.indexOf('Highcharts.setOptions') !== -1) {
                                console.log(
                                    `Warning: ${path} contains Highcharts.setOptions`.yellow
                                );
                            }
                            if (
                                js.indexOf('Highcharts.wrap') !== -1 ||
                                js.indexOf('H.wrap') !== -1
                            ) {
                                console.log(
                                    `Warning: ${path} contains Highcharts.wrap`.yellow
                                );
                            }
                        }
                        done(js);
                        return;
                    }

                    // Skipped from demo.details
                    if (handleDetails(path) === false) {
                        file.path = file.originalPath + '.preprocessed';
                        done(`QUnit.skip('${path}');`);
                        return;
                    }

                    const html = getHTML(path);

                    js = resolveJSON(js);

                    // Don't do intervals (typically for gauge samples, add
                    // point etc)
                    js = js.replace('setInterval', 'Highcharts.noop');

                    // Reset global options
                    let reset = (
                            js.indexOf('Highcharts.setOptions') === -1 &&
                            js.indexOf('Highcharts.getOptions') === -1
                        ) ?
                        '' :
                        `
                        Highcharts.setOptions(
                            JSON.parse(Highcharts.defaultOptionsRaw)
                        );
                        `;

                    // Reset modified callbacks
                    if (js.indexOf('Chart.prototype.callbacks') !== -1) {
                        reset += `
                        Highcharts.Chart.prototype.callbacks =
                            Highcharts.callbacksRaw.slice(0);
                        `;
                    }



                    let assertion;

                    // Set reference image
                    if (argv.reference) {
                        assertion = `
                            let svg = getSVG(chart);

                            if (svg) {
                                __karma__.info({
                                    filename: './samples/${path}/reference.svg',
                                    data: svg
                                });
                                assert.ok(
                                    true,
                                    'Reference created for ${path}'
                                );
                            } else {
                                assert.ok(
                                    false,
                                    '${path}: ' + err
                                );                
                            }
                            done();
                        `;

                    // Reference file doens't exist
                    } else if (!fs.existsSync(
                        `./samples/${path}/reference.svg`
                    )) {
                        console.log(
                        'Reference file doesn\'t exist: '.yellow +
                        ` ./samples/${path}/reference.svg`

                        );
                        file.path = file.originalPath + '.preprocessed';
                        done(`QUnit.skip('${path}');`);
                        return;

                    // Reference file exists, run the comparison
                    } else {

                        try {
                            assertion = `
                                compareToReference(chart, '${path}')
                                    .then(actual => {
                                        assert.strictEqual(
                                            actual,
                                            0,
                                            'Different pixels\\n' +
                                            '- http://utils.highcharts.local/samples/#test/${path}\\n' +
                                            '- samples/${path}/diff.gif'
                                        );
                                        done();
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        done();
                                    });
                            `;
                        } catch (e) {
                            assertion = `
                                assert.ok(false, 'Reference image loaded')
                                done();
                            `;
                        }
                    }


                    js = `

                    QUnit.test('${path}', function (assert) {

                        // console.log('Starting ${path}');

                        // Apply demo.html
                        document.getElementById('demo-html').innerHTML =
                            \`${html}\`;

                        var done = assert.async();
                        ${js}

                        var chart = Highcharts.charts[
                            Highcharts.charts.length - 1
                        ];

                        ${assertion}

                        ${reset}
                    });
                    `;
                    file.path = file.originalPath + '.preprocessed';
                    done(js);
                }
            }]
        }
    };


    if (browsers.some(browser => /^(Mac|Win)\./.test(browser))) {

        console.log(
            'BrowserStack initialized. Please wait while tests are ' +
            'uploaded and VMs prepared...'
        );

        let properties = getProperties();

        options.browserStack = {
            username: properties['browserstack.username'],
            accessKey: properties['browserstack.accesskey']
        };
        options.customLaunchers = browserStackBrowsers;

        // to avoid DISCONNECTED messages when connecting to BrowserStack
        options.browserDisconnectTimeout = 10000; // default 2000
        options.browserDisconnectTolerance = 1; // default 0
        options.browserNoActivityTimeout = 4 * 60 * 1000; // default 10000
        options.captureTimeout = 4 * 60 * 1000; // default 60000
    }

    config.set(options);
};
