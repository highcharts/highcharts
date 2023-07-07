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
            connectors: []
        }
    });
}
