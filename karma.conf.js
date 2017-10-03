/* global module */
module.exports = function (config) {
    config.set({
        // frameworks: ['mocha', 'chai'],
        frameworks: ['qunit'],
        files: [

            // Frameworks
            'vendor/jquery-1.9.1.js',

            // Highcharts
            'code/highcharts.src.js',
            'code/highcharts-more.src.js',
            'code/highcharts-3d.src.js',
            'code/modules/stock.src.js',
            'code/modules/map.src.js',
            'code/modules/annotations.src.js',
            // 'code/modules/boost.src.js',
            'code/modules/drilldown.src.js',
            'code/modules/exporting.src.js',
            'code/modules/exporting-data.src.js',
            'code/indicators/*.src.js',

            // Setup the DOM, container etc
            'karma.setup.js',

            // Tests
            'samples/unit-tests/3d/*/demo.js',
            // 'samples/unit-tests/accessibility/*/demo.js',
            'samples/unit-tests/annotations/*/demo.js',
            // 'samples/unit-tests/axis/*/demo.js',
            // 'samples/unit-tests/boost/*/demo.js',
            // 'samples/unit-tests/chart/*/demo.js',
            'samples/unit-tests/color/*/demo.js',
            'samples/unit-tests/coloraxis/*/demo.js',
            'samples/unit-tests/datalabels/*/demo.js',
            'samples/unit-tests/drilldown/*/demo.js'

        ],
        /*
        formatError: function (e) {
            console.log(arguments);
        },
        */
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    });
};
