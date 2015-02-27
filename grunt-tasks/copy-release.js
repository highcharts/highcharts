/*global module*/
(function () {
    "use strict";

    // TODO: 
    // - Use the products object and loop over products and their versions
    // - Add procedure or task to commit, tag and push

    module.exports = function (grunt) {

        var product = 'highmaps',
            version = '1.1.3',
            products;


        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-replace');

        // Load the current products and versions
        products = grunt.file.read('build/dist/products.js');
        if (products) {
            products = products.replace('var products = ', '');
            products = JSON.parse(products);
        }

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