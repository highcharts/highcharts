/*global module*/
(function () {
    "use strict";

    module.exports = function (grunt) {

        var product = 'highmaps',
            version = '1.1.2';


        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-replace');

        grunt.initConfig({
            copy: {

                // Copy releases over the shim repos for Bower
                release: {
                    cwd: 'build/dist/' + product + '/js/',
                    src: '**/*',
                    dest: '../' + product + '-release/',
                    expand: true
                }
            },
            replace: {
                release: {
                    options: {
                        patterns: [{
                            match: /"version": "v[0-9\.]+"/g,
                            replacement: '"version": "v' + version + '"'
                        }]
                    },
                    files: [{
                        src: ['../' + product + '-release/bower.json'],
                        dest: '../' + product + '-release/'
                    }]
                }
            }
        });

        grunt.registerTask('copy-release', ['copy:release', 'replace:release']);

    };
}());