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

function cellOf(grid: any, rowIndex: number, columnId: string): any {
    return grid.viewport.rows[rowIndex].cells.find(
        (cell: any): boolean => cell.column.id === columnId
    );
}

const QUARTERS = {
    q1: [1, 10],
    q2: [2, 20]
};

const EDITABLE = {
    cells: {
        editMode: {
            enabled: true
        }
    }
};

describe('SummaryColumns', () => {
    it('should aggregate the listed columns of the same row', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: QUARTERS
            },
            columns: [{
                id: 'total',
                columnAggregator: 'SUM',
                aggregatedColumns: ['q1', 'q2']
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            cellOf(grid, 0, 'total').value, 3,
            'The summary cell aggregates its own row.'
        );
        strictEqual(
            cellOf(grid, 1, 'total').value, 30,
            'Every row aggregates its own values.'
        );
        strictEqual(
            cellOf(grid, 0, 'total').column.dataType, 'number',
            'An aggregating column without a dataType is assumed numeric, so ' +
            'the value is not conformed to a string.'
        );
    });

    it('should mark the header and body cells with hcg-summary-column',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: QUARTERS
                },
                columns: [{
                    id: 'total',
                    columnAggregator: 'SUM',
                    aggregatedColumns: ['q1', 'q2'],
                    className: 'my-own-class'
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const totalColumn = (grid as any).viewport.getColumn('total');
            const cellClasses = cellOf(grid, 0, 'total').htmlElement.classList;

            strictEqual(
                cellClasses.contains('hcg-summary-column'), true,
                'A body cell is marked without any className of its own.'
            );
            strictEqual(
                cellClasses.contains('my-own-class'), true,
                'The column className still applies next to it.'
            );
            strictEqual(
                totalColumn.header.htmlElement.classList
                    .contains('hcg-summary-column'),
                true,
                'The header cell is marked as well.'
            );

            strictEqual(
                cellOf(grid, 0, 'q1').htmlElement.classList
                    .contains('hcg-summary-column'),
                false,
                'A plain column is left unmarked.'
            );
        });

    it('should default to the other numeric columns, skipping derived ones',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        region: ['a', 'b'],
                        ...QUARTERS
                    }
                },
                columns: [
                    { id: 'total', columnAggregator: 'SUM' },
                    { id: 'mirror', columnAggregator: 'SUM' }
                ]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            strictEqual(
                cellOf(grid, 0, 'total').value, 3,
                'The text column is left out of the implicit source set.'
            );
            strictEqual(
                cellOf(grid, 0, 'mirror').value, 3,
                'The other summary column is left out as well, so both ' +
                'aggregate the same source columns.'
            );
        });

    it('should accept a callback and keep own data when it skips',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();
            const contexts: any[] = [];

            const grid = await Grid.grid(el, {
                data: {
                    columns: QUARTERS
                },
                columns: [{
                    id: 'total',
                    columnAggregator: (context: any): string => {
                        contexts.push(context);
                        return 'SUM';
                    },
                    aggregatedColumns: ['q1', 'q2']
                }, {
                    // A bound column: skipping aggregation leaves its own data.
                    id: 'q1',
                    columnAggregator: (): false => false,
                    aggregatedColumns: ['q2']
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            strictEqual(
                cellOf(grid, 0, 'total').value, 3,
                'The name returned by the callback is applied.'
            );
            deepStrictEqual(
                contexts[0].aggregatedColumnIds, ['q1', 'q2'],
                'The context carries the resolved source column ids.'
            );
            strictEqual(
                contexts[0].columnId, 'total',
                'The context carries the aggregating column id.'
            );
            strictEqual(
                contexts[0].rowIndex, 0,
                'The context carries the row index.'
            );

            strictEqual(
                cellOf(grid, 0, 'q1').value, 1,
                'A falsy aggregator leaves the column data in place.'
            );
        });

    it('should let cells.valueGetter win over the aggregator', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: QUARTERS
            },
            columns: [{
                id: 'total',
                columnAggregator: 'SUM',
                aggregatedColumns: ['q1', 'q2'],
                cells: {
                    valueGetter: (): number => -1
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            cellOf(grid, 0, 'total').value, -1,
            'The explicit valueGetter escape hatch takes precedence.'
        );
    });

    it('should stay non-editable even with editing enabled', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: QUARTERS
            },
            columnDefaults: EDITABLE,
            columns: [{
                id: 'total',
                columnAggregator: 'SUM',
                aggregatedColumns: ['q1', 'q2']
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            cellOf(grid, 0, 'total').isEditable(), false,
            'A derived (unbound) cell is never editable.'
        );
        strictEqual(
            cellOf(grid, 0, 'q1').isEditable(), true,
            'A bound source cell stays editable.'
        );
    });

    it('should recompute when a source cell is edited', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: QUARTERS
            },
            columnDefaults: EDITABLE,
            columns: [{
                id: 'total',
                columnAggregator: 'SUM',
                aggregatedColumns: ['q1', 'q2']
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await cellOf(grid, 0, 'q1').editValue(5);

        strictEqual(
            cellOf(grid, 0, 'total').value, 7,
            'The derived cell follows the edited source value.'
        );
        strictEqual(
            cellOf(grid, 1, 'total').value, 30,
            'Other rows are left alone.'
        );
    });

    it('should recompute in a pinned row as well', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: ['a', 'b'],
                    ...QUARTERS
                },
                idColumn: 'id'
            },
            rendering: {
                rows: {
                    pinning: {
                        enabled: true,
                        topIds: ['a']
                    }
                }
            },
            columnDefaults: EDITABLE,
            columns: [{
                id: 'total',
                columnAggregator: 'SUM',
                aggregatedColumns: ['q1', 'q2']
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const pinnedRow = (grid as any).viewport.bodySections
            .find((section: any): boolean => section.id === 'top')
            .getRows()[0];
        const pinnedCell = (columnId: string): any => pinnedRow.cells.find(
            (cell: any): boolean => cell.column.id === columnId
        );

        strictEqual(
            pinnedCell('total').value, 3,
            'The pinned row aggregates its own values.'
        );

        await pinnedCell('q1').editValue(5);

        strictEqual(
            pinnedCell('total').value, 7,
            'The pinned derived cell follows the edited source value.'
        );
    });

    it('should be sortable, filterable and exportable when materialized',
        async () => {
            const { win, doc, el } = setupDOM();
            mockObservers(win);
            installGridDOMGlobals(win, doc);

            const Grid = await loadGridPro();

            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        region: ['a', 'b', 'c'],
                        q1: [1, 100, 10],
                        q2: [2, 200, 20]
                    }
                },
                columnDefaults: EDITABLE,
                columns: [{
                    id: 'total',
                    columnAggregator: 'SUM',
                    aggregatedColumns: ['q1', 'q2'],
                    materialize: true,
                    sorting: { enabled: true }
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const policy = (grid as any).columnPolicy;

            strictEqual(
                policy.isColumnUnbound('total'), false,
                'A materialized column counts as bound.'
            );
            strictEqual(
                policy.isColumnSortingEnabled('total'), true,
                'Sorting is unlocked for it.'
            );
            strictEqual(
                policy.isColumnExportable('total'), true,
                'Exporting is unlocked for it.'
            );
            strictEqual(
                cellOf(grid, 0, 'total').isEditable(), false,
                'The derived cells stay read-only.'
            );
            strictEqual(
                cellOf(grid, 0, 'total').value, 3,
                'The materialized value is rendered.'
            );

            // The value must live in the queried table, not only in the cell.
            deepStrictEqual(
                Array.from(
                    (grid.dataProvider as any).presentationTable
                        .getColumn('total')
                ),
                [3, 300, 30],
                'The aggregate is a column of the queried table.'
            );

            await (grid as any).viewport.getColumn('total').sorting?.setOrder(
                'desc'
            );

            deepStrictEqual(
                [0, 1, 2].map(
                    (row): unknown => cellOf(grid, row, 'total').value
                ),
                [300, 30, 3],
                'Sorting by the materialized column reorders the rows.'
            );

            grid.querying.filtering.addColumnFilterCondition('total', {
                condition: 'greaterThan',
                value: 20
            } as any);
            await grid.querying.proceed();
            await (grid as any).viewport.updateRows();

            strictEqual(
                (grid.dataProvider as any).presentationTable.getRowCount(), 2,
                'Filtering by the materialized column drops rows.'
            );
        });

    it('should recompute a materialized column after an edit', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: QUARTERS
            },
            columnDefaults: EDITABLE,
            columns: [{
                id: 'total',
                columnAggregator: 'SUM',
                aggregatedColumns: ['q1', 'q2'],
                materialize: true
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            grid.querying.willNotModify(), false,
            'The materializing modifier makes an edit requery.'
        );

        await cellOf(grid, 0, 'q1').editValue(5);

        strictEqual(
            cellOf(grid, 0, 'total').value, 7,
            'The materialized total follows the edited source value.'
        );
    });

    it('should not materialize without a local data provider', async () => {
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
                    providerType: 'remote',
                    fetchCallback: (): unknown => ({
                        columns: { q1: [1, 10], q2: [2, 20] },
                        totalRowCount: 2
                    })
                } as any,
                columns: [{
                    id: 'total',
                    columnAggregator: 'SUM',
                    aggregatedColumns: ['q1', 'q2'],
                    materialize: true
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            strictEqual(
                (grid as any).columnPolicy.isColumnUnbound('total'), true,
                'The column stays unbound, so sorting stays locked.'
            );
            strictEqual(
                cellOf(grid, 0, 'total').value, 3,
                'It falls back to resolving the rendered cells.'
            );
            strictEqual(
                warnings.filter((message): boolean =>
                    message.indexOf('Summary columns:') === 0).length > 0,
                true,
                'The unsupported combination is reported.'
            );
        } finally {
            // eslint-disable-next-line no-console
            console.warn = originalWarn;
        }
    });

    it('should recompute a cells.valueGetter column on edit too', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: QUARTERS
            },
            columnDefaults: EDITABLE,
            columns: [{
                id: 'total',
                dataId: null,
                dataType: 'number',
                cells: {
                    valueGetter: (cell: any): number =>
                        (cell.row.data.q1 as number) +
                        (cell.row.data.q2 as number)
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await cellOf(grid, 0, 'q1').editValue(5);

        strictEqual(
            cellOf(grid, 0, 'total').value, 7,
            'The valueGetter escape hatch follows the edit as well.'
        );
    });
});
