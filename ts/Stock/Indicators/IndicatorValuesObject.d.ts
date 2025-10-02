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
import type { IndicatorLinkedSeriesBase } from './IndicatorBase';
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
        ExtractArrayType<IndicatorLinkedSeriesBase['xData']>|
        ExtractArrayType<IndicatorLinkedSeriesBase['yData']>
    )>>;
    xData: NonNullable<IndicatorLinkedSeriesBase['xData']>;
    yData: NonNullable<IndicatorLinkedSeriesBase['yData']>;
}

export default IndicatorValuesObject;
