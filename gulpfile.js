/* eslint-env node */
/* eslint no-console:0, valid-jsdoc:0 */

'use strict';
var colors = require('colors'),
    eslint = require('gulp-eslint'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gzipSize = require('gzip-size'),
    closureCompiler = require('closurecompiler'),
    argv = require('yargs').argv,
    fs = require('fs'),
    // sass = require('gulp-sass'),
    ftp = require('vinyl-ftp'),
    spawn = require('child_process').spawn,
    xml2js = require('xml2js');

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
 * Look up in build.xml and concatenate the parts files
 *
 * @param {Array} assemblies An array of assembly file names
 * @returns {Array} A parallel array containing the concatenated files
 */
function assemble(assemblies) {

    var xml = fs.readFileSync('./build.xml', 'utf8'),
        ret = [];

    xml2js.parseString(xml, function (err, result) {
        if (err) {
            throw err;
        }
        xml = result;
    });

    assemblies.forEach(function (assembly) {
        xml.project.target.forEach(function (target) {
            if (target.$.name === 'set.properties') {
                target.filelist.forEach(function (list) {
                    var partsDir = '',
                        tpl = '';
                    if (list.$.id === assembly + '.files') {
                        if (assembly === 'highchartsmore') {
                            partsDir = 'parts-more/';

                        } else if (assembly === 'highmaps') {
                            partsDir = '';
                        } else if (assembly === 'highstock') {
                            partsDir = '';
                        }

                        if (assembly === 'highcharts3d') {
                            partsDir = 'parts-3d/';
                        }

                        list.file.forEach(function (item) {
                            var file = fs.readFileSync('./js/' + partsDir + item.$.name, 'utf8');

                            file = file.replace(/\t/g, '    ');

                            // Indent all files so we can use jsLints whitespace
                            if (item.$.name.indexOf('Intro') === -1 && item.$.name.indexOf('Outro') === -1) {
                                file = file.replace(/\n/g, '\n    ');
                            }
                            tpl += file;
                        });

                        tpl = tpl.replace(/ {4}[\r]?\n/g, '\n');

                        tpl = tpl.replace(
                            'http://code.highcharts.com@product.cdnpath@/@product.version@/modules/canvas-tools.js',
                            'http://code.highcharts.com/modules/canvas-tools.js'
                        );

                        ret.push(tpl);
                    }
                });
            }
        });
    });
    return ret;
}

    /*
    optimizeHighcharts = function (fs, path) {
        var wrapFile = './js/parts/Intro.js',
            WS = '\\s*',
            CM = ',',
            captureQuoted = "'([^']+)'",
            captureArray = "\\[(.*?)\\]",
            captureFunc = "(function[\\s\\S]*?\\})\\);((?=\\s*define)|\\s*$)",
            defineStatements = new RegExp('define\\(' + WS + captureQuoted + WS + CM + WS + captureArray + WS + CM + WS + captureFunc, 'g');
        fs.readFile(path, 'utf8', function (err, data) {
            var lines = data.split("\n"),
                wrap = fs.readFileSync(wrapFile, 'utf8');
            lines.forEach(function (line, i) {
                if (line.indexOf("define") !== -1) {
                    lines[i] = lines[i].replace(/\.\//g, ''); // Remove all beginnings of relative paths
                    lines[i] = lines[i].replace(/\//g, '_'); // Replace all forward slashes with underscore
                    lines[i] = lines[i].replace(/"/g, ''); // Remove all double quotes
                }
            });
            data = lines.join('\n'); // Concatenate lines
            data = data.replace(defineStatements, 'var $1 = ($3($2));'); // Replace define statement with a variable declaration
            wrap = wrap.replace(/.*@code.* /, data); // Insert code into UMD wrap
            fs.writeFile(path, wrap, 'utf8');
        });

    },
    bundleHighcharts = function (file) {
        var requirejs = require('requirejs'),
            fileName = file.slice(0, -3), // Remove file extension (.js) from name
            config = {
                baseUrl: './js/',
                name: 'builds/' + fileName,
                optimize: 'none',
                out: './js/' + file,
                onModuleBundleComplete: function (info) {
                    optimizeHighcharts(fs, info.path);
                }
            };

        requirejs.optimize(config, function (buildResponse) {
            console.log("Successfully build " + fileName);
        }, function(err) {
            console.log(err.originalError);
        });
    };

gulp.task('build', function () {
    var buildFiles = fs.readdirSync(paths.buildsDir);
    buildFiles.forEach(bundleHighcharts);
});

gulp.task('styles', function () {
    var dir = './js/css/';

    gulp.src(dir + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dir));
});
*/
gulp.task('lint', ['scripts'], function () {
    return gulp.src(paths.assemblies.concat(paths.modules))

        // ESLint config is found in .eslintrc file(s)
        .pipe(eslint())
        .pipe(gulpif(argv.failonerror, eslint.failOnError())) // gulp lint --failonerror
        .pipe(eslint.formatEach());

});
gulp.task('lint-samples', function () {
    return gulp.src(['./samples/*/*/*/demo.js'])

        // ESLint config is found in .eslintrc file(s)
        .pipe(eslint())
        .pipe(gulpif(argv.failonerror, eslint.failOnError())) // gulp lint --failonerror
        .pipe(eslint.formatEach());

});

// Watch changes to CSS files
gulp.task('default', ['scripts'], function () {
    // gulp.watch('./js/css/*.scss',['styles']);
    gulp.watch('./js/*/*.js', ['scripts']);
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
        ['js/highcharts.src.js'],
        null,
        function (error, ccResult) {
            if (ccResult) {

                newSize = gzipSize.sync(ccResult);

                exec('git stash', function (stashError) {
                    if (stashError !== null) {
                        console.log('Error in stash: ' + stashError);
                    }

                    closureCompiler.compile(
                        ['js/highcharts.src.js'],
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
 * Proof of concept to parse super code. Move this logic into the standard build when ready.
 */
gulp.task('scripts', function () {
    var codes = [],
        prods = [],
        assemblies;


    /**
     * Micro-optimize code based on the build object.
     *
     * @param {String} tpl The concatenated JavaScript template to process
     * @param {Object} build The build configuration
     *
     * @returns {String} The processed JavaScript
     */
    function preprocess(tpl, build) {

        var func;

        // Windows newlines
        tpl = tpl.replace(/\r\n/g, '\n');


        // Escape double quotes and backslashes, to be reinserted after parsing
        tpl = tpl.replace(/"/g, '___doublequote___');
        tpl = tpl.replace('/[ ,]/', '___rep3___'); // Conflicts with trailing comma removal below
        tpl = tpl.replace('/[ ,]+/', '___rep4___'); // Conflicts with trailing comma removal below
        tpl = tpl.replace(/\\/g, '\\\\');


        // Prepare newlines
        tpl = tpl.replace(/\n/g, '\\n');

        // Start supercode output, start first output string
        tpl = tpl.replace(/^/, 'var s = "');
        // Start supercode block, closes output string
        tpl = tpl.replace(/\/\*=\s?/g, '";\n');
        // End of supercode block, starts output string
        tpl = tpl.replace(/=\*\//g, '\ns += "');
        // End supercode output, end last output string
        tpl = tpl.replace(/$/, '";\nreturn s;');

        // Uncomment to preview generated supercode
        // fs.writeFile('temp.js', tpl, 'utf8');

        // The evaluation function for the ready built supercode
        func = new Function('build', tpl); // eslint-disable-line no-new-func

        tpl = func(build);

        // Collect trailing commas left when the template engine has removed
        // object literal properties or array items
        tpl = tpl.replace(/,(\s*(\]|\}))/g, '$1');

        tpl = tpl.replace(/___doublequote___/g, '"');
        tpl = tpl.replace(/___rep3___/g, '/[ ,]/');
        tpl = tpl.replace(/___rep4___/g, '/[ ,]+/');

        return tpl;
    }

    /**
     * Replace function variables with actual product info
     *
     * @param {String} tpl The JavaScript template
     * @param {Object} product An object containing product info
     *
     * @returns {String} JavaScript with replaced content
     */
    function addVersion(tpl, product) {
        return tpl
            .replace(/@product\.name@/g, product.name)
            .replace(/@product\.version@/g, product.version)
            .replace(/@product\.date@/g, product.date)
            .replace(/@product\.cdnpath@/g, product.cdnpath);
    }


    /**
     * Parse the build properties files into a structure
     *
     * @returns {Object} An object containing product info
     */
    function getProducts() {
        var lines = fs.readFileSync('./build.properties', 'utf8'),
            products = {};

        lines.split('\n').forEach(function (line) {
            var prod, key;
            line = line.replace(/\r/, '');
            if (line.indexOf('#') !== 0 && line.indexOf('=') !== -1) {
                line = line.split('=');
                key = line[0].split('.');
                prod = key[0];
                key = key[2];
                if (!products[prod]) {
                    products[prod] = {};
                }
                products[prod][key] = line[1];
            }
        });
        return products;
    }

    var products = getProducts();

    // Avoid gulping files in old branch after checkout
    /*
    if (products.highcharts.version.indexOf('4') === 0) {
        return;
    }
    */
    paths.assemblies.forEach(function (path) {

        var prod,
            inpath = path
            .replace('./js/', '')
            .replace('.src.js', '')
            .replace('-', '');

        // highcharts, highmaps or highstock
        if (inpath === 'highmaps' || inpath === 'highstock') {
            prod = inpath;
        } else {
            prod = 'highcharts';
        }

        if (inpath === 'modules/heatmap') {
            inpath = 'heatmap';
        } else if (inpath === 'modules/map') {
            inpath = 'maps';
            prod = 'highmaps';
        }

        // Load through the local debug.php (todo on HC5: require)
        codes.push(inpath);
        prods.push(prod);
    });


    assemblies = assemble(codes);


    // Loop over the source files
    assemblies.forEach(function (tpl, i) {
        var prod = prods[i],
            path = paths.assemblies[i],
            file;

        // Unspecified date, use current
        if (!products[prod].date) {
            products[prod].date = (new Date()).toISOString().substr(0, 10);
        }
        tpl = addVersion(tpl, products[prod]);

        file = fs.readFileSync(path, 'utf8');

        // To avoid noisy commits, change dates if there are actual changes in the contents of the file
        if (file.replace(/\([0-9]{4}-[0-9]{2}-[0-9]{2}\)/g, '()') !== tpl.replace(/\([0-9]{4}-[0-9]{2}-[0-9]{2}\)/g, '()')) {

            // Create the classic file
            fs.writeFileSync(
                path,
                preprocess(tpl, {
                    assembly: true,
                    classic: true
                }),
                'utf8'
            );

            // Create the unstyled file
            /*
            fs.writeFileSync(
                path.replace('.src.js', '.unstyled.src.js'),
                preprocess(tpl, {
                    classic: false
                }),
                'utf8'
            );
            */
        }
    });

    // Special case
    var files = ['./vendor/canvg-1.1/rgbcolor.js', './vendor/canvg-1.1/canvg.js', './js/modules/canvgrenderer-extended.src.js'],
        js = '';

    /**
     * Add a file to the assembly
     *
     * @param {Number} i The index
     * @param {Function} finished Continue when ready
     *
     * @returns {undefined}
     */
    function addFile(i, finished) {
        var file = fs.readFileSync(files[i], 'utf8');

        js += file;
        if (i + 1 < files.length) {
            addFile(i + 1, finished);
        } else if (finished) {
            finished();
        }
    }

    addFile(0, function () {
        js = addVersion(js, products.highcharts);
        fs.writeFileSync('./build/canvas-tools.src.js', js, 'utf8');
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
