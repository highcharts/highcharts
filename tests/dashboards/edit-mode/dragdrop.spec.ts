import { test, expect } from '~/fixtures.ts';
import { toggleEditMode } from '../helpers.ts';

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Edit Mode options', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/edit-mode-options');
    });

    test('When disabling the dragDrop and resizer the menu should have only 3 items and resizer should not exist', async ({ page }) => {
        await toggleEditMode(page);
        await page.locator('#dashboard-col-0').click();
        await expect(page.locator('.highcharts-dashboards-edit-toolbar-cell > *'))
            .toHaveCount(3);
        await expect(page.locator('.highcharts-dashboards-edit-toolbar-row > *'))
            .toHaveCount(1);
        await expect(page.locator('.highcharts-dashboards-edit-resize-snap'))
            .toHaveCount(0);
    });
});
