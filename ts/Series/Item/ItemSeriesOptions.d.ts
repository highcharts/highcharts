/* *
 *
 *  (c) 2019-2021 Torstein Honsi
 *
 *  Item series type for Highcharts
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

import type { ItemPointMarkerOptions } from './ItemPointOptions';
import type ItemSeries from './ItemSeries';
import type PieSeriesOptions from '../Pie/PieSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ItemSeriesOptions extends PieSeriesOptions {
    itemPadding?: number;
    layout?: string;
    marker?: ItemPointMarkerOptions;
    rows?: number;
    states?: SeriesStatesOptions<ItemSeries>;
}

export default ItemSeriesOptions;
