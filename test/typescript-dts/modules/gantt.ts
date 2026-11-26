import * as Highcharts from 'highcharts';
import 'highcharts/modules/gantt';

test_borderRadius();

/**
 * Tests a percentage `borderRadius` on gantt and xrange, as on column. #25548
 */
function test_borderRadius() {
    const gantt: Highcharts.PlotGanttOptions = { borderRadius: '50%' };
    const xrange: Highcharts.PlotXrangeOptions = { borderRadius: '50%' };
}
