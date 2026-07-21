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
                },
                summary: {
                    enabled: true
                }
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
                },
                summary: {
                    enabled: false
                }
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
                },
                summary: {
                    enabled: true
                }
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
