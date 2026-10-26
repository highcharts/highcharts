import { test, expect } from '~/fixtures.ts';

const pageContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <script src="https://code.highcharts.com/grid/grid-pro.js"></script>
            <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-pro.css"></link>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

test.describe('Cell renderer attributes', () => {
    test('View renderer filters the attributes option', async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'networkidle' });

        await page.evaluate(async () => {
            const grid = await (window as any).Grid.grid(
                document.getElementById('container'),
                {
                    data: {
                        columns: {
                            amount: [1, 2, 3]
                        }
                    },
                    columns: [{
                        id: 'amount',
                        dataType: 'number',
                        cells: {
                            renderer: {
                                type: 'numberInput',
                                attributes: {
                                    min: 0,
                                    title: 'Amount',
                                    onmouseover: 'window.xssFired = true;'
                                }
                            }
                        }
                    }]
                },
                true
            );
            grid.viewport?.resizeObserver?.disconnect();
        });

        const input = page.locator(
            'tr[data-row-index="0"] td[data-column-id="amount"] input'
        );

        await expect(input).toHaveAttribute('min', '0');
        await expect(input).toHaveAttribute('title', 'Amount');
        await expect(input).not.toHaveAttribute('onmouseover');

        await input.hover();
        expect(await page.evaluate(() => (window as any).xssFired))
            .toBeUndefined();
    });

    test('Edit mode renderer filters the attributes option', async ({ page }) => {
        await page.setContent(pageContent, { waitUntil: 'networkidle' });

        await page.evaluate(async () => {
            const grid = await (window as any).Grid.grid(
                document.getElementById('container'),
                {
                    data: {
                        columns: {
                            amount: [1, 2, 3]
                        }
                    },
                    columns: [{
                        id: 'amount',
                        dataType: 'number',
                        cells: {
                            editMode: {
                                enabled: true,
                                renderer: {
                                    type: 'numberInput',
                                    attributes: {
                                        step: 5,
                                        onfocus: 'window.xssFired = true;'
                                    }
                                }
                            }
                        }
                    }]
                },
                true
            );
            grid.viewport?.resizeObserver?.disconnect();
        });

        const cell = page.locator(
            'tr[data-row-index="0"] td[data-column-id="amount"]'
        );
        await cell.dblclick();

        const input = cell.locator('input');
        await expect(input).toHaveAttribute('step', '5');
        await expect(input).not.toHaveAttribute('onfocus');
        await expect(input).toBeFocused();

        expect(await page.evaluate(() => (window as any).xssFired))
            .toBeUndefined();
    });
});
