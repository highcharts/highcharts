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
 * --review        Create a review page with edit links and a list of all PRs
 *                 that are not used in the changelog.
 * --fromCache     Re-format pulls from cache, do not load new from GitHub.
 */
const https = require('https');
const marked = require('marked');
const prLog = require('./pr-log');
const params = require('yargs').argv;
const childProcess = require('child_process');

const getFile = url => new Promise((resolve, reject) => {
    https.get(url, resp => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', chunk => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            resolve(data);
            // console.log(JSON.parse(data).explanation);
        });

    }).on('error', err => {
        reject(err);
    });
});

(function () {
    'use strict';

    var fs = require('fs'),
        path = require('path'),
        // eslint-disable-next-line node/no-missing-require
        tree = require('../tree.json');

    /**
     * Return a list of options so that we can auto-link option references in
     * the changelog.
     */
    function getOptionKeys() {
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

        recurse(tree, '');
        return keys;
    }

    const optionKeys = getOptionKeys();

    /**
     * Get the log from Git
     */
    async function getLog(callback) {
        var log = await prLog(
            params.since,
            params.fromCache
        ).catch(e => console.error(e));

        callback(log);
    }

    function addMissingDotToCommitMessage(string) {
        if (string[string.length - 1] !== '.') {
            string = string + '.';
        }
        return string;
    }

    function washPRLog(name, log) {
        let washed = [];

        washed.startFixes = 0;

        if (log[name]) {
            washed = log[name].features.concat(log[name].bugfixes);
            washed.startFixes = log[name].features.length;
        }

        return washed;
    }

    function addLinks(str, apiFolder) {
        let match;

        // Add links to issues
        const issueReg = /[^\[]#([0-9]+)[^\]]/g;
        while ((match = issueReg.exec(str)) !== null) {
            const num = match[1];

            str = str.replace(
                `#${num}`,
                `[#${num}](https://github.com/highcharts/highcharts/issues/${num})`
            );
        }

        // Add API Links
        const apiReg = /`([a-zA-Z0-9\.\[\]]+)`/g;
        while ((match = apiReg.exec(str)) !== null) {

            const shortKey = match[1];
            let replacements = [];

            optionKeys.forEach(longKey => {
                if (longKey.indexOf(shortKey) !== -1) {
                    replacements.push(longKey);
                }
            });

            // If more than one match, see if we can rule out children of
            // objects
            if (replacements.length > 1) {
                replacements = replacements.filter(
                    longKey => longKey.lastIndexOf(shortKey) === longKey.length - shortKey.length
                );

                // Check if it is a member on the root series options
                if (
                    replacements.length > 1 &&
                    replacements.indexOf(`plotOptions.series.${shortKey}`) !== -1
                ) {
                    replacements = replacements.filter(longKey => {
                        // Remove series-specific members so that we may isolate
                        // it to plotOptions.series.shortKey
                        const m = longKey.match(
                            new RegExp('plotOptions\.([a-zA-Z\.]+)\.' + shortKey)
                        );
                        return !m || m[1] === 'series';
                    });
                }
            }

            // If more than one match, we may be dealing with ambiguous keys
            // like `formatter`, `lineWidth` etch.
            if (replacements.length === 1) {
                str = str.replace(
                    `\`${shortKey}\``,
                    `[${shortKey}](https://api.highcharts.com/${apiFolder}/${replacements[0]})`
                );
            }
        }
        return str;
    }

    /**
     * Build the output
     */
    function buildMarkdown(name, version, date, log, products) {
        var outputString,
            filename = path.join(
                __dirname,
                name.toLowerCase().replace(' ', '-'),
                version + '.md'
            ),
            apiFolder = {
                Highcharts: 'highcharts',
                'Highcharts Stock': 'highstock',
                'Highcharts Maps': 'highmaps',
                'Highcharts Gantt': 'gantt',
                'Highcharts Dashboards': 'dashboards'
            }[name];

        log = washPRLog(name, log);

        const upgradeNotes = log
            .filter(change => typeof change.upgradeNote === 'string')
            .map(change => addLinks(`- ${change.upgradeNote}`, apiFolder))
            .join('\n');

        // Start the output string
        outputString = '# Changelog for ' + name + ' v' + version + ' (' + date + ')\n\n';

        if (name !== 'Highcharts') {
            outputString += `- Most changes listed under Highcharts ${products.Highcharts.nr} above also apply to ${name} ${version}.\n`;
        } else if (log.length === 0) {
            outputString += '- No changes for the basic Highcharts package.';
        }

        log.forEach((change, i) => {

            const desc = addLinks(change.description || change, apiFolder);


            // Start fixes
            if (i === log.startFixes) {

                if (upgradeNotes) {
                    outputString += `\n## Upgrade notes\n${upgradeNotes}\n`;
                }

                outputString += '\n## Bug fixes\n';
            }

            const edit = params.review ?
                ` [Edit](https://github.com/highcharts/highcharts/pull/${change.number}).` :
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

        const html = `<html>
        <head>
            <title>Changelog Review</title>
            <style>
            * {
                font-family: sans-serif
            }
            code {
                font-family: monospace;
                color: green;
            }
            </style>
        </head>
        <body>
        ${marked.parse(md)}
        </body>
        </html>`;


        fs.writeFileSync(filename, html, 'utf8');

        console.log(`Review: ${filename}`);
    }

    function getLatestGitSha() {
        return childProcess.execSync('git log --pretty=format:\'%h\' -n 1').toString();
    }

    // Get the Git log
    getLog(function (log) {

        const pack = require(path.join(__dirname, '/../package.json'));
        const d = new Date();
        const review = [];

        // Load the current products and versions, and create one log each
        getFile('https://code.highcharts.com/products.js')
            .then(products => {
                var name;

                if (products) {
                    products = products.replace('var products = ', '');
                    products = JSON.parse(products);
                }

                for (name in products) {

                    if (products.hasOwnProperty(name)) { // eslint-disable-line no-prototype-builtins
                        const version = params.buildMetadata ? `${pack.version}+build.${getLatestGitSha()}` : pack.version;

                        products[name].nr = version;
                        products[name].date =
                            d.getFullYear() + '-' +
                            pad(d.getMonth() + 1, 2) + '-' +
                            pad(d.getDate(), 2);

                        review.push(buildMarkdown(
                            name,
                            version,
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
            })
            .catch(err => {
                throw err;
            });
    });
}());
