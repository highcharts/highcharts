import { test, expect } from '@playwright/test';

const { describe } = test;

async function setTestingOptions(page: import('@playwright/test').Page){
    await page.evaluate(()=>{
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
                        hover: {
                            animation: false
                        },
                        select: {
                            animation: false
                        },
                        inactive: {
                            animation: false
                        },
                        normal: {
                            animation: false
                        }
                    },
                    label: {
                        // Disable it to avoid diff. Consider enabling it in the future,
                        // then it can be enabled in the clean-up commit right after a
                        // release.
                        enabled: false
                    }
                },
                // We cannot use it in plotOptions.series because treemap
                // has the same layout option: layoutAlgorithm.
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
            // Stock's Toolbar decreases width of the chart. At the same time, some
            // tests have hardcoded x/y positions for events which cuases them to fail.
            // For these tests, let's disable stockTools.gui globally.
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
    })
}

describe('Highcharts hover lineWidth and lineWidthPlus', () => {
  test('standard Highcharts line hover styling', async ({ page }) => {
    await page.goto('/simple.html');

    await setTestingOptions(page);

    const chart = await page.evaluate(() =>
      Highcharts.chart('container', {
          chart: {
              animation: false
          },
          plotOptions: {
              series:{
                  animation: false
              },
              line: {
                  dataLabels: [{
                      enabled: true,
                      y: -10
                  }, {
                      enabled: true,
                      y: 30
                  }]
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
      })
    );

    const strokeWidthNormal = await page.locator('.highcharts-graph').first()
        .getAttribute('stroke-width');
    expect(strokeWidthNormal, 'normal').toBe('2');

    await page.hover('.highcharts-series-0');

    const strokeWidthHover = await page.locator('.highcharts-graph').first().getAttribute('stroke-width');
    expect(strokeWidthHover, 'hover').toBe('4');

    const labelY = chart.options.plotOptions.line.dataLabels?.[0]?.y;
    expect(labelY, 'Distance should not be merged with defaults (#21928)').toBe(-10);

    const labelX = chart.options.plotOptions.line.dataLabels?.[0]?.x;
    expect(labelX, 'x should be merged with defaults (#21928)').toBe(0);
  });

  test('Highcharts Stock hover styling', async ({ page }) => {
    await page.setContent(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Highcharts Test</title>
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
`, { waitUntil: 'networkidle' });

    await setTestingOptions(page);

    await page.evaluate(() => {
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

    const strokeWidthNormal = await page.evaluate(() =>
      document.querySelector<SVGElement>('.highcharts-graph')?.getAttribute('stroke-width')
    );
    expect(strokeWidthNormal, 'normal').toBe('3');

    await page.hover('.highcharts-series-0');

    const strokeWidthHover = await page.evaluate(() =>
      document.querySelector<SVGElement>('.highcharts-graph')?.getAttribute('stroke-width')
    );
    expect(strokeWidthHover, 'hover').toBe('6');
  });
});
