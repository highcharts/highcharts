import { test, expect } from '~/fixtures.ts';

test.describe('Grid events', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-lite/cypress/grouped-headers');
    });

    test('Renders multilevel header', async ({ page }) => {
        await expect(page.locator('table thead tr')).toHaveCount(3);
    });

    test('Hidden columns', async ({ page }) => {
        await expect(page.locator('table thead tr:nth-child(3) th')).toHaveCount(2);
        await page.evaluate(() => {
            (window as any).grid.update({
                columns: [{
                    id: 'icon',
                    enabled: false
                }]
            });
        });

        // Hidden column
        await expect(page.locator('table thead tr:nth-child(3) th')).toHaveCount(1);
        await expect(page.locator('th').filter({ hasText: 'price' })).toBeHidden();
        await expect(page.locator('th').filter({ hasText: 'url' })).toBeHidden();
    });

    test('All hidden columns in group, hide group header', async ({ page }) => {
        await page.evaluate(() => {
            (window as any).grid.update({
                columns: [{
                    id: 'url',
                    enabled: false
                }]
            });
        });

        // If all columns in group are hidden, hide the group.
        await expect(page.locator('table thead tr:nth-child(1) th')).toHaveCount(2);
        await expect(page.locator('table thead tr:nth-child(2) th')).toHaveCount(2);
        await expect(page.locator('table thead tr:nth-child(3) th')).toHaveCount(1);
    });

    test('Grouped headers should be not sortable', async ({ page }) => {
        // Click header that has direct reference to column
        const idHeader = page.locator('th[data-column-id="id"]');
        await idHeader.click();
        await expect(idHeader).toHaveClass(/hcg-column-sortable/);

        // Click header that group columns
        const productHeader = page.locator('th').filter({ hasText: 'Product' });
        await productHeader.click();
        await expect(productHeader).not.toHaveClass(/hcg-column-sortable/);
    });
});

