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
 */

const marked = require('marked');
const prLog = require('./pr-log');
const params = require('yargs').argv;
const childProcess = require('child_process');

(function () {
    'use strict';

    var fs = require('fs'),
        cmd = require('child_process'),
        path = require('path'),
        tree = require('../tree.json');

    /*
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
        var log = await prLog(params.since).catch(e => console.error(e));

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

    function addAPILinks(str, apiFolder) {
        let match;
        const reg = /`([a-zA-Z0-9\.\[\]]+)`/g;

        while ((match = reg.exec(str)) !== null) {

            const shortKey = match[1];
            const replacements = [];

            optionKeys.forEach(longKey => {
                if (longKey.indexOf(shortKey) !== -1) {
                    replacements.push(longKey);
                }
            });

            // If more than one match, see if we can rule out children of
            // objects
            /*
            if (replacements.length > 1) {
                replacements = replacements.filter(
                    longKey => longKey.lastIndexOf(shortKey) === longKey.length - shortKey.length
                );
            }
            */

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
                'Highcharts Gantt': 'gantt'
            }[name];

        log = washPRLog(name, log);

        const upgradeNotes = log
            .filter(change => typeof change.upgradeNote === 'string')
            .map(change => addAPILinks(`- ${change.upgradeNote}`, apiFolder))
            .join('\n');

        // Start the output string
        outputString = '# Changelog for ' + name + ' v' + version + ' (' + date + ')\n\n';

        if (name !== 'Highcharts') {
            outputString += `- Most changes listed under Highcharts ${products.Highcharts.nr} above also apply to ${name} ${version}.\n`;
        }
        log.forEach((change, i) => {

            const desc = addAPILinks(change.description || change, apiFolder);


            // Start fixes
            if (i === log.startFixes) {

                if (upgradeNotes) {
                    outputString += `\n## Upgrade notes\n${upgradeNotes}\n`;
                }

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

    function getLatestGitSha() {
        return childProcess.execSync('git log --pretty=format:\'%h\' -n 1').toString();
    }

    // Get the Git log
    getLog(function (log) {

        const pack = require(path.join(__dirname, '/../package.json'));
        const d = new Date();
        const review = [];

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
            }
        );
    });
}());
