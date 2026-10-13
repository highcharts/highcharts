import { test, expect } from '~/fixtures.ts';

test.describe('Render and destroy grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/destroy-grid');
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

test.describe('Destroy registry', () => {
    test('Repeated destroy should not remove another live grid', async ({
        page
    }) => {
        await page.goto('/grid-lite/basic/destroy-registry');

        await page.locator('#destroy-btn').click();
        await page.locator('#destroy-btn').click();

        const ids = await page.evaluate(() =>
            (window as any).Grid.grids.map(
                (grid: { id?: string }) => grid?.id
            )
        );

        expect(ids).toEqual(['second']);
    });
});
