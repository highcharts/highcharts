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

import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface LollipopSeriesOptions extends ScatterSeriesOptions {
    /**
     * Color of the line that connects the dumbbell point's values.
     * By default it is the series' color.
     *
     * @product highcharts highstock
     *
     * @since 8.0.0
     */
    connectorColor?: ColorString;
    /**
     * Pixel width of the line that connects the dumbbell point's
     * values.
     *
     * @since 8.0.0
     *
     * @product highcharts highstock
     */
    connectorWidth?: number;
    /**
     * Padding between each value groups, in x axis units.
     *
     * @default 0.2
     *
     * @product highcharts highstock
     */
    groupPadding?: number;
    /**
     * Color of the start markers in a dumbbell graph. This option takes
     * priority over the series color. To avoid this, set `lowColor` to
     * `undefined`.
     *
     * @since 8.0.0
     *
     * @product highcharts highstock
     */
    /** @deprecated */
    lowColor?: ColorType;
    /**
     * Padding between each column or bar, in x axis units.
     *
     * @default 0.1
     *
     * @product highcharts highstock
     */
    pointPadding?: number;
    states?: SeriesStatesOptions<LollipopSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LollipopSeriesOptions;
