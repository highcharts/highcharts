/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, valid-jsdoc:0 */
/* eslint-disable func-style */

'use strict';
const colors = require('colors');
const exec = require('child_process').exec;
const glob = require('glob');
const gulp = require('gulp');
const argv = require('yargs').argv;
const fs = require('fs');
const yaml = require('js-yaml');
const {
    join,
    relative,
    sep
} = require('path');
const {
    getFilesInFolder
} = require('highcharts-assembler/src/build.js');
const {
    getFile,
    removeDirectory,
    writeFile,
    writeFilePromise
} = require('highcharts-assembler/src/utilities.js');
const {
    scripts,
    getBuildScripts
} = require('./tools/build.js');
const compile = require('./tools/compile.js').compile;
const {
    copyFile,
    promisify
} = require('./tools/filesystem.js');
const {
    asyncForeach,
    uploadFiles
} = require('./tools/upload.js');
const ProgressBar = require('./tools/progress-bar.js');
/**
 * Creates a set of ES6-modules which is distributable.
 * @return {undefined}
 */
const buildESModules = () => {
    const {
        buildModules
    } = require('highcharts-assembler/src/build.js');
    buildModules({
        base: './js/',
        output: './code/',
        type: 'classic'
    });
};
const sass = require('node-sass');
const sassRender = promisify(sass.render);

/**
 * Executes a single terminal command and returns when finished.
 * Outputs stdout to the console.
 * @param {string} command Command to execute in terminal
 * @return {string} Returns all output to the terminal in the form of a string.
 */
const commandLine = command => new Promise((resolve, reject) => {
    const cli = exec(command, (error, stdout) => {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log('Command finished: ' + command);
            resolve(stdout);
        }
    });
    cli.stdout.on('data', data => console.log(data.toString()));
});

const compileSingleStyle = fileName => {
    const input = './css/' + fileName;
    const output = './code/css/' + fileName.replace('.scss', '.css');
    return Promise
        .resolve()
        .then(() => sassRender({
            file: input,
            outputStyle: 'expanded'
        }))
        .then(result => writeFilePromise(output, result.css));
};

/**
 * Left pad a string
 * @param  {string} str    The string we want to pad.
 * @param  {string} char   The character we want it to be padded with.
 * @param  {number} length The length of the resulting string.
 * @return {string}        The string with padding on left.
 */
const leftPad = (str, char, length) => char.repeat(length - str.length) + str;

/**
 * Returns time of date as a string in the format of HH:MM:SS
 * @param  {Date} d The date object we want to get the time from
 * @return {string}   The string represantation of the Date object.
 */
const toTimeString = d => {
    const pad = s => leftPad(s, '0', 2);
    return pad('' + d.getHours()) + ':' + pad('' + d.getMinutes()) + ':' + pad('' + d.getSeconds());
};

/**
 * Creates CSS files
 *
 * @return {Promise}
 *         Promise to keep
 */
function styles() {
    const promisesCopyGfx = getFilesInFolder('./gfx', true)
        .map(path => copyFile(join('./gfx', path), join('./code/gfx', path)));
    const promisesCompileStyles = getFilesInFolder('./css', true)
        .map(file => compileSingleStyle(file));
    const promises = [].concat(promisesCopyGfx, promisesCompileStyles);
    return Promise.all(promises).then(() => {
        console.log('Built CSS files from SASS.'.cyan);
    });
}
gulp.task('styles', styles);

/**
 * @private
 * Tests whether the code is in sync with source.
 *
 * @return {boolean}
 *         True, if code is out of sync.
 */
function shouldBuild() {
    const getModifiedTime = fsPattern => {
        let modifyTime = 0;
        glob.sync(fsPattern)
            .forEach(file => {
                modifyTime = Math.max(modifyTime, fs.statSync(file).mtimeMs);
            });
        return modifyTime;
    };
    const buildPath = join(__dirname, 'code', '**', '*.js');
    const sourcePath = join(__dirname, 'js', '**', '*.js');
    const latestBuildTime = getModifiedTime(buildPath);
    const latestSourceTime = getModifiedTime(sourcePath);
    return (latestBuildTime <= latestSourceTime);
}

/**
 * Updates node packages.
 *
 * @return {Promise}
 *         Promise to keep.
 */
function update() {

    const configurationPath = join('node_modules', '_update.json');
    const now = (new Date()).getTime();

    let configuration = {
        checkFrequency: 'weekly',
        lastCheck: 0
    };

    if (fs.existsSync(configurationPath)) {
        configuration = JSON.parse(fs.readFileSync(configurationPath));
    }

    let minimumTime = now;

    switch (configuration.checkFrequency) {
        default:
        case 'weekly':
            minimumTime -= Date.UTC(1970, 0, 8);
            break;
        case 'monthly':
            minimumTime -= Date.UTC(1970, 0, 29);
            break;
        case 'daily':
            minimumTime -= Date.UTC(1970, 0, 2);
            break;
        case 'hourly':
            minimumTime -= Date.UTC(1970, 0, 1, 1);
            break;
    }

    if (configuration.lastCheck <= minimumTime) {

        configuration.lastCheck = now;

        fs.writeFileSync(configurationPath, JSON.stringify(configuration));

        console.log(
            '[' + colors.gray(toTimeString(new Date())) + ']',
            'Updating packages...'
        );

        return commandLine('npm i');
    }

    return Promise.resolve();
}
gulp.task('update', update);

/**
 * Update the vendor files for distribution
 */
function updateVendor() {

    console.log((
        'Note: This task only copies the files into the vendor folder.\n' +
        'To upgrade, run npm update jspdf-yworks && npm update svg2pdf.js`'
    ).yellow);

    const promises = [
        [
            './node_modules/jspdf-yworks/dist/jspdf.debug.js',
            './vendor/jspdf.src.js'
        ],
        [
            './node_modules/jspdf-yworks/dist/jspdf.min.js',
            './vendor/jspdf.js'
        ],
        [
            './node_modules/svg2pdf.js/dist/svg2pdf.js',
            './vendor/svg2pdf.src.js'
        ],
        [
            './node_modules/svg2pdf.js/dist/svg2pdf.min.js',
            './vendor/svg2pdf.js'
        ]
    ].map(([source, target]) => copyFile(source, target));

    return Promise.all(promises);

}
gulp.task('update-vendor', updateVendor);

