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
     * Whether to use smooth color transitions.
     *
     * @sample {highcharts} highcharts/demo/contour/
     *         Contour plot with smooth coloring
     */
    smoothColoring?: boolean;

    /**
     * Whether to display contour lines.
     *
     * @sample {highcharts} highcharts/demo/contour/
     *         Contour plot with lines
     */
    showContourLines?: boolean;

    /**
     * Whether to render the series on the background, so that it is visible
     * behind axes and grid lines. It will be also visible behind series that
     * are rendered before it.
     *
     * @sample {highcharts} highcharts/demo/contour/
     *         Contour plot rendered on background
     */
    renderOnBackground?: boolean;

    /**
     * The interval between contour lines.
     *
     * @sample {highcharts} highcharts/demo/contour/
     *         Contour plot with lines
     */
    contourInterval?: number;

    /**
     * The offset of the contour lines.
     *
     * @sample {highcharts} highcharts/demo/contour/
     *         Contour plot with lines
     */
    contourOffset?: number;
    lineColor?: ColorType; // Kept because we might want alternate docs
}
