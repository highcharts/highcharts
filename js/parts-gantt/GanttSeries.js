/* *
 *
 *  (c) 2016-2018 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import 'CurrentDateIndicator.js';
import 'GridAxis.js';
import '../modules/static-scale.src.js';
import 'TreeGrid.js';
import 'Pathfinder.js';
import '../modules/xrange.src.js';

var dateFormat = H.dateFormat,
    isObject = H.isObject,
    isNumber = H.isNumber,
    merge = H.merge,
    pick = H.pick,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    stop = H.stop,
    Series = H.Series,
    parent = seriesTypes.xrange;

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.gantt
 *
 * @augments Highcharts.Series
 */
seriesType('gantt', 'xrange'

/**
 * A `gantt` series. If the [type](#series.gantt.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends      plotOptions.xrange
 * @product      gantt
 * @optionparent plotOptions.gantt
 */
, {
    // options - default options merged with parent

    grouping: false,

    dataLabels: {
        enabled: true,
        formatter: function () {
            var point = this,
                amount = point.point.partialFill;

            if (isObject(amount)) {
                amount = amount.amount;
            }
            if (isNumber(amount) && amount > 0) {
                return (amount * 100) + '%';
            }
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
        pointFormat: null,
        pointFormatter: function () {
            var point = this,
                series = point.series,
                tooltip = series.chart.tooltip,
                xAxis = series.xAxis,
                options = xAxis.options,
                formats = options.dateTimeLabelFormats,
                startOfWeek = xAxis.options.startOfWeek,
                ttOptions = series.tooltipOptions,
                format = ttOptions.xDateFormat,
                range = point.end ? point.end - point.start : 0,
                start,
                end,
                milestone = point.options.milestone,
                retVal = '<b>' + (point.name || point.yCategory) + '</b>';
            if (ttOptions.pointFormat) {
                return point.tooltipFormatter(ttOptions.pointFormat);
            }

            if (!format) {
                format = H.splat(
                    tooltip.getDateFormat(
                        range,
                        point.start,
                        startOfWeek,
                        formats
                    )
                )[0];
            }

            start = dateFormat(format, point.start);
            end = dateFormat(format, point.end);

            retVal += '<br/>';

            if (!milestone) {
                retVal += 'Start: ' + start + '<br/>';
                retVal += 'End: ' + end + '<br/>';
            } else {
                retVal += 'Date ' + start + '<br/>';
            }

            return retVal;
        }
    },
    connectors: {
        type: 'simpleConnect',
        animation: {
            reversed: true // Dependencies go from child to parent
        },
        startMarker: {
            enabled: true,
            symbol: 'arrow-filled',
            radius: 4,
            fill: '#fa0',
            align: 'left'
        },
        endMarker: {
            enabled: false, // Only show arrow on the dependent task
            align: 'right'
        }
    }
}, {
    // props - series member overrides

    pointArrayMap: ['start', 'end', 'y'],

    // Keyboard navigation, don't use nearest vertical mode
    keyboardMoveVertical: false,

    // Handle milestones, as they have no x2
    translatePoint: function (point) {
        var series = this,
            shapeArgs,
            size;

        parent.prototype.translatePoint.call(series, point);

        if (point.options.milestone) {
            shapeArgs = point.shapeArgs;
            size = shapeArgs.height;
            point.shapeArgs = {
                x: shapeArgs.x - (size / 2),
                y: shapeArgs.y,
                width: size,
                height: size
            };
        }
    },

    /**
     * Draws a single point in the series.
     *
     * This override draws the point as a diamond if point.options.milestone is
     * true, and uses the original drawPoint() if it is false or not set.
     *
     * @requires module:highcharts-gantt
     *
     * @private
     * @function Highcharts.seriesTypes.gantt#drawPoint
     *
     * @param {Highcharts.Point} point
     *        An instance of Point in the series
     *
     * @param {"animate"|"attr"} verb
     *        'animate' (animates changes) or 'attr' (sets options)
     */
    drawPoint: function (point, verb) {
        var series = this,
            seriesOpts = series.options,
            renderer = series.chart.renderer,
            shapeArgs = point.shapeArgs,
            plotY = point.plotY,
            graphic = point.graphic,
            state = point.selected && 'select',
            cutOff = seriesOpts.stacking && !seriesOpts.borderRadius,
            diamondShape;

        if (point.options.milestone) {
            if (isNumber(plotY) && point.y !== null) {
                diamondShape = renderer.symbols.diamond(
                    shapeArgs.x,
                    shapeArgs.y,
                    shapeArgs.width,
                    shapeArgs.height
                );

                if (graphic) {
                    stop(graphic);
                    graphic[verb]({
                        d: diamondShape
                    });
                } else {
                    point.graphic = graphic = renderer.path(diamondShape)
                    .addClass(point.getClassName(), true)
                    .add(point.group || series.group);
                }

                // Presentational
                if (!series.chart.styledMode) {
                    point.graphic
                        .attr(series.pointAttribs(point, state))
                        .shadow(seriesOpts.shadow, null, cutOff);
                }
            } else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        } else {
            parent.prototype.drawPoint.call(series, point, verb);
        }
    },

    setData: Series.prototype.setData,

    setGanttPointAliases: function (options) {
        // Add a value to options if the value exists
        function addIfExists(prop, val) {
            if (val !== undefined) {
                options[prop] = val;
            }
        }
        addIfExists('x', pick(options.start, options.x));
        addIfExists('x2', pick(options.end, options.x2));
        addIfExists(
            'partialFill', pick(options.completed, options.partialFill)
        );
        addIfExists('connect', pick(options.dependency, options.connect));
    }

}, merge(parent.prototype.pointClass.prototype, {
    // pointProps - point member overrides. We inherit from parent as well.
    /**
     * Applies the options containing the x and y data and possible some extra
     * properties. This is called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {object} options
     *        The point options
     *
     * @param {number} x
     *        The x value
     *
     * @return {Highcharts.Point}
     *         The Point instance
     */
    applyOptions: function (options, x) {
        var point = this,
            retVal = merge(options);

        H.seriesTypes.gantt.prototype.setGanttPointAliases(retVal);

        retVal = parent.prototype.pointClass.prototype.applyOptions
            .call(point, retVal, x);
        return retVal;
    }
}));

/**
 * A `gantt` series.
 *
 * @extends   series,plotOptions.gantt
 * @excluding boostThreshold, connectors, dashStyle, findNearestPointBy,
 *            getExtremesFromAll, marker, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart
 * @product   gantt
 * @apioption series.gantt
 */

/**
 * Data for a Gantt series.
 *
 * @type      {Array<*>}
 * @extends   series.xrange.data
 * @excluding className, color, colorIndex, connect, dataLabels, events, id,
 *            partialFill, selected, x, x2
 * @product   gantt
 * @apioption series.gantt.data
 */

/**
 * Whether the grid node belonging to this point should start as collapsed. Used
 * in axes of type treegrid.
 *
 * @sample {gantt} gantt/treegrid-axis/collapsed/
 *         Start as collapsed
 *
 * @type      {boolean}
 * @default   false
 * @product   gantt
 * @apioption series.gantt.data.collapsed
 */

/**
 * The start time of a task.
 *
 * @type      {number}
 * @product   gantt
 * @apioption series.gantt.data.start
 */

/**
 * The end time of a task.
 *
 * @type      {number}
 * @product   gantt
 * @apioption series.gantt.data.end
 */

/**
 * The Y value of a task.
 *
 * @type      {number}
 * @product   gantt
 * @apioption series.gantt.data.y
 */

/**
 * The name of a task. If a `treegrid` y-axis is used (default in Gantt charts),
 * this will be picked up automatically, and used to calculate the y-value.
 *
 * @type      {string}
 * @product   gantt
 * @apioption series.gantt.data.name
 */

/**
 * Progress indicator, how much of the task completed. If it is a number, the
 * `fill` will be applied automatically.
 *
 * @sample {gantt} gantt/demo/progress-indicator
 *         Progress indicator
 *
 * @type      {number|*}
 * @extends   series.xrange.data.partialFill
 * @product   gantt
 * @apioption series.gantt.data.completed
 */

/**
 * The amount of the progress indicator, ranging from 0 (not started) to 1
 * (finished).
 *
 * @type      {number}
 * @default   0
 * @apioption series.gantt.data.completed.amount
 */

/**
 * The fill of the progress indicator. Defaults to a darkened variety of the
 * main color.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @apioption series.gantt.data.completed.fill
 */

/**
 * The ID of the point (task) that this point depends on in Gantt charts.
 * Aliases [connect](series.xrange.data.connect). Can also be an object,
 * specifying further connecting [options](series.gantt.connectors) between the
 * points. Multiple connections can be specified by providing an array.
 *
 * @sample gantt/demo/project-management
 *         Dependencies
 * @sample gantt/pathfinder/demo
 *         Different connection types
 *
 * @type      {string|Array<string|*>|*}
 * @extends   series.xrange.data.connect
 * @since     6.2.0
 * @product   gantt
 * @apioption series.gantt.data.dependency
 */

/**
 * Whether this point is a milestone. If so, only the `start` option is handled,
 * while `end` is ignored.
 *
 * @sample gantt/gantt/milestones
 *         Milestones
 *
 * @type      {boolean}
 * @since     6.2.0
 * @product   gantt
 * @apioption series.gantt.data.milestone
 */

/**
 * The ID of the parent point (task) of this point in Gantt charts.
 *
 * @sample gantt/demo/subtasks
 *         Gantt chart with subtasks
 *
 * @type      {string}
 * @since     6.2.0
 * @product   gantt
 * @apioption series.gantt.data.parent
 */

/**
 * @excluding afterAnimate
 * @apioption series.gantt.events
 */
