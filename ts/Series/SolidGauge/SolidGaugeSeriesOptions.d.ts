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

import type SolidGaugeSeries from './SolidGaugeSeries';
import type GaugeSeriesOptions from '../Gauge/GaugeSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SolidGaugeSeriesOptions extends GaugeSeriesOptions {
    innerRadius?: string;
    linecap?: ('butt'|'round'|'square');
    overshoot?: number;
    radius?: string;
    rounded?: boolean;
    states?: SeriesStatesOptions<SolidGaugeSeries>;
    threshold?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default SolidGaugeSeriesOptions;
