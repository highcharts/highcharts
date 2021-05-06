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

import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface OBVOptions extends SMAOptions {
    marker?: PointMarkerOptions;
    params?: OBVParamsOptions;
    tooltip?: Highcharts.TooltipOptions;
}

export interface OBVParamsOptions extends SMAParamsOptions {
    // for inheritance
    volumeSeriesID?: string;
}

export default OBVOptions;
