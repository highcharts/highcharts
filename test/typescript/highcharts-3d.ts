/* *
 *
 *  Test cases for highcharts-3d.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';

Highcharts3D(Highcharts);

test_3DColumn();

/**
 * Tests Highcharts.seriesTypes.column in a 3D use case.
 *
 * @todo
 * - Make test more complex.
 */
function test_3DColumn() {
    Highcharts.chart('container', {
        title: {
            text: 'Chart rotation demo'
        },
        chart: {
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        series: [{
            type: 'column',
            data: [29.9, 71.5, 106.4, 129.2, 144.0]
        }]
    });
}
