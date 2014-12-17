/*global module */
module.exports = function(grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-jslint'); // load the task

    grunt.initConfig({
        jslint: { // configure the task
            // lint your project's server code
            server: {
                src: [
                    'samples/*/*/*/demo.js'
                ],

                exclude: [
                    'samples/issues/*/*/demo.js',
                    'samples/*/issues/*/demo.js',
                    'samples/*/studies/*/demo.js',
                    'samples/maps/demo/us-counties/demo.js',              // All but the data variable is linted. --CONTINUE TO IGNORE
                    'samples/maps/demo/us-data-labels/demo.js',           // Dangling underscore!
                    'samples/maps/demo/rich-info/demo.js',                // Ignore it, too much needs to be changed. --CONTINUE TO IGNORE
                    'samples/highcharts/members/series-update/demo.js',   // Object and references goes to horribly wrongler while eaching and clicking.. "Unused 'i'"
                    'samples/highcharts/demo/heatmap-canvas/demo.js',     // Decent amount of funky --CONTINUE TO IGNORE
                    'samples/highcharts/demo/gauge-clock/demo.js',        // Did not lint the jquery copypaste --CONTINUE TO IGNORE
                    'samples/highcharts/demo/combo-meteogram/demo.js'     // Do not want to ruin anything. Lint does not like "while(i--)" --CONTINUE TO IGNORE
                ],

                directives: { // example directives
                    sloppy: true,
                    todo: true,
                    predef: [
                        '$',
                        'window',
                        'Highcharts',
                        'document',
                        'usdeur',
                        'alert',
                        'setTimeout',
                        'ADBE',
                        'MSFT',
                        'temperatures',
                        'ohlcdata',
                        'setInterval',
                        'GOOGL',
                        'location',
                        'clearTimeout',
                        'confirm',
                        'hs',
                        'moment'
                    ]
                },
                options: {
                    edition: 'latest', // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path
                    errorsOnly: true, // only display errors
                    failOnError: false // defaults to true
                }
            }
        }
    });

    grunt.registerTask('lint-samples', 'jslint');

    // load other tasks in current directory
    grunt.loadTasks('./grunt-tasks');
};
