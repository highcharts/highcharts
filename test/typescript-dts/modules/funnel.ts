/* *
 *
 *  Test cases for the funnel module declarations.
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts';
import "highcharts/modules/funnel";

test_dataLabelsInside();

/**
 * Tests the documented `dataLabels.inside` option, which is specific to funnel
 * and pyramid and must not leak into the shared pie interface. #24856
 */
function test_dataLabelsInside() {
    Highcharts.chart('container', {
        plotOptions: {
            funnel: {
                dataLabels: {
                    inside: true
                }
            }
        },
        series: [{
            type: 'funnel',
            data: [['Visit', 15654], ['Sign-up', 4064]],
            dataLabels: {
                inside: false
            }
        }]
    });
}
