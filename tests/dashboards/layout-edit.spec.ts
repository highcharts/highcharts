import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { trigger, useSharedPage } from '~/helpers.ts';
import { toggleEditMode } from './helpers.ts';

/**
 * Returns the rows, or only the cells, that are larger than their parents,
 * comparing the content size with the parent's inner size, like jQuery's
 * `width()` and `innerWidth()`.
 */
function getOverflowing(page: Page, onlyCells = false): Promise<string[]> {
    return page.evaluate(onlyCells => {
        const size = (el: Element, inner: boolean) => {
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const px = (...props: string[]) => props.reduce(
                (sum, prop) => sum + parseFloat(style.getPropertyValue(prop)),
                0
            );
            const borders = px('border-left-width', 'border-right-width');
            const bordersY = px('border-top-width', 'border-bottom-width');
            const padding = inner ? 0 : px('padding-left', 'padding-right');
            const paddingY = inner ? 0 : px('padding-top', 'padding-bottom');

            return [
                rect.width - borders - padding,
                rect.height - bordersY - paddingY
            ];
        };
        const isOverflowing = (el: Element) => {
            const [width, height] = size(el, false);
            const [parentWidth, parentHeight] = size(el.parentElement, true);
            return width > parentWidth || height > parentHeight;
        };
        const elements = [
            ...(onlyCells ? [] : document.querySelectorAll(
                '.highcharts-dashboards-row'
            )),
            ...document.querySelectorAll('.highcharts-dashboards-cell')
        ];

        return elements.filter(isOverflowing).map(el => el.id || el.className);
    }, onlyCells);
}

async function expectRowsAndCellsWithinParents(page: Page): Promise<void> {
    // Wait a bit for the DOM to settle
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);
    expect(await getOverflowing(page)).toEqual([]);
}

test.describe('layout resize on window changes', () => {
    const getPage = useSharedPage('/dashboards/cypress/chart-interaction/');

    test('should resize rows and cells correctly on horizontal window changes', async () => {
        const page = getPage();

        for (const width of [1200, 600, 1200]) {
            await page.setViewportSize({ width, height: 1000 });
            await expectRowsAndCellsWithinParents(page);
        }
    });

    test('should resize rows and cells on vertical window changes', async () => {
        const page = getPage();

        for (const height of [500, 1000]) {
            await page.setViewportSize({ width: 1200, height });
            await expectRowsAndCellsWithinParents(page);
        }
    });

    test('should resize cells and components when dragging the handles', async () => {
        const page = getPage();
        const secondCell = page.locator('#dashboard-col-0');

        // Act
        await toggleEditMode(page);
        await secondCell.click();
        await trigger(
            page.locator('.highcharts-dashboards-edit-resize-snap-x').first(),
            'mousedown'
        );
        await trigger(secondCell, 'mousemove', { clientX: 600 });
        await trigger(secondCell, 'mouseup');

        // Assert
        expect(await getOverflowing(page, true)).toEqual([]);

        // Act
        await trigger(
            page.locator('.highcharts-dashboards-edit-resize-snap-y').first(),
            'mousedown'
        );
        await trigger(secondCell, 'mousemove', { clientY: 600 });
        await trigger(secondCell, 'mouseup');

        // Assert
        expect(await getOverflowing(page, true)).toEqual([]);
    });
});
