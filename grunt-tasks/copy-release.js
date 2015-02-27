/*global console, module*/
(function () {
    "use strict";

    // TODO: 
    // - Add procedure or task to commit, tag and push

    module.exports = function (grunt) {

        grunt.registerTask('copy-release', 'Copy to shim repos', function () {

            var product,
                version,
                ucProduct,
                products,
                bower;

            grunt.loadNpmTasks('grunt-contrib-copy');
            grunt.loadNpmTasks('grunt-replace');

            // Load the current products and versions
            products = grunt.file.read('build/dist/products.js');
            if (products) {
                products = products.replace('var products = ', '');
                products = JSON.parse(products);
            }

            for (ucProduct in products) {

                console.log('Copying ' + ucProduct + ' files...');

                product = ucProduct.toLowerCase();
                version = products[ucProduct].nr;

                // Copy the files over to shim repo
                grunt.file.expand('build/dist/' + product + '/js/**/*.js').forEach(function (src) {
                    grunt.file.copy(
                        src,
                        src.replace('build/dist/' + product + '/js', '../' + product + '-release')
                    );
                });

                // Add version to bower.json
                bower = grunt.file.read('../' + product + '-release/bower.json');
                bower = bower.replace(/"version": "v[0-9\.]+"/g, '"version": "v' + version + '"');
                grunt.file.write('../' + product + '-release/bower.json', bower);

                // Propose Git commands to be copied to Terminal
                console.log('--- Git commands (copy to Terminal and verify): ---');
                console.log('cd ~/GitHub/' + product + '-release');
                console.log('git commit -a -m "v' + version + '"');
                console.log('git tag -a "v' + version + '" -m "Tagged ' + ucProduct + ' version ' + version + '"');
                console.log('git push --tags');
                console.log(); // empty line
            }
        });

    };
}());