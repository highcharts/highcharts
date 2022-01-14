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
import OrganizationPoint from '../Organization/OrganizationPoint.js';

/* *
 *
 *  Class
 *
 * */

class TreegraphPoint extends OrganizationPoint {
    public options: TreegraphPointOptions = void 0 as any;
    public series: TreegraphSeries = void 0 as any;
    public collapsed: boolean = void 0 as any;
}

/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
