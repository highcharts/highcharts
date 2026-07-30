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
        'virtualized grouped headers should align lower levels',
        async ({ page }) => {
            const state = await page.evaluate(() => {
                const getRect = (el: Element | null): {
                    bottom: number;
                    height: number;
                    left: number;
                    right: number;
                    top: number;
                } => {
                    if (!el) {
                        throw new Error('Missing header element.');
                    }

                    const rect = el.getBoundingClientRect();

                    return {
                        bottom: rect.bottom,
                        height: rect.height,
                        left: rect.left,
                        right: rect.right,
                        top: rect.top
                    };
                };
                const headerRows = document.querySelectorAll('thead tr');
                const table = document.querySelector('.hcg-table');
                const employee = document.querySelector(
                    'th[data-column-id="employee"]'
                );
                const topCells = headerRows[0]?.querySelectorAll('th');
                const year = Array.from(topCells || []).find((cell): boolean =>
                    cell.textContent?.trim() === '2024'
                );

                return {
                    isVirtualized: table?.classList.contains(
                        'hcg-column-virtualization'
                    ) || false,
                    employee: getRect(employee),
                    employeeButton: getRect(employee?.querySelector(
                        '.hcg-header-cell-menu-icon button'
                    ) || null),
                    year: getRect(year || null),
                    month: getRect(headerRows[1]?.querySelector('th')),
                    firstLeaf: getRect(
                        headerRows[2]?.querySelector(
                            'th[data-column-id="mar24a"]'
                        )
                    )
                };
            });

            expect(state.isVirtualized).toBe(true);
            expect(state.month.left).toBeGreaterThanOrEqual(
                state.employee.right - 2
            );
            expect(Math.abs(state.month.left - state.year.left))
                .toBeLessThan(3);
            expect(Math.abs(state.firstLeaf.left - state.month.left))
                .toBeLessThan(3);
            expect(Math.abs(
                state.employee.height -
                    state.year.height -
                    state.month.height -
                    state.firstLeaf.height
            )).toBeLessThan(3);
            expect(Math.abs(state.employee.bottom - state.firstLeaf.bottom))
                .toBeLessThan(3);
            expect(Math.abs(
                state.employeeButton.top + state.employeeButton.height / 2 -
                    state.employee.top -
                    state.employee.height / 2
            )).toBeLessThan(3);

            const employeeHeader = page.locator(
                'th[data-column-id="employee"]'
            );
            const employeeMenuButton = employeeHeader.locator(
                '.hcg-header-cell-menu-icon button'
            );

            await employeeHeader.hover();
            await expect(employeeMenuButton).toBeVisible();
            await employeeMenuButton.click();
            await expect(page.locator('.hcg-popup')).toBeVisible();
        }
    );

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
                (window as any).keptHeaderCell = document.querySelector(
                    'th[data-column-id="Column 4"]'
                );
                const viewport = (window as any).virtualColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 160;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await page.waitForFunction(() => (
                (window as any).virtualColumnGrid
                    .viewport
                    .columnsVirtualizer
                    .columnCursor > 0
            ));

            const headerCellReused = await page.evaluate(() => (
                (window as any).keptHeaderCell === document.querySelector(
                    'th[data-column-id="Column 4"]'
                )
            ));

            expect(headerCellReused).toBe(true);

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
        'horizontal virtualization should keep body cell focus stable',
        async ({ page }) => {
            await page.evaluate(async () => {
                const gridNamespace = (window as any).Grid;
                const container = document.getElementById('container');
                const outsideButton = document.createElement('button');
                const columns: Record<string, number[]> = {};

                for (const grid of gridNamespace.grids) {
                    grid?.destroy();
                }

                if (!container) {
                    throw new Error('Missing grid container.');
                }

                outsideButton.id = 'outside-focus-target';
                outsideButton.textContent = 'Outside';
                document.body.appendChild(outsideButton);

                container.innerHTML = '';
                container.style.width = '320px';
                container.style.height = '220px';

                for (let i = 0; i < 80; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 20 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).focusColumnGrid = await gridNamespace.grid(
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

            const targetCell = page.locator(
                'tr[data-row-index="0"] td[data-column-id="Column 2"]'
            );
            const outsideButton = page.locator('#outside-focus-target');

            await targetCell.focus();
            await expect(targetCell).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any).focusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 160;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await page.waitForFunction(() => (
                (window as any).focusColumnGrid
                    .viewport
                    .columnsVirtualizer
                    .columnCursor > 0
            ));
            await expect(targetCell).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any).focusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft =
                    viewport.tbodyElement.scrollWidth;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetCell).toHaveCount(0);

            await page.evaluate(() => {
                const viewport = (window as any).focusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 0;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetCell).toBeVisible();
            await expect(targetCell).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any).focusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft =
                    viewport.tbodyElement.scrollWidth;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetCell).toHaveCount(0);
            await outsideButton.focus();
            await expect(outsideButton).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any).focusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 0;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetCell).toBeVisible();
            await expect(outsideButton).toBeFocused();
        }
    );

    test(
        'horizontal virtualization should keep header button focus stable',
        async ({ page }) => {
            await page.evaluate(async () => {
                const gridNamespace = (window as any).Grid;
                const container = document.getElementById('container');
                const outsideButton = document.createElement('button');
                const columns: Record<string, number[]> = {};

                for (const grid of gridNamespace.grids) {
                    grid?.destroy();
                }

                if (!container) {
                    throw new Error('Missing grid container.');
                }

                outsideButton.id = 'outside-header-focus-target';
                outsideButton.textContent = 'Outside';
                document.body.appendChild(outsideButton);

                container.innerHTML = '';
                container.style.width = '320px';
                container.style.height = '220px';

                for (let i = 0; i < 80; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 20 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).headerFocusColumnGrid =
                    await gridNamespace.grid(
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

            const targetHeader = page.locator(
                'th[data-column-id="Column 2"]'
            );
            const targetButton = targetHeader.locator(
                '.hcg-header-cell-menu-icon button'
            );
            const outsideButton = page.locator(
                '#outside-header-focus-target'
            );

            await targetHeader.hover();
            await expect(targetButton).toBeVisible();
            await targetButton.focus();
            await expect(targetButton).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any)
                    .headerFocusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 160;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await page.waitForFunction(() => (
                (window as any).headerFocusColumnGrid
                    .viewport
                    .columnsVirtualizer
                    .columnCursor > 0
            ));
            await expect(targetButton).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any)
                    .headerFocusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft =
                    viewport.tbodyElement.scrollWidth;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetHeader).toHaveCount(0);

            await page.evaluate(() => {
                const viewport = (window as any)
                    .headerFocusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 0;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetButton).toBeVisible();
            await expect(targetButton).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any)
                    .headerFocusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft =
                    viewport.tbodyElement.scrollWidth;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetHeader).toHaveCount(0);
            await outsideButton.focus();
            await expect(outsideButton).toBeFocused();

            await page.evaluate(() => {
                const viewport = (window as any)
                    .headerFocusColumnGrid.viewport;

                viewport.tbodyElement.scrollLeft = 0;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            await expect(targetButton).toBeVisible();
            await expect(outsideButton).toBeFocused();
        }
    );

    test(
        'keyboard navigation should reveal focused virtual columns',
        async ({ page }) => {
            await page.setViewportSize({ width: 360, height: 480 });
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

                document.body.style.width = '1200px';
                window.scrollTo(0, 0);
                container.innerHTML = '';
                container.style.width = '320px';
                container.style.height = '220px';

                for (let i = 0; i < 80; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 20 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).keyboardColumnGrid =
                    await gridNamespace.grid(
                        'container',
                        {
                            data: {
                                columns
                            },
                            columnDefaults: {
                                width: 120
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

            const getState = async (selector: string): Promise<{
                documentScrollLeft: number;
                left: number;
                right: number;
                scrollLeft: number;
                viewportLeft: number;
                viewportRight: number;
            }> => page.evaluate((selector) => {
                const viewport = (window as any).keyboardColumnGrid.viewport;
                const element = document.querySelector(selector);

                if (!element) {
                    throw new Error('Missing focused element.');
                }

                const rect = element.getBoundingClientRect();
                const viewportRect =
                    viewport.tbodyElement.getBoundingClientRect();

                return {
                    documentScrollLeft:
                        document.scrollingElement?.scrollLeft || 0,
                    left: rect.left,
                    right: rect.right,
                    scrollLeft: viewport.tbodyElement.scrollLeft,
                    viewportLeft: viewportRect.left,
                    viewportRight: viewportRect.right
                };
            }, selector);

            const bodyCell = page.locator(
                'tr[data-row-index="0"] td[data-column-id="Column 2"]'
            );
            const nextBodyCell = page.locator(
                'tr[data-row-index="0"] td[data-column-id="Column 3"]'
            );

            await bodyCell.focus();
            await page.keyboard.press('ArrowRight');
            await expect(nextBodyCell).toBeFocused();
            await page.waitForFunction(() => (
                (window as any).keyboardColumnGrid
                    .viewport
                    .tbodyElement
                    .scrollLeft > 0
            ));

            let state = await getState(
                'tr[data-row-index="0"] td[data-column-id="Column 3"]'
            );

            expect(state.scrollLeft).toBeGreaterThan(0);
            expect(state.left).toBeGreaterThanOrEqual(
                state.viewportLeft - 2
            );
            expect(state.right).toBeLessThanOrEqual(
                state.viewportRight + 2
            );

            await page.evaluate(() => {
                const viewport = (window as any).keyboardColumnGrid.viewport;

                window.scrollTo(0, 0);
                viewport.tbodyElement.scrollLeft = 0;
                viewport.tbodyElement.dispatchEvent(new Event('scroll'));
            });

            const headerCell = page.locator(
                'th[data-column-id="Column 2"]'
            );
            const nextHeaderCell = page.locator(
                'th[data-column-id="Column 3"]'
            );

            await expect(headerCell).toBeVisible();
            await headerCell.focus();
            await page.keyboard.press('ArrowRight');
            await expect(nextHeaderCell).toBeFocused();
            await page.waitForFunction(() => (
                (window as any).keyboardColumnGrid
                    .viewport
                    .tbodyElement
                    .scrollLeft > 0
            ));

            state = await getState('th[data-column-id="Column 3"]');

            expect(state.scrollLeft).toBeGreaterThan(0);
            expect(state.documentScrollLeft).toBe(0);
            expect(state.left).toBeGreaterThanOrEqual(
                state.viewportLeft - 2
            );
            expect(state.right).toBeLessThanOrEqual(
                state.viewportRight + 2
            );
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

    test(
        'wheel over header should scroll the grid',
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

                for (let i = 0; i < 80; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 80 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).headerWheelGrid = await gridNamespace.grid(
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

            const headerBox = await page
                .locator('th[data-column-id="Column 1"]')
                .boundingBox();

            expect(headerBox).not.toBeNull();

            await page.mouse.move(
                headerBox.x + headerBox.width / 2,
                headerBox.y + headerBox.height / 2
            );
            await page.mouse.wheel(320, 0);

            await page.waitForFunction(() => (
                (window as any).headerWheelGrid
                    .viewport
                    .tbodyElement
                    .scrollLeft > 0
            ));
            await page.mouse.wheel(0, 160);
            await page.waitForFunction(() => (
                (window as any).headerWheelGrid
                    .viewport
                    .tbodyElement
                    .scrollTop > 0
            ));
            await page.waitForFunction(() => (
                (window as any).headerWheelGrid
                    .viewport
                    .columnsVirtualizer
                    .columnCursor > 0
            ));

            const state = await page.evaluate(() => {
                const viewport = (window as any).headerWheelGrid.viewport;

                return {
                    columnCursor: viewport.columnsVirtualizer.columnCursor,
                    scrollLeft: viewport.tbodyElement.scrollLeft,
                    scrollTop: viewport.tbodyElement.scrollTop
                };
            });

            expect(state.scrollLeft).toBeGreaterThan(0);
            expect(state.scrollTop).toBeGreaterThan(0);
            expect(state.columnCursor).toBeGreaterThan(0);
        }
    );

    test(
        'columns without widths should keep the header aligned with the body',
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

                // No width options, so all columns fall back to the minimal
                // width, which cannot be smaller than the cell paddings.
                for (let i = 0; i < 400; ++i) {
                    columns['Column ' + i] = Array.from(
                        { length: 6 },
                        (_value, row): number => row + i
                    );
                }

                (window as any).autoWidthColumnGrid = await gridNamespace.grid(
                    'container',
                    {
                        data: {
                            columns
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

            const measure = async (
                scrollRatio: number
            ): Promise<{
                columnWidth: number;
                lastColumnRight: number;
                maxLeftDiff: number;
                maxWidthDiff: number;
                renderedCount: number;
                rowsWidth: number;
                scrollWidth: number;
                viewportRight: number;
            }> => {
                await page.evaluate((ratio) => {
                    const { tbodyElement } =
                        (window as any).autoWidthColumnGrid.viewport;

                    tbodyElement.scrollLeft = Math.round(
                        (tbodyElement.scrollWidth - tbodyElement.clientWidth) *
                            ratio
                    );
                    tbodyElement.dispatchEvent(new Event('scroll'));
                }, scrollRatio);

                // Wait until the column at the current scroll position is
                // rendered in both the header and the body.
                await page.waitForFunction(() => {
                    const { columnLayout, columns, tbodyElement } =
                        (window as any).autoWidthColumnGrid.viewport;
                    const [from] = columnLayout.getVisibleRange(
                        tbodyElement.scrollLeft,
                        tbodyElement.clientWidth
                    );
                    const columnId = columns[from].id;

                    return !!document.querySelector(
                        'thead tr th[data-column-id="' + columnId + '"]'
                    ) && !!document.querySelector(
                        'tbody tr td[data-column-id="' + columnId + '"]'
                    );
                });

                return page.evaluate(() => {
                    const viewport =
                        (window as any).autoWidthColumnGrid.viewport;
                    const headerCells = Array.from(
                        document.querySelectorAll('thead tr th')
                    );
                    const lastCell =
                        headerCells[headerCells.length - 1] as HTMLElement;
                    let maxLeftDiff = 0;
                    let maxWidthDiff = 0;

                    for (const headerCell of headerCells) {
                        const columnId =
                            headerCell.getAttribute('data-column-id');
                        const bodyCell = document.querySelector(
                            'tbody tr td[data-column-id="' + columnId + '"]'
                        );

                        if (!bodyCell) {
                            throw new Error('Missing body cell: ' + columnId);
                        }

                        const headerRect = headerCell.getBoundingClientRect();
                        const bodyRect = bodyCell.getBoundingClientRect();

                        maxLeftDiff = Math.max(
                            maxLeftDiff,
                            Math.abs(headerRect.left - bodyRect.left)
                        );
                        maxWidthDiff = Math.max(
                            maxWidthDiff,
                            Math.abs(headerRect.width - bodyRect.width)
                        );
                    }

                    return {
                        columnWidth: viewport.columnLayout.getColumnWidth(
                            viewport.columns[0]
                        ),
                        lastColumnRight: lastCell.getBoundingClientRect().right,
                        maxLeftDiff,
                        maxWidthDiff,
                        renderedCount: viewport.getRenderedColumns().length,
                        rowsWidth: viewport.rowsWidth,
                        scrollWidth: viewport.tbodyElement.scrollWidth,
                        viewportRight: viewport.tbodyElement
                            .getBoundingClientRect().right
                    };
                });
            };

            for (const scrollRatio of [0, 0.5, 1]) {
                const state = await measure(scrollRatio);

                expect(state.renderedCount).toBeLessThan(400);
                expect(state.maxLeftDiff).toBeLessThan(1.5);
                expect(state.maxWidthDiff).toBeLessThan(1.5);

                // The layout width must be renderable, so that the columns
                // fill the whole scrollable width. The last column has no
                // right border, so it is allowed to be slightly narrower.
                expect(Math.abs(state.rowsWidth - 400 * state.columnWidth))
                    .toBeLessThan(2);
                expect(Math.abs(state.scrollWidth - state.rowsWidth))
                    .toBeLessThan(2);

                if (scrollRatio === 1) {
                    // The last column must be reachable.
                    expect(state.lastColumnRight)
                        .toBeLessThanOrEqual(state.viewportRight + 1);
                    expect(state.lastColumnRight)
                        .toBeGreaterThan(state.viewportRight - 2);
                }
            }
        }
    );
});
