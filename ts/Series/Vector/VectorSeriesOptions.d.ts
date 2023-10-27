/* *
 *
 *  Vector plot series module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type VectorSeries from './VectorSeries';

/* *
 *
 *  Declarations
 *
 * */

export type VectorRotationOriginValue = ('start'|'center'|'end');

export interface VectorSeriesOptions extends ScatterSeriesOptions {
    rotationOrigin?: VectorRotationOriginValue;
    states?: SeriesStatesOptions<VectorSeries>;
    vectorLength?: number;
}

export default VectorSeriesOptions;
