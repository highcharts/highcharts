import { test, expect } from '~/fixtures.ts';

test.describe('LocalDataProvider updateOnChange', () => {
    test('Auto refreshes after external DataTable changes', async ({ page }) => {
        await page.goto('/grid-lite/cypress/update-on-change/');

        const autoCell = page.locator(
            '#container-auto .hcg-row[data-row-index="0"] ' +
            '> td[data-column-id="weight"]'
        );
        const autoCount = page.locator('#auto-update-count');

        await page.locator('#auto-reset-counter').click();
        await expect(autoCount).toHaveValue('0');
        await expect(autoCell).toContainText('100');

        await page.locator('#auto-set-cell').click();

        await expect(autoCell).toContainText('123');
        await expect(autoCount).toHaveValue('1');
    });

    test('Manual refresh required when disabled', async ({ page }) => {
        await page.goto('/grid-lite/cypress/update-on-change/');

        const manualCell = page.locator(
            '#container-manual .hcg-row[data-row-index="0"] ' +
            '> td[data-column-id="weight"]'
        );
        const manualCount = page.locator('#manual-update-count');

        await page.locator('#manual-reset-counter').click();
        await expect(manualCount).toHaveValue('0');
        await expect(manualCell).toContainText('100');

        await page.locator('#manual-set-cell').click();
        await expect(manualCell).toContainText('100');

        await page.locator('#manual-update-rows').click();
        await expect(manualCell).toContainText('321');
        await expect(manualCount).toHaveValue('1');
    });

    test('Grid edits do not trigger extra updateRows', async ({ page }) => {
        await page.goto('/grid-lite/cypress/update-on-change/');

        const autoCell = page.locator(
            '#container-auto .hcg-row[data-row-index="0"] ' +
            '> td[data-column-id="weight"]'
        );
        const autoCount = page.locator('#auto-update-count');

        await page.locator('#auto-reset-counter').click();
        await expect(autoCount).toHaveValue('0');
        await page.locator('#auto-edit-cell').click();

        await expect(autoCell).toContainText('200');
        await expect(autoCount).toHaveValue('0');
    });
});
