/* eslint-env node */
/* eslint no-console:0, valid-jsdoc:0 */
(function () {

    'use strict';

    var childProcess = require('child_process'),
        colors = require('colors'),
        fs = require('fs');

    var spawn = childProcess.spawn,
        latest = 'v4.2.2',
        nightlyFile = 'nightly/nightly.json',
        commits = [];

    /**
     * Load a JSON file into JavaScript object
     * @returns {Object}
     */
    function loadJSON(filename) {
        var ret;
        try {
            ret = fs.readFileSync(filename);
            ret = JSON.parse(ret);
        } catch (e) {
            ret = {};
        }
        return ret;
    }

    /**
     * Compare and analyze changes from one commit to the next
     */
    function compareLogs(i) {
        var before,
            after,
            nightly,
            commit = commits[i];

        if (i > 0 && commits[i]) {

            // Load or set up the nightly report JSON file
            nightly = loadJSON(nightlyFile);

            if (!nightly.meta) {
                nightly.meta = {};
            }
            if (!nightly.results) {
                nightly.results = {};
            }

            before = loadJSON('temp/compare-' + commit.parents[0] + '.json');
            after = loadJSON('temp/compare-' + commit.hash + '.json');
        }

        var sample,
            key,
            beforeVal,
            afterVal;
        for (sample in after) {
            if (after.hasOwnProperty(sample)) {
                for (key in after[sample]) {
                    if (key.indexOf('Phantom') === 0) {
                        break;
                    }
                }
                if (before[sample]) {
                    beforeVal = before[sample][key];
                    afterVal = after[sample][key];

                    // If something is changed, record the change in nightly.json
                    if (afterVal !== '0' && afterVal !== beforeVal) {
                        console.log(colors.yellow('Detected change in ' + sample + ': ' + beforeVal + ' => ' + afterVal));
                        if (!nightly.results[sample]) {
                            nightly.results[sample] = {
                                changes: []
                            };
                        }
                        nightly.results[sample].changes.push({
                            hash: commit.hash,
                            diff: afterVal
                        });
                    }
                }
            }
        }

        // Write it back
        if (nightly) {
            nightly.meta.latest = commit.hash;
            fs.writeFileSync(nightlyFile, JSON.stringify(nightly, null, '\t'));
        }

    }

    /**
     * Run tests for a single commit comparing to its parent
     */
    function runCommitRecursive(i) {

        var commit = commits[i];

        console.log(colors.cyan('Comparing changes in ' + commit.hash + ' to parent (' + commit.parents[0] + ')'));
        console.log(colors.cyan(commit.subject));

        // Spawn PhantomJS child process
        var phantom = spawn('phantomjs', [
            'phantomtest.js',
            '--commit',
            commit.parents[0],
            '--rightcommit',
            commit.hash
        ]);

        phantom.stdout.on('data', function (data) {
            console.log(String(data).replace(/\n$/, ''));
        });

        phantom.stderr.on('data', function (data) {
            console.log(String(data));
        });

        phantom.on('close', function (code) {
            if (code === 0) {
                console.log('Finished running PhantomJS test suite on ' + commit.hash + '\n\n');
            }

            compareLogs(i);

            i++;
            if (commits[i]) {
                runCommitRecursive(i);
            }
        });
    }

    /**
     * Get the commit history and asynchronously start tests
     * - Load from latest successful run tagged in nightly.json
     */
    function getCommits() {

        // Get the latest successful run from the nightly file
        var nightly = loadJSON(nightlyFile);
        if (nightly.meta && nightly.meta.latest) {
            latest = nightly.meta.latest;
        }

        // Spawn PhantomJS child process
        var proc = spawn('git', [
            'log',
            latest + '..HEAD',
            '--pretty=format:%h<split>%p<split>%an<split>%s<split>%cd<newline>',
            '--',
            './js' // Only changes affecting the JS files
        ], {
            cwd: '../..'
        });

        proc.stdout.on('data', function (data) {

            String(data).split('<newline>').forEach(function (pretty) {
                if (pretty !== '') {
                    pretty = pretty.split('<split>');
                    var commit = {
                        hash: pretty[0].replace(/[^0-9a-z]/g, ''),
                        parents: pretty[1].split(' '),
                        authorName: pretty[2],
                        subject: pretty[3],
                        date: pretty[4]
                    };
                    commits.push(commit);
                }
            });
            // console.log(String(data).replace(/\n$/, ''));
        });

        proc.stderr.on('data', function (data) {
            console.log(String(data));
        });

        proc.on('close', function (code) {
            if (code === 0) {
                if (commits.length === 0) {
                    console.log('No untested commits in log');
                } else {
                    commits = commits.reverse();
                    runCommitRecursive(0);
                }
            }
        });

    }

    getCommits();

}());
