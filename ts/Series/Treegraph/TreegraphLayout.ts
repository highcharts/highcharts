/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import TreegraphSeries from './TreegraphSeries';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const { extend, merge } = U;
import TreegraphNode from './TreegraphNode.js';
declare global {
    namespace Highcharts {
        class TreegraphLayout {
            public constructor();
            public calculatePositions(series: TreegraphSeries): void;
            public initValues(nodes: TreegraphNode[]): void;
            public calculateRelativeX(root: TreegraphNode, index: number): void;
            public beforeLayout(nodes: TreegraphNode[]): void;
            public afterLayout(nodes: TreegraphNode[]): void;
            public firstWalk(node: TreegraphNode): void;
            public secondWalk(node: TreegraphNode, modSum: number): void;
            public executeShifts(node: TreegraphNode): void;
            public apportion(
                node: TreegraphNode,
                defaultAncestor: TreegraphNode
            ): TreegraphNode;
            public setArea(x: number, y: number, w: number, h: number): void;
            public moveSubtree(
                ancestor: TreegraphNode,
                node: TreegraphNode,
                shift: number
            ): void;
            public box: Record<string, number>;
        }
        let treeLayouts: Record<string, typeof TreegraphLayout>;
    }
}

H.treeLayouts = {
    Walker: function (): void {}
} as any;

