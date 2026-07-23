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
                enabled: true
            },
            columns: [{
                id: 'name',
                summary: { label: 'Total' }
            }, {
                id: 'sales',
                summary: { aggregator: 'SUM' }
            }, {
                id: 'margin',
                summary: { aggregator: 'AVERAGE' }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        deepStrictEqual(
            summaryRowObjects(grid),
            [{ name: 'Total', sales: 60, margin: 3 }],
            'Should compute SUM, AVERAGE and the configured label.'
        );

        strictEqual(
            (grid as any).viewport.summaryView.tbodyElement
                .querySelectorAll('tr').length,
            1,
            'The summary section should render one row.'
        );
    });

    it('should compute multiple summary rows selecting the function per row',
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
                summaryRows: [{ id: 'total' }, { id: 'average' }],
                columns: [{
                    id: 'name',
                    summary: {
                        label: (context: any) => (
                            context.summaryRowId === 'total' ?
                                'Total' : 'Average'
                        )
                    }
                }, {
                    id: 'sales',
                    summary: {
                        aggregator: (context: any) => (
                            context.summaryRowIndex === 0 ? 'SUM' : 'AVERAGE'
                        )
                    }
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
        });

    it('should inherit the aggregator from columnDefaults and allow opt-out',
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
                    enabled: true
                },
                columnDefaults: {
                    summary: { aggregator: 'SUM' }
                },
                columns: [{
                    id: 'region',
                    summary: { aggregator: null, label: 'Total' }
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            deepStrictEqual(
                summaryRowObjects(grid),
                [{ region: 'Total', q1: 60, q2: 6 }],
                'Columns should inherit the SUM default; null opts out.'
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
                enabled: false
            },
            columns: [{
                id: 'sales',
                summary: { aggregator: 'SUM' }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        ok(
            summaryRowObjects(grid).length === 0,
            'Disabled summary must compute no rows.'
        );
    });

    it('should compute no summary rows when no column aggregates', async () => {
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
                enabled: true
            },
            columns: [{
                id: 'name',
                summary: { label: 'Total' }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        ok(
            summaryRowObjects(grid).length === 0,
            'A label without any aggregator must compute no rows.'
        );
    });
});
