/**
 * (c) 2010-2017 Kacper Madej
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var each = H.each,
    pick = H.pick,
    isNumber = H.isNumber,
    relativeLength = H.relativeLength,
    seriesType = H.seriesType,
    columnProto = H.seriesTypes.column.prototype;

/**
 * The bullet series type.
 *
 * @constructor seriesTypes.bullet
 * @augments seriesTypes.column
 */
seriesType('bullet', 'column',
    /**
     * A bullet graph is a variation of a bar graph. The bullet graph features
     * a single measure, compares it to a target, and displays it in the context
     * of qualitative ranges of performance that could be set using
     * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
     *
     * @extends      {plotOptions.column}
     * @product      highcharts
     * @sample       {highcharts} highcharts/demo/bullet-graph/ Bullet graph
     * @since        6.0.0
     * @excluding    allAreas,boostThreshold,colorAxis,compare,compareBase
     * @optionparent plotOptions.bullet
     */
    {
        /**
         * All options related with look and positiong of targets.
         *
         * @sample {highcharts} highcharts/plotoptions/bullet-targetoptions/
         *                      Target options
         *
         * @type    {Object}
         * @since   6.0.0
         * @product highcharts
         */
        targetOptions: {
            /**
             * The width of the rectangle representing the target. Could be set
             * as a pixel value or as a percentage of a column width.
             *
             * @type    {Number|String}
             * @since   6.0.0
             * @product highcharts
             */
            width: '140%',

            /**
             * The height of the rectangle representing the target.
             *
             * @since   6.0.0
             * @product highcharts
             */
            height: 3,

            /*= if (build.classic) { =*/

            /**
             * The border color of the rectangle representing the target. When
             * not set, the  point's border color is used.
             *
             * In styled mode, use class `highcharts-bullet-target` instead.
             *
             * @type      {Color}
             * @since     6.0.0
             * @product   highcharts
             * @apioption plotOptions.bullet.targetOptions.borderColor
             */

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
             * @type      {Color}
             * @since     6.0.0
             * @product   highcharts
             * @apioption plotOptions.bullet.targetOptions.color
             */

            /**
             * The border width of the rectangle representing the target.
             *
             * In styled mode, use class `highcharts-bullet-target` instead.
             *
             * @since   6.0.0
             * @product highcharts
             */
            borderWidth: 0

            /*= } =*/
        },

        tooltip: {
            /*= if (build.classic) { =*/
            pointFormat: '<span style="color:{series.color}">\u25CF</span>' +
                ' {series.name}: <b>{point.y}</b>. Target: <b>{point.target}' +
                '</b><br/>',
            /*= } else { =*/

            pointFormat: '' + // eslint-disable-line no-dupe-keys
                '<span class="highcharts-color-{point.colorIndex}">' +
                '\u25CF</span> {series.name}: ' +
                '<span class="highcharts-strong">{point.y}</span>. ' +
                'Target: <span class="highcharts-strong">' +
                '{point.target}</span><br/>'
            /*= } =*/
        }
    }, {
        pointArrayMap: ['y', 'target'],
        parallelArrays: ['x', 'y', 'target'],

        /**
         * Draws the targets. For inverted chart, the `series.group` is rotated,
         * so the same coordinates apply. This method is based on
         * column series drawPoints function.
         */
        drawPoints: function () {
            var series = this,
                chart = series.chart,
                options = series.options,
                animationLimit = options.animationLimit || 250;

            columnProto.drawPoints.apply(this);

            each(series.points, function (point) {
                var pointOptions = point.options,
                    shapeArgs,
                    targetGraphic = point.targetGraphic,
                    targetShapeArgs,
                    targetVal = point.target,
                    pointVal = point.y,
                    width,
                    height,
                    targetOptions,
                    y;

                if (isNumber(targetVal) && targetVal !== null) {
                    targetOptions = H.merge(
                        options.targetOptions,
                        pointOptions.targetOptions
                    );
                    height = targetOptions.height;

                    shapeArgs = point.shapeArgs;
                    width = relativeLength(
                        targetOptions.width,
                        shapeArgs.width
                    );
                    y = series.yAxis.translate(
                            targetVal,
                            false,
                            true,
                            false,
                            true
                        ) - targetOptions.height / 2 - 0.5;

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
                        targetGraphic[
                            chart.pointCount < animationLimit ?
                                'animate' :
                                'attr'
                        ](targetShapeArgs);

                        // Add or remove tooltip reference
                        if (isNumber(pointVal) && pointVal !== null) {
                            targetGraphic.element.point = point;
                        } else {
                            targetGraphic.element.point = undefined;
                        }
                    } else {
                        point.targetGraphic = targetGraphic = chart.renderer
                            .rect()
                            .attr(targetShapeArgs)
                            .add(series.group);
                    }
                    /*= if (build.classic) { =*/
                    // Presentational
                    targetGraphic.attr({
                        fill: pick(
                            targetOptions.color,
                            pointOptions.color,
                            (series.zones.length && (point.getZone.call({
                                series: series,
                                x: point.x,
                                y: targetVal,
                                options: {}
                            }).color || series.color)) || undefined,
                            point.color,
                            series.color
                        ),
                        stroke: pick(
                            targetOptions.borderColor,
                            point.borderColor,
                            series.options.borderColor
                        ),
                        'stroke-width': targetOptions.borderWidth
                    });
                    /*= } =*/

                    // Add tooltip reference
                    if (isNumber(pointVal) && pointVal !== null) {
                        targetGraphic.element.point = point;
                    }

                    targetGraphic.addClass(point.getClassName() +
                        ' highcharts-bullet-target', true);
                } else if (targetGraphic) {
                    point.targetGraphic = targetGraphic.destroy(); // #1269
                }
            });
        },

        /**
         * Includes target values to extend extremes from y values.
         */
        getExtremes: function (yData) {
            var series = this,
                targetData = series.targetData,
                yMax,
                yMin;

            columnProto.getExtremes.call(this, yData);

            if (targetData && targetData.length) {
                yMax = series.dataMax;
                yMin = series.dataMin;
                columnProto.getExtremes.call(this, targetData);
                series.dataMax = Math.max(series.dataMax, yMax);
                series.dataMin = Math.min(series.dataMin, yMin);
            }
        }
    }, /** @lends seriesTypes.ohlc.prototype.pointClass.prototype */ {
        /**
         * Destroys target graphic.
         */
        destroy: function () {
            if (this.targetGraphic) {
                this.targetGraphic = this.targetGraphic.destroy();
            }
            columnProto.pointClass.prototype.destroy.apply(this, arguments);
        }
    });


