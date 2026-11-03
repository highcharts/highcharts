import { test, expect } from '~/fixtures.ts';
import { testViewport } from '~/helpers.ts';

test.use({ viewport: testViewport });

test.describe('Connector update', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/connector-update');
    });

    test('should be able to update the connector data', async ({ page }) => {
        await page.locator('#btn').click();
        await expect(page.locator(
            '.hcg-table tr[data-row-id="0"] td[data-column-id="Product Name"]'
        )).toHaveText('Fridge');
    });
});
