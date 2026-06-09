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

async function flushAsync(): Promise<void> {
    await new Promise<void>((resolve): void => {
        setTimeout(resolve, 0);
    });
}

describe('TreeProjectionController', () => {
    it('should preserve tree root order for default and custom sorting on one Grid instance', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

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

        const Grid = await loadGridPro();

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
                    aggregator: 'SUM'
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

    it('should rebuild the projected tree after editing a path cell', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2],
                    path: [
                        'World/Europe/Poland',
                        'World/Asia/Japan'
                    ],
                    value: [10, 20]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'path'
                }
            },
            columns: [{
                id: 'path',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const pathColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'path'
        );
        const polandRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean =>
                row.data.path === 'World/Europe/Poland'
        );

        ok(polandRow, 'Poland leaf row should be rendered before editing.');

        await polandRow.cells[pathColumnIndex].editValue('World/Americas/USA');

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.path,
            [
                'World',
                'World/Americas',
                'World/Americas/USA',
                'World/Asia',
                'World/Asia/Japan'
            ],
            'Editing a path cell should rebuild generated ancestors and projected row order.'
        );

        strictEqual(
            grid.viewport.rows.some(
                (row: AnyRecord): boolean =>
                    row.data.path === 'World/Europe'
            ),
            false,
            'Old generated path ancestors should disappear after editing the path.'
        );
        strictEqual(
            grid.viewport.rows.some(
                (row: AnyRecord): boolean =>
                    row.data.path === 'World/Americas'
            ),
            true,
            'New generated path ancestors should appear after editing the path.'
        );

        grid.destroy();
    });

    it('should keep generated path parents and id column readonly when path editing is enabled', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2],
                    path: [
                        'Company/Sales',
                        'Company/Marketing'
                    ]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'path'
                }
            },
            columns: [{
                id: 'id',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }, {
                id: 'path',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const idColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'id'
        );
        const pathColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'path'
        );
        const companyRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean => row.data.path === 'Company'
        );
        const salesRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean => row.data.path === 'Company/Sales'
        );

        ok(companyRow, 'Generated Company row should be rendered.');
        ok(salesRow, 'Sales source row should be rendered.');

        const companyPathCell = companyRow.cells[pathColumnIndex];
        const salesIdCell = salesRow.cells[idColumnIndex];
        const salesPathCell = salesRow.cells[pathColumnIndex];

        strictEqual(
            companyPathCell.isEditable(),
            false,
            'Generated path parent should be readonly.'
        );
        strictEqual(
            companyPathCell.htmlElement.getAttribute('aria-readonly'),
            'true',
            'Generated path parent should expose readonly state.'
        );
        strictEqual(
            salesIdCell.isEditable(),
            false,
            'The id column should be readonly in path trees.'
        );
        strictEqual(
            salesIdCell.htmlElement.getAttribute('aria-readonly'),
            'true',
            'The id column should expose readonly state.'
        );

        grid.viewport.cellEditing?.startEditing(companyPathCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            void 0,
            'Generated path parent should not enter edit mode.'
        );

        grid.viewport.cellEditing?.startEditing(salesIdCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            void 0,
            'The id column should not enter edit mode.'
        );

        strictEqual(
            salesPathCell.isEditable(),
            true,
            'Source path rows should remain editable.'
        );
        grid.viewport.cellEditing?.startEditing(salesPathCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            salesPathCell,
            'The path column should still enter edit mode for source rows.'
        );

        grid.viewport.cellEditing?.stopEditing(false);
        await flushAsync();
        grid.destroy();
    });

    it('should ignore aggregation for special TreeView columns in path input', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [10, 20],
                    path: [
                        'World/Europe',
                        'World/Asia'
                    ],
                    value: [5, 7]
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'path'
                }
            },
            columns: [{
                id: 'id',
                treeView: {
                    aggregator: 'SUM'
                }
            }, {
                id: 'path',
                treeView: {
                    aggregator: 'SUM'
                }
            }, {
                id: 'value',
                treeView: {
                    aggregator: 'SUM'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);

        deepStrictEqual(
            presentationTable.columns.id,
            ['__hcg_tree_path__:World', 10, 20],
            'Generated path parents should keep structural generated ids instead of aggregating.'
        );
        deepStrictEqual(
            presentationTable.columns.path,
            ['World', 'World/Europe', 'World/Asia'],
            'Path column should keep structural values instead of aggregating.'
        );
        deepStrictEqual(
            presentationTable.columns.value,
            [12, 5, 7],
            'Non-structural columns should still aggregate normally.'
        );

        strictEqual(
            grid.treeView?.hasColumnAggregation('id'),
            false,
            'The id column should be excluded from aggregation.'
        );
        strictEqual(
            grid.treeView?.hasColumnAggregation('path'),
            false,
            'The path column should be excluded from aggregation.'
        );
        strictEqual(
            grid.treeView?.hasColumnAggregation('value'),
            true,
            'A regular data column should still participate in aggregation.'
        );

        grid.destroy();
    });

    it('should aggregate explicit parent values and mark them readonly', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

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
                    aggregator: 'SUM'
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

    it('should ignore aggregation for special TreeView columns in parentId input', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, 1],
                    name: ['Parent', 'A', 'B'],
                    value: [100, 10, 20]
                },
                idColumn: 'id',
                treeView: {
                    input: {
                        type: 'parentId',
                        parentIdColumn: 'parentId'
                    },
                    expandedRowIds: 'all',
                    treeColumn: 'name'
                }
            },
            columns: [{
                id: 'id',
                treeView: {
                    aggregator: 'SUM'
                }
            }, {
                id: 'parentId',
                treeView: {
                    aggregator: 'SUM'
                }
            }, {
                id: 'value',
                treeView: {
                    aggregator: 'SUM'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);

        deepStrictEqual(
            presentationTable.columns.id,
            [1, 2, 3],
            'The id column should keep its original structural values.'
        );
        deepStrictEqual(
            presentationTable.columns.parentId,
            [null, 1, 1],
            'The parentId column should keep its original structural values.'
        );
        deepStrictEqual(
            presentationTable.columns.value,
            [30, 10, 20],
            'Regular columns should still aggregate in parentId trees.'
        );

        strictEqual(
            grid.treeView?.hasColumnAggregation('id'),
            false,
            'The id column should be excluded from aggregation.'
        );
        strictEqual(
            grid.treeView?.hasColumnAggregation('parentId'),
            false,
            'The parentId column should be excluded from aggregation.'
        );
        strictEqual(
            grid.treeView?.hasColumnAggregation('value'),
            true,
            'A regular data column should still participate in aggregation.'
        );

        grid.destroy();
    });

    it('should sort tree parents by aggregated values when sorting an aggregated column', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

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
                    aggregator: 'SUM'
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

        const Grid = await loadGridPro();

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
                    aggregator: 'SUM'
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

    it('should start editing on double click and Enter, but keep Space for toggling editable tree cells', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, 1],
                    name: ['Parent', 'A', 'B']
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'name'
                }
            },
            columns: [{
                id: 'name',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const nameColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'name'
        );
        const getParentCell = (): AnyRecord => {
            const parentRow = grid.viewport.rows.find(
                (row: AnyRecord): boolean => row.data.name === 'Parent'
            );

            ok(parentRow, 'Parent row should be rendered.');
            return parentRow.cells[nameColumnIndex];
        };

        const parentNameCell = getParentCell();
        parentNameCell.htmlElement.dispatchEvent(new win.MouseEvent('dblclick', {
            bubbles: true
        }));

        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            parentNameCell,
            'Double click on an editable tree cell should start editing.'
        );
        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.name,
            ['Parent', 'A', 'B'],
            'Double click should not collapse the edited tree row.'
        );

        const parentNameEditor = parentNameCell.htmlElement.querySelector(
            'input'
        );
        ok(
            parentNameEditor,
            'Editing a tree cell should render an input element.'
        );

        parentNameEditor.dispatchEvent(new win.MouseEvent('dblclick', {
            bubbles: true
        }));

        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            parentNameCell,
            'Double click on the active editor should keep the cell editing.'
        );
        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.name,
            ['Parent', 'A', 'B'],
            'Double click on the active editor should not collapse the row.'
        );

        grid.viewport.cellEditing?.stopEditing(false);
        await flushAsync();

        const reloadedParentNameCell = getParentCell();
        reloadedParentNameCell.htmlElement.focus();
        reloadedParentNameCell.htmlElement.dispatchEvent(
            new win.KeyboardEvent('keydown', {
                bubbles: true,
                key: 'Enter'
            })
        );

        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            reloadedParentNameCell,
            'Enter on an editable tree cell should start editing.'
        );
        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.name,
            ['Parent', 'A', 'B'],
            'Enter should not collapse the edited tree row.'
        );

        grid.viewport.cellEditing?.stopEditing(false);
        await flushAsync();

        const toggledParentNameCell = getParentCell();
        toggledParentNameCell.htmlElement.focus();
        toggledParentNameCell.htmlElement.dispatchEvent(
            new win.KeyboardEvent('keydown', {
                bubbles: true,
                key: ' '
            })
        );
        await flushAsync();

        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            void 0,
            'Space should not start editing on an editable tree cell.'
        );
        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.name,
            ['Parent'],
            'Space should still toggle the tree row.'
        );

        grid.destroy();
    });

    it('should keep structural TreeView columns readonly in parentId input', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();
        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, 1],
                    name: ['Parent', 'A', 'B']
                },
                idColumn: 'id',
                treeView: {
                    input: {
                        type: 'parentId',
                        parentIdColumn: 'parentId'
                    },
                    expandedRowIds: 'all',
                    treeColumn: 'name'
                }
            },
            columns: [{
                id: 'id',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }, {
                id: 'parentId',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }, {
                id: 'name',
                cells: {
                    editMode: {
                        enabled: true
                    }
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const idColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'id'
        );
        const parentIdColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'parentId'
        );
        const nameColumnIndex = grid.viewport.columns.findIndex(
            (column: AnyRecord): boolean => column.id === 'name'
        );
        const childRow = grid.viewport.rows.find(
            (row: AnyRecord): boolean => row.data.name === 'A'
        );

        ok(childRow, 'Child source row should be rendered.');

        const childIdCell = childRow.cells[idColumnIndex];
        const childParentIdCell = childRow.cells[parentIdColumnIndex];
        const childNameCell = childRow.cells[nameColumnIndex];

        strictEqual(
            childIdCell.isEditable(),
            false,
            'The id column should be readonly in parentId trees.'
        );
        strictEqual(
            childParentIdCell.isEditable(),
            false,
            'The parentId column should be readonly in parentId trees.'
        );
        strictEqual(
            childIdCell.htmlElement.getAttribute('aria-readonly'),
            'true',
            'The id column should expose readonly state.'
        );
        strictEqual(
            childParentIdCell.htmlElement.getAttribute('aria-readonly'),
            'true',
            'The parentId column should expose readonly state.'
        );

        grid.viewport.cellEditing?.startEditing(childIdCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            void 0,
            'The id column should not enter edit mode.'
        );

        grid.viewport.cellEditing?.startEditing(childParentIdCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            void 0,
            'The parentId column should not enter edit mode.'
        );

        strictEqual(
            childNameCell.isEditable(),
            true,
            'Regular data columns should remain editable in parentId trees.'
        );
        grid.viewport.cellEditing?.startEditing(childNameCell);
        strictEqual(
            grid.viewport.cellEditing?.editedCell,
            childNameCell,
            'A regular data column should still enter edit mode.'
        );

        grid.viewport.cellEditing?.stopEditing(false);
        await flushAsync();
        grid.destroy();
    });

    it('should block duplicate path edits before rebuilding TreeView', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();
        const originalConsoleError = console.error;
        const consoleErrors: unknown[][] = [];

        console.error = (...args: unknown[]): void => {
            consoleErrors.push(args);
        };

        try {
            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        id: [1, 2, 3],
                        path: [
                            'World/Europe/Poland',
                            'World/Europe/Germany',
                            'World/Americas/USA'
                        ],
                        value: [1, 2, 3]
                    },
                    idColumn: 'id',
                    treeView: {
                        input: {
                            type: 'path'
                        },
                        expandedRowIds: 'all',
                        treeColumn: 'path'
                    }
                },
                columns: [{
                    id: 'path',
                    cells: {
                        editMode: {
                            enabled: true
                        }
                    }
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const pathColumnIndex = grid.viewport.columns.findIndex(
                (column: AnyRecord): boolean => column.id === 'path'
            );
            const germanyRow = grid.viewport.rows.find(
                (row: AnyRecord): boolean =>
                    row.data.path === 'World/Europe/Germany'
            );

            ok(germanyRow, 'Germany source row should be rendered.');

            const germanyPathCell = germanyRow.cells[pathColumnIndex];
            grid.viewport.cellEditing?.startEditing(germanyPathCell);

            strictEqual(
                grid.viewport.cellEditing?.editedCell,
                germanyPathCell,
                'Germany path cell should enter edit mode.'
            );

            const germanyPathEditor = germanyPathCell.htmlElement.querySelector(
                'input'
            ) as HTMLInputElement | null;
            ok(
                germanyPathEditor,
                'Path cell editor should render an input element.'
            );

            germanyPathEditor.value = 'World/Europe/Poland';

            strictEqual(
                grid.viewport.cellEditing?.stopEditing(),
                false,
                'Duplicate path edits should be rejected by validation.'
            );
            strictEqual(
                grid.viewport.cellEditing?.editedCell,
                germanyPathCell,
                'Rejected path edits should keep the cell in edit mode.'
            );
            strictEqual(
                grid.viewport.validator?.errorCell,
                germanyPathCell,
                'Rejected path edits should mark the edited cell as invalid.'
            );
            deepStrictEqual(
                (grid.dataProvider as any).getDataTable(false).columns.path,
                [
                    'World/Europe/Poland',
                    'World/Europe/Germany',
                    'World/Americas/USA'
                ],
                'Rejected path edits should not mutate source data.'
            );
            deepStrictEqual(
                consoleErrors,
                [],
                'Rejected path edits should not log rebuild errors.'
            );

            grid.viewport.cellEditing?.stopEditing(false);
            await flushAsync();
            grid.destroy();
        } finally {
            console.error = originalConsoleError;
        }
    });

    it('should block invalid path edits before rebuilding TreeView', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();
        const originalConsoleError = console.error;
        const consoleErrors: unknown[][] = [];

        console.error = (...args: unknown[]): void => {
            consoleErrors.push(args);
        };

        try {
            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        id: [1, 2],
                        path: [
                            'Company > Sales',
                            'Company > Marketing'
                        ],
                        value: [1, 2]
                    },
                    idColumn: 'id',
                    treeView: {
                        input: {
                            type: 'path',
                            separator: ' > '
                        },
                        expandedRowIds: 'all',
                        treeColumn: 'path'
                    }
                },
                columns: [{
                    id: 'path',
                    cells: {
                        editMode: {
                            enabled: true
                        }
                    }
                }]
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            const pathColumnIndex = grid.viewport.columns.findIndex(
                (column: AnyRecord): boolean => column.id === 'path'
            );
            const salesRow = grid.viewport.rows.find(
                (row: AnyRecord): boolean =>
                    row.data.path === 'Company > Sales'
            );

            ok(salesRow, 'Sales source row should be rendered.');

            const salesPathCell = salesRow.cells[pathColumnIndex];
            grid.viewport.cellEditing?.startEditing(salesPathCell);

            strictEqual(
                grid.viewport.cellEditing?.editedCell,
                salesPathCell,
                'Sales path cell should enter edit mode.'
            );

            const salesPathEditor = salesPathCell.htmlElement.querySelector(
                'input'
            ) as HTMLInputElement | null;
            ok(
                salesPathEditor,
                'Path cell editor should render an input element.'
            );

            salesPathEditor.value = 'Company > Sales > Americas > qwe > qwq > ';

            strictEqual(
                grid.viewport.cellEditing?.stopEditing(),
                false,
                'Invalid path edits should be rejected by validation.'
            );
            strictEqual(
                grid.viewport.cellEditing?.editedCell,
                salesPathCell,
                'Rejected invalid path edits should keep the cell in edit mode.'
            );
            strictEqual(
                grid.viewport.validator?.errorCell,
                salesPathCell,
                'Rejected invalid path edits should mark the edited cell as invalid.'
            );
            const validationErrors: string[] = [];
            strictEqual(
                grid.viewport.validator?.validate(
                    salesPathCell,
                    validationErrors
                ),
                false,
                'Rejected invalid path edits should still fail direct validation.'
            );
            strictEqual(
                validationErrors[0]?.includes(
                    'Empty path segments are not allowed.'
                ),
                true,
                'Rejected invalid path edits should explain the path format error.'
            );
            deepStrictEqual(
                (grid.dataProvider as any).getDataTable(false).columns.path,
                [
                    'Company > Sales',
                    'Company > Marketing'
                ],
                'Rejected invalid path edits should not mutate source data.'
            );
            deepStrictEqual(
                consoleErrors,
                [],
                'Rejected invalid path edits should not log rebuild errors.'
            );

            grid.viewport.cellEditing?.stopEditing(false);
            await flushAsync();
            grid.destroy();
        } finally {
            console.error = originalConsoleError;
        }
    });
});
