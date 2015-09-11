var eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    config = {
        // List of rules at http://eslint.org/docs/rules/
        // @todo Add more rules when ready.
        rules: {
            "comma-dangle": [2, "never"],
            "no-cond-assign": [1, "always"]
        }
    },
    paths = {
        "distributions": ['./js/highcharts-3d.src.js', './js/highcharts-more.src.js', './js/highcharts.src.js', './js/highmaps.src.js', './js/highstock.src.js'],
        "modules": ['./js/modules/*.js'],
        "parts": ['./js/parts/*.js'],
        "parts3D": ['./js/parts-3d/*.js'],
        "partsMap": ['./js/parts-map/*.js'],
        "partsMore": ['./js/parts-more/*.js'],
        "themes": ['./js/themes/*.js']
    };

gulp.task('build', function () {
    var requirejs = require('requirejs'),
        filename = 'highcharts-build',
        config = {
            baseUrl: './js',
            name: filename,
            optimize: 'none',
            out: './dist/' + filename,
            onModuleBundleComplete: function (data) {
                var gulp = module.require('gulp'),
                    replace = module.require('gulp-replace'),
                    WS = '\\s*',
                    CM = ',',
                    captureQuoted = "'([^']+)'",
                    captureArray = "\\[(.*?)\\]",
                    captureFunc = "(function[\\s\\S]*?\\})\\);((?=\\s*define)|\\s*$)",
                    defineStatements = new RegExp('define\\(' + WS + captureQuoted + WS + CM + WS + captureArray + WS + CM + WS + captureFunc, 'g');
                
                gulp.src(data.path)
                    .pipe(replace(defineStatements, 'var $1 = ($3($2));'))
                    .pipe(replace(filename, 'Highcharts'))
                    .pipe(gulp.dest('./dist/2/'+filename));
            }
        };
    requirejs.optimize(config, function (buildResponse) {
        console.log("Successfully build");
    }, function(err) {
        console.log(err.originalError);
    });
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