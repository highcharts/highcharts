/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type { CSSLength } from '../../Core/Renderer/CSSObject';
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

        /**
         * The color of the border surrounding the column or bar.
         *
         * In styled mode, the border stroke can be set with the
         * `.highcharts-point` rule.
         *
         * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
         *         Dark gray border
         *
         * @product highcharts highstock
         */
        borderColor?: ColorType;

        /**
         * The width of the border surrounding the column or bar.
         *
         * In styled mode, the stroke width can be set with the
         * `.highcharts-point` rule.
         *
         * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
         *         2px black border
         *
         * @product highcharts highstock
         */
        borderWidth?: number;
    }
}

export interface ColumnPointOptions extends LinePointOptions {

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
     * A fixed width for the column or bar, either in pixels or as a CSS
     * length expression, e.g. `20`, `'2em'`, or a percentage of the
     * series' own point width, like `'50%'`. Overrides pointWidth on the
     * series. The width effects the dimension that is not based on the
     * point value.
     *
     * @see [series.pointWidth](#plotOptions.column.pointWidth)
     *
     * @type {number|Highcharts.CSSLength}
     *
     * @since 7.0.0
     *
     * @product highcharts highstock gantt
     */
    pointWidth?: (number|CSSLength);

    states?: PointMarkerStatesOptions<ColumnPointOptions>
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPointOptions;
