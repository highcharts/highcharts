/* eslint-env node, es6 */
/* eslint no-console:0, valid-jsdoc:0 */
/* eslint-disable func-style */

'use strict';
const colors = require('colors');
const gulp = require('gulp');
const argv = require('yargs').argv;

/**
 * Get the product version from build.properties.
 * The product version is used in license headers and in package names.
 * @return {string|null} Returns version number or null if not found.
 */
const getProductVersion = () => {
    const fs = require('fs');
    const D = require('./assembler/dependencies.js');
    const properties = fs.readFileSync('./build.properties', 'utf8');
    return D.regexGetCapture(/product\.version=(.+)/, properties);
};

/**
 * Returns fileOptions for the build script
 * @todo Move this functionality to the build script,
 *   and reuse it on github.highcharts.com
 * @return {Object} Object containing all fileOptions
 */
const getFileOptions = (base) => {
    const B = require('./assembler/build.js');
    const DS = '[\\\\\\\/]';
    const NOTDS = '[^\\\\\\\/]';
    const SINGLEDS = DS + NOTDS; // Regex: Single directory seperator
    const folders = {
        'parts': 'parts' + SINGLEDS + '+\.js$',
        'parts-more': 'parts-more' + SINGLEDS + '+\.js$',
        'highchartsFiles': [
            'parts' + DS + 'Globals\.js$',
            'parts' + DS + 'SvgRenderer\.js$',
            'parts' + DS + 'Html\.js$',
            'parts' + DS + 'VmlRenderer\.js$',
            'parts' + DS + 'Axis\.js$',
            'parts' + DS + 'DateTimeAxis\.js$',
            'parts' + DS + 'LogarithmicAxis\.js$',
            'parts' + DS + 'Tooltip\.js$',
            'parts' + DS + 'Pointer\.js$',
            'parts' + DS + 'TouchPointer\.js$',
            'parts' + DS + 'MSPointer\.js$',
            'parts' + DS + 'Legend\.js$',
            'parts' + DS + 'Chart\.js$',
            'parts' + DS + 'Stacking\.js$',
            'parts' + DS + 'Dynamics\.js$',
            'parts' + DS + 'AreaSeries\.js$',
            'parts' + DS + 'SplineSeries\.js$',
            'parts' + DS + 'AreaSplineSeries\.js$',
            'parts' + DS + 'ColumnSeries\.js$',
            'parts' + DS + 'BarSeries\.js$',
            'parts' + DS + 'ScatterSeries\.js$',
            'parts' + DS + 'PieSeries\.js$',
            'parts' + DS + 'DataLabels\.js$',
            'modules' + DS + 'overlapping-datalabels.src\.js$',
            'parts' + DS + 'Interaction\.js$',
            'parts' + DS + 'Responsive\.js$',
            'parts' + DS + 'Color\.js$',
            'parts' + DS + 'Options\.js$',
            'parts' + DS + 'PlotLineOrBand\.js$',
            'parts' + DS + 'Tick\.js$',
            'parts' + DS + 'Point\.js$',
            'parts' + DS + 'Series\.js$',
            'parts' + DS + 'Utilities\.js$'
        ]
    };

    // Modules should not be standalone, and they should exclude all parts files.
    const fileOptions = B.getFilesInFolder(base, true, '')
        .reduce((obj, file) => {
            if (file.indexOf('modules') > -1 || file.indexOf('themes') > -1) {
                obj[file] = {
                    exclude: new RegExp(folders.parts),
                    umd: false
                };
            }
            return obj;
        }, {});

    /**
     * Special cases
     * solid-gauge should also exclude gauge-series
     * highcharts-more and highcharts-3d is also not standalone.
     */
    fileOptions['modules/solid-gauge.src.js'].exclude = new RegExp([folders.parts, 'GaugeSeries\.js$'].join('|'));
    fileOptions['modules/map.src.js'].product = 'Highmaps';
    fileOptions['modules/map-parser.src.js'].product = 'Highmaps';
    fileOptions['modules/stock.src.js'].exclude = new RegExp(folders.highchartsFiles.join('|'));
    Object.assign(fileOptions, {
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
    });
    return fileOptions;
};

/**
 * Gulp task to run the building process of distribution files. By default it builds all the distribution files. Usage: "gulp build".
 * @param {string} --file Optional command line argument. Use to build a one or sevral files. Usage: "gulp build --file highcharts.js,modules/data.src.js"
 * @return undefined
 */
