/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */


/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';


/* *
 *
 *  Declarations
 *
 * */

export default interface ContourSeriesOptions extends ScatterSeriesOptions {
    /**
     * Whether to use gradually transitioning color gradients between contour
     * levels. When disabled, each contour level is filled with a single flat
     * color.
     *
     * @sample {highcharts} highcharts/series-contour/contour-simple/
     *         Contour plot with smooth coloring
     *
     * @default false
     */
    smoothColoring?: boolean;

    /**
     * The interval between contour lines. Determines the spacing of value
     * levels where lines are drawn on the plot.
     *
     * @sample {highcharts} highcharts/series-contour/contour-simple/
     *         Contour plot with lines
     */
    contourInterval?: number;

    /**
     * The offset for contour line positioning. Shifts the contour levels so
     * lines and bands are drawn at `contourOffset + n * contourInterval`
     * instead of `n * contourInterval`.
     *
     * Example: with `contourInterval: 10` and `contourOffset: 5`, levels are
     * at 5, 15, 25, etc. Use this to align levels with a reference value
     * without changing the data. Non-positive values are treated as 0.
     *
     * @sample {highcharts} highcharts/series-contour/contour-simple/
     *         Contour plot with lines
     */
    contourOffset?: number;
    lineColor?: ColorType; // Kept because we might want alternate docs
}
