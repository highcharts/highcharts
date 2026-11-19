import * as Highcharts from 'highcharts';
import 'highcharts/modules/pathfinder';

test_markerOffset();

/**
 * Tests the `xOffset` and `yOffset` members of the connector markers. #25548
 */
function test_markerOffset() {
    const marker: Highcharts.ConnectorsMarkerOptions = { xOffset: -5, yOffset: 5 };
    const startMarker: Highcharts.ConnectorsStartMarkerOptions = { xOffset: -5, yOffset: 5 };
    const endMarker: Highcharts.ConnectorsEndMarkerOptions = { xOffset: -5, yOffset: 5 };
}
