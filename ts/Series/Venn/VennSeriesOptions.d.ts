/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
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

import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type VennPointOptions from './VennPointOptions';
import type VennSeries from './VennSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface VennSeriesOptions extends ScatterSeriesOptions {
    borderDashStyle?: DashStyleValue;
    brighten?: number;
    brightness?: number;
    data?: Array<VennPointOptions>;
    states?: SeriesStatesOptions<VennSeries>;
}

export default VennSeriesOptions;
