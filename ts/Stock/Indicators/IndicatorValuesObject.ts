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
import type { IndicatorLinkedSeriesBase } from './IndicatorBase';
import type LineSeries from '../../Series/Line/LineSeries';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface IndicatorValuesObject<
    /* eslint-disable-next-line */
    TLinkedSeries extends LineSeries
> {
    values: Array<Array<(
        ExtractArrayType<IndicatorLinkedSeriesBase['xData']>|
        ExtractArrayType<IndicatorLinkedSeriesBase['yData']>
    )>>;
    xData: NonNullable<IndicatorLinkedSeriesBase['xData']>;
    yData: NonNullable<IndicatorLinkedSeriesBase['yData']>;
}

/** @internal */
export default IndicatorValuesObject;
