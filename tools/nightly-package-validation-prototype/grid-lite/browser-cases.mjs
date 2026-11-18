export const consumerStartedAttachment = 'consumer-check-started';

export const browserCases = [
    {
        id: 'Grid Lite renders styled rows and sorts a column',
        page: 'app/grid-lite.html',
        modules: [
            'es-modules/masters/grid-lite.src.js',
            'css/grid-lite.css'
        ],
        async check(page, expect) {
            const grid = page.locator('#grid');
            const rows = grid.locator('tbody tr');
            const fruitCells = grid.locator('tbody tr td:first-child');
            await expect(grid.locator('table')).toBeVisible();
            await expect(rows).toHaveCount(2);
            await expect(fruitCells).toHaveText(['Pear', 'Apple']);

            const tableLayout = await grid.locator('table').evaluate(element =>
                getComputedStyle(element).tableLayout
            );
            expect(tableLayout).toBe('fixed');

            await grid.getByRole('columnheader', { name: 'fruit' }).click();
            await expect(fruitCells).toHaveText(['Apple', 'Pear']);
        }
    }
];
