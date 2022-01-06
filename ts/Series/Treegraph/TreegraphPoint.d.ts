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

import type TreegraphPointOptions from './TreegraphPointOptions';
import type TreegraphSeries from './TreegraphSeries';
import type OrganizationPoint from '../Organization/OrganizationPoint';

/* *
 *
 *  Class
 *
 * */

declare class TreegraphPoint extends OrganizationPoint {
    public options: TreegraphPointOptions;
    public series: TreegraphSeries;
    public collapsed: boolean;
}

/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
