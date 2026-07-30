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
            (grid as any).viewport.summaryView.tbodyElement
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
                summaryRows: {
                    aggregator: 'SUM',
                    columns: [
                        { id: 'region', value: 'Total' }
                    ]
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            deepStrictEqual(
                summaryRowObjects(grid),
                [{ region: 'Total', q1: 60, q2: 6 }],
                'The row aggregator should sum q1/q2; value suppresses it.'
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
                (grid as any).viewport.summaryView.tbodyElement
                    .querySelectorAll('tr').length,
                2,
                'The summary section should render both rows.'
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

            const cells = (grid as any).viewport.summaryView.rows[0].cells;
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
                        sales: [10, 20, 30]
                    }
                },
                summaryRows: {
                    columns: [
                        { id: 'name', value: 'Total' },
                        {
                            id: 'sales',
                            aggregator: 'SUM',
                            format: '${value:,0f}'
                        }
                    ]
                }
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
                (grid as any).viewport.summaryView.rows[0].htmlElement;

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
                (grid as any).viewport.summaryView.tbodyElement
                    .querySelectorAll('tr').length,
                1,
                'The empty/static summary row should still render.'
            );
        });
});
