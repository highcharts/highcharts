import { test, expect } from '~/fixtures.ts';

test.describe('Column Header Toolbar', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await page.goto('grid-lite/cypress/filtering');
    });

    test('Inline filtering is rendered correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await expect(page.locator('.hcg-column-filter-wrapper')).toHaveCount(1);
        const icons = page.locator('.hcg-header-cell[data-column-id="url"] .hcg-header-cell-icons').first();
        const iconCount = await icons.locator('*').count();
        expect(iconCount).toBe(1);
    });

    test('One active button is present', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await expect(page.locator('.hcg-button.active')).toHaveCount(1);
    });

    test('Clicking filter button opens menu', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await page.locator('.hcg-button.active').first().click();
        await expect(page.locator('.hcg-popup-content')).toHaveCount(1);
    });

    test('Clearing filter condition disactivates button', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        const input = page.locator('.hcg-popup-content input');
        await input.press('Backspace');
        await input.press('Backspace');
        await input.press('Backspace');
        await input.press('Backspace');
        await expect(page.locator('.hcg-button.active')).toHaveCount(0);
        await page.locator('#container').click();
        await expect(page.locator('.hcg-popup-content')).toBeHidden();
    });

    test('Programmatically set sorting activates button', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.viewport.getColumn('product').sorting.setOrder('desc');
        });
        await expect(page.locator('.hcg-button.active')).toHaveCount(1);
    });

    test('Shrinking window minifies toolbar', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const activeButton = page.locator('.hcg-button.active').first();
        await expect(activeButton.locator('..')).toHaveClass(/hcg-header-cell-menu-icon/);
    });

    test('Clicking menu icon opens menu', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        await page.locator('.hcg-button.active').click();
        await expect(page.locator('.hcg-popup')).toHaveCount(1);
    });

    test('Can navigate menu with keyboard to filtering', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const popup = page.locator('.hcg-popup');
        await popup.press('ArrowDown');
        await popup.press('ArrowDown');
        await popup.press('Enter');
        const input = page.locator('.hcg-popup-content input');
        await expect(input).toBeVisible();
        await input.type('es');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        const focused = page.locator(':focus');
        await expect(focused).toHaveAttribute('data-column-id', 'product');
        await expect(focused.locator('..')).toHaveAttribute('data-row-id', '0');
    });
});

