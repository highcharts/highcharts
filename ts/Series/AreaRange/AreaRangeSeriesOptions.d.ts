/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type AreaRangeDataLabelOptions from './AreaRangeDataLabelOptions';
import type AreaRangeSeries from './AreaRangeSeries';
import type { AreaSeriesPlotOptions } from '../Area/AreaSeriesOptions';
import type {
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesPlotOptions {
        trackByArea?: boolean;
    }
}

export interface AreaRangeSeriesOptions
    extends SeriesOptions, AreaRangeSeriesPlotOptions
{
    dataLabels?: AreaRangeSeriesPlotOptions['dataLabels'];
}

export interface AreaRangeSeriesPlotOptions extends AreaSeriesPlotOptions {
    dataLabels?: (
        AreaRangeDataLabelOptions |
        Array<AreaRangeDataLabelOptions>
    );
    states?: SeriesStatesOptions<AreaRangeSeries>;
    trackByArea?: boolean;
}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangeSeriesOptions;
