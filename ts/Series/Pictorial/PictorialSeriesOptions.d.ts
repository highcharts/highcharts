/* *
 *
 *  (c) 2010-2022 Torstein Honsi, Magdalena Gut
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
