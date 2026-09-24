/* *
 *
 *  Test cases for the sankey module declarations.
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import 'highcharts/modules/sankey';

test_borderRadius();

/**
 * Tests the documented `borderRadius` option, which sankey inherits from
 * column and which accepts both the shorthand and the object form. #24856
 */
function test_borderRadius() {
    Highcharts.chart('container', {
        plotOptions: {
            sankey: {
                borderRadius: 4
            }
        },
        series: [{
            type: 'sankey',
            borderRadius: {
                radius: 4
            },
            data: [['Brazil', 'Portugal', 5], ['Brazil', 'France', 1]]
        }]
    });
}
