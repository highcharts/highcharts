/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import H from '../../Core/Globals.js';
var noop = H.noop;
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, _a = SeriesRegistry.seriesTypes, AreaSeries = _a.area, LineSeries = _a.line, ScatterSeries = _a.scatter;
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
import '../../Core/Legend.js';
/* *
 *
 * Class
 *
 * */
var PolygonSeries = /** @class */ (function (_super) {
    __extends(PolygonSeries, _super);
    function PolygonSeries() {
        /* *
         *
         * Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    PolygonSeries.prototype.getGraphPath = function () {
        var graphPath = LineSeries.prototype.getGraphPath.call(this), i = graphPath.length + 1;
        // Close all segments
        while (i--) {
            if ((i === graphPath.length || graphPath[i][0] === 'M') && i > 0) {
                graphPath.splice(i, 0, ['Z']);
            }
        }
        this.areaPath = graphPath;
        return graphPath;
    };
    PolygonSeries.prototype.drawGraph = function () {
        // Hack into the fill logic in area.drawGraph
        this.options.fillColor = this.color;
        AreaSeries.prototype.drawGraph.call(this);
    };
    /**
     * A polygon series can be used to draw any freeform shape in the cartesian
     * coordinate system. A fill is applied with the `color` option, and
     * stroke is applied through `lineWidth` and `lineColor` options.
     *
     * @sample {highcharts} highcharts/demo/polygon/
     *         Polygon
     * @sample {highstock} highcharts/demo/polygon/
     *         Polygon
     *
     * @extends      plotOptions.scatter
     * @since        4.1.0
     * @excluding    jitter, softThreshold, threshold, cluster, boostThreshold,
     *               boostBlending
     * @product      highcharts highstock
     * @requires     highcharts-more
     * @optionparent plotOptions.polygon
     */
    PolygonSeries.defaultOptions = merge(ScatterSeries.defaultOptions, {
        marker: {
            enabled: false,
            states: {
                hover: {
                    enabled: false
                }
            }
        },
        stickyTracking: false,
        tooltip: {
            followPointer: true,
            pointFormat: ''
        },
        trackByArea: true
    });
    return PolygonSeries;
}(ScatterSeries));
extend(PolygonSeries.prototype, {
    type: 'polygon',
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    drawTracker: Series.prototype.drawTracker,
    setStackedPoints: noop // No stacking points on polygons (#5310)
});
SeriesRegistry.registerSeriesType('polygon', PolygonSeries);
/* *
 *
 * Export
 *
 * */
export default PolygonSeries;
/* *
 *
 * API Options
 *
 * */
/**
 * A `polygon` series. If the [type](#series.polygon.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.polygon
 * @excluding dataParser, dataURL, stack, boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @apioption series.polygon
 */
/**
 * An array of data points for the series. For the `polygon` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 10],
 *        [1, 3],
 *        [2, 1]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.polygon.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 8,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.polygon.data
 */
''; // adds doclets above to transpiled file
