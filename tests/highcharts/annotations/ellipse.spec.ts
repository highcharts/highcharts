import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { expectClose, useSharedPage, waitForChart } from '~/helpers.ts';
import { clickChart, dragTo, selectAnnotation } from '../helpers.ts';

/**
 * The pixel positions of the two ellipse points, and its `ry` option.
 */
async function getEllipse(page: Page): Promise<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    ry: number;
}> {
    await waitForChart(page);
    return page.evaluate(() => {
        const chart = Highcharts.charts[0] as any,
            ellipse = chart.annotations[0].shapes[0],
            xAxis = chart.xAxis[ellipse.points[0].options.xAxis],
            yAxis = chart.yAxis[ellipse.points[0].options.yAxis];

        return {
            x1: xAxis.toPixels(ellipse.points[0].x),
            y1: yAxis.toPixels(ellipse.points[0].y),
            x2: xAxis.toPixels(ellipse.points[1].x),
            y2: yAxis.toPixels(ellipse.points[1].y),
            ry: ellipse.options.ry
        };
    });
}

test.describe('Stock tools Ellipse Annotation, #15008', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Should create, drag and edit the Ellipse annotation.', async () => {
        const page = getPage();

        await test.step('Should create Ellipse annotation via stock tools and test its params.', async () => {
            await selectAnnotation(
                page,
                'highcharts-ellipse-annotation',
                'highcharts-label-annotation'
            );

            await clickChart(page, [[250, 200], [350, 100], [300, 170]], true);

            const ellipse = await getEllipse(page);
            expectClose(ellipse.x1, 250, 1, 'First point\'s x value should be close to the place where it was clicked.');
            expectClose(ellipse.y1, 200, 1, 'First point\'s y value should be close to the place where it was clicked.');
            expectClose(ellipse.x2, 350, 1, 'Second point\'s x value should be close to the place where it was clicked.');
            expectClose(ellipse.y2, 100, 1, 'Second point\'s y value should be close to the place where it was clicked.');
            expectClose(ellipse.ry, 3.5, 1, 'Calculated ry should be close to expected value.');
        });

        await test.step('Should drag the ellipse annotation and update its params.', async () => {
            const annotation = page.locator('.highcharts-annotation').first();

            await annotation.click();
            await dragTo(annotation, [300, 100]);

            const ellipse = await getEllipse(page);
            expectClose((ellipse.x1 + ellipse.x2) / 2, 300, 5, 'Center of the ellipse should be close to the place where it was clicked.');
            expectClose((ellipse.y1 + ellipse.y2) / 2, 100, 5, 'Center of the ellipse should be close to the place where it was clicked.');
        });

        await test.step('Should change points positions when dragging control points.', async () => {
            const controlPoints = page.locator('.highcharts-control-points > *');

            await dragTo(controlPoints.first(), [850, 100]);
            await dragTo(controlPoints.nth(1), [800, 100]);
            await dragTo(controlPoints.last(), [825, 110]);

            await expect(page.locator('.highcharts-popup')).toBeVisible();

            const ellipse = await getEllipse(page);
            expectClose(ellipse.x1, 850, 1, 'New position of the first point should be equal to expected value.');
            expectClose(ellipse.y1, 100, 1, 'New position of the first point should be equal to expected value.');
            expectClose(ellipse.x2, 800, 1, 'New position of the second point should be equal to expected value.');
            expectClose(ellipse.y2, 101, 1, 'New position of the second point should be equal to expected value.');
            expectClose(ellipse.ry, 2.5, 1, 'New ry property value should be equal to expected value.');
        });

        await test.step('Ellipse should keep its shape after popup edit.', async () => {
            const popup = page.locator('.highcharts-popup');

            await popup.getByText('Edit').first().click();
            await popup.getByText('Save').first().click();

            expectClose((await getEllipse(page)).ry, 2.5, 1, 'Ry property shouldn\'t change after popup edit.');
        });
    });
});
