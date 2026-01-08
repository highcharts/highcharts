import { test, expect } from '~/fixtures.ts';

test.describe('Cell class name formats', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/custom-class');
    });

    test('Table should have custom class name', async ({ page }) => {
        await expect(page.locator('.hcg-table')).toHaveClass(/custom-table-class-name/);
        await expect(page.locator('.hcg-table')).toHaveClass(/abc/);
    });

    test('Custom class name should be refreshed on setValue', async ({ page }) => {
        const cellA = page.locator('.hcg-row[data-row-index="1"] > td[data-column-id="weight"]');
        const cellB = page.locator('.hcg-row[data-row-index="3"] > td[data-column-id="weight"]');

        await expect(cellA).not.toHaveClass(/greater-than-100/);
        await expect(cellB).toHaveClass(/greater-than-100/);
        await expect(cellB).toHaveClass(/second-class/);

        await cellA.dblclick({ force: true });
        await cellA.locator('input').type('0');
        await page.keyboard.press('Enter');
        await expect(cellA).toHaveClass(/greater-than-100/);

        await cellB.dblclick({ force: true });
        await cellB.locator('input').clear();
        await cellB.locator('input').fill('10');
        await page.keyboard.press('Enter');
        await expect(cellB).not.toHaveClass(/greater-than-100/);
        await expect(cellB).not.toHaveClass(/second-class/);
    });

    test('Custom class name should be assigned to the header cells', async ({ page }) => {
        await expect(page.locator('.header-cell-custom-class-price')).toBeVisible();
    });
});

