import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { generateOHLC } from '../../data-generators';
import { runTest } from '../../pupeteer';

declare const Highcharts: any;


export const config = {
    // sizes: [1000, 10_000, 100_000, 1_000_000]
    sizes: [10]
};

export function before(size: number) {

    return {
        fileName: `${size}-ohlc.json`,
        func: generateOHLC.bind(undefined, size)
  };
}

export default async function benchmarkTest(
    {
        size,
        data
    }: BenchmarkContext
): Promise<BenchmarkResult> {

    const html = `
<!DOCTYPE html>
<html>
<head>
<script src="https://code.highcharts.com/stock/highstock.js"></script>
</head>
<body>
<div id="container"></div>
</body>
</html>
`;

    const result = await runTest(html, (data) => {
        performance.mark('start') 
        Highcharts.stockChart('container', {

            chart: {
                height: 400,
                width: 800
            },
            accessibility: {
                enabled: false
            },
            xAxis: {
                ordinal: false
            },
            plotOptions: {
                series: {
                    animation: false,
                    dataLabels: {
                        defer: false
                    }
                }
            },
            series: [{
                data: data,
                type: 'candlestick',
                dataGrouping: {
                    enabled: true
                }
            }]
        });
            performance.mark('end')
            return performance.measure('start to end', 'start', 'end').duration;
    }, data);

    return result;
}
