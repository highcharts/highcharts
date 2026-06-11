/// <reference lib="dom" />
import type { BenchResults } from './benchmark.d.ts';
import { opendir, readFile, appendFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

const TMP_FILE_PATH = resolve(__dirname, '../../tmp/benchmarks');
const QUIET_BAND_THRESHOLD_PERCENT = 5;
const REPORT_TABLE_INTRO = `> Rows with average difference between **−${QUIET_BAND_THRESHOLD_PERCENT}%** and **+${QUIET_BAND_THRESHOLD_PERCENT}%** are collapsed under a toggle inside each benchmark section.

`;

let hasAnyLoudLines = false;
const benchmarkTableSections: string[] = [];

function regression (yValues: number[], xValues: number[]){
    const yMean = yValues.reduce((a, b) => a + b) / yValues.length;
    const xMean = xValues.reduce((a, b) => a + b) / xValues.length;

    let slope = 0;
    let numerator = 0;
    let slopeDenominator = 0;

    for (let i = 0; i< yValues.length; i++){
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        slopeDenominator += Math.pow(xValues[i] - xMean, 2);
    }

    slope = numerator / slopeDenominator;

    const intercept = yMean - xMean * slope;

    let residualSumOfSquares = 0;
    let totalSumOfSquares = 0;
    let r2 = 0;

    for (let i = 0; i< yValues.length; i++){
        const prediction = predict(xValues[i], slope, intercept);
        residualSumOfSquares += Math.pow(prediction - yValues[i], 2);
        totalSumOfSquares += Math.pow(prediction - yMean, 2);
    }

    r2 = 1 - (residualSumOfSquares / totalSumOfSquares);


    return { slope, intercept, r2 };
}

function predict (x: number, slope: number, intercept: number){
    return slope * x + intercept;
}

function getSeriesData (
    seriesName: string,
    xValues: number[],
    yValues: number[],
    slope: number,
    intercept: number,
    visible = true
){
    return [{
        name: `${seriesName} - Benchmark data`,
        type: 'scatter',
        data: xValues.map((x, i) => [x, yValues[i]]),
        visible
    }, {
        name: `${seriesName} - Regression`,
        type: 'line',
        data: xValues.map(x => [x, predict(x, slope, intercept)]),
        visible
    }];
}

function getOutliers (array: number[], Q1:number, Q3: number){
    const IQR = Q3 - Q1;
    return array.filter(r => r < Q1 - 1.5 * IQR || r > Q3 + 1.5 * IQR);
}

function getMedian (values: number[]): number | undefined {
    if (!values.length) {
        return;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function compare (base: BenchResults, actual: BenchResults){
    const chartId = basename(actual[0].test, '.bench.ts');
    const benchmarkTitle = chartId.replace(/-/g, ' ');

    console.log(`Comparing ${benchmarkTitle}`);

    // Remove outliers by sample size
    const filtered: Record<'base'|'actual', BenchResults> = actual.reduce((carry,entry) =>{
        const baseEntry = base.find(b => b.sampleSize === entry.sampleSize);

        if (baseEntry) {
            const baseOutliers = getOutliers(baseEntry.results, baseEntry.Q1, baseEntry.Q3);
            const actualOutliers = getOutliers(entry.results, entry.Q1, entry.Q3);

            carry['base'].push({
                ...baseEntry,
                results: baseEntry.results.filter(r => !baseOutliers.includes(r))
            });
            carry['actual'].push({
                ...entry,
                results: entry.results.filter(r => !actualOutliers.includes(r))
            });

            return carry;
        }
    }, {
        base: [],
        actual: []
    });


    function getXYValues (data: BenchResults){
        const x = [];
        const y = [];

        data.forEach(entry =>{
            entry.results.forEach((result)=>{
                x.push(entry.sampleSize);
                y.push(result);
            });
        });

        return {
            x,
            y
        };
    }

    const baseXy = getXYValues(base);
    const actXy = getXYValues(actual);

    const baseRegression = regression(baseXy.y, baseXy.x);
    const actRegression = regression(actXy.y, actXy.x);

    // also do regression on filtered data

    const filteredBaseXy = getXYValues(filtered.base);
    const filteredBaseRegression = regression(filteredBaseXy.y, filteredBaseXy.x);

    const filteredActualXy = getXYValues(filtered.actual);
    const filteredActualRegression = regression(filteredActualXy.y, filteredActualXy.x);

    const series = [
        ...getSeriesData('Base - 95% quantile', filteredBaseXy.x, filteredBaseXy.y, filteredBaseRegression.slope, filteredBaseRegression.intercept),
        ...getSeriesData('Actual - 95% quantile', filteredActualXy.x, filteredActualXy.y, filteredActualRegression.slope, filteredActualRegression.intercept),
        ...getSeriesData('Base - raw', baseXy.x, baseXy.y, baseRegression.slope, baseRegression.intercept, false),
        ...getSeriesData('Actual - raw', actXy.x, actXy.y, actRegression.slope, actRegression.intercept, false),
    ];

    const chartConfig = (title: string, series: {}) => ({
        chart: {
            height: 800,
            width: 1000,
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text:title
        },
        subtitle: {
            text: 'Base vs actual'
        },
        series,
        xAxis: {
            title: {
                text: 'Sample size'
            },
        },
        yAxis: {
            title:{
                text: 'Time (ms)'
            },
            min: 0,
            softMax: 1
        },
        accessibility: {
            enabled: false
        }
    });

    const markdownTableHeader = `| Sample size | Avg: PR (ms) | Avg: Master (ms) | Avg Δ (ms) | Avg Δ (%) | Median: PR (ms) | Median: Master (ms) | Median Δ (ms) | Median Δ (%) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |`;

    const fmt = (n: number | undefined, sign: string = '') =>
        n === undefined || Number.isNaN(n) ? '—' : `${Math.round(n)}${sign}`;

    const rowBands = actual.map((entry, i) => {
        const baseEntry = base.find(b => b.sampleSize === entry.sampleSize) ?? base[i];

        const diff = entry.avg - baseEntry.avg;
        const avgPerc = (diff / baseEntry.avg) * 100;

        const medianPR = getMedian(entry.results);
        const medianMaster = getMedian(baseEntry.results);
        const medianDiff = medianPR - medianMaster;
        const medianPerc = (medianDiff / medianMaster) * 100;

        const line = `| ${entry.sampleSize} | ${fmt(entry.avg)} | ${fmt(baseEntry.avg)} | ${fmt(diff)} | **${fmt(avgPerc, '%')}** | ${fmt(medianPR)} | ${fmt(medianMaster)} | ${fmt(medianDiff)} | **${fmt(medianPerc, '%')}** |`;
        const inQuietBand = !Number.isNaN(avgPerc) &&
            avgPerc >= -QUIET_BAND_THRESHOLD_PERCENT &&
            avgPerc <= QUIET_BAND_THRESHOLD_PERCENT;

        return { line, inQuietBand };
    });

    const loudLines = rowBands.filter(r => !r.inQuietBand).map(r => r.line);
    const quietLines = rowBands.filter(r => r.inQuietBand).map(r => r.line);

    if (loudLines.length > 0) {
        hasAnyLoudLines = true;
    }

    const detailsSummary = `See hidden ${benchmarkTitle} results.`;

    let benchSummaryMd: string;
    if (quietLines.length === 0) {
        benchSummaryMd = `${markdownTableHeader}
${loudLines.join('\n')}`;
    } else if (loudLines.length === 0) {
        benchSummaryMd = `<details><summary>${detailsSummary}</summary>

${markdownTableHeader}
${quietLines.join('\n')}

</details>`;
    } else {
        benchSummaryMd = `${markdownTableHeader}
${loudLines.join('\n')}

<details><summary>${detailsSummary}</summary>

${markdownTableHeader}
${quietLines.join('\n')}

</details>`;
    }

    benchmarkTableSections.push(`### ${benchmarkTitle}
${benchSummaryMd}

`);

    await appendFile(
        join(TMP_FILE_PATH, 'report.html'), `
        <div id="${chartId}"></div>
        <script type="text/javascript">
        Highcharts.chart("${chartId}", ${JSON.stringify(chartConfig(benchmarkTitle, series))});
        </script>`
    );
}

async function compareFile(actualFilePath: string, baseFilePath: string, comparisonsMade: number) {

    const actualFileContent = await readFile(
        actualFilePath,
        'utf-8'
    ).catch((e)=> console.log(e, 'couldn\'t read actual file'));

    if (!actualFileContent) {
        return comparisonsMade;
    }
        // Do a compare
        const baseFileContent = await readFile(
            baseFilePath,
                'utf-8'
        ).catch(() => {throw new Error('File vanished');});

        const actual = JSON.parse(actualFileContent);
        const base = JSON.parse(baseFileContent);

        // They should be arrays of objects
    if (!(Array.isArray(base) && Array.isArray(actual))) {
        return comparisonsMade;
    }
    await compare(base, actual);
    return comparisonsMade + 1;

}

async function compareDirectories(
    comparisonsMade: number,
    baseDirPath: string,
    actualDirPath: string
) {

    let directory = await opendir(actualDirPath).catch(()=>{
        throw new Error(`Could not open ${TMP_FILE_PATH}. It may not exist. Try running \`npm run benchmark\``);
    });
    for await (const dirEntry of directory) {
        if (dirEntry.isFile() && dirEntry.name.endsWith('.json')){
            comparisonsMade = await compareFile(
                join(actualDirPath, dirEntry.name),
                join(baseDirPath, dirEntry.name),
                comparisonsMade
            );
        } else if(dirEntry.isDirectory()) {
            comparisonsMade = await compareDirectories(
                comparisonsMade,
                join(baseDirPath, dirEntry.name),
                join(actualDirPath, dirEntry.name)
            );
        }
    }
    return comparisonsMade;
}
async function compareBenchmarks (){
    await writeFile(join(TMP_FILE_PATH, 'report.html'), `
        <script src="https://code.highcharts.com/highcharts.js"></script>`);

    let comparisonsMade = await compareDirectories(
        0,
        join(TMP_FILE_PATH, 'base'),
        join(TMP_FILE_PATH, 'actual')
    );

    const body = benchmarkTableSections.join('');

    if (!hasAnyLoudLines) {
        await writeFile(
            join(TMP_FILE_PATH, 'table.md'),
            `### No significant performance changes.

<details><summary>See all tests.</summary>

${REPORT_TABLE_INTRO}${body}</details>
`
        );
    } else {
        await writeFile(join(TMP_FILE_PATH, 'table.md'), `${REPORT_TABLE_INTRO}${body}`);
    }

    if (comparisonsMade > 0){
        console.log('Report saved at', resolve(__dirname,TMP_FILE_PATH, 'report.html'));
    } else {
        console.log('Was not able to make any comparisons');
    }
}

compareBenchmarks()
.catch(console.error);


