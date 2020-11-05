/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
var MapView = /** @class */ (function () {
    function MapView(chart) {
        this.chart = chart;
        this.center = [0, 0];
        this.zoom = 0;
    }
    MapView.prototype.fitToBounds = function (bounds) {
        var _a = this.chart, plotWidth = _a.plotWidth, plotHeight = _a.plotHeight;
        // 256 is the magic number where a world tile is rendered to a 256/256
        // px square.
        var scaleToPlotArea = Math.max((bounds.e - bounds.w) / (plotWidth / 256), (bounds.s - bounds.n) / (plotHeight / 256));
        this.center = [(bounds.s + bounds.n) / 2, (bounds.e + bounds.w) / 2];
        this.zoom = (Math.log(360 / scaleToPlotArea) / Math.log(2));
    };
    return MapView;
}());
export default MapView;
