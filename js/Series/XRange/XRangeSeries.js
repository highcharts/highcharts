/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
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
import Color from '../../Core/Color/Color.js';
var color = Color.parse;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, ColumnSeries = SeriesRegistry.seriesTypes.column;
var columnProto = ColumnSeries.prototype;
import U from '../../Core/Utilities.js';
var clamp = U.clamp, correctFloat = U.correctFloat, defined = U.defined, extend = U.extend, find = U.find, isNumber = U.isNumber, isObject = U.isObject, merge = U.merge, pick = U.pick;
import XRangePoint from './XRangePoint.js';
import './XRangeComposition.js';
/* *
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 */ /**
* The ending X value of the range point.
* @name Highcharts.PointOptionsObject#x2
* @type {number|undefined}
* @requires modules/xrange
*/
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.xrange
 *
 * @augments Highcharts.Series
 */
var XRangeSeries = /** @class */ (function (_super) {
    __extends(XRangeSeries, _super);
    function XRangeSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /*
        // Override to remove stroke from points. For partial fill.
        pointAttribs: function () {
            var series = this,
                retVal = columnType.prototype.pointAttribs
                    .apply(series, arguments);
    
            //retVal['stroke-width'] = 0;
            return retVal;
        }
        //*/
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     * Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     * @function Highcarts.seriesTypes.xrange#init
     * @return {void}
     */
    XRangeSeries.prototype.init = function () {
        ColumnSeries.prototype.init.apply(this, arguments);
        this.options.stacking = void 0; // #13161
    };
    /**
     * Borrow the column series metrics, but with swapped axes. This gives
     * free access to features like groupPadding, grouping, pointWidth etc.
     *
     * @private
     * @function Highcharts.Series#getColumnMetrics
     *
     * @return {Highcharts.ColumnMetricsObject}
     */
    XRangeSeries.prototype.getColumnMetrics = function () {
        var metrics, chart = this.chart;
        /**
         * @private
         */
        function swapAxes() {
            chart.series.forEach(function (s) {
                var xAxis = s.xAxis;
                s.xAxis = s.yAxis;
                s.yAxis = xAxis;
            });
        }
        swapAxes();
        metrics = columnProto.getColumnMetrics.call(this);
        swapAxes();
        return metrics;
    };
    /**
     * Override cropData to show a point where x or x2 is outside visible
     * range, but one of them is inside.
     *
     * @private
     * @function Highcharts.Series#cropData
     *
     * @param {Array<number>} xData
     *
     * @param {Array<number>} yData
     *
     * @param {number} min
     *
     * @param {number} max
     *
     * @param {number} [cropShoulder]
     *
     * @return {*}
     */
    XRangeSeries.prototype.cropData = function (xData, yData, min, max) {
        // Replace xData with x2Data to find the appropriate cropStart
        var cropData = Series.prototype.cropData, crop = cropData.call(this, this.x2Data, yData, min, max);
        // Re-insert the cropped xData
        crop.xData = xData.slice(crop.start, crop.end);
        return crop;
    };
    /**
     * Finds the index of an existing point that matches the given point
     * options.
     *
     * @private
     * @function Highcharts.Series#findPointIndex
     * @param {object} options The options of the point.
     * @returns {number|undefined} Returns index of a matching point,
     * returns undefined if no match is found.
     */
    XRangeSeries.prototype.findPointIndex = function (options) {
        var _a = this, cropped = _a.cropped, cropStart = _a.cropStart, points = _a.points;
        var id = options.id;
        var pointIndex;
        if (id) {
            var point = find(points, function (point) {
                return point.id === id;
            });
            pointIndex = point ? point.index : void 0;
        }
        if (typeof pointIndex === 'undefined') {
            var point = find(points, function (point) {
                return (point.x === options.x &&
                    point.x2 === options.x2 &&
                    !point.touched);
            });
            pointIndex = point ? point.index : void 0;
        }
        // Reduce pointIndex if data is cropped
        if (cropped &&
            isNumber(pointIndex) &&
            isNumber(cropStart) &&
            pointIndex >= cropStart) {
            pointIndex -= cropStart;
        }
        return pointIndex;
    };
    /**
     * @private
     * @function Highcharts.Series#translatePoint
     *
     * @param {Highcharts.Point} point
     */
    XRangeSeries.prototype.translatePoint = function (point) {
        var _a, _b;
        var series = this, xAxis = series.xAxis, yAxis = series.yAxis, metrics = series.columnMetrics, options = series.options, minPointLength = options.minPointLength || 0, oldColWidth = ((_a = point.shapeArgs) === null || _a === void 0 ? void 0 : _a.width) / 2, seriesXOffset = series.pointXOffset = metrics.offset, plotX = point.plotX, posX = pick(point.x2, point.x + (point.len || 0)), plotX2 = xAxis.translate(posX, 0, 0, 0, 1), length = Math.abs(plotX2 - plotX), widthDifference, shapeArgs, partialFill, inverted = this.chart.inverted, borderWidth = pick(options.borderWidth, 1), crisper = borderWidth % 2 / 2, yOffset = metrics.offset, pointHeight = Math.round(metrics.width), dlLeft, dlRight, dlWidth, clipRectWidth, tooltipYOffset;
        if (minPointLength) {
            widthDifference = minPointLength - length;
            if (widthDifference < 0) {
                widthDifference = 0;
            }
            plotX -= widthDifference / 2;
            plotX2 += widthDifference / 2;
        }
        plotX = Math.max(plotX, -10);
        plotX2 = clamp(plotX2, -10, xAxis.len + 10);
        // Handle individual pointWidth
        if (defined(point.options.pointWidth)) {
            yOffset -= ((Math.ceil(point.options.pointWidth) - pointHeight) / 2);
            pointHeight = Math.ceil(point.options.pointWidth);
        }
        // Apply pointPlacement to the Y axis
        if (options.pointPlacement &&
            isNumber(point.plotY) &&
            yAxis.categories) {
            point.plotY = yAxis.translate(point.y, 0, 1, 0, 1, options.pointPlacement);
        }
        point.shapeArgs = {
            x: Math.floor(Math.min(plotX, plotX2)) + crisper,
            y: Math.floor(point.plotY + yOffset) + crisper,
            width: Math.round(Math.abs(plotX2 - plotX)),
            height: pointHeight,
            r: series.options.borderRadius
        };
        // Move tooltip to default position
        if (!inverted) {
            point.tooltipPos[0] -= oldColWidth +
                seriesXOffset -
                ((_b = point.shapeArgs) === null || _b === void 0 ? void 0 : _b.width) / 2;
        }
        else {
            point.tooltipPos[1] += seriesXOffset +
                oldColWidth;
        }
        // Align data labels inside the shape and inside the plot area
        dlLeft = point.shapeArgs.x;
        dlRight = dlLeft + point.shapeArgs.width;
        if (dlLeft < 0 || dlRight > xAxis.len) {
            dlLeft = clamp(dlLeft, 0, xAxis.len);
            dlRight = clamp(dlRight, 0, xAxis.len);
            dlWidth = dlRight - dlLeft;
            point.dlBox = merge(point.shapeArgs, {
                x: dlLeft,
                width: dlRight - dlLeft,
                centerX: dlWidth ? dlWidth / 2 : null
            });
        }
        else {
            point.dlBox = null;
        }
        // Tooltip position
        var tooltipPos = point.tooltipPos;
        var xIndex = !inverted ? 0 : 1;
        var yIndex = !inverted ? 1 : 0;
        tooltipYOffset = series.columnMetrics ?
            series.columnMetrics.offset : -metrics.width / 2;
        // Centering tooltip position (#14147)
        if (!inverted) {
            tooltipPos[xIndex] += (xAxis.reversed ? -1 : 0) * point.shapeArgs.width;
        }
        else {
            tooltipPos[xIndex] += point.shapeArgs.width / 2;
        }
        tooltipPos[yIndex] = clamp(tooltipPos[yIndex] + ((inverted ? -1 : 1) * tooltipYOffset), 0, yAxis.len - 1);
        // Add a partShapeArgs to the point, based on the shapeArgs property
        partialFill = point.partialFill;
        if (partialFill) {
            // Get the partial fill amount
            if (isObject(partialFill)) {
                partialFill = partialFill.amount;
            }
            // If it was not a number, assume 0
            if (!isNumber(partialFill)) {
                partialFill = 0;
            }
            shapeArgs = point.shapeArgs;
            point.partShapeArgs = {
                x: shapeArgs.x,
                y: shapeArgs.y,
                width: shapeArgs.width,
                height: shapeArgs.height,
                r: series.options.borderRadius
            };
            clipRectWidth = Math.max(Math.round(length * partialFill + point.plotX -
                plotX), 0);
            point.clipRectArgs = {
                x: xAxis.reversed ? // #10717
                    shapeArgs.x + length - clipRectWidth :
                    shapeArgs.x,
                y: shapeArgs.y,
                width: clipRectWidth,
                height: shapeArgs.height
            };
        }
    };
    /**
     * @private
     * @function Highcharts.Series#translate
     */
    XRangeSeries.prototype.translate = function () {
        columnProto.translate.apply(this, arguments);
        this.points.forEach(function (point) {
            this.translatePoint(point);
        }, this);
    };
    /**
     * Draws a single point in the series. Needed for partial fill.
     *
     * This override turns point.graphic into a group containing the
     * original graphic and an overlay displaying the partial fill.
     *
     * @private
     * @function Highcharts.Series#drawPoint
     *
     * @param {Highcharts.Point} point
     *        An instance of Point in the series.
     *
     * @param {"animate"|"attr"} verb
     *        'animate' (animates changes) or 'attr' (sets options)
     */
    XRangeSeries.prototype.drawPoint = function (point, verb) {
        var series = this, seriesOpts = series.options, renderer = series.chart.renderer, graphic = point.graphic, type = point.shapeType, shapeArgs = point.shapeArgs, partShapeArgs = point.partShapeArgs, clipRectArgs = point.clipRectArgs, pfOptions = point.partialFill, cutOff = seriesOpts.stacking && !seriesOpts.borderRadius, pointState = point.state, stateOpts = (seriesOpts.states[pointState || 'normal'] ||
            {}), pointStateVerb = typeof pointState === 'undefined' ?
            'attr' : verb, pointAttr = series.pointAttribs(point, pointState), animation = pick(series.chart.options.chart.animation, stateOpts.animation), fill;
        if (!point.isNull && point.visible !== false) {
            // Original graphic
            if (graphic) { // update
                graphic.rect[verb](shapeArgs);
            }
            else {
                point.graphic = graphic = renderer.g('point')
                    .addClass(point.getClassName())
                    .add(point.group || series.group);
                graphic.rect = renderer[type](merge(shapeArgs))
                    .addClass(point.getClassName())
                    .addClass('highcharts-partfill-original')
                    .add(graphic);
            }
            // Partial fill graphic
            if (partShapeArgs) {
                if (graphic.partRect) {
                    graphic.partRect[verb](merge(partShapeArgs));
                    graphic.partialClipRect[verb](merge(clipRectArgs));
                }
                else {
                    graphic.partialClipRect = renderer.clipRect(clipRectArgs.x, clipRectArgs.y, clipRectArgs.width, clipRectArgs.height);
                    graphic.partRect =
                        renderer[type](partShapeArgs)
                            .addClass('highcharts-partfill-overlay')
                            .add(graphic)
                            .clip(graphic.partialClipRect);
                }
            }
            // Presentational
            if (!series.chart.styledMode) {
                graphic
                    .rect[verb](pointAttr, animation)
                    .shadow(seriesOpts.shadow, null, cutOff);
                if (partShapeArgs) {
                    // Ensure pfOptions is an object
                    if (!isObject(pfOptions)) {
                        pfOptions = {};
                    }
                    if (isObject(seriesOpts.partialFill)) {
                        pfOptions = merge(seriesOpts.partialFill, pfOptions);
                    }
                    fill = (pfOptions.fill ||
                        color(pointAttr.fill).brighten(-0.3).get() ||
                        color(point.color || series.color)
                            .brighten(-0.3).get());
                    pointAttr.fill = fill;
                    graphic
                        .partRect[pointStateVerb](pointAttr, animation)
                        .shadow(seriesOpts.shadow, null, cutOff);
                }
            }
        }
        else if (graphic) {
            point.graphic = graphic.destroy(); // #1269
        }
    };
    /**
     * @private
     * @function Highcharts.Series#drawPoints
     */
    XRangeSeries.prototype.drawPoints = function () {
        var series = this, verb = series.getAnimationVerb();
        // Draw the columns
        series.points.forEach(function (point) {
            series.drawPoint(point, verb);
        });
    };
    /**
     * Returns "animate", or "attr" if the number of points is above the
     * animation limit.
     *
     * @private
     * @function Highcharts.Series#getAnimationVerb
     *
     * @return {string}
     */
    XRangeSeries.prototype.getAnimationVerb = function () {
        return (this.chart.pointCount < (this.options.animationLimit || 250) ?
            'animate' :
            'attr');
    };
    /**
     * @private
     * @function Highcharts.XRangeSeries#isPointInside
     */
    XRangeSeries.prototype.isPointInside = function (point) {
        var shapeArgs = point.shapeArgs, plotX = point.plotX, plotY = point.plotY;
        if (!shapeArgs) {
            return _super.prototype.isPointInside.apply(this, arguments);
        }
        var isInside = typeof plotX !== 'undefined' &&
            typeof plotY !== 'undefined' &&
            plotY >= 0 &&
            plotY <= this.yAxis.len &&
            shapeArgs.x + shapeArgs.width >= 0 &&
            plotX <= this.xAxis.len;
        return isInside;
    };
    /* *
     *
     * Static properties
     *
     * */
    /**
     * The X-range series displays ranges on the X axis, typically time
     * intervals with a start and end date.
     *
     * @sample {highcharts} highcharts/demo/x-range/
     *         X-range
     * @sample {highcharts} highcharts/css/x-range/
     *         Styled mode X-range
     * @sample {highcharts} highcharts/chart/inverted-xrange/
     *         Inverted X-range
     *
     * @extends      plotOptions.column
     * @since        6.0.0
     * @product      highcharts highstock gantt
     * @excluding    boostThreshold, crisp, cropThreshold, depth, edgeColor,
     *               edgeWidth, findNearestPointBy, getExtremesFromAll,
     *               negativeColor, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, softThreshold,
     *               stacking, threshold, data, dataSorting, boostBlending
     * @requires     modules/xrange
     * @optionparent plotOptions.xrange
     */
    XRangeSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
        /**
         * A partial fill for each point, typically used to visualize how much
         * of a task is performed. The partial fill object can be set either on
         * series or point level.
         *
         * @sample {highcharts} highcharts/demo/x-range
         *         X-range with partial fill
         *
         * @product   highcharts highstock gantt
         * @apioption plotOptions.xrange.partialFill
         */
        /**
         * The fill color to be used for partial fills. Defaults to a darker
         * shade of the point color.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highcharts highstock gantt
         * @apioption plotOptions.xrange.partialFill.fill
         */
        /**
         * A partial fill for each point, typically used to visualize how much
         * of a task is performed. See [completed](series.gantt.data.completed).
         *
         * @sample gantt/demo/progress-indicator
         *         Gantt with progress indicator
         *
         * @product   gantt
         * @apioption plotOptions.gantt.partialFill
         */
        /**
         * In an X-range series, this option makes all points of the same Y-axis
         * category the same color.
         */
        colorByPoint: true,
        dataLabels: {
            formatter: function () {
                var point = this.point, amount = point.partialFill;
                if (isObject(amount)) {
                    amount = amount.amount;
                }
                if (isNumber(amount) && amount > 0) {
                    return correctFloat(amount * 100) + '%';
                }
            },
            inside: true,
            verticalAlign: 'middle'
        },
        tooltip: {
            headerFormat: '<span style="font-size: 10px">{point.x} - {point.x2}</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
        },
        borderRadius: 3,
        pointRange: 0
    });
    return XRangeSeries;
}(ColumnSeries));
extend(XRangeSeries.prototype, {
    type: 'xrange',
    parallelArrays: ['x', 'x2', 'y'],
    requireSorting: false,
    animate: Series.prototype.animate,
    cropShoulder: 1,
    getExtremesFromAll: true,
    autoIncrement: H.noop,
    buildKDTree: H.noop,
    pointClass: XRangePoint
});
SeriesRegistry.registerSeriesType('xrange', XRangeSeries);
/* *
 *
 * Default Export
 *
 * */
