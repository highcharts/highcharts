/// <reference lib="dom" />
import type { BenchResults } from './benchmark.d.ts';
import { opendir, readFile, appendFile, writeFile } from 'node:fs/promises';
import type { Dir } from 'fs';
import { join, resolve } from 'node:path';

const TMP_FILE_PATH = '../../tmp/benchmarks';

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

    slope = numerator/slopeDenominator;

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
    },
    {
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

async function compare (base: BenchResults, actual: BenchResults){
    console.log(`Comparing ${actual[0].test}`);

    // Remove outliers by sample size
    const filtered: Record<'base'|'actual', BenchResults> = actual.reduce((carry,entry) =>{
        const baseEntry = base.find(b => b.sampleSize === entry.sampleSize);

        if (baseEntry) {
            // Compare
            const diff = baseEntry.avg - entry.avg;
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
    },
    {
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

    const fmtResult = (num: number) =>
        Math.round((num + Number.EPSILON) * 100) / 100;

    // test, averages, diff
    const markdownTableRows = actual.map((entry, i) =>{
        const diff = entry.avg - base[i].avg;

        return `| ${entry.sampleSize} | ${fmtResult(base[i].avg)} | ${fmtResult(entry.avg)} | ${fmtResult(diff)} | ${fmtResult((diff) / base[i].avg)}%`;
    });

    const markdownTableHeader = `| Sample size | Base avg (ms) | Actual avg (ms) | Diff | Percent diff |
| --- | --- | --- | --- | --- |`;

    await appendFile(
        join(TMP_FILE_PATH, 'table.md'),
        `### ${actual[0].test}
${markdownTableHeader}
${markdownTableRows[markdownTableRows.length - 1]}

<details><summary>See all</summary>


${markdownTableHeader}
${markdownTableRows.join('\n')}


</details>

`);

    const chartName = actual[0].test.replace('.bench.ts', '');

    await appendFile(
        join(TMP_FILE_PATH, 'report.html'), `
        <div id="${chartName}"></div>
        <script type="text/javascript">
        Highcharts.chart("${chartName}", ${JSON.stringify(chartConfig(chartName, series))});
        </script>`
    );
}

async function compareFile(actualFilePath: string, baseFilePath: string, comparisonsMade: number) {

    const baseFileContent = await readFile(
        actualFilePath,
        'utf-8'
    ).catch((e)=> console.log(e, 'couldnt read actual file'));

    if (!baseFileContent) {
        return comparisonsMade;
    }
        // Do a compare
        const actual = await readFile(
        baseFilePath,
            'utf-8'
        ).catch(() => {throw new Error('File vanished');});

        const base = JSON.parse(baseFileContent);
        const act = JSON.parse(actual);

        // They should be arrays of objects
    if (!(Array.isArray(base) && Array.isArray(act))) {
        return comparisonsMade;
    }
    await compare(base, act);
    return comparisonsMade+1;

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

        const isFile = dirEntry.isFile() && dirEntry.name.endsWith('.json');
        const isDir = dirEntry.isDirectory();
        if (isFile){
            comparisonsMade = await compareFile(
                join(actualDirPath, dirEntry.name),
                join(baseDirPath, dirEntry.name),
                comparisonsMade
            );
        } else if(isDir) {
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

    await writeFile(join(TMP_FILE_PATH, 'table.md'), '');
    await writeFile(join(TMP_FILE_PATH, 'report.html'), `
        <script src="https://code.highcharts.com/highcharts.js"></script>`);

    let comparisonsMade = await compareDirectories(
        0,
        join(TMP_FILE_PATH, 'base'),
        join(TMP_FILE_PATH, 'actual')
    );

    if (comparisonsMade > 0){
        console.log('Report saved at', resolve(__dirname,TMP_FILE_PATH, 'report.html'));
    } else {
        console.log('Was not able to make any comparisons');
    }
}

compareBenchmarks()
.catch(console.error);


