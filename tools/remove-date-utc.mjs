/**
 * This was a once-off job to get rid of Date.UTC in demos. Keeping the file
 * here in case we need to deal with more similar cases.
 *
 * Usage: From root, run
 *
 * node tools/remove-date-utc.js
 */

import colors from 'colors';
import { promises } from 'fs'
import { glob } from 'glob';

const tableStyles = `
.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid var(--highcharts-neutral-color-10, #e6e6e6);
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: var(--highcharts-neutral-color-60, #666);
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
    background: var(--highcharts-neutral-color-3, #f7f7f7);
}
`;


const fs = promises;
const matches = await glob('samples/**/demo.css');
let i = 0;
for (const file of matches) {
    const css = await (await fs.readFile(file)).toString();

    const hasTableStyles = css.includes('.highcharts-data-table');

    let modified = false;
    let modifiedCSS = css;

    if (hasTableStyles) {

        const html = await (await fs.readFile(file.replace('.css', '.html'))).toString();

        const hasExportData = html.indexOf('export-data') > -1;

        i++;

        if (!hasExportData) {
            if (!css.includes(tableStyles)) {
                console.log(colors.red('Different table styles in', file)); // eslint-disable-line
            }

            modifiedCSS = modifiedCSS
                .replace(tableStyles, '')
                .replace(`.highcharts-figure,
.highcharts-data-table table {`, '.highcharts-figure {');
            modified = true
        }
    }


    if (modified) {
        console.log('Modified', file); // eslint-disable-line
        await fs.writeFile(file, modifiedCSS, 'utf-8');
    }


    //*
    if (i > 100) {
        // break;
    }
    // */

}
