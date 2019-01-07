/**
 * Networkgraph series
 *
 * (c) 2010-2019 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';

var QuadTreeNode = H.QuadTreeNode = function (box) {
    this.box = box;
    this.nodes = []; // Array of 4 -> quad
    this.children = []; // Deferred leafs
    this.mass = 1;
    this.centerX = 0;
    this.centerY = 0;
};

H.extend(
    QuadTreeNode.prototype,
    {
        insert: function (node) {
            this.mass++;

            if (!this.centerX) {
                this.centerX = node.plotX;
                this.centerY = node.plotY;
            } else {
                this.centerX = (this.centerX + node.plotX) / 2;
                this.centerY = (this.centerY + node.plotY) / 2;
            }

            if (this.nodes.length) {
                this.nodes[this.getBoxPosition(node)].insert(node);
            } else {
                if (this.children.length < 3) {
                    this.children.push(node);
                } else {
                    this.divideBox();
                    this.children.forEach(function (child) {
                        this.insert(child);
                    }, this);
                    this.insert(node);
                }
            }
        },
        divideBox: function () {
            var halfWidth = this.box.width / 2,
                halfHeight = this.box.height / 2;

            this.nodes[0] = new QuadTreeNode({
                left: this.box.left,
                top: this.box.top,
                width: halfWidth,
                height: halfHeight
            });

            this.nodes[1] = new QuadTreeNode({
                left: this.box.left + halfWidth,
                top: this.box.top,
                width: halfWidth,
                height: halfHeight
            });

            this.nodes[2] = new QuadTreeNode({
                left: this.box.left + halfWidth,
                top: this.box.top + halfHeight,
                width: halfWidth,
                height: halfHeight
            });

            this.nodes[3] = new QuadTreeNode({
                left: this.box.left,
                top: this.box.top + halfHeight,
                width: halfWidth,
                height: halfHeight
            });
        },
        getBoxPosition: function (node) {
            var left = node.plotX < this.box.left + this.box.width / 2,
                top = node.plotY < this.box.top + this.box.height / 2,
                index;

            if (left) {
                if (top) {
                    // Top left
                    index = 0;
                } else {
                    // Bottom left
                    index = 3;
                }
            } else {
                if (top) {
                    // Top right
                    index = 1;
                } else {
                    // Bottom right
                    index = 2;
                }
            }

            return index;
        }
    }
);

var QuadTree = H.QuadTree = function (x, y, width, height) {
    // Boundary rectangle:
    this.rect = {
        left: x,
        top: y,
        width: width,
        height: height
    };

    this.root = new QuadTreeNode(this.rect);
};


H.extend(
    QuadTree.prototype,
    {
        insertNodes: function (nodes) {
            nodes.forEach(function (node) {
                this.root.insert(node);
            }, this);
        },
        clear: function (chart) {
            this.render(chart, true);
        },
        visitNodeRecursive: function (node, chart, clear) {
            node.nodes.forEach(
                function (qtNode) {
                    if (qtNode.children.length) {
                        this.renderBox(qtNode, chart, clear);
                        this.visitNodeRecursive(qtNode, chart, clear);
                    }
                },
                this
            );
        },
        render: function (chart, clear) {
            this.visitNodeRecursive(this.root, chart, clear);
        },
        renderBox: function (qtNode, chart, clear) {
            if (!qtNode.graphic) {
                qtNode.graphic = chart.renderer
                    .rect(
                        qtNode.box.left + chart.plotLeft,
                        qtNode.box.top + chart.plotTop,
                        qtNode.box.width,
                        qtNode.box.height
                    )
                    .attr({
                        stroke: 'red',
                        'stroke-width': 2
                    })
                    .add();
            } else if (clear) {
                qtNode.graphic = qtNode.graphic.destroy();
            }

            if (qtNode.graphic) {
                qtNode.graphic.animate({
                    x: qtNode.box.left + chart.plotLeft,
                    y: qtNode.box.top + chart.plotTop,
                    width: qtNode.box.width,
                    height: qtNode.box.height
                });
            }
        }
    }
);
