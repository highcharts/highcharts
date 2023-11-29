
import type { BenchmarkContext, BenchmarkResult } from '../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { generateOHLC } from '../data-generators';
import { setupDOM } from '../test-utils';


export const config = {
    sizes: [1000, 10_000, 100_000, 1_000_000]
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
        CODE_PATH,
        data
    }: BenchmarkContext
): Promise<BenchmarkResult> {
  const { win, el } = setupDOM();
  // load the script from cdn
  // how to require the script from cdn in node?

  function getScriptFromPath(source?: string): any {

  }

  const anyCharts = getScriptFromPath(/* path */ )(win);
//   const hc = require(join(CODE_PATH, '/highstock.src.js'))(win);

  performance.mark('Start');
  /* Create AnyCharts
//   anychart.onDocumentReady(function () {
    // The upcoming OHLC chart data and JS code will be in this section
        // create a data table
        var dataTable = anychart.data.table();
        dataTable.addData(data);
          // The OHLC JS code lands here.
        
        var mapping = dataTable.mapAs({
          date: 0,
          open: 1,
          high: 2,
          low: 3,
          close: 4
        });
        
        // create a stock chart
        var chart = anychart.stock();
    
        // create the chart plot
        var plot = chart.plot(0);
    
        // create an ohlc series and bind it to the mapped data
        var ohlcSeries = plot.ohlc(mapping);
        
        chart.selectRange("2021-03-01", "2023-08-20");
        
        // set the chart title
        chart.title("S&P 500 OHLC Chart");
    
        // set the container id for the chart
        chart.container("container");
    
        // initiate the chart drawing
        chart.draw();
      });
    });*/
  performance.mark('End');

  return performance.measure('Start to Now', 'Start', 'End').duration;
}
