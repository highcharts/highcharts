/* eslint-env node, es6 */
/* eslint no-console:0, valid-jsdoc:0 */
/* eslint-disable func-style */

'use strict';
var colors = require('colors'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    gzipSize = require('gzip-size'),
    closureCompiler = require('closurecompiler'),
    argv = require('yargs').argv,
    fs = require('fs'),
    sass = require('gulp-sass'),
    ftp = require('vinyl-ftp'),
    spawn = require('child_process').spawn;
var paths = {
    buildsDir: './js/builds',
    distributions: [
        './js/highcharts.src.js',
        './js/highmaps.src.js',
        './js/highstock.src.js',
        './js/highcharts-3d.src.js',
        './js/highcharts-more.src.js'
    ],
    assemblies: [
        './js/highcharts.src.js',
        './js/highstock.src.js',
        './js/highcharts-3d.src.js',
        './js/highcharts-more.src.js',
        './js/highmaps.src.js',
        './js/modules/map.src.js',
        './js/modules/heatmap.src.js'
    ],
    modules: ['./js/modules/*.js'],
    parts: ['./js/parts/*.js'],
    parts3D: ['./js/parts-3d/*.js'],
    partsMap: ['./js/parts-map/*.js'],
    partsMore: ['./js/parts-more/*.js'],
    themes: ['./js/themes/*.js']
};

/**
 * Get the product version from build.properties.
 * The product version is used in license headers and in package names.
 * @return {string|null} Returns version number or null if not found.
 */
const getProductVersion = () => {
    // const fs = require('fs');
    const D = require('./assembler/dependencies.js');
    const properties = fs.readFileSync('./build.properties', 'utf8');
    return D.regexGetCapture(/product\.version=(.+)/, properties);
};

/**
 * Gulp task to run the building process of distribution files. By default it builds all the distribution files. Usage: "gulp build".
 * @param {string} --file Optional command line argument. Use to build a single file. Usage: "gulp build --file highcharts.js"
 * @return undefined
 */
const scripts = () => {
    let build = require('./assembler/build').build;
    // let argv = require('yargs').argv; Already declared in the upper scope
    let files = (argv.file) ? [argv.file] : null,
        type = (argv.type) ? argv.type : 'both',
        debug = argv.d || false,
        version = getProductVersion(),
        DS = '[\\\\\\\/][^\\\\\\\/]', // Regex: Single directory seperator
        folders = {
            'parts': 'parts' + DS + '+\.js$',
            'parts-more': 'parts-more' + DS + '+\.js$'
        };

    build({
        base: './js/masters/',
        debug: debug,
        fileOptions: {
            'modules/accessibility.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/annotations.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/boost.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/broken-axis.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/canvasrenderer.experimental.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/canvgrenderer-extended.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/data.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/drilldown.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/exporting.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/funnel.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/heatmap.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/map.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false,
                product: 'Highmaps'
            },
            'modules/map-parser.src.js': {
                exclude: new RegExp([folders.parts, 'data\.src\.js$'].join('|')),
                umd: false,
                product: 'Highmaps'
            },
            'modules/no-data-to-display.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/offline-exporting.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/overlapping-datalabels.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/series-label.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'modules/solid-gauge.src.js': {
                exclude: new RegExp([folders.parts, 'GaugeSeries\.js$'].join('|')),
                umd: false
            },
            'modules/treemap.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/dark-blue.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/dark-green.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/dark-unica.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/gray.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/grid-light.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/grid.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/skies.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'themes/sand-signika.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'highcharts-more.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'highcharts-3d.src.js': {
                exclude: new RegExp(folders.parts),
                umd: false
            },
            'highmaps.src.js': {
                product: 'Highmaps'
            },
            'highstock.src.js': {
                product: 'Highstock'
            }
        },
        files: files,
        output: './code/',
        type: type,
        version: version
    });
};

const styles = () => {
    gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./code/css/'));
};

/**
 * Gulp task to execute ESLint. Pattern defaults to './js/**".'
 * @parameter {string} -p Command line parameter to set pattern. Example usage gulp lint -p './samples/**'
 * @return undefined Returns nothing
 */
