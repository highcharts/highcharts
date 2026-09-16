/* *
 *
 *  Test cases for the arc-diagram module declarations.
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import 'highcharts/modules/arc-diagram';

test_dataLabelsPadding();

/**
 * Tests the documented `dataLabels.padding` option, which is a number (or an
 * array of numbers) rather than an opaque object. The type is inherited from
 * `plotOptions.series.dataLabels`, so this covers every series type. #24856
 */
function test_dataLabelsPadding() {
    Highcharts.chart('container', {
        plotOptions: {
            arcdiagram: {
                dataLabels: {
                    padding: 5
                }
            },
            series: {
                dataLabels: {
                    padding: [1, 3]
                }
            }
        },
        series: [{
            type: 'line',
            dataLabels: {
                padding: 5
            },
            data: [1, 2, 3]
        }]
    });
}
