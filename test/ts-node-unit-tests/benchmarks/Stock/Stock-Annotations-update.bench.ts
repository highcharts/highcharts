import type { BenchmarkContext, BenchmarkResult } from '../../benchmark';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';
import { generateOHLC } from '../../data-generators';
import { setupDOM } from '../../test-utils';


export const config = {
    sizes: [1000, 10_000]
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
  const hc = require(join(CODE_PATH, '/highstock.src.js'))(win);
  require(join(CODE_PATH, '/modules/annotations-advanced.src.js'))(hc);

  const chart = hc.stockChart(el, {
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
    annotations: [{
      type: 'fibonacci',
      typeOptions: {
        points: [{
          x: data[0][0],
          y: data[0][4]
        }, {
          x: data[100][0],
          y: data[100][4]
        }],
      }
    }, {
      type: 'crookedLine',
      typeOptions: {
        points: [{
          x: data[0][0],
          y: data[0][4]
        }, {
          x: data[100][0],
          y: data[100][4]
        }],
      }
    }],
    series: [{
      data: data,
      type: 'candlestick',
      dataGrouping: {
        enabled: true
      }
    }]
  });

  performance.mark('Start');

  for (let i = 0; i < 250; i++) {
    const visible = i % 2 === 0;

    chart.update({
      annotations: [{ visible }, { visible }]
    });
  };

  performance.mark('End');

  return performance.measure('Start to Now', 'Start', 'End').duration;
}
