import { test, expect } from '~/fixtures.ts';

test.describe('Row DOM order after adding rows', () => {
    test('should preserve correct row order after adding a row', async ({ page }) => {
        await page.goto('/grid-lite/e2e/row-order-after-add/');

        const rowsBefore = page.locator('table tbody tr');
        await expect(rowsBefore).toHaveCount(4);

        await page.locator('#add-row').click();

        const rowsAfter = page.locator('table tbody tr');
        await expect(rowsAfter).toHaveCount(5);

        // Verify that DOM order matches data order by checking
        // data-row-index attributes are sequential.
        const indices = await rowsAfter.evaluateAll(rows =>
            rows.map(row => Number(row.getAttribute('data-row-index')))
        );

        expect(indices).toEqual([0, 1, 2, 3, 4]);

        // Verify the cell content order reflects the dataTable order:
        // the new row (Oranges) should be the last data row.
        const firstColumnValues = await rowsAfter.evaluateAll(rows =>
            rows.map(row => {
                const cells = row.querySelectorAll('td');
                return cells[1]?.textContent?.trim();
            })
        );

        expect(firstColumnValues).toEqual([
            'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges'
        ]);
    });
});
