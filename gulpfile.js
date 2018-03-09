/* eslint-env node, es6 */
/* eslint no-console:0, no-path-concat:0, valid-jsdoc:0 */
/* eslint-disable func-style */

'use strict';
const colors = require('colors');
const glob = require('glob');
const gulp = require('gulp');
const argv = require('yargs').argv;
const fs = require('fs');
const {
    getFilesInFolder
} = require('highcharts-assembler/src/build.js');
const {
    getFile,
    removeDirectory,
    writeFile
} = require('highcharts-assembler/src/utilities.js');
const {
    scripts,
    getBuildScripts
} = require('./tools/build.js');

/**
 * Creates a set of ES6-modules which is distributable.
 * @return {undefined}
 */
const buildESModules = () => {
    const {
        buildModules
    } = require('../highcharts-assembler/src/build.js');
    buildModules({
        base: './js/',
        output: './code/',
        type: 'both'
    });
};

const compileSingleStyle = (fileName) => {
    const sass = require('node-sass');
    const input = './css/' + fileName + '.scss';
    const output = './code/css/' + fileName + '.css';
    return new Promise((resolve, reject) => {
        sass.render({
            file: input,
            outputStyle: 'expanded'
        }, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                writeFile(output, result.css);
                console.log(`Completed rendering of ${input} to ${output}`);
                resolve();
            }
        });
    });
};

