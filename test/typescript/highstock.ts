/* *
 *
 *  Test cases for highstock.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts/highstock';

test_seriesLine();

/**
 * Tests Highcharts.seriesTypes.line in a simple use case.
 */
function test_seriesLine() {
    const lineData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    Highcharts.stockChart('container', {
        chart: {
            borderWidth: 1
        },
        rangeSelector: {
            selected: 1
        },
        navigator: {
            series: {
                data: lineData
            }
        },
        series: [{
            type: 'line',
            data: lineData,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}
