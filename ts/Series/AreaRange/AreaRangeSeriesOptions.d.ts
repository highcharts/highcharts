/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
import type AreaSeriesOptions from '../Area/AreaSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import { PointMarkerOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface AreaRangeSeriesOptions extends AreaSeriesOptions {
    dataLabels?: (
        AreaRangeDataLabelOptions |
        Array<AreaRangeDataLabelOptions>
    );
    states?: SeriesStatesOptions<AreaRangeSeries>;
    trackByArea?: boolean;
    lowMarker?: PointMarkerOptions;
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        trackByArea?: boolean;
    }
}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangeSeriesOptions;
