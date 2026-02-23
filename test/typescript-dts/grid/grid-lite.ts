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

    const dataTable = new Grid.DataTable({
        columns: {
            x: ['A', 'B', 'C'],
            y: [1, 2, 3],
            hidden: [0, 0, 0]
        }
    });

    const grid = Grid.grid('container', {
        dataTable,
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
            },
            rows: {
                pinning: {
                    enabled: true,
                    topIds: ['A'],
                    bottomIds: ['C'],
                    top: {
                        maxHeight: 120
                    },
                    bottom: {
                        maxHeight: '25%'
                    }
                }
            }
        },
        columnDefaults: {
            cells: {
                contextMenu: {
                    enabled: true,
                    items: [
                        'pinRowTop',
	                        {
	                            actionId: 'unpinRow',
	                            label: 'Unpin now',
	                            icon: 'unpin'
	                        },
                        {
                            label: 'Pinning',
                            items: [
                                {
                                    actionId: 'pinRowBottom',
                                    items: [{
                                        label: 'Leaf action',
                                        onClick: function () {
                                            // noop
                                        }
                                    }]
                                }
                            ]
                        },
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
        columns: [{
            id: 'hidden',
            enabled: false
        }]
    });

    grid.pinRow('A');
    grid.pinRow('A', 'top');
    grid.toggleRow('A');
    grid.toggleRow('A', 'bottom');
    grid.unpinRow('A');
    grid.getPinnedRows();
}
