import { createChart, expect, test } from '~/fixtures';

test.describe('samples/unit-tests/polar/polar-zoom equivalent', () => {
    test('Arc shape', async ({ page }) => {
        const handle = await createChart(
            page,
            {
                chart: {
                    zooming: {
                        type: 'xy'
                    },
                    polar: true,
                },
                series: [{
                    type: 'column',
                    data: [8, 7, 6, 5, 4, 3, 2, 1]
                }]
            },
            {
                modules: ['highcharts-more.src.js']
            }
        );

        const createdChart = await handle.jsonValue();
        expect(createdChart).toHaveProperty('polar', true);

        let [centerX, centerY] = (createdChart as any)
            .pane[0].center as [number, number];

        centerX += createdChart.plotLeft;
        centerY += createdChart.plotTop;

        await page.mouse.move(centerX - 50, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY);

        await expect(
            page.locator('.highcharts-selection-marker')
        ).toHaveAttribute('d', /\sA|a\s/gu) ;

        await page.mouse.up(); // Not strictly neccessary, but keeping for now
    });
});

test(
    'Loading highcharts-more after chart creation should not break redraw ' +
    '(#25546)',
    async ({ page }) => {
        await page.setContent('<div id="container"></div>');
        await page.addScriptTag({
            url: 'https://code.highcharts.com/highcharts.js'
        });

        await page.evaluate(() => {
            window.Highcharts.chart('container', {
                series: [{
                    type: 'line',
                    data: [1, 3, 2]
                }]
            });
        });

        await page.addScriptTag({
            url: 'https://code.highcharts.com/highcharts-more.js'
        });

        const error = await page.evaluate(() => {
            try {
                window.Highcharts.charts[0]?.setSize(400, 300, false);
            } catch (e) {
                return String(e);
            }
        });

        expect(
            error,
            'Redraw should succeed on axes created without a pane'
        ).toBeUndefined();
    }
);
