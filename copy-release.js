/*jslint nomen: true*/
/*global require, console, __dirname, process*/

/**
 * This node script copies contents over from dist packages to shim repos and
 * optionally commits and pushes releases.
 */

(function () {
    'use strict';
    var
        // Set this to true after changes have been reviewed
        push = process.argv[2] === '-push',

        fs = require('fs-extra'),
        sys = require('sys'),
        cmd = require('child_process');

    /**
     * Commit, tag and push 
     */
    function runGit(product, version) {
        var options = { cwd: __dirname.replace('/highcharts.com', '/' + product + '-release') },
            puts = function (err, stdout) {
                if (err) {
                    throw err;
                }
                sys.puts(stdout);
            };

        /* TODO: Add ampersands to run synchronously
        cmd.exec('git status', options, puts);
        cmd.exec('git add --all', options, puts);
        cmd.exec('git commit -m "v' + version + '"', options, puts);
        cmd.exec('git tag -a "v' + version + '" -m "Tagged ' + product + ' version ' + version + '"', options, puts);
        cmd.exec('git push --tags', options, puts);
        */
    }

    /**
     * Add the current version to the Bower file
     */
    function updateBowerFile(product, version, name) {

        console.log('Updating bower.json for ' + name + '...');

        fs.readFile('../' + product + '-release/bower.json', function (err, bower) {
            if (err) {
                throw err;
            }
            bower = JSON.parse(bower);
            bower.version = 'v' + version;
            bower = JSON.stringify(bower, null, '  ');
            fs.writeFile('../' + product + '-release/bower.json', bower, function (err) {
                if (err) {
                    throw err;
                }
                if (push) {
                    runGit(product, version);
                }
            });
        });
    }

    /**
     * Copy the JavaScript files over
     */
    function copyFiles(product, name) {

        console.log('Copying ' + name + ' files...');

        // Copy the files over to shim repo
        fs.readdir('build/dist/' + product + '/js/', function (err, files) {
            if (err) {
                throw err;
            }

            files.forEach(function (src) {
                if (src.indexOf('.') !== 0) {
                    fs.copy(
                        'build/dist/' + product + '/js/' + src,
                        '../' + product + '-release/' + src,
                        function (err) {
                            if (err) {
                                throw err;
                            }
                        }
                    );
                }
            });
        });
    }

    /**
     * Run the procedure for each of Highcharts, Highstock and Highmaps
     */
    function runProduct(name, version) {

        var product = name.toLowerCase();

        copyFiles(product, name);

        updateBowerFile(product, version, name);
    }

    // Load the current products and versions
    fs.readFile('build/dist/products.js', 'utf8', function (err, products) {
        var name;

        if (err) {
            throw err;
        }

        if (products) {
            products = products.replace('var products = ', '');
            products = JSON.parse(products);
        }

        for (name in products) {
            if (products.hasOwnProperty(name)) {
                runProduct(name, products[name].nr);
            }
        }

        if (!push) {
            console.log('Please verify the changes in the release repos. Then run again ' +
                'with -push as an argument.');
        }
    });
}());