import type { Page } from '@playwright/test';

import { test, expect } from '~/fixtures.ts';

type GridColumnOptions = Record<string, unknown>;

type RenderGridOptions = {
    columns: GridColumnOptions[];
    containerWidth?: number;
    dataColumns?: Record<string, string[]>;
};

async function setupGridPage(
    page: Page,
    containerWidth: number
): Promise<void> {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css">
                <style>
                    body {
                        margin: 0;
                    }

                    #container {
                        width: ${containerWidth}px;
                    }
                </style>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    await page.waitForFunction(() => {
        return typeof (window as any).Grid !== 'undefined';
    });
}

async function renderGrid(
    page: Page,
    {
        columns,
        containerWidth = 600,
        dataColumns = {
            minLimited: ['A', 'B'],
            flexible: ['C', 'D'],
            maxLimited: ['E', 'F']
        }
    }: RenderGridOptions
): Promise<void> {
    await setupGridPage(page, containerWidth);

    await page.evaluate(async ({ columns, dataColumns }) => {
        const container = document.getElementById('container');

        if (!(container instanceof HTMLElement)) {
            throw new Error('Grid container not found');
        }

        const grid = await (window as any).Grid.grid(container, {
            data: {
                columns: dataColumns
            },
            columns,
            rendering: {
                rows: {
                    minVisibleRows: 2
                }
            }
        });

        grid.viewport?.resizeObserver?.disconnect();
        (window as any).testGrid = grid;
    }, { columns, dataColumns });

    await page.waitForFunction(() => {
        const grid = (window as any).testGrid;

        return !!(
            grid?.viewport?.columns?.length &&
            grid.viewport.tbodyElement?.clientWidth
        );
    });
}

async function getColumnWidth(
    page: Page,
    columnId: string
): Promise<number> {
    return page.evaluate((id) => {
        const grid = (window as any).testGrid;
        return grid.viewport.getColumn(id).getWidth();
    }, columnId);
}

async function getTableBodyWidth(page: Page): Promise<number> {
    return page.evaluate(() => {
        const grid = (window as any).testGrid;
        return grid.viewport.tbodyElement.clientWidth;
    });
}

async function dragColumnResizer(
    page: Page,
    columnId: string,
    targetColumnId: string,
    diffX: number
): Promise<void> {
    const resizer = page.locator(
        `th[data-column-id="${columnId}"] .hcg-column-resizer`
    ).first();

    await expect(resizer).toBeVisible();

    const box = await resizer.boundingBox();

    if (!box) {
        throw new Error(`Column resizer not found for ${columnId}`);
    }

    const initialWidth = await getColumnWidth(page, targetColumnId);
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = Math.max(1, startX + diffX);

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, startY);
    await page.mouse.up();

    await page.waitForFunction(
        ({ id, previousWidth }) => {
            const grid = (window as any).testGrid;
            const width = grid.viewport.getColumn(id).getWidth();

            return Math.abs(width - previousWidth) > 0.5;
        },
        {
            id: targetColumnId,
            previousWidth: initialWidth
        }
    );
}

test.describe('Grid column width limits', () => {
    test('Initial render should respect pixel minWidth and maxWidth', async ({
        page
    }) => {
        await renderGrid(page, {
            columns: [{
                id: 'minLimited',
                width: '10%',
                minWidth: 160
            }, {
                id: 'flexible'
            }, {
                id: 'maxLimited',
                width: '60%',
                maxWidth: 180
            }]
        });

        const minWidth = await getColumnWidth(page, 'minLimited');
        const maxWidth = await getColumnWidth(page, 'maxLimited');

        expect(Math.abs(minWidth - 160)).toBeLessThanOrEqual(1.5);
        expect(Math.abs(maxWidth - 180)).toBeLessThanOrEqual(1.5);
    });

    test('Updating minWidth and maxWidth should reflow column widths', async ({
        page
    }) => {
        await renderGrid(page, {
            columns: [{
                id: 'minLimited',
                width: '10%'
            }, {
                id: 'flexible'
            }, {
                id: 'maxLimited',
                width: '60%'
            }]
        });

        const initialMinWidth = await getColumnWidth(page, 'minLimited');
        const initialMaxWidth = await getColumnWidth(page, 'maxLimited');

        expect(initialMinWidth).toBeLessThan(100);
        expect(initialMaxWidth).toBeGreaterThan(250);

        await page.evaluate(async () => {
            const grid = (window as any).testGrid;

            await grid.updateColumn('minLimited', {
                minWidth: 160
            });
            await grid.updateColumn('maxLimited', {
                maxWidth: 180
            });
        });

        const updatedMinWidth = await getColumnWidth(page, 'minLimited');
        const updatedMaxWidth = await getColumnWidth(page, 'maxLimited');

        expect(Math.abs(updatedMinWidth - 160)).toBeLessThanOrEqual(1.5);
        expect(Math.abs(updatedMaxWidth - 180)).toBeLessThanOrEqual(1.5);
    });

    test('Percentage minWidth and maxWidth should resolve against table width', async ({
        page
    }) => {
        await renderGrid(page, {
            containerWidth: 640,
            columns: [{
                id: 'minLimited',
                width: '10%',
                minWidth: '25%'
            }, {
                id: 'flexible'
            }, {
                id: 'maxLimited',
                width: '60%',
                maxWidth: '30%'
            }]
        });

        const tableBodyWidth = await getTableBodyWidth(page);
        const minWidth = await getColumnWidth(page, 'minLimited');
        const maxWidth = await getColumnWidth(page, 'maxLimited');

        expect(Math.abs(minWidth - tableBodyWidth * 0.25))
            .toBeLessThanOrEqual(2);
        expect(Math.abs(maxWidth - tableBodyWidth * 0.30))
            .toBeLessThanOrEqual(2);
    });

    test('Drag resizing should stop at configured minWidth and maxWidth', async ({
        page
    }) => {
        await renderGrid(page, {
            columns: [{
                id: 'minLimited',
                width: 220,
                minWidth: 160
            }, {
                id: 'flexible',
                width: 200
            }, {
                id: 'maxLimited',
                width: 120,
                maxWidth: 180
            }]
        });

        await dragColumnResizer(page, 'minLimited', 'minLimited', -140);
        expect(
            Math.abs((await getColumnWidth(page, 'minLimited')) - 160)
        ).toBeLessThanOrEqual(1.5);

        await dragColumnResizer(page, 'flexible', 'maxLimited', -140);
        expect(
            Math.abs((await getColumnWidth(page, 'maxLimited')) - 180)
        ).toBeLessThanOrEqual(1.5);
    });
});
