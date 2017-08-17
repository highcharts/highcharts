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
    const sass = require('node-sass');
    const U = require('./assembler/utilities.js');
    const fileName = 'highcharts';
    return new Promise((resolve, reject) => {
        sass.render({
            file: './css/' + fileName + '.scss',
            outputStyle: 'expanded'
        }, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                U.writeFile('./code/css/' + fileName + '.css', result.css);
                resolve();
            }
        });
    });
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
 * Automated generation for internal Class reference.
 * Run with --watch argument to watch for changes in the JS files.
 */
const generateClassReferences = (templateDir, destination) => {
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
        './js/parts-map/GeoJSON.js',
        './js/parts-map/Map.js',
        './js/parts-map/MapNavigation.js',
        './js/parts-map/MapSeries.js',
        './js/modules/drilldown.src.js',
        './js/modules/exporting.src.js',
        './js/modules/export-data.src.js',
        './js/modules/offline-exporting.src.js'
    ];
    const optionsJSDoc = {
        navOptions: {
            theme: 'highsoft'
        },
        opts: {
            destination: destination,
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

const compile = (files, sourceFolder) => {
    const createSourceMap = true;
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
                languageOut: 'ES5',
                createSourceMap: createSourceMap
            });
            U.writeFile(outputPath, out.compiledCode);
            if (createSourceMap) {
                U.writeFile(outputPath + '.map', out.sourceMap);
            }
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
    const files = ['canvg.src.js', 'rgbcolor.src.js'];
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

const copyFile = (source, target) => new Promise((resolve, reject) => {
    const fs = require('fs');
    const U = require('./assembler/utilities.js');
    const directory = U.folder(target);
    U.createDirectory(directory);
    let read = fs.createReadStream(source);
    let write = fs.createWriteStream(target);
    const onError = (err) => {
        read.destroy();
        write.end();
        reject(err);
    };
    read.on('error', onError);
    write.on('error', onError);
    write.on('finish', resolve);
    read.pipe(write);
});

const copyToDist = () => {
    const getFilesInFolder = require('./assembler/build.js').getFilesInFolder;
    const sourceFolder = 'code/';
    const distFolder = 'build/dist/';
    // Additional files to include in distribution.
    const additionals = {
        'gfx/vml-radial-gradient.png': 'gfx/vml-radial-gradient.png',
        'code/css/highcharts.scss': 'css/highcharts.scss',
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
        highcharts: ['highmaps.js', 'highstock.js', 'modules/canvasrenderer.experimental.js', 'modules/map.js', 'modules/map-parser.js'],
        highstock: ['highcharts.js', 'highmaps.js', 'modules/broken-axis.js', 'modules/canvasrenderer.experimental.js', 'modules/map.js', 'modules/map-parser.js'],
        highmaps: ['highstock.js', 'modules/broken-axis.js', 'modules/canvasrenderer.experimental.js', 'modules/map-parser.js', 'modules/series-label.js', 'modules/solid-gauge.js']
    };

    // Copy source files to the distribution packages.
    const codeFiles = getFilesInFolder(sourceFolder, true, '')
        .filter((path) => (
            path.endsWith('.js') ||
            path.endsWith('.js.map') ||
            path.endsWith('.css') ||
            path.endsWith('readme.txt')
        ))
        .reduce((obj, path) => {
            const source = sourceFolder + path;
            const filename = path.replace('.src.js', '.js').replace('js/', '');
            ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
                if (filter[lib].indexOf(filename) === -1) {
                    const target = distFolder + lib + '/code/' + path;
                    obj[target] = source;
                }
            });
            return obj;
        }, {});

    const additionalFiles = Object.keys(additionals).reduce((obj, file) => {
        ['highcharts', 'highstock', 'highmaps'].forEach((lib) => {
            const source = additionals[file];
            const target = `${distFolder}${lib}/${file}`;
            obj[target] = source;
        });
        return obj;
    }, {});

    const files = Object.assign({}, additionalFiles, codeFiles);
    const promises = Object.keys(files).map((target) => {
        const source = files[target];
        return copyFile(source, target);
    });
    return Promise.all(promises);
};

const getBuildProperties = () => {
    const U = require('./assembler/utilities.js');
    const D = require('./assembler/dependencies.js');
    const buildProperties = U.getFile('./build.properties');
    // @todo Get rid of build.properties and perhaps use package.json in stead.
    return {
        date: D.regexGetCapture(/highcharts\.product\.date=(.+)/, buildProperties),
        version: D.regexGetCapture(/highcharts\.product\.version=(.+)/, buildProperties)
    };
};

