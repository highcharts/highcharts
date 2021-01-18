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

import type RequireIndicatorsResultObject from './RequireIndicatorsResultObject';
import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

export interface IndicatorLike extends Series {
    useCommonDataGrouping?: boolean;
    /** @requires indicators/indicators */
    requireIndicators(): RequireIndicatorsResultObject;
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        useCommonDataGrouping?: IndicatorLike['useCommonDataGrouping'];
    }
}

export default IndicatorLike;
