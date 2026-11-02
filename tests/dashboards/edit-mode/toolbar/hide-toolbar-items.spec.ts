import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';
import { toggleEditMode } from '../../helpers.ts';

async function expectToolbar(
    page: Page,
    toolbar: 'cell' | 'row',
    visibleItems: number
): Promise<void> {
    const menu = page.locator(
        '.highcharts-dashboards-edit-menu.' +
        `highcharts-dashboards-edit-toolbar-${toolbar}`
    );

    // Hidden toolbars are moved off-screen
    await expect(menu).toBeInViewport();
    await expect(menu.locator('> *').filter({ visible: true }))
        .toHaveCount(visibleItems);
}

test.use({ viewport: { width: 1200, height: 1000 } });

test.describe('Toolbar when dashboard declared with custom HTML.', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/edit-mode/toolbars-options');
    });

    test('For the first cell, the toolbar should be visible with only one item.', async ({ page }) => {
        // Act
        await toggleEditMode(page);
        await page.locator('#dashboard-col-0').click();

        // Assert
        await expectToolbar(page, 'cell', 1);
        await expectToolbar(page, 'row', 1);
    });

    test('For the second cell, the toolbar should be visible with all items.', async ({ page }) => {
        // Act
        await toggleEditMode(page);
        await page.locator('#dashboard-col-1').click();

        // Assert
        await expectToolbar(page, 'cell', 4);
        await expectToolbar(page, 'row', 1);
    });
});
