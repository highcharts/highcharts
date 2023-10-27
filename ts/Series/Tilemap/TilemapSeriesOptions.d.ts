/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2021 Highsoft AS
 *  Author: Øystein Moseng
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

import type HeatmapSeriesOptions from '../Heatmap/HeatmapSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TilemapSeries from './TilemapSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface TilemapSeriesOptions extends HeatmapSeriesOptions {
    state?: SeriesStatesOptions<TilemapSeries>;
    tileShape?: TilemapShapeValue;
}

export type TilemapShapeValue = ('circle'|'diamond'|'hexagon'|'square');

export default TilemapSeriesOptions;