/**
 * A `bullet` series. If the [type](#series.bullet.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @since     6.0.0
 * @extends   series,plotOptions.bullet
 * @excluding dataParser,dataURL,marker
 * @product   highcharts
 * @apioption series.bullet
 */

/**
 * An array of data points for the series. For the `bullet` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,target`. If the first value is a string,
 * it is applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 *
 *  ```js
 *     data: [
 *         [0, 40, 75],
 *         [1, 50, 50],
 *         [2, 60, 40]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.bullet.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 0,
 *         y: 40,
 *         target: 75,
 *         name: "Point1",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 60,
 *         target: 40,
 *         name: "Point2",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array>}
 * @since     6.0.0
 * @extends   series.column.data
 * @product   highcharts
 * @apioption series.bullet.data
 */

/**
 * The target value of a point.
 *
 * @type      {Number}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.bullet.data.target
 */

/**
 * Individual target options for each point.
 *
 * @extends   plotOptions.bullet.targetOptions
 * @product   highcharts
 * @apioption series.bullet.data.targetOptions
 */

 /**
 * @excluding halo,lineWidth,lineWidthPlus,marker
 * @product   highcharts highstock
 * @apioption series.bullet.states.hover
 */

/**
 * @excluding halo,lineWidth,lineWidthPlus,marker
 * @product   highcharts highstock
 * @apioption series.bullet.states.select
 */
