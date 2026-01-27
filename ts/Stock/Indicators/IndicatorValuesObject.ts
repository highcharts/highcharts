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
