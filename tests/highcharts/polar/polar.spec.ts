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

test.describe('chart.polar without highcharts-more', () => {
    test('Option is ignored', async ({ page }) => {
        const handle = await createChart(page, {
            chart: {
                polar: true
            },
            tooltip: {
                split: true
            },
            series: [{
                data: [1, 3, 2]
            }]
        });

        expect(
            await handle.evaluate((chart): unknown => [
                chart.polar,
                chart.tooltip.split
            ]),
            'chart.polar should not be set and disable split tooltip'
        ).toEqual([void 0, true]);

        expect(
            await handle.evaluate((chart): unknown => {
                chart.update({ chart: { inverted: true } });
                chart.update({ chart: { polar: true } });
                return [chart.polar, chart.inverted];
            }),
            'chart.polar should be ignored on update, inverted parsed'
        ).toEqual([void 0, true]);
    });
});
