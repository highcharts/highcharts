/* *
 *
 *  Test cases for dashboards.d.ts
 *
 *  (c) 2023 Highsoft AS. All rights reserved.
 *
 * */

import * as Dashboards from "@highcharts/dashboards";
import * as Grid from '@highcharts/dashboards/datagrid';

test_board();
test_grid();

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
            renderTo: 'cell1',
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

/**
 * Tests grid options.
 */
function test_grid() {
    Grid.grid('container', {
        dataTable: {
            columns: {
                a: new Float32Array([1, 2, 3]),
            }
        },
        columnDefaults: {
            cells: {
                editable: true
            }
        },
        columns: [{
            id: 'a',
            cells: {
                editable: true
            }
        }],
        events: {
            column: {
                afterResize: function () {
                    console.log(this.viewport.dataGrid);
                }
            }
        }
    });
}

/**
 * Tests HighchartsPlugin.
 */
function test_HighchartsPlugin() {
    Dashboards.HighchartsPlugin.custom.connectHighcharts((Dashboards.win as any).Highcharts);
}
