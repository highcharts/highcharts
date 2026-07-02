/* *
 *
 *  Test cases for dashboards module DTS entrypoints.
 *
 *  (c) 2026 Highsoft AS. All rights reserved.
 *
 * */

import * as Dashboards from '@highcharts/dashboards';
import '@highcharts/dashboards/modules/layout';
import '@highcharts/dashboards/modules/math-modifier';

test_modules();

/**
 * Tests classic Dashboards module declarations.
 */
function test_modules() {
    Dashboards.EditMode;
    Dashboards.Formula;
    Dashboards.Fullscreen;
}
