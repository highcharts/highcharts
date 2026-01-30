import { test, expect } from '~/fixtures.ts';

// Equivalent of test/typescript-karma/Grid/credits.test.js - credits test
test('Grid credits', async ({ page }) => {
    await page.setContent(`
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
    `, { waitUntil: 'networkidle' });

    const gridHandle = await page.evaluateHandle(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            }
        }, true);
        grid.viewport?.resizeObserver?.disconnect();

        return grid;
    });

    // Credits should be rendered in DOM (grid-lite has default credits)
    const creditsElement = page.locator('a.hcg-credits').first();
    await expect(creditsElement, 'Credits should be rendered in the DOM.').toBeVisible();

    // Credits should have default href
    await expect(creditsElement, 'Credits should have default href.')
        .toHaveAttribute('href', 'https://www.highcharts.com');

    // Credits are not configurable in grid-lite - try to disable via update
    await gridHandle.evaluate(async (grid: any) => {
        await grid?.update({
            credits: {
                enabled: false
            }
        });
        grid?.viewport?.resizeObserver?.disconnect();
    });

    // Credits should still be visible (not configurable in grid-lite)
    await expect(creditsElement, 'Credits should still be visible (not configurable in grid-lite).').toBeVisible();
});

