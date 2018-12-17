/* *
 *
 *  Test cases for highcharts-more.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

test_AreaRange();

/**
 * Tests Highcharts.seriesTypes.arearange in a complex use case.
 *
 * @todo
 *  - Make it more complex.
 */
function test_AreaRange() {
    Highcharts.chart('container', {
        title: {
            text: 'Temperature variation by day'
        },
        chart: {
            polar: true
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                // general options for all series
            },
            arearange: {
                // shared options for all arearange series
            }
        },
        series: [{
            // specific options for this series instance
            name: 'Temperatures',
            type: 'arearange',
            data: [
                [1483232400000, 1.4, 4.7],
                [1483318800000, -1.3, 1.9],
                [1483405200000, -0.7, 4.3],
                [1483491600000, -5.5, 3.2],
                [1483578000000, -9.9, -6.6]
            ],
            color: '#C00'
        }],
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: undefined
            }
        }
    });
}
