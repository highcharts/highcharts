import { test, expect } from '~/fixtures.ts';

test.describe('Sorting and resizing wide grid', () => {
    test.beforeAll(async () => {
        // Setup
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/grid-lite/e2e/wide-grid');
    });

    test('scroll position should stay the same after sorting', async ({ page }) => {
        const rowsContent = page.locator('.hcg-rows-content-nowrap');
        await rowsContent.evaluate((el: HTMLElement) => {
            el.scrollLeft = el.scrollWidth;
        });
        await page.locator('.hcg-column-sortable').last().click();
        const scrollLeft = await rowsContent.evaluate(
            (el: HTMLElement) => el.scrollLeft
        );
        expect(scrollLeft).toBeGreaterThan(100);
    });

    test('resizing should be limited by the cell padding', async ({ page }) => {
        const resizer = page.locator('.hcg-column-resizer').last();
        const box = await resizer.boundingBox();
        if (box) {
            await page.mouse.move(
                box.x + box.width / 2,
                box.y + box.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(box.x + 100, box.y);
            await page.mouse.up();
        }
        const lastCell = page.locator('.hcg-row td').last();
        const width = await lastCell.evaluate(
            (el: HTMLElement) => el.offsetWidth
        );
        expect(width).toBeGreaterThan(27);
    });

    test(
        'column virtualization should render only the horizontal window',
        async ({ page }) => {
            await page.evaluate(async () => {
                const gridNamespace = (window as any).Grid;
                const container = document.getElementById('container');
                const columns: Record<string, number[]> = {};

                for (const grid of gridNamespace.grids) {
                    grid?.destroy();
                }

                if (!container) {
                    throw new Error('Missing grid container.');
                }

                container.innerHTML = '';
                container.style.width = '320px';
                container.style.height = '260px';

                for (let i = 0; i < 80; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 20 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).virtualColumnGrid = await gridNamespace.grid(
                    'container',
                    {
                        data: {
                            columns
                        },
                        columnDefaults: {
                            width: 80
                        },
                        rendering: {
                            columns: {
                                bufferSize: 1,
                                virtualization: true
                            },
                            rows: {
                                strictHeights: true,
                                virtualization: false
                            }
                        }
                    },
                    true
                );
            });

            const initial = await page.evaluate(() => {
                const viewport = (window as any).virtualColumnGrid.viewport;
                const firstRow = viewport.getRenderedRows()[0];

                return {
                    columnCount: viewport.columns.length,
                    renderedCount: viewport.getRenderedColumns().length,
                    firstRendered: viewport.columnsVirtualizer.columnCursor,
                    cellCount: firstRow.cells.length,
                    rowsWidth: viewport.rowsWidth,
                    scrollWidth: viewport.tbodyElement.scrollWidth
                };
            });

            expect(initial.columnCount).toBe(80);
            expect(initial.renderedCount).toBeLessThan(initial.columnCount);
            expect(initial.cellCount).toBe(initial.renderedCount);
            expect(initial.rowsWidth).toBeGreaterThan(6000);
            expect(initial.scrollWidth).toBeGreaterThan(6000);

            await page.evaluate(() => {
                const viewport = (window as any).virtualColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft =
                    viewport.tbodyElement.scrollWidth;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await page.waitForFunction(() => (
                (window as any).virtualColumnGrid
                    .viewport
                    .columnsVirtualizer
                    .columnCursor > 0
            ));

            const afterScroll = await page.evaluate(() => {
                const viewport = (window as any).virtualColumnGrid.viewport;
                const firstRow = viewport.getRenderedRows()[0];

                return {
                    renderedCount: viewport.getRenderedColumns().length,
                    firstRendered: viewport.columnsVirtualizer.columnCursor,
                    cellCount: firstRow.cells.length
                };
            });

            expect(afterScroll.firstRendered).toBeGreaterThan(0);
            expect(afterScroll.renderedCount).toBeLessThan(
                initial.columnCount
            );
            expect(afterScroll.cellCount).toBe(afterScroll.renderedCount);
        }
    );

    test(
        'strict column widths should initialize very wide grids',
        async ({ page }) => {
            await page.evaluate(async () => {
                const gridNamespace = (window as any).Grid;
                const container = document.getElementById('container');
                const columns: Record<string, number[]> = {};

                for (const grid of gridNamespace.grids) {
                    grid?.destroy();
                }

                if (!container) {
                    throw new Error('Missing grid container.');
                }

                container.innerHTML = '';
                container.style.width = '320px';
                container.style.height = '220px';

                for (let i = 0; i < 900; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 4 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).strictColumnGrid = await gridNamespace.grid(
                    'container',
                    {
                        data: {
                            columns
                        },
                        rendering: {
                            columns: {
                                strictWidths: true,
                                resizing: {
                                    enabled: true
                                },
                                virtualization: true
                            },
                            rows: {
                                strictHeights: true,
                                virtualization: false
                            }
                        }
                    },
                    true
                );
            });

            const state = await page.evaluate(() => {
                const viewport = (window as any).strictColumnGrid.viewport;
                const firstRow = viewport.getRenderedRows()[0];

                return {
                    hasColumnResizing: !!viewport.columnResizing,
                    hasColumnsResizer: !!viewport.columnsResizer,
                    columnCount: viewport.columns.length,
                    renderedCount: viewport.getRenderedColumns().length,
                    cellCount: firstRow.cells.length,
                    leftOffset: viewport.columnLayout.getColumnLeft(899),
                    offsetsLength: viewport.columnLayout.offsets.length,
                    resizerHandleCount:
                        document.querySelectorAll('.hcg-column-resizer')
                            .length,
                    rowsWidth: viewport.rowsWidth,
                    scrollWidth: viewport.tbodyElement.scrollWidth,
                    widthsLength: viewport.columnLayout.widths.length
                };
            });

            expect(state.columnCount).toBe(900);
            expect(state.hasColumnResizing).toBe(false);
            expect(state.hasColumnsResizer).toBe(false);
            expect(state.renderedCount).toBeLessThan(state.columnCount);
            expect(state.cellCount).toBe(state.renderedCount);
            expect(state.leftOffset).toBe(89900);
            expect(state.offsetsLength).toBe(0);
            expect(state.resizerHandleCount).toBe(0);
            expect(state.rowsWidth).toBe(90000);
            expect(state.scrollWidth).toBeGreaterThan(80000);
            expect(state.widthsLength).toBe(0);
        }
    );
});
