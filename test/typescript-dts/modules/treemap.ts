/* *
 *
 *  Test cases for the treemap module declarations.
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import 'highcharts/modules/treemap';

test_levels();
test_borderColor();

/**
 * Tests the documented `levels[].levelIsConstant` and `levels[].groupPadding`
 * options. #24856
 */
function test_levels() {
    Highcharts.chart('container', {
        series: [{
            type: 'treemap',
            layoutAlgorithm: 'squarified',
            data: [{ name: 'A', value: 6 }],
            levels: [{
                level: 1,
                levelIsConstant: false,
                groupPadding: 3
            }]
        }]
    });
}

/**
 * Tests the documented series-level `borderColor` option. #24856
 */
function test_borderColor() {
    Highcharts.chart('container', {
        plotOptions: {
            treemap: {
                borderColor: '#e6e6e6'
            }
        },
        series: [{
            type: 'treemap',
            borderColor: '#e6e6e6',
            data: [{ name: 'A', value: 6 }]
        }]
    });
}
