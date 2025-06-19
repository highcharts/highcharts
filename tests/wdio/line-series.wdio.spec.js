import { expect } from 'expect-webdriverio';

async function setTestingOptions() {
  await browser.execute(() => {
    Highcharts.setOptions({
      chart: {
        animation: false
      },
      lang: {
        locale: 'en-GB'
      },
      plotOptions: {
        series: {
          animation: false,
          kdNow: true,
          dataLabels: {
            defer: false
          },
          states: {
            hover: { animation: false },
            select: { animation: false },
            inactive: { animation: false },
            normal: { animation: false }
          },
          label: {
            enabled: false
          }
        },
        networkgraph: {
          layoutAlgorithm: {
            enableSimulation: false,
            maxIterations: 10
          }
        },
        packedbubble: {
          layoutAlgorithm: {
            enableSimulation: false,
            maxIterations: 10
          }
        }
      },
      stockTools: {
        gui: {
          enabled: false
        }
      },
      tooltip: {
        animation: false
      },
      drilldown: {
        animation: false
      }
    });
  });
}

describe('Highcharts hover lineWidth and lineWidthPlus', () => {
  it('standard Highcharts line hover styling', async () => {
    await browser.url('/simple.html'); // must be served
    await setTestingOptions();

    await browser.execute(() => {
      Highcharts.chart('container', {
        chart: { animation: false },
        plotOptions: {
          series: { animation: false },
          line: {
            dataLabels: [
              { enabled: true, y: -10 },
              { enabled: true, y: 30 }
            ]
          }
        },
        series: [{
          type: 'line',
          data: [1, 3, 2, 4],
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 4,
              lineWidthPlus: 2
            }
          }
        }]
      });
    });

    const strokeWidthNormal = await $('.highcharts-graph').getAttribute('stroke-width');
    expect(strokeWidthNormal).toBe('2');

    await $('.highcharts-series-0').moveTo(); // simulate hover

    const strokeWidthHover = await $('.highcharts-graph').getAttribute('stroke-width');
    expect(strokeWidthHover).toBe('4');

    const { labelY, labelX } = await browser.execute(() => {
      const opts = Highcharts.charts[0].options.plotOptions.line.dataLabels;
      return {
        labelY: opts?.[0]?.y,
        labelX: opts?.[0]?.x
      };
    });

    expect(labelY).toBe(-10);
    expect(labelX).toBe(0);
  });

  it('Highcharts Stock hover styling', async () => {
    await browser.url('about:blank');

    await browser.execute(() => {
      document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Highcharts Stock Test</title>
            <script src="https://code.highcharts.com/stock/highstock.js"></script>
            <style>
              #container {
                width: 600px;
                height: 400px;
                margin: 0 auto;
              }
            </style>
          </head>
          <body>
            <div id="container"></div>
          </body>
        </html>
      `);
      document.close();
    });

    await browser.pause(500); // wait for script tag to load Highcharts

    await setTestingOptions();

    await browser.execute(() => {
      Highcharts.stockChart('container', {
        chart: {
          animation: false
        },
        series: [{
          type: 'line',
          data: [1, 3, 2, 4],
          lineWidth: 3,
          states: {
            hover: {
              lineWidthPlus: 3
            }
          }
        }]
      });
    });

    const strokeWidthNormal = await $('.highcharts-graph').getAttribute('stroke-width');
    expect(strokeWidthNormal).toBe('3');

    await $('.highcharts-series-0').moveTo();

    const strokeWidthHover = await $('.highcharts-graph').getAttribute('stroke-width');
    expect(strokeWidthHover).toBe('6');
  });
});
