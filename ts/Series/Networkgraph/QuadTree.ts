/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2021 Paweł Fus
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

import type Point from '../../Core/Series/Point';

import QuadTreeNode from './QuadTreeNode.js';

/* *
 *
 *  Class
 *
 * */

/**
 * The QuadTree class. Used in Networkgraph chart as a base for Barnes-Hut
 * approximation.
 *
 * @private
 * @class
 * @name Highcharts.QuadTree
 *
 * @param {number} x
 *        Left position of the plotting area
 * @param {number} y
 *        Top position of the plotting area
 * @param {number} width
 *        Width of the plotting area
 * @param {number} height
 *        Height of the plotting area
 */
class QuadTree {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        // Boundary rectangle:
        this.box = {
            left: x,
            top: y,
            width: width,
            height: height
        };

        this.maxDepth = 25;

        this.root = new QuadTreeNode(this.box);

        this.root.isInternal = true;
        this.root.isRoot = true;
        this.root.divideBox();
    }

    /* *
     *
     *  Properties
     *
     * */

    public box: Record<string, number>;

    public maxDepth: number;

    public root: QuadTreeNode;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Calculate mass of the each QuadNode in the tree.
     */
    public calculateMassAndCenter(): void {
        this.visitNodeRecursive(
            null,
            null,
            function (node: QuadTreeNode): void {
                node.updateMassAndCenter();
            }
        );
    }

    /**
     * Insert nodes into the QuadTree
     *
     * @param {Array<Highcharts.Point>} points
     *        Points as nodes
     */
    public insertNodes(
        points: Array<Point>
    ): void {
        for (const point of points) {
            this.root.insert(point, this.maxDepth);
        }
    }

    /**
     * Depfth first treversal (DFS). Using `before` and `after` callbacks,
     * we can get two results: preorder and postorder traversals, reminder:
     *
     * ```
     *     (a)
     *     / \
     *   (b) (c)
     *   / \
     * (d) (e)
     * ```
     *
     * DFS (preorder): `a -> b -> d -> e -> c`
     *
     * DFS (postorder): `d -> e -> b -> c -> a`
     *
     * @param {Highcharts.QuadTreeNode|null} node
     *        QuadTree node
     * @param {Function} [beforeCallback]
     *        Function to be called before visiting children nodes.
     * @param {Function} [afterCallback]
     *        Function to be called after visiting children nodes.
     */
    public visitNodeRecursive(
        node: (QuadTreeNode|null),
        beforeCallback?: (Function|null),
        afterCallback?: (Function|null)
    ): void {
        let goFurther: (boolean|undefined);

        if (!node) {
            node = this.root;
        }

        if (node === this.root && beforeCallback) {
            goFurther = beforeCallback(node);
        }

        if (goFurther === false) {
            return;
        }

        for (const qtNode of node.nodes) {
            if (qtNode.isInternal) {
                if (beforeCallback) {
                    goFurther = beforeCallback(qtNode);
                }
                if (goFurther === false) {
                    continue;
                }
                this.visitNodeRecursive(
                    qtNode,
                    beforeCallback,
                    afterCallback
                );
            } else if (qtNode.body) {
                if (beforeCallback) {
                    beforeCallback(qtNode.body);
                }
            }
            if (afterCallback) {
                afterCallback(qtNode);
            }
        }

        if (node === this.root && afterCallback) {
            afterCallback(node);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default QuadTree;
