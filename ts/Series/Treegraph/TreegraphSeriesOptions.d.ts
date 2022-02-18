/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
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

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import TreemapSeriesOptions from '../Treemap/TreemapSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */


export type TreegraphLayoutTypes = 'Walker';
export interface TreegraphSeriesOptions extends TreemapSeriesOptions {
    layout: string;
    reversed: boolean;
    marker: PointMarkerOptions;
}


export default TreegraphSeriesOptions;
