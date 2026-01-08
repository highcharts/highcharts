import { test, expect } from '~/fixtures.ts';

test.describe('Loading indicator', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/custom-class');
    });

    test('Loading indicator should be visible', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).grid;
            grid.showLoading('Loading test...');
        });

        await expect(page.locator('.hcg-loading-wrapper')).toBeVisible();
        await expect(page.locator('.hcg-loading-message')).toContainText('Loading test...');
    });

    test('Loading indicator should be hidden', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).grid;
            grid.hideLoading();
        });

        await expect(page.locator('.hcg-loading-wrapper')).toBeHidden();
    });

    test('Only one indicator should be visible at a time', async ({ page }) => {
        await page.evaluate(() => {
            const grid = (window as any).grid;
            grid.showLoading('Loading 1');
            grid.showLoading('Loading 2');
        });

        await expect(page.locator('.hcg-loading-wrapper')).toBeVisible();
        await expect(page.locator('.hcg-loading-message')).toContainText('Loading 1');
        await expect(page.locator('.hcg-loading-wrapper')).toHaveCount(1);
    });
});

