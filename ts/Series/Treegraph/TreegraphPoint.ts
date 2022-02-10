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
import OrganizationPoint from '../Organization/OrganizationPoint.js';
import type TreegraphNode from './TreegraphNode.js';
import NodesComposition from '../NodesComposition.js';
import U from '../../Core/Utilities.js';
const { extend } = U;


/* *
 *
 *  Class
 *
 * */

class TreegraphPoint extends OrganizationPoint {
    public options: TreegraphPointOptions = void 0 as any;

    public series: TreegraphSeries = void 0 as any;

    public collapsed: boolean = void 0 as any;

    public fromNode: TreegraphNode = void 0 as any;

    public oldFromNode?: TreegraphNode;

    public oldToNode?: TreegraphNode;

    public toNode: TreegraphNode = void 0 as any;

    public dataLabelOnNull = true;

    public applyOptions(
        options: TreegraphPointOptions,
        x?: number | undefined
    ): TreegraphPoint {
        super.applyOptions.call(this, options, x);
        // to allow the tooltip for TreegraphPoint.
        this.formatPrefix = 'link';
        return this;
    }
}

interface TreegraphPoint {
    setState: typeof NodesComposition['setNodeState'];
}
extend(TreegraphPoint.prototype, {
    setState: NodesComposition.setNodeState
});
/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
