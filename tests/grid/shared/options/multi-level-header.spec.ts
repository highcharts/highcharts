import { test, expect } from '~/fixtures.ts';

test.describe('Grid events', () => {

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
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined' &&
                   (window as any).Grid.grids &&
                   (window as any).Grid.grids.length > 0;
        }, { timeout: 1000 });

        // Hide 'icon' column - this is the only column in "Product info" > "Meta" group
        // After hiding it, the entire "Product info" group should be hidden
        await page.evaluate(() => {
            (window as any).grid.update({
                columns: [{
                    id: 'icon',
                    enabled: false
                }]
            });
        });

        // Wait for update to complete - wait for header structure to change
        // After hiding 'icon', the "Product info" group should be hidden
        // because it only contains 'icon' column
        await page.waitForFunction(
            () => {
                const row1 = document.querySelector(
                    'table thead tr:nth-child(1)'
                );
                const row2 = document.querySelector(
                    'table thead tr:nth-child(2)'
                );
                const row3 = document.querySelector(
                    'table thead tr:nth-child(3)'
                );
                if (!row1 || !row2 || !row3) return false;
                const row1Count = row1.querySelectorAll('th').length;
                const row2Count = row2.querySelectorAll('th').length;
                const row3Count = row3.querySelectorAll('th').length;
                // After hiding icon, all rows should have fewer headers
                return row1Count === 2 && row2Count === 2 && row3Count === 1;
            },
            { timeout: 1000 }
        );

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

        // Click header that group columns - use getByRole for precise selection
        const productHeader = page.getByRole('columnheader', { name: 'Product', exact: true });
        await productHeader.click();
        await expect(productHeader).not.toHaveClass(/hcg-column-sortable/);
    });
});
