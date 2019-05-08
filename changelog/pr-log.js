/* eslint-env node, es6 */
/* eslint camelcase: 0, func-style: 0, valid-jsdoc: 0, no-console: 0, require-jsdoc: 0 */

/*

 @todo
 - Pull version from package.json
 - Insert current date
 */
const octokit = require('@octokit/rest')({
    auth: process.env.GITHUB_LIST_PRS_TOKEN
});

require('colors');

const error = e => {
    console.error(e);
};

const products = {
    Highcharts: {},
    Highstock: {},
    Highmaps: {},
    'Highcharts Gantt': {}
};

module.exports = async () => {

    let page = 1;
    let pulls = [];

    const tags = await octokit.repos.listTags({
        owner: 'highcharts',
        repo: 'highcharts'
    }).catch(error);

    const commit = await octokit.repos.getCommit({
        owner: 'highcharts',
        repo: 'highcharts',
        commit_sha: tags.data[0].commit.sha
    }).catch(error);

    console.log(
        'Generating log after latest tag'.green,
        commit.headers['last-modified']
    );
    const after = Date.parse(commit.headers['last-modified']);

    while (page < 5) {
        const allPulls = await octokit.pulls.list({
            owner: 'highcharts',
            repo: 'highcharts',
            state: 'closed',
            base: 'master',
            page
        }).catch(error);

        const pageData = allPulls.data.filter(d => Date.parse(d.merged_at) > after);

        console.log(`Loaded pulls page ${page} (${pageData.length} items)`.green);

        if (pageData.length === 0) {
            break;
        }

        pulls = pulls.concat(pageData);
        page++;
    }

    pulls.forEach(p => {
        const labels = p.labels.map(l => l.name).join();

        p.product = 'Highcharts';

        Object.keys(products).forEach(product => {
            if (labels.indexOf(`Product: ${product}`) !== -1) {
                p.product = product;
            }
        });

        if (labels.indexOf('Type: Enhancement') !== -1) {
            p.isFeature = true;

        } else if (p.body.indexOf('Fixed') === 0) {
            p.isFix = true;
        }
    });

    Object.keys(products).forEach(product => {
        products[product].features = pulls.filter(
            p => p.isFeature && p.product === product
        );
    });

    Object.keys(products).forEach(product => {
        products[product].bugfixes = pulls.filter(
            p => p.isFix && p.product === product
        );
    });

    // From objects to text
    ['bugfixes', 'features'].forEach(type => {
        Object.keys(products).forEach(product => {
            products[product][type] = products[product][type].map(
                // Return body, split on horizontal rule
                p => p.body.split(/(___|---|\*\*\*|\n)/)[0].trim()
            );
        });
    });

    return products;

};
