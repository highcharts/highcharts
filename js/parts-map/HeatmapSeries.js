/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
/* *
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 */ /**
* Heatmap series only. Point padding for a single point.
* @name Highcharts.PointOptionsObject#pointPadding
* @type {number|undefined}
*/ /**
* Heatmap series only. The value of the point, resulting in a color controled
* by options as set in the colorAxis configuration.
* @name Highcharts.PointOptionsObject#value
* @type {number|null|undefined}
*/
import U from '../parts/Utilities.js';
var clamp = U.clamp, extend = U.extend, pick = U.pick;
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/Legend.js';
import './ColorMapSeriesMixin.js';
var colorMapPointMixin = H.colorMapPointMixin, colorMapSeriesMixin = H.colorMapSeriesMixin, LegendSymbolMixin = H.LegendSymbolMixin, merge = H.merge, noop = H.noop, fireEvent = H.fireEvent, Series = H.Series, seriesType = H.seriesType, seriesTypes = H.seriesTypes;
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.heatmap
 *
 * @augments Highcharts.Series
 */
seriesType('heatmap', 'scatter', 
/**
 * A heatmap is a graphical representation of data where the individual
 * values contained in a matrix are represented as colors.
 *
 * @productdesc {highcharts}
 * Requires `modules/heatmap`.
 *
 * @sample highcharts/demo/heatmap/
 *         Simple heatmap
 * @sample highcharts/demo/heatmap-canvas/
 *         Heavy heatmap
 *
 * @extends      plotOptions.scatter
 * @excluding    animationLimit, connectEnds, connectNulls, dashStyle,
 *               findNearestPointBy, getExtremesFromAll, jitter, linecap,
 *               lineWidth, marker, pointInterval, pointIntervalUnit,
 *               pointRange, pointStart, shadow, softThreshold, stacking,
 *               step, threshold, cluster
 * @product      highcharts highmaps
 * @optionparent plotOptions.heatmap
 */
{
    /**
     * Animation is disabled by default on the heatmap series.
     */
    animation: false,
    /**
     * The border width for each heat map item.
     */
    borderWidth: 0,
    /**
     * Padding between the points in the heatmap.
     *
     * @type      {number}
     * @default   0
     * @since     6.0
     * @apioption plotOptions.heatmap.pointPadding
     */
    /**
     * @default   value
     * @apioption plotOptions.heatmap.colorKey
     */
    /**
     * The main color of the series. In heat maps this color is rarely used,
     * as we mostly use the color to denote the value of each point. Unless
     * options are set in the [colorAxis](#colorAxis), the default value
     * is pulled from the [options.colors](#colors) array.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     4.0
     * @product   highcharts
     * @apioption plotOptions.heatmap.color
     */
    /**
     * The column size - how many X axis units each column in the heatmap
     * should span.
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         One day
     * @sample {highmaps} maps/demo/heatmap/
     *         One day
     *
     * @type      {number}
     * @default   1
     * @since     4.0
     * @product   highcharts highmaps
     * @apioption plotOptions.heatmap.colsize
     */
    /**
     * The row size - how many Y axis units each heatmap row should span.
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         1 by default
     * @sample {highmaps} maps/demo/heatmap/
     *         1 by default
     *
     * @type      {number}
     * @default   1
     * @since     4.0
     * @product   highcharts highmaps
     * @apioption plotOptions.heatmap.rowsize
     */
    /**
     * The color applied to null points. In styled mode, a general CSS class
     * is applied instead.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    nullColor: '${palette.neutralColor3}',
    dataLabels: {
        formatter: function () {
            return this.point.value;
        },
        inside: true,
        verticalAlign: 'middle',
        crop: false,
        overflow: false,
        padding: 0 // #3837
    },
    /** @ignore-option */
    marker: null,
    /** @ignore-option */
    pointRange: null,
    tooltip: {
        pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
    },
    states: {
        hover: {
            /** @ignore-option */
            halo: false,
            /**
             * How much to brighten the point on interaction. Requires the
             * main color to be defined in hex or rgb(a) format.
             *
             * In styled mode, the hover brightening is by default replaced
             * with a fill-opacity set in the `.highcharts-point:hover`
             * rule.
             */
            brightness: 0.2
        }
    }
}, merge(colorMapSeriesMixin, {
    pointArrayMap: ['y', 'value'],
    hasPointSpecificOptions: true,
    getExtremesFromAll: true,
    directTouch: true,
    /* eslint-disable valid-jsdoc */
    /**
     * Override the init method to add point ranges on both axes.
     *
     * @private
     * @function Highcharts.seriesTypes.heatmap#init
     * @return {void}
     */
    init: function () {
        var options;
        seriesTypes.scatter.prototype.init.apply(this, arguments);
        options = this.options;
        // #3758, prevent resetting in setData
        options.pointRange = pick(options.pointRange, options.colsize || 1);
        // general point range
        this.yAxis.axisPointRange = options.rowsize || 1;
    },
    /**
     * @private
     * @function Highcharts.seriesTypes.heatmap#translate
     * @return {void}
     */
    translate: function () {
        var series = this;
        series.generatePoints();
        var _a = series.options, _b = _a.colsize, colsize = _b === void 0 ? 1 : _b, _c = _a.pointPadding, seriesPointPadding = _c === void 0 ? 0 : _c, _d = _a.rowsize, rowsize = _d === void 0 ? 1 : _d, points = series.points, xAxis = series.xAxis, yAxis = series.yAxis;
        var xPad = colsize / 2;
        var yPad = rowsize / 2;
        // Translate point values functionality
        var pointPlacement = series.pointPlacementToXValue(); // #7860
        var translateX = function (value) { return Math.round(clamp(xAxis.translate(value, false, false, false, true, pointPlacement), 0, xAxis.len)); };
        var translateY = function (value) { return Math.round(clamp(yAxis.translate(value, false, true, false, true), 0, yAxis.len)); };
        points.forEach(function (point) {
            var x1 = translateX(point.x - xPad);
            var x2 = translateX(point.x + xPad);
            var y1 = translateY(point.y - yPad);
            var y2 = translateY(point.y + yPad);
            var pointPadding = pick(point.pointPadding, seriesPointPadding);
            // Set plotX and plotY for use in K-D-Tree and more
            point.plotX = point.clientX = (x1 + x2) / 2;
            point.plotY = (y1 + y2) / 2;
            point.shapeType = 'rect';
            point.shapeArgs = {
                x: Math.min(x1, x2) + pointPadding,
                y: Math.min(y1, y2) + pointPadding,
                width: Math.max(Math.abs(x2 - x1) - pointPadding * 2, 0),
                height: Math.max(Math.abs(y2 - y1) - pointPadding * 2, 0)
            };
        });
        fireEvent(series, 'afterTranslate');
    },
    /**
     * @private
     * @function Highcharts.seriesTypes.heatmap#drawPoints
     * @return {void}
     */
    drawPoints: function () {
        // In styled mode, use CSS, otherwise the fill used in the style
        // sheet will take precedence over the fill attribute.
        var func = this.chart.styledMode ? 'css' : 'animate';
        seriesTypes.column.prototype.drawPoints.call(this);
        this.points.forEach(function (point) {
            point.graphic[func](this.colorAttribs(point));
        }, this);
    },
    // Define hasData function for non-cartesian series.
    // Returns true if the series has points at all.
    hasData: function () {
        return !!this.processedXData.length; // != 0
    },
    // Override to also allow null points, used when building the k-d-tree
    // for tooltips in boost mode.
    getValidPoints: function (points, insideOnly) {
        return Series.prototype.getValidPoints.call(this, points, insideOnly, true);
    },
    /**
     * @ignore
     * @deprecated
     * @function Highcharts.seriesTypes.heatmap#animate
     */
    animate: noop,
    /**
     * @ignore
     * @deprecated
     * @function Highcharts.seriesTypes.heatmap#getBox
     */
    getBox: noop,
    /**
     * @private
     * @borrows Highcharts.LegendSymbolMixin.drawRectangle as Highcharts.seriesTypes.heatmap#drawLegendSymbol
     */
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    /**
     * @private
     * @borrows Highcharts.seriesTypes.column#alignDataLabel as Highcharts.seriesTypes.heatmap#alignDataLabel
     */
    alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
    /**
     * @private
     * @function Highcharts.seriesTypes.heatmap#getExtremes
     * @return {void}
     */
    getExtremes: function () {
        // Get the extremes from the value data
        Series.prototype.getExtremes.call(this, this.valueData);
        this.valueMin = this.dataMin;
        this.valueMax = this.dataMax;
        // Get the extremes from the y data
        Series.prototype.getExtremes.call(this);
    }
    /* eslint-enable valid-jsdoc */
}), extend({
    /**
     * Heatmap series only. Padding between the points in the heatmap.
     * @name Highcharts.Point#pointPadding
     * @type {number|undefined}
     */
    /**
     * Heatmap series only. The value of the point, resulting in a color
     * controled by options as set in the colorAxis configuration.
     * @name Highcharts.Point#value
     * @type {number|null|undefined}
     */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     * @function Highcharts.Point#haloPath
     * @param {number} size
     * @return {Highcharts.SVGPathArray}
     */
    haloPath: function (size) {
        if (!size) {
            return [];
        }
        var rect = this.shapeArgs;
        return [
            'M',
            rect.x - size,
            rect.y - size,
            'L',
            rect.x - size,
            rect.y + rect.height + size,
            rect.x + rect.width + size,
            rect.y + rect.height + size,
            rect.x + rect.width + size,
            rect.y - size,
            'Z'
        ];
    }
    /* eslint-enable valid-jsdoc */
}, colorMapPointMixin));
/**
 * A `heatmap` series. If the [type](#series.heatmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @productdesc {highcharts}
 * Requires `modules/heatmap`.
 *
 * @extends   series,plotOptions.heatmap
 * @excluding dataParser, dataURL, marker, pointRange, stack
 * @product   highcharts highmaps
 * @apioption series.heatmap
 */
/**
 * An array of data points for the series. For the `heatmap` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,value`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 *
 *  ```js
 *     data: [
 *         [0, 9, 7],
 *         [1, 10, 4],
 *         [2, 6, 3]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.heatmap.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 3,
 *         value: 10,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 7,
 *         value: 10,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
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
 * @type      {Array<Array<number>|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts highmaps
 * @apioption series.heatmap.data
 */
/**
 * The color of the point. In heat maps the point color is rarely set
 * explicitly, as we use the color to denote the `value`. Options for
 * this are set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.color
 */
/**
 * The value of the point, resulting in a color controled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.value
 */
/**
 * The x value of the point. For datetime axes,
 * the X value is the timestamp in milliseconds since 1970.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.x
 */
/**
 * The y value of the point.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.y
 */
/**
 * Point padding for a single point.
 *
 * @sample maps/plotoptions/tilemap-pointpadding
 *         Point padding on tiles
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.pointPadding
 */
''; // adds doclets above to transpiled file
