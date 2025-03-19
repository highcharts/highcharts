/* eslint-env node, es6 */
/* eslint-disable */
const fs = require('fs');
const path = require('path');

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
                path.join(__dirname, '../../git-ignore-me.properties'), 'utf8'
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

const browserStackBrowsers = {
    'Mac.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '80.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Mac.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '73.0',
        os: 'OS X',
        os_version: 'Mojave'
    },
    'Mac.Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '13.0',
        os: 'OS X',
        os_version: 'Catalina'
    },
    'Win.Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '80.0',
        os: 'Windows',
        os_version: '10'
    },
    'Win.Edge': {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '80.0',
        os: 'Windows',
        os_version: '10',
    },
    'Win.Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '73.0',
        os: 'Windows',
        os_version: '10'
    }
};

module.exports = function (config) {

    const argv = require('yargs').argv;
    const properties = getProperties();

    /**
     * @todo ./ts project is not ready for this. We have to remove global
     * Highcharts namespace first, so we have pure ES6 modules and types.
     * /
    const ChildProcess = require('child_process');
    // Compile tools and tests
    try {
        console.log('Compiling test tools...');
        ChildProcess.execSync(
            'cd "' + process.cwd() + '" && npx tsc -p test'
        );
        console.log('Compiling unit-tests...');
        ChildProcess.execSync(
            'cd "' + process.cwd() + '" && npx tsc -b test/typescript-karma'
        );
    } catch (catchedError) {
        console.error(catchedError);
        return;
    }
    //*/

    // Browsers
    let browsers = argv.browsers ?
        argv.browsers.split(',') :
        [properties['karma.defaultbrowser'] || 'ChromeHeadless'];
    if (argv.browsers === 'all') {
        browsers = Object.keys(browserStackBrowsers);
    }

    const tests = (
        // debugger test
        argv.testsAbsolutePath ?
                argv.testsAbsolutePath.split(',').filter(path => !!path) :
        // specific tests
        argv.tests ?
            argv.tests
                .split(',')
                .filter(path => !!path)
                .map(path => ({
                    pattern: `test/typescript-karma/${path}.test.js`,
                    type: 'module'
                }))
                .concat([{
                    pattern: 'test/typescript-karma/**/!(*.test).js',
                    type: 'module'
                }]) :
            // all tests
            [{
                pattern: 'test/typescript-karma/**/!(demo).js',
                type: 'module'
            }]
    );

    let options = {
        basePath: '../../', // Root relative to this file
        frameworks: ['qunit'],
        files: [].concat([
            // Set up
            'vendor/require.js',
            'test/test-controller.js',
            'test/test-utilities.js',
            'tmp/json-sources.js',
            'test/typescript-karma/karma-fetch.js',
            'test/typescript-karma/karma-setup.js',
            {
                included: false,
                pattern: 'code/**/*.js',
            },
            {
                included: false,
                pattern: 'js/**/*.js',
                type: 'module'
            }
        ], tests),

        reporters: ['progress'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: browsers,
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        reportSlowerThan: 3000,
        plugins: [ 'karma-*' ],

        formatError: function (s) {
            let ret = s;

            // Insert link to utils
            let regex = /(test\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)\/demo\.js:[0-9]+:[0-9]+)/;
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
        }
    };

    if (browsers.some(browser => /^(Mac|Win)\./.test(browser))) {
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
            // 'karma-sharding',
            // 'karma-generic-preprocessor',
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
    } else if (argv.testsAbsolutePath) {
        options.customLaunchers = {
            'ChromeHeadless.Debugging': {
                base: 'ChromeHeadless',
                flags: [
                    '--remote-debugging-port=9333'
                ]
            }
        };
        options.browserDisconnectTimeout = 30 * 60 * 1000;
        options.browserNoActivityTimeout = 30 * 60 * 1000;
    }

    config.set(options);
};
