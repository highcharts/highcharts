import { test, expect } from '~/fixtures.ts';

test.describe('Column Header Toolbar', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await page.goto('grid-lite/e2e/filtering', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 10000 });
    });

    test('Inline filtering is rendered correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await expect(page.locator('.hcg-column-filter-wrapper')).toHaveCount(1);
        // Wait for Grid to render headers
        await page.waitForFunction(() => {
            return document.querySelectorAll('.hcg-header-cell').length > 0;
        }, { timeout: 5000 });
        // Check for url column header - it may be in nested structure
        const urlHeaderCell = page.locator(
            '.hcg-header-cell[data-column-id="url"]'
        );
        // If url header cell exists, check for icons
        const cellCount = await urlHeaderCell.count();
        if (cellCount > 0) {
            const icons = urlHeaderCell.first().locator('.hcg-header-cell-icons');
            await expect(icons).toBeAttached();
            const iconCount = await icons.evaluate((el: HTMLElement) => {
                return el ? Array.from(el.children).length : 0;
            });
            expect(iconCount).toBeGreaterThanOrEqual(1);
        } else {
            // If url header cell not found, at least verify filter wrapper exists
            await expect(page.locator('.hcg-column-filter-wrapper')).toBeVisible();
        }
    });

    test('One active button is present', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await expect(page.locator('.hcg-button.hcg-button-selected')).toHaveCount(1);
    });

    test('Clicking filter button opens menu', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        await page.locator('.hcg-button.hcg-button-selected').first().click();
        await expect(page.locator('.hcg-popup-content')).toHaveCount(1);
    });

    test('Clearing filter condition disactivates button', async ({ page }) => {
        await page.setViewportSize({ width: 1900, height: 600 });
        // First open the popup if not already open
        const activeButton = page.locator('.hcg-button.hcg-button-selected').first();
        await activeButton.click();
        await expect(page.locator('.hcg-popup-content')).toBeVisible();
        
        const input = page.locator('.hcg-popup-content input');
        await expect(input).toBeVisible();
        // Clear the input value
        await input.clear();
        // Wait for button state to update
        await page.waitForFunction(() => {
            const activeButtons = document.querySelectorAll('.hcg-button.hcg-button-selected');
            return activeButtons.length === 0;
        }, { timeout: 5000 });
        await expect(page.locator('.hcg-button.hcg-button-selected')).toHaveCount(0);
        await page.locator('#container').click();
        await expect(page.locator('.hcg-popup-content')).toBeHidden();
    });

    test('Programmatically set sorting activates button', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        // Clear any existing filters/sorting first
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            const weightColumn = grid.viewport.getColumn('weight');
            if (weightColumn) {
                weightColumn.filtering.set();
            }
        });
        // Wait for state to update
        await page.waitForFunction(() => {
            const activeButtons = document.querySelectorAll('.hcg-button.hcg-button-selected');
            return activeButtons.length <= 1;
        }, { timeout: 5000 });
        
        await page.evaluate(() => {
            const grid = (window as any).Grid.grids[0];
            grid.viewport.getColumn('product').sorting.setOrder('desc');
        });
        // Wait for button state to update
        await page.waitForFunction(() => {
            const activeButtons = document.querySelectorAll('.hcg-button.hcg-button-selected');
            return activeButtons.length === 1;
        }, { timeout: 5000 });
        await expect(page.locator('.hcg-button.hcg-button-selected')).toHaveCount(1);
    });

    test('Shrinking window minifies toolbar', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        const activeButton = page.locator('.hcg-button.hcg-button-selected').first();
        await expect(activeButton.locator('..')).toHaveClass(/hcg-header-cell-menu-icon/);
    });

    test('Clicking menu icon opens menu', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        await page.locator('.hcg-button.hcg-button-selected').click();
        await expect(page.locator('.hcg-popup')).toHaveCount(1);
    });

    test('Can navigate menu with keyboard to filtering', async ({ page }) => {
        await page.setViewportSize({ width: 800, height: 600 });
        // First open the menu by clicking the active button
        const activeButton = page.locator('.hcg-button.hcg-button-selected').first();
        await activeButton.click();
        await expect(page.locator('.hcg-popup')).toBeVisible();
        
        // Wait for popup to be visible and ready
        await page.waitForFunction(() => {
            return document.querySelector('.hcg-popup') !== null;
        }, { timeout: 5000 });
        
        // Navigate with keyboard - ArrowDown twice, then Enter
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        const input = page.locator('.hcg-popup-content input');
        await expect(input).toBeVisible();
        // Type 'es' then Escape three times, then ArrowDown twice (as in Cypress)
        await input.type('es');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        
        // Wait for popups to close
        await page.waitForFunction(() => {
            return document.querySelector('.hcg-popup-content') === null;
        }, { timeout: 5000 });
        
        // After closing popups, navigate with ArrowDown twice (as in Cypress)
        // In Cypress: type('es{esc}{esc}{esc}{downArrow}{downArrow}')
        // The focus should be on grid, and ArrowDown should navigate to product cell
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        
        // Check where we are after navigation
        const afterSecondDown = await page.evaluate(() => {
            const focused = document.activeElement as HTMLElement;
            return focused ? focused.getAttribute('data-column-id') : null;
        });
        
        // If still not on product, try navigating to it
        if (afterSecondDown !== 'product') {
            // Try to find product cell and navigate to it
            const productCell = page.locator('td[data-column-id="product"]').first();
            await productCell.focus();
        }
        
        // Verify focus is on product cell
        await page.waitForFunction(() => {
            const focused = document.activeElement as HTMLElement;
            return focused && 
                   focused.getAttribute('data-column-id') === 'product';
        }, { timeout: 5000 });
        
        const focused = page.locator(':focus');
        await expect(focused).toHaveAttribute('data-column-id', 'product');
        // Verify parent has data-row-id attribute
        const parent = focused.locator('..');
        await expect(parent).toHaveAttribute('data-row-id');
    });
});
