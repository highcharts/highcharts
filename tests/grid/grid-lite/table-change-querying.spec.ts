import { test, expect } from '~/fixtures.ts';

test.describe('Querying on table change', () => {
    test.beforeAll(async () => {
        // Setup if needed
    });

    test('Add a new row to the table', async ({ page }) => {
        await page.goto('/grid-lite/cypress/table-change-querying/');
        await page.locator('#add-row').click();
        await expect(page.locator('table tbody tr')).toHaveCount(5);
    });
});

