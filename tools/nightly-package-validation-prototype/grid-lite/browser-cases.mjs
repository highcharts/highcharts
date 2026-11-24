export const consumerStartedAttachment = 'consumer-check-started';

async function prepare(page) {
    // The credits CDN is external to the package checks.
    await page.route(/^https:\/\/assets\.highcharts\.com\/grid\/logo_(light|dark)(x2)?\.png$/u, route =>
        route.fulfill({
            contentType: 'image/png',
            body: Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=',
                'base64'
            )
        })
    );
}

export const browserCases = [
    {
        id: 'Grid Lite renders styled rows and sorts a column',
        page: 'app/grid-lite.html',
        modules: [
            'es-modules/masters/grid-lite.src.js',
            'css/grid-lite.css'
        ],
        prepare,
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
    },
    {
        id: 'Grid Lite React renders rows and updates from React props',
        page: 'app/grid-lite-react.html',
        modules: [],
        prepare,
        async check(page, expect) {
            const table = page.locator('#app table');
            const fruitCells = table.locator('tbody tr td:first-child');
            const quantityCells = table.locator('tbody tr td:nth-child(2)');
            await expect(table).toBeVisible();
            await expect(table).toHaveCSS('table-layout', 'fixed');
            await expect(fruitCells).toHaveText(['Pear', 'Apple']);
            await expect(quantityCells).toHaveText(['2', '5']);

            await page.getByRole('button', { name: 'Update inventory' }).click();
            await expect(fruitCells).toHaveText(['Pear', 'Apple', 'Peach']);
            await expect(quantityCells).toHaveText(['2', '7', '3']);
        }
    }
];