/**
 * Gulp task to run the building process of distribution files. By default it
 * builds all the distribution files. Usage: "gulp build".
 *
 * - `--file` Optional command line argument. Use to build a one or sevral
 *   files. Usage: "gulp build --file highcharts.js,modules/data.src.js"
 *
 * - `--force` Optional CLI argument to force a rebuild of scripts.
 *
 * @todo add --help command to inform about usage.
 *
 * @return {Promise}
 */
function scriptsWatch() {
    const options = {
        debug: argv.d || false,
        files: (
            (argv.file) ?
                argv.file.split(',') :
                null
        ),
        type: (argv.type) ? argv.type : null,
        watch: argv.watch || false
    };
    const {
        fnFirstBuild,
        mapOfWatchFn
    } = getBuildScripts(options);
    if (shouldBuild() ||
        (argv.force && !argv.watch) ||
        process.env.HIGHCHARTS_DEVELOPMENT_GULP_SCRIPTS
    ) {
        process.env.HIGHCHARTS_DEVELOPMENT_GULP_SCRIPTS = true;
        fnFirstBuild();
        delete process.env.HIGHCHARTS_DEVELOPMENT_GULP_SCRIPTS;
        console.log('Built JS files from modules.'.cyan);
    } else {
        console.log('✓'.green, 'Code up to date.'.gray);
    }
    if (options.watch) {
        Object.keys(mapOfWatchFn).forEach(key => {
            const fn = mapOfWatchFn[key];
            gulp.watch(key).on('change', path => fn({ path, type: 'change' }));
        });
    }

    return Promise.resolve();
}
gulp.task('scripts', gulp.series(gulp.parallel('update'), scriptsWatch));

/**
 * Gulp task to execute ESLint. Pattern defaults to './js/**".'
 * @parameter {string} -p Command line parameter to set pattern. To lint sample
 *     files, see the lintSamples function.
 * @return undefined Returns nothing
 */
const lint = () => {
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine({
        fix: argv.fix
    });
    const formatter = cli.getFormatter();
    const pattern = (typeof argv.p === 'string') ? [argv.p] : ['./js/**/*.js'];
    const report = cli.executeOnFiles(pattern);
    if (argv.fix) {
        CLIEngine.outputFixes(report);
    }
    console.log(formatter(report.results));
};
gulp.task('lint', gulp.series(gulp.parallel('update'), lint));

/**
 * Gulp task to execute ESLint on samples.
 * @parameter {string} -p Command line parameter to set pattern. Example usage
 *     gulp lint -p './samples/**'
 * @return undefined Returns nothing
 */
const lintSamples = () => {
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine({
        ignorePattern: ['./samples/highcharts/common-js/*/demo.js']
    });
    const formatter = cli.getFormatter();
    const report = cli.executeOnFiles([
        './samples/*/*/*/demo.js',
        './samples/*/*/*/test.js',
        './samples/*/*/*/unit-tests.js'
    ]);
    console.log(formatter(report.results));
};
gulp.task('lint-samples', gulp.series(gulp.parallel('update'), lintSamples));

/**
 * Run the test suite.
 */