extend(H.treeLayouts.Walker.prototype, {
    // Walker algorythm of positioning the nodes in the treegraph improved by
    // Buchheim to run in the linear time. Basic algorithm consists of post
    // order traversal, which starts from going bottom up (first walk), and then
    // pre order traversal top to bottom (second walk) where adding all of the
    // modifiers is performed.
    // link to the paper: http://dirk.jivas.de/papers/buchheim02improving.pdf
    calculatePositions: function (
        this: Highcharts.TreegraphLayout,
        series: TreegraphSeries
    ): void {
        const treeLayout = this;
        const nodes = series.nodes as TreegraphNode[];
        this.initValues(nodes);
        const root = nodes[0];
        if (root) {
            treeLayout.beforeLayout(nodes);
            treeLayout.calculateRelativeX(root, 0);
            treeLayout.firstWalk(root);
            treeLayout.secondWalk(root, -root.preX);
            treeLayout.afterLayout(nodes);
        }
    },
    // Clear values created in a preWalk.
    afterLayout: function (nodes: TreegraphNode[]): void {
        nodes.forEach((node): void => {
            node.linksFrom.forEach((link): void => {

                if (link.oldToNode) {
                    link.toNode = link.oldToNode;
                }

                // Then connection from child to dummyNode
                if (link.oldFromNode) {
                    link.fromNode = link.oldFromNode;
                }
            });
        });
    },
    //
    beforeLayout: function (
        this: Highcharts.TreegraphLayout,
        nodes: TreegraphNode[]
    ): void {
        const treeLayout = this as Highcharts.TreegraphLayout;
        nodes.forEach((node): void => {
            node.linksFrom.forEach((link, index): void => {
                // support for children placed in distant columns
                if (
                    link.toNode &&
                    (link.toNode.column - node.column > 1)
                ) {
                    // For further columns treat the nodes as a
                    // single parent-child pairs till the column is achieved
                    let gapSize = link.toNode.column - node.column - 1,
                        dummyNode,
                        parent = node,
                        child = link.toNode;
                    // parent -> dummyNode -> child
                    let createDummyNode = function (
                        parent: TreegraphNode,
                        child: TreegraphNode
                    ): TreegraphNode {
                        // initialise dummy node.
                        dummyNode = new TreegraphNode();
                        dummyNode.linksFrom = [];
                        dummyNode.linksTo = [];
                        dummyNode.shapeArgs = {};
                        dummyNode.id = link.toNode.id + '-' + gapSize;
                        dummyNode.mod = 0;
                        dummyNode.ancestor = parent;
                        dummyNode.shift = 0;
                        dummyNode.thread = void 0 as any;
                        dummyNode.change = 0;
                        dummyNode.preX = 0;

                        // add connection from new node to the previous points

                        // first connection to itself:
                        dummyNode.linksFrom.push(merge(parent.linksFrom[0]));
                        dummyNode.linksFrom[0].fromNode = dummyNode;
                        dummyNode.linksTo.push(merge(parent.linksFrom[0]));
                        dummyNode.linksTo[0].toNode = dummyNode;
                        dummyNode.linksTo[0].fromNode = parent;
                        dummyNode.linksFrom[0].toNode = child;
                        // temporary:
                        dummyNode.linksTo[0].to = void 0 as any;

                        dummyNode.column = child.column - gapSize;
                        dummyNode.level = child.level - gapSize;

                        // Then connection from parent to dummyNode
                        if (!parent.linksFrom[index].oldToNode) {
                            parent.linksFrom[index].oldToNode = child;
                        }
                        parent.linksFrom[index].toNode = dummyNode;

                        // Then connection from child to dummyNode
                        if (!child.linksTo[0].oldFromNode) {
                            child.linksTo[0].oldFromNode = parent;
                        }
                        child.linksTo[0].fromNode = dummyNode;
                        return dummyNode;
                    };
                    while (gapSize > 0) {
                        child = createDummyNode(parent, child);
                        gapSize--;
                    }
                }
            });
        });
    },
    // Init the values of the node. probably redundant, since this can be
    // performed in the init of the chart, but might be useful for repositioning
    // of the nodes on the update.
    initValues: function (nodes: TreegraphNode[]): void {
        nodes.forEach((node: TreegraphNode): void => {
            node.mod = 0;
            node.ancestor = node;
            node.shift = 0;
            node.thread = void 0 as any;
            node.change = 0;
            node.preX = 0;
        });
    },
    // Adds the value to each node, which indicates, what is his sibling number.
    calculateRelativeX: function (
        this: Highcharts.TreegraphLayout,
        node: TreegraphNode,
        index: number
    ): void {
        const treeLayout = this;
        node.linksFrom.forEach((link, index): void => {
            treeLayout.calculateRelativeX(link.toNode, index);
        });
        node.relativeXPosition = index;
    },
    // recursive post order traversal of the tree, where the initial position of
    // the node is calculated.
    firstWalk: function (
        this: Highcharts.TreegraphLayout,
        node: TreegraphNode
    ): void {
        const treeLayout = this;
        let leftSibling;
        // arbitrary value used to position nodes in respect to each other.
        let siblingDistance = 1;
        // if the node is a leaf, set it's position based on the left siblings.
        if (node.isLeaf()) {
            leftSibling = node.getLeftSibling();
            if (leftSibling) {
                node.preX = leftSibling.preX + siblingDistance;
                node.mod = node.preX;
            } else {
                node.preX = 0;
            }
        } else {
            // if the node has children, perform the recursive first walk for
            // its children, and then calculate its shift in the apportion
            // function (most crucial part part of the algorythm)
            let defaultAncestor = node.getLeftMostChild() as TreegraphNode;

            node.linksFrom.forEach(function (link): void {
                treeLayout.firstWalk(link.toNode);
                defaultAncestor = treeLayout.apportion(
                    link.toNode,
                    defaultAncestor
                );
            });
            treeLayout.executeShifts(node);

            let leftChild = node.getLeftMostChild() as TreegraphNode;
            let rightChild = node.getRightMostChild() as TreegraphNode;
            // set the position of the parent as a middle point of its children
            // and move it by the value of the leftSibling (if it exists)
            let midPoint = (leftChild.preX + rightChild.preX) / 2;
            leftSibling = node.getLeftSibling();

            if (leftSibling) {
                node.preX = leftSibling.preX + siblingDistance;
                node.mod = node.preX - midPoint;
            } else {
                node.preX = midPoint;
            }
        }
    },
    // set the final xPosition of the node as its preX value and sum of
    // all if it's parents' modifiers
    secondWalk: function (
        this: Highcharts.TreegraphLayout,
        node: TreegraphNode,
        modSum: number
    ): void {
        const treeLayout = this;
        // when the chart is not iverted we want the tree to be positioned from
        // left to right with root node close to the chart border, this is why
        // x and y positions are switched.
        node.yPosition = node.preX + modSum;
        node.xPosition = node.level;
        node.linksFrom.forEach(function (link): void {
            treeLayout.secondWalk(link.toNode, modSum + node.mod);
        });
    },
    // shift all children of the current node from right to left.
    executeShifts: function (
        this: Highcharts.TreegraphLayout,
        node: TreegraphNode
    ): void {
        let shift = 0,
            change = 0;
        for (let i = node.linksFrom.length - 1; i >= 0; i--) {
            let link = node.linksFrom[i];
            let childNode = link.toNode;
            childNode.preX += shift;
            childNode.mod += shift;
            change += childNode.change;
            shift += childNode.shift + change;
        }
    },
    apportion: function (
        this: Highcharts.TreegraphLayout,
        node: TreegraphNode,
        defaultAncestor: TreegraphNode
    ): TreegraphNode {
        const treeLayout = this;
        let leftSibling = node.getLeftSibling();
        if (leftSibling) {
            let rightIntNode = node,
                rightOutNode = node,
                leftIntNode = leftSibling,
                leftOutNode =
                    rightIntNode.getLeftMostSibling() as TreegraphNode,
                rightIntMod = rightIntNode.mod,
                rightOutMod = rightOutNode.mod,
                leftIntMod = leftIntNode.mod,
                leftOutMod = leftOutNode.mod;

            while (
                leftIntNode &&
                leftIntNode.nextRight() &&
                rightIntNode &&
                rightIntNode.nextLeft()
            ) {
                leftIntNode = leftOutNode =
                    leftIntNode.nextRight() as TreegraphNode;
                rightIntNode = rightOutNode =
                    rightOutNode.nextLeft() as TreegraphNode;

                rightOutNode.ancestor = node;
                let siblingDistance = 1;
                let shift =
                    leftIntNode.preX +
                    leftIntMod -
                    (rightIntNode.preX + rightIntMod) +
                    siblingDistance;

                if (shift > 0) {
                    treeLayout.moveSubtree(
                        node.getAncestor(leftIntNode, defaultAncestor),
                        node,
                        shift
                    );
                    rightIntMod += shift;
                    rightOutMod += shift;
                }

                leftIntMod += leftIntNode.mod;
                rightIntMod += rightIntNode.mod;
                leftOutMod += leftOutNode.mod;
                rightOutMod += rightOutNode.mod;
            }
            if (
                leftIntNode &&
                leftIntNode.nextRight() &&
                !rightOutNode.nextRight()
            ) {
                rightOutNode.thread = leftIntNode.nextRight();
                rightOutNode.mod += leftIntMod - rightOutMod;
            }
            if (
                rightIntNode &&
                rightIntNode.nextLeft() &&
                !leftOutNode.nextLeft()
            ) {
                leftOutNode.thread = rightIntNode.nextLeft();
                leftOutNode.mod += rightIntMod - leftOutMod;
            }
            defaultAncestor = node;
        }
        return defaultAncestor;
    },

    // Shifts the subtree from leftNode to rightNode.
    moveSubtree: function (
        leftNode: TreegraphNode,
        rightNode: TreegraphNode,
        shift: number
    ): void {
        let subtrees = rightNode.relativeXPosition - leftNode.relativeXPosition;
        rightNode.change -= shift / subtrees;
        rightNode.shift += shift;
        rightNode.preX += shift;
        rightNode.mod += shift;
        leftNode.change += shift / subtrees;
    },
    setArea: function (
        this: Highcharts.TreegraphLayout,
        x: number,
        y: number,
        w: number,
        h: number
    ): void {
        this.box = {
            left: x,
            top: y,
            width: w,
            height: h
        };
    }
});
