/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TreegraphSeries from './TreegraphSeries.js';

import TreegraphPoint from './TreegraphPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        treemap: {
            prototype: {
                NodeClass: TreemapNode
            }
        }
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 */
class TreegraphNode extends TreemapNode {

    /* *
     *
     *  Properties
     *
     * */

    public mod: number = 0;
    public thread?: TreegraphNode;
    public shift: number = 0;
    public change: number = 0;
    public children: Array<TreegraphNode> = [];
    public x?: number;
    public y?: number;
    public preX: number = 0;
    public oldParentNode?: TreegraphNode;
    public hidden = false;
    public nodeHeight?: number;
    public wasVisited = false;
    public collapsed: boolean = false;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Get the next left node which is either first child or thread.
     *
     * @return {TreegraphNode|undefined}
     *         Next left node child or thread.
     */
    public nextLeft(this: TreegraphNode): (TreegraphNode|undefined) {
        return this.getLeftMostChild() || this.thread;
    }

    /**
     * Get the next right node which is either last child or thread.
     *
     * @return {TreegraphNode|undefined}
     *         Next right node child or thread.
     */
    public nextRight(this: TreegraphNode): (TreegraphNode|undefined) {
        return this.getRightMostChild() || this.thread;
    }

    /**
     * Return the left one of the greatest uncommon ancestors of a
     * leftInternal node and it's right neighbor.
     *
     * @param {TreegraphNode} leftIntNode
     * @param {TreegraphNode} defaultAncestor
     * @return {TreegraphNode}
     *         Left one of the greatest uncommon ancestors of a leftInternal
     *         node and it's right neighbor.
     *
     */
    public getAncestor(
        this: TreegraphNode,
        leftIntNode: TreegraphNode,
        defaultAncestor: TreegraphNode
    ): TreegraphNode {
        const leftAnc = leftIntNode.ancestor;
        if (leftAnc.children[0] === this.children[0]) {
            return leftIntNode.ancestor;
        }
        return defaultAncestor;
    }

    /**
     * Get node's first sibling, which is not hidden.
     *
     * @return {TreegraphNode|undefined}
     *         First sibling of the node which is not hidden or undefined, if it
     *         does not exists.
     */
    public getLeftMostSibling(this: TreegraphNode): (TreegraphNode|undefined) {
        const parent = this.getParent();
        if (parent) {
            for (const child of parent.children) {
                if (child && child.point.visible) {
                    return child;
                }
            }
        }
    }

    /**
     * Check if the node is a leaf (if it has any children).
     *
     * @return {boolean}
     *         If the node has no visible children return true.
     */
    public hasChildren(): (boolean|undefined) {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].point.visible) {
                return true;
            }
        }
        return false;
    }
    /**
     * Get node's left sibling (if it exists).
     *
     * @return {TreegraphNode|undefined}
     *         Left sibling of the node
     */
    public getLeftSibling(this: TreegraphNode): TreegraphNode | undefined {
        const parent = this.getParent();
        if (parent) {
            const children = parent.children;
            for (let i = this.relativeXPosition - 1; i >= 0; i--) {
                if (children[i] && children[i].point.visible) {
                    return children[i];
                }
            }
        }
    }

    /**
     * Get the node's first child (if it exists).
     *
     * @return {TreegraphNode|undefined}
     *         Node's first child which isn't hidden.
     */
    public getLeftMostChild(this: TreegraphNode): (TreegraphNode|undefined) {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].point.visible) {
                return children[i];
            }
        }
    }

    /**
     * Get the node's last child (if it exists).
     *
     * @return {TreegraphNode|undefined}
     *         Node's last child which isn't hidden.
     */
    public getRightMostChild(this: TreegraphNode): (TreegraphNode|undefined) {
        const children = this.children;
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].point.visible) {
                return children[i];
            }
        }
    }

    /**
     * Get the parent of current node or return undefined for root of the
     * tree.
     *
     * @return {TreegraphNode|undefined}
     *         Node's parent or undefined for root.
     */
    public getParent(this: TreegraphNode): (TreegraphNode|undefined) {
        return this.parentNode;
    }

    /**
     * Get node's first child which is not hidden.
     *
     * @return {TreegraphNode|undefined}
     *         First child.
     */
    public getFirstChild(this: TreegraphNode): (TreegraphNode|undefined) {
        const children = this.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].point.visible) {
                return children[i];
            }
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface TreegraphNode {
    point: TreegraphPoint;
    ancestor: TreegraphNode;
    column: number;
    parentNode: TreegraphNode;
    relativeXPosition: number;
    xPosition: number;
    yPosition: number;
    nodeSizeX: number;
    nodeSizeY: number;
    series: TreegraphSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphNode;
