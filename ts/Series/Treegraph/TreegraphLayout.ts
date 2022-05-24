/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type TreegraphSeries from './TreegraphSeries';
import TreegraphNode from './TreegraphNode.js';

class TreegraphLayout {
    /**
     * Create dummy node, which allows to manually set the level of the node.
     *
     * @param {TreegraphNode.Node} parent Parent node, to which the dummyNode should be connected.
     * @param {TreegraphNode.Node} child Child node, which should be connected to dummyNode.
     * @param {number} gapSize Remainig gap size
     * @param {number} index the index of the link
     *
     * @return {TreegraphNode.Node} DummyNode as a parent of nodes, which column
     * changes
     */
    public static createDummyNode(
        parent: TreegraphNode.Node,
        child: TreegraphNode.Node,
        gapSize: number,
        index: number
    ): TreegraphNode.Node {
        // Initialise dummy node.
        let dummyNode = new TreegraphNode.Node();
        dummyNode.id = parent.id + '-' + gapSize;
        dummyNode.ancestor = parent;
        // Add connection from new node to the previous points.

        // First connection to itself.
        dummyNode.children.push(child);
        dummyNode.parent = parent.id;
        dummyNode.parentNode = parent;
        dummyNode.point = parent.point;
        dummyNode.level = child.level - gapSize;
        dummyNode.relativeXPosition = child.relativeXPosition;
        dummyNode.visible = true;
        // Then connection from parent to dummyNode.
        parent.children[child.relativeXPosition] = dummyNode;
        child.oldParentNode = parent;
        child.relativeXPosition = 0;

        // Then connection from child to dummyNode.
        child.parentNode = dummyNode;
        child.parent = dummyNode.id;

        return dummyNode;
    }
    /**
     * Walker algorythm of positioning the nodes in the treegraph improved by
     * Buchheim to run in the linear time. Basic algorithm consists of post
     * order traversal, which starts from going bottom up (first walk), and then
     * pre order traversal top to bottom (second walk) where adding all of the
     * modifiers is performed.
     * link to the paper: http://dirk.jivas.de/papers/buchheim02improving.pdf
     *
     * @param {TreegraphSeries} series the Treegraph series
     */
    public calculatePositions(series: TreegraphSeries): void {
        const treeLayout = this;
        const nodes = series.nodeList as TreegraphNode.Node[];
        this.resetValues(nodes);
        const root = series.tree;
        if (root) {
            treeLayout.calculateRelativeX(root, 0);
            treeLayout.beforeLayout(nodes);
            treeLayout.firstWalk(root);
            treeLayout.secondWalk(root, -root.preX);
            treeLayout.afterLayout(nodes);
        }
    }
    /**
     * Create dummyNodes as parents for nodes, which column is changed.
     *
     * @param nodes all of the nodes.
     */
    public beforeLayout(nodes: TreegraphNode.Node[]): void {
        nodes.forEach((node): void => {
            node.children.forEach((child, index): void => {
                // Support for children placed in distant columns.
                if (child && child.level - node.level > 1) {
                    // For further columns treat the nodes as a
                    // single parent-child pairs till the column is achieved.
                    let gapSize = child.level - node.level - 1,
                        parent = node;
                    // parent -> dummyNode -> child
                    while (gapSize > 0) {
                        child = TreegraphLayout.createDummyNode(
                            parent,
                            child,
                            gapSize,
                            index
                        );
                        gapSize--;
                    }
                }
            });
        });
    }
    /**
     * Reset the caluclated values from the previous run.
     * @param {TreegraphNode.Node[]} nodes all of the nodes.
     */
    public resetValues(nodes: TreegraphNode.Node[]): void {
        nodes.forEach((node: TreegraphNode.Node): void => {
            node.mod = 0;
            node.ancestor = node;
            node.shift = 0;
            node.thread = void 0 as any;
            node.change = 0;
            node.preX = 0;
        });
    }
    /**
     * Assigns the value to each node, which indicates, what is his sibling
     * number.
     *
     * @param node root node
     * @param index index to which the nodes position should be set
     */
    public calculateRelativeX(node: TreegraphNode.Node, index: number): void {
        const treeLayout = this;
        node.children.forEach((child, index): void => {
            treeLayout.calculateRelativeX(child, index);
        });
        node.relativeXPosition = index;
    }
    /**
     * Recursive post order traversal of the tree, where the initial position
     * of the nodes is calculated.
     *
     * @param {TreegraphNode.Node} node the node for which the position should be
     * calculated
     */
    public firstWalk(node: TreegraphNode.Node): void {
        const treeLayout = this;
        let leftSibling;
        // Arbitrary value used to position nodes in respect to each other.
        let siblingDistance = 1;
        // If the node is a leaf, set it's position based on the left siblings.
        if (!node.hasChildren()) {
            leftSibling = node.getLeftSibling();
            if (leftSibling) {
                node.preX = leftSibling.preX + siblingDistance;
                node.mod = node.preX;
            } else {
                node.preX = 0;
            }
        } else {
            // If the node has children, perform the recursive first walk for
            // its children, and then calculate its shift in the apportion
            // function (most crucial part part of the algorythm).
            let defaultAncestor = node.getLeftMostChild() as TreegraphNode.Node;

            node.children.forEach(function (child): void {
                treeLayout.firstWalk(child);
                defaultAncestor = treeLayout.apportion(child, defaultAncestor);
            });
            treeLayout.executeShifts(node);

            let leftChild = node.getLeftMostChild() as TreegraphNode.Node;
            let rightChild = node.getRightMostChild() as TreegraphNode.Node;
            // Set the position of the parent as a middle point of its children
            // and move it by the value of the leftSibling (if it exists).
            let midPoint = (leftChild.preX + rightChild.preX) / 2;
            leftSibling = node.getLeftSibling();

            if (leftSibling) {
                node.preX = leftSibling.preX + siblingDistance;
                node.mod = node.preX - midPoint;
            } else {
                node.preX = midPoint;
            }
        }
    }
    /**
     * Pre order traversal of the tree, which sets the final xPosition of the
     * node as its preX value and sum of all if it's parents' modifiers.
     *
     * @param {TreegraphNode.Node} node the node, for which the final position
     * should be calculated.
     * @param {number} modSum The sum of modifiers of all of the parents.
     */
    public secondWalk(node: TreegraphNode.Node, modSum: number): void {
        const treeLayout = this;
        // When the chart is not inverted we want the tree to be positioned from
        // left to right with root node close to the chart border, this is why
        // x and y positions are switched.
        node.yPosition = node.preX + modSum;
        node.xPosition = node.level;
        node.children.forEach(function (child): void {
            treeLayout.secondWalk(child, modSum + node.mod);
        });
    }
    /**
     *  Shift all children of the current node from right to left.
     *
     * @param {TreegraphNode.Node} node the parent node.
     */
    public executeShifts(node: TreegraphNode.Node): void {
        let shift = 0,
            change = 0;
        for (let i = node.children.length - 1; i >= 0; i--) {
            const childNode = node.children[i];
            childNode.preX += shift;
            childNode.mod += shift;
            change += childNode.change;
            shift += childNode.shift + change;
        }
    }
    /**
     * The core of the algorithm. The new subtree is combined with the previous
     * subtrees. Threads are used to traverse the inside and outside contours of
     * the left and right subtree up to the highest common level. The vertecies
     * are left(right)Int(Out)node where Int means internal and Out means
     * outernal. For summing up the modifiers along the contour we use the
     * `left(right)Int(Out)mod` variable. Whenever two nodes of the inside
     * contours are in conflict we comute the left one of the greatest uncommon
     * ancestors using the getAncestor function and we call the moveSubtree
     * method to shift the subtree and prepare the shifts of smaller subrtees.
     * Finally we add a new thread (if necessary) and we adjust ancestor of
     * right outernal node or defaultAncestor.
     *
     * @param {TreegraphNode.Node} node
     * @param defaultAncestor the default ancestor of the passed node.
     */
    public apportion(
        node: TreegraphNode.Node,
        defaultAncestor: TreegraphNode.Node
    ): TreegraphNode.Node {
        const treeLayout = this;
        let leftSibling = node.getLeftSibling();
        if (leftSibling) {
            let rightIntNode = node,
                rightOutNode = node,
                leftIntNode = leftSibling,
                leftOutNode =
                    rightIntNode.getLeftMostSibling() as TreegraphNode.Node,
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
                leftIntNode = leftIntNode.nextRight() as TreegraphNode.Node;
                leftOutNode = leftOutNode.nextLeft() as TreegraphNode.Node;
                rightIntNode = rightIntNode.nextLeft() as TreegraphNode.Node;
                rightOutNode = rightOutNode.nextRight() as TreegraphNode.Node;

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
    }

    /**
     * Shifts the subtree from leftNode to rightNode.
     *
     * @param {TreegraphNode.Node} leftNode
     * @param {TreegraphNode.Node} rightNode
     * @param {number} shift The value, by which the subtree should be moved.
     */
    public moveSubtree(
        leftNode: TreegraphNode.Node,
        rightNode: TreegraphNode.Node,
        shift: number
    ): void {
        let subtrees = rightNode.relativeXPosition - leftNode.relativeXPosition;
        rightNode.change -= shift / subtrees;
        rightNode.shift += shift;
        rightNode.preX += shift;
        rightNode.mod += shift;
        leftNode.change += shift / subtrees;
    }
    /**
     * Clear values created in a beforeLayout.
     * @param {TreegraphNode.Node[]} nodes all of the nodes of the Treegraph Series.
     */
    public afterLayout(nodes: TreegraphNode.Node[]): void {
        nodes.forEach((node): void => {
            if (node.oldParentNode) {
                // Restore default connections
                node.relativeXPosition = node.parentNode.relativeXPosition;
                node.parent = node.oldParentNode.parent;
                node.parentNode = node.oldParentNode;

                // Delete dummyNode
                delete node.oldParentNode.children[node.relativeXPosition];
                node.oldParentNode.children[node.relativeXPosition] = node;
                node.oldParentNode = void 0;
            }
        });
    }
}
export default TreegraphLayout;
