/* *
 *
 *  (c) 2010-2018 Kacper Madej
 *
 *  License: www.highcharts.com/license
 *
 * */
/* eslint-disable */
'use strict';
import H from '../parts/Globals.js';
let pick = H.pick, isNumber = H.isNumber, relativeLength = H.relativeLength, seriesType = H.seriesType, columnProto = H.seriesTypes.column.prototype;
/**
 * The bullet series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bullet
 *
 * @augments Highcharts.Series
 */
seriesType('bullet', 'column', 
/**
 * A bullet graph is a variation of a bar graph. The bullet graph features a
 * single measure, compares it to a target, and displays it in the context
 * of qualitative ranges of performance that could be set using
 * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
 *
 * @sample {highcharts} highcharts/demo/bullet-graph/
 *         Bullet graph
 *
 * @extends      plotOptions.column
 * @since        6.0.0
 * @product      highcharts
 * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase
 * @optionparent plotOptions.bullet
 */
{
    /**
     * All options related with look and positiong of targets.
     *
     * @since 6.0.0
     */
    targetOptions: {
        /**
         * The width of the rectangle representing the target. Could be set
         * as a pixel value or as a percentage of a column width.
         *
         * @type  {number|string}
         * @since 6.0.0
         */
        width: '140%',
        /**
         * The height of the rectangle representing the target.
         *
         * @since 6.0.0
         */
        height: 3,
        /**
         * The border color of the rectangle representing the target. When
         * not set, the  point's border color is used.
         *
         * In styled mode, use class `highcharts-bullet-target` instead.
         *
         * @type      {Highcharts.ColorString}
         * @since     6.0.0
         * @product   highcharts
         * @apioption plotOptions.bullet.targetOptions.borderColor
         */
        borderColor: undefined,
        /**
         * The color of the rectangle representing the target. When not set,
         * point's color (if set in point's options -
         * [`color`](#series.bullet.data.color)) or zone of the target value
         * (if [`zones`](#plotOptions.bullet.zones) or
         * [`negativeColor`](#plotOptions.bullet.negativeColor) are set)
         * or the same color as the point has is used.
         *
         * In styled mode, use class `highcharts-bullet-target` instead.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject}
         * @since     6.0.0
         * @product   highcharts
         * @apioption plotOptions.bullet.targetOptions.color
         */
        color: undefined,
        /**
         * The border width of the rectangle representing the target.
         *
         * In styled mode, use class `highcharts-bullet-target` instead.
         *
         * @since   6.0.0
         */
        borderWidth: 0
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">\u25CF</span>' +
            ' {series.name}: <b>{point.y}</b>. Target: <b>{point.target}' +
            '</b><br/>'
    }
}, 
/**
 * @ignore
 * @lends Highcharts.Series#
 */
{
    pointArrayMap: ['y', 'target'],
    parallelArrays: ['x', 'y', 'target'],
    /**
     * Draws the targets. For inverted chart, the `series.group` is rotated, so
     * the same coordinates apply. This method is based on column series
     * drawPoints function.
     *
     * @ignore
     * @function Highcharts.Series#drawPoints
     */
    drawPoints: function () {
        let series = this, chart = series.chart, options = series.options, animationLimit = options.animationLimit || 250;
        columnProto.drawPoints.apply(this);
        series.points.forEach(function (point) {
            let pointOptions = point.options, shapeArgs, targetGraphic = point.targetGraphic, targetShapeArgs, targetVal = point.target, pointVal = point.y, width, height, targetOptions, y;
            if (isNumber(targetVal) && targetVal !== null) {
                targetOptions = H.merge(options.targetOptions, pointOptions.targetOptions);
                height = targetOptions.height;
                shapeArgs = point.shapeArgs;
                width = relativeLength(targetOptions.width, shapeArgs.width);
                y = series.yAxis.translate(targetVal, false, true, false, true) - targetOptions.height / 2 - 0.5;
                targetShapeArgs = series.crispCol.apply({
                    // Use fake series object to set borderWidth of target
                    chart: chart,
                    borderWidth: targetOptions.borderWidth,
                    options: {
                        crisp: options.crisp
                    }
                }, [
                    shapeArgs.x + shapeArgs.width / 2 - width / 2,
                    y,
                    width,
                    height
                ]);
                if (targetGraphic) {
                    // Update
                    targetGraphic[chart.pointCount < animationLimit ?
                        'animate' :
                        'attr'](targetShapeArgs);
                    // Add or remove tooltip reference
                    if (isNumber(pointVal) && pointVal !== null) {
                        targetGraphic.element.point = point;
                    }
                    else {
                        targetGraphic.element.point = undefined;
                    }
                }
                else {
                    point.targetGraphic = targetGraphic = chart.renderer
                        .rect()
                        .attr(targetShapeArgs)
                        .add(series.group);
                }
                // Presentational
                if (!chart.styledMode) {
                    targetGraphic.attr({
                        fill: pick(targetOptions.color, pointOptions.color, (series.zones.length && (point.getZone.call({
                            series: series,
                            x: point.x,
                            y: targetVal,
                            options: {}
                        }).color || series.color)) || undefined, point.color, series.color),
                        stroke: pick(targetOptions.borderColor, point.borderColor, series.options.borderColor),
                        'stroke-width': targetOptions.borderWidth
                    });
                }
                // Add tooltip reference
                if (isNumber(pointVal) && pointVal !== null) {
                    targetGraphic.element.point = point;
                }
                targetGraphic.addClass(point.getClassName() +
                    ' highcharts-bullet-target', true);
            }
            else if (targetGraphic) {
                point.targetGraphic = targetGraphic.destroy(); // #1269
            }
        });
    },
    /**
     * Includes target values to extend extremes from y values.
     *
     * @ignore
     * @function Highcharts.Series#getExtremes
     */
    getExtremes: function (yData) {
        let series = this, targetData = series.targetData, yMax, yMin;
        columnProto.getExtremes.call(this, yData);
        if (targetData && targetData.length) {
            yMax = series.dataMax;
            yMin = series.dataMin;
            columnProto.getExtremes.call(this, targetData);
            series.dataMax = Math.max(series.dataMax, yMax);
            series.dataMin = Math.min(series.dataMin, yMin);
        }
    }
}, 
/**
 * @ignore
 * @lends Highcharts.Point#
 */
{
    /**
     * Destroys target graphic.
     *
     * @private
     * @function
     */
    destroy: function () {
        if (this.targetGraphic) {
            this.targetGraphic = this.targetGraphic.destroy();
        }
        columnProto.pointClass.prototype.destroy.apply(this, arguments);
    }
});