gulp.task('test', gulp.series(gulp.parallel('styles', 'scripts'), done => {

    const lastRunFile = __dirname + '/test/last-run.json';

    const getModifiedTime = pattern => {
        let mtimeMs = 0;
        glob.sync(pattern).forEach(file => {
            mtimeMs = Math.max(
                mtimeMs,
                fs.statSync(file).mtimeMs
            );
        });
        return mtimeMs;
    };

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

    const shouldRun = () => {

        // console.log(getCodeHash(__dirname + '/js/**/*.js'));

        const lastBuildMTime = getModifiedTime(__dirname + '/code/**/*.js');
        const sourceMTime = getModifiedTime(__dirname + '/js/**/*.js');
        const unitTestsMTime = getModifiedTime(__dirname + '/samples/unit-tests/**/*.*');

        let lastSuccessfulRun = 0;

        if (fs.existsSync(lastRunFile)) {
            lastSuccessfulRun = require(lastRunFile).lastSuccessfulRun;
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
            console.log('\n✓'.green + ' Source code and unit tests not modified since the last successful test run.\n'.gray);
            return false;
        }
        return true;
    };

    const checkSamplesConsistency = () => {
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
        products.forEach(({ product, ignore = [] }) => {
            const index = fs.readFileSync(
                `./samples/${product}/demo/index.htm`,
                'utf8'
            )
                // Remove comments from the html in index
                .replace(/<!--[\s\S]*-->/gm, '');

            const regex = /href="examples\/([a-z\-0-9]+)\/index.htm"/g;
            const toc = [];

            let matches;

            while ((matches = regex.exec(index)) !== null) {
                toc.push(matches[1]);
            }

            const folders = [];
            fs.readdirSync(`./samples/${product}/demo`).forEach(dir => {
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
                console.log(`Found demos that were not added to ./samples/${product}/demo/index.htm`.red);
                missingTOC.forEach(sample => {
                    console.log(` - ./samples/${product}/demo/${sample}`.red);
                });

                throw new Error('Missing sample in index.htm');
            }

            if (missingFolders.length) {
                console.log(`Found demos in ./samples/${product}/demo/index.htm that were not present in demo folder`.red);
                missingFolders.forEach(sample => {
                    console.log(` - ./samples/${product}/demo/${sample}`.red);
                });

                throw new Error('Missing demo');
            }
        });

    };

    // Check that each demo.details has the correct js_wrap setting required for
    // it to display correctly on jsFiddle.
    const checkJSWrap = () => {
        glob(
            'samples/+(highcharts|stock|maps|gantt)/**/demo.html',
            (err, files) => {
                if (err) {
                    throw err;
                }
                let errors = 0;
                files.forEach(f => {
                    const detailsFile = f.replace(/\.html$/, '.details');

                    try {
                        const details = yaml.safeLoad(
                            fs.readFileSync(detailsFile, 'utf-8')
                        );
                        if (details.js_wrap !== 'b') {
                            console.log(`js_wrap not found: ${detailsFile}`.red);
                            errors++;
                        }
                    } catch (e) {
                        console.log(`File not found: ${detailsFile}`.red);
                        errors++;
                    }
                });
                if (errors) {
                    throw new Error('Missing js_wrap setting');
                }
            }
        );
    };


    if (argv.help) {
        console.log(`
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

        console.log('Run ' + 'gulp test --help'.cyan + ' for available options');

        const Server = require('karma').Server;
        const PluginError = require('plugin-error');
        new Server({
            configFile: __dirname + '/test/karma-conf.js',
            singleRun: true
        }, err => {
            if (err === 0) {
                done();

                // Register last successful run (only when running without
                // arguments)
                if (Object.keys(argv).length <= 2) {
                    fs.writeFileSync(
                        lastRunFile,
                        JSON.stringify({ lastSuccessfulRun: Date.now() })
                    );
                }
            } else {
                done(new PluginError('karma', {
                    message: 'Tests failed'
                }));
            }
        }).start();
    } else {
        done();
    }
}));

/**
 * Run the nightly. The task spawns a child process running node.
 */
gulp.task('nightly', function () {
    const spawn = require('child_process').spawn;
    spawn('node', ['nightly.js'].concat(process.argv.slice(3)), {
        cwd: 'utils/samples',
        stdio: 'inherit'
    });
});


/**
 * Automated generation for internal Class reference.
 * Run with --watch argument to watch for changes in the JS files.
 */
const generateClassReferences = ({ templateDir, destination }) => {
    const jsdoc = require('gulp-jsdoc3');
    const sourceFiles = [
        'README.md',
        './js/parts/Utilities.js',
        './js/parts/Axis.js',
        './js/parts/Chart.js',
        './js/parts/Color.js',
        './js/parts/DataGrouping.js',
        './js/parts/Dynamics.js',
        './js/parts/Globals.js',
        './js/parts/Interaction.js',
        './js/parts/Legend.js',
        './js/parts/Options.js',
        './js/parts/Point.js',
        './js/parts/Pointer.js',
        './js/parts/PlotLineOrBand.js',
        './js/parts/Series.js',
        './js/parts/StockChart.js',
        './js/parts/SVGRenderer.js',
        './js/parts/Tick.js',
        './js/parts/Time.js',
        './js/parts-gantt/GanttChart.js',
        './js/parts-gantt/TreeGrid.js',
        './js/parts-map/GeoJSON.js',
        './js/parts-map/Map.js',
        './js/parts-map/MapNavigation.js',
        './js/parts-map/MapSeries.js',
        './js/modules/drilldown.src.js',
        './js/modules/exporting.src.js',
        './js/modules/export-data.src.js',
        './js/modules/data.src.js',
        './js/modules/offline-exporting.src.js',
        './js/modules/pattern-fill.src.js',
        './js/modules/sonification/*.js',
        './js/annotations/annotations.src.js'
        /*
        './js/annotations/eventEmitterMixin.js',
        './js/annotations/MockPoint.js',
        './js/annotations/ControlPoint.js',
        './js/annotations/controllable/controllableMixin.js',
        './js/annotations/controllable/ControllableCircle.js',
        './js/annotations/controllable/ControllableImage.js',
        './js/annotations/controllable/ControllableLabel.js',
        './js/annotations/controllable/ControllablePath.js',
        './js/annotations/controllable/ControllableRect.js',
        './js/annotations/types/CrookedLine.js',
        './js/annotations/types/ElliottWave.js',
        './js/annotations/types/Tunnel.js',
        './js/annotations/types/Fibonacci.js',
        './js/annotations/types/InfinityLine.js',
        './js/annotations/types/Measure.js',
        './js/annotations/types/Pitchfork.js',
        './js/annotations/types/VerticalLine.js'*/
    ];
    const optionsJSDoc = {
        navOptions: {
            theme: 'highsoft'
        },
        opts: {
            destination,
            private: false,
            template: templateDir + '/template'
        },
        plugins: [
            templateDir + '/plugins/add-namespace',
            templateDir + '/plugins/markdown',
            templateDir + '/plugins/sampletag'
        ],
        templates: {
            logoFile: 'img/highcharts-logo.svg',
            systemName: 'Highcharts',
            theme: 'highsoft'
        }
    };
    const message = {
        success: colors.green('Created class-reference')
    };
    return new Promise((resolve, reject) => {
        gulp.src(sourceFiles, { read: false })
            .pipe(jsdoc(optionsJSDoc, function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(message.success);
                    resolve(message.success);
                }
            }));
    });
};

/**
 * Compile the JS files in the /code folder
 */
const compileScripts = (args = {}) => {
    const sourceFolder = './code/';
    // Compile all files ending with .src.js.
    // Do not compile files in ./es-modules or ./js/es-modules.
    const isSourceFile = path => (
        path.endsWith('.src.js') && !path.includes('es-modules')
    );
    const files = (
        (args.files) ?
            args.files :
            getFilesInFolder(sourceFolder, true, '').filter(isSourceFile)
    );
    return compile(files, sourceFolder);
};

/**
 * Compile the JS files in the /code folder
 */
const compileLib = () => {
    const sourceFolder = './vendor/';
    const files = ['canvg.src.js', 'rgbcolor.src.js'];
    return compile(files, sourceFolder)
        .then(console.log);
};

const cleanCode = () => {
    const {
        removeFile
    } = require('highcharts-assembler/src/utilities.js');
    const codeFolder = './code/';
    const files = getFilesInFolder(codeFolder, true, '');
    const keep = ['.gitignore', '.htaccess', 'css/readme.md', 'js/modules/readme.md', 'js/readme.md', 'modules/readme.md', 'readme.txt'];
    const promises = files
        .filter(file => keep.indexOf(file) === -1)
        .map(file => removeFile(codeFolder + file));
    return Promise.all(promises)
        .then(() => console.log('Successfully removed code directory.'));
};

const cleanDist = () => removeDirectory('./build/dist')
    .then(() => {
        console.log('Successfully removed dist directory.');
    })
    .catch(() => {
        console.log('Tried to remove ./build/dist but it was never there. Moving on...');
    });

const cleanApi = () => removeDirectory('./build/api')
    .then(() => {
        console.log('Successfully removed api directory.');
    });
gulp.task('clean-api', cleanApi);

const copyToDist = () => {
    const sourceFolder = 'code/';
    const distFolder = 'build/dist/';
    const folders = [{
        from: 'gfx',
        to: 'gfx'
    }, {
        from: 'css',
        to: 'code/css'
    }];
    // Additional files to include in distribution. // Map of pathTo to pathFrom
    let additionals = {
        'code/lib/canvg.js': 'vendor/canvg.js',
        'code/lib/canvg.src.js': 'vendor/canvg.src.js',
        'code/lib/jspdf.js': 'vendor/jspdf.js',
        'code/lib/jspdf.src.js': 'vendor/jspdf.src.js',
        'code/lib/rgbcolor.js': 'vendor/rgbcolor.js',
        'code/lib/rgbcolor.src.js': 'vendor/rgbcolor.src.js',
        'code/lib/svg2pdf.js': 'vendor/svg2pdf.js',
        'code/lib/svg2pdf.src.js': 'vendor/svg2pdf.src.js'
    };
    // Files that should not be distributed with certain products
    const filter = {
        highcharts: [
            'highcharts-gantt.js',
            'highmaps.js',
            'highstock.js',
            'indicators/',
            'modules/canvasrenderer.experimental.js',
            'modules/map.js',
            'modules/map-parser.js'
        ].map(str => new RegExp(str)),
        highstock: [
            'highcharts.js',
            'highcharts-gantt.js',
            'highmaps.js',
            'modules/broken-axis.js',
            'modules/canvasrenderer.experimental.js',
            'modules/gantt.js',
            'modules/map.js',
            'modules/map-parser.js'
        ].map(str => new RegExp(str)),
        highmaps: [
            'highcharts-gantt.js',
            'highstock.js',
            'indicators/',
            'modules/broken-axis.js',
            'modules/canvasrenderer.experimental.js',
            'modules/gantt.js',
            'modules/map-parser.js',
            'modules/series-label.js',
            'modules/solid-gauge.js'
        ].map(str => new RegExp(str)),
        gantt: [
            'highcharts-3d.js',
            'highcharts-more.js',
            'highmaps.js',
            'highstock.js',
            'indicators/',
            'modules/map.js',
            'modules/stock.js',
            'modules/canvasrenderer.experimental.js',
            'modules/map-parser.js',
            'modules/series-label.js',
            'modules/solid-gauge.js'
        ].map(str => new RegExp(str))
    };

    // Copy source files to the distribution packages.
    const codeFiles = getFilesInFolder(sourceFolder, true, '')
        .filter(path => (
            path.endsWith('.js') ||
            path.endsWith('.js.map') ||
            path.endsWith('.css')
        ))
        .reduce((obj, path) => {
            const source = sourceFolder + path;
            const filename = path.replace('.src.js', '.js').replace('js/', '');
            ['highcharts', 'highstock', 'highmaps', 'gantt'].forEach(lib => {
                const filters = filter[lib];
                const include = !filters.find(regex => regex.test(filename));
                if (include) {
                    const target = distFolder + lib + '/code/' + path;
                    obj[target] = source;
                }
            });
            return obj;
        }, {});

    // Add additional files in folders to copy list
    additionals = folders.reduce((map, folder) => {
        const { from, to } = folder;
        getFilesInFolder(from, true, '')
            .forEach(filename => {
                map[join(to, filename)] = join(from, filename);
            });
        return map;
    }, additionals);

    const additionalFiles = Object.keys(additionals).reduce((obj, file) => {
        ['highcharts', 'highstock', 'highmaps', 'gantt'].forEach(lib => {
            const source = additionals[file];
            const target = `${distFolder}${lib}/${file}`;
            obj[target] = source;
        });
        return obj;
    }, {});

    const files = Object.assign({}, additionalFiles, codeFiles);
    const promises = Object.keys(files).map(target => {
        const source = files[target];
        return copyFile(source, target);
    });
    return Promise.all(promises);
};

const getBuildProperties = () => {
    const {
        regexGetCapture
    } = require('highcharts-assembler/src/dependencies.js');
    const buildProperties = getFile('./build.properties');
    // @todo Get rid of build.properties and perhaps use package.json in stead.
    return {
        date: regexGetCapture(/highcharts\.product\.date=(.+)/, buildProperties),
        version: regexGetCapture(/highcharts\.product\.version=(.+)/, buildProperties)
    };
};

const createProductJS = () => {
    const path = './build/dist/products.js';
    const buildProperties = getBuildProperties();
    // @todo Add reasonable defaults
    const date = buildProperties.date || '';
    const version = buildProperties.version || '';
    const content = `var products = {
    "Highcharts": {
        "date": "${date}",
        "nr": "${version}"
    },
    "Highstock": {
        "date": "${date}",
        "nr": "${version}"
    },
    "Highmaps": {
        "date": "${date}",
        "nr": "${version}"
    },
    "Highcharts Gantt": {
        "date": "${date}",
        "nr": "${version}"
    }
}`;
    writeFile(path, content);
};

/**
 * Returns a string which tells the time difference between to dates.
 * Difference is formatted as xh xm xs xms. Where x is a number.
 * @param  {Date} d1 First date
 * @param  {Date} d2 Second date
 * @return {string} The time difference between the two dates.
 */
const timeDifference = (d1, d2) => {
    const time = [];
    const seconds = 1000;
    const minutes = 60 * seconds;
    const hours = 60 * minutes;
    let diff = d2 - d1;
    let x = 0;
    if (diff > hours) {
        x = Math.floor(diff / hours);
        diff -= x * hours;
        time.push(x + 'h');
    }
    if (diff > minutes || (time.length > 0 && diff > 0)) {
        x = Math.floor(diff / minutes);
        diff -= x * minutes;
        time.push(x + 'm');
    }
    if (diff > seconds || (time.length > 0 && diff > 0)) {
        x = Math.floor(diff / seconds);
        diff -= x * seconds;
        time.push(x + 's');
    }
    if (diff > 0 || time.length === 0) {
        time.push(diff + 'ms');
    }
    return time.join(' ');
};

/**
 * Mirrors the same feedback which gulp gives when executing its tasks.
 * Says when a task started, when it finished, and how long it took.
 * @param  {string} name Name of task which is being executed.
 * @param  {string} task A function to execute
 * @return {*}      Returns whatever the task function returns when it is finished.
 */
const gulpify = (name, task) => {
    // const colors = require('colors');
    const isPromise = value => (
        typeof value === 'object' &&
        typeof value.then === 'function'
    );
    return function (...args) {
        const d1 = new Date();
        console.log('[' + colors.gray(toTimeString(d1)) + '] Starting \'' + colors.cyan(name) + '\'...');
        let result = task(...args);
        if (!isPromise(result)) {
            result = Promise.resolve(result);
        }
        return result.then(() => {
            const d2 = new Date();
            console.log('[' + colors.gray(toTimeString(d2)) + '] Finished \'' + colors.cyan(name) + '\' after ' + colors.blue(timeDifference(d1, d2)));
        });
    };
};

const filesize = () => {
    const sourceFolder = './code/';
    // @todo Correct type names to classic and styled and rename the param to
    // 'mode'
    const types = argv.type ? [argv.type] : ['classic', 'css'];
    const filenames = argv.file ? argv.file.split(',') : ['highcharts.src.js'];
    const files = filenames.reduce((arr, name) => {
        const p = types.map(t => (t === 'css' ? 'js/' : '') + name);
        return arr.concat(p);
    }, []);
    const getGzipSize = content => {
        const gzipSize = require('gzip-size');
        return gzipSize.sync(content);
    };
    // const pad = (str, x) => ' '.repeat(x) + str;
    const padRight = (str, x) => str + ' '.repeat(x - str.length);
    const printRow = (sizes, content) => content.map((c, i) => padRight(c.toString(), sizes[i])).join('');
    const report = (name, current, head) => {
        const colsizes = [10, 10, 10, 10];
        const diff = (a, b) => {
            const d = a - b;
            const sign = d > 0 ? '+' : '';
            // const color = diff > 0 ? 'yellow' : 'green';
            return sign + d;
        };
        console.log([
            '',
            colors.cyan(name),
            printRow(colsizes, ['', 'gzipped', 'compiled', 'size']),
            printRow(colsizes, ['New:', current.gzip, current.compiled, current.size]),
            printRow(colsizes, ['HEAD:', head.gzip, head.compiled, head.size]),
            printRow(colsizes, ['Diff:', diff(current.gzip, head.gzip) + 'B', diff(current.compiled, head.compiled) + 'B', diff(current.size, head.size) + 'B']),
            ''
        ].join('\n'));
    };

    const runFileSize = (obj, key) => Promise
        .resolve(scripts())
        .then(() => compile(files, sourceFolder))
        .then(() => files.reduce(
            (o, n) => {
                const filename = n.replace('.src.js', '.js');
                const compiled = getFile(sourceFolder + filename);
                const content = getFile(sourceFolder + n);
                if (!o[filename]) {
                    o[filename] = {};
                }
                o[filename][key] = {
                    gzip: getGzipSize(compiled),
                    size: content.length,
                    compiled: compiled.length
                };
                return o;
            }, obj
        ));

    return runFileSize({}, 'new')
        .then(obj => commandLine('git stash')
            .then(() => obj)) // Pass obj to next function
        .then(obj => runFileSize(obj, 'head'))
        .then(obj => commandLine('git stash apply && git stash drop')
            .then(() => obj)) // Pass obj to next function
        .then(obj => {
            const keys = Object.keys(obj);
            keys.forEach(key => {
                const values = obj[key];
                report(key, values.new, values.head);
            });
        });
};

/**
 * Run remaining dist tasks in build.xml.
 * @return {Promise} Returns a promise which resolves when scripts is finished.
 */
const antDist = () => commandLine('ant dist');

/**
 * Gzip a single file.
 * @param {string} file Path to input file.
 * @param {string} output Path to where output the result.
 * @return {undefined}
 * TODO Promisify to use in dist task.
 */
/*
const gzipFile = (file, output) => {
    const zlib = require('zlib');
    const gzip = zlib.createGzip();
    const inp = fs.createReadStream(file);
    const out = fs.createWriteStream(output);
    inp.pipe(gzip).pipe(out);
};
*/

const getDirectories = path => fs
    .readdirSync(path)
    .filter(file => fs
        .lstatSync(path + file)
        .isDirectory());

const replaceAll = (str, search, replace) => str.split(search).join(replace);

const assembleSample = (template, content) => Object
    .keys(content)
    .reduce(
        (str, key) => str.replace('@demo.' + key + '@', content[key]),
        template
    );

const createExamples = (title, samplesFolder, output) => {
    const template = getFile('samples/template-example.htm');
    const samples = getDirectories(samplesFolder);
    const convertURLToLocal = str => {
        const localPath = 'src="../../code/';
        str = replaceAll(str, 'src="https://code.highcharts.com/stock/', localPath);
        str = replaceAll(str, 'src="https://code.highcharts.com/maps/', localPath);
        str = replaceAll(str, 'src="https://code.highcharts.com/gantt/', localPath);
        str = replaceAll(str, 'src="https://code.highcharts.com/', localPath);
        str = replaceAll(str, '../../js/mapdata', 'src="https://code.highcharts.com/mapdata');
        return str;
    };
    samples.forEach(name => {
        const pathFolder = samplesFolder + name + '/';
        const contents = ['html', 'css', 'js'].reduce((obj, key) => {
            const content = getFile(pathFolder + 'demo.' + key);
            obj[key] = content ? content : '';
            return obj;
        }, {});
        contents.title = title;
        let sample = assembleSample(template, contents);
        sample = convertURLToLocal(sample);
        writeFile(output + name + '/index.htm', sample);
    });
    const index = getFile(samplesFolder + 'index.htm');
    writeFile(output + '../index.htm', index);
};

const copyFolder = (input, output) => {
    const files = getFilesInFolder(input);
    const promises = files.map(file => copyFile(input + file, output + file));
    return Promise.all(promises)
        .then(() => console.log('Copied folder ' + input + ' to ' + output));
};

const copyGraphicsToDist = () => {
    const dist = 'build/dist/';
    const promises = ['highcharts', 'highstock', 'highmaps', 'gantt']
        .map(lib => copyFolder('samples/graphics/', dist + lib + '/graphics/'));
    return Promise.all(promises)
        .then(() => console.log('Copied all graphics to dist folders.'));
};

const createAllExamples = () => new Promise(resolve => {
    const config = {
        Highcharts: {
            samplesFolder: 'samples/highcharts/demo/',
            output: 'build/dist/highcharts/examples/'
        },
        Highstock: {
            samplesFolder: 'samples/stock/demo/',
            output: 'build/dist/highstock/examples/'
        },
        Highmaps: {
            samplesFolder: 'samples/maps/demo/',
            output: 'build/dist/highmaps/examples/'
        },
        'Highcharts Gantt': {
            samplesFolder: 'samples/gantt/demo/',
            output: 'build/dist/gantt/examples/'
        }
    };
    Object.keys(config).forEach(lib => {
        const c = config[lib];
        createExamples(lib, c.samplesFolder, c.output);
    });
    resolve();
});

const generateAPI = (input, output, onlyBuildCurrent) => new Promise((resolve, reject) => {
    const generate = require('highcharts-api-docs');
    const message = {
        start: 'Started generating API documentation.',
        noSeries: 'Missing series in tree.json. Run merge script.',
        noTree: 'Missing tree.json. This task is dependent upon the jsdoc task.',
        success: 'Finished with my Special api.'
    };
    console.log(message.start);
    if (fs.existsSync(input)) {
        const json = JSON.parse(fs.readFileSync(input, 'utf8'));
        if (!json.series) {
            console.log(message.noSeries);
            reject(new Error(message.noSeries));
        }
        generate(json, output, onlyBuildCurrent, () => {
            console.log(message.success);
            resolve(message.success);
        });
    } else {
        console.log(message.noTree);
        reject(message.noTree);
    }
});

/**
 * Some random tests for tree.json's consistency
 */
const testTree = treeFile => new Promise((resolve, reject) => {
    const tree = JSON.parse(fs.readFileSync(treeFile, 'utf8'));
    if (Object.keys(tree.plotOptions.children).length < 66) {
        reject(new Error('Tree.json should contain at least 66 series types'));
        // } else if (Object.keys(tree.plotOptions.children.pie.children).length < 10) {
        //    reject('Tree.json should contain at least X properties for pies');
    } else {
        resolve();
    }
});

/**
 * Creates the Highcharts API
 *
 * @param {object} options The options for generating the API
 * @param {string} options.treeFile Location of the json file to generate the
 *      API from.
 * @param {string} options.output Location of where to output resulting API
 * @param {boolean} options.onlyBuildCurrent Whether or not to build only
 *  only latest version or all of them.
 * @return {Promise} A Promise which resolves into undefined when done.
 */
const generateAPIDocs = ({ treeFile, output, onlyBuildCurrent }) => {
    const message = {
        successJSDoc: colors.green('Created tree.json')
    };
    const sourceFiles = [
        './js/annotations',
        './js/annotations/types',
        './js/indicators',
        './js/modules',
        './js/modules/networkgraph',
        './js/modules/sonification',
        './js/parts',
        './js/parts-3d',
        './js/parts-more',
        './js/parts-map',
        './js/parts-gantt'
    ];
    const configJSDoc = {
        plugins: ['./tools/jsdoc/plugins/highcharts.jsdoc']
    };
    const jsdoc = require('gulp-jsdoc3');
    return new Promise((resolve, reject) => {
        gulp.src(sourceFiles, { read: false })
            .pipe(jsdoc(configJSDoc, err => {
                if (!err) {
                    console.log(message.successJSDoc);
                    resolve(message.successJSDoc);
                } else {
                    reject(err);
                }
            }));
    })
        .then(() => generateAPI(treeFile, output, onlyBuildCurrent))
        .then(() => testTree(treeFile));
};

const isString = x => typeof x === 'string';

const uploadAPIDocs = () => {
    const sourceFolder = './build/api/';
    const bucket = 'api-docs-bucket.highcharts.com';
    const batchSize = 30000;
    const files = (
        isString(argv.files) ?
            argv.files.split(',') :
            getFilesInFolder(sourceFolder, true, '')
    );
    const tags = isString(argv.tags) ? argv.tags.split(',') : ['current'];
    const getUploadConfig = tag => {
        const errors = [];
        const bar = new ProgressBar({
            error: '',
            total: files.length,
            message: `\n[:bar] - Uploading ${tag}. Completed :count of :total.:error`
        });
        const doTick = () => {
            bar.tick();
        };
        const onError = err => {
            errors.push(`${err.message}. ${err.from} -> ${err.to}`);
            bar.tick({
                error: `\n${errors.length} file(s) errored:\n${errors.join('\n')}`
            });
        };
        const params = {
            batchSize,
            bucket,
            callback: doTick,
            onError
        };
        const getMapOfFromTo = fileName => {
            let to = fileName;
            if (tag !== 'current') {
                const parts = to.split('/');
                parts.splice(1, 0, tag);
                to = parts.join('/');
            }
            return {
                from: join(sourceFolder, fileName),
                to
            };
        };
        params.files = files.map(getMapOfFromTo);
        return params;
    };
    console.log(`Started upload of ${files.length} files to ${bucket} under tags [${tags.join(', ')}].`);
    const commands = [];
    return asyncForeach(tags, tag => Promise
        .resolve(getUploadConfig(tag))
        .then(uploadFiles)
        .then(result => {
            const { errors } = result;
            if (errors.length) {
                const erroredFiles = errors
                    .map(e => relative(sourceFolder, e.from)
                        // Make path command line friendly.
                        .split(sep)
                        .join('/'));
                commands.push(`gulp upload-api --tags ${tag} --files ${erroredFiles.join(',')}`);
            }
        }))
        .then(() => {
            if (commands.length) {
                console.log([
                    '',
                    colors.red('Some of the uploads failed, please run the following command to retry:'),
                    commands.join(' && ')
                ].join('\n'));
            }
        });
};
gulp.task('upload-api', uploadAPIDocs);

const jsdocServer = () => {
    // Start a server serving up the api reference
    const http = require('http');
    const url = require('url');
    const docport = 9005;
    const base = '127.0.0.1:' + docport;
    const apiPath = __dirname + '/build/api/';
    const mimes = {
        css: 'text/css',
        js: 'text/javascript',
        json: 'application/json',
        html: 'text/html',
        ico: 'image/x-icon',
        png: 'image/png',
        svg: 'image/svg+xml',
        xml: 'application/xml'
    };

    http.createServer((req, res) => {
        // eslint-disable-next-line node/no-deprecated-api
        const path = url.parse(req.url, true).pathname;

        let file = false;
        let redirect = false;

        if (path === '/highcharts' || path === '/' || path === '') {
            redirect = '/highcharts/';
        } else if (path === '/highstock') {
            redirect = '/highstock/';
        } else if (path === '/highmaps') {
            redirect = '/highmaps/';
        }
        if (redirect) {
            res.writeHead(302, {
                Location: redirect
            });
            res.end();
        }


        let filePath = path.substr(base + base.length + 1, path.lastIndexOf('/'));

        const send404 = () => {
            res.end('Ooops, the requested file is 404', 'utf-8');
        };

        if (filePath[filePath.length - 1] !== '/') {
            filePath = filePath + '/';
        }

        if (filePath[0] === '/') {
            filePath = filePath.substr(1);
        }

        if (req.method === 'GET') {
            const lastSlash = path.lastIndexOf('/');
            if (path.length === 0 || (path.length - 1) === lastSlash) {
                file = 'index.html';
            } else {
                file = path.substr(lastSlash + 1);
            }

            let ext = file.substr(file.lastIndexOf('.') + 1);
            if (Object.keys(mimes).indexOf(ext) === -1) {
                ext = 'html';
                file += '.html';
            }

            res.writeHead(200, {
                'Content-Type': mimes[ext] || mimes.html
            });

            return fs.readFile(apiPath + filePath + file, (err, data) => {
                if (err) {
                    return send404();
                }
                return res.end(data);
            });
        }

        return send404();
    }).listen(docport);

    console.log(
        'Starting API docs server',
        ('http://localhost:' + docport).cyan
    );
};
gulp.task('start-api-server', jsdocServer);

/**
 * Creates additional JSON-based class references with JSDoc using
 * tsconfig.json.
 */
const jsdocNamespace = () => {

    const jsdoc3 = require('gulp-jsdoc3');

    const dtsPath = 'test/typescript';

    const codeFiles = JSON
        .parse(fs.readFileSync(join(dtsPath, 'tsconfig.json'))).files
        .map(file => join(dtsPath, file))
        .filter(file => (
            file.indexOf('test') !== 0 &&
            file.indexOf('global.d.ts') === -1 &&
            file.indexOf('.src.d.ts') === -1
        ))
        .map(file => file.replace(/.d.ts$/, '.src.js'));

    const productFolders = [
            'gantt',
            'highcharts',
            'highstock',
            'highmaps'
        ],
        gulpOptions = [codeFiles, { read: false }],
        jsdoc3Options = { plugins: ['tools/jsdoc/plugins/highcharts.namespace'] };

    if (codeFiles.length === 0) {
        console.error('No files in tsconfig.json found.');
        return Promise.resolve([]);
    }

    const aGulp = (resolve, reject) => {

        const aJson = error => {

            if (error) {
                reject(error);
            }

            Promise
                .all(productFolders.map(productFolder => copyFile(
                    'tree-namespace.json',
                    `build/api/${productFolder}/tree-namespace.json`
                )))
                .then(resolve)
                .catch(reject);
        };

        gulp.src(...gulpOptions)
            .pipe(jsdoc3(jsdoc3Options, aJson));
    };

    return new Promise(aGulp);
};
gulp.task('jsdoc-namespace', gulp.series(gulp.parallel('scripts'), jsdocNamespace));

/**
 * Creates JSON-based option references from JSDoc.
 */
const jsdocOptions = () => generateAPIDocs({
    version: getBuildProperties().version,
    treeFile: './tree.json',
    output: './build/api',
    onlyBuildCurrent: true
});
gulp.task('jsdoc-options', jsdocOptions);

let apiServerRunning = false;
/**
 * Create Highcharts API and class references from JSDOC
 */
const jsdocWatch = () => {
    const optionsClassReference = {
        templateDir: './node_modules/highcharts-docstrap',
        destination: './build/api/class-reference/'
    };
    const optionsAPI = {
        version: getBuildProperties().version,
        treeFile: './tree.json',
        output: './build/api',
        onlyBuildCurrent: true
    };
    const dir = optionsClassReference.templateDir;
    const watchFiles = [
        './js/!(adapters|builds)/*.js',
        './node_modules/highcharts-api-docs/include/*.*',
        './node_modules/highcharts-api-docs/templates/*.handlebars',
        dir + '/template/tmpl/*.tmpl',
        dir + '/template/static/styles/*.css',
        dir + '/template/static/scripts/*.js'
    ];
    if (argv.watch) {
        gulp.watch(watchFiles, gulp.series('jsdoc'));
        console.log('Watching file changes in JS files and templates');

    } else {
        console.log('Tip: use the --watch argument to watch JS file changes');
    }

    if (!apiServerRunning) {
        jsdocServer();
        apiServerRunning = true;
    }

    return generateClassReferences(optionsClassReference)
        .then(() => generateAPIDocs(optionsAPI));
};
gulp.task('jsdoc', gulp.series(gulp.parallel('clean-api', 'jsdoc-namespace'), jsdocWatch));

gulp.task('create-productjs', createProductJS);
gulp.task('clean-dist', cleanDist);
gulp.task('clean-code', cleanCode);
gulp.task('copy-to-dist', copyToDist);
gulp.task('filesize', filesize);

/* *
 *
 *  TypeScript
 *
 * */

/**
 * Add TypeScript declarations to the code folder using tree.json and
 * tree-namespace.json.
 */
function dts() {
    return require('../highcharts-declarations-generator').task();
}
gulp.task('dts', gulp.series(gulp.parallel('jsdoc-options', 'jsdoc-namespace'), dts));

/**
 * Test TypeScript declarations in the code folder using tsconfig.json.
 */
function dtsLint() {
    return commandLine('cd test/typescript && npx dtslint --onlyTestTsNext');
}
gulp.task('dtslint', gulp.series(gulp.parallel('update', 'dts'), dtsLint));

gulp.task('tsc', () => require('./tools/gulptasks/tsc')());
gulp.task('tslint', gulp.series('tsc', () => require('./tools/gulptasks/tslint')()));

/* *
 *
 *  Core Functionality
 *
 * */

gulp.task('build-modules', buildESModules);

gulp.task('compile', () => {
    const messages = {
        usage: 'Run "gulp compile --help" for information on usage.',
        help: [
            '',
            'Usage: gulp compile [OPTIONS]',
            '',
            'Options:',
            '    --file: Specify a list of files to compile. Files are comma separated e.g "file1,file2".',
            '    --help: Displays help information.',
            ''
        ].join('\n')
    };
    let promise = Promise.resolve();
    if (argv.help) {
        console.log(messages.help);
    } else {
        const files = (argv.file) ? argv.file.split(',') : null;
        console.log(messages.usage);
        promise = compileScripts({
            files
        });
    }
    return promise;
});
gulp.task('compile-lib', compileLib);
gulp.task('copy-graphics-to-dist', copyGraphicsToDist);
gulp.task('examples', createAllExamples);

/**
 * Watch changes to JS and SCSS files
 *
 * @return {Promise}
 *         Promise to keep
 */
function defaultWatch() {
    const {
        fnFirstBuild,
        mapOfWatchFn
    } = getBuildScripts({});
    const watchlist = [
        './css/*.scss',
        './js/**/*.js',
        './code/es-modules/**/*.js'
    ];
    const msgBuildAll = 'Built JS files from modules.'.cyan;
    let watcher;
    const onChange = path => {
        const posixPath = path.split(sep).join('/');
        let promise;

        if (posixPath.startsWith('css')) {
            // Stop the watcher temporarily.
            watcher.close();
            watcher = null;
            // Run styles and build all files.
            promise = styles().then(() => {
                if (shouldBuild()) {
                    fnFirstBuild();
                    console.log(msgBuildAll);
                } else {
                    console.log('✓'.green, 'Code up to date.'.gray);
                }
                // Start watcher again.
                watcher = gulp.watch(watchlist).on('change', onChange);
            });
        } else if (posixPath.startsWith('js')) {
            // Build es-modules
            promise = mapOfWatchFn['js/**/*.js']({ path: posixPath, type: 'change' });
        } else if (posixPath.startsWith('code/es-modules')) {
            // Build dist files in classic mode.
            promise = mapOfWatchFn['code/es-modules/**/*.js']({ path: posixPath, type: 'change' });
        }

        return promise;
    };
    return styles().then(() => {
        if (shouldBuild()) {
            fnFirstBuild();
            console.log(msgBuildAll);
        } else {
            console.log('✓'.green, 'Code up to date.'.gray);
        }
        // Start watching source files.
        watcher = gulp.watch(watchlist).on('change', onChange);
    });
}
gulp.task('default', defaultWatch);

/**
 * Create distribution files
 */
gulp.task('dist', () => Promise.resolve()
    .then(gulpify('cleanCode', cleanCode))
    .then(gulpify('styles', styles))
    .then(gulpify('scripts', getBuildScripts({}).fnFirstBuild))
    .then(gulpify('lint', lint))
    .then(gulpify('compile', compileScripts))
    .then(gulpify('cleanDist', cleanDist))
    .then(gulpify('copyToDist', copyToDist))
    .then(gulpify('createProductJS', createProductJS))
    .then(gulpify('createExamples', createAllExamples))
    .then(gulpify('copyGraphicsToDist', copyGraphicsToDist))
    .then(gulpify('jsdoc-namespace', jsdocNamespace))
    .then(gulpify('jsdoc-options', jsdocOptions))
    .then(gulpify('dts', dts))
    .then(gulpify('dtsLint', dtsLint))
    .then(gulpify('ant-dist', antDist)));

gulp.task('browserify', function () {
    const browserify = require('browserify');
    browserify('./samples/highcharts/common-js/browserify/app.js')
        .bundle(function (err, buf) {
            if (err) {
                // @todo Do something meaningful with err
            }
            fs.writeFileSync('./samples/highcharts/common-js/browserify/demo.js', buf);
        });
});

gulp.task('webpack', function () {
    const webpack = require('webpack');
    webpack({
        entry: './samples/highcharts/common-js/browserify/app.js', // Share the same unit tests
        output: {
            filename: './samples/highcharts/common-js/webpack/demo.js'
        }
    }, function (err) {
        if (err) {
            throw new Error('Webpack failed.');
        }
    });
});

gulp.task('common', gulp.series('scripts', 'browserify', 'webpack'));
