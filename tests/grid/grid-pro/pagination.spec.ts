import { test, expect } from '~/fixtures.ts';

test.describe('Pagination', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1200, height: 800 });
    });

    test.beforeAll(async () => {
        // Setup for all tests
    });

    test('beforePageChange / afterPageChange', async ({ page }) => {
        await page.goto('/grid-pro/cypress/pagination-events');

        // Click next page button
        await page.locator('.hcg-button[title="Next page"]').click();

        // Check event logging
        await expect(page.locator('#beforePageChange')).toHaveValue('1');
        await expect(page.locator('#afterPageChange')).toHaveValue('2');

        // Click previous button
        await page.locator('.hcg-button[title="Previous page"]').click();

        // Check event logging
        await expect(page.locator('#beforePageChange')).toHaveValue('2');
        await expect(page.locator('#afterPageChange')).toHaveValue('1');

        // Click on page number
        await page.locator('.hcg-pagination-nav-buttons-container .hcg-button').filter({ hasText: '3' }).click();

        // Check event logging
        await expect(page.locator('#beforePageChange')).toHaveValue('1');
        await expect(page.locator('#afterPageChange')).toHaveValue('3');
    });

    test('beforePageSizeChange / afterPageSizeChange', async ({ page }) => {
        await page.goto('/grid-pro/cypress/pagination-events');

        // Change page size to 20
        await page.locator('.hcg-pagination-page-size select.hcg-input').first().selectOption('20');

        // Check event logging
        await expect(page.locator('#beforePageSizeChange')).toHaveValue('22');
        await expect(page.locator('#afterPageSizeChange')).toHaveValue('20');
    });
});

