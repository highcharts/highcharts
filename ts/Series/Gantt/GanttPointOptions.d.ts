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

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type { GanttDependencyOptions } from './GanttSeriesOptions';
import type {
    XRangePointOptions,
    XRangePointPartialFillOptions
} from '../../Series/XRange/XRangePointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface GanttPointOptions extends XRangePointOptions {

    /**
     * Whether the grid node belonging to this point should start as collapsed.
     * Used in axes of type treegrid.
     *
     * @sample {gantt} gantt/treegrid-axis/collapsed/
     *         Start as collapsed
     *
     * @type {boolean}
     *
     * @default false
     *
     * @product gantt
     *
     * @apioption series.gantt.data.collapsed
     */

    /**
     * The name of a task. If a `treegrid` y-axis is used (default in Gantt charts),
     * this will be picked up automatically, and used to calculate the y-value.
     *
     * @type {string}
     *
     * @product gantt
     *
     * @apioption series.gantt.data.name
     */

    /**
     * The Y value of a task.
     *
     * @type {number}
     *
     * @product gantt
     *
     * @apioption series.gantt.data.y
     */

    /**
     * Progress indicator, how much of the task completed. If it is a number,
     * the `fill` will be applied automatically.
     *
     * @sample {gantt} gantt/demo/progress-indicator
     *         Progress indicator
     *
     * @extends series.xrange.data.partialFill
     *
     * @product gantt
     */
    completed?: (number|GanttPointCompletedOptions);


    /**
     * The ID of the point (task) that this point depends on in Gantt charts.
     * Aliases [connect](series.xrange.data.connect). Can also be an object,
     * specifying further connecting [options](series.gantt.connectors) between
     * the points. Multiple connections can be specified by providing an array.
     *
     * @sample gantt/demo/project-management
     *         Dependencies
     *
     * @sample gantt/pathfinder/demo
     *         Different connection types
     *
     * @extends series.xrange.data.connect
     *
     * @since 6.2.0
     *
     * @product gantt
     *
     * @apioption series.gantt.data.dependency
     */
    dependency?: GanttDependencyOptions;

    /**
     * The end time of a task. May be a timestamp or a date string.
     *
     * @product gantt
     */
    end?: number;

    /**
     * Whether this point is a milestone. If so, only the `start` option is
     * handled, while `end` is ignored.
     *
     * @sample gantt/gantt/milestones
     *         Milestones
     *
     * @since 6.2.0
     *
     * @product gantt
     */
    milestone?: boolean;

    /**
     * The ID of the parent point (task) of this point in Gantt charts.
     *
     * @sample gantt/demo/subtasks
     *         Gantt chart with subtasks
     *
     * @since 6.2.0
     *
     * @product gantt
     */
    parent?: string;

    /**
     * The start time of a task. May be a timestamp or a date string.
     *
     * @product gantt
     */
    start?: number;

}

/**
 * @optionparent series.gantt.data.completed
 */
export interface GanttPointCompletedOptions
    extends XRangePointPartialFillOptions {

    /**
     * The fill of the progress indicator. Defaults to a darkened variety of the
     * main color.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    fill?: ColorType;

    /**
     * The amount of the progress indicator, ranging from 0 (not started) to 1
     * (finished).
     *
     * @default 0
     */
    amount?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default GanttPointOptions;