const lint = () => {
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine();
    const formatter = cli.getFormatter();
    let pattern = (typeof argv.p === 'string') ? [argv.p] : ['./js/**'];
    let report = cli.executeOnFiles(pattern);
    console.log(formatter(report.results));
};

/**
 * Watch changes to JS and SCSS files
 */
gulp.task('default', ['styles', 'scripts'], () => {
    // If styling changes, then build new css and js files.
    gulp.watch(['./css/*.scss'], ['styles', 'scripts']);
    // If js parts files changes, then build new js files.
    gulp.watch(['./js/!(adapters|builds)/*.js'], ['scripts']);
});

gulp.task('ftp', function () {
    fs.readFile('./git-ignore-me.properties', 'utf8', function (err, lines) {
        if (err) {
            throw err;
        }
        var config = {};
        lines.split('\n').forEach(function (line) {
            line = line.split('=');
            if (line[0]) {
                config[line[0]] = line[1];
            }
        });

        var conn = ftp.create({
            host: config['ftp.host'],
            user: config['ftp.user'],
            password: config['ftp.password']
        });

        var globs = paths.distributions.concat(paths.modules);

        return gulp.src(globs, { base: './js', buffer: false })
            .pipe(conn.newer(config['ftp.dest']))
            .pipe(conn.dest(config['ftp.dest']));
    });
});

gulp.task('ftp-watch', function () {
    gulp.watch('./js/*/*.js', ['scripts', 'ftp']);
});

/**
 * Run the test suite. The task spawns a child process running PhantomJS.
 */
gulp.task('test', function () {
    spawn('phantomjs', ['phantomtest.js'].concat(process.argv.slice(3)), {
        cwd: 'utils/samples',
        stdio: 'inherit'
    });
});

/**
 * Run the nightly. The task spawns a child process running node.
 */
gulp.task('nightly', function () {
    spawn('node', ['nightly.js'].concat(process.argv.slice(3)), {
        cwd: 'utils/samples',
        stdio: 'inherit'
    });
});

gulp.task('filesize', function () {
    var oldSize,
        newSize,
        filename = argv.file ? argv.file : 'highcharts.src.js';

    /**
     * Pad a string to a given length by adding spaces to the beginning
     * @param {Number} number
     * @param {Number} length
     * @returns {String} Padded string
     */
    function pad(number, length) {
        return new Array((length || 2) + 1 - String(number).length).join(' ') + number;
    }

    /**
     * Log the results of the comparison
     * @returns {undefined}
     */
    function report() {
        var diff = newSize - oldSize,
            sign = diff > 0 ? '+' : '',
            color = diff > 0 ? 'yellow' : 'green';
        console.log([
            '',
            colors.cyan(filename.replace('.src', '')) + colors.gray('(gzipped)'),
            'HEAD: ' + pad(oldSize.toLocaleString(), 7) + ' B',
            'New:  ' + pad(newSize.toLocaleString(), 7) + ' B',
            colors[color]('Diff: ' + pad(sign + diff, 7) + ' B'),
            ''
        ].join('\n'));
    }

    closureCompiler.compile(
        ['js/' + filename],
        null,
        function (error, ccResult) {
            if (ccResult) {

                newSize = gzipSize.sync(ccResult);

                exec('git stash', function (stashError) {
                    if (stashError !== null) {
                        console.log('Error in stash: ' + stashError);
                    }

                    closureCompiler.compile(
                        ['js/' + filename],
                        null,
                        function (ccError, ccResultOld) {
                            if (ccResultOld) {
                                oldSize = gzipSize.sync(ccResultOld);
                                report();
                                exec('git stash apply && git stash drop', function (applyError) {
                                    if (applyError) {
                                        console.log(colors.red('Error in stash apply: ' + applyError));
                                    }
                                });
                            } else {
                                console.log('Compilation error: ' + error);
                            }
                        }
                    );
                });

            } else {
                console.log('Compilation error: ' + error);
            }
        }
    );
});

