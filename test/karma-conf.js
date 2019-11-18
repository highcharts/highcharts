/* eslint-env node, es6 */
/* eslint-disable */
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const os = require('os');
const { getLatestCommitShaSync } = require('../tools/gulptasks/lib/git');

const VISUAL_TEST_REPORT_PATH = 'test/visual-test-results.json';
const version = require('../package.json').version;
// Internal reference
const hasJSONSources = {};

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

        if (!properties['browserstack.username']) {
            throw new Error();
        }
    } catch (e) {
        throw new Error(
            'BrowserStack credentials not given. Add BROWSERSTACK_USER and ' +
            'BROWSERSTACK_KEY environment variables or create a git-ignore-me.properties file.'
        );
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
 * Look for Highcharts.getJSON calls in the demos and add hook to local sample data.
 * @param  {String} js
 *         The contents of demo.js
 * @return {String}
 *         JavaScript extended with the sample data.
 */
function resolveJSON(js) {
    const regex = /(\$|Highcharts)\.getJSON\([ \n]*'([^']+)/g;
    let match;
    const codeblocks = [];

    while (match = regex.exec(js)) {
        let src = match[2];

        let innerMatch = src.match(
            /^(https:\/\/cdn.jsdelivr.net\/gh\/highcharts\/highcharts@[a-z0-9\.]+|https:\/\/www.highcharts.com)\/samples\/data\/([a-z0-9\-\.]+$)/
        );

        if (innerMatch) {

            let filename = innerMatch[2];

            let data = fs.readFileSync(
                path.join(
                    __dirname,
                    '..',
                    'samples/data',
                    filename
                ),
                'utf8'
            );

            if (data) {

                if (/json$/.test(filename)) {
                    codeblocks.push(`window.JSONSources['${src}'] = ${data};`);
                }
                if (/csv$/.test(filename)) {
                    codeblocks.push(`window.JSONSources['${src}'] = \`${data}\`;`);
                }
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

const browserStackBrowsers = {
    'Mac.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '76.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Mac.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '68.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Mac.Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '12.1',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Win.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '76.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.Edge': {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: 'insider preview',
        os: 'Windows',
        os_version: '10',
    },
    'Win.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '68.0',
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
    const Babel = require("@babel/core");

    if (argv.ts) {
        const ChildProcess = require('child_process');
        // Compile test tools and samples
        try {
            console.log('Compiling declarations...');
            ChildProcess.execSync(
                'npx gulp jsdoc-dts'
            );
            console.log('Compiling test tools...');
            ChildProcess.execSync(
                'cd "' + process.cwd() + '" && npx tsc -p test'
            );
            console.log('Compiling samples...');
            ChildProcess.execSync(
                'cd "' + process.cwd() + '" && npx tsc -p samples'
            );
        } catch (catchedError) {
            console.error(catchedError);
            return;
        }
    }

    let frameworks = ['qunit'];

    if (argv.oldie) {
        frameworks = []; // Custom framework in test file
    }

    // Browsers
    let browsers = argv.browsers ?
        argv.browsers.split(',') :
        ['ChromeHeadless'];
    if (argv.oldie) {
        browsers = ['Win.IE8'];
    } else if (argv.browsers === 'all') {
        browsers = Object.keys(browserStackBrowsers);
    }

    const browserCount = argv.browsercount || (Math.max(1, os.cpus().length - 2));
    if (!argv.browsers && browserCount && !isNaN(browserCount)  && browserCount > 1) {
        // Sharding / splitting tests across multiple browser instances
        frameworks = [...frameworks, 'sharding'];
        // create a duplicate of the added browsers ${numberOfInstances} times.
        browsers = argv.splitbrowsers ? argv.splitbrowsers.split(',').reduce((browserInstances, current) => {
            for (let i = 0; i < browserCount; i++) {
                browserInstances.push(current);
            }
            return browserInstances;
        }, [])
        : new Array(browserCount).fill('ChromeHeadless');
    } else {
        if (argv.splitbrowsers) {
            browsers = argv.splitbrowsers.split(',');
        }
    }

    const needsTranspiling = browsers.some(browser => browser === 'Win.IE');

    // The tests to run by default
    const defaultTests = argv.oldie ?
        ['unit-tests/oldie/*'] :
        ['unit-tests/*/*'];

    const tests = (argv.tests ? argv.tests.split(',') : defaultTests)
        .filter(path => !!path)
        .map(path => `samples/${path}/demo.js`);

    // Get the files
    let files = require('./karma-files.json');
    if (argv.oldie) {
        files = files.filter(f =>
            f.indexOf('vendor/jquery') !== 0 &&
            f.indexOf('vendor/moment') !== 0 &&
            f.indexOf('vendor/proj4') !== 0 &&
            f.indexOf('node_modules/lolex') !== 0 &&
            f.indexOf('topojson-client') === -1 &&

            // Complains on chart.renderer.addPattern
            f.indexOf('code/modules/pattern-fill.src.js') !== 0 &&
            // Uses classList extensively
            f.indexOf('code/modules/stock-tools.src.js') !== 0
        );
        files.splice(0, 0, 'code/modules/oldie-polyfills.src.js');
        files.splice(2, 0, 'code/modules/oldie.src.js');
    }

    let options = {
        basePath: '../', // Root relative to this file
        frameworks: frameworks,
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
            'test/json-sources.js',
            'test/karma-setup.js'
        ], tests),

        // These ones fail
        exclude: argv.oldie ? [] : [
            // The configuration currently loads classic mode only. Styled mode
            // needs to be a separate instance.
            'samples/unit-tests/series-pie/styled-mode/demo.js',
            // Themes alter the whole default options structure. Set up a
            // separate test suite? Or perhaps somehow decouple the options so
            // they are not mutated for later tests?
            'samples/unit-tests/themes/*/demo.js',

            // --- VISUAL TESTS ---

            // Custom data source
            'samples/highcharts/blog/annotations-aapl-iphone/demo.js',

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
            'samples/highcharts/data/delimiters/demo.js', // data island
            'samples/highcharts/css/exporting/demo.js', // advanced demo
            'samples/highcharts/css/map-dataclasses/demo.js', // Google Spreadsheets
            'samples/highcharts/css/pattern/demo.js', // styled mode, setOptions
            'samples/highcharts/studies/logistics/demo.js', // overriding

            // Failing on Edge only
            'samples/unit-tests/pointer/members/demo.js',

            // Skip the special oldie tests (which don't run QUnit)
            'samples/unit-tests/oldie/*/demo.js',

            // visual tests excluded for now due to failure
            'samples/highcharts/demo/funnel3d/demo.js',
            'samples/highcharts/demo/live-data/demo.js',
            'samples/highcharts/demo/organization-chart/demo.js',
            'samples/highcharts/demo/pareto/demo.js',
            'samples/highcharts/demo/pyramid3d/demo.js',
            'samples/highcharts/demo/synchronized-charts/demo.js',
        ],
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: browsers,
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
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
            '**/unit-tests/*/*/demo.js': ['generic'],
            // Preprocess the visual tests
            '**/highcharts/*/*/demo.js': ['generic'],
            '**/maps/*/*/demo.js': ['generic'],
            '**/stock/*/*/demo.js': ['generic'],
            '**/gantt/*/*/demo.js': ['generic'],
            '**/issues/*/*/demo.js': ['generic']
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

                    // es6 transpiling
                    // browserDetect(req.headers['user-agent']); not working
                    if (needsTranspiling) {
                        try {
                            js = Babel
                                .transformSync(js, {
                                    ast: false,
                                    code: true,
                                    presets: [[
                                        '@babel/preset-env',
                                        {
                                            targets: {
                                                ie: '8'
                                            }
                                        }
                                    ]]
                                })
                                .code;
                        } catch (error) {
                            console.error('Babel transform error:', error);
                        }
                    }

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

                    // unit tests
                    if (path.indexOf('unit-tests') !== -1) {
                        done(js);
                        return;
                    }

                    // Skipped from demo.details
                    if (handleDetails(path) === false) {
                        file.path = file.originalPath + '.preprocessed.js';
                        if (argv.visualcompare) {
                            // QUnit will explode when all tests within a module are skipped. Omitting test instead.
                            done(`console.log('Not adding test ${path} due to being skipped from demo.details');`);
                        } else {
                            done(`QUnit.skip('${path}');`);
                        }
                        return;
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
                            }
                            assert.ok(
                                svg,
                                '${path}: SVG and reference.svg file should be generated'
                            );
                            done();
                        `;

                    } else if (argv.visualcompare) {
                        if (!argv.remotelocation && !fs.existsSync(
                            `./samples/${path}/reference.svg`
                        )) {
                            console.log(
                                'Reference file doesn\'t exist: '.yellow +
                                ` ./samples/${path}/reference.svg`
                            );
                            file.path = file.originalPath + '.preprocessed.js';
                            // QUnit will explode when all tests within a module are skipped. Omitting test instead.
                            done(`console.log('Not adding test ${path} due to non-existing reference.svg file.');`);
                            return;
                        }
                        assertion = `
                        compareToReference(chart, '${path}')
                            .then(actual => {
                                assert.strictEqual(
                                    actual,
                                    0,
                                    'Different pixels\\n' +
                                    '- http://utils.highcharts.local/samples/#test/${path}\\n' +
                                    '- samples/${path}/reference.svg\\n' +
                                    '- samples/${path}/diff.gif'
                                );
                            })
                            .catch(err => {
                                console.error(err);
                            })
                            .finally(() => {
                                done();
                            });
                        `;
                    }
                    file.path = file.originalPath + '.preprocessed.js';
                    const testTemplate = createVisualTestTemplate(argv, path, js, assertion);
                    done(testTemplate);
                }
            }]
        }
    };

    if (argv.reference) {
        saveGitShaToTestReportFile();
        options.referenceRun = true;
    }

    if (argv.visualcompare || argv.reference) {
        options.reporters.push('imagecapture');
        options.imageCapture = {
            resultsOutputPath: VISUAL_TEST_REPORT_PATH,
        };
        options.browserDisconnectTolerance = 1; // default 0
        options.browserDisconnectTimeout = 30000; // default 2000
    }

    if (browsers.some(browser => /^(Mac|Win)\./.test(browser)) || argv.oldie) {
        let properties = getProperties();
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
            pollingTimeout: 5000 // to avoid rate limit errors with browserstack.
        };
        options.customLaunchers = argv.oldie ?
            {
                'Win.IE8': {
                    base: 'BrowserStack',
                    browser: 'ie',
                    browser_version: '8.0',
                    os: 'Windows',
                    os_version: 'XP'
                }
            } :
            browserStackBrowsers;
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
            'karma-generic-preprocessor'
        ];
        if (!argv.oldie) {
            options.plugins.push('karma-qunit');
        }

        options.reporters = ['progress'];

        if (browsers.some(browser => /(Edge)/.test(browser))) {
            // fallback to polling for Edge browsers as websockets disconnects a lot.
            options.transports = ['polling'];
        }

        console.log(
            'BrowserStack initialized. Please wait while tests are uploaded and VMs prepared. ' +
            `Any other test runs must complete before this test run will start. Current Browserstack concurrency rate is ${options.concurrency}.`
        );

    }

    config.set(options);
};

function createVisualTestTemplate(argv, path, js, assertion) {
    let scriptBody = resolveJSON(js);

    // Don't do intervals (typically for gauge samples, add point etc)
    scriptBody = scriptBody.replace('setInterval', 'Highcharts.noop');

    // Force enableSimulation: false
    scriptBody = scriptBody.replace('enableSimulation: true','enableSimulation: false');

    let html = getHTML(path);
    let resets = [];

    // Reset global options, but only if necessary
    if (
        scriptBody.indexOf('Highcharts.setOptions') !== -1 ||
        scriptBody.indexOf('Highcharts.getOptions') !== -1
    ) {
        resets.push('defaultOptions');
    }

    // Reset modified callbacks only if necessary
    if (scriptBody.indexOf('Chart.prototype.callbacks') !== -1) {
        resets.push('callbacks');
    }

    var useFakeTime = path.startsWith('gantt/');
    var startOfMockedTime = Date.UTC(2019, 7, 1);

    resets = JSON.stringify(resets);
    return `
        QUnit.test('${path}', function (assert) {
            // Apply demo.html
            document.getElementById('demo-html').innerHTML = \`${html}\`;
            
            ${useFakeTime ? `var clock = TestUtilities.lolexInstall({ now: ${startOfMockedTime} });` : ''}
            
            /*
             * we expect 2 callbacks if --visualcompare argument is supplied,
             * one for the test comparison and one for checking if chart exists.
             */ 
            var done = assert.async();
            
            ${scriptBody}

            let attempts = 0;
            function waitForChartToLoad() {
                var chart = Highcharts.charts[
                    Highcharts.charts.length - 1
                ];

                if (chart || document.getElementsByTagName('svg').length) {
                    ${assertion ? assertion : `
                        assert.ok(true, 'Chart and SVG should exist.');
                        done();
                    `}
                    assert.test.resets = ${resets};
                } else if (attempts < 50) {
                    setTimeout(waitForChartToLoad, 100);
                    attempts++;
                } else {
                    assert.ok(
                        false,
                        \`Chart async chart test should load within \${attempts} attempts\`
                    );
                    done();
                    assert.test.resets = ${resets};
                }
            }
            waitForChartToLoad();
            
            ${useFakeTime ? 'TestUtilities.lolexUninstall(clock);' : ''}
        });
    `;
}

function saveGitShaToTestReportFile() {
    const metaData = {
        meta: {
            referenceGitSha: getLatestCommitShaSync(),
            referenceVersion: version
        }
    };
    fs.writeFileSync(VISUAL_TEST_REPORT_PATH, JSON.stringify(metaData, null, ' '));
}
