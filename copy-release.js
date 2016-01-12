/* eslint-env node */
/* eslint valid-jsdoc: 0, no-console: 0 */
/**
 * This node script copies contents over from dist packages to shim repos and
 * optionally commits and pushes releases.
 */

(function () {
    'use strict';
    var fs = require('fs-extra');

        // Set this to true after changes have been reviewed
    var push = process.argv[2] === '-push';

    /**
     * Commit, tag and push
     */
    function runGit(product, version) {
        /*
        var options = { cwd: __dirname.replace('/highcharts', '/' + product + '-release') },
            puts = function (err, stdout) {
                if (err) {
                    throw err;
                }
                sys.puts(stdout);
            };
        */
        var commands = [
            'cd ~/github/' + product + '-release',
            'git add --all',
            'git commit -m "v' + version + '"',
            'git tag -a "v' + version + '" -m "Tagged ' + product + ' version ' + version + '"',
            'git push',
            'git push --tags'
        ];

        // cmd.exec(commands.join(' && '), options, puts);
        console.log('\n--- ' + product + ': Verify changes and run: ---');
        console.log(commands.join(' &&\n'));
    }

    /**
     * Add the current version to the Bower file
     */
    function updateJSONFiles(product, version, name) {

        var i = 0;

        /**
         * Continue after writing files
         */
        function proceed(err) {
            i = i + 1;
            if (err) {
                throw err;
            }
            if (push && i === 2) {
                runGit(product, version);
            }
        }

        console.log('Updating bower.json and package.json for ' + name + '...');

        ['bower', 'package'].forEach(function (file ) {
            fs.readFile('../' + product + '-release/' + file + '.json', function (err, json) {
                if (err) {
                    throw err;
                }
                json = JSON.parse(json);
                json.version = 'v' + version;
                json = JSON.stringify(json, null, '  ');
                fs.writeFile('../' + product + '-release/' + file + '.json', json, proceed);
            });
        });
    }

    /**
     * Copy the JavaScript files over
     */
    function copyFiles(product, name) {
        var extras = [];

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
                        function (copyerr) {
                            if (copyerr) {
                                throw copyerr;
                            }
                        }
                    );
                }
            });
        });

        // Copy Highstock and Highmaps into the Highcharts release repo for use
        // with npm and bower.
        if (product === 'highstock') {
            extras = ['highstock.src.js', 'highstock.js'];
        } else if (product === 'highmaps') {
            extras = ['highmaps.src.js', 'highmaps.js', 'modules/map.src.js', 'modules/map.js'];
        }

        extras.forEach(function (src) {
            fs.copy(
                'build/dist/' + product + '/js/' + src,
                '../highcharts-release/' + src,
                function (err) {
                    if (err) {
                        throw err;
                    }
                }
            );
        });
    }

    /**
     * Run the procedure for each of Highcharts, Highstock and Highmaps
     */
    function runProduct(name, version) {

        var product = name.toLowerCase();

        copyFiles(product, name);

        updateJSONFiles(product, version, name);
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
