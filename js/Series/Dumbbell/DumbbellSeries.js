/* *
 *
 *  (c) 2010-2021 Sebastian Bochan, Rafal Sebestjanski
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
import ColumnSeries from '../Column/ColumnSeries.js';
var colProto = ColumnSeries.prototype;
import DumbbellPoint from './DumbbellPoint.js';
import H from '../../Core/Globals.js';
var noop = H.noop;
import palette from '../../Core/Color/Palette.js';
import Series from '../../Core/Series/Series.js';
var seriesProto = Series.prototype;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, AreaRangeSeries = _a.arearange, columnRangeProto = _a.columnrange.prototype;
var areaRangeProto = AreaRangeSeries.prototype;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, pick = U.pick;
/**
 * The dumbbell series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dumbbell
 *
 * @augments Highcharts.Series
 */
var DumbbellSeries = /** @class */ (function (_super) {
    __extends(DumbbellSeries, _super);
    function DumbbellSeries() {
        /* *
         *
         * Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.columnMetrics = void 0;
        return _this;
    }
    /**
     *
     *  Functions
     *
     */
    /**
     * Get connector line path and styles that connects dumbbell point's low and
     * high values.
     * @private
     *
     * @param {Highcharts.Point} point The point to inspect.
     *
     * @return {Highcharts.SVGAttributes} attribs The path and styles.
     */
    DumbbellSeries.prototype.getConnectorAttribs = function (point) {
        var series = this, chart = series.chart, pointOptions = point.options, seriesOptions = series.options, xAxis = series.xAxis, yAxis = series.yAxis, connectorWidth = pick(pointOptions.connectorWidth, seriesOptions.connectorWidth), connectorColor = pick(pointOptions.connectorColor, seriesOptions.connectorColor, pointOptions.color, point.zone ? point.zone.color : void 0, point.color), connectorWidthPlus = pick(seriesOptions.states &&
            seriesOptions.states.hover &&
            seriesOptions.states.hover.connectorWidthPlus, 1), dashStyle = pick(pointOptions.dashStyle, seriesOptions.dashStyle), pointTop = pick(point.plotLow, point.plotY), pxThreshold = yAxis.toPixels(seriesOptions.threshold || 0, true), pointHeight = chart.inverted ?
            yAxis.len - pxThreshold : pxThreshold, pointBottom = pick(point.plotHigh, pointHeight), attribs, origProps;
        if (point.state) {
            connectorWidth = connectorWidth + connectorWidthPlus;
        }
        if (pointTop < 0) {
            pointTop = 0;
        }
        else if (pointTop >= yAxis.len) {
            pointTop = yAxis.len;
        }
        if (pointBottom < 0) {
            pointBottom = 0;
        }
        else if (pointBottom >= yAxis.len) {
            pointBottom = yAxis.len;
        }
        if (point.plotX < 0 || point.plotX > xAxis.len) {
            connectorWidth = 0;
        }
        // Connector should reflect upper marker's zone color
        if (point.upperGraphic) {
            origProps = {
                y: point.y,
                zone: point.zone
            };
            point.y = point.high;
            point.zone = point.zone ? point.getZone() : void 0;
            connectorColor = pick(pointOptions.connectorColor, seriesOptions.connectorColor, pointOptions.color, point.zone ? point.zone.color : void 0, point.color);
            extend(point, origProps);
        }
        attribs = {
            d: SVGRenderer.prototype.crispLine([[
                    'M',
                    point.plotX,
                    pointTop
                ], [
                    'L',
                    point.plotX,
                    pointBottom
                ]], connectorWidth, 'ceil')
        };
        if (!chart.styledMode) {
            attribs.stroke = connectorColor;
            attribs['stroke-width'] = connectorWidth;
            if (dashStyle) {
                attribs.dashstyle = dashStyle;
            }
        }
        return attribs;
    };
    /**
     * Draw connector line that connects dumbbell point's low and high values.
     * @private
     *
     * @param {Highcharts.Point} point The point to inspect.
     *
     * @return {void}
     */
    DumbbellSeries.prototype.drawConnector = function (point) {
        var series = this, animationLimit = pick(series.options.animationLimit, 250), verb = point.connector && series.chart.pointCount < animationLimit ?
            'animate' : 'attr';
        if (!point.connector) {
            point.connector = series.chart.renderer.path()
                .addClass('highcharts-lollipop-stem')
                .attr({
                zIndex: -1
            })
                .add(series.markerGroup);
        }
        point.connector[verb](this.getConnectorAttribs(point));
    };
    /**
     * Return the width and x offset of the dumbbell adjusted for grouping,
     * groupPadding, pointPadding, pointWidth etc.
     *
     * @private
     *
     * @function Highcharts.seriesTypes.column#getColumnMetrics
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {Highcharts.ColumnMetricsObject} metrics shapeArgs
     *
     */
    DumbbellSeries.prototype.getColumnMetrics = function () {
        var metrics = colProto.getColumnMetrics.apply(this, arguments);
        metrics.offset += metrics.width / 2;
        return metrics;
    };
    /**
     * Translate each point to the plot area coordinate system and find
     * shape positions
     *
     * @private
     *
     * @function Highcharts.seriesTypes.dumbbell#translate
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {void}
     */
    DumbbellSeries.prototype.translate = function () {
        // Calculate shapeargs
        this.setShapeArgs.apply(this);
        // Calculate point low / high values
        this.translatePoint.apply(this, arguments);
        // Correct x position
        this.points.forEach(function (point) {
            var shapeArgs = point.shapeArgs, pointWidth = point.pointWidth;
            point.plotX = shapeArgs.x;
            shapeArgs.x = point.plotX - pointWidth / 2;
            point.tooltipPos = null;
        });
        this.columnMetrics.offset -= this.columnMetrics.width / 2;
    };
    /**
     * Extend the arearange series' drawPoints method by applying a connector
     * and coloring markers.
     * @private
     *
     * @function Highcharts.Series#drawPoints
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {void}
     */
    DumbbellSeries.prototype.drawPoints = function () {
        var series = this, chart = series.chart, pointLength = series.points.length, seriesLowColor = series.lowColor = series.options.lowColor, i = 0, lowerGraphicColor, point, zoneColor;
        this.seriesDrawPoints.apply(series, arguments);
        // Draw connectors and color upper markers
        while (i < pointLength) {
            point = series.points[i];
            series.drawConnector(point);
            if (point.upperGraphic) {
                point.upperGraphic.element.point = point;
                point.upperGraphic.addClass('highcharts-lollipop-high');
            }
            point.connector.element.point = point;
            if (point.lowerGraphic) {
                zoneColor = point.zone && point.zone.color;
                lowerGraphicColor = pick(point.options.lowColor, seriesLowColor, point.options.color, zoneColor, point.color, series.color);
                if (!chart.styledMode) {
                    point.lowerGraphic.attr({
                        fill: lowerGraphicColor
                    });
                }
                point.lowerGraphic.addClass('highcharts-lollipop-low');
            }
            i++;
        }
    };
    /**
     * Get non-presentational attributes for a point. Used internally for
     * both styled mode and classic. Set correct position in link with connector
     * line.
     *
     * @see Series#pointAttribs
     *
     * @function Highcharts.Series#markerAttribs
     *
     * @param {Highcharts.Series} this The series of points.
     *
     * @return {Highcharts.SVGAttributes}
     *         A hash containing those attributes that are not settable from
     *         CSS.
     */
    DumbbellSeries.prototype.markerAttribs = function () {
        var ret = areaRangeProto.markerAttribs.apply(this, arguments);
        ret.x = Math.floor(ret.x);
        ret.y = Math.floor(ret.y);
        return ret;
    };
    /**
     * Get presentational attributes
     *
     * @private
     * @function Highcharts.seriesTypes.column#pointAttribs
     *
     * @param {Highcharts.Point} point The point to inspect.
     * @param {string} state current state of point (normal, hover, select)
     *
     * @return {Highcharts.SVGAttributes} pointAttribs SVGAttributes
     */
    DumbbellSeries.prototype.pointAttribs = function (point, state) {
        var pointAttribs;
        pointAttribs = seriesProto.pointAttribs.apply(this, arguments);
        if (state === 'hover') {
            delete pointAttribs.fill;
        }
        return pointAttribs;
    };
    /**
     * The dumbbell series is a cartesian series with higher and lower values
     * for each point along an X axis, connected with a line between the
     * values.
     *
     * Requires `highcharts-more.js` and `modules/dumbbell.js`.
     *
     * @sample {highcharts} highcharts/demo/dumbbell/
     *         Dumbbell chart
     * @sample {highcharts} highcharts/series-dumbbell/styled-mode-dumbbell/
     *         Styled mode
     *
     * @extends      plotOptions.arearange
     * @product      highcharts highstock
     * @excluding    fillColor, fillOpacity, lineWidth, stack, stacking,
     *               stickyTracking, trackByArea, boostThreshold, boostBlending
     * @since 8.0.0
     * @optionparent plotOptions.dumbbell
     */
    DumbbellSeries.defaultOptions = merge(AreaRangeSeries.defaultOptions, {
        /** @ignore-option */
        trackByArea: false,
        /** @ignore-option */
        fillColor: 'none',
        /** @ignore-option */
        lineWidth: 0,
        pointRange: 1,
        /**
         * Pixel width of the line that connects the dumbbell point's
         * values.
         *
         * @since 8.0.0
         * @product   highcharts highstock
         */
        connectorWidth: 1,
        /** @ignore-option */
        stickyTracking: false,
        groupPadding: 0.2,
        crisp: false,
        pointPadding: 0.1,
        /**
         * Color of the start markers in a dumbbell graph.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since 8.0.0
         * @product   highcharts highstock
         */
        lowColor: palette.neutralColor80,
        /**
         * Color of the line that connects the dumbbell point's values.
         * By default it is the series' color.
         *
         * @type      {string}
         * @product   highcharts highstock
         * @since 8.0.0
         * @apioption plotOptions.dumbbell.connectorColor
         */
        states: {
            hover: {
                /** @ignore-option */
                lineWidthPlus: 0,
                /**
                 * The additional connector line width for a hovered point.
                 *
                 * @since 8.0.0
                 * @product   highcharts highstock
                 */
                connectorWidthPlus: 1,
                /** @ignore-option */
                halo: false
            }
        }
    });
    return DumbbellSeries;
}(AreaRangeSeries));
extend(DumbbellSeries.prototype, {
    crispCol: colProto.crispCol,
    drawGraph: noop,
    drawTracker: ColumnSeries.prototype.drawTracker,
    pointClass: DumbbellPoint,
    setShapeArgs: columnRangeProto.translate,
    seriesDrawPoints: areaRangeProto.drawPoints,
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    translatePoint: areaRangeProto.translate
});
SeriesRegistry.registerSeriesType('dumbbell', DumbbellSeries);
/* *
 *
 *  Default export
 *
 * */
export default DumbbellSeries;
/* *
 *
 *  API options
 *
 * */
/**
 * The `dumbbell` series. If the [type](#series.dumbbell.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dumbbell
 * @excluding boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @requires  modules/dumbbell
 * @apioption series.dumbbell
 */
/**
 * An array of data points for the series. For the `dumbbell` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,low,high`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 4, 2],
 *        [1, 2, 1],
 *        [2, 9, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.dumbbell.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 0,
 *        high: 4,
 *        name: "Point2",
 *        color: "#00FF00",
 *        lowColor: "#00FFFF",
 *        connectorWidth: 3,
 *        connectorColor: "#FF00FF"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        high: 3,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
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
 * @extends   series.arearange.data
 * @product   highcharts highstock
 * @apioption series.dumbbell.data
 */
/**
 * Color of the line that connects the dumbbell point's values.
 * By default it is the series' color.
 *
 * @type        {string}
 * @since       8.0.0
 * @product     highcharts highstock
 * @apioption   series.dumbbell.data.connectorColor
 */
/**
 * Pixel width of the line that connects the dumbbell point's values.
 *
 * @type        {number}
 * @since       8.0.0
 * @default     1
 * @product     highcharts highstock
 * @apioption   series.dumbbell.data.connectorWidth
 */
/**
 * Color of the start markers in a dumbbell graph.
 *
 * @type        {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @since       8.0.0
 * @default     ${palette.neutralColor80}
 * @product     highcharts highstock
 * @apioption   series.dumbbell.data.lowColor
 */
''; // adds doclets above to transpiled file
