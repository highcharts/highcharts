/* *
 *
 *  Test cases for highcharts.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Dashboards from "@highcharts/dashboards";

test_board();

/**
 * Tests board options.
 */
function test_board() {
    Dashboards.board('container', {});
}
