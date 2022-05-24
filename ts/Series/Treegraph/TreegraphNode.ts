/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type TreegraphSeries from './TreegraphSeries.js';
import type TreemapNodeNS from '../Treemap/TreemapNode.js';

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

namespace TreegraphNode {
    export interface NodeValuesObject extends TreemapNodeNS.NodeValuesObject {}
    export class Node extends TreemapNode {
        public mod: number = 0;
        public thread?: Node;
        public ancestor: Node = void 0 as any;
        public shift: number = 0;
        public change: number = 0;
        public children: Array<Node> = [];
        public x?: number;
        public y?: number;
        public preX: number = 0;
        public point: TreegraphPoint = void 0 as any;
        public column: number = void 0 as any;
        public oldParentNode?: Node;
        public parentNode: Node = void 0 as any;
        public relativeXPosition: number = void 0 as any;
        public xPosition: number = void 0 as any;
        public yPosition: number = void 0 as any;
        public hidden = false;
        public nodeSizeX: number = void 0 as any;
        public nodeSizeY: number = void 0 as any;
        public nodeHeight?: number;
        public series: TreegraphSeries = void 0 as any;
        public wasVisited = false;
        public collapsed: boolean = false;
        /**
         * Get the next left node which is either first child or thread.
         *
         * @return {Node | undefined} Next left node child or thread.
         */
        public nextLeft(this: Node): Node | undefined {
            return this.getLeftMostChild() || this.thread;
        }

        /**
         * Get the next right node which is either last child or thread.
         *
         * @return {Node | undefined} Next right node child or thread.
         */
        public nextRight(this: Node): Node | undefined {
            return this.getRightMostChild() || this.thread;
        }

        /**
         * Return the left one of the greatest uncommon ancestors of a
         * leftInternal node and it's right neighbor.
         *
         * @param leftIntNode {Node} leftInternalNode
         * @param defaultAncestor {Node} defaultAncestor
         * @return {Node} Left one of the greatest uncommon ancestors of a
         * leftInternal node and it's right neighbor.
         *
         */
        public getAncestor(
            this: Node,
            leftIntNode: Node,
            defaultAncestor: Node
        ): Node {
            let leftAnc = leftIntNode.ancestor;
            if (leftAnc.children[0] === this.children[0]) {
                return leftIntNode.ancestor;
            }
            return defaultAncestor;
        }
        /**
         * Get node's first sibling, which is not hidden.
         *
         * @return {Node | undefined} First sibling of the node which is
         * not hidden or undefined, if it does not exists
         *
         */
        public getLeftMostSibling(this: Node): Node | undefined {
            let parent = this.getParent();
            if (parent) {
                const children = parent.children;
                for (let i = 0; i < children.length; i++) {
                    if (children[i] && children[i].point.visible) {
                        return children[i];
                    }
                }
            }
        }
        /**
         * Check if the node is a leaf (if it has any children).
         *
         * @return {boolean} If the node has no visible children return true.
         */

        public hasChildren(): boolean | undefined {
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i].point.visible) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Get node's left sibling (if it exists).
         *
         * @return {Node | undefined} left sibling of the node
         */
        public getLeftSibling(this: Node): Node | undefined {
            let parent = this.getParent();
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
         * @return {Node | undefined} node's first child which isn't
         * hidden
         */
        public getLeftMostChild(this: Node): Node | undefined {
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
         * @return {Node | undefined} node's last child which isn't hidden
         *
         */
        public getRightMostChild(this: Node): Node | undefined {
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
         * @return {Node | undefined} Node's parent or undefined for root.
         */
        public getParent(this: Node): Node | undefined {
            return this.parentNode;
        }


        /**
         * Get node's first child which is not hidden.
         *
         * @return {Node | undefined} First child.
         */
        public getFirstChild(this: Node): Node | undefined {
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i].point.visible) {
                    return this.children[i];
                }
            }
        }
    }
}
export default TreegraphNode;
