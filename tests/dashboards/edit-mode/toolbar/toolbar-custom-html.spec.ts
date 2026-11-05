import { test, expect } from '~/fixtures.ts';
import { toggleEditMode } from '../../helpers.ts';

const cellToolbar = '.highcharts-dashboards-edit-menu.' +
    'highcharts-dashboards-edit-toolbar-cell';

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Toolbar when dashboard declared with custom HTML.', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/custom-html');
    });

    test('Only cell toolbar should be visible.', async ({ page }) => {
        await toggleEditMode(page);
        await page.locator('#dashboard-col-0').click();
        // Hidden toolbars are moved off-screen
        await expect(page.locator(cellToolbar)).toBeInViewport();
        await expect(page.locator(
            '.highcharts-dashboards-edit-menu.highcharts-dashboards-edit-toolbar-row'
        )).toHaveCount(0);
    });

    test('Only options should be visible.', async ({ page }) => {
        await toggleEditMode(page);
        await page.locator('#dashboard-col-0').click();
        await expect(page.locator(`${cellToolbar} > *`)).toHaveCount(1);
    });
});
