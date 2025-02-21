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
import type { IndicatorLinkedSeriesLike } from './IndicatorLike';
import type LineSeries from '../../Series/Line/LineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface IndicatorValuesObject<
    /* eslint-disable-next-line */
    TLinkedSeries extends LineSeries
> {
    values: Array<Array<(
        ExtractArrayType<IndicatorLinkedSeriesLike['xData']>|
        ExtractArrayType<IndicatorLinkedSeriesLike['yData']>
    )>>;
    xData: NonNullable<IndicatorLinkedSeriesLike['xData']>;
    yData: NonNullable<IndicatorLinkedSeriesLike['yData']>;
}

export default IndicatorValuesObject;
