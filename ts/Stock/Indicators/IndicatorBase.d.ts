/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

export interface IndicatorBase extends Series {
    useCommonDataGrouping?: boolean;
}

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
