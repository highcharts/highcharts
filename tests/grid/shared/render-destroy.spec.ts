import { test, expect } from '~/fixtures.ts';

test.describe('Render and destroy grid', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/cypress/destroy-grid');
    });

    test('Destroy and re-render grid', async ({ page }) => {
        await page.locator('#destroy-grid-btn').click();
        await expect(page.locator('.hcg-container')).toBeHidden();
        await page.locator('#reload-btn').click();
        await expect(page.locator('.hcg-container')).toBeVisible();
    });

    test('Destroy ultimately and try to re-render grid', async ({ page }) => {
        await page.locator('#destroy-ultimately-btn').click();
        await expect(page.locator('.hcg-container')).toBeHidden();
        await page.locator('#reload-btn').click();
        await expect(page.locator('.hcg-container')).toBeHidden();
    });
});

