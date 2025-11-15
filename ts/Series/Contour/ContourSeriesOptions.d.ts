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
    smoothColoring?: boolean;
    showContourLines?: boolean;
    renderOnBackground?: boolean;
    contourInterval?: number;
    contourOffset?: number;
    lineColor?: ColorType; // Kept because we might want alternate docs
    lineWidth?: number; // Kept because we might want alternate docs
}
