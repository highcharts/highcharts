import type { Page } from '@playwright/test';
import { devices } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage, waitForBoard } from './helpers.ts';

/**
 * Whether every chart container has the content width of its parent.
 */
function chartsFitParents(page: Page): Promise<boolean> {
    return page.locator('.highcharts-dashboards-component .chart-container')
        .evaluateAll(elements => {
            const width = (el: Element) => {
                const style = getComputedStyle(el);
                return el.getBoundingClientRect().width - [
                    'border-left-width',
                    'border-right-width',
                    'padding-left',
                    'padding-right'
                ].reduce(
                    (sum, prop) => sum +
                        parseFloat(style.getPropertyValue(prop)),
                    0
                );
            };

            return elements.length > 0 && elements.every(
                el => width(el) === width(el.parentElement)
            );
        });
}

async function expectTooltipSync(page: Page): Promise<void> {
    const lastChart = page.locator('.chart-container').last();

    await trigger(page.locator('.highcharts-point').first(), 'mouseover');

    // Second chart should now have a tooltip
    await expect(lastChart.locator('.highcharts-tooltip-box').first())
        .toBeAttached();

    // Move mouse away from the chart area
    await trigger(page.locator('.chart-container').first(), 'mousemove', {
        pageX: 500,
        pageY: 500
    });

    // Second chart should now not have a tooltip
    // (the container is there, but not visible)
    await expect(lastChart.locator('.highcharts-tooltip-box').first())
        .toBeHidden();
}

// The second group continues on the page the first one left
test.describe('Components in layout and synchronized charts', () => {
    const getPage = useSharedPage('/dashboards/cypress/chart-interaction/');

    test.describe('Components in layout', () => {
        test('should resize properly', async () => {
            const page = getPage();

            expect(await chartsFitParents(page)).toBe(true);

            // Change the viewport
            await page.setViewportSize(devices['iPad Mini'].viewport);

            // Sizes should be updated to fit the parent
            await expect.poll(() => chartsFitParents(page)).toBe(true);
        });

        test('components should reflow when width of board is changing', async () => {
            const page = getPage();

            await waitForBoard(page);
            const widths = await page.evaluate(() => {
                const board = (window as any).Dashboards.boards[0];
                const container = board.mountedComponents[0].cell.container;
                const initWidth = container.offsetWidth;

                board.container.style.width = '500px';

                return [initWidth, container.offsetWidth];
            });

            expect(widths[1], 'The width of cell is smaller than on init.')
                .toBeLessThan(widths[0]);
        });

        test('Context menu should reflow when width of board is changing', async () => {
            const page = getPage();
            const menuLeft = () => page
                .locator('.highcharts-dashboards-edit-context-menu')
                .evaluate(el => parseFloat(getComputedStyle(el).left));

            // click on context button
            await page.locator('.highcharts-dashboards-edit-context-menu-btn')
                .click();

            const left = await menuLeft();
            await page.evaluate(() => {
                (window as any).Dashboards.boards[0].container.style.width =
                    '1000px';
            });
            await page.setViewportSize({ width: 1280, height: 800 });
            // eslint-disable-next-line playwright/no-wait-for-timeout
            await page.waitForTimeout(200);

            expect(
                await menuLeft(),
                'The position of context menu has been updated.'
            ).toBeGreaterThan(left);
        });
    });

    test.describe('Chart synchronized series state', () => {
        test('should synchronize visible series between two charts sharing the same store', async () => {
            const page = getPage();
            const lastChartHidden = page.locator('.chart-container').last()
                .locator('.highcharts-legend-item-hidden');

            // There should be no hidden legend items
            await expect(page.locator('.highcharts-legend-item-hidden'))
                .toHaveCount(0);

            // Click the last legend item
            await page.locator('.highcharts-legend-item').last().click();

            // Second chart should now have a hidden legend item
            await expect(lastChartHidden.first()).toBeAttached();

            // Reset by click
            await page.locator('.highcharts-legend-item').last().click();

            await expect(lastChartHidden).toHaveCount(0);
        });

        test('should sync tooltip between two charts sharing the same connector', async () => {
            await expectTooltipSync(getPage());
        });

        test('should sync shared tooltip between two charts sharing the same connector', async () => {
            const page = getPage();

            await page.evaluate(() => {
                (window as any).Dashboards.boards[0].mountedComponents[1]
                    .component.chart.update({
                        tooltip: {
                            shared: true
                        }
                    });
            });

            await expectTooltipSync(page);
        });
    });
});

test.describe('Components in multiple layouts', () => {
    const getPage = useSharedPage('/dashboards/cypress/duplicated-ids');

    test('Components should be placed in different dashboards', async () => {
        const page = getPage();

        await page.waitForFunction(
            () => (window as any).Dashboards?.boards?.length === 2
        );
        expect(
            await page.evaluate(() => {
                const boards = (window as any).Dashboards.boards;
                return boards[0].mountedComponents.length ===
                    boards[1].mountedComponents.length;
            }),
            'Components are assigned to each dashboard.'
        ).toBe(true);

        for (const container of ['#container', '#container2']) {
            await expect(page.locator(
                `${container} #dashboard-col-0 ` +
                '.highcharts-dashboards-component-html-content'
            )).toBeAttached();
        }
    });
});
