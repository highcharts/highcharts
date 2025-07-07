import { test, setTestingOptions, loadSample } from './highcharts-fixture.ts';
import { expect } from '@playwright/test';

const { describe } = test;


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

  test('using loadSample', async ({page})=> {
    await loadSample(page, 'samples/highcharts/demo/line-chart');

    await setTestingOptions(page);

    await expect(
        page.getByLabel('Interactive chart', { exact: true })
        .getByText('U.S Solar Employment Growth')
    ).toBeVisible()
  });
});
