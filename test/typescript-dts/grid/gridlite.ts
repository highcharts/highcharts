/* *
 *
 *  Test cases for gridlite.d.ts
 *
 *  (c) 2023 Highsoft AS. All rights reserved.
 *
 * */

import * as Grid from '@highcharts/grid/gridlite';

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

    Grid.grid('container', {
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
                distribution: 'fixed'
            }
        },
        columns: [{
            id: 'hidden',
            enabled: false
        }]
    });
}