export default XRangeSeries;
/* *
 *
 * API Options
 *
 * */
/**
 * An `xrange` series. If the [type](#series.xrange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.xrange
 * @excluding boostThreshold, crisp, cropThreshold, depth, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointRange,
 *            pointStart, softThreshold, stacking, threshold, dataSorting,
 *            boostBlending
 * @product   highcharts highstock gantt
 * @requires  modules/xrange
 * @apioption series.xrange
 */
/**
 * An array of data points for the series. For the `xrange` series type,
 * points can be given in the following ways:
 *
 * 1. An array of objects with named values. The objects are point configuration
 *    objects as seen below.
 *    ```js
 *    data: [{
 *        x: Date.UTC(2017, 0, 1),
 *        x2: Date.UTC(2017, 0, 3),
 *        name: "Test",
 *        y: 0,
 *        color: "#00FF00"
 *    }, {
 *        x: Date.UTC(2017, 0, 4),
 *        x2: Date.UTC(2017, 0, 5),
 *        name: "Deploy",
 *        y: 1,
 *        color: "#FF0000"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @declare   Highcharts.XrangePointOptionsObject
 * @type      {Array<*>}
 * @extends   series.line.data
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data
 */
/**
 * The starting X value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.x
 */
/**
 * The ending X value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.x2
 */
/**
 * The Y value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.y
 */
/**
 * A partial fill for each point, typically used to visualize how much of
 * a task is performed. The partial fill object can be set either on series
 * or point level.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range with partial fill
 *
 * @declare   Highcharts.XrangePointPartialFillOptionsObject
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill
 */
/**
 * The amount of the X-range point to be filled. Values can be 0-1 and are
 * converted to percentages in the default data label formatter.
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill.amount
 */
/**
 * The fill color to be used for partial fills. Defaults to a darker shade
 * of the point color.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill.fill
 */
''; // adds doclets above to transpiled file
