import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { testViewport, trigger } from '~/helpers.ts';
import { waitForBoard } from '../helpers.ts';

async function getTooltipsHidden(page: Page): Promise<boolean[]> {
    await waitForBoard(page);
    return page.evaluate(() => {
        const board = (window as any).Dashboards.boards[0];
        return [2, 3].map(
            i => board.mountedComponents[i].component.chart.tooltip.isHidden
        );
    });
}

test.describe('Multiple dataTables sync', () => {
    test.use({ viewport: testViewport });

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/multiple-datatables');
    });

    test('Hovering over firs Grid should highlight the first chart', async ({ page }) => {
        await trigger(page.locator('#dashboard-col-0 tr.hcg-row').nth(0), 'mouseover');

        const [firstHidden, secondHidden] = await getTooltipsHidden(page);

        expect(
            firstHidden,
            'When hovering over first Grid, first chart should have tooltip.'
        ).toBeFalsy();
        expect(
            secondHidden,
            'When hovering over second Grid, second chart should have tooltip.'
        ).toBeTruthy();
    });

    test('Hovering over second Grid should highlight the second chart', async ({ page }) => {
        await trigger(page.locator('#dashboard-col-1 tr.hcg-row').nth(0), 'mouseover');

        const [firstHidden, secondHidden] = await getTooltipsHidden(page);

        expect(
            firstHidden,
            'When hovering over first Grid, first chart should have tooltip.'
        ).toBeTruthy();
        expect(
            secondHidden,
            'When hovering over second Grid, second chart should have tooltip.'
        ).toBeFalsy();
    });
});
