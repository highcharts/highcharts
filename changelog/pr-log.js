/* eslint-env node, es6 */
/* eslint camelcase: 0, func-style: 0, valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

const fs = require('fs').promises; // eslint-disable-line
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
    auth: process.env.GITHUB_LIST_PRS_TOKEN
});
const os = require('os');
const path = require('path');

require('colors');

const error = e => {
    console.error(e);
};

const log = {
    Highcharts: {},
    'Highcharts Stock': {},
    'Highcharts Maps': {},
    'Highcharts Gantt': {},
    'Highcharts Dashboards': {}
};

// Whenever the string 'Upgrade note' appears, the next paragraph is interpreted
// as the note
const parseUpgradeNotes = p => {
    const upgradeNotes = [],
        paragraphs = p.body.split('\n');

    let look = false,
        listItemsOnly = false;
    for (const para of paragraphs) {
        if (look) {
            if (para.charAt(0) === '*') {
                upgradeNotes.push(para.replace(/^\* /, '').trim());
                listItemsOnly = true;
            } else if (!listItemsOnly) {
                upgradeNotes.push(para.trim());
                look = false;
            }
        }
        if (/upgrade note/i.test(para)) {
            look = true;
        }
    }
    return upgradeNotes;
};

const loadPulls = async (
    since,
    branches = 'master'
) => {
    let page = 1;
    let pulls = [];

    const tags = await octokit.repos.listTags({
        owner: 'highcharts',
        repo: 'highcharts'
    }).catch(error);

    const commit = await octokit.repos.getCommit({
        owner: 'highcharts',
        repo: 'highcharts',
        ref: since || tags.data[0].commit.sha
    }).catch(error);

    console.log(
        'Generating log after latest tag'.green,
        commit.headers['last-modified']
    );
    const after = Date.parse(commit.headers['last-modified']);

    const branchesArr = branches.split(',');
    while (page < 20) {
        const pageData = [];
        for (const base of branchesArr) {

            let { data } = await octokit.pulls.list({
                owner: 'highcharts',
                repo: 'highcharts',
                state: 'closed',
                base,
                page,
                sort: 'updated',
                direction: 'desc'
            }).catch(error);

            // On the master, keep only PRs that have been closed since last
            // release
            if (base === 'master') {
                data = data.filter(d => Date.parse(d.merged_at) > after);

            // On feature branches, keep all incoming PRs
            } else {
                data = data.filter(d => d.state === 'closed');
            }

            pageData.push.apply(pageData, data);
        }

        console.log(`Loaded pulls page ${page} (${pageData.length} items)`.green);

        if (pageData.length === 0) {
            break;
        }

        pulls = pulls.concat(pageData);
        page++;
    }
    return pulls;
};

module.exports = async (since, fromCache, branches) => {

    const included = [],
        tmpFileName = path.join(os.tmpdir(), 'pulls.json');

    let pulls;
    if (fromCache) {
        pulls = await fs.readFile(tmpFileName);
        pulls = JSON.parse(pulls);
    } else {
        pulls = await loadPulls(since, branches);
        await fs.writeFile(tmpFileName, JSON.stringify(pulls));
    }

    // Simplify
    pulls = pulls
        .filter(p => Boolean(p.body))
        .map(p => ({
            description: p.body.split('\n')[0].trim(),
            upgradeNotes: parseUpgradeNotes(p),
            labels: p.labels,
            number: p.number
        }));

    pulls.forEach(p => {
        p.product = 'Highcharts';

        Object.keys(log).forEach(product => {
            if (p.labels.find(l => l.name === `Product: ${product}`)) {
                p.product = product;
            }
        });

        if (p.labels.find(l => l.name === 'Changelog: Feature')) {
            p.isFeature = true;

        } else if (p.labels.find(l => l.name === 'Changelog: Bugfix')) {
            p.isFix = true;
        }
    });

    Object.keys(log).forEach(product => {
        log[product].features = pulls.filter(
            p => p.isFeature && p.product === product
        );
    });

    Object.keys(log).forEach(product => {
        log[product].bugfixes = pulls.filter(
            p => p.isFix && p.product === product
        );
    });

    // From objects to text
    ['bugfixes', 'features'].forEach(type => {
        Object.keys(log).forEach(product => {
            log[product][type].forEach(
                p => included.push(p.number)
            );
        });
    });
    log.excluded = pulls.filter(p => included.indexOf(p.number) === -1);

    return log;

};
