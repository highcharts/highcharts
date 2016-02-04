/*jslint nomen: true*/
/*global require, console, __dirname*/

/**
 * This node script copies commit messages since the last release and
 * generates a draft for a changelog.
 *
 * Parameters
 * --after String The start date.
 * --before String Optional. The end date for the changelog, defaults to today.
 */

(function () {
    'use strict';

    var fs = require('fs'),
        cmd = require('child_process'),
        params;

    /**
     * Get parameters listed by -- notation
     */
    function getParams() {
        var params = {};
        process.argv.forEach(function(arg, j) {
            if (arg.substr(0, 2) === '--') {
                params[arg.substr(2)] = process.argv[j + 1];
            }
        });
        return params;
    }

    /**
     * Get the log from Git
     */
    function getLog(callback) {
        var command,
            puts = function (err, stdout) {
                if (err) {
                    throw err;
                }
                callback(stdout);
            };

        command = 'git log --after={' + params.after + '} --format="%s<br>" ';
        if (params.before) {
            command += '--before={' + params.before + '} ';
        }

        cmd.exec(command, null, puts);
    }

    /**
     * Prepare the log for each product, and sort the result to get all additions, fixes
     * etc. nicely lined up.
     */
    function washLog(name, log) {
        var washed = [],
            proceed = true;

        log.forEach(function (item) {

            // Keep only the commits after the last release
            if (proceed && (new RegExp('official release ---$')).test(item)) {
                proceed = false;
            }

            if (proceed) {

                // Commits tagged with Highstock or Highmaps
                if (name === 'Highstock' && item.indexOf('Highstock:') === 0) {
                    washed.push(item.replace(/Highstock:\s?/, ''));
                } else if (name === 'Highmaps' && item.indexOf('Highmaps:') === 0) {
                    washed.push(item.replace(/Highmaps:\s?/, ''));

                // All others go into the Highcharts changelog for review
                } else if (name === 'Highcharts' && !/^High(stock|maps):/.test(item)) {
                    washed.push(item);
                }
            }
        });

        // Last release not found, abort
        if (proceed === true) {
            throw 'Last release not located, try setting an older start date.';
        }

        // Sort alphabetically
        washed.sort();

        return washed;
    }

    /**
     * Build the output
     */
    function buildHTML(name, version, date, log, products) {
        var s,
            seeAlso = '',
            filename = 'changelog-' + name.toLowerCase() + '.htm';

        log = washLog(name, log);
        log = '    <li>' + log.join('</li>\n    <li>') + '</li>\n';
        // Hyperlinked issue numbers
        log = log.replace(
            /#([0-9]+)/g,
            '<a href="https://github.com/highslide-software/highcharts.com/issues/$1">#$1</a>'
        );

        if (name === 'Highstock' || name === 'Highmaps') {
            seeAlso = '    <li>Most changes listed under Highcharts ' + products.Highcharts.nr +
                ' above also apply to ' + name + ' ' + version + '.</li>\n';
        }

        s = '<p>' + name + ' ' + version + ' (' + date + ')</p>\n' +
            '<ul>\n' +
            seeAlso +
            log +
            '</ul>\n';

        fs.writeFile(filename, s, function () {
            console.log('Wrote draft to ' + filename);
        });
    }

    params = getParams();


    // Get the Git log 
    getLog(function (log) {

        // Split the log into an array
        log = log.split('<br>\n');
        log.pop();

        // Load the current products and versions, and create one log each
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
                    buildHTML(name, products[name].nr, products[name].date, log, products);
                }
            }
        });
    });
}());