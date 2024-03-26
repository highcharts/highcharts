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

import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

export interface IndicatorLike extends Series {
    useCommonDataGrouping?: boolean;
}

export interface IndicatorLinkedSeriesLike {
    processedYData?: (
        Array<(number|null)>|
        Array<Array<(number|null)>>
    );
    xData?: Array<number>;
    yData?: (
        Array<(number|null)>|
        Array<Array<(number|null)>>
    );
}

/* *
 *
 *  Default Export
 *
 * */

export default IndicatorLike;
