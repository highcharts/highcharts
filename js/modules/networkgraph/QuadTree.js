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
    this.boxSize = Math.min(box.width, box.height);
    this.nodes = []; // Array of 4 -> quad subtrees
    this.isInternal = false; // Internal or external node
    this.body = false; // External node has it's body which is just a point
    this.isEmpty = true;
};

H.extend(
    QuadTreeNode.prototype,
    {
        insert: function (point, depth) {
            if (this.isInternal) {
                // Internal node:
                this.nodes[this.getBoxPosition(point)].insert(point, depth - 1);
            } else {
                this.isEmpty = false;

                if (!this.body) {
                    // First body in a quadrant:
                    this.isInternal = false;
                    this.body = point;
                } else {
                    if (depth) {
                        // Every other body in a quadrant:
                        this.isInternal = true;
                        this.divideBox();
                        // Reinsert main body only once:
                        if (this.body !== true) {
                            this.nodes[this.getBoxPosition(this.body)]
                                .insert(this.body, depth - 1);
                            this.body = true;
                        }
                        // Add second body:
                        this.nodes[this.getBoxPosition(point)]
                            .insert(point, depth - 1);
                    } else {
                        this.nodes.push(point);
                    }

                }
            }
        },
        updateMassAndCenter: function () {
            var mass = 0,
                plotX = 0,
                plotY = 0;

            if (this.isInternal) {
                // Calcualte weightened mass of the quad node:
                this.nodes.forEach(function (pointMass) {
                    if (!pointMass.isEmpty) {
                        mass += pointMass.mass;
                        plotX += pointMass.plotX * pointMass.mass;
                        plotY += pointMass.plotY * pointMass.mass;
                    }
                });
                plotX /= mass;
                plotY /= mass;
            } else if (this.body) {
                // Just one node, use coordinates directly:
                mass = this.body.mass;
                plotX = this.body.plotX;
                plotY = this.body.plotY;
            }

            // Store details:
            this.mass = mass;
            this.plotX = plotX;
            this.plotY = plotY;
        },
        divideBox: function () {
            var halfWidth = this.box.width / 2,
                halfHeight = this.box.height / 2;

            // Top left
            this.nodes[0] = new QuadTreeNode({
                left: this.box.left,
                top: this.box.top,
                width: halfWidth,
                height: halfHeight
            });

            // Top right
            this.nodes[1] = new QuadTreeNode({
                left: this.box.left + halfWidth,
                top: this.box.top,
                width: halfWidth,
                height: halfHeight
            });

            // Bottom right
            this.nodes[2] = new QuadTreeNode({
                left: this.box.left + halfWidth,
                top: this.box.top + halfHeight,
                width: halfWidth,
                height: halfHeight
            });

            // Bottom left
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
    this.box = {
        left: x,
        top: y,
        width: width,
        height: height
    };

    this.maxDepth = 25;

    this.root = new QuadTreeNode(this.box, '0');

    this.root.isInternal = true;
    this.root.isRoot = true;
    this.root.divideBox();
};


H.extend(
    QuadTree.prototype,
    {
        insertNodes: function (nodes) {
            nodes.forEach(function (node) {
                this.root.insert(node, this.maxDepth);
            }, this);
        },
        clear: function (chart) {
            this.render(chart, true);
        },
        visitNodeRecursive: function (
            node,
            beforeCallback,
            afterCallback,
            chart,
            clear
        ) {
            var goFurther;

            if (!node) {
                node = this.root;
            }

            if (node === this.root && beforeCallback) {
                goFurther = beforeCallback(node);
            }

            if (goFurther === false) {
                return;
            }

            node.nodes.forEach(
                function (qtNode) {
                    if (chart) {
                        // this.renderBox(qtNode, chart, clear);
                    }
                    if (qtNode.isInternal) {
                        if (beforeCallback) {
                            goFurther = beforeCallback(qtNode);
                        }
                        if (goFurther === false) {
                            return;
                        }
                        this.visitNodeRecursive(
                            qtNode,
                            beforeCallback,
                            afterCallback,
                            chart,
                            clear
                        );
                    } else if (qtNode.body) {
                        if (beforeCallback) {
                            beforeCallback(qtNode.body);
                        }
                    }
                    if (afterCallback) {
                        afterCallback(qtNode);
                    }
                },
                this
            );
            if (node === this.root && afterCallback) {
                afterCallback(node);
            }
        },
        calculateMassAndCenter: function () {
            this.visitNodeRecursive(null, null, function (node) {
                node.updateMassAndCenter();
            });
        },
        render: function (chart, clear) {
            this.visitNodeRecursive(this.root, null, null, chart, clear);
        },
        renderBox: function (qtNode, chart, clear) {
            if (!qtNode.graphic && !clear) {
                qtNode.graphic = chart.renderer
                    .rect(
                        qtNode.box.left + chart.plotLeft,
                        qtNode.box.top + chart.plotTop,
                        qtNode.box.width,
                        qtNode.box.height
                    )
                    .attr({
                        stroke: 'rgba(100, 100, 100, 0.5)',
                        'stroke-width': 2
                    })
                    .add();

                if (!isNaN(qtNode.plotX)) {
                    qtNode.graphic2 = chart.renderer
                        .circle(
                            qtNode.plotX,
                            qtNode.plotY,
                            qtNode.mass / 10
                        )
                        .attr({
                            fill: 'red',
                            translateY: chart.plotTop,
                            translateX: chart.plotLeft
                        })
                        .add();
                }
            } else if (clear) {
                if (qtNode.graphic) {
                    qtNode.graphic = qtNode.graphic.destroy();
                }
                if (qtNode.graphic2) {
                    qtNode.graphic2 = qtNode.graphic2.destroy();
                }
                if (qtNode.label) {
                    qtNode.label = qtNode.label.destroy();
                }
            }
        }
    }
);
