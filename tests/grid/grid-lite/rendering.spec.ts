import { test, expect } from '~/fixtures.ts';

test.describe('Rendering types and formatters', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/cypress/column-data-type', { waitUntil: 'networkidle' });
        // Wait for Grid table to be rendered (this also ensures Grid is initialized)
        await expect(page.locator('.hcg-table')).toBeVisible({ timeout: 10000 });
    });

    test('For column with dateType of datetime, formatted date should be displayed', async ({ page }) => {
        await expect(
            page.locator('tr[data-row-index="0"] td[data-column-id="date"]').first()
        ).toContainText('2023-01-01 00:00:00');
    });

    test('When formatter returns null, the cell should have custom className and values should be unchanged', async ({ page }) => {
        const cell = page.locator('td[data-column-id="booleans"]').first();
        await expect(cell).toHaveClass(/highlight_green/);
        await expect(cell).toHaveText('true');
    });

    test('When formatter returns empty string, the cell should have custom className and values should be empty', async ({ page }) => {
        const cell = page.locator('td[data-column-id="string"]').first();
        await expect(cell).toHaveClass(/highlight_green/);
        await expect(cell).toHaveText('');
    });

    test('Lang options should be used for number formatting', async ({ page }) => {
        await expect(page.locator('td[data-column-id="thousands"]').first()).toHaveText('12_452|4524');
        await expect(page.locator('td[data-column-id="thousands"]').nth(2)).toHaveText('1_234');
    });
});

