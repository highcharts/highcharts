/* *
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

import type ColorType from '../../Core/Color/ColorType';
import type OHLCSeries from './OHLCSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import HLCSeriesOptions from '../HLC/HLCSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        useOhlcData?: boolean;
    }
}

export interface OHLCSeriesOptions extends HLCSeriesOptions {
    upColor?: ColorType;
    states?: SeriesStatesOptions<OHLCSeries>;
}

export default OHLCSeriesOptions;
