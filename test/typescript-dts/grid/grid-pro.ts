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

    Grid.grid('container', {
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
}
