import { test, expect } from '~/fixtures.ts';

test.describe('Remove the dashboard', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/grid-hidden');
    });

    test('Rows should be visible when grid is switched from hidden', async ({ page }) => {
        // Act
        await page.locator('#show').click();

        // Assert
        await expect(page.locator('tr')).toHaveCount(5);
    });

    test('Rows should have even and odd classes', async ({ page }) => {
        await expect(page.locator('tbody tr').first()).toHaveClass(/hcg-row-odd/);
        await expect(page.locator('tbody tr').nth(1)).toHaveClass(/hcg-row-even/);
    });
});

test.describe('Grid rows removal', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/basic/destroy-grid');
    });

    test('Remove all grid rows', async ({ page }) => {
        await page.locator('#delete-rows-btn').click();
        // All grid rows should be removed.
        await expect(page.locator('tbody')).toBeEmpty();
    });
});

test.describe('Rendering size', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/cypress/rendering-size');
    });

    test('Fixed height grid', async ({ page }) => {
        const height = await page.locator('#container').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });

    test('Percentage height grid inside fixed container', async ({ page }) => {
        const height = await page.locator('#grid2').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });

    test('Max height inside fixed container', async ({ page }) => {
        const height = await page.locator('#grid3').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('180px');
    });

    test('Flex grow inside fixed flexbox', async ({ page }) => {
        const height = await page.locator('#grid4').evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).height;
        });
        expect(height).toBe('200px');
    });
});

