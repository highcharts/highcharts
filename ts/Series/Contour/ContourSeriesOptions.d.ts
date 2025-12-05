/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
     * Whether to display contour lines on the canvas. When enabled, lines are
     * drawn along the boundaries between different values.
     *
     * @sample {highcharts} highcharts/series-contour/contour-simple/
     *         Contour plot with lines
     *
     * @default true
     */
    showContourLines?: boolean;

    /**
     * The interval between contour lines. Determines the spacing of value
     * levels where lines are drawn on the plot.
     *
     * @sample {highcharts} highcharts/series-contour/contour-simple/
     *         Contour plot with lines
     */
    contourInterval?: number;

    /**
     * The offset for contour line positioning. Shifts where lines are drawn
     * relative to the data values.
     *
     * @sample {highcharts} highcharts/series-contour/contour-simple/
     *         Contour plot with lines
     */
    contourOffset?: number;
    lineColor?: ColorType; // Kept because we might want alternate docs
}
