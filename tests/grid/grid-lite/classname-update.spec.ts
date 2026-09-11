import { test, expect } from '~/fixtures.ts';

test('Grid className-only update does not re-render viewport', async ({ page }) => {
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

    const result = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            data: {
                columns: {
                    product: ['Apples', 'Pears'],
                    weight: [100, 40]
                }
            },
            caption: {
                text: 'Inventory',
                className: 'caption-a'
            },
            description: {
                text: 'Sample rows',
                className: 'desc-a'
            },
            rendering: {
                table: {
                    className: 'table-a'
                }
            },
            pagination: {
                enabled: true,
                pageSize: 2,
                className: 'pag-a'
            }
        }, true);

        const tableBefore = grid.tableElement;
        const captionBefore = grid.captionElement;
        const paginationBefore = grid.pagination?.contentWrapper;

        await grid.update({
            caption: { className: 'caption-b' },
            description: { className: 'desc-b' },
            rendering: {
                table: { className: 'table-b' }
            },
            pagination: { className: 'pag-b' }
        });

        grid.viewport?.resizeObserver?.disconnect();

        return {
            tableUnchanged: grid.tableElement === tableBefore,
            captionUnchanged: grid.captionElement === captionBefore,
            paginationUnchanged:
                grid.pagination?.contentWrapper === paginationBefore,
            captionHasNew: grid.captionElement?.classList.contains('caption-b'),
            captionHasOld: grid.captionElement?.classList.contains('caption-a'),
            captionKeepsCore:
                grid.captionElement?.classList.contains('hcg-caption'),
            descriptionHasNew:
                grid.descriptionElement?.classList.contains('desc-b'),
            tableHasNew: grid.tableElement?.classList.contains('table-b'),
            tableKeepsCore: grid.tableElement?.classList.contains('hcg-table'),
            paginationHasNew:
                grid.pagination?.contentWrapper?.classList.contains('pag-b')
        };
    });

    expect(result?.tableUnchanged).toBe(true);
    expect(result?.captionUnchanged).toBe(true);
    expect(result?.paginationUnchanged).toBe(true);
    expect(result?.captionHasNew).toBe(true);
    expect(result?.captionHasOld).toBe(false);
    expect(result?.captionKeepsCore).toBe(true);
    expect(result?.descriptionHasNew).toBe(true);
    expect(result?.tableHasNew).toBe(true);
    expect(result?.tableKeepsCore).toBe(true);
    expect(result?.paginationHasNew).toBe(true);
});
