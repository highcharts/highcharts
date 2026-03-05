import { test, expect } from '~/fixtures.ts';

test.describe('Custom sorting', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/custom-sorting');
    });

    test('Custom sorting defined in the default column options should be applied', async ({ page }) => {
        // Act
        await page.locator('th[data-column-id="weight"]').click();

        // Assert
        await expect(
            page.locator('td[data-column-id="weight"]').first(),
            'The custom sorting should be applied.'
        ).toHaveText('40.0 kg');
    });
});

