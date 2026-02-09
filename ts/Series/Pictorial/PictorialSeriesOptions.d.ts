/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi, Magdalena Gut
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
