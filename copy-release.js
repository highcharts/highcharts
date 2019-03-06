#!/usr/bin/env node

/* eslint-env node, es6 */
/* eslint-disable */
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
    const {
        removeFile
    } = require('highcharts-assembler/src/utilities.js');
    const {
        join
    } = require('path');

    // Set this to true after changes have been reviewed
    const push = process.argv[2] === '--push';
    const releaseRepo = 'highcharts-dist';
    const pathTo = '../' + releaseRepo + '/';

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


    const removeFilesInFolder = (folder, exceptions) => {
        const files = getFilesInFolder(folder, true, '');
        const promises = files
            // Filter out files that should be kept
            .filter(file => !exceptions.some((pattern) => file.match(pattern)))
            .map(file => removeFile(join(folder, file)));
        return Promise.all(promises)
            .then(() => console.log('Successfully removed content of ' + folder));
    };

    /**
     * Copy the JavaScript files over
     */
    function copyFiles() {
        const mapFromTo = {};
        const folders = [{
            from: 'code',
            to: pathTo
        }, {
            from: 'css',
            to: join(pathTo, 'css')
        }];

        const files = {
            'vendor/canvg.js': join(pathTo, 'lib/canvg.js'),
            'vendor/canvg.src.js': join(pathTo, 'lib/canvg.src.js'),
            'vendor/jspdf.js': join(pathTo, 'lib/jspdf.js'),
            'vendor/jspdf.src.js': join(pathTo, 'lib/jspdf.src.js'),
            'vendor/rgbcolor.js': join(pathTo, 'lib/rgbcolor.js'),
            'vendor/rgbcolor.src.js': join(pathTo, 'lib/rgbcolor.src.js'),
            'vendor/svg2pdf.js': join(pathTo, 'lib/svg2pdf.js'),
            'vendor/svg2pdf.src.js': join(pathTo, 'lib/svg2pdf.src.js')
        };

        // Copy all the files in the code folder
        folders.forEach((folder) => {
            const {
                from,
                to
            } = folder;
            getFilesInFolder(from, true)
                .forEach((filename) => {
                    mapFromTo[join(from, filename)] = join(to, filename);
                });
        });

        // Add additional files to list.
        Object.assign(mapFromTo, files);

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
        const keepFiles = ['.git', 'bower.json', 'package.json', 'README.md'];
        return removeFilesInFolder(pathTo, keepFiles)
        .then(() => {
            copyFiles();
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
    });
}());
