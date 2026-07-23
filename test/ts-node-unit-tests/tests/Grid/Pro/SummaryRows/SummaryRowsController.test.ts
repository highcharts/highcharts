import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

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

function presentationColumns(grid: any): Record<string, unknown[]> {
    return (grid.dataProvider as any).getDataTable(true).columns;
}

describe('SummaryRowsController', () => {
    it('should append a summary row aggregating the whole table', async () => {
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

        const columns = presentationColumns(grid);

        deepStrictEqual(
            columns.sales,
            [10, 20, 30, 60],
            'Sales column should end with the SUM of all rows.'
        );
        deepStrictEqual(
            columns.margin,
            [1, 2, 6, 3],
            'Margin column should end with the AVERAGE of all rows.'
        );
        deepStrictEqual(
            columns.name,
            ['a', 'b', 'c', 'Total'],
            'Non-aggregated column should render the configured label.'
        );
    });

    it('should append multiple summary rows selecting the function per row',
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

            const columns = presentationColumns(grid);

            deepStrictEqual(
                columns.sales,
                [10, 20, 30, 60, 20],
                'Should append a SUM row then an AVERAGE row.'
            );
            deepStrictEqual(
                columns.name,
                ['a', 'b', 'c', 'Total', 'Average'],
                'Each summary row should resolve its own label.'
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

            const columns = presentationColumns(grid);

            deepStrictEqual(
                columns.q1,
                [10, 20, 30, 60],
                'Columns without own summary should inherit the SUM default.'
            );
            deepStrictEqual(
                columns.q2,
                [1, 2, 3, 6],
                'The columnDefaults aggregator should apply to every column.'
            );
            deepStrictEqual(
                columns.region,
                ['a', 'b', 'c', 'Total'],
                'A null aggregator should opt a column out and keep its label.'
            );
        });

    it('should not append a summary row when disabled', async () => {
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

        strictEqual(
            presentationColumns(grid).sales.length,
            3,
            'Disabled summary must not inject any extra row.'
        );
    });

    it('should not append a summary row when no column aggregates', async () => {
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

        strictEqual(
            presentationColumns(grid).sales.length,
            3,
            'A label without any aggregator must not inject a summary row.'
        );
    });
});
