/* eslint-env node, es6 */
/* eslint camelcase: 0, func-style: 0, valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/*
Script to extract file sizes from previous Highcharts releases.

Usage: node changelog/filesize

Uncomment the git tags code in `getReleases` to load releases from GitHub.
Update the filepath constant to inspect the history of other files.

The resulting data set can be visualized at https://jsfiddle.net/highcharts/mh61ox8d/

*/

const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises; // eslint-disable-line
const gzipSize = require('gzip-size');
const https = require('https');
const path = require('path');
const semver = require('semver');
const semverSort = require('semver/functions/sort');

const filepath = 'highcharts.js';


const octokit = new Octokit({
    auth: process.env.GITHUB_LIST_PRS_TOKEN
});

(async function () {
    const getReleases = async () => {
        //*
        let tags = await octokit
            .paginate(
                'GET /repos/:owner/:repo/tags',
                {
                    owner: 'highcharts',
                    repo: 'highcharts'
                }
            );

        tags = tags
            .map(tag => tag.name.replace(/^v/, ''))
            .filter(ver => semver.valid(ver));

        tags = semverSort(tags);
        // */

        /*
        const tags = [
            '2.0.2', '2.0.3', '2.0.4', '2.0.5', '2.1.0', '2.1.1',
            '2.1.2', '2.1.3', '2.1.4', '2.1.5', '2.1.6', '2.1.7',
            '2.1.8', '2.1.9', '2.2.0', '2.2.1', '2.2.2', '2.2.3',
            '2.2.4', '2.2.5', '2.3.0', '2.3.1', '2.3.2', '2.3.3',
            '2.3.5', '3.0.0', '3.0.1', '3.0.2', '3.0.3', '3.0.4',
            '3.0.5', '3.0.6', '3.0.7', '3.0.8', '3.0.9', '3.0.10',
            '4.0.0', '4.0.1', '4.0.3', '4.0.4', '4.1.0', '4.1.1',
            '4.1.2', '4.1.3', '4.1.4', '4.1.5', '4.1.6', '4.1.7',
            '4.1.8', '4.1.9', '4.1.10', '4.2.0', '4.2.1', '4.2.2',
            '4.2.3', '4.2.4', '4.2.5', '4.2.6', '4.2.7', '5.0.0',
            '5.0.1', '5.0.2', '5.0.3', '5.0.4', '5.0.5', '5.0.6',
            '5.0.7', '5.0.8', '5.0.9', '5.0.10', '5.0.11', '5.0.12',
            '5.0.13', '5.0.14', '6.0.0', '6.0.1', '6.0.2', '6.0.3',
            '6.0.4', '6.0.5', '6.0.6', '6.0.7', '6.1.0', '6.1.1',
            '6.1.2', '6.1.3', '6.1.4', '6.2.0', '7.0.0', '7.0.1',
            '7.0.2', '7.0.3', '7.1.0', '7.1.1', '7.1.2', '7.1.3',
            '7.2.0', '7.2.1', '8.0.0', '8.0.1', '8.0.2', '8.0.3',
            '8.0.4'
        ];
        // */

        return tags;

    };

    const getVersionFilesize = async version => new Promise((resolve, reject) => {
        https.get(`https://code.highcharts.com/${version}/${filepath}`, res => {
            const data = [];

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                const bytes = data.reduce((prev, current) => prev + current.length, 0);
                const kB = parseFloat((bytes / 1024).toFixed(1));

                const gzipped = gzipSize.sync(data.join(), { level: 9, memLevel: 9 });
                const gzippedKB = parseFloat((gzipped / 1024).toFixed(1));

                resolve([version, kB, gzippedKB]);
            });

            res.on('error', e => reject(e));
        });
    });

    const releases = await getReleases();

    const data = [];

    for (const v of releases) {
        const point = await getVersionFilesize(v);
        console.log(point);
        data.push(point);
    }

    const filename = path.join(__dirname, 'filesizes.json');
    await fs.writeFile(
        filename,
        JSON.stringify(data, null, '  '),
        'utf8'
    );
    console.log(`Wrote filesize data to ${filename}`);


}());
