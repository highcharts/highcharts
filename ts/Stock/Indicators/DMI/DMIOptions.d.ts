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

import type MultipleLinesComposition from '../MultipleLinesComposition';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DMIOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    params?: DMIParamsOptions;
    plusDILine?: DMILineOptions;
    minusDILine?: DMILineOptions;
}

export interface DMILineOptions {
    styles?: DMILineStylesOptions;
}

export interface DMILineStylesOptions {
    lineColor?: string;
    lineWidth?: number;
}

export interface DMIParamsOptions extends SMAParamsOptions {
    // For inheritance
}

export default DMIOptions;
