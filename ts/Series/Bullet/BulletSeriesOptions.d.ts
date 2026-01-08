/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type BulletPointOptions from './BulletPointOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A bullet graph is a variation of a bar graph. The bullet graph features
 * a single measure, compares it to a target, and displays it in the context
 * of qualitative ranges of performance that could be set using
 * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
 *
 * A `bullet` series. If the [type](#series.bullet.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/bullet-graph/
 *         Bullet graph
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.bullet
 *
 * @since 6.0.0
 *
 * @product highcharts
 *
 * @excluding allAreas, boostThreshold, colorAxis, compare, compareBase,
 *            dataSorting, boostBlending
 *
 * @excluding dataParser, dataURL, marker, boostThreshold,
 *            boostBlending
 *
 * @requires modules/bullet
 */
export interface BulletSeriesOptions extends ColumnSeriesOptions {

    /**
     * All options related with look and positioning of targets.
     *
     * @since 6.0.0
     */
    targetOptions?: BulletTargetOptions;

    /**
     * An array of data points for the series. For the `bullet` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 3 or 2 values. In this case, the values
     *  correspond
     *    to `x,y,target`. If the first value is a string, it is applied as the
     *  name
     *    of the point, and the `x` value is inferred. The `x` value can also be
     *    omitted, in which case the inner arrays should be of length 2\. Then
     *  the
     *    `x` value is automatically calculated, either starting at 0 and
     *    incremented by 1, or from `pointStart` and `pointInterval` given in
     *  the
     *    series options.
     *    ```js
     *    data: [
     *        [0, 40, 75],
     *        [1, 50, 50],
     *        [2, 60, 40]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.bullet.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 0,
     *        y: 40,
     *        target: 75,
     *        name: "Point1",
     *        color: "#00FF00"
     *    }, {
     *         x: 1,
     *        y: 60,
     *        target: 40,
     *        name: "Point2",
     *        color: "#FF00FF"
     *    }]
     *    ```
     *
     * @type {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
     *
     * @extends series.column.data
     *
     * @since 6.0.0
     *
     * @product highcharts
     *
     * @apioption series.bullet.data
     */
    data?: Array<(BulletPointOptions|PointShortOptions)>;

    tooltip?: Partial<TooltipOptions>;

}

/**
 * All options related with look and positioning of targets.
 *
 * @since 6.0.0
 */
export interface BulletTargetOptions {

    /**
     * The border color of the rectangle representing the target. When
     * not set, the point's border color is used.
     *
     * In styled mode, use class `highcharts-bullet-target` instead.
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    borderColor?: ColorString;

    /**
     * The border radius of the rectangle representing the target.
     */
    borderRadius?: number;

    /**
     * The border width of the rectangle representing the target.
     *
     * In styled mode, use class `highcharts-bullet-target` instead.
     *
     * @since 6.0.0
     */
    borderWidth?: number;

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
     * @since 6.0.0
     *
     * @product highcharts
     */
    color?: ColorType;

    /**
     * The height of the rectangle representing the target.
     *
     * @since 6.0.0
     */
    height?: number;

    /**
     * The width of the rectangle representing the target. Could be set
     * as a pixel value or as a percentage of a column width.
     *
     * @since 6.0.0
     */
    width?: (number|string);

}

/* *
 *
 *  Default Export
 *
 * */

export default BulletSeriesOptions;
