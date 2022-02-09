/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import TreegraphPoint from './TreegraphPoint.js';
import type TreegraphSeries from './TreegraphSeries.js';

class TreegraphNode extends TreegraphPoint {
    public mod: number = 0;
    public thread?: TreegraphNode;
    public ancestor: TreegraphNode = void 0 as any;
    public shift: number = 0;
    public change: number = 0;
    public preX: number = 0;
    public column: number = void 0 as any;
    public relativeXPosition: number = void 0 as any;
    public xPosition: number = void 0 as any;
    public yPosition: number = void 0 as any;
    public hidden = false;
    public linksFrom: Array<TreegraphPoint> = [];
    public linksTo: Array<TreegraphPoint> = [];
    public nodeSizeX: number = void 0 as any;
    public nodeSizeY: number = void 0 as any;
    public nodeHeight?: number;
    public series: TreegraphSeries = void 0 as any;
    public wasVisited = false;

    /**
     * Get the next left node which is either first child or thread.
     *
     * @return {TreegraphNode | undefined} Next left node child or thread.
     */
    public nextLeft(this: TreegraphNode): TreegraphNode | undefined {
        return this.getLeftMostChild() || this.thread;
    }

    /**
     * Get the next right node which is either last child or thread.
     *
     * @return {TreegraphNode | undefined} Next right node child or thread.
     */
    public nextRight(this: TreegraphNode): TreegraphNode | undefined {
        return this.getRightMostChild() || this.thread;
    }


    /**
     * Return the left one of the greatest uncommon ancestors of a leftInternal
     * node and it's right neighbor.
     *
     * @param leftIntNode {TreegraphNode} leftInternalNode
     * @param defaultAncestor {TreegraphNode} defaultAncestor
     * @return {TreegraphNode} Left one of the greatest uncommon ancestors of a
     * leftInternal node and it's right neighbor.
     *
     */
    public getAncestor(
        this: TreegraphNode,
        leftIntNode: TreegraphNode,
        defaultAncestor: TreegraphNode
    ): TreegraphNode {
        let leftAnc = leftIntNode.ancestor;
        if (leftAnc.linksTo[0].fromNode === this.linksTo[0].fromNode) {
            return leftIntNode.ancestor;
        }
        return defaultAncestor;
    }
    /**
     * Get node's first sibling, which is not hidden.
     *
     * @return {TreegraphNode | undefined} First sibling of the node which is
     * not hidden or undefined, if it does not exists
     *
     */
    public getLeftMostSibling(this: TreegraphNode): TreegraphNode | undefined {
        let parent = this.getParent();
        if (parent) {
            const children = parent.linksFrom;
            for (let i = 0; i < children.length; i++) {
                if (children[i] && !children[i].toNode.hidden) {
                    return children[i].toNode;
                }
            }
        }
    }
    /**
     * Get node's left sibling (if it exists).
     *
     * @return {TreegraphNode | undefined} left sibling of the node
     */
    public getLeftSibling(this: TreegraphNode): TreegraphNode | undefined {
        let parent = this.getParent();
        if (parent) {
            const children = parent.linksFrom;
            for (let i = this.relativeXPosition - 1; i >= 0; i--) {
                if (children[i] && !children[i].toNode.hidden) {
                    return children[i].toNode;
                }
            }
        }
    }

    /**
     * Get the node's first child (if it exists).
     *
     * @return {TreegraphNode | undefined} node's first child which isn't
     * hidden
     */
    public getLeftMostChild(this: TreegraphNode): TreegraphNode | undefined {
        const linksFrom = this.linksFrom;
        for (let i = 0; i < linksFrom.length; i++) {
            if (!linksFrom[i].toNode.hidden) {
                return linksFrom[i].toNode;
            }
        }
    }

    /**
     * Get the node's last child (if it exists).
     *
     * @return {TreegraphNode | undefined} node's last child which isn't hidden
     *
     */
    public getRightMostChild(this: TreegraphNode): TreegraphNode | undefined {
        const linksFrom = this.linksFrom;
        for (let i = linksFrom.length - 1; i >= 0; i--) {
            if (!linksFrom[i].toNode.hidden) {
                return linksFrom[i].toNode;
            }
        }
    }

    /**
     * Get the parent of current node or return undefined for root of the tree.
     *
     * @return {TreegraphNode | undefined} Node's parent or undefined for root.
     */
    public getParent(this: TreegraphNode): TreegraphNode | undefined {
        if (this.linksTo[0]) {
            return this.linksTo[0].fromNode;
        }
    }

    /**
     * Check if the node is a leaf (if it has any children).
     *
     * @return {boolean} If the node has no visible children return true.
     */
    public isLeaf(this: TreegraphNode): boolean {
        for (let i = 0; i < this.linksFrom.length; i++) {
            if (!this.linksFrom[i].toNode.hidden) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get node's first child which is not hidden.
     *
     * @return {TreegraphNode | undefined} First child.
     */
    public getFirstChild(this: TreegraphNode): TreegraphNode | undefined {
        for (let i = 0; i < this.linksFrom.length; i++) {
            if (!this.linksFrom[i].toNode.hidden) {
                return this.linksFrom[i].toNode;
            }
        }
    }
}

export default TreegraphNode;
