/* *
 *
 *  Test cases for grid-lite.d.ts
 *
 *  (c) 2023 Highsoft AS. All rights reserved.
 *
 * */

import * as Grid from '@highcharts/grid/es-modules/masters/grid-lite.src';

test_grid();

/**
 * Tests grid options.
 */
function test_grid() {

    Grid.CellContextMenuBuiltInActions.registerBuiltInAction(
        'showCellValue',
        {
            getLabel: function () {
                return 'Show cell value';
            },
            icon: 'checkmark',
            onClick: function (context): void {
                context.cell.row.id;
            }
        }
    );

    Grid.CellContextMenuBuiltInActions.registerBuiltInGroup(
        'sampleActions',
        {
            isVisible: function (context) {
                context.grid;
                return true;
            },
            items: ['showCellValue']
        }
    );

    Grid.ContextMenu.registerItem('showColumnId', {
        icon: 'checkmark',
        label: (context): string => context.target.column.id,
        targets: ['cell'],
        visible: (context): boolean => context.target.row.id !== void 0,
        onClick: function (cell): void {
            cell.row.id;
        }
    });

    Grid.ContextMenu.registerItem('sampleGroup', {
        defaultIn: ['cell'],
        items: ['showColumnId', 'showCellValue'],
        label: 'Sample group'
    });

    const dataTable = new Grid.DataTable({
        columns: {
            x: ['A', 'B', 'C'],
            y: [1, 2, 3],
            hidden: [0, 0, 0]
        }
    });

    const grid = Grid.grid('container', {
        data: {
            dataTable,
            idColumn: 'x'
        },
        header: [{
            format: 'grouped header',
            columns: [{
                columnId: 'x'
            }, {
                columnId: 'y'
            }]
        }, 'hidden'],
        rendering: {
            columns: {
                resizing: {
                    mode: 'distributed'
                }
            }
        },
        columnDefaults: {
            cells: {
                contextMenu: {
                    enabled: true,
                    items: [
                        {
                            label: 'Test',
                            onClick: function () {
                                // noop
                            }
                        }
                    ]
                }
            }
        },
        lang: {
            setFilter: 'Set filter',
            filterValuePlaceholder: 'Value...',
            columnFilteringOperators: {
                contains: 'Contains'
            },
            columnFilteringDateTimeOperators: {
                greaterThan: 'After'
            },
            // Deprecated in 3.1.0, replaced by columnFilteringOperators.
            columnFilteringConditions: {
                contains: 'Contains'
            }
        },
        columns: [{
            id: 'x',
            filtering: {
                enabled: true,
                operators: ['contains', 'beginsWith'],
                rule: {
                    operator: 'contains',
                    value: 'A'
                }
            }
        }, {
            id: 'y',
            filtering: {
                enabled: true,
                // Deprecated in 3.1.0: `conditions` became `operators`, and
                // `condition` and `value` moved into `rule`.
                conditions: ['greaterThan', 'lessThan'],
                condition: 'greaterThan',
                value: 1
            }
        }, {
            id: 'hidden',
            enabled: false
        }],
        responsive: {
            rules: [{
                condition: {
                    minHeight: 500
                },
                gridOptions: {
                    header: ['x']
                }
            }]
        }
    });
}
