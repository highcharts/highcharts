/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

/** @internal */
export interface IndicatorBase extends Series {
    /** @internal */
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

/** @internal */
export default IndicatorBase;
