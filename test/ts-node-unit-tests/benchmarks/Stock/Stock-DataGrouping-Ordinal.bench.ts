import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';


export const config = {
    sizes: [10, 400, 2000, 8000]
};

export function before(size: number) {
    function generateOHLC(size: number){

        const data: Array<Array<number>> = [],
            firstPoint = Date.UTC(2022, 0),
            dayInMilis  = 8.64e7,
            gap = Math.floor(size * 0.1);


        for (let i = 0;i < size + gap; i++) {
            if (i > gap && i < gap * 2) {
                continue;
            }
            data.push([
                firstPoint + i * dayInMilis,
                Math.floor(100* Math.random()),
                Math.floor(100* Math.random()),
                Math.floor(100* Math.random()),
                Math.floor(100* Math.random()),
            ]);
        }
        return data;
    }

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
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(
    `<!doctype html>
  <body> </body>`);
  const win = dom.window;
  const doc = win.document;
  const hc = require(join(CODE_PATH, '/highstock.src.js'))(win);

  global.Node = win.Node; // Workaround for issue #1
  win.Date = Date;

  // Do some modifications to the jsdom document in order to get the SVG bounding
  // boxes right.
  let oldCreateElementNS = doc.createElementNS;
  let el = doc.createElement('div');
  doc.body.appendChild(el);
  performance.mark('Start');
  hc.stockChart(el, {
    chart: {
        height: 400,
        width: 800
    },
    accessibility: {
      enabled: false
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
    }]
  });
  performance.mark('End');

  return performance.measure('Start to Now', 'Start', 'End').duration;
}