const scripts = () => {
    const build = require('./assembler/build').build;
    // const argv = require('yargs').argv; Already declared in the upper scope
    const files = (argv.file) ? argv.file.split(',') : null;
    const type = (argv.type) ? argv.type : 'both';
    const debug = argv.d || false;
    const version = getProductVersion();
    const base = './js/masters/';
    const fileOptions = getFileOptions(base);

    return build({
        base: base,
        debug: debug,
        fileOptions: fileOptions,
        files: files,
        output: './code/',
        type: type,
        version: version
    });
};

/**
 * Creates a set of ES6-modules which is distributable.
 * @return {undefined}
 */
const buildModules = () => {
    const B = require('./assembler/build');
    B.buildModules({
        base: './js/',
        output: './code/modules/',
        type: 'both'
    });
};

const styles = () => {
    const sass = require('gulp-sass');
    gulp.src('./css/*.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest('./code/css/'));
};

/**
 * Gulp task to execute ESLint. Pattern defaults to './js/**".'
 * @parameter {string} -p Command line parameter to set pattern. To lint sample
 *     files, see the lintSamples function.
 * @return undefined Returns nothing
 */
const lint = () => {
    const CLIEngine = require('eslint').CLIEngine;
    const cli = new CLIEngine();
    const formatter = cli.getFormatter();
    let pattern = (typeof argv.p === 'string') ? [argv.p] : ['./js/**/*.js'];
    let report = cli.executeOnFiles(pattern);
    console.log(formatter(report.results));
};

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
    let report = cli.executeOnFiles([
        './samples/*/*/*/demo.js',
        './samples/*/*/*/test.js',
        './samples/*/*/*/unit-tests.js'
    ]);
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
    const ftp = require('vinyl-ftp');
    const fs = require('fs');
    const paths = {
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
        partsGantt: ['./js/parts-gantt/*.js'],
        themes: ['./js/themes/*.js']
    };
    fs.readFile('./git-ignore-me.properties', 'utf8', function (err, lines) {
        if (err) {
            throw err;
        }
        let config = {};
        lines.split('\n').forEach(function (line) {
            line = line.split('=');
            if (line[0]) {
                config[line[0]] = line[1];
            }
        });

        let conn = ftp.create({
            host: config['ftp.host'],
            user: config['ftp.user'],
            password: config['ftp.password']
        });

        let globs = paths.distributions.concat(paths.modules);

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
    const spawn = require('child_process').spawn;
    spawn('phantomjs', ['phantomtest.js'].concat(process.argv.slice(3)), {
        cwd: 'utils/samples',
        stdio: 'inherit'
    });
});

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
 * Automated generation for internal API docs.
 * Run with --watch argument to watch for changes in the JS files.
 */
gulp.task('jsdoc', function (cb) {
    const jsdoc = require('gulp-jsdoc3');

    const templateDir = './../highcharts-docstrap';

    gulp.src(['README.md', './js/parts/*.js'], { read: false })
    // gulp.src(['README.md', './js/parts/Options.js'], { read: false })
        .pipe(jsdoc({
            navOptions: {
                theme: 'highsoft'
            },
            opts: {
                destination: './internal-docs/',
                private: false,
                template: templateDir + '/template'
            },
            plugins: [
                templateDir + '/plugins/markdown',
                templateDir + '/plugins/optiontag',
                templateDir + '/plugins/sampletag'
            ],
            templates: {
                logoFile: 'img/highcharts-logo.svg',
                systemName: 'Highcharts',
                theme: 'highsoft'
            }
        }, function (err) {
            cb(err); // eslint-disable-line
            if (!err) {
                console.log(
                    colors.green('Wrote JSDoc to ./internal-docs/index.html')
                );
            }
        }));

    if (argv.watch) {
        gulp.watch(['./js/!(adapters|builds)/*.js'], ['jsdoc']);
    }
});

const compile = (files, sourceFolder) => {
    console.log(colors.yellow('Warning: This task may take a few minutes on Mac, and even longer on Windows.'));
    return new Promise((resolve) => {
        files.forEach(path => {
            const closureCompiler = require('google-closure-compiler-js');
            // const fs = require('fs');
            const U = require('./assembler/utilities.js');
            const sourcePath = sourceFolder + path;
            const outputPath = sourcePath.replace('.src.js', '.js');
            const src = U.getFile(sourcePath);
            const out = closureCompiler.compile({
                compilationLevel: 'SIMPLE_OPTIMIZATIONS',
                jsCode: [{
                    src: src
                }],
                languageIn: 'ES5',
                languageOut: 'ES5'
            });
            U.writeFile(outputPath, out.compiledCode);
            // @todo add filesize information
            console.log(colors.green('Compiled ' + sourcePath + ' => ' + outputPath));
        });
        resolve('Compile is complete');
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
};

/**
 * Compile the JS files in the /code folder
 */
const compileLib = () => {
    const sourceFolder = './vendor/';
    const files = ['canvg.src.js'];
    return compile(files, sourceFolder)
        .then(console.log)
        .catch(console.log);
};

const cleanCode = () => {
    const B = require('./assembler/build.js');
    const U = require('./assembler/utilities.js');
    const codeFolder = './code/';
    const files = B.getFilesInFolder(codeFolder, true, '');
    const keep = ['.gitignore', '.htaccess', 'css/readme.md', 'js/modules/readme.md', 'js/readme.md', 'modules/readme.md', 'readme.txt'];
    const promises = files
        .filter(file => keep.indexOf(file) === -1)
        .map(file => U.removeFile(codeFolder + file));
    return Promise.all(promises)
        .then(() => console.log('Successfully removed code directory.'));
};

const cleanDist = () => {
    const U = require('./assembler/utilities.js');
    return U.removeDirectory('./build/dist').then(() => {
        console.log('Successfully removed dist directory.');
    }).catch(console.log);
};

const copyToDist = () => {
    const fs = require('fs');
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
                    U.writeFile(distFolder + lib + '/code/' + path, content);
                }
            });
        });

    // Copy readme to distribution packages
    ['readme.txt'].forEach((path) => {
        const content = fs.readFileSync(sourceFolder + path);
        ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
            U.writeFile(distFolder + lib + '/code/' + path, content);
        });
    });

    // Copy lib files to the distribution packages. These files are used in the offline-export.
    ['jspdf.js', 'jspdf.src.js', 'svg2pdf.js', 'svg2pdf.src.js', 'canvg.js', 'canvg.src.js'].forEach((path) => {
        const content = fs.readFileSync(libFolder + path);
        ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
            U.writeFile(distFolder + lib + '/code/lib/' + path, content);
        });
    });
    // Copy radial gradient to dist.
    ['vml-radial-gradient.png'].forEach((path) => {
        const content = fs.readFileSync('./gfx/' + path);
        ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
            U.writeFile(distFolder + lib + '/gfx/' + path, content);
        });
    });
};

