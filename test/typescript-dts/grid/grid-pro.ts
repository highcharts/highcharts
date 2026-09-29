/* *
 *
 *  Test cases for grid-pro.d.ts
 *
 *  (c) 2023 Highsoft AS. All rights reserved.
 *
 * */

import * as Grid from '@highcharts/grid/es-modules/masters/grid-pro.src';

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
            getLabel: function (context) {
                context.grid;
                return 'Sample actions';
            },
            icon: 'customPinIcon',
            isVisible: function (context) {
                context.grid;
                return true;
            },
            items: ['showCellValue']
        }
    );

    const grid = Grid.grid('container', {
        data: {
            providerType: 'remote',
            fetchCallback: async () => {
                return {
                    columns: {
                        x: ['A', 'B', 'C'],
                        y: [1, 2, 3],
                        hidden: [0, 0, 0]
                    },
                    totalRowCount: 3
                };
            }
        },
        tableEditing: {
            enabled: true
        },
        lang: {
            rowPinning: {
                label: 'Pinning',
                pinRowTop: 'Pin to top',
                pinRowBottom: 'Pin to bottom',
                unpinRow: 'Unpin'
            },
            pinRowTop: 'Legacy pin to top',
            pinRowBottom: 'Legacy pin to bottom',
            unpinRow: 'Legacy unpin',
            tableEditing: {
                rows: 'Rows',
                columns: 'Columns',
                addRowAbove: 'Add row above',
                addRowBelow: 'Add row below',
                deleteRow: 'Delete row',
                addColumnBefore: 'Add column before',
                addColumnAfter: 'Add column after',
                deleteColumn: 'Delete column'
            }
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
            icons: {
                customPinIcon: {
                    width: 16,
                    height: 16,
                    children: [{
                        d: 'M 2 8 L 6 12 L 14 3'
                    }]
                }
            },
            columns: {
                resizing: {
                    mode: 'distributed'
                }
            },
            rows: {
                pinning: {
                    enabled: true,
                    events: {
                        beforeRowPin: function (e): void {
                            e.target;
                        },
                        afterRowPin: function (e): void {
                            e.target;
                        }
                    }
                }
            }
        },
        columns: [{
            id: 'hidden',
            enabled: false,
            cells: {
                editMode: {
                    enabled: true,
                    renderer: {
                        type: 'textInput'
                    }
                },
                contextMenu: {
                    items: [
                        'pinning',
                        'rows',
                        {
                            type: 'group',
                            groupId: 'columns'
                        },
                        {
                            type: 'action',
                            actionId: 'pinRowTop',
                            icon: 'customPinIcon'
                        },
                        {
                            actionId: 'addRowAbove'
                        },
                        {
                            actionId: 'deleteColumn'
                        },
                        {
                            type: 'group',
                            groupId: 'pinning'
                        },
                        {
                            type: 'separator'
                        },
                        {
                            type: 'submenu',
                            label: 'More',
                            items: [{
                                label: 'Custom',
                                onClick: function (cell): void {
                                    cell.row.id;
                                }
                            }]
                        }
                    ]
                },
                renderer: {
                    type: 'select',
                    options: [
                        { value: '1', label: 'A' },
                        { value: '2', label: 'B' },
                        { value: '3', label: 'C' }
                    ]
                }
            }
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

    grid.rowPinning?.pin('A');
    grid.rowPinning?.pin('A', 'top');
    grid.rowPinning?.toggle('A');
    grid.rowPinning?.toggle('A', 'bottom');
    grid.rowPinning?.unpin('A');
    grid.rowPinning?.getPinnedRows();
    grid.tableEditing?.isEnabled();
}
