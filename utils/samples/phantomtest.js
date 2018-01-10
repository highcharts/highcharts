/**
Experimental PhantomJS runner for the sample suite.

Usage:
phantomjs [arguments] phantomtest.js

Arguments:
--commit What commit number to run visual tests against.
--debug  When this is set, errors and logs from the samples is printed in the
         terminal. It is only useful when PhantomJS gives errors where the
         browsers don't.
--rightcommit What commit to test (on the right side).
--single What sample number to run as a single test.
--start  What sample number to start from. Use this to resume after error.
--unit   Run only tests from the "unit-tests" folder.

Status
- Requires PhantomJS 2
*/
/* eslint-env node */
/* eslint no-console:0, valid-jsdoc:0 */
/* global phantom */
(function () {

    'use strict';

    var colors = require('colors'),
        page = require('webpage'),
        fs = require('fs'),
        system = require('system');

    var samples = [],
        args = system.args,
        params = {
            start: 0
        },
        i,
        retries = 0;

    page = page.create();

    // Parse arguments into the params object
    args.forEach(function (arg, j) {
        if (arg === '--debug') {
            params.debug = true;
        } else if (arg === '--single') {
            params.single = parseInt(args[j + 1], 10);
        } else if (arg === '--start') {
            params.start = parseInt(args[j + 1], 10);
        } else if (arg === '--commit') {
            params.commit = args[j + 1];
        } else if (arg === '--rightcommit') {
            params.rightcommit = args[j + 1];
        } else if (arg === '--unit') {
            params.unit = true;
        }
    });

    i = params.start;
    if (typeof params.single !== 'undefined') {
        i = params.single;
    }

    // Add all the samples to the samples array
    (
        params.unit ?
            ['unit-tests'] :
            ['unit-tests', 'highcharts', 'maps', 'stock', 'issues', 'cloud']
    ).forEach(function (section) {
        section = section + '/';
        fs.list('../../samples/' + section).forEach(function (group) {
            if (/^[a-z0-9][a-z0-9\.\-]+$/.test(group) && fs.isDirectory('../../samples/' + section + group)) {
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


    /**
     * Pad a string to a given length
     * @param {String} s
     * @param {Number} length
     */
    function pad(s, length, left) {
        var padding;

        s = s.toString();

        if (s.length > length) {
            s = s.substring(0, length);
        }

        padding = new Array((length || 2) + 1 - s.length).join(' ');

        return left ? padding + s : s + padding;
    }

    /**
     * Run the test on each sample
     */
    function runRecursive() {
        var qs = ['path=' + samples[i]];

        retries = 0;

        if (params.commit) {
            qs.push('commit=' + params.commit);
        }
        if (params.rightcommit) {
            qs.push('rightcommit=' + params.rightcommit);
        }

        page.open('http://utils.highcharts.local/samples/compare-view.php?' + qs.join('&'));
    }

    /**
     * On page error, it may be that files are temporarily not loaded (typically jQuery),
     * so we try again three times.
     */
    page.onError = function (msg) {

        // var msgStack = [msg];

        /*
        if (retries === 0) {
            console.log(i + ' ' + samples[i]);
        }
        */

        if (retries < 2) {
            /*
            console.log('  Error detected, trying again...');
            */
            page.reload();
            retries++;

        } else {
            /*
            if (trace && trace.length) {
                msgStack.push('Trace:');
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t['function'] ? ' (in function "' + t['function'] + '")' : ''));
                });
            }

            console.error(
                '\n  To start again from this sample, run with argument --start ' +
                    i + '.\n\n  ' + msgStack.join('\n   ')
            );
            */
            console.log(
                colors.gray(pad(i, 4, true)) + ' ' +
                colors.red(pad(samples[i], 60, false)) + ' ' +
                'Error'
            );

            if (params.debug) {
                // Error message
                console.log('     ' + colors.red(msg));

                // Clickable link
                console.log(
                    '     Cmd-click: ' +
                    colors.blue('utils.highcharts.local/samples/#test/' + samples[i])
                );
            }

            i++;
            runRecursive();
        }
    };

    page.onConsoleMessage = function (m) {
        var color = m[m.length - 1] === '.' ? 'green' : 'red';
        if (m.indexOf('@proceed') === 0) {

            // Output the results of the finished test
            console.log(
                colors.gray(pad(i, 4, true)) +
                colors[color](' ' + m.replace('@proceed ', ''))
            );

            i = i + 1;
            if (samples[i] && typeof params.single === 'undefined') {
                runRecursive();
            } else {
                phantom.exit();
            }
        } else if (params.debug) {
            console.log(colors.gray('     ' + m));
        }
    };

    runRecursive();
}());

