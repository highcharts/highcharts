/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Øystein Moseng
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
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, ColumnSeries = _a.column, HeatmapSeries = _a.heatmap, ScatterSeries = _a.scatter;
import TilemapPoint from './TilemapPoint.js';
import TilemapShapes from './TilemapShapes.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
import './TilemapComposition.js';
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.tilemap
 *
 * @augments Highcharts.Series
 */
var TilemapSeries = /** @class */ (function (_super) {
    __extends(TilemapSeries, _super);
    function TilemapSeries() {
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
        _this.tileShape = void 0;
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
     * Use the shape's defined data label alignment function.
     * @private
     */
    TilemapSeries.prototype.alignDataLabel = function () {
        return this.tileShape.alignDataLabel.apply(this, Array.prototype.slice.call(arguments));
    };
    TilemapSeries.prototype.drawPoints = function () {
        var _this = this;
        // In styled mode, use CSS, otherwise the fill used in the style
        // sheet will take precedence over the fill attribute.
        ColumnSeries.prototype.drawPoints.call(this);
        this.points.forEach(function (point) {
            point.graphic &&
                point.graphic[_this.chart.styledMode ? 'css' : 'animate'](_this.colorAttribs(point));
        });
    };
    /**
     * Get metrics for padding of axis for this series.
     * @private
     */
    TilemapSeries.prototype.getSeriesPixelPadding = function (axis) {
        var isX = axis.isXAxis, padding = this.tileShape.getSeriesPadding(this), coord1, coord2;
        // If the shape type does not require padding, return no-op padding
        if (!padding) {
            return {
                padding: 0,
                axisLengthFactor: 1
            };
        }
        // Use translate to compute how far outside the points we
        // draw, and use this difference as padding.
        coord1 = Math.round(axis.translate(isX ?
            padding.xPad * 2 :
            padding.yPad, 0, 1, 0, 1));
        coord2 = Math.round(axis.translate(isX ? padding.xPad : 0, 0, 1, 0, 1));
        return {
            padding: Math.abs(coord1 - coord2) || 0,
            // Offset the yAxis length to compensate for shift. Setting the
            // length factor to 2 would add the same margin to max as min.
            // Now we only add a slight bit of the min margin to max, as we
            // don't actually draw outside the max bounds. For the xAxis we
            // draw outside on both sides so we add the same margin to min
            // and max.
            axisLengthFactor: isX ? 2 : 1.1
        };
    };
    /**
     * Set tile shape object on series.
     * @private
     */
    TilemapSeries.prototype.setOptions = function () {
        // Call original function
        var ret = _super.prototype.setOptions.apply(this, Array.prototype.slice.call(arguments));
        this.tileShape = TilemapShapes[ret.tileShape];
        return ret;
    };
    /**
     * Use translate from tileShape.
     * @private
     */
    TilemapSeries.prototype.translate = function () {
        return this.tileShape.translate.apply(this, Array.prototype.slice.call(arguments));
    };
    /**
     * A tilemap series is a type of heatmap where the tile shapes are
     * configurable.
     *
     * @sample highcharts/demo/honeycomb-usa/
     *         Honeycomb tilemap, USA
     * @sample maps/plotoptions/honeycomb-brazil/
     *         Honeycomb tilemap, Brazil
     * @sample maps/plotoptions/honeycomb-china/
     *         Honeycomb tilemap, China
     * @sample maps/plotoptions/honeycomb-europe/
     *         Honeycomb tilemap, Europe
     * @sample maps/demo/circlemap-africa/
     *         Circlemap tilemap, Africa
     * @sample maps/demo/diamondmap
     *         Diamondmap tilemap
     *
     * @extends      plotOptions.heatmap
     * @since        6.0.0
     * @excluding    jitter, joinBy, shadow, allAreas, mapData, marker, data,
     *               dataSorting, boostThreshold, boostBlending
     * @product      highcharts highmaps
     * @requires     modules/tilemap.js
     * @optionparent plotOptions.tilemap
     */
    TilemapSeries.defaultOptions = merge(HeatmapSeries.defaultOptions, {
        // Remove marker from tilemap default options, as it was before
        // heatmap refactoring.
        marker: null,
        states: {
            hover: {
                halo: {
                    enabled: true,
                    size: 2,
                    opacity: 0.5,
                    attributes: {
                        zIndex: 3
                    }
                }
            }
        },
        /**
         * The padding between points in the tilemap.
         *
         * @sample maps/plotoptions/tilemap-pointpadding
         *         Point padding on tiles
         */
        pointPadding: 2,
        /**
         * The column size - how many X axis units each column in the tilemap
         * should span. Works as in [Heatmaps](#plotOptions.heatmap.colsize).
         *
         * @sample {highcharts} maps/demo/heatmap/
         *         One day
         * @sample {highmaps} maps/demo/heatmap/
         *         One day
         *
         * @type      {number}
         * @default   1
         * @product   highcharts highmaps
         * @apioption plotOptions.tilemap.colsize
         */
        /**
         * The row size - how many Y axis units each tilemap row should span.
         * Analogous to [colsize](#plotOptions.tilemap.colsize).
         *
         * @sample {highcharts} maps/demo/heatmap/
         *         1 by default
         * @sample {highmaps} maps/demo/heatmap/
         *         1 by default
         *
         * @type      {number}
         * @default   1
         * @product   highcharts highmaps
         * @apioption plotOptions.tilemap.rowsize
         */
        /**
         * The shape of the tiles in the tilemap. Possible values are `hexagon`,
         * `circle`, `diamond`, and `square`.
         *
         * @sample maps/demo/circlemap-africa
         *         Circular tile shapes
         * @sample maps/demo/diamondmap
         *         Diamond tile shapes
         *
         * @type {Highcharts.TilemapShapeValue}
         */
        tileShape: 'hexagon'
    });
    return TilemapSeries;
}(HeatmapSeries));
extend(TilemapSeries.prototype, {
    // Revert the noop on getSymbol.
    getSymbol: noop,
    // Use drawPoints, markerAttribs, pointAttribs methods from the old
    // heatmap implementation.
    // TODO: Consider standarizing heatmap and tilemap into more
    // consistent form.
    markerAttribs: ScatterSeries.prototype.markerAttribs,
    pointAttribs: ColumnSeries.prototype.pointAttribs,
    pointClass: TilemapPoint
});
SeriesRegistry.registerSeriesType('tilemap', TilemapSeries);
/* *
 *
 *  Default Export
 *
 * */
export default TilemapSeries;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * @typedef {"circle"|"diamond"|"hexagon"|"square"} Highcharts.TilemapShapeValue
 */
''; // detach doclets above
/* *
 *
 *  API Options
 *
 * */
/**
 * A `tilemap` series. If the [type](#series.tilemap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.tilemap
 * @excluding allAreas, dataParser, dataURL, joinBy, mapData, marker,
 *            pointRange, shadow, stack, dataSorting, boostThreshold,
 *            boostBlending
 * @product   highcharts highmaps
 * @requires  modules/tilemap.js
 * @apioption series.tilemap
 */
/**
 * An array of data points for the series. For the `tilemap` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,y,value`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 9, 7],
 *        [1, 10, 4],
 *        [2, 6, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The objects are point configuration
 *    objects as seen below. If the total number of data points exceeds the
 *    series' [turboThreshold](#series.tilemap.turboThreshold), this option is
 *    not available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 3,
 *        value: 10,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 7,
 *        value: 10,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
 * coordinates are offset.
 *
 * @sample maps/series/tilemap-gridoffset
 *         Offset grid coordinates
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.heatmap.data
 * @excluding marker
 * @product   highcharts highmaps
 * @apioption series.tilemap.data
 */
/**
 * The color of the point. In tilemaps the point color is rarely set
 * explicitly, as we use the color to denote the `value`. Options for
 * this are set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highmaps
 * @apioption series.tilemap.data.color
 */
/**
 * The x coordinate of the point.
 *
 * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
 * coordinates are offset.
 *
 * @sample maps/series/tilemap-gridoffset
 *         Offset grid coordinates
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.tilemap.data.x
 */
/**
 * The y coordinate of the point.
 *
 * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
 * coordinates are offset.
 *
 * @sample maps/series/tilemap-gridoffset
 *         Offset grid coordinates
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.tilemap.data.y
 */
''; // adds doclets above to the transpiled file
