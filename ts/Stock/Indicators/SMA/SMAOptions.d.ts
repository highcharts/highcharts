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

import type LineSeriesOptions from '../../../Series/Line/LineSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SMAOptions extends LineSeriesOptions {
    compareToMain?: boolean;
    data?: Array<Array<number>>;
    params?: SMAParamsOptions;
}
export interface SMAParamsOptions {
    index?: number;
    period?: number;
}

export default SMAOptions;
