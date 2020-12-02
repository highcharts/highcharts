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
import type DataLabelOptions from '../../../Core/Series/DataLabelOptions';
import type VBPIndicator from './VBPIndicator';

/* *
 *
 *  Declarations
 *
 * */

export interface VBPOptions extends SMAOptions {
    animationLimit?: number;
    crisp?: boolean;
    dataGrouping?: Highcharts.DataGroupingOptionsObject;
    dataLabels?: DataLabelOptions;
    enableMouseTracking?: boolean;
    params?: VBPParamsOptions;
    pointPadding?: number;
    volumeDivision?: VBPIndicator.VBPIndicatorStyleOptions;
    zIndex?: number;
    zoneLines?: VBPIndicator.VBPIndicatorStyleOptions;
}

export interface VBPParamsOptions extends SMAParamsOptions {
    ranges?: number;
    volumeSeriesID?: string;
    // for inheritance
}

export default VBPOptions;
