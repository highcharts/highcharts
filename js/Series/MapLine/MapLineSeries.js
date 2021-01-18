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
import MapSeries from '../Map/MapSeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series;
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.mapline
 *
 * @augments Highcharts.Series
 */
var MapLineSeries = /** @class */ (function (_super) {
    __extends(MapLineSeries, _super);
    function MapLineSeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Get presentational attributes
     *
     * @private
     * @function Highcharts.seriesTypes.mapline#pointAttribs
     * @param {Highcharts.Point} point
     * @param {string} state
     * @return {Highcharts.SVGAttributes}
     */
    MapLineSeries.prototype.pointAttribs = function (point, state) {
        var attr = MapSeries.prototype.pointAttribs.call(this, point, state);
        // The difference from a map series is that the stroke takes the
        // point color
        attr.fill = this.options.fillColor;
        return attr;
    };
    /**
     * A mapline series is a special case of the map series where the value
     * colors are applied to the strokes rather than the fills. It can also be
     * used for freeform drawing, like dividers, in the map.
     *
     * @sample maps/demo/mapline-mappoint/
     *         Mapline and map-point chart
     *
     * @extends      plotOptions.map
     * @product      highmaps
     * @optionparent plotOptions.mapline
     */
    MapLineSeries.defaultOptions = merge(MapSeries.defaultOptions, {
        /**
         * The width of the map line.
         */
        lineWidth: 1,
        /**
         * Fill color for the map line shapes
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        fillColor: 'none'
    });
    return MapLineSeries;
}(MapSeries));
extend(MapLineSeries.prototype, {
    type: 'mapline',
    colorProp: 'stroke',
    drawLegendSymbol: Series.prototype.drawLegendSymbol,
    pointAttrToOptions: {
        'stroke': 'color',
        'stroke-width': 'lineWidth'
    }
});
SeriesRegistry.registerSeriesType('mapline', MapLineSeries);
/* *
 *
 *  Default Export
 *
 * */
export default MapLineSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A `mapline` series. If the [type](#series.mapline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.mapline
 * @excluding dataParser, dataURL, marker
 * @product   highmaps
 * @apioption series.mapline
 */
/**
 * An array of data points for the series. For the `mapline` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `value` options. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `[hc-key, value]`. Example:
 *
 *  ```js
 *     data: [
 *         ['us-ny', 0],
 *         ['us-mi', 5],
 *         ['us-tx', 3],
 *         ['us-ak', 5]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.map.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         value: 6,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         value: 6,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<number|Array<string,(number|null)>|null|*>}
 * @product   highmaps
 * @apioption series.mapline.data
 */
''; // adds doclets above to transpiled file
