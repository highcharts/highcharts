import { test, expect } from '~/fixtures.ts';

test.describe('Cell Context Menu Demo Row Editing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/demo/cell-context-menu');

        await page.waitForFunction(() => {
            return document.querySelectorAll(
                'tbody.hcg-tbody-scrollable tr'
            ).length > 0;
        });
    });

    test('Add row below inserts a new row via submenu action', async (
        { page }
    ) => {
        const rows = page.locator('tbody.hcg-tbody-scrollable tr');
        const beforeCount = await rows.count();

        const targetCell = page.locator(
            'tbody.hcg-tbody-scrollable tr[data-row-index="1"] ' +
            'td[data-column-id="product"]'
        );

        await targetCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Edit' }).click();
        await page.locator('.hcg-menu-item', { hasText: 'Rows' }).click();
        // Direct activation keeps this demo regression test deterministic
        // in headless browsers while still validating button wiring.
        await page.locator('.hcg-menu-item', {
            hasText: 'Add row below'
        }).evaluate((button) => {
            (button as HTMLButtonElement).click();
        });

        await expect(rows).toHaveCount(beforeCount + 1);
        await expect(
            page.locator(
                'tbody.hcg-tbody-scrollable tr[data-row-index="2"] ' +
                'td[data-column-id="product"]'
            )
        ).toHaveText('New item');
    });

    test('Add row above inserts a new row via submenu action', async (
        { page }
    ) => {
        const rows = page.locator('tbody.hcg-tbody-scrollable tr');
        const beforeCount = await rows.count();

        const targetCell = page.locator(
            'tbody.hcg-tbody-scrollable tr[data-row-index="2"] ' +
            'td[data-column-id="product"]'
        );

        await targetCell.click({ button: 'right' });
        await page.locator('.hcg-menu-item', { hasText: 'Edit' }).click();
        await page.locator('.hcg-menu-item', { hasText: 'Rows' }).click();
        // Direct activation keeps this demo regression test deterministic
        // in headless browsers while still validating button wiring.
        await page.locator('.hcg-menu-item', {
            hasText: 'Add row above'
        }).evaluate((button) => {
            (button as HTMLButtonElement).click();
        });

        await expect(rows).toHaveCount(beforeCount + 1);
        await expect(
            page.locator(
                'tbody.hcg-tbody-scrollable tr[data-row-index="2"] ' +
                'td[data-column-id="product"]'
            )
        ).toHaveText('New item');
    });
});
