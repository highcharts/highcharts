import type { Page } from '@playwright/test';
import { test } from '~/fixtures.ts';
import {
    dispatchClick,
    expectClose,
    useSharedPage,
    waitForChart
} from '~/helpers.ts';
import { clickChart, dragTo, selectAnnotation } from '../helpers.ts';

/**
 * The pixel positions of the annotation points and its pixel interval.
 */
async function getTimeCycles(page: Page): Promise<{
    x1: number;
    x2: number;
    pixelInterval: number;
}> {
    await waitForChart(page);
    return page.evaluate(() => {
        const chart = Highcharts.charts[0] as any,
            annotation = chart.annotations[0],
            xAxis = chart.xAxis[0];

        return {
            x1: xAxis.toPixels(annotation.points[0].x),
            x2: xAxis.toPixels(annotation.points[1].x),
            pixelInterval: annotation.pixelInterval
        };
    });
}

test.describe('Stock Tools Time Cicles, #15826', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Should create the annotation and update it after dragging.', async () => {
        const page = getPage();

        await test.step('Should create an annotation and check the shape\'s coordinates.', async () => {
            await selectAnnotation(page, 'highcharts-time-cycles', 'highcharts-fibonacci');
            await clickChart(page, [[125, 150], [225, 150]], true);

            const cycles = await getTimeCycles(page);
            expectClose(cycles.x1, 125, 4, 'First point should be close to the place, where the mouse clicked.');
            expectClose(cycles.x2, 225, 4, 'Second point should be close to the place, where the mouse clicked.');
            expectClose(cycles.pixelInterval, 100, 4, 'Pixel interval should be equal to the difference between positions.');
        });

        await test.step('Changes annotation\'s properties when the controlPoints are dragged.', async () => {
            await dispatchClick(page.locator('.highcharts-annotation').first());

            await dragTo(page.locator('.highcharts-control-points > *').last(), [370, 100]);

            const cycles = await getTimeCycles(page);
            expectClose(cycles.x1, 125, 4, 'First point should be close to the place, where it was dragged.');
            expectClose(cycles.x2, 370, 4, 'Second point should be close to the place, where it was dragged.');
            expectClose(cycles.pixelInterval, 245, 4, 'Pixel interval should be adjusted to new value.');
        });

        await test.step('Dragging control Points should change annotation\'s properties.', async () => {
            await dragTo(page.locator('.highcharts-annotation').first(), [450, 100], true);

            const cycles = await getTimeCycles(page);
            expectClose(cycles.x1, 85, 4, 'The point1 should change its place.');
            expectClose(cycles.x2, 330, 4, 'The point1 should change its place.');
        });
    });
});
