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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'path'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'value',
                cells: {
                    editMode: {
                        enabled: true
                    }
                },
                aggregator: 'SUM'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'path'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'path'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'path'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'id',
                aggregator: 'SUM'
            }, {
                id: 'path',
                aggregator: 'SUM'
            }, {
                id: 'value',
                aggregator: 'SUM'
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
            columns: [{
                id: 'value',
                cells: {
                    editMode: {
                        enabled: true
                    }
                },
                aggregator: 'SUM'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                input: {
                    type: 'parentId',
                    parentIdColumn: 'parentId'
                },
                treeColumn: 'name'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'id',
                aggregator: 'SUM'
            }, {
                id: 'parentId',
                aggregator: 'SUM'
            }, {
                id: 'value',
                aggregator: 'SUM'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'path'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'value',
                aggregator: 'SUM'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'path'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'value',
                sorting: {
                    compare: (a, b): number =>
                        Math.abs(Number(a) - 12) -
                        Math.abs(Number(b) - 12)
                },
                aggregator: 'SUM'
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
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                input: {
                    type: 'parentId',
                    parentIdColumn: 'parentId'
                },
                treeColumn: 'name'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
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
                    idColumn: 'id'
                },
                treeView: {
                    enabled: true,
                    input: {
                        type: 'path'
                    },
                    treeColumn: 'path'
                },
                rendering: {
                    rows: {
                        expandedLevels: 'all'
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
                    idColumn: 'id'
                },
                treeView: {
                    enabled: true,
                    input: {
                        type: 'path',
                        separator: ' > '
                    },
                    treeColumn: 'path'
                },
                rendering: {
                    rows: {
                        expandedLevels: 'all'
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

    it('should project flat rows grouped by one source column', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    A: ['North', 'North', 'South'],
                    B: ['Alpha', 'Beta', 'Gamma'],
                    C: [1, 2, 3],
                    D: ['Open', 'Closed', 'Open']
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: 'A'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);
        const projectionState = grid.treeView?.getProjectionState();

        deepStrictEqual(
            presentationTable.getColumnIds(),
            ['group', 'B', 'C', 'D'],
            'Grouped source columns should be replaced by the group column.'
        );
        strictEqual(
            presentationTable.columns.A,
            void 0,
            'The grouped column should not be present in the projection.'
        );
        deepStrictEqual(
            presentationTable.columns.group,
            ['North', null, null, 'South', null],
            'Generated parent rows should show unique group values.'
        );
        deepStrictEqual(
            presentationTable.columns.B,
            [null, 'Alpha', 'Beta', null, 'Gamma'],
            'Child rows should keep values from remaining columns.'
        );
        deepStrictEqual(
            grid.viewport.columns.map((column: AnyRecord): string => column.id),
            ['group', 'B', 'C', 'D'],
            'The rendered columns should match the grouped projection.'
        );
        deepStrictEqual(
            projectionState?.rowIds.map((rowId): number | undefined =>
                projectionState.rowsById.get(rowId)?.depth
            ),
            [0, 1, 1, 0, 1],
            'Grouping by one column should produce a depth-1 tree.'
        );
        strictEqual(
            grid.treeView?.options?.treeColumn,
            'group',
            'The group column should be the default tree column.'
        );

        grid.destroy();
    });

    it('should project flat rows grouped by multiple source columns', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['EMEA', 'EMEA', 'EMEA', 'APAC'],
                    segment: ['Retail', 'Retail', 'Enterprise', 'Retail'],
                    product: ['A', 'B', 'C', 'D'],
                    amount: [5, 7, 11, 13]
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: ['region', 'segment']
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'amount',
                aggregator: 'SUM'
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);
        const projectionState = grid.treeView?.getProjectionState();

        deepStrictEqual(
            presentationTable.getColumnIds(),
            ['group', 'product', 'amount'],
            'All grouped source columns should be hidden from the projection.'
        );
        strictEqual(
            presentationTable.columns.region,
            void 0,
            'The first grouped source column should be hidden.'
        );
        strictEqual(
            presentationTable.columns.segment,
            void 0,
            'The second grouped source column should be hidden.'
        );
        deepStrictEqual(
            presentationTable.columns.group,
            [
                'EMEA',
                'Retail',
                null,
                null,
                'Enterprise',
                null,
                'APAC',
                'Retail',
                null
            ],
            'Generated parent rows should show their grouping level value.'
        );
        deepStrictEqual(
            presentationTable.columns.product,
            [
                null,
                null,
                'A',
                'B',
                null,
                'C',
                null,
                null,
                'D'
            ],
            'Leaf rows should keep remaining source column values.'
        );
        deepStrictEqual(
            presentationTable.columns.amount,
            [23, 12, 5, 7, 11, 11, 13, 13, 13],
            'Generated group parents should participate in aggregation.'
        );
        deepStrictEqual(
            projectionState?.rowIds.map((rowId): number | undefined =>
                projectionState.rowsById.get(rowId)?.depth
            ),
            [0, 1, 2, 2, 1, 2, 0, 1, 2],
            'Grouping by two columns should produce a depth-2 tree.'
        );

        grid.destroy();
    });

    it('should hide configured grouping source columns from rendered columns', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['North', 'South'],
                    product: ['Alpha', 'Beta'],
                    amount: [1, 2]
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: 'region'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columns: [{
                id: 'region',
                width: 120
            }, {
                id: 'product'
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).getColumnIds(),
            ['group', 'product', 'amount'],
            'The projected table should not include grouped source columns.'
        );
        deepStrictEqual(
            grid.enabledColumns,
            ['group', 'product', 'amount'],
            'Configured grouped source columns should be hidden from render.'
        );
        deepStrictEqual(
            grid.viewport.columns.map((column: AnyRecord): string => column.id),
            ['group', 'product', 'amount'],
            'Rendered columns should match the grouped projection.'
        );

        grid.destroy();
    });

    it('should sort generated group rows by the grouping display column', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['North', 'North', 'South', 'East'],
                    product: ['Alpha', 'Beta', 'Gamma', 'Delta'],
                    amount: [1, 2, 3, 4]
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: 'region'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await grid.setSorting([{
            columnId: 'group',
            order: 'asc'
        }]);

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.group,
            ['East', null, 'North', null, null, 'South', null],
            'Ascending sorting should order generated groups by label.'
        );

        await grid.setSorting([{
            columnId: 'group',
            order: 'desc'
        }]);

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.group,
            ['South', null, 'North', null, null, 'East', null],
            'Descending sorting should order generated groups by label.'
        );

        grid.destroy();
    });

    it('should keep grouped source columns rendered with hideGroupByColumns disabled', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['EMEA', 'EMEA', 'APAC'],
                    segment: ['Retail', 'Enterprise', 'Retail'],
                    product: ['A', 'B', 'C']
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: ['region', 'segment'],
                hideGroupByColumns: false
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);

        deepStrictEqual(
            presentationTable.getColumnIds(),
            ['group', 'region', 'segment', 'product'],
            'Grouped source columns should stay in the projected table.'
        );
        deepStrictEqual(
            presentationTable.columns.region,
            ['EMEA', 'EMEA', 'EMEA', 'EMEA', 'EMEA', 'APAC', 'APAC', 'APAC'],
            'Group rows should repeat the group value of their own level and ' +
            'of their ancestor levels.'
        );
        deepStrictEqual(
            presentationTable.columns.segment,
            [
                null,
                'Retail',
                'Retail',
                'Enterprise',
                'Enterprise',
                null,
                'Retail',
                'Retail'
            ],
            'Deeper grouping levels should stay empty on higher group rows.'
        );
        deepStrictEqual(
            grid.viewport.columns.map((column: AnyRecord): string => column.id),
            ['group', 'region', 'segment', 'product'],
            'Grouped source columns should stay rendered.'
        );

        grid.destroy();
    });

    it('should reject a groupColumnId colliding with a source column', async () => {
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
                        region: ['EMEA', 'EMEA', 'APAC'],
                        account: ['Luma', 'Mercury', 'Harbor']
                    }
                },
                rowGrouping: {
                    enabled: true,
                    groupBy: 'region',
                    groupColumnId: 'region'
                },
                rendering: {
                    rows: {
                        expandedLevels: 'all'
                    }
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            ok(
                consoleErrors.some((args): boolean => String(args[0]).includes(
                    '`rowGrouping.groupColumnId` "region" conflicts with an ' +
                    'existing source column.'
                )),
                'Collision with a source column should be reported.'
            );
            deepStrictEqual(
                (grid.dataProvider as any).getDataTable(true).columns.region,
                ['EMEA', 'EMEA', 'APAC'],
                'The source column should keep its own data unprojected.'
            );

            grid.destroy();
        } finally {
            console.error = originalConsoleError;
        }
    });

    it('should position the group column by header order', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['EMEA', 'EMEA', 'APAC'],
                    account: ['Luma', 'Mercury', 'Harbor'],
                    revenue: [10, 20, 30]
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: 'region'
            },
            header: ['account', 'group', 'revenue']
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        deepStrictEqual(
            grid.viewport.columns.map((column: AnyRecord): string => column.id),
            ['account', 'group', 'revenue'],
            'The group column should follow the configured header order.'
        );

        grid.destroy();
    });

    it('should reset a columnDefaults aggregator with `aggregator: false`', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['EMEA', 'EMEA', 'APAC'],
                    revenue: [10, 20, 30],
                    units: [1, 2, 3]
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: 'region'
            },
            rendering: {
                rows: {
                    expandedLevels: 'all'
                }
            },
            columnDefaults: {
                aggregator: 'SUM'
            },
            columns: [{
                id: 'units',
                aggregator: false
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        const presentationTable = (grid.dataProvider as any).getDataTable(true);

        deepStrictEqual(
            presentationTable.columns.revenue,
            [30, 10, 20, 30, 30],
            'The columnDefaults aggregator should apply to group rows.'
        );
        deepStrictEqual(
            presentationTable.columns.units,
            [null, 1, 2, null, 3],
            'A column with `aggregator: false` should not aggregate.'
        );

        grid.destroy();
    });

    it('should render the default group column header from lang options', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    region: ['North', 'South'],
                    product: ['Alpha', 'Beta']
                }
            },
            rowGrouping: {
                enabled: true,
                groupBy: 'region'
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        // `setHTMLContent` writes to `innerText`, which jsdom does not
        // implement, so the resolved header value is asserted instead.
        const getHeaderText = (columnId: string): string | undefined =>
            grid.viewport.header?.rows[0].cells.find(
                (cell: AnyRecord): boolean => cell.column?.id === columnId
            )?.value;

        strictEqual(
            getHeaderText('group'),
            'Group',
            'The generated group column should use the lang header.'
        );

        await grid.update({
            lang: {
                rowGrouping: {
                    columnHeader: 'Grupa'
                }
            }
        });

        strictEqual(
            getHeaderText('group'),
            'Grupa',
            'The lang header of the group column should be configurable.'
        );

        await grid.update({
            columns: [{
                id: 'group',
                header: {
                    format: 'Region'
                }
            }]
        });

        strictEqual(
            getHeaderText('group'),
            'Region',
            'Configured column header options should win over the lang header.'
        );

        grid.destroy();
    });

    it('should require the enabled option for tree view and row grouping', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, 1],
                    region: ['North', 'North', 'South'],
                    name: ['Parent', 'A', 'B']
                },
                idColumn: 'id'
            },
            treeView: {
                treeColumn: 'name'
            },
            rowGrouping: {
                groupBy: 'region'
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            grid.treeView?.options,
            void 0,
            'Declared options alone should not enable any of the features.'
        );
        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).getColumnIds(),
            ['id', 'parentId', 'region', 'name'],
            'The source table should not be projected when both features ' +
            'are disabled.'
        );

        grid.destroy();
    });

    it('should prefer tree view over row grouping and warn about the conflict', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();
        const originalConsoleWarn = console.warn;
        const consoleWarnings: unknown[][] = [];

        console.warn = (...args: unknown[]): void => {
            consoleWarnings.push(args);
        };

        try {
            const grid = await Grid.grid(el, {
                data: {
                    columns: {
                        id: [1, 2, 3],
                        parentId: [null, 1, 1],
                        region: ['North', 'North', 'South'],
                        name: ['Parent', 'A', 'B']
                    },
                    idColumn: 'id'
                },
                treeView: {
                    enabled: true,
                    treeColumn: 'name'
                },
                rowGrouping: {
                    enabled: true,
                    groupBy: 'region'
                }
            }, true);

            grid.viewport?.resizeObserver?.disconnect();

            strictEqual(
                grid.treeView?.options?.input?.type,
                'parentId',
                'Tree view should take precedence over row grouping.'
            );
            strictEqual(
                consoleWarnings.length,
                1,
                'The feature conflict should be warned about exactly once.'
            );
            strictEqual(
                String(consoleWarnings[0]?.[0]).includes(
                    'cannot be enabled at the same time'
                ),
                true,
                'The warning should explain the feature conflict.'
            );

            await grid.update({
                rendering: {
                    rows: {
                        expandedLevels: 'all'
                    }
                }
            });

            strictEqual(
                consoleWarnings.length,
                1,
                'Unrelated updates should not repeat the conflict warning.'
            );

            await grid.update({
                treeView: {
                    enabled: false
                }
            });

            strictEqual(
                grid.treeView?.options?.input?.type,
                'grouping',
                'Disabling tree view should hand the projection to row ' +
                'grouping.'
            );

            grid.destroy();
        } finally {
            console.warn = originalConsoleWarn;
        }
    });

    it('should seed the expansion state from levels and explicit row IDs', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = await loadGridPro();

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3, 4, 5],
                    parentId: [null, 1, 2, 1, 4],
                    name: ['Root', 'Sales', 'EMEA', 'Marketing', 'Content']
                },
                idColumn: 'id'
            },
            treeView: {
                enabled: true,
                treeColumn: 'name'
            },
            rendering: {
                rows: {
                    expandedLevels: 1
                }
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [1, 2, 4],
            'Only the rows above the configured level should be expanded.'
        );

        await grid.update({
            rendering: {
                rows: {
                    expandedLevels: 1,
                    expandedRowIds: [4]
                }
            }
        });

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [1, 2, 4, 5],
            'Explicit row IDs should expand in addition to the levels.'
        );

        await grid.update({
            rendering: {
                rows: {
                    expandedLevels: 'all',
                    expandedRowIds: []
                }
            }
        });

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [1, 2, 3, 4, 5],
            'All levels should be expanded for `expandedLevels: \'all\'`.'
        );

        grid.destroy();
    });

    // TODO: Remove deprecated option before releasing next major
    it('should support the deprecated data.treeView options', async () => {
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
                    enabled: true,
                    treeColumn: 'name',
                    expandedRowIds: 'all',
                    stickyParents: false
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

        strictEqual(
            grid.treeView?.options?.treeColumn,
            'name',
            'The deprecated data provider options should still be read.'
        );
        strictEqual(
            grid.treeView?.options?.expandedLevels,
            'all',
            'The deprecated `expandedRowIds: \'all\'` should be mapped to ' +
            'expanded levels.'
        );
        strictEqual(
            grid.treeView?.options?.stickyParents,
            false,
            'The deprecated stickyParents option should still be read.'
        );
        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.value,
            [30, 10, 20],
            'The deprecated column aggregator option should still be read.'
        );

        grid.destroy();
    });

    // TODO: Remove deprecated option before releasing next major
    it('should ignore the deprecated data.treeView options when the root option is enabled', async () => {
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
                    enabled: true,
                    treeColumn: 'name',
                    stickyParents: false
                }
            },
            treeView: {
                enabled: true
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        strictEqual(
            grid.treeView?.options?.treeColumn,
            void 0,
            'The root level option should win over the deprecated one ' +
            'entirely.'
        );
        strictEqual(
            grid.treeView?.options?.stickyParents,
            true,
            'Deprecated options moved to rendering.rows should be ignored ' +
            'as well.'
        );

        grid.destroy();
    });
});
