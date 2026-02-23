import { test, expect } from '~/fixtures.ts';

test.describe('Connector data', () => {
    test('Renders data from CSV connector', async ({ page }) => {
        await page.goto('/grid-lite/cypress/connector-data/');

        const productCell = page.locator(
            '.hcg-row[data-row-index="0"] > td[data-column-id="product"]'
        );
        const weightCell = page.locator(
            '.hcg-row[data-row-index="0"] > td[data-column-id="weight"]'
        );

        await expect(productCell).toContainText('Apples');
        await expect(weightCell).toContainText('100');
    });
});
