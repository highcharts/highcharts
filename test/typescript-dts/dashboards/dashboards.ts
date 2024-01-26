/* *
 *
 *  Test cases for dashboards.d.ts
 *
 *  (c) 2023 Highsoft AS. All rights reserved.
 *
 * */

import * as Dashboards from "@highcharts/dashboards";

test_board();

/**
 * Tests board options.
 */
function test_board() {
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: "My Data",
                type: "CSV",
                options: {
                    csv: ''
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'cell1'
                    }]
                }]
            }]
        },
        components: [{
            type: 'HTML',
            cell: 'cell1',
            title: {
                className: 'custom-title',
                text: 'My title',
                style: {
                    color: 'red'
                }
            }
        }]
    });
}
