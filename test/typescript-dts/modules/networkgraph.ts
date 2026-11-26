import * as Highcharts from 'highcharts';
import 'highcharts/modules/networkgraph';

test_nodeColor();

/**
 * Tests a gradient as the color of a networkgraph node. #25548
 */
function test_nodeColor() {
    const node: Highcharts.SeriesNetworkgraphNodesOptions = {
        id: 'a',
        color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [[0, '#ff0000'], [1, '#0000ff']]
        }
    };
}
