import { test, expect } from '~/fixtures.ts';

const gridLiteHtml = `
<!DOCTYPE html>
<html>
    <head>
        <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
        <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
    </head>
    <body>
        <div id="container"></div>
    </body>
</html>
`;

const MARKUP = '<a href="https://example.com">link</a>';

test.describe('Value escaping', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(gridLiteHtml, { waitUntil: 'networkidle' });
    });

    test('Raw cell values and column ids should be rendered as text', async ({ page }) => {
        await page.evaluate(async (markup) => {
            await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        [markup]: ['x'],
                        product: [markup]
                    }
                }
            }, true);
        }, MARKUP);

        const cell = page.locator('td[data-column-id="product"]');
        await expect(cell).toHaveText(MARKUP);
        await expect(cell.locator('a')).toHaveCount(0);

        // The markup column is the first one, its id cannot be used in a
        // CSS attribute selector.
        const header = page.locator('thead th').first();
        await expect(header).toHaveText(MARKUP);
        await expect(header.locator('a')).toHaveCount(0);
    });

    test('Cell format and header format should still render HTML', async ({ page }) => {
        await page.evaluate(async () => {
            await (window as any).Grid.grid('container', {
                data: {
                    columns: {
                        product: ['Apples']
                    }
                },
                columns: [{
                    id: 'product',
                    header: {
                        format: '<b>{id}</b>'
                    },
                    cells: {
                        format: '<i>{value}</i>'
                    }
                }]
            }, true);
        });

        await expect(
            page.locator('td[data-column-id="product"] i')
        ).toHaveText('Apples');
        await expect(
            page.locator('th[data-column-id="product"] b')
        ).toHaveText('product');
    });
});
