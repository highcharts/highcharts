// @ts-check
import process from 'node:process';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import yargs from 'yargs';

const { argv, cwd } = process;

const { reportsDir } = await yargs(argv).argv;

if (!reportsDir || typeof reportsDir !== 'string') {
    throw new Error('Missing or incorrect reportsDir argument');
}

const compareMetrics = [
    'categories.performance',
    'first-contentful-paint',
    'first-meaningful-paint',
    'dom-size',
];

const valueTypes = ['score', 'numericValue', 'numericUnit'];

/**
 * @param {string} path
 */
async function loadJSON(path) {
    const { default: jsonData } = await import(join(cwd(), path), {
        assert: { type: 'json' },
    }).catch(() => ({ default: null }));

    return jsonData;
}

/**
 * @param {Record<'base'| 'actual', {}>} outPutColumns
 * @param {string|undefined} reportName
 */
function printReport(outPutColumns, reportName = undefined) {
    if (reportName) {
        console.log(`### ${reportName}`);
    }

    const tableHeader =
        '|   | Reference | Proposed | Diff |' +
        '\n| :---- | ------ | ----- | ----- |\n';

    const lineFmt = ({ audit, measure, valueReference, valueProposed }) =>
        measure
            ? `| ${audit} – ${measure} | ${valueReference} | ${valueProposed} | ${
                  typeof valueReference === 'number' &&
                  typeof valueProposed === 'number'
                      ? (valueProposed - valueReference).toFixed(2)
                      : ''
              } |`
            : '';

    /**
     * @param {string} audit
     */
    const printTableLines = (audit) => {
        let lines = [];

        const base = outPutColumns.base[audit];
        const actual = outPutColumns.actual[audit];

        lines.push(
            lineFmt({
                audit,
                measure: 'score',
                valueReference: base ? base.score : '',
                valueProposed: actual.score,
            }),
        );

        if (actual.numericUnit) {
            lines.push(
                lineFmt({
                    audit,
                    measure: actual.numericUnit + 's',
                    valueReference: base
                        ? parseFloat(base.numericValue?.toFixed(2))
                        : '',
                    valueProposed: parseFloat(
                        outPutColumns.actual[audit].numericValue?.toFixed(2),
                    ),
                }),
            );
        }

        return lines.join('\n');
    };

    const table =
        tableHeader +
        Object.keys(outPutColumns.actual).map(printTableLines).join('\n');

    console.log(table);
}

// Loop over the actuals, as we are most interested in changes
const actualFiles = await readdir(join(reportsDir, 'actual'));
const reportFiles = actualFiles.map((file) => {
    return {
        actual: file,
        base: existsSync(join(reportsDir, 'base', file)) ? file : undefined,
    };
});

for (const report of reportFiles) {
    const outPutColumns = {
        base: {},
        actual: {},
    };

    for (const [context, fileName] of Object.entries(report)) {
        if (fileName) {
            const reportData = await loadJSON(
                join(reportsDir, context, fileName),
            );

            if (reportData) {
                compareMetrics.forEach((metric) => {
                    if (metric.startsWith('categories.')) {
                        const category = metric.replace('categories.', '');
                        const categoryData = reportData.categories[category];
                        if (categoryData) {
                            if (!outPutColumns[context][category]) {
                                outPutColumns[context][category] = {};
                            }

                            outPutColumns[context][category].score =
                                categoryData.score;
                        }
                        return;
                    }

                    if (reportData.audits[metric]) {
                        Object.keys(reportData.audits[metric])
                            .filter((key) => valueTypes.includes(key))
                            .forEach((key) => {
                                if (!outPutColumns[context][metric]) {
                                    outPutColumns[context][metric] = {};
                                }

                                outPutColumns[context][metric][key] =
                                    reportData.audits[metric][key];
                            });
                    }
                });
            }
        }
    }

    printReport(outPutColumns, report.actual);
}
