import { test, expect } from '~/fixtures.ts';

test.describe('Remove the dashboard', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboards/cypress/grid-hidden', { waitUntil: 'networkidle' });
    });

    test('Rows should be visible when grid is switched from hidden', async ({ page }) => {
        // Wait for Grid to be initialized and demo.js to execute
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        // Act - click show button
        await page.locator('#show').click();

        // Wait for grid to render after show button click
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        // Assert - rows should be visible (4 data rows + 1 header row = 5 total)
        await expect(page.locator('tr')).toHaveCount(5);
    });

    test('Rows should have even and odd classes', async ({ page }) => {
        // Wait for Grid to be initialized and demo.js to execute
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });

        // Click show button to make grid visible
        await page.locator('#show').click();

        // Wait for grid to render
        await expect(page.locator('tbody tr')).toHaveCount(4, { timeout: 5000 });

        // Assert - rows should have alternating classes
        await expect(page.locator('tbody tr').first()).toHaveClass(/hcg-row-odd/);
        await expect(page.locator('tbody tr').nth(1)).toHaveClass(/hcg-row-even/);
    });
});

test.describe('Grid rows removal', () => {
    test.beforeAll(async () => {
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
    test.beforeAll(async () => {
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

