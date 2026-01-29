/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GanttPoint from './GanttPoint';
import type GanttSeriesOptions from './GanttSeriesOptions';

import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `gantt` series. If the [type](#series.gantt.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends      plotOptions.xrange
 * @product      gantt
 * @requires     highcharts-gantt
 * @optionparent plotOptions.gantt
 */
const GanttSeriesDefaults: GanttSeriesOptions = {

    // Options - default options merged with parent

    grouping: false,

    dataLabels: {

        enabled: true

    },

    tooltip: {

        headerFormat:
            '<span style="font-size: 0.8em">{series.name}</span><br/>',

        pointFormat: null as any,

        pointFormatter: function (this): string {
            const point = this as GanttPoint,
                series = point.series,
                xAxis = series.xAxis,
                formats = series.tooltipOptions.dateTimeLabelFormats,
                startOfWeek = xAxis.options.startOfWeek,
                ttOptions = series.tooltipOptions,
                milestone = point.options.milestone;

            let format = ttOptions.xDateFormat,
                retVal = '<b>' + (point.name || point.yCategory) + '</b>';

            if (ttOptions.pointFormat) {
                return point.tooltipFormatter(ttOptions.pointFormat);
            }

            if (!format && isNumber(point.start)) {
                format = series.chart.time.getDateFormat(
                    xAxis.closestPointRange,
                    point.start,
                    startOfWeek,
                    formats || {}
                );
            }

            const start = series.chart.time.dateFormat(
                    format as any,
                    point.start as any
                ),
                end = series.chart.time.dateFormat(
                    format as any,
                    point.end as any
                );

            retVal += '<br/>';

            if (!milestone) {
                retVal += 'Start: ' + start + '<br/>';
                retVal += 'End: ' + end + '<br/>';
            } else {
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

        radius: 0,

        startMarker: {
            enabled: true,
            symbol: 'arrow-filled',
            radius: 4,
            fill: '#fa0',
            align: 'left' as const
        },

        endMarker: {

            enabled: false, // Only show arrow on the dependent task

            align: 'right' as const

        }

    }

};

/**
 * A `gantt` series.
 *
 * @extends   series,plotOptions.gantt
 * @excluding boostThreshold, dashStyle, findNearestPointBy,
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
 * The start time of a task. May be a timestamp or a date string.
 *
 * @type      {number|string}
 * @product   gantt
 * @apioption series.gantt.data.start
 */

/**
 * The end time of a task. May be a timestamp or a date string.
 *
 * @type      {number|string}
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

''; // Detachs doclets above

/* *
 *
 *  Default Export
 *
 * */

export default GanttSeriesDefaults;
