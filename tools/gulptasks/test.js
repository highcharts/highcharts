/*
 * Copyright (C) Highsoft AS
 */

const Gulp = require('gulp');
const Path = require('path');

/* *
 *
 *  Constants
 *
 * */

const KARMA_CONFIG_FILE = Path.join(
    __dirname, '..', '..', 'test', 'karma-conf.js'
);

const LAST_RUN_FILE = Path.join(__dirname, '..', '..', 'test', 'last-run.json');

/* *
 *
 *  Functions
 *
 * */

/**
 * Check that each demo.details has the correct js_wrap setting required for it
 * it to display correctly on jsFiddle.
 *
 * @return {void}
 */
function checkJSWrap() {

    const FS = require('fs');
    const Glob = require('glob');
    const LogLib = require('./lib/log');
    const YAML = require('js-yaml');

    let errors = 0;

    Glob.sync(
        process.cwd() + '/samples/+(highcharts|stock|maps|gantt)/**/demo.html'
    ).forEach(f => {

        const detailsFile = f.replace(/\.html$/, '.details');

        try {
            const details = YAML.safeLoad(
                FS.readFileSync(detailsFile, 'utf-8')
            );
            if (details.js_wrap !== 'b') {
                LogLib.failure('js_wrap not found:', detailsFile);
                errors++;
            }
        } catch (e) {
            LogLib.failure('File not found:', detailsFile);
            errors++;
        }
    });

    if (errors) {
        throw new Error('Missing js_wrap setting');
    }
}

/**
 * @return {void}
 */
function checkSamplesConsistency() {

    const FS = require('fs');
    const LogLib = require('./lib/log');

    const products = [
        { product: 'highcharts' },
        { product: 'stock' },
        { product: 'maps' },
        { product: 'gantt', ignore: ['logistics'] }
    ];

    /**
     * @param {object} product The product information
     * @param {string} product.product Product folder name.
     * @param {array} [product.ignore=[]] List of samples that is not listed
     * in index.htm, that still should exist in the demo folder.
     */
    products.forEach(
        ({ product, ignore = [] }) => {
            const index = FS
                .readFileSync(
                    Path.join('samples', product, 'demo', 'index.htm')
                )
                .toString()
                // Remove comments from the html in index
                .replace(/<!--[\s\S]*-->/gm, '');

            const regex = /href="examples\/([a-z\-0-9]+)\/index.htm"/g;
            const toc = [];

            let matches;

            while ((matches = regex.exec(index)) !== null) {
                toc.push(matches[1]);
            }

            const folders = [];
            FS
                .readdirSync(`./samples/${product}/demo`).forEach(dir => {
                    if (dir.indexOf('.') !== 0 && dir !== 'index.htm') {
                        folders.push(dir);
                    }
                });

            const missingTOC = folders.filter(
                sample => !toc.includes(sample) && !ignore.includes(sample)
            );
            const missingFolders = toc.filter(
                sample => !folders.includes(sample)
            );

            if (missingTOC.length) {
                LogLib.failure(`Found demos that were not added to ./samples/${product}/demo/index.htm`.red);
                missingTOC.forEach(sample => {
                    LogLib.failure(` - ./samples/${product}/demo/${sample}`.red);
                });

                throw new Error('Missing sample in index.htm');
            }

            if (missingFolders.length) {
                LogLib.failure(`Found demos in ./samples/${product}/demo/index.htm that were not present in demo folder`.red);
                missingFolders.forEach(sample => {
                    LogLib.failure(` - ./samples/${product}/demo/${sample}`.red);
                });

                throw new Error('Missing demo');
            }
        }
    );
}

/**
 * @param {string} pattern
 *        Glob pattern
 *
 * @return {number}
 *         Latest modified timestamp
 */
function getModifiedTime(pattern) {

    const FS = require('fs');
    const Glob = require('glob');

    let mtimeMs = 0;

    Glob.sync(pattern).forEach(file => {
        mtimeMs = Math.max(
            mtimeMs,
            FS.statSync(file).mtimeMs
        );
    });

    return mtimeMs;
}

/**
 * @return {boolean}
 *         True if outdated
 */
