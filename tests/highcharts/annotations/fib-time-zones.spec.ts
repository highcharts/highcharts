import { test, expect } from '~/fixtures.ts';
import {
    dispatchClick,
    expectClose,
    useSharedPage,
    waitForChart
} from '~/helpers.ts';
import { clickChart, dragTo } from '../helpers.ts';

test.describe('Stock Tools Fibonacci Time Zones, #15825', () => {
    const getPage = useSharedPage(
        '/highcharts/e2e/stock-tools-gui/',
        page => page.setViewportSize({ width: 1000, height: 500 })
    );

    test('Should create and drag the annotation.', async () => {
        const page = getPage();

        await test.step('Create annotation and check the shape\'s coordinates.', async () => {
            const firstClickPosition = 200,
                secondClickOffset = 4;

            await page.locator('.highcharts-fibonacci > *').nth(1).click();
            await page.locator('.highcharts-fibonacci-time-zones').click();

            await clickChart(page, [
                [firstClickPosition, 150],
                [firstClickPosition + secondClickOffset, 150]
            ], true);

            await waitForChart(page);
            const result = await page.evaluate(firstClickPosition => {
                const chart = Highcharts.charts[0] as any,
                    annotation = chart.annotations[0],
                    firstLinePlotX = annotation.points[0].plotX;

                return {
                    shapes: annotation.shapes.length,
                    firstX: annotation.points[0].x,
                    expectedFirstX: chart.xAxis[0].toValue(firstClickPosition),
                    firstLinePlotX,
                    distance: annotation.points[1].plotX - firstLinePlotX,
                    ninthLineX: +annotation.shapes[8].graphic.d.split(' ')[1],
                    plotLeft: chart.plotLeft
                };
            }, firstClickPosition);

            expect(result.shapes, '11 lines should be rendered.').toBe(11);
            expect(
                result.firstX,
                'The first line should be rendered where first mouse click.'
            ).toBe(result.expectedFirstX);
            expectClose(
                result.distance,
                secondClickOffset,
                0.00001,
                'The second mouse click offset should indicate the distance ' +
                'between the first two lines.'
            );

            const fibVal = 34;
            expectClose(
                result.ninthLineX,
                result.plotLeft + result.firstLinePlotX +
                    result.distance * fibVal,
                1,
                'The 9th line position should be correct.'
            );
        });

        await test.step('Dragging the whole annotation shape.', async () => {
            const line = page.locator(
                '.highcharts-annotation-shapes>path.highcharts-tracker-line'
            ).last();

            await dispatchClick(line);
            await dragTo(line, [100, 150], true);

            await waitForChart(page);
            expectClose(
                await page.evaluate(() => {
                    const chart = Highcharts.charts[0] as any;
                    return chart.annotations[0].points[0].plotX +
                        chart.plotLeft;
                }),
                100,
                1.01,
                'The line\'s position should be updated after dragging.'
            );
        });

        await test.step('Dragging the control point should drag the annotation too.', async () => {
            const controlPointNewX = 115;
            const linePosition = (index: number) => page.evaluate(
                index => +(Highcharts.charts[0] as any).annotations[0]
                    .shapes[index].graphic.d.split(' ')[1],
                index
            );

            // Get the current line's position.
            await waitForChart(page);
            const linePos = await linePosition(3);

            // Drag the annotation using the control point.
            await dragTo(
                page.locator('.highcharts-control-points > *').first(),
                [controlPointNewX, 200]
            );

            await expect(page.locator('.highcharts-popup')).toBeVisible();
            expect(
                await linePosition(3),
                'The annotation should change its position.'
            ).not.toBe(linePos);
            expectClose(
                await linePosition(1),
                controlPointNewX,
                1,
                'The second line should follow the control point\'s position.'
            );
        });
    });
});
