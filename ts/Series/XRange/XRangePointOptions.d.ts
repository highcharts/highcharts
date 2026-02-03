/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi, Lars A. V. Cabrera
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

import type ColumnPointOptions from '../Column/ColumnPointOptions';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface XRangePointOptions extends ColumnPointOptions {

    /**
     * A partial fill for each point, typically used to visualize how much
     * of a task is performed. See [completed](series.gantt.data.completed).
     *
     * @sample gantt/demo/progress-indicator
     *         Gantt with progress indicator
     *
     * @product gantt
     *
     * @apioption plotOptions.gantt.partialFill
     */

    /**
     * A partial fill for each point, typically used to visualize how much of
     * a task is performed. The partial fill object can be set either on series
     * or point level.
     *
     * @sample {highcharts} highcharts/demo/x-range
     *         X-range with partial fill
     *
     * @declare Highcharts.XrangePointPartialFillOptionsObject
     *
     * @product highcharts highstock gantt
     */
    partialFill?: XRangePointPartialFillOptions;

    /**
     * The starting X value of the range point. May be a timestamp or a date
     * string.
     *
     * @sample {highcharts} highcharts/demo/x-range
     *         X-range
     *
     * @product highcharts highstock gantt
     */
    x?: number|string;

    /**
     * The ending X value of the range point. May be a timestamp or a date
     * string.
     *
     * @sample {highcharts} highcharts/demo/x-range
     *         X-range
     *
     * @product highcharts highstock gantt
     */
    x2?: number|string;

    /**
     * The Y value of the range point.
     *
     * @sample {highcharts} highcharts/demo/x-range
     *         X-range
     *
     * @product highcharts highstock gantt
     */
    y?: (number|null);

}

/**
 * @optionparent series.xrange.data.partialFill
 */
export interface XRangePointPartialFillOptions {

    /**
     * The amount of the X-range point to be filled. Values can be 0-1 and are
     * converted to percentages in the default data label formatter.
     *
     * @product highcharts highstock gantt
     */
    amount?: number;

    /**
     * The fill color to be used for partial fills. Defaults to a darker shade
     * of the point color.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts highstock gantt
     */
    fill?: ColorType;

    height?: number;

    r?: number;

    width?: number;

    x?: number;

    y?: (number|null);

}

/* *
 *
 *  Default Export
 *
 * */

export default XRangePointOptions;
