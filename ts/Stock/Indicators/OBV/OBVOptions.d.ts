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
}

export interface OBVParamsOptions extends SMAParamsOptions {
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default OBVOptions;
