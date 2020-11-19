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

import RequireIndicatorsResultObject from './RequireIndicatorsResultObject';
import LineSeries from '../../Series/Line/LineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface IndicatorLike extends LineSeries {
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