const createProductJS = () => {
    const U = require('./assembler/utilities.js');
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

/**
 * Gzip a single file.
 * @param {string} file Path to input file.
 * @param {string} output Path to where output the result.
 * @return {undefined}
 * TODO Promisify to use in dist task.
 */
const gzipFile = (file, output) => {
    const zlib = require('zlib');
    const fs = require('fs');
    const gzip = zlib.createGzip();
    const inp = fs.createReadStream(file);
    const out = fs.createWriteStream(output);
    inp.pipe(gzip).pipe(out);
};

const getDirectories = (path) => {
    const fs = require('fs');
    return fs.readdirSync(path).filter(file => fs.lstatSync(path + file).isDirectory());
};

const replaceAll = (str, search, replace) => str.split(search).join(replace);

const assembleSample = (template, content) => {
    return Object.keys(content).reduce((str, key) => {
        return str.replace('@demo.' + key + '@', content[key]);
    }, template);
};

const createExamples = (title, samplesFolder, output) => {
    const U = require('./assembler/utilities.js');
    const getFile = U.getFile;
    const writeFile = U.writeFile;
    const template = getFile('samples/template-example.htm');
    const samples = getDirectories(samplesFolder);
    const convertURLToLocal = str => {
        const stock = 'src="https://code.highcharts.com/stock/';
        const maps = 'src="https://code.highcharts.com/maps/';
        const chart = 'src="https://code.highcharts.com/';
        const mapdata = 'src="https://code.highcharts.com/mapdata';
        const localPath = 'src="../../code/';
        str = replaceAll(str, stock, localPath);
        str = replaceAll(str, maps, localPath);
        str = replaceAll(str, chart, localPath);
        str = replaceAll(str, '../../js/mapdata', mapdata);
        return str;
    };
    samples.forEach((name) => {
        const folder = samplesFolder + name + '/';
        const contents = ['html', 'css', 'js'].reduce((obj, key) => {
            let content = getFile(folder + 'demo.' + key);
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
    const getFilesInFolder = require('./assembler/build.js').getFilesInFolder;
    const files = getFilesInFolder(input);
    const promises = files.map(file => copyFile(input + file, output + file));
    return Promise.all(promises)
        .then(() => console.log('Copied folder ' + input + ' to ' + output));
};

const copyGraphicsToDist = () => {
    const dist = 'build/dist/';
    const promises = ['highcharts', 'highstock', 'highmaps'].map((lib) => {
        return copyFolder('samples/graphics/', dist + lib + '/graphics/');
    });
    return Promise.all(promises)
        .then(() => console.log('Copied all graphics to dist folders.'));
};

const createAllExamples = () => new Promise((resolve) => {
    const config = {
        'Highcharts': {
            samplesFolder: 'samples/highcharts/demo/',
            output: 'build/dist/highcharts/examples/'
        },
        'Highstock': {
            samplesFolder: 'samples/stock/demo/',
            output: 'build/dist/highstock/examples/'
        },
        'Highmaps': {
            samplesFolder: 'samples/maps/demo/',
            output: 'build/dist/highmaps/examples/'
        }
    };
    Object.keys(config).forEach(lib => {
        const c = config[lib];
        createExamples(lib, c.samplesFolder, c.output);
    });
    resolve();
});

/**
 * Copy new current version files into a versioned folder
 */
const copyAPIFiles = (dist, version) => {
    const B = require('./assembler/build.js');
    const notVersionedFolder = (file) => !(
        (file.split('/').length > 1) && // is folder
        !isNaN(file.charAt(0)) // is numbered
    );
    const message = {
        'start': 'Started process of copying API files from to a versioned folder.',
        'successCopy': 'Finished with copying current API to '
    };
    console.log(message.start);
    const paths = ['highcharts', 'highstock', 'highmaps'].reduce((obj, lib) => {
        const files = B.getFilesInFolder(`${dist}/${lib}/`, true, '');
        files
            .filter(notVersionedFolder)
            .forEach((filename) => {
                const from = `${dist}/${lib}/${filename}`;
                const to = `${dist}/${lib}/${version}/${filename}`;
                obj[from] = to;
            });
        return obj;
    }, {});
    const promises = Object.keys(paths).map((from) => {
        const to = paths[from];
        return copyFile(from, to);
    });
    return Promise.all(promises).then(() => {
        console.log(message.successCopy);
    });
};

const generateAPI = (input, output, onlyBuildCurrent) => new Promise((resolve, reject) => {
    const fs = require('fs');
    // const generate = require('highcharts-api-doc-gen/lib/index.js');
    const generate = require('./../api-docs/lib/index.js');
    const message = {
        'start': 'Started generating API documentation.',
        'noSeries': 'Missing series in tree.json. Run merge script.',
        'noTree': 'Missing tree.json. This task is dependent upon the jsdoc task.',
        'success': 'Finished with my Special api.'
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
const generateAPIDocs = (treeFile, output, onlyBuildCurrent) => {
    const version = getBuildProperties().version;
    const message = {
        'successJSDoc': colors.green('Created tree.json')
    };
    const sourceFiles = [
        './js/modules',
        './js/parts',
        './js/parts-3d',
        './js/parts-more',
        './js/parts-map',
        './js/supplemental.docs.js'
    ];
    const configJSDoc = {
        plugins: ['./tools/jsdoc/plugins/highcharts.jsdoc']
    };
    const jsdoc = require('gulp-jsdoc3');
    return new Promise((resolve, reject) => {
        gulp.src(sourceFiles, { read: false })
        .pipe(jsdoc(configJSDoc, (err) => {
            if (!err) {
                console.log(message.successJSDoc);
                resolve(message.successJSDoc);
            } else {
                reject(err);
            }
        }));
    })
    .then(() => generateAPI(treeFile, output, onlyBuildCurrent))
    // .then(() => copyAPIFiles(output, version));
};

const uploadAPIDocs = () => {
    const B = require('./assembler/build.js');
    const U = require('./assembler/utilities.js');
    const storage = require('./tools/jsdoc/storage/cdn.storage');
    const sourceFolder = './build/api/';
    const mimeType = {
        'css': 'text/css',
        'html': 'text/html',
        'js': 'text/javascript',
        'json': 'application/json'
    };
    const files = B.getFilesInFolder(sourceFolder, true, '');
    const cdn = storage.strategy.s3({
        Bucket: 'api-docs-bucket.highcharts.com'
    });
    const promises = files.map((fileName) => {
        const content = U.getFile(sourceFolder + fileName);
        const fileType = fileName.split('.').pop();
        return storage.push(cdn, fileName, content, mimeType[fileType])
            .then(() => {
                console.log(('Uploaded ' + fileName).green);
            })
            .catch((e) => {
                console.log(('Error uploading ' + e.message).red);
            });
    });
    return Promise.all(promises);
};

const startServer = () => {
    // Start a server serving up the api reference
    const http = require('http');
    const url = require('url');
    const fs = require('fs');
    const docport = 9005;
    const base = '127.0.0.1:' + docport;
    const apiPath = __dirname + '/build/api/';
    const mimes = {
        png: 'image/png',
        js: 'text/javascript',
        json: 'text/json',
        html: 'text/html',
        css: 'text/css',
        svg: 'image/svg+xml'
    };

    http.createServer((req, res) => {
        let path = url.parse(req.url, true).pathname;
        let file = false;
        let redirect = false;

        if (path === '/highcharts' || path === '/' || path === '') {
            redirect = '/highcharts/';
        } else if (path === '/highstock') {
            redirect = '/highstock/';
        } else if (path === '/highmaps') {
            redirect = '/highmaps/';
        }
        if (redirect) {
            res.writeHead(302, {
                'Location': redirect
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
            let ti = path.lastIndexOf('.');
            if (ti < 0 || path.length === 0) {
                file = 'index.html';
                res.writeHead(200, { 'Content-Type': mimes.html });
            } else {
                file = path.substr(path.lastIndexOf('/') + 1);
                res.writeHead(200, { 'Content-Type': mimes[path.substr(ti + 1)] });
            }

            let ext = file.substr(file.lastIndexOf('.') + 1);
            if (['js', 'json', 'css', 'svg', 'png', 'jpg', 'html', 'ico'].indexOf(ext) === -1) {
                file += '.html';
            }

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
        ('http://localhost:' + docport).blue.underline.bgWhite
    );
};

gulp.task('start-api-server', startServer);
gulp.task('upload-api', uploadAPIDocs);
gulp.task('generate-api', generateAPIDocs);
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
gulp.task('copy-graphics-to-dist', copyGraphicsToDist);
gulp.task('examples', createAllExamples);

let apiServerRunning = false;

/**
 * Create Highcharts API and class refrences from JSDOC
 */
gulp.task('jsdoc', () => {
    const optionsClassReference = {
        templateDir: './../highcharts-docstrap',
        destination: './build/api/class-reference/'
    };
    const optionsAPI = {
        treeFile: './tree.json',
        output: './build/api',
        onlyBuildCurrent: true
    };
    const dir = optionsClassReference.templateDir;
    const watchFiles = [
        './js/!(adapters|builds)/*.js',
        './../api-docs/include/*.*',
        dir + '/template/tmpl/*.tmpl',
        dir + '/template/static/styles/*.css',
        dir + '/template/static/scripts/*.js'
    ];
    if (argv.watch) {
        gulp.watch(watchFiles, ['jsdoc']);
        console.log('Watching file changes in JS files and templates');

        if (!apiServerRunning) {
            startServer();
            apiServerRunning = true;
        }

    } else {
        console.log('Tip: use the --watch argument to watch JS file changes');
    }

    return generateClassReferences(optionsClassReference)
        .then(() => generateAPIDocs(optionsAPI));
});
/**
 * Create distribution files
 */
gulp.task('dist', () => {
    return Promise.resolve()
        .then(gulpify('cleanCode', cleanCode))
        .then(gulpify('styles', styles))
        .then(gulpify('scripts', scripts))
        .then(gulpify('lint', lint))
        .then(gulpify('compile', compileScripts))
        .then(gulpify('cleanDist', cleanDist))
        .then(gulpify('copyToDist', copyToDist))
        .then(gulpify('downloadAllAPI', downloadAllAPI))
        .then(gulpify('createProductJS', createProductJS))
        .then(gulpify('createExamples', createAllExamples))
        .then(gulpify('copyGraphicsToDist', copyGraphicsToDist))
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
