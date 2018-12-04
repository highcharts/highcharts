#!/usr/bin/env node

/* eslint-env node, es6 */
/* eslint valid-jsdoc: 0, no-console: 0 */
/* eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }] */

/**
 * This node script copies contents over from dist packages to shim repos and
 * optionally commits and pushes releases.
 */

(function () {
    'use strict';
    var fs = require('fs-extra');
    // TODO avoid dependency on highcharts-assembler
    const {
        getFilesInFolder
    } = require('highcharts-assembler/src/build.js');

    // Set this to true after changes have been reviewed
    const push = process.argv[2] === '--push';
    const releaseRepo = 'highcharts-dist';

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
            'cd ~/github/' + releaseRepo,
            'git add --all',
            'git commit -m "v' + version + '"',
            'git tag -a "v' + version + '" -m "Tagged ' + product + ' version ' + version + '"',
            'git push',
            'git push --tags',
            'npm publish'
        ];

        // cmd.exec(commands.join(' && '), options, puts);
        console.log('\n--- ' + product + ': Verify changes and run: ---');
        console.log(commands.join(' &&\n'));
    }

    /**
     * Add the current version to the Bower file
     */
    function updateJSONFiles(product, version, name, cb) {

        var i = 0;

        /**
         * Continue after writing files
         */
        function proceed(err) {
            const noop = () => {};
            i = i + 1;
            if (err) {
                throw err;
            }
            return (i === 2) ? cb() : noop();
        }

        console.log('Updating bower.json and package.json for ' + name + '...');

        ['bower', 'package'].forEach(function (file) {
            fs.readFile('../' + releaseRepo + '/' + file + '.json', function (err, json) {
                if (err) {
                    throw err;
                }
                json = JSON.parse(json);
                json.types = (
                    json.main ?
                    json.main.replace(/\.js$/, '.d.ts') :
                    'highcharts.d.ts'
                );
                json.version = version;
                json = JSON.stringify(json, null, '  ');
                fs.writeFile('../' + releaseRepo + '/' + file + '.json', json, proceed);
            });
        });
    }

    /**
     * Copy the JavaScript files over
     */
    function copyFiles() {
        const mapFromTo = {};
        const sourceFolder = 'code/';
        const pathTo = '../' + releaseRepo + '/';

        // Copy all the files in the code folder
        getFilesInFolder(sourceFolder, true)
            .forEach(path => {
                mapFromTo[sourceFolder + path] = pathTo + path;
            });

        // Copy all the files to release repository
        Object.keys(mapFromTo).forEach((from) => {
            const to = mapFromTo[from];
            fs.copy(
                from,
                to,
                function (copyerr) {
                    if (copyerr) {
                        throw copyerr;
                    }
                }
            );
        });
    }

    // Load the current products and versions
    fs.readFile('build/dist/products.js', 'utf8', function (err, products) {
        if (err) {
            throw err;
        }
        if (products) {
            products = products.replace('var products = ', '');
            products = JSON.parse(products);
        }
        const name = 'Highcharts';
        const version = products[name].nr;
        const product = name.toLowerCase();
        copyFiles(product, name);
        updateJSONFiles(product, version, name, () => {
            if (push) {
                runGit(product, version);
            }
        });
        if (!push) {
            console.log('Please verify the changes in the release repos. Then run again ' +
                'with --push as an argument.');
        }
    });
}());