const styles = () => {
    const files = ['highcharts', 'dark-uniqua', 'sand-signika', 'grid-light'];
    const promises = files.map(file => compileSingleStyle(file));
    return Promise.all(promises);
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

gulp.task('ftp', function () {
    const ftp = require('vinyl-ftp');
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
 * Run the test suite.
 */
gulp.task('test', done => {

    const lastRunFile = __dirname + '/test/last-run.json';

    const getModifiedTime = (pattern) => {
        let mtimeMs = 0;
        glob.sync(pattern).forEach(file => {
            mtimeMs = Math.max(
                mtimeMs,
                fs.statSync(file).mtimeMs
            );
        });
        return mtimeMs;
    };

    const shouldRun = () => {
        // let lastBuildMTime = getModifiedTime(__dirname + '/code/**/*.js');
        let sourceMTime = getModifiedTime(__dirname + '/js/**/*.js');
        let unitTestsMTime = getModifiedTime(__dirname + '/samples/unit-tests/**/*.*');
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

        if (sourceMTime < lastSuccessfulRun && unitTestsMTime < lastSuccessfulRun) {
            console.log('\n✓'.green + ' Source code and unit tests not modified since the last successful test run.\n'.gray);
            return false;
        }
        return true;
    };


    if (argv.help) {
        console.log(
`
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

`
        );
        return;
    }

    if (shouldRun()) {

        console.log('Run ' + 'gulp test --help'.cyan + ' for available options');

        const Server = require('karma').Server;
        const gutils = require('gulp-util');
        new Server({
            configFile: __dirname + '/test/karma-conf.js',
            singleRun: true
        }, err => {
            if (err === 0) {
                done();

                fs.writeFileSync(
                    lastRunFile,
                    JSON.stringify({ lastSuccessfulRun: Date.now() })
                );
            } else {
                done(new gutils.PluginError('karma', {
                    message: 'Tests failed'
                }));
            }
        }).start();
    } else {
        done();
    }
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
        './js/parts/Time.js',
        './js/parts-map/GeoJSON.js',
        './js/parts-map/Map.js',
        './js/parts-map/MapNavigation.js',
        './js/parts-map/MapSeries.js',
        './js/modules/drilldown.src.js',
        './js/modules/exporting.src.js',
        './js/modules/export-data.src.js',
        './js/modules/data.src.js',
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

const compileSingleFile = (path, sourceFolder, createSourceMap) => {
    const closureCompiler = require('google-closure-compiler-js');
    const sourcePath = sourceFolder + path;
    const outputPath = sourcePath.replace('.src.js', '.js');
    const src = getFile(sourcePath);
    const getErrorMessage = (e) => {
        return [
            'Compile error in file: ' + path,
            '- Type: ' + e.type,
            '- Line: ' + e.lineNo,
            '- Char : ' + e.charNo,
            '- Description: ' + e.description
        ].join('\n');
    };
    return new Promise((resolve, reject) => {
        const out = closureCompiler.compile({
            compilationLevel: 'SIMPLE_OPTIMIZATIONS',
            jsCode: [{
                src: src
            }],
            languageIn: 'ES5',
            languageOut: 'ES5',
            createSourceMap: createSourceMap
        });
        const errors = out.errors;
        if (errors.length) {
            const msg = errors.map(getErrorMessage).join('\n');
            reject(msg);
        } else {
            writeFile(outputPath, out.compiledCode);
            if (createSourceMap) {
                writeFile(outputPath + '.map', out.sourceMap);
            }
            // @todo add filesize information
            console.log(colors.green('Compiled ' + sourcePath + ' => ' + outputPath));
            resolve();
        }
    });
};

const compile = (files, sourceFolder) => {
    console.log(
      colors.yellow('Warning: This task may take a few minutes on Mac, and even longer on Windows.')
    );
    const createSourceMap = true;
    const promises = files
      .map(path => compileSingleFile(path, sourceFolder, createSourceMap));
    return Promise.all(promises);
};

/**
 * Compile the JS files in the /code folder
 */
const compileScripts = () => {
    const sourceFolder = './code/';
    const files = getFilesInFolder(sourceFolder, true, '')
        // Compile all files ending with .src.js.
        // Do not compile files in ./es-modules or ./js/es-modules.
      .filter(path => (path.endsWith('.src.js') && !path.includes('es-modules')));
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

const cleanDist = () => {
    return removeDirectory('./build/dist').then(() => {
        console.log('Successfully removed dist directory.');
    });
};

const cleanApi = () => {
    return removeDirectory('./build/api')
        .then(() => {
            console.log('Successfully removed api directory.');
        });
};

const copyFile = (source, target) => new Promise((resolve, reject) => {
    const {
        dirname
    } = require('path');
    const {
        createDirectory
    } = require('highcharts-assembler/src/utilities.js');
    const directory = dirname(target);
    createDirectory(directory);
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
        highcharts: [
            'highmaps.js',
            'highstock.js',
            'indicators/',
            'modules/canvasrenderer.experimental.js',
            'modules/map.js',
            'modules/map-parser.js'
        ].map(str => new RegExp(str)),
        highstock: [
            'highcharts.js',
            'highmaps.js',
            'modules/broken-axis.js',
            'modules/canvasrenderer.experimental.js',
            'modules/map.js',
            'modules/map-parser.js'
        ].map(str => new RegExp(str)),
        highmaps: [
            'highstock.js',
            'indicators/',
            'modules/broken-axis.js',
            'modules/canvasrenderer.experimental.js',
            'modules/map-parser.js',
            'modules/series-label.js',
            'modules/solid-gauge.js'
        ].map(str => new RegExp(str))
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
                const filters = filter[lib];
                const include = !filters.find((regex) => {
                    return regex.test(filename);
                });
                if (include) {
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
    }
}`;
    writeFile(path, content);
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
    // @todo Correct type names to classic and styled and rename the param to
    // 'mode'
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

const getDirectories = (path) => {
    return fs.readdirSync(path).filter(file => fs.lstatSync(path + file).isDirectory());
};

const replaceAll = (str, search, replace) => str.split(search).join(replace);

const assembleSample = (template, content) => {
    return Object.keys(content).reduce((str, key) => {
        return str.replace('@demo.' + key + '@', content[key]);
    }, template);
};

const createExamples = (title, samplesFolder, output) => {
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
        const pathFolder = samplesFolder + name + '/';
        const contents = ['html', 'css', 'js'].reduce((obj, key) => {
            let content = getFile(pathFolder + 'demo.' + key);
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
/*
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
*/

const generateAPI = (input, output, onlyBuildCurrent) => new Promise((resolve, reject) => {
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
 * Some random tests for tree.json's consistency
 */
const testTree = (treeFile) => new Promise((resolve, reject) => {
    const tree = JSON.parse(fs.readFileSync(treeFile, 'utf8'));

    if (Object.keys(tree.plotOptions.children).length < 66) {
        reject('Tree.json should contain at least 66 series types');

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
        'successJSDoc': colors.green('Created tree.json')
    };
    const sourceFiles = [
        './js/indicators',
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
    .then(() => testTree(treeFile));
};

const logUpdate = require('log-update');
const ProgressBar = function (user) {
    const getBar = (options) => {
        const length = options.length;
        const percentage = options.count / options.total;
        const chars = Math.floor(percentage * length);
        return options.complete.repeat(chars) + options.incomplete.repeat(length - chars);
    };
    const getMsg = (options) => {
        return options.message
            .replace(':bar', getBar(options))
            .replace(':count', options.count)
            .replace(':total', options.total);
    };
    const options = Object.assign({
        count: 0,
        complete: '=',
        incomplete: '-',
        length: 30,
        message: '[:bar] - :count of :total',
        total: 100
    }, user);
    this.render = () => {
        logUpdate(getMsg(options));
    };
    this.complete = function () {
        this.tick = () => {};
        logUpdate.done();
    };
    this.tick = function () {
        options.count++;
        this.render();
        if (options.count === options.total) {
            this.complete();
        }
    };
    this.render();
    return this;
};

const asyncForeach = (arr, fn) => {
    const length = arr.length;
    const generator = (j) => {
        let promise;
        if (j < length) {
            promise = fn(arr[j], j, arr).then(() => {
                // console.log('then ' + j)
                return generator(j + 1);
            });
        }
        return promise;
    };
    return generator(0);
};

const asyncBatchForeach = (batchSize, arr, fn) => {
    const length = arr.length;
    const generator = (from, to) => {
        let result;
        if (from < length) {
            const batch = arr.slice(from, to);
            const promises = batch.map((el, i) => {
                return fn(el, from + i, arr);
            });
            result = Promise.all(promises).then(() => {
                return generator(to, to + batchSize);
            });
        }
        return result;
    };
    return generator(0, batchSize);
};

gulp.task('testing', () => {
    let messages = [];
    const min = 500;
    const max = 2000;
    for (let i = 0; i < 1000; i++) {
        messages.push({
            m: i,
            time: Math.random() * (max - min) + min
        });
    }
    const bar = new ProgressBar({
        total: messages.length
    });
    const func = (time) => {
        return new Promise((resolve) => {
            let interval = setInterval(() => {
                clearInterval(interval);
                resolve();
            }, time);
        });
    };
    return asyncBatchForeach(100, messages, (entry) => {
        return func(entry.time).then(() => {
            bar.tick();
        });
    });
});

const isFunction = x => typeof x === 'function';
const isArray = x => Array.isArray(x);
const isString = x => typeof x === 'string';

const uploadFiles = (params) => {
    const storage = require('./tools/jsdoc/storage/cdn.storage');
    const mimeType = {
        'css': 'text/css',
        'html': 'text/html',
        'js': 'text/javascript',
        'json': 'application/json'
    };
    const {
        batchSize,
        bucket,
        callback,
        files
    } = params;
    let result;
    if (isString(bucket) && isArray(files)) {
        const cdn = storage.strategy.s3({
            Bucket: bucket
        });
        const uploadFile = (file) => {
            const { from, to } = file;
            let filePromise;
            if (isString(from) && isString(to)) {
                const content = getFile(from);
                if (isString(content)) {
                    const fileType = from.split('.').pop();
                    filePromise = storage.push(cdn, to, content, mimeType[fileType])
                      .then(() => isFunction(callback) && callback());
                } else {
                    filePromise = Promise.reject(new Error('Path is not a file: ' + from));
                }
            } else {
                filePromise = Promise.reject(
                    new Error([
                        'Invalid file information!',
                        'from: ' + from,
                        'to: ' + to
                    ].join('\n'))
                );
            }
            return filePromise;
        };
        const onError = (err) => {
            console.log([
                'Found error',
                err.stack,
                ''
            ].join('\n'));
        };
        // const promises = files.map(uploadFile);
        // result = Promise.all(promises).catch(onError);
        result = asyncBatchForeach(batchSize, files, uploadFile)
          .catch((err) => onError(err));
    } else {
        result = Promise.reject();
    }
    return result;
};

const uploadAPIDocs = () => {
    const sourceFolder = './build/api/';
    const bucket = 'api-docs-bucket.highcharts.com';
    const batchSize = 30000;
    const files = getFilesInFolder(sourceFolder, true, '');
    const tags = isString(argv.tags) ? argv.tags.split(',') : ['current'];
    const getUploadConfig = (tag) => {
        const bar = new ProgressBar({
            total: files.length,
            message: `[:bar] - Uploading ${tag}. Completed :count of :total.'`
        });
        const doTick = () => {
            bar.tick();
        };
        const params = {
            batchSize: batchSize,
            bucket: bucket,
            callback: doTick
        };
        const getMapOfFromTo = (fileName) => {
            let to = fileName;
            if (tag !== 'current') {
                let parts = to.split('/');
                parts.splice(1, 0, tag);
                to = parts.join('/');
            }
            return {
                from: sourceFolder + fileName,
                to: to
            };
        };
        params.files = files.map(getMapOfFromTo);
        return params;
    };
    console.log(`Started upload of ${files.length} files to API under tags [${tags.join(', ')}].`);
    return asyncForeach(tags, (tag) => {
        return Promise.resolve(getUploadConfig(tag)).then(uploadFiles);
    });
};

const startServer = () => {
    // Start a server serving up the api reference
    const http = require('http');
    const url = require('url');
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

        if (path === '/highcharts' || path === '/' || path === '') {
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
                res.writeHead(200, {
                    'Content-Type': mimes[path.substr(ti + 1)] || mimes.html
                });
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
        ('http://localhost:' + docport).cyan
    );
};

let apiServerRunning = false;

/**
 * Create Highcharts API and class refrences from JSDOC
 */
const jsdoc = () => {
    const optionsClassReference = {
        templateDir: './../highcharts-docstrap',
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
        './../api-docs/include/*.*',
        dir + '/template/tmpl/*.tmpl',
        dir + '/template/static/styles/*.css',
        dir + '/template/static/scripts/*.js'
    ];
    if (argv.watch) {
        gulp.watch(watchFiles, ['jsdoc']);
        console.log('Watching file changes in JS files and templates');

    } else {
        console.log('Tip: use the --watch argument to watch JS file changes');
    }

    if (!apiServerRunning) {
        startServer();
        apiServerRunning = true;
    }

    return generateClassReferences(optionsClassReference)
        .then(() => generateAPIDocs(optionsAPI));
};

gulp.task('start-api-server', startServer);
gulp.task('upload-api', uploadAPIDocs);
gulp.task('create-productjs', createProductJS);
gulp.task('clean-api', cleanApi);
gulp.task('clean-dist', cleanDist);
gulp.task('clean-code', cleanCode);
gulp.task('copy-to-dist', copyToDist);
gulp.task('filesize', filesize);
gulp.task('jsdoc', jsdoc);
gulp.task('styles', styles);
/**
 * Gulp task to run the building process of distribution files. By default it
 * builds all the distribution files. Usage: "gulp build".
 * @param {string} --file Optional command line argument. Use to build a one
 * or sevral files. Usage: "gulp build --file highcharts.js,modules/data.src.js"
 * TODO add --help command to inform about usage.
 * @return undefined
 */
gulp.task('scripts', () => {
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
    fnFirstBuild();
    if (options.watch) {
        Object.keys(mapOfWatchFn).forEach((key) => {
            const fn = mapOfWatchFn[key];
            gulp.watch(key, fn);
        });
    }
});
gulp.task('build-modules', buildESModules);
gulp.task('lint', lint);
gulp.task('lint-samples', lintSamples);
gulp.task('compile', compileScripts);
gulp.task('compile-lib', compileLib);
gulp.task('copy-graphics-to-dist', copyGraphicsToDist);
gulp.task('examples', createAllExamples);

/**
 * Watch changes to JS and SCSS files
 */
gulp.task('default', () => {
    const {
        fnFirstBuild,
        mapOfWatchFn
    } = getBuildScripts({});
    const {
        relative,
        sep
    } = require('path');
    const watchlist = [
        './css/*.scss',
        './js/**/*.js',
        './code/es-modules/**/*.js',
        './code/js/es-modules/**/*.js'
    ];
    const msgBuildAll = 'Completed building of all JS files.';
    let watcher;
    const onChange = (event) => {
        const path = relative('.', event.path).split(sep).join('/');
        if (path.startsWith('css')) {
            // Stop the watcher temporarily.
            watcher.end();
            watcher = null;
            // Run styles and build all files.
            styles()
            .then(() => {
                fnFirstBuild();
                console.log(msgBuildAll);
                // Start watcher again.
                watcher = gulp.watch(watchlist, onChange);
            });
        } else if (path.startsWith('js')) {
            // Build es-modules
            mapOfWatchFn['js/**/*.js'](event);
        } else if (path.startsWith('code/es-modules')) {
            // Build dist files in classic mode.
            mapOfWatchFn['code/es-modules/**/*.js'](event);
        } else if (path.startsWith('code/js/es-modules')) {
            // Build dist files in styled mode.
            mapOfWatchFn['code/js/es-modules/**/*.js'](event);
        }
    };
    return styles()
    .then(() => {
        fnFirstBuild();
        console.log(msgBuildAll);
        // Start watching source files.
        watcher = gulp.watch(watchlist, onChange);
    });
});

/**
 * Create distribution files
 */
gulp.task('dist', () => {
    return Promise.resolve()
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
        .then(gulpify('ant-dist', antDist));
});

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

gulp.task('common', ['scripts', 'browserify', 'webpack']);
