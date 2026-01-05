/* *
 *
 *  License: www.highcharts.com/license
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

/** @internal */
export interface IndicatorBase extends Series {
    useCommonDataGrouping?: boolean;
}

/** @internal */
export interface IndicatorLinkedSeriesBase {
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

export default IndicatorBase;
