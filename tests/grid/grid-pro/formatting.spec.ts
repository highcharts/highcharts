import { test, expect } from '~/fixtures.ts';

test.describe('Formatting cells', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-pro/basic/cell-formatting', { waitUntil: 'networkidle' });
        // Wait for Grid to be initialized
        await page.waitForFunction(() => {
            return typeof (window as any).Grid !== 'undefined';
        }, { timeout: 10000 });
    });

    test('Head should be formatted', async ({ page }) => {
        await expect(page.locator('th').first()).toContainText('Date of purchase');
        await expect(page.locator('th').nth(1)).toContainText('product name');
    });

    test('Cells should be formatted', async ({ page }) => {
        const firstRow = page.locator('.hcg-row').first();
        await expect(firstRow.locator('td').first()).toContainText('Jan 01, 2022');
        await expect(firstRow.locator('td').nth(2)).toContainText('100.0 kg');
        await expect(firstRow.locator('td').nth(3)).toContainText('$ 1.50');
        await expect(firstRow.locator('td').nth(4).locator('a')).toContainText('Apples URL');

        await expect(firstRow.locator('td').nth(2)).toHaveAttribute('data-value', '100');
    });

    test('Cells without formatter should not be formatted', async ({ page }) => {
        await expect(page.locator('.hcg-row').first().locator('td').nth(1)).toContainText('Apples');
    });

    test('CSS class and style should be applied', async ({ page }) => {
        const cell = page.locator('.hcg-row').first().locator('td.custom-column-class-name');
        await expect(cell).toBeVisible();
        const color = await cell.evaluate((el: HTMLElement) => {
            return window.getComputedStyle(el).color;
        });
        // Check if color is red (rgb(255, 0, 0) or rgba equivalent)
        expect(color).toMatch(/rgb\(255,\s*0,\s*0\)|rgba\(255,\s*0,\s*0/);
    });

    test('The cell containing text should lose format when editing and gain back when not', async ({ page }) => {
        const cell = page.locator('.hcg-row').first().locator('td').nth(2);
        await cell.dblclick();
        const inputField = page.locator('.hcg-edited-cell input');
        await expect(inputField).toHaveValue('100');
        await inputField.clear();
        await inputField.fill('300');
        await page.locator('body').click();
        await expect(cell).toContainText('300.0 kg');
        await expect(cell).toHaveAttribute('data-value', '300');
    });

    test('The cell containing dates should lose format when editing and gain back when not', async ({ page }) => {
        const cell = page.locator('.hcg-row').first().locator('td').first();
        await cell.dblclick();
        const inputField = page.locator('.hcg-edited-cell input');
        await expect(inputField).toHaveValue('1640995200000');
        await inputField.clear();
        await inputField.fill('1641081600000');
        await page.locator('body').click();
        await expect(cell).toContainText('Jan 02, 2022');
    });

    test('The grid should adjust its width dynamically to the container width', async ({ page }) => {
        const table = page.locator('.hcg-table');
        await expect(table).toBeVisible();
        const initialWidth = await table.evaluate(
            (el: HTMLElement) => el.offsetWidth
        );

        await page.locator('#container').evaluate((el: HTMLElement) => {
            el.style.width = '200px';
        });

        // Wait for table to resize
        await page.waitForFunction((initialWidth) => {
            const table = document.querySelector('.hcg-table');
            return table && (table as HTMLElement).offsetWidth !== initialWidth;
        }, initialWidth, { timeout: 5000 });

        await expect(table).toBeVisible();
        const finalWidth = await table.evaluate(
            (el: HTMLElement) => el.offsetWidth
        );

        expect(
            finalWidth,
            'The width should change when resizing the container.'
        ).not.toBe(initialWidth);
        expect(
            finalWidth,
            'The width should be close to 200px.'
        ).toBeCloseTo(200, 0);
    });

    test('Default formatter is not applied when column has own format or formatter', async ({ page }) => {
        await expect(page.locator('.hcg-row').first().locator('td').first()).not.toContainText('Default');
        await expect(page.locator('.hcg-row').first().locator('td').nth(4)).not.toContainText('Default');
    });
});

