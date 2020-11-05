/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type LatLng = [number, number];
        type MapBounds = { n: number; e: number; s: number; w: number };

    }
}
class MapView {

    public constructor(
        chart: Chart
    ) {
        this.chart = chart;
        this.center = [0, 0];
        this.zoom = 0;
    }
    public center: Highcharts.LatLng;
    public zoom: number;

    private chart: Chart;

    public fitToBounds(bounds: Highcharts.MapBounds): void {

        const { plotWidth, plotHeight } = this.chart;
        // 256 is the magic number where a world tile is rendered to a 256/256
        // px square.
        const scaleToPlotArea = Math.max(
            (bounds.e - bounds.w) / (plotWidth / 256),
            (bounds.s - bounds.n) / (plotHeight / 256)
        );

        this.center = [(bounds.s + bounds.n) / 2, (bounds.e + bounds.w) / 2];
        this.zoom = (Math.log(360 / scaleToPlotArea) / Math.log(2));
    }
}
export default MapView;
