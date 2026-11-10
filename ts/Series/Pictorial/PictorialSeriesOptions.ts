/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi, Magdalena Gut
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface PictorialSeriesOptions extends ColumnSeriesOptions {
    paths?: Array <PictorialPathOptions>;
}

export interface PictorialPathOptions {
    definition?: string | SVGPath;
    max?: number;
}

/* *
 *
 *  Export
 *
 * */
export default PictorialSeriesOptions;