function shouldRun() {

    const FS = require('fs');
    const LogLib = require('./lib/log');

    // console.log(getCodeHash(__dirname + '/js/**/*.js'));

    const argv = process.argv;
    const lastBuildMTime = getModifiedTime('code/**/*.js');
    const sourceMTime = getModifiedTime('js/**/*.js');
    const unitTestsMTime = getModifiedTime('samples/unit-tests/**/*.*');

    let lastSuccessfulRun = 0;

    if (FS.existsSync(LAST_RUN_FILE)) {
        lastSuccessfulRun = JSON
            .parse(FS.readFileSync(LAST_RUN_FILE))
            .lastSuccessfulRun;
    }

    /*
    console.log(
        'lastBuildMTime', new Date(lastBuildMTime),
        'sourceMTime', new Date(sourceMTime),
        'unitTestsMTime', new Date(unitTestsMTime),
        'lastSuccessfulRun', new Date(lastSuccessfulRun)
    );
    */

    // Arguments passed, always run. No arguments gives [ '_', '$0' ]
    if (Object.keys(argv).length > 2) {
        return true;
    }

    if (lastBuildMTime < sourceMTime) {
        throw new Error(
            '\n✖'.red + ' The files have not been built since ' +
            'the last source code changes. Run ' + 'gulp'.italic +
            ' and try again.'
        );
    } else if (
        sourceMTime < lastSuccessfulRun &&
        unitTestsMTime < lastSuccessfulRun
    ) {
        LogLib.success('✓ Source code and unit tests not modified since the last successful test run.');
        return false;
    }
    return true;
}


/* *
 *
 *  Tasks
 *
 * */

/**
 * Run the test suite.
 *
 * @return {Promise<void>}
 *         Promise to keep
 */
function test() {

    const FS = require('fs');
    const LogLib = require('./lib/log');

    // Get the checksum of all code excluding comments. An idea for smarter
    // checks. If the check sum hasn't changed since last test run, there's no
    // need to run tests again.
    /*
    const getCodeHash = (pattern) => {
        const crypto = require('crypto');
        let hashes = [];
        glob.sync(pattern).forEach(file => {
            let s = fs.readFileSync(file, 'utf8');
            if (typeof s === 'string') {
                s = s.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
                s = crypto.createHash('md5').update(s).digest('hex');
                hashes.push(s);
            }

        });
        let hash = crypto
            .createHash('md5')
            .update(hashes.toString())
            .digest('hex');
        return hash;
    };
    */

    return new Promise((resolve, reject) => {

        const argv = process.argv;

        if (argv.help) {
            LogLib.message(`
HIGHCHARTS TEST RUNNER

Available arguments for 'gulp test':

--browsers
    Comma separated list of browsers to test. Available browsers are
    'ChromeHeadless, Chrome, Firefox, Safari, Edge, IE' depending on what is
    installed on the local system. Defaults to ChromeHeadless.

    In addition, virtual browsers from Browserstack are supported. They are
    prefixed by the operating system. Available BrowserStack browsers are
    'Mac.Chrome, Mac.Firefox, Mac.Safari, Win.Chrome, Win.Edge, Win.Firefox,
    Win.IE'.

    A shorthand option, '--browsers all', runs all BroserStack machines.

--debug
    Print some debugging info.

--tests
    Comma separated list of tests to run. Defaults to '*.*' that runs all tests
    in the 'samples/' directory.
    Example: 'gulp test --tests unit-tests/chart/*' runs all tests in the chart
    directory.

`);
            return;
        }

        checkSamplesConsistency();
        checkJSWrap();

        if (shouldRun()) {

            LogLib.message('Run `gulp test --help` for available options');

            const Server = require('karma').Server;
            const PluginError = require('plugin-error');

            new Server({
                configFile: KARMA_CONFIG_FILE,
                singleRun: true
            }, err => {
                if (err === 0) {
                    resolve();

                    // Register last successful run (only when running without
                    // arguments)
                    if (Object.keys(argv).length <= 2) {
                        FS.writeFileSync(
                            LAST_RUN_FILE,
                            JSON.stringify({ lastSuccessfulRun: Date.now() })
                        );
                    }
                } else {
                    reject(new PluginError('karma', {
                        message: 'Tests failed'
                    }));
                }
            }).start();
        } else {
            resolve();
        }
    });
}

Gulp.task('test', Gulp.series('scripts', test));
