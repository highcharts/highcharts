/// <reference lib="dom" />
import { opendir, readFile, appendFile, rm} from 'node:fs/promises';
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
    intercept: number
){
    return [{
        name: `${seriesName} - Benchmark data`,
        type: 'scatter',
        data: xValues.map((x, i) => [x, yValues[i]])
    },
    {
        name: `${seriesName} - Regression`,
        type: 'line',
        data: xValues.map(x => [x, predict(x, slope, intercept)])
    }];
}

async function exportChart(chartConfig: any){
    const url = 'https://export.highcharts.com';
        const pngDataUrlPrefix = 'data:image/svg+xml;base64,';

    const response = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                infile: chartConfig,
                b64: true,
                type: 'image/svg+xml'
            })
        }).then((res ) =>
            res.text()
        ).catch(()=> null);

        if(response){
            const buf = Buffer.from(response, 'base64');

            return pngDataUrlPrefix + buf.toString('base64')
        }

}

async function compare(base: BenchResults, actual: BenchResults){
    console.log(`Comparing ${actual[0].test}`);
    console.log(`Sample Size, Base avg, Actual avg, Diff, Percentage`)
    actual.forEach(entry =>{
        const baseEntry = base.find(b => b.sampleSize === entry.sampleSize);

        if(baseEntry){
            // Compare
            const diff = baseEntry.avg - entry.avg;
            const percentage = (diff / baseEntry.avg) * 100;
            console.log(`${entry.sampleSize.toString().padEnd(10)}, ${baseEntry.avg.toFixed(2)}, ${entry.avg.toFixed(2)}, ${diff.toFixed(2)}, ${percentage.toFixed(3)}%`);
        }
    })


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

    console.log('\n')

    const series = [
        ...getSeriesData('base', baseXy.x, baseXy.y, baseRegression.slope, baseRegression.intercept),
        ...getSeriesData('actual', actXy.x, actXy.y, actRegression.slope, actRegression.intercept)
    ];

    const chartConfig = {
        chart: {
            height: 800
        },
        title: {
            text: actual[0].test.replace('.bench.ts', '')
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
        }
    }


        const chart = await exportChart(chartConfig);

    // console.log(reportTemplate(chartLinks[0], chartLinks[1]));

    await appendFile(join(TMP_FILE_PATH, 'report.html'), reportTemplate(chart))

    console.log('See report at ', resolve(__dirname,TMP_FILE_PATH, 'report.html'));

}

const reportTemplate = (chart) => `
<embed src="${chart}"></embed>
`;

async function compareBenchmarks(){
    const data = await opendir(join(TMP_FILE_PATH, 'actual')).catch(error =>{
        throw new Error(`Could not open ${TMP_FILE_PATH}. It may not exist`);
    })

    await rm(join(TMP_FILE_PATH, 'report.html'))

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


                    // console.log(JSON.stringify(chartConfigs, undefined, 2))
                }





            }

        }
    }

    // await data.close()
}

compareBenchmarks()
.catch(console.error);


