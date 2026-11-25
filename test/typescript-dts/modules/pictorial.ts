import * as Highcharts from 'highcharts';
import 'highcharts/modules/pictorial';

test_data();

/**
 * Tests plain numbers as pictorial point options. #25548
 */
function test_data() {
    const series: Highcharts.SeriesPictorialOptions = {
        type: 'pictorial',
        data: [6500]
    };
}