const compile = (files, sourceFolder) => {
    console.log(colors.red('WARNING!: This task may take a few minutes on Mac, and even longer on Windows.'));
    return new Promise((resolve, reject) => {
        const promises = files.map(path => {
                return new Promise((resolveCompile, reject) => {
                    const sourcePath = sourceFolder + path;
                    const outputPath = sourcePath.replace('.src.js', '.js');
                    closureCompiler.compile(
                        [sourcePath],
                        null,
                        (error, result) => {
                            if (result) {
                                fs.writeFile(outputPath, result, 'utf8', (err) => {
                                    if (!err) {
                                        // @todo add filesize information
                                        resolveCompile(colors.green('Compiled ' + sourcePath + ' => ' + outputPath));
                                    } else {
                                        reject(colors.red('Failed compiling ' + sourcePath + ' => ' + outputPath));
                                    }
                                });
                            } else {
                                reject('Compilation error: ' + error);
                            }
                        }
                    );
                }).then(console.log);
            });
        Promise.all(promises).then(() => {
            resolve('Compile is complete');
        }).catch((err) => reject(err.message + '\n\r' + err.stack));
    });
};

/**
 * Compile the JS files in the /code folder
 */
const compileScripts = () => {
    const B = require('./assembler/build.js');
    const sourceFolder = './code/';
    const files = B.getFilesInFolder(sourceFolder, true, '').filter(path => path.endsWith('.src.js'));
    return compile(files, sourceFolder)
        .then(console.log)
        .catch(console.log);
}

/**
 * Compile the JS files in the /code folder
 */
const compileLib = () => {
    const sourceFolder = './vendor/';
    const files = ['canvg.src.js', 'rgbcolor.src.js'];
    return compile(files, sourceFolder)
        .then(console.log)
        .catch(console.log);
}

const cleanCode = () => {
    const U = require('./assembler/utilities.js');
    return U.removeDirectory('./code').then(() => {
        console.log('Successfully removed code directory.');
    }).catch(console.log);
};

const cleanDist = () => {
    const U = require('./assembler/utilities.js');
    return U.removeDirectory('./build/dist').then(() => {
        console.log('Successfully removed dist directory.');
    }).catch(console.log);
};

const copyToDist = () => {
    const B = require('./assembler/build.js');
    const U = require('./assembler/utilities.js');
    const sourceFolder = './code/';
    const libFolder = './vendor/';
    const distFolder = './build/dist/';
    const files = B.getFilesInFolder(sourceFolder, true, '');
    // Files that should not be distributed with certain products
    const filter = {
        highcharts: ['highmaps.js', 'highstock.js', 'modules/canvasrenderer.experimental.js', 'modules/map.js', 'modules/map-parser.js'],
        highstock: ['highcharts.js', 'highmaps.js', 'modules/broken-axis.js', 'modules/canvasrenderer.experimental.js', 'modules/map.js', 'modules/map-parser.js'],
        highmaps: ['highstock.js', 'modules/broken-axis.js', 'modules/canvasrenderer.experimental.js', 'modules/map-parser.js', 'modules/series-label.js', 'modules/solid-gauge.js']
    };

    // Copy source files to the distribution packages.
    files.filter((path) => (path.endsWith('.js') || path.endsWith('.css')))
        .forEach((path) => {
            const content = fs.readFileSync(sourceFolder + path);
            const filename = path.replace('.src.js', '.js').replace('js/', '');
            ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
                if (filter[lib].indexOf(filename) === -1) {
                    U.writeFile(distFolder + lib + '/js/' + path, content);
                }
            });
        });

    // Copy lib files to the distribution packages. These files are used in the offline-export.
    ['canvg.js', 'canvg.src.js', 'rgbcolor.js', 'rgbcolor.src.js'].forEach((path) => {
        const content = fs.readFileSync(libFolder + path);
        ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
            U.writeFile(distFolder + lib + '/js/lib/' + path, content);
        });
    });
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
const toTimeString = (d) => {
    const pad = (s) => leftPad(s, '0', 2);
    return pad('' + d.getHours()) + ':' + pad('' + d.getMinutes()) + ':' + pad('' + d.getSeconds());
};

