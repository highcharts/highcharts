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

import type OrganizationSeriesOptions from '../Organization/OrganizationSeriesOptions';
import { PointMarkerOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TreegraphSeriesOptions extends OrganizationSeriesOptions {
    layout: string;
    reversed: boolean;
    borderWidth: number;
    marker: PointMarkerOptions;
    link: any;
}


export default TreegraphSeriesOptions;
