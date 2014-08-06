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
          'samples/maps/demo/us-counties/demo.js',            // all but the data variable is linted. --CONTINUE TO IGNORE
          'samples/maps/demo/us-data-labels/demo.js',         // dangling underscore!
          'samples/maps/demo/rich-info/demo.js',            // Ignore it, too much needs to be changed. --CONTINUE TO IGNORE
          'samples/highcharts/members/series-update/demo.js', // object and references goes to horribly wrongler while eaching and clicking.. "Unused 'i'"
          'samples/highcharts/demo/heatmap-canvas/demo.js',   // decent amount of funky --CONTINUE TO IGNORE
          'samples/highcharts/demo/gauge-clock/demo.js', // did not lint the jquery copypaste --CONTINUE TO IGNORE
          'samples/highcharts/demo/combo-meteogram/demo.js'  // Do not want to ruin anything. lint does not liek "while(i--)" --CONTINUE TO IGNORE
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
            'hs'
          ]
        },
        options: {
          edition: 'latest', // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path
          errorsOnly: true, // only display errors
          failOnError: false // defaults to true
        }
      },
    }
  });

  grunt.registerTask('lint-samples', 'jslint');
};