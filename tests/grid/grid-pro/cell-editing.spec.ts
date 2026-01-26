import { test, expect } from '~/fixtures.ts';

test.describe('Cell editing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/cypress/cell-after-edit/', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('View renderer cell edition should trigger afterEdit event', async ({ page }) => {
        await page.locator('tr[data-row-index="0"] > td[data-column-id="cbx"] > input').click();
        await expect(page.locator('#view-renderer')).toHaveValue('afterEdit');
    });

    test('Edit mode renderer cell edition should trigger afterEdit event', async ({ page }) => {
        const cell = page.locator('tr[data-row-index="0"] > td[data-column-id="price"]');
        await cell.dblclick();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.type('10');
        await page.keyboard.press('Enter');
        await expect(page.locator('#edit-mode-renderer')).toHaveValue('afterEdit');
    });
});

