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

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options for the CMF indicator.
 *
 * @interface Highcharts.CMFOptions
 * @extends Highcharts.SMAOptions
 */
export interface CMFOptions extends SMAOptions {
    /**
     * Parameters used in calculation of CMF values.
     */
    params?: CMFParamsOptions;
}

/**
 * Parameters used in calculation of CMF values.
 *
 * @interface Highcharts.CMFParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface CMFParamsOptions extends SMAParamsOptions {
    /**
     * The id of volume series which is mandatory.
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default CMFOptions;
