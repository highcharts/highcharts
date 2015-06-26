/**
Experimental PhantomJS runner for the sample suite.

Usage: 
phantomjs [arguments] phantomtest.js

Arguments:
--start  What sample number to start from. Use this to resume after error.

Status
- Requires PhantomJS 2
- Currently only runs through highcharts/demo
*/

/*global console, phantom, require*/
(function () {

    'use strict';

    var page = require('webpage').create(),
        fs = require('fs'),
        samples = [],
        system = require('system'),
        args = system.args,
        i = 0;

    args.forEach(function(arg, j) {
        if (arg === '--start') {
            i = parseInt(args[j + 1], 10);
        }
    });

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

        if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function(t) {
                msgStack.push(' -> ' + t.file + ': ' + t.line + (t['function'] ? ' (in function "' + t['function'] + '")' : ''));
            });
        }

        console.error(msgStack.join('\n'));
        phantom.exit();
    };


    function runRecursive() {
        var sample = samples[i];

        page.open('http://utils.highcharts.local/samples/compare-view.php?path=' + sample, function (status) {
            console.log(i, status, sample);
        });
    }

    page.onConsoleMessage = function (m) {
        if (m === '@proceed') {
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

