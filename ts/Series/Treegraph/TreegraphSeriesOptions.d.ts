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

import type OrganizationSeriesOptions from '../Organization/OrganizationSeriesOptions';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */


export type TreegraphLayoutTypes = 'Walker';
export interface TreegraphSeriesOptions extends OrganizationSeriesOptions {
    layout: string;
    reversed: boolean;
    marker: PointMarkerOptions;
}


export default TreegraphSeriesOptions;
