/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type AreaRangeDataLabelsOptionsObject from './AreaRangeDataLabelsOptionsObject';
import type AreaRangeSeries from './AreaRangeSeries';
import type AreaSeriesOptions from '../Area/AreaSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface AreaRangeSeriesOptions extends AreaSeriesOptions {
    dataLabels?: (
        AreaRangeDataLabelsOptionsObject |
        Array<AreaRangeDataLabelsOptionsObject>
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
