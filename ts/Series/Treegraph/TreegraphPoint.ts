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

    toggleCollapse(newState: boolean): void {
        const node = this.node;
        this.collapsed = newState;
        collapseTreeFromPoint(node, newState);
    }
}
/**
 * Recursive function, which sets node's  and each nodes' children parameter
 * 'hidden' to be equal to passed `hidden` value, and updates node's point
 * visibility attr.

 * @param point {TreegraphNode} point which should be hidden
 * @param hidden {boolean}
 */
function collapseTreeFromPoint(
    node: TreegraphNode.Node,
    hidden: boolean
): void {
    node.children.forEach(function (child: TreegraphNode.Node): void {
        child.point.update({ visible: !hidden }, false);
        collapseTreeFromPoint(child, hidden);
    });
}

/* *
 *
 *  Export Default
 *
 * */

export default TreegraphPoint;
