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

import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type LinePointOptions from '../Line/LinePointOptions';
import type { PointMarkerStatesOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        borderColor?: ColorType;
    }
}

export interface ColumnPointOptions extends LinePointOptions {

    /**
     * The color of the border surrounding the column or bar.
     *
     * In styled mode, the border stroke can be set with the `.highcharts-point`
     * rule.
     *
     * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
     *         Dark gray border
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts highstock
     *
     * @apioption series.column.data.borderColor
     */

    /**
     * The width of the border surrounding the column or bar.
     *
     * In styled mode, the stroke width can be set with the `.highcharts-point`
     * rule.
     *
     * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
     *         2px black border
     *
     * @type {number}
     *
     * @product highcharts highstock
     *
     * @apioption series.column.data.borderWidth
     */

    /**
     * A name for the dash style to use for the column or bar. Overrides
     * dashStyle on the series.
     *
     * In styled mode, the stroke dash-array can be set with the same classes as
     * listed under [data.color](#series.column.data.color).
     *
     * @see [series.pointWidth](#plotOptions.column.dashStyle)
     */
    dashStyle?: DashStyleValue;

    /**
     * A pixel value specifying a fixed width for the column or bar.
     * Overrides pointWidth on the series.
     *
     * A pixel value specifying a fixed width for the column or bar. Overrides
     * pointWidth on the series. The width effects the dimension that is not
     * based on the point value.
     *
     * @see [series.pointWidth](#plotOptions.column.pointWidth)
     *
     * @since 7.0.0
     *
     * @product highcharts highstock gantt
     */
    pointWidth?: number;

    states?: PointMarkerStatesOptions<ColumnPointOptions>
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPointOptions;
