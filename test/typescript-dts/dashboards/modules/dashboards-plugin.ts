/* *
 *
 *  Test cases for modules/dashboards-plugin.d.ts
 *
 *  (c) 2023 Highsoft AS. All rights reserved.
 *
 * */

import * as Dashboards from "@highcharts/dashboards";
import DashboardsPlugin from "@highcharts/dashboards/modules/dashboards-plugin";

DashboardsPlugin(Dashboards);

test_HighchartsPlugin();

/**
 * Tests HighchartsPlugin.
 */
function test_HighchartsPlugin() {
    Dashboards.HighchartsPlugin.custom.connectHighcharts((Dashboards.win as any).Highcharts);
}