const createProductJS = () => {
    const U = require('./assembler/utilities.js');
    const D = require('./assembler/dependencies.js');
    const path = './build/dist/products.js';

    // @todo Get rid of build.properties and perhaps use package.json in stead.
    const buildProperties = U.getFile('./build.properties');
    let date = D.regexGetCapture(/highcharts\.product\.date=(.+)/, buildProperties);
    let version = D.regexGetCapture(/highcharts\.product\.version=(.+)/, buildProperties);

    // @todo Add reasonable defaults
    date = date === null ? '' : date;
    version = version === null ? '' : version;

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
    }
}`;
    U.writeFile(path, content);
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
    const exec = require('child_process').exec;
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

const filesize = () => {
    const sourceFolder = './code/';
    // @todo Correct type names to classic and styled
    const types = argv.type ? [argv.type] : ['classic', 'css'];
    const filenames = argv.file ? argv.file.split(',') : ['highcharts.src.js'];
    const files = filenames.reduce((arr, name) => {
        const p = types.map(t => (t === 'css' ? 'js/' : '') + name);
        return arr.concat(p);
    }, []);
    const getGzipSize = (content) => {
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

    const runFileSize = (obj, key) => {
        return Promise.resolve(scripts())
        .then(() => compile(files, sourceFolder))
        .then(() => {
            return files.reduce((o, n) => {
                const getFile = require('./assembler/utilities.js').getFile;
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
            }, obj);
        });
    };

    return runFileSize({}, 'new')
    .then((obj) => {
        return commandLine('git stash')
        .then(() => obj); // Pass obj to next function
    })
    .then((obj) => runFileSize(obj, 'head'))
    .then((obj) => {
        return commandLine('git stash apply && git stash drop')
        .then(() => obj); // Pass obj to next function
    })
    .then((obj) => {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            const values = obj[key];
            report(key, values.new, values.head);
        });
    })
    .catch(console.log);
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

gulp.task('create-productjs', createProductJS);
gulp.task('clean-dist', cleanDist);
gulp.task('clean-code', cleanCode);
gulp.task('copy-to-dist', copyToDist);
gulp.task('filesize', filesize);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('build-modules', buildModules);
gulp.task('lint', lint);
gulp.task('lint-samples', lintSamples);
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
        .then(gulpify('createProductJS', createProductJS))
        .then(gulpify('ant-dist', antDist));
});
gulp.task('browserify', function () {
    const fs = require('fs');
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

gulp.task('common', ['scripts', 'browserify', 'webpack']);
