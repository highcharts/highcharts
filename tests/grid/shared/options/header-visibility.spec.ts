import { test, expect } from '~/fixtures.ts';

test.describe('Grid Header visibility', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-lite/basic/header-visibility');
    });

    test('Visibility of the table header should be toggled', async ({ page }) => {
        await page.locator('#toggle-header').click();
        await expect(page.locator('.hcg-table thead')).toBeHidden();
        await page.locator('#toggle-header').click();
        await expect(page.locator('.hcg-table thead')).toBeVisible();
    });
});

