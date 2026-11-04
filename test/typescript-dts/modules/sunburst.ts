/* *
 *
 *  Test cases for the sunburst module declarations.
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import 'highcharts/modules/sunburst';

test_levels();

/**
 * Tests the documented `levels[].levelIsConstant` option. #24856
 */
function test_levels() {
    Highcharts.chart('container', {
        series: [{
            type: 'sunburst',
            data: [{
                id: '0.0',
                parent: '',
                name: 'root'
            }],
            levels: [{
                level: 1,
                levelIsConstant: false,
                colorByPoint: true
            }]
        }]
    });
}
