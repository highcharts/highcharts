/**
Experimental PhantomJS runner for the sample suite.

Usage: 
phantomjs [arguments] phantomtest.js

Arguments:
--commit What commit number to run visual tests against.
--start  What sample number to start from. Use this to resume after error.

Status
- Requires PhantomJS 2
*/

/*global console, phantom, require*/
(function () {

    'use strict';

    var page = require('webpage').create(),
        fs = require('fs'),
        samples = [],
        system = require('system'),
        args = system.args,
        params = {
            start: 0
        },
        i,
        retries = 0;

    args.forEach(function(arg, j) {
        if (arg === '--start') {
            params.start = parseInt(args[j + 1], 10);
        } else if (arg === '--commit') {
            params.commit = args[j + 1];
        }
    });

    i = params.start;

    ['highcharts', 'maps', 'stock', 'issues'].forEach(function (section) {
        section = section + '/';
        fs.list('../../samples/' + section).forEach(function (group) {
            if (/^[a-z0-9][a-z0-9\.\-]+$/.test(group) &&  fs.isDirectory('../../samples/' + section + group)) {
                group = group + '/';
                fs.list('../../samples/' + section + group).forEach(function (sample) {
                    var details;
                    if (/^[a-z0-9\-\,]+$/.test(sample) && fs.isDirectory('../../samples/' + section + group + sample + '/')) {
                        details = '../../samples/' + section + group + sample + '/demo.details';
                        details = fs.isFile(details) && fs.read(details);

                        if (!details || details.indexOf('requiresManualTesting: true') === -1) {
                            samples.push(section + group + sample);
                        }
                    }
                });
            }
        });
    });

    page.onError = function(msg, trace) {

        var msgStack = [msg];

        if (retries < 2) {
            console.log('Error detected, trying again...');
            page.reload();
            retries++;

        } else {

            if (trace && trace.length) {
                msgStack.push('TRACE:');
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t['function'] ? ' (in function "' + t['function'] + '")' : ''));
                });
            }

            console.error(
                '\nError detected in ' + samples[i] + '. To start again from this sample, run with argument --start ' +
                    i + '\n\n.' + msgStack.join('\n')
            );
            phantom.exit();
        }
    };


    function runRecursive() {
        var qs = ['path=' + samples[i]];

        retries = 0;

        if (params.commit) {
            qs.push('commit=' + params.commit);
        }

        page.open('http://utils.highcharts.local/samples/compare-view.php?' + qs.join('&'));
    }

    page.onConsoleMessage = function (m) {
        if (m.indexOf('@proceed') === 0) {

            // Output the results of the finished test
            console.log(i, m.replace('@proceed ', ''));

            i = i + 1;
            if (samples[i]) {
                runRecursive();
            } else {
                phantom.exit();
            }
        }
    };

    runRecursive();
}());

