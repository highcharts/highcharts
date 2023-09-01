/// <reference lib="dom" />
import { opendir, readFile, appendFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type { BenchResults } from './benchmark.d.ts';

const TMP_FILE_PATH = '../../tmp/benchmarks';

function regression(yValues: number[], xValues: number[]){
    const yMean = yValues.reduce((a, b) => a + b) / yValues.length;
    const xMean = xValues.reduce((a, b) => a + b) / xValues.length;

    let slope = 0;
    let numerator = 0;
    let slopeDenominator = 0;


    for(let i = 0; i< yValues.length; i++){
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        slopeDenominator += Math.pow(xValues[i] - xMean, 2);
    }

    slope = numerator/slopeDenominator;

    const intercept = yMean - xMean * slope;

    let residualSumOfSquares = 0;
    let totalSumOfSquares = 0;
    let r2 = 0;

    for(let i = 0; i< yValues.length; i++){
        const prediction = predict(xValues[i], slope, intercept);
        residualSumOfSquares += Math.pow(prediction - yValues[i], 2);
        totalSumOfSquares += Math.pow(prediction - yMean, 2);
    }

    r2 = 1 - (residualSumOfSquares / totalSumOfSquares);


    return {slope, intercept, r2};
}

function predict(x: number, slope: number, intercept: number){
    return slope * x + intercept;
}

function getSeriesData(
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

function getOutliers(array: number[], Q1:number, Q3: number){
    const IQR = Q3 - Q1;
    return array.filter(r => r < Q1 - 1.5 * IQR || r > Q3 + 1.5 * IQR);
}

async function compare(base: BenchResults, actual: BenchResults){
    console.log(`Comparing ${actual[0].test}`);

    // Remove outliers by sample size
    const filtered: Record<'base'|'actual', BenchResults> = actual.reduce((carry,entry) =>{
        const baseEntry = base.find(b => b.sampleSize === entry.sampleSize);

        if(baseEntry){
            // Compare
            const diff = baseEntry.avg - entry.avg;
            const percentage = (diff / baseEntry.avg) * 100;


            const baseOutliers = getOutliers(baseEntry.results, baseEntry.Q1, baseEntry.Q3);
            const actualOutliers = getOutliers(entry.results, entry.Q1, entry.Q3);
            console.log({baseOutliers, actualOutliers})

            carry['base'].push({
                ...baseEntry,
                results: baseEntry.results.filter(r => !baseOutliers.includes(r))
            })
            carry['actual'].push({
                ...entry,
                results: entry.results.filter(r => !actualOutliers.includes(r))
            })

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
            })
        })

        return { x, y };
    }

    const baseXy = getXYValues(base);
    const actXy = getXYValues(actual);

    console.log('\n')

    console.log(`Context, slope, intercept, r2`);
    const baseRegression = regression(baseXy.y, baseXy.x);
    console.log(`base, ${baseRegression.slope}, ${baseRegression.intercept}, ${baseRegression.r2}`)

    const actRegression = regression(actXy.y, actXy.x);
    console.log(`actual, ${actRegression.slope}, ${actRegression.intercept}, ${actRegression.r2}`);


    // also do regression on filtered data

    const filteredBaseXy = getXYValues(filtered.base);
    const filteredBaseRegression = regression(filteredBaseXy.y, filteredBaseXy.x);

    const filteredActualXy = getXYValues(filtered.actual);
    const filteredActualRegression = regression(filteredActualXy.y, filteredActualXy.x);

    console.log('\n')

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
                type: "xy"
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


    // test, averages, diff
    const markdownTableRows = actual.map((entry, i) =>{
      return `| \`${entry.test}\` | ${entry.sampleSize} | ${base[i].avg} | ${entry.avg} | ${entry.avg - base[i].avg} |`;
    });

    await appendFile(
        join(TMP_FILE_PATH, 'table.md'),
        '\n' + markdownTableRows.join('\n')
    );

    const chartName = actual[0].test.replace('.bench.ts', '');

    await appendFile(
        join(TMP_FILE_PATH, 'report.html'), `
        <div id="${chartName}"></div>
        <script type="text/javascript">
        Highcharts.chart("${chartName}", ${JSON.stringify(chartConfig(chartName, series))});
        </script>`
    );

    console.log('See report at ', resolve(__dirname,TMP_FILE_PATH, 'report.html'));

}

const reportTemplate = (chart) => `
<embed src="${chart}"></embed>
`;

async function compareBenchmarks(){
    const data = await opendir(join(TMP_FILE_PATH, 'actual')).catch(error =>{
        throw new Error(`Could not open ${TMP_FILE_PATH}. It may not exist`);
    })

    const markdownTableHeader = `| Test | Sample size | Base avg (ms) | Actual avg (ms) | Diff |
| --- | --- | --- | --- | --- |`;

    await writeFile(join(TMP_FILE_PATH, 'table.md'), markdownTableHeader);
    await writeFile(join(TMP_FILE_PATH, 'report.html'), `
        <script src="https://code.highcharts.com/highcharts.js"></script>`)

    for await (const dirent of data){
        if(dirent.isFile() && dirent.name.endsWith('.json')){
            const baseFileContent = await readFile(join(TMP_FILE_PATH, 'base', dirent.name), 'utf-8').catch( ()=> undefined);

            if(baseFileContent){
                // Do a compare
                const actual = await readFile(join(TMP_FILE_PATH, 'actual', dirent.name), 'utf-8').catch(() => {throw new Error('File vanished')});

                const base = JSON.parse(baseFileContent);
                const act = JSON.parse(actual);

                // They should be arrays of objects
                if(Array.isArray(base) && Array.isArray(act)){
                    await compare(base, act);
                }
            }
        }
    }

    // await data.close()
}

compareBenchmarks()
.catch(console.error);


