import { test, expect } from '~/fixtures.ts';

test.describe('Grid sorting', () => {
    test.beforeAll(async ({ browser }) => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('grid-pro/cypress/sorting-options');
    });

    test('Grid should be sorted initially by price in ascending order', async ({ page }) => {
        await expect(page.locator('#select-column')).toHaveValue('price');
        await expect(page.locator('#select-order')).toHaveValue('asc');

        const priceData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.price;
        });
        expect(priceData, 'Price column should be sorted.').toEqual([1.5, 2.53, 4.5, 5]);

        await expect(page.locator('th[data-column-id="price"]')).toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Should be able to turn off sorting', async ({ page }) => {
        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();

        const priceData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.price;
        });
        expect(priceData, 'Weight column should be sorted.').toEqual([1.5, 2.53, 5, 4.5]);

        await expect(page.locator('th[data-column-id="price"]')).not.toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Clicking on the `icon` column header should do nothing', async ({ page }) => {
        await page.locator('#select-order').selectOption('');
        await page.locator('#apply-btn').click();
        await page.locator('th[data-column-id="icon"]').click();

        const priceData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.price;
        });

        expect(priceData, 'Weight column should be sorted.').toEqual([1.5, 2.53, 5, 4.5]);
    });

    test('Clicking two times on the `weight` column header should sort the table in descending order', async ({ page }) => {
        await page.locator('th[data-column-id="weight"]').click();
        await page.locator('th[data-column-id="weight"]').click();

        const result = await page.evaluate(() => {
            const grid = (window as any).grid;
            return {
                weightData: grid.presentationTable.columns.weight,
                order: grid.columnOptionsMap.weight.options.sorting.order
            };
        });
        expect(result.weightData, 'Weight column should be sorted.').toEqual([200, 100, 40, 0.5]);
        expect(result.order, 'Weight column sorting options should be updated.').toBe('desc');

        await expect(page.locator('th[data-column-id="weight"]')).toHaveClass(/hcg-column-sorted-desc/);
    });

    test('Sorting the `icon` column should be possible by the code', async ({ page }) => {
        await page.locator('#select-column').selectOption('icon');
        await page.locator('#select-order').selectOption('asc');
        await page.locator('#apply-btn').click();

        const metaData = await page.evaluate(() => {
            const grid = (window as any).grid;
            return grid.presentationTable.columns.metaData;
        });
        expect(metaData, 'Icon column should be sorted.').toEqual(['a', 'd', 'b', 'c']);

        await expect(page.locator('th[data-column-id="icon"]')).toHaveClass(/hcg-column-sorted-asc/);
    });

    test('Editing a cell in sorted column should resort the table', async ({ page }) => {
        await page.locator('th[data-column-id="weight"]').click();
        const cell = page.locator('tr[data-row-index="1"] td[data-column-id="weight"]');
        await cell.dblclick();
        await cell.locator('input').fill('40000');
        await page.keyboard.press('Enter');

        const result = await page.evaluate(() => {
            const grid = (window as any).grid;
            const { rows } = grid.viewport;
            const lastRow = rows[rows.length - 1];
            return {
                lastRowValue: lastRow.cells[0].value,
                weightData: grid.presentationTable.columns.weight
            };
        });

        expect(result.lastRowValue, 'Last rendered row should be `Pears`.').toBe('Pears');
        expect(result.weightData, 'Weight column should be sorted.').toEqual([0.5, 100, 200, 40000]);
    });
});

