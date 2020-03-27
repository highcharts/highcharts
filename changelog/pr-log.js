/* eslint-env node, es6 */
/* eslint camelcase: 0, func-style: 0, valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

const octokit = require('@octokit/rest')({
    auth: process.env.GITHUB_LIST_PRS_TOKEN
});

require('colors');

const error = e => {
    console.error(e);
};

const log = {
    Highcharts: {},
    Highstock: {},
    Highmaps: {},
    'Highcharts Gantt': {}
};

// Whenever the string 'Upgrade note' appears, the next paragraph is interpreted
// as the not
const parseUpgradeNote = p => {
    const paragraphs = p.body.split('\n');
    for (let i = 0; i < paragraphs.length; i++) {
        if (/upgrade note/i.test(paragraphs[i])) {
            return (paragraphs[i + 1] ? paragraphs[i + 1].trim() : void 0);
        }
    }
    return void 0;
};

module.exports = async since => {

    const included = [];

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

    while (page < 20) {
        const baseBranches = [
            'master'
        ];
        const pageData = [];
        for (const base of baseBranches) {

            let { data } = await octokit.pulls.list({
                owner: 'highcharts',
                repo: 'highcharts',
                state: 'closed',
                base,
                page
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

    // Simplify
    pulls = pulls.map(p => ({
        description: p.body.split('\n')[0].trim(),
        upgradeNote: parseUpgradeNote(p),
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
