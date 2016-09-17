/* eslint-env node, es6 */
/* eslint no-console:0, valid-jsdoc:0 */

'use strict';
var colors = require('colors'),
    exec = require('child_process').exec,
    glob = require('glob'),
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
 * Gulp task to run the building process of distribution files. By default it builds all the distribution files. Usage: "gulp build".
 * @param {string} --file Optional command line argument. Use to build a single file. Usage: "gulp build --file highcharts.js"
 * @return undefined
 */
gulp.task('scripts', function () {
    let build = require('./assembler/build').build;
    // let argv = require('yargs').argv; Already declared in the upper scope
    let files = (argv.file) ? [argv.file] : null,
        type = (argv.type) ? argv.type : 'both',
        debug = argv.d || false,
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
                umd: false
            },
            'modules/map-parser.src.js': {
                exclude: new RegExp([folders.parts, 'data\.src\.js$'].join('|')),
                umd: false
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
            }
        },
        files: files,
        output: './code/',
        type: type
    });
});

gulp.task('styles', function () {
    gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./code/css/'));
});

/**
 * Gulp task to execute ESLint. Pattern defaults to './js/**".'
 * @parameter {string} -p Command line parameter to set pattern. Example usage gulp lint -p './samples/**'
 * @return undefined Returns nothing
 */
gulp.task('lint', () => {
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine();
    const formatter = cli.getFormatter();
    let pattern = (typeof argv.p === 'string') ? [argv.p] : ['./js/**'];
    let report = cli.executeOnFiles(pattern);
    console.log(formatter(report.results));
});

/**
 * Watch changes to JS and SCSS files
 */
gulp.task('default', ['styles', 'scripts'], () => {
    // If styling changes, then build new css and js files.
    gulp.watch(['./css/*.scss'], ['styles', 'scripts']);
    // If js parts files changes, then build new js files.
    gulp.watch(['./js/!(adapters|builds)/*.js'], ['scripts']);
});

/**
 * Create distribution files
 */
gulp.task('dist', ['clean-code', 'styles', 'scripts', 'lint', 'compile', 'clean-dist', 'copy-to-dist']);

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
        newSize;

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
            colors.cyan('highcharts.js ') + colors.gray('(gzipped)'),
            'HEAD: ' + pad(oldSize.toLocaleString(), 7) + ' B',
            'New:  ' + pad(newSize.toLocaleString(), 7) + ' B',
            colors[color]('Diff: ' + pad(sign + diff, 7) + ' B'),
            ''
        ].join('\n'));
    }

    closureCompiler.compile(
        ['code/highcharts.src.js'],
        null,
        function (error, ccResult) {
            if (ccResult) {

                newSize = gzipSize.sync(ccResult);

                exec('git stash', function (stashError) {
                    if (stashError !== null) {
                        console.log('Error in stash: ' + stashError);
                    }

                    closureCompiler.compile(
                        ['code/highcharts.src.js'],
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

/**
 * Compile the JS files in the /code folder
 */
gulp.task('compile', ['scripts'], () => {
    console.log('WARNING!: This task may take a few minutes on Mac, and even longer on Windows.');
    return glob('*.src.js', { cwd: './code/', matchBase: true }, (globErr, files) => {
        files.forEach((src) => {
            src = './code/' + src;
            var dest = src.replace('.src.js', '.js');
            closureCompiler.compile(
                [src],
                null,
                (error, result) => {
                    if (result) {
                        fs.writeFileSync(dest, result, 'utf8', (writeErr) => {
                            let msg = (!writeErr) ? colors.green('Compiled ' + src + ' => ' + dest) : colors.red('Failed compiling ' + src + ' => ' + dest);
                            console.log(msg);
                        });
                    } else {
                        console.log('Compilation error: ' + error);
                    }
                }
            );
        });
    });
});

gulp.task('clean-code', () => {
    const U = require('./assembler/utilities.js');
    return U.removeDirectory('./code').then(() => {
        console.log('Successfully removed code directory.');
    }).catch(console.log);
});

gulp.task('clean-dist', () => {
    const U = require('./assembler/utilities.js');
    return U.removeDirectory('./build/dist').then(() => {
        console.log('Successfully removed dist directory.');
    }).catch(console.log);
});

gulp.task('copy-to-dist', ['clean-dist'], () => {
    const B = require('./assembler/build.js');
    const U = require('./assembler/utilities.js');
    const sourceFolder = './code/';
    const distFolder = './build/dist/';
    const files = B.getFilesInFolder(sourceFolder, true, '');
    files.filter((path) => (path.endsWith('.js') || path.endsWith('.css')))
        .forEach((path) => {
            const content = fs.readFileSync(sourceFolder + path);
            ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
                U.writeFile(distFolder + lib + '/js/' + path, content);
            });
        });
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
