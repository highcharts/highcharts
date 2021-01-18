/* *
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
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
import GanttPoint from './GanttPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, XRangeSeries = SeriesRegistry.seriesTypes.xrange;
import U from '../../Core/Utilities.js';
var extend = U.extend, isNumber = U.isNumber, merge = U.merge, splat = U.splat;
import '../../Core/Axis/TreeGridAxis.js';
import '../../Extensions/CurrentDateIndication.js';
import '../../Extensions/StaticScale.js';
import '../../Gantt/Pathfinder.js';
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.gantt
 *
 * @augments Highcharts.Series
 */
var GanttSeries = /** @class */ (function (_super) {
    __extends(GanttSeries, _super);
    function GanttSeries() {
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
     * Draws a single point in the series.
     *
     * This override draws the point as a diamond if point.options.milestone
     * is true, and uses the original drawPoint() if it is false or not set.
     *
     * @requires highcharts-gantt
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
    GanttSeries.prototype.drawPoint = function (point, verb) {
        var series = this, seriesOpts = series.options, renderer = series.chart.renderer, shapeArgs = point.shapeArgs, plotY = point.plotY, graphic = point.graphic, state = point.selected && 'select', cutOff = seriesOpts.stacking && !seriesOpts.borderRadius, diamondShape;
        if (point.options.milestone) {
            if (isNumber(plotY) && point.y !== null && point.visible !== false) {
                diamondShape = renderer.symbols.diamond(shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height);
                if (graphic) {
                    graphic[verb]({
                        d: diamondShape
                    });
                }
                else {
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
            }
            else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        }
        else {
            XRangeSeries.prototype.drawPoint.call(series, point, verb);
        }
    };
    /**
     * Handle milestones, as they have no x2.
     * @private
     */
    GanttSeries.prototype.translatePoint = function (point) {
        var series = this, shapeArgs, size;
        XRangeSeries.prototype.translatePoint.call(series, point);
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
    };
    /**
     * A `gantt` series. If the [type](#series.gantt.type) option is not specified,
     * it is inherited from [chart.type](#chart.type).
     *
     * @extends      plotOptions.xrange
     * @product      gantt
     * @requires     highcharts-gantt
     * @optionparent plotOptions.gantt
     */
    GanttSeries.defaultOptions = merge(XRangeSeries.defaultOptions, {
        // options - default options merged with parent
        grouping: false,
        dataLabels: {
            enabled: true
        },
        tooltip: {
            headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat: null,
            pointFormatter: function () {
                var point = this, series = point.series, tooltip = series.chart.tooltip, xAxis = series.xAxis, formats = series.tooltipOptions.dateTimeLabelFormats, startOfWeek = xAxis.options.startOfWeek, ttOptions = series.tooltipOptions, format = ttOptions.xDateFormat, start, end, milestone = point.options.milestone, retVal = '<b>' + (point.name || point.yCategory) + '</b>';
                if (ttOptions.pointFormat) {
                    return point.tooltipFormatter(ttOptions.pointFormat);
                }
                if (!format) {
                    format = splat(tooltip.getDateFormat(xAxis.closestPointRange, point.start, startOfWeek, formats))[0];
                }
                start = series.chart.time.dateFormat(format, point.start);
                end = series.chart.time.dateFormat(format, point.end);
                retVal += '<br/>';
                if (!milestone) {
                    retVal += 'Start: ' + start + '<br/>';
                    retVal += 'End: ' + end + '<br/>';
                }
                else {
                    retVal += start + '<br/>';
                }
                return retVal;
            }
        },
        connectors: {
            type: 'simpleConnect',
            /**
             * @declare Highcharts.ConnectorsAnimationOptionsObject
             */
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
                enabled: false,
                align: 'right'
            }
        }
    });
    return GanttSeries;
}(XRangeSeries));
extend(GanttSeries.prototype, {
    // Keyboard navigation, don't use nearest vertical mode
    keyboardMoveVertical: false,
    pointArrayMap: ['start', 'end', 'y'],
    pointClass: GanttPoint,
    setData: Series.prototype.setData
});
SeriesRegistry.registerSeriesType('gantt', GanttSeries);
/* *
 *
 *  Default Export
 *
 * */
export default GanttSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A `gantt` series.
 *
 * @extends   series,plotOptions.gantt
 * @excluding boostThreshold, connectors, dashStyle, findNearestPointBy,
 *            getExtremesFromAll, marker, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart
 * @product   gantt
 * @requires  highcharts-gantt
 * @apioption series.gantt
 */
/**
 * Data for a Gantt series.
 *
 * @declare   Highcharts.GanttPointOptionsObject
 * @type      {Array<*>}
 * @extends   series.xrange.data
 * @excluding className, connect, dataLabels, events,
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
''; // adds doclets above to the transpiled file
