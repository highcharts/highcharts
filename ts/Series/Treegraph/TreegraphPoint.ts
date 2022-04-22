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
import type TreegraphNode from './TreegraphNode';
import type TreegraphLink from './TreegraphLink';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        treemap: {
            prototype: {
                pointClass: TreemapPoint
            }
        }
    }
} = SeriesRegistry;


/* *
 *
 *  Class
 *
 * */

class TreegraphPoint extends TreemapPoint {
    public options: TreegraphPointOptions = void 0 as any;
    public isLink = false;
    public series: TreegraphSeries = void 0 as any;
    public collapsed: boolean = false;
    public node: TreegraphNode.Node = void 0 as any;
    public level?: number;
    public linkToParent?: TreegraphLink;

    shouldDraw(): boolean {
        return super.shouldDraw() && this.visible;
    }
}
/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
