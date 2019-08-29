/* eslint-env node, es6 */
/* eslint func-style: 0, valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/**
 * This node script copies commit messages since the last release and
 * generates a draft for a changelog.
 *
 * Parameters
 * --since String  The tag to start from, defaults to latest commit.
 * --after String  The start date.
 * --before String Optional. The end date for the changelog, defaults to today.
 * --pr            Use Pull Request descriptions as source for the log.
 * --review        Create a review page with edit links and a list of all PRs
 *                 that are not used in the changelog.
 */

const marked = require('marked');
const prLog = require('./pr-log');
const params = require('yargs').argv;

(function () {
    'use strict';

    var fs = require('fs'),
        cmd = require('child_process'),
        path = require('path'),
        tree = require('../tree.json');

    /**
     * Get the log from Git
     */
    async function getLog(callback) {
        var command;

        function puts(err, stdout) {
            if (err) {
                throw err;
            }
            callback(stdout);
        }

        if (params.pr) {
            var log = await prLog(params.since).catch(e => console.error(e));

            callback(log);
            return;

        }

        command = 'git log --format="%s<br>" ';
        if (params.since) {
            command += ' ' + params.since + '..HEAD ';
        } else {
            if (params.after) {
                command += '--after={' + params.after + '} ';
            }
            if (params.before) {
                command += '--before={' + params.before + '} ';
            }
        }

        cmd.exec(command, null, puts);
    }

    function addMissingDotToCommitMessage(string) {
        if (string[string.length - 1] !== '.') {
            string = string + '.';
        }
        return string;
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
            if (proceed && (new RegExp('official release ---$')).test(item) &&
                !params.since) {
                proceed = false;
            }

            if (proceed) {

                // Commits tagged with Highstock, Highmaps or Gantt
                if (name === 'Highstock' && item.indexOf('Highstock:') === 0) {
                    washed.push(item.replace(/Highstock:\s?/, ''));
                } else if (name === 'Highmaps' && item.indexOf('Highmaps:') === 0) {
                    washed.push(item.replace(/Highmaps:\s?/, ''));
                } else if (name === 'Highcharts Gantt' && item.indexOf('Gantt:') === 0) {
                    washed.push(item.replace(/Gantt:\s?/, ''));

                    // All others go into the Highcharts changelog for review
                } else if (name === 'Highcharts' && !/^(Highstock|Highmaps|Gantt):/.test(item)) {
                    washed.push(item);
                }
            }
        });

        // Last release not found, abort
        if (proceed === true && !params.since) {
            throw new Error('Last release not located, try setting an older start date.');
        }

        // Sort alphabetically
        washed.sort();

        // Pull out Fixes and append at the end
        var fixes = washed.filter(message => message.indexOf('Fixed') === 0);

        if (fixes.length > 0) {
            washed = washed.filter(message => message.indexOf('Fixed') !== 0);

            washed = washed.concat(fixes);
            washed.startFixes = washed.length - fixes.length;
        }

        return washed;
    }

    function washPRLog(name, log) {
        const washed = log[name].features.concat(log[name].bugfixes);
        washed.startFixes = log[name].features.length;

        return washed;
    }

    /**
     * Build the output
     */
    function buildMarkdown(name, version, date, log, products, optionKeys) {
        var outputString,
            filename = path.join(
                __dirname,
                name.toLowerCase().replace(' ', '-'),
                version + '.md'
            ),
            apiFolder = {
                Highcharts: 'highcharts',
                Highstock: 'highstock',
                Highmaps: 'highmaps',
                'Highcharts Gantt': 'gantt'
            }[name];

        if (params.pr) {
            log = washPRLog(name, log);
        } else {
            log = washLog(name, log);
        }

        // Start the output string
        outputString = '# Changelog for ' + name + ' v' + version + ' (' + date + ')\n\n';

        if (name !== 'Highcharts') {
            outputString += `- Most changes listed under Highcharts ${products.Highcharts.nr} above also apply to ${name} ${version}.\n`;
        }
        log.forEach((change, i) => {

            let desc = change.description || change;
            let match;
            const reg = /`([a-zA-Z0-9\.\[\]]+)`/g;

            while ((match = reg.exec(desc)) !== null) {

                const shortKey = match[1];
                const replacements = [];

                optionKeys.forEach(longKey => {
                    if (longKey.indexOf(shortKey) !== -1) {
                        replacements.push(longKey);
                    }
                });

                // If more than one match, we may be dealing with ambiguous keys
                // like `formatter`, `lineWidth` etch.
                if (replacements.length === 1) {
                    desc = desc.replace(
                        `\`${shortKey}\``,
                        `[${shortKey}](https://api.highcharts.com/${apiFolder}/${replacements[0]})`
                    );
                }
            }

            // Start fixes
            if (i === log.startFixes) {
                outputString += '\n## Bug fixes\n';
            }

            const edit = params.review ?
                ` [<a href="https://github.com/highcharts/highcharts/pull/${change.number}">Edit</a>]` :
                '';

            // All items
            outputString += '- ' + addMissingDotToCommitMessage(desc) +
                edit + '\n';

        });

        fs.writeFile(filename, outputString, function () {
            console.log('Wrote draft to ' + filename);
        });


        return outputString;
    }

    /*
     * Return a list of options so that we can auto-link option references in
     * the changelog.
     */
    function getOptionKeys(treeroot) {
        const keys = [];

        function recurse(subtree, optionPath) {
            Object.keys(subtree).forEach(key => {
                if (optionPath + key !== '') {
                    // Push only the second level, we don't want auto linking of
                    // general words like chart, series, legend, tooltip etc.
                    if (optionPath.indexOf('.') !== -1) {
                        keys.push(optionPath + key);
                    }
                    if (subtree[key].children) {
                        recurse(subtree[key].children, `${optionPath}${key}.`);
                    }
                }
            });
        }

        recurse(treeroot, '');
        return keys;
    }

    function pad(number, length, padder) {
        return new Array(
            (length || 2) +
            1 -
            String(number)
                .replace('-', '')
                .length
        ).join(padder || 0) + number;
    }

    function saveReview(md) {

        const filename = path.join(__dirname, 'review.html');

        fs.writeFileSync(
            filename,
            marked(md),
            'utf8'
        );

        console.log(`Review: ${filename}`);
    }

    // Get the Git log
    getLog(function (log) {

        const optionKeys = getOptionKeys(tree);
        const pack = require(path.join(__dirname, '/../package.json'));
        const d = new Date();
        const review = [];

        // Split the log into an array
        if (!params.pr) {
            log = log.split('<br>\n');
            log.pop();
        }

        // Load the current products and versions, and create one log each
        fs.readFile(
            path.join(__dirname, '/../build/dist/products.js'),
            'utf8',
            function (err, products) {
                var name;

                if (err) {
                    throw err;
                }

                if (products) {
                    products = products.replace('var products = ', '');
                    products = JSON.parse(products);
                }

                for (name in products) {

                    if (products.hasOwnProperty(name)) { // eslint-disable-line no-prototype-builtins
                        if (params.pr) {
                            products[name].nr = pack.version;
                            products[name].date =
                                d.getFullYear() + '-' +
                                pad(d.getMonth() + 1, 2) + '-' +
                                pad(d.getDate(), 2);
                        }

                        review.push(buildMarkdown(
                            name,
                            products[name].nr,
                            products[name].date,
                            log,
                            products,
                            optionKeys
                        ));
                    }
                }

                if (params.review) {
                    saveReview(review.join('\n\n___\n'));
                }
            }
        );
    });
}());
