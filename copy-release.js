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
        cmd = require('child_process'),
        bower;

    /**
     * Commit, tag and push 
     */
    function runGit(product, version) {
        var options = { cwd: __dirname.replace('/highcharts.com', '/' + product + '-release') },
            puts = function (error, stdout, stderr) {
                sys.puts(stdout);
            };

        cmd.exec('git status', options, puts);
        cmd.exec('git commit -a -m "v' + version + '"', options, puts);
        cmd.exec('git tag -a "v' + version + '" -m "Tagged ' + product + ' version ' + version + '"', options, puts);
        cmd.exec('git push --tags', options, puts);
    }

    /**
     * Run the procedure for each of Highcharts, Highstock and Highmaps
     */
    function runProduct(name, version) {

        var product;

        console.log('Copying ' + name + ' files...');

        product = name.toLowerCase();

        // Copy the files over to shim repo
        fs.readdirSync('build/dist/' + product + '/js/').forEach(function (src) {
            fs.copySync(
                'build/dist/' + product + '/js/' + src,
                '../' + product + '-release/' + src
            );
        });

        // Add version to bower.json
        bower = fs.readFileSync('../' + product + '-release/bower.json', 'utf8');
        bower = bower.replace(/"version": "v[0-9\.]+"/g, '"version": "v1' + version + '"');
        fs.writeFileSync('../' + product + '-release/bower.json', bower);

        if (push) {
            runGit(product, version);
        }
    }

    // Load the current products and versions
    fs.readFile('build/dist/products.js', 'utf8', function (err, products) {
        var name;

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