/**
 * Returns a string which tells the time difference between to dates.
 * Difference is formatted as xh xm xs xms. Where x is a number.
 * @param  {Date} d1 First date
 * @param  {Date} d2 Second date
 * @return {string} The time difference between the two dates.
 */
const timeDifference = (d1, d2) => {
    const seconds = 1000;
    const minutes = 60 * seconds;
    const hours = 60 * minutes;
    let diff = d2 - d1;
    let x = 0;
    let time = [];
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
 * @param  {string} name Name of task which is beeing executed.
 * @param  {string} task A function to execute
 * @return {*}      Returns whatever the task function returns when it is finished.
 */
const gulpify = (name, task) => {
    // const colors = require('colors');
    const isPromise = (value) => (typeof value === 'object' && typeof value.then === 'function');
    return function () {
        const d1 = new Date();
        console.log('[' + colors.gray(toTimeString(d1)) + '] Starting \'' + colors.cyan(name) + '\'...');
        let result = task.apply(null, Array.from(arguments));
        if (!isPromise(result)) {
            result = Promise.resolve(result);
        }
        return result.then(() => {
            const d2 = new Date();
            console.log('[' + colors.gray(toTimeString(d2)) + '] Finished \'' + colors.cyan(name) + '\' after ' + colors.blue(timeDifference(d1, d2)));
        });
    };
};

/**
 * Executes a single terminal command and returns when finished.
 * Outputs stdout to the console.
 * @param  {string} command Command to execute in terminal
 * @return {string} Returns all output to the terminal in the form of a string.
 */
const commandLine = (command) => {
    // const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        const cli = exec(command, (error, stdout) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Command finished: ' + command);
                resolve(stdout);
            }
        });
        cli.stdout.on('data', (data) => console.log(data.toString()));
    });
};

/**
 * Download a version of the API for Highstock, Highstock or Highmaps.
 * Executes a grunt task through command line.
 * @param  {string} product Which api to download. Must be lowercase.
 * @param  {string} version Which version to download.
 * @return {Promise} Returns a promise which resolves when download is completed.
 */
const downloadAPI = (product, version) => commandLine('grunt download-api:' + product + ':' + version);

/**
 * Download all the API's of Highcharts, Highstock and Highmaps.
 * @return {Promise} Returns a promise which resolves when all downloads are completed.
 */
const downloadAllAPI = () => new Promise((resolve, reject) => {
    // @todo Pass in version, instead of hardcoding it.
    const version = getProductVersion();
    const promises = ['highcharts', 'highstock', 'highmaps'].map((product) => downloadAPI(product, version));
    Promise.all(promises).then(() => {
        resolve('Finished downloading api\'s for Highcharts, Highstock and Highmaps');
    }).catch((err) => {
        reject(err);
    });
});

/**
 * Run remaining dist tasks in build.xml.
 * @return {Promise} Returns a promise which resolves when scripts is finished.
 */
const antDist = () => commandLine('ant dist');

gulp.task('copy-to-dist', copyToDist);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('lint', lint);
gulp.task('compile', compileScripts);
gulp.task('compile-lib', compileLib);
gulp.task('download-api', downloadAllAPI);
/**
 * Create distribution files
 */
gulp.task('dist', () => {
    return gulpify('cleanCode', cleanCode)()
        .then(gulpify('styles', styles))
        .then(gulpify('scripts', scripts))
        .then(gulpify('lint', lint))
        .then(gulpify('compile', compileScripts))
        .then(gulpify('cleanDist', cleanDist))
        .then(gulpify('copyToDist', copyToDist))
        .then(gulpify('downloadAllAPI', downloadAllAPI))
        .then(gulpify('ant-dist', antDist));
});
gulp.task('browserify', function () {
    var browserify = require('browserify');
    browserify('./samples/highcharts/common-js/browserify/app.js')
        .bundle(function (err, buf) {
            if (err) {
                // @todo Do something meaningful with err
            }
            fs.writeFileSync('./samples/highcharts/common-js/browserify/demo.js', buf);
        });
});

gulp.task('webpack', function () {
    var webpack = require('webpack');
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

gulp.task('common', ['scripts', 'browserify', 'webpack']);
