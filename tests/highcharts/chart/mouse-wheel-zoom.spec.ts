import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage, waitForChart } from '~/helpers.ts';

test.describe('Mouse wheel chart zoom, #19178', () => {
    const getPage = useSharedPage('/highcharts/cypress/mouse-wheel-zoom');

    test('Should change yAxis extremes and keep axis options after zoom', async () => {
        const page = getPage();

        await waitForChart(page);
        const before = await page.evaluate(
            () => Highcharts.charts[0].yAxis[0].getExtremes()
        );

        await trigger(page.locator('#container'), 'wheel', {
            deltaY: -66.666666,
            wheelDelta: 120,
            wheelDeltaX: 0,
            wheelDeltaY: 120
        });

        const yAxis = await page.evaluate(() => {
            const axis = Highcharts.charts[0].yAxis[0];
            return { min: axis.min, max: axis.max, id: axis.options.id };
        });

        expect(yAxis.min, 'yAxis min should change after zooming')
            .not.toBe(before.min);
        expect(yAxis.max, 'yAxis max should change after zooming')
            .not.toBe(before.max);
        expect(
            yAxis.id,
            'yAxis id is defined and available after wheel zoom, #19178'
        ).toBe('test');
    });
});
