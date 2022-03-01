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

import type TreegraphPointOptions from './TreegraphPointOptions';
import type TreegraphSeries from './TreegraphSeries';
import type TreegraphNode from './TreegraphNode.js';
import type TreegraphLink from './TreegraphLink.js';
import U from '../../Core/Utilities.js';
import TreemapPoint from '../Treemap/TreemapPoint.js';
const { extend } = U;


/* *
 *
 *  Class
 *
 * */

class TreegraphPoint extends TreemapPoint {
    public options: TreegraphPointOptions = void 0 as any;

    public isLink = false;
    public series: TreegraphSeries = void 0 as any;

    public collapsed: boolean = void 0 as any;

    public node: TreegraphNode.Node = void 0 as any;
    public level?: number;
    public linkToParent?: TreegraphLink;
}

/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
