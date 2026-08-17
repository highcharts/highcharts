import { describe, it } from 'node:test';
import { deepStrictEqual, ok, strictEqual } from 'node:assert';

import { mockObservers, setupDOM } from '../../../../test-utils';

function installGridDOMGlobals(
    win: any,
    doc: Document
): void {
    const requestAnimationFrame = (
        callback: FrameRequestCallback
    ): number => {
        callback(0);
        return 0;
    };

    global.window = win;
    global.document = doc;
    global.Element = win.Element;
    global.HTMLTableCellElement = win.HTMLTableCellElement;
    global.HTMLTableRowElement = win.HTMLTableRowElement;
    global.ResizeObserver = win.ResizeObserver;
    global.requestAnimationFrame = requestAnimationFrame;
    global.cancelAnimationFrame = (): void => {};
    win.requestAnimationFrame = requestAnimationFrame;
    win.cancelAnimationFrame = (): void => {};
}

function loadGridPro() {
    return import('../../../../../../ts/masters-grid/grid-pro.src.js');
}

function summaryRowObjects(grid: any): any[] {
    return grid.summaryRows.getRowObjects();
}

describe('SummaryRowsController', () => {
    it('should compute a summary row aggregating the whole table', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    name: ['a', 'b', 'c'],
                    sales: [10, 20, 30],
                    margin: [1, 2, 6]
                }
            },
            summaryRows: {
                columns: [
                    { id: 'name', value: 'Total' },
                    { id: 'sales', aggregator: 'SUM' },
                    { id: 'margin', aggregator: 'AVERAGE' }
                ]
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        deepStrictEqual(
            summaryRowObjects(grid),
            [{ name: 'Total', sales: 60, margin: 3 }],
            'Should compute SUM, AVERAGE and the static value.'
        );

        strictEqual(
            (grid as any).viewport.summaryView.bottom.tbodyElement
                .querySelectorAll('tr').length,
            1,
            'The summary section should render one row.'
        );
    });

    it('should apply the row aggregator default and let value suppress it',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        region: ['a', 'b', 'c'],
                        q1: [10, 20, 30],
                        q2: [1, 2, 3]
                    }
                },
                summaryRows: [{
                    aggregator: 'SUM',
                    columns: [
                        { id: 'region', value: 'Total' }
                    ]
                }, {
                    aggregator: 'SUM'
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            deepStrictEqual(
                summaryRowObjects(grid),
                [
                    { region: 'Total', q1: 60, q2: 6 },
                    { region: 0, q1: 60, q2: 6 }
                ],
                'The row aggregator should sum q1/q2; value suppresses it.'
            );

            // The second row has no static value, so the numeric aggregator
            // reaches the text column and resolves to 0. The cell must still
            // hand a string to the column's formatters.
            const cells = (grid as any).viewport.summaryView.bottom.rows[1]
                .cells;
            const regionCell = cells.find(
                (cell: any): boolean => cell.column.id === 'region'
            );

            strictEqual(
                regionCell.column.dataType, 'string',
                'The region column is a text column.'
            );
            strictEqual(
                regionCell.value, '0',
                'An aggregated value conforms to the column dataType.'
            );
        });

    it('should compute multiple summary rows with per-row aggregators',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30]
                    }
                },
                summaryRows: [{
                    id: 'total',
                    aggregator: 'SUM',
                    columns: [{ id: 'name', value: 'Total' }]
                }, {
                    id: 'average',
                    aggregator: 'AVERAGE',
                    columns: [{ id: 'name', value: 'Average' }]
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            deepStrictEqual(
                summaryRowObjects(grid),
                [
                    { name: 'Total', sales: 60 },
                    { name: 'Average', sales: 20 }
                ],
                'Should compute a SUM row then an AVERAGE row.'
            );

            strictEqual(
                (grid as any).viewport.summaryView.bottom.tbodyElement
                    .querySelectorAll('tr').length,
                2,
                'The summary section should render both rows.'
            );
        });

    it('should stick a summary row to the top when configured',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30]
                    }
                },
                summaryRows: [{
                    id: 'top-total',
                    position: 'top',
                    columns: [{ id: 'sales', aggregator: 'SUM' }]
                }, {
                    id: 'bottom-total',
                    columns: [{ id: 'sales', aggregator: 'SUM' }]
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const view = (grid as any).viewport.summaryView;

            strictEqual(
                view.top.rows.length, 1,
                'The top-positioned row renders in the top section.'
            );
            strictEqual(
                view.bottom.rows.length, 1,
                'The default row renders in the bottom section.'
            );
            strictEqual(
                view.top.tbodyElement.classList
                    .contains('hcg-tbody-summary-top'),
                true,
                'The top tbody carries the top modifier class.'
            );
        });

    it('should render unaggregated cells empty, not fetched from data',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30],
                        note: [111, 222, 333]
                    }
                },
                summaryRows: {
                    columns: [{ id: 'sales', aggregator: 'SUM' }]
                },
                columns: [{
                    id: 'note',
                    cells: { format: '${value:,0f}' }
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const cells = (grid as any).viewport.summaryView.bottom.rows[0].cells;
            const byId: Record<string, unknown> = {};
            for (const cell of cells) {
                byId[cell.column.id] = cell.value;
            }

            strictEqual(byId.name, '', 'Unaggregated text cell renders empty.');
            strictEqual(
                byId.note, '',
                'Unaggregated cell is empty, not fetched from data (not 111).'
            );
            strictEqual(byId.sales, 60, 'Aggregated cell holds the SUM.');
        });

    it('should carry a per-cell format override alongside the value',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30],
                        margin: [1, 2, 6]
                    }
                },
                summaryRows: [{
                    columns: [
                        { id: 'name', value: 'Total' },
                        {
                            id: 'sales',
                            aggregator: 'SUM',
                            format: '${value:,0f}'
                        },
                        { id: 'margin', aggregator: 'SUM' }
                    ]
                }, {
                    aggregator: 'SUM',
                    format: '{value} pln',
                    columns: [
                        { id: 'sales', format: '${value:,0f}' }
                    ]
                }],
                columnDefaults: {
                    cells: { format: '{value} usd' }
                },
                columns: [{
                    id: 'margin',
                    cells: { format: '{value} eur' }
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const rows = (grid as any).summaryRows.getRows();

            strictEqual(
                rows[0].data.sales, 60,
                'The value is the aggregated result.'
            );
            strictEqual(
                rows[0].formats.sales, '${value:,0f}',
                'The per-cell format is carried for the aggregated cell.'
            );
            strictEqual(
                rows[0].formats.name, void 0,
                'Columns without a format carry none.'
            );

            strictEqual(
                rows[1].formats.margin, '{value} pln',
                'The row format is the default for every cell of the row.'
            );
            strictEqual(
                rows[1].formats.sales, '${value:,0f}',
                'A per-cell format overrides the row format.'
            );

            // Plain text content lands in `innerText`, which jsdom stores as a
            // property instead of reflecting it into the DOM.
            const renderedOf = (rowIndex: number): Record<string, string> => {
                const rendered: Record<string, string> = {};
                for (
                    const cell of (grid as any).viewport.summaryView.bottom
                        .rows[rowIndex].cells
                ) {
                    rendered[cell.column.id] = cell.htmlElement.innerText;
                }

                return rendered;
            };
            const rendered = renderedOf(0);

            strictEqual(
                rendered.sales, '$60',
                'The summary format wins over the column cells format.'
            );
            strictEqual(
                rendered.margin, '9 eur',
                'Without a summary format, columns[].cells.format is used.'
            );
            strictEqual(
                rendered.name, 'Total usd',
                'columnDefaults.cells.format applies where the column has none.'
            );

            const renderedRowFormat = renderedOf(1);

            strictEqual(
                renderedRowFormat.margin, '9 pln',
                'The row format replaces the column cells format.'
            );
            strictEqual(
                renderedRowFormat.sales, '$60',
                'The per-cell format still wins over the row format.'
            );
            strictEqual(
                renderedRowFormat.name, '0 pln',
                'The row format reaches the text column as well.'
            );
        });

    it('should expose an a11y role description and keep the row index',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30]
                    }
                },
                summaryRows: {
                    columns: [{ id: 'sales', aggregator: 'SUM' }]
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const rowElement =
                (grid as any).viewport.summaryView.bottom.rows[0].htmlElement;

            strictEqual(
                rowElement.getAttribute('aria-roledescription'),
                'Summary row.',
                'Summary row should carry the localized role description.'
            );
            ok(
                rowElement.getAttribute('aria-rowindex') !== null,
                'Summary row must keep its aria-rowindex (not stripped).'
            );
        });

    it('should report which columns aggregate for edit-driven recompute',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30]
                    }
                },
                summaryRows: {
                    columns: [
                        { id: 'name', value: 'Total' },
                        { id: 'sales', aggregator: 'SUM' }
                    ]
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const controller = (grid as any).summaryRows;
            strictEqual(
                controller.hasColumnAggregator('sales'),
                true,
                'An aggregated column must be flagged for recompute.'
            );
            strictEqual(
                controller.hasColumnAggregator('name'),
                false,
                'A static-value column must not trigger recompute.'
            );
        });

    it('should recompute the totals after the data changes', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    name: ['a', 'b', 'c'],
                    sales: [10, 20, 30]
                }
            },
            summaryRows: {
                columns: [{ id: 'sales', aggregator: 'SUM' }]
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            summaryRowObjects(grid)[0].sales,
            60,
            'Initial SUM should aggregate the original data.'
        );

        await grid.update({
            data: {
                columns: {
                    name: ['a', 'b', 'c'],
                    sales: [1, 2, 3]
                }
            }
        });

        strictEqual(
            summaryRowObjects(grid)[0].sales,
            6,
            'The SUM must recompute after the data changes.'
        );
    });

    it('should compute no summary rows when disabled', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    name: ['a', 'b', 'c'],
                    sales: [10, 20, 30]
                }
            },
            summaryRows: {
                enabled: false,
                columns: [{ id: 'sales', aggregator: 'SUM' }]
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        ok(
            summaryRowObjects(grid).length === 0,
            'Disabled summary must compute no rows.'
        );
    });

    it('should render a row with static values even when nothing aggregates',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        name: ['a', 'b', 'c'],
                        sales: [10, 20, 30]
                    }
                },
                summaryRows: {
                    columns: [{ id: 'name', value: 'Total' }]
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            deepStrictEqual(
                summaryRowObjects(grid),
                [{ name: 'Total', sales: null }],
                'A row without aggregation still renders its static values.'
            );

            strictEqual(
                (grid as any).viewport.summaryView.bottom.tbodyElement
                    .querySelectorAll('tr').length,
                1,
                'The empty/static summary row should still render.'
            );
        });

    it('should aggregate the rows behind a TreeView projection, once',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        id: [1, 2, 3, 4],
                        parentId: [null, 1, 1, null],
                        name: ['Parent', 'ChildA', 'ChildB', 'Solo'],
                        sales: [null, 10, 20, 5]
                    },
                    idColumn: 'id'
                },
                treeView: {
                    enabled: true,
                    treeColumn: 'name'
                },
                rendering: {
                    rows: {
                        expandedLevels: 'all'
                    }
                },
                columns: [{ id: 'sales', rowAggregator: 'SUM' }],
                summaryRows: {
                    aggregator: 'SUM',
                    columns: [{ id: 'name', value: 'Total' }]
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            strictEqual(
                (grid.dataProvider as any).getDataTable(true).columns.sales[0],
                30,
                'The projected parent row holds the aggregate of its children.'
            );
            strictEqual(
                summaryRowObjects(grid)[0].sales, 35,
                'The summary aggregates the source rows, not the projected ' +
                'parent aggregates on top of them.'
            );

            // The summary row index addresses the summary section, so it must
            // not adopt the identity of the projected row at that index.
            const nameCell = (grid as any).viewport.summaryView.bottom.rows[0]
                .cells.find(
                    (cell: any): boolean => cell.column.id === 'name'
                );

            strictEqual(
                nameCell.htmlElement
                    .querySelector('[data-hcg-tree-toggle]'),
                null,
                'A summary cell does not get the TreeView disclosure.'
            );
            strictEqual(
                nameCell.htmlElement.innerText, 'Total',
                'The static value survives in the tree column.'
            );
        });

    it('should not count pre-calculated parent values twice', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        // The dataset carries the parent totals, as an export from another
        // system typically would.
        const options = {
            data: {
                columns: {
                    id: ['europe', 'france', 'germany', 'asia', 'japan'],
                    parentId: [null, 'europe', 'europe', null, 'asia'],
                    name: ['Europe', 'France', 'Germany', 'Asia', 'Japan'],
                    sales: [100, 60, 40, 70, 70]
                },
                idColumn: 'id'
            },
            treeView: { enabled: true, treeColumn: 'name' },
            rendering: { rows: { expandedLevels: 'all' } },
            summaryRows: {
                aggregator: 'SUM',
                skipParents: true,
                columns: [{ id: 'name', value: 'Total' }]
            }
        };

        const grid = await Grid.grid(el, options as any, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            summaryRowObjects(grid)[0].sales, 170,
            'A row rolled up by another one is left out, so the total ' +
            'matches the top level rows (100 + 70).'
        );

        const withParents = await Grid.grid(
            setupDOM().el,
            {
                ...options,
                summaryRows: {
                    aggregator: 'SUM',
                    columns: [{ id: 'name', value: 'Total' }]
                }
            } as any,
            true
        );

        withParents.viewport?.resizeObserver?.disconnect();

        strictEqual(
            summaryRowObjects(withParents)[0].sales, 340,
            'By default every row counts, parent values included.'
        );
    });

    it('should let a column override skipParents', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        // `sales` carries a pre-calculated rollup, `staff` belongs to the
        // region row itself.
        const options = {
            data: {
                columns: {
                    id: ['europe', 'france', 'germany'],
                    parentId: [null, 'europe', 'europe'],
                    name: ['Europe', 'France', 'Germany'],
                    sales: [100, 60, 40],
                    staff: [5, 20, 30]
                },
                idColumn: 'id'
            },
            treeView: { enabled: true, treeColumn: 'name' },
            rendering: { rows: { expandedLevels: 'all' } }
        };

        const optedOut = await Grid.grid(el, {
            ...options,
            summaryRows: {
                aggregator: 'SUM',
                columns: [{ id: 'sales', skipParents: true }]
            }
        } as any, true);

        optedOut.viewport?.resizeObserver?.disconnect();

        strictEqual(
            summaryRowObjects(optedOut)[0].sales, 100,
            'The opted-out column drops the rolled up parent value.'
        );
        strictEqual(
            summaryRowObjects(optedOut)[0].staff, 55,
            'A column left on the row default keeps counting the parent.'
        );

        const optedIn = await Grid.grid(setupDOM().el, {
            ...options,
            summaryRows: {
                aggregator: 'SUM',
                skipParents: true,
                columns: [{ id: 'staff', skipParents: false }]
            }
        } as any, true);

        optedIn.viewport?.resizeObserver?.disconnect();

        strictEqual(
            summaryRowObjects(optedIn)[0].sales, 100,
            'The row default still drops the rolled up parent value.'
        );
        strictEqual(
            summaryRowObjects(optedIn)[0].staff, 55,
            'The opted-in column counts the parent on top of its children.'
        );
    });

    it('should keep a parent left alone by a filter in the total',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        id: ['europe', 'france', 'germany'],
                        parentId: [null, 'europe', 'europe'],
                        name: ['Europe', 'France', 'Germany'],
                        sales: [100, 60, 40]
                    },
                    idColumn: 'id'
                },
                treeView: { enabled: true, treeColumn: 'name' },
                rendering: { rows: { expandedLevels: 'all' } },
                summaryRows: { aggregator: 'SUM', skipParents: true }
            } as any, true);

            grid.viewport?.resizeObserver?.disconnect();

            strictEqual(
                summaryRowObjects(grid)[0].sales, 100,
                'Unfiltered, only the children count.'
            );

            // Keep the parent, drop both of its children.
            grid.querying.filtering.addColumnFilterCondition('sales', {
                condition: 'greaterThan',
                value: 90
            } as any);
            await grid.querying.proceed();

            strictEqual(
                summaryRowObjects(grid)[0].sales, 100,
                'The parent is no longer rolling anything up, so its own ' +
                'value counts.'
            );
        });

    it('should aggregate each pipeline stage the scope selects', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    name: ['a', 'b', 'c', 'd', 'e'],
                    sales: [1, 2, 3, 4, 5]
                }
            },
            pagination: {
                enabled: true,
                pageSize: 2
            },
            summaryRows: [
                { aggregator: 'SUM', scope: 'page' },
                { aggregator: 'SUM', scope: 'filtered' },
                { aggregator: 'SUM', scope: 'all' }
            ]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const totals = (): number[] => summaryRowObjects(grid)
            .map((row): number => row.sales as number);

        deepStrictEqual(
            totals(), [3, 15, 15],
            'Unfiltered, the filtered total and the grand total match.'
        );

        grid.querying.filtering.addColumnFilterCondition('sales', {
            condition: 'greaterThan',
            value: 2
        } as any);
        await grid.querying.proceed();

        deepStrictEqual(
            totals(), [7, 12, 15],
            'The page and filtered totals follow the filter, the grand ' +
            'total ignores it.'
        );

        grid.querying.pagination.setPage(2);
        await grid.querying.proceed();

        deepStrictEqual(
            totals(), [5, 12, 15],
            'Only the page total follows the page change.'
        );
    });

    it('should fall back to all rows when the page scope does not apply',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();
            const warnings: string[] = [];
            const originalWarn = console.warn;

            // eslint-disable-next-line no-console
            console.warn = (message: string): void => {
                warnings.push(message);
            };

            try {
                const grid = await Grid.grid(el, {
                    data: {
                        columns: {
                            name: ['a', 'b', 'c', 'd', 'e'],
                            sales: [1, 2, 3, 4, 5]
                        }
                    },
                    summaryRows: [{ aggregator: 'SUM', scope: 'page' }]
                }, true);

                grid.viewport?.resizeObserver?.disconnect();

                strictEqual(
                    summaryRowObjects(grid)[0].sales, 15,
                    'Without pagination the row aggregates all rows.'
                );
                strictEqual(
                    warnings.filter(
                        (message): boolean =>
                            message.indexOf('Summary rows:') === 0
                    ).length,
                    1,
                    'The unsupported scope is reported once, not per query.'
                );
            } finally {
                // eslint-disable-next-line no-console
                console.warn = originalWarn;
            }
        });

    it('should apply the row and cell className/style options', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    name: ['a', 'b', 'c'],
                    sales: [10, 20, 30]
                }
            },
            summaryRows: [{
                aggregator: 'SUM',
                className: 'my-total-row',
                style: { borderTop: '2px solid red' },
                columns: [
                    { id: 'name', value: 'Total' },
                    {
                        id: 'sales',
                        className: 'my-total-cell',
                        style: { color: 'blue' }
                    }
                ]
            }],
            columns: [{
                id: 'sales',
                cells: {
                    className: 'col-cell',
                    style: { fontWeight: 'bold' }
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const row = (grid as any).viewport.summaryView.bottom.rows[0];
        const rowElement = row.htmlElement;

        ok(
            rowElement.classList.contains('my-total-row'),
            'The row class name is added next to the Core row classes.'
        );
        ok(
            rowElement.classList.contains('hcg-summary-row'),
            'The Core summary row class survives.'
        );
        strictEqual(
            rowElement.style.getPropertyValue('border-top'), '2px solid red',
            'The row style is applied to the row element.'
        );
        ok(
            rowElement.style.getPropertyValue('width'),
            'The layout styles of the row element are left in place.'
        );

        const summaryCell = row.cells.find(
            (cell: any): boolean => cell.column.id === 'sales'
        );

        ok(
            summaryCell.htmlElement.classList.contains('my-total-cell') &&
            summaryCell.htmlElement.classList.contains('col-cell'),
            'The cell class name is added on top of the column one.'
        );
        strictEqual(
            summaryCell.htmlElement.style.getPropertyValue('color'), 'blue',
            'The cell style is applied to the summary cell.'
        );
        strictEqual(
            summaryCell.htmlElement.style.getPropertyValue('font-weight'),
            'bold',
            'The column cell style still applies to the summary cell.'
        );

        const bodyCell = (grid as any).viewport.rows[0].cells.find(
            (cell: any): boolean => cell.column.id === 'sales'
        );

        strictEqual(
            bodyCell.htmlElement.classList.contains('my-total-cell'), false,
            'The summary cell options do not leak into body cells.'
        );

        // A re-sync must not stack the class names or leak the styles.
        await grid.update({
            data: {
                columns: {
                    name: ['a', 'b'],
                    sales: [1, 2]
                }
            }
        });

        const updatedRow = (grid as any).viewport.summaryView.bottom.rows[0];

        strictEqual(
            updatedRow.htmlElement.className.split(/\s+/g)
                .filter((token: string): boolean => token === 'my-total-row')
                .length,
            1,
            'The row class name is applied once after an update.'
        );
        strictEqual(
            updatedRow.htmlElement.style.getPropertyValue('border-top'),
            '2px solid red',
            'The row style survives an update.'
        );
    });
});
