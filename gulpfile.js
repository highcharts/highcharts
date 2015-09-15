var eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    fs = require('fs'),
    config = {
        // List of rules at http://eslint.org/docs/rules/
        // @todo Add more rules when ready.
        rules: {
            "comma-dangle": [2, "never"],
            "no-cond-assign": [1, "always"]
        }
    },
    paths = {
        "buildsDir": "./js/builds",
        "distributions": ['./js/highcharts-3d.src.js', './js/highcharts-more.src.js', './js/highcharts.src.js', './js/highmaps.src.js', './js/highstock.src.js'],
        "modules": ['./js/modules/*.js'],
        "parts": ['./js/parts/*.js'],
        "parts3D": ['./js/parts-3d/*.js'],
        "partsMap": ['./js/parts-map/*.js'],
        "partsMore": ['./js/parts-more/*.js'],
        "themes": ['./js/themes/*.js']
    },
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
            wrap = wrap.replace(/.*@code.*/, data); // Insert code into UMD wrap
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

function doLint(paths) {
    return gulp.src(paths)
        .pipe(eslint(config))
        .pipe(eslint.formatEach())
        .pipe(eslint.failOnError());
}

gulp.task('lint', function () {
    var p = paths,
        all = p.distributions.concat(p.modules, p.parts, p.parts3D, p.partsMap, p.partsMore, p.themes);
    return doLint(all);
});

gulp.task('lint-distributions', function () {
    return doLint(paths.distributions);
});

gulp.task('lint-modules', function () {
    return doLint(paths.modules);
});

gulp.task('lint-parts', function () {
    return doLint(paths.parts);
});

gulp.task('lint-parts-3d', function () {
    return doLint(paths.parts3D);
});

gulp.task('lint-parts-map', function () {
    return doLint(paths.partsMap);
});

gulp.task('lint-parts-more', function () {
    return doLint(paths.partsMore);
});

gulp.task('lint-themes', function () {
    return doLint(paths.themes);
});