import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { testViewport } from '../../helpers.ts';

const csvURL = 'https://demo-live-data.highcharts.com/updating-set.csv';
const staticResponse = `X,Y
        0,1
        1,2
        2,3
        3,2
        4,3
        5,1
        6,5
        7,3
        8,1`;

/**
 * Mocks the CSV. The response waits for `release`, so the loading state can
 * be checked before the data arrives.
 */
async function mockCSV(page: Page): Promise<() => void> {
    let release = (): void => void 0;
    const released = new Promise<void>(resolve => {
        release = resolve;
    });

    await page.route(csvURL, async route => {
        await released;
        await route.fulfill({ status: 200, body: staticResponse });
    });

    return release;
}

test.use({ viewport: testViewport });

test.describe('Grid Component and data csvURL.', () => {
    test('Should render the Grid when data provided through csvURL.', async ({ page }) => {
        const release = await mockCSV(page);
        const response = page.waitForResponse(csvURL);

        release();
        await page.goto('/dashboards/cypress/component-grid-csv-url');

        await response;
        await expect(page.locator('.hcg-table')).toBeAttached();
    });

    test('Cells should display a loading indicator when loading connectors.', async ({ page }) => {
        const release = await mockCSV(page);
        const response = page.waitForResponse(csvURL);
        const cell = page.locator('#dashboard-col-1');
        const loading = /\bhighcharts-dashboards-cell-state-loading\b/;

        await page.goto('/dashboards/cypress/component-grid-csv-url');

        await expect(cell).toHaveClass(loading);
        release();
        await response;
        await expect(cell).not.toHaveClass(loading);
    });
});
