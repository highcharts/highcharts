/* *
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

import type { SMAOptions, SMAParamsOptions } from '../SMA/SMAOptions';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';
import type TooltipOptions from '../../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface OBVOptions extends SMAOptions {
    marker?: PointMarkerOptions;
    params?: OBVParamsOptions;
}

export interface OBVParamsOptions extends SMAParamsOptions {
    // for inheritance
    volumeSeriesID?: string;
}

export default OBVOptions;
