import { describe, it } from 'node:test';
import { deepStrictEqual, ok, strictEqual } from 'node:assert';

import { mockObservers, setupDOM } from '../../../../test-utils';
import type { AnyRecord } from '../../../../../../ts/Shared/Types';

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
    global.ResizeObserver = win.ResizeObserver;
    global.requestAnimationFrame = requestAnimationFrame;
    global.cancelAnimationFrame = (): void => {};
    win.requestAnimationFrame = requestAnimationFrame;
    win.cancelAnimationFrame = (): void => {};
}

function loadGridPro(): AnyRecord {
    return require('../../../../../../code/grid/grid-pro.src.js');
}

describe('TreeProjectionController', () => {
    it('should preserve tree root order for default and custom sorting on one Grid instance', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, null],
                    name: ['aa', 'zzzzz', 'zbbb']
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'name'
                }
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await grid.setSorting([{
            columnId: 'name',
            order: 'desc'
        }]);

        deepStrictEqual(
            grid.querying.sorting.currentSortings,
            [{
                columnId: 'name',
                order: 'desc'
            }],
            'Grid should store descending sorting state.'
        );

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [3, 1, 2],
            'Tree projection should order roots by the default descending sort.'
        );

        await grid.update({
            columns: [{
                id: 'name',
                sorting: {
                    compare: (a, b) => String(a ?? '').length - String(b ?? '').length
                }
            }]
        });

        await grid.setSorting([{
            columnId: 'name',
            order: 'asc'
        }]);

        deepStrictEqual(
            grid.querying.sorting.currentSortings,
            [{
                columnId: 'name',
                order: 'asc'
            }],
            'Grid should store ascending sorting state after updating compare.'
        );

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [1, 2, 3],
            'Tree projection should preserve root order defined by custom compare.'
        );

        grid.destroy();
    });

    it('should aggregate generated path parents and refresh parent values after child edits', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    path: [
                        'World/Europe/Poland',
                        'World/Europe/Germany',
                        'World/Asia/Japan'
                    ],
                    value: [10, 20, 30]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'path'
                }
            },
            columns: [{
                id: 'value',
                cells: {
                    editMode: {
                        enabled: true
                    }
                },
                treeView: {
                    aggregate: 'SUM'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);
        deepStrictEqual(
            presentationTable.columns.value,
            [60, 30, 10, 20, 30, 30],
            'Generated parent rows should aggregate descendant values.'
        );
        deepStrictEqual(
            presentationTable.columns.path,
            [
                'World',
                'World/Europe',
                'World/Europe/Poland',
                'World/Europe/Germany',
                'World/Asia',
                'World/Asia/Japan'
            ],
            'Projected path rows should include generated ancestors.'
        );

        const valueColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'value'
        );
        const europeRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean => row.data.path === 'World/Europe'
        );
        const polandRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean =>
                row.data.path === 'World/Europe/Poland'
        );

        ok(europeRow, 'Generated Europe row should be rendered.');
        ok(polandRow, 'Poland child row should be rendered.');

        const europeValueCell = europeRow.cells[valueColumnIndex];
        const polandValueCell = polandRow.cells[valueColumnIndex];

        strictEqual(
            europeValueCell.isEditable(),
            false,
            'Generated aggregated parent cell should be readonly.'
        );
        strictEqual(
            europeValueCell.htmlElement.getAttribute('aria-readonly'),
            'true',
            'Generated aggregated parent cell should expose readonly state.'
        );

        grid.viewport.cellEditing?.startEditing(europeValueCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            void 0,
            'Generated aggregated parent cell should not enter edit mode.'
        );

        strictEqual(
            polandValueCell.isEditable(),
            true,
            'Leaf child cell should remain editable.'
        );

        await polandValueCell.editValue(15);

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.value,
            [65, 35, 15, 20, 30, 30],
            'Editing a child cell should refresh all affected parent aggregates.'
        );

        grid.destroy();
    });

    it('should aggregate explicit parent values and mark them readonly', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, 1],
                    name: ['Parent', 'A', 'B'],
                    value: [99, 10, 20]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'name'
                }
            },
            columns: [{
                id: 'value',
                cells: {
                    editMode: {
                        enabled: true
                    }
                },
                treeView: {
                    aggregate: 'SUM'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.value,
            [30, 10, 20],
            'Configured parent aggregation should override existing values.'
        );

        const valueColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'value'
        );
        const parentRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean => row.data.name === 'Parent'
        );

        ok(parentRow, 'Existing parent row should be rendered.');

        strictEqual(
            parentRow.cells[valueColumnIndex].isEditable(),
            false,
            'Aggregated parent cell should become readonly even if it had a source value.'
        );

        strictEqual(
            parentRow.cells[valueColumnIndex].htmlElement.getAttribute(
                'aria-readonly'
            ),
            'true',
            'Aggregated explicit parent cell should expose readonly state.'
        );

        grid.destroy();
    });

    it('should sort tree parents by aggregated values when sorting an aggregated column', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3, 4],
                    path: [
                        'Root/A/One',
                        'Root/A/Two',
                        'Root/B/One',
                        'Root/B/Two'
                    ],
                    value: [8, 1, 7, 7]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'path'
                }
            },
            columns: [{
                id: 'value',
                treeView: {
                    aggregate: 'SUM'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await grid.setSorting([{
            columnId: 'value',
            order: 'desc'
        }]);

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.path,
            [
                'Root',
                'Root/B',
                'Root/B/One',
                'Root/B/Two',
                'Root/A',
                'Root/A/One',
                'Root/A/Two'
            ],
            'Projected tree should sort parent rows by their resolved ' +
            'aggregated values.'
        );

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.value,
            [23, 14, 7, 7, 9, 8, 1],
            'Projected values should follow the aggregated sort order.'
        );

        grid.destroy();
    });

    it('should honor column sorting.compare for aggregated tree sorting', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3, 4],
                    path: [
                        'Root/A/One',
                        'Root/A/Two',
                        'Root/B/One',
                        'Root/B/Two'
                    ],
                    value: [8, 1, 7, 7]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'path'
                }
            },
            columns: [{
                id: 'value',
                sorting: {
                    compare: (a, b): number =>
                        Math.abs(Number(a) - 12) -
                        Math.abs(Number(b) - 12)
                },
                treeView: {
                    aggregate: 'SUM'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await grid.setSorting([{
            columnId: 'value',
            order: 'asc'
        }]);

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.path,
            [
                'Root',
                'Root/B',
                'Root/B/One',
                'Root/B/Two',
                'Root/A',
                'Root/A/One',
                'Root/A/Two'
            ],
            'Projected tree should honor custom compare for aggregated ' +
            'parent values.'
        );

        grid.destroy();
    });
});
