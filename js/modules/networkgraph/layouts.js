/**
 * Networkgraph series
 *
 * (c) 2010-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';
import '/QuadTree.js';

var pick = H.pick;

H.layouts = {
    'reingold-fruchterman': function (options) {
        this.options = options;
        this.nodes = [];
        this.links = [];
        this.series = [];

        this.box = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    }
};

H.extend(
    /**
    * Reingold-Fruchterman algorithm from
    * "Graph Drawing by Force-directed Placement" paper.
    */
    H.layouts['reingold-fruchterman'].prototype,
    {
        createQuadTree: function () {
            var quadTree = new H.QuadTree(
                this.box.left,
                this.box.top,
                this.box.width,
                this.box.height
            );

            quadTree.insertNodes(this.nodes);

            return quadTree;
        },
        run: function () {
            var layout = this,
                box = this.box,
                nodes = this.nodes,
                series = this.series,
                options = this.options,
                nodesLength = nodes.length + 1,
                // Fake object which will imitate animations
                mockAnimator = {
                    style: {}
                },
                simulation;

            // Return a repeatable, quasi-random number based on an integer
            // input. For the initial positions
            function unrandom(n) {
                var rand = n * n / Math.PI;
                rand = rand - Math.floor(rand);
                return rand;
            }

            // Initial positions:
            nodes.forEach(
                function (node, index) {
                    node.plotX = pick(
                        node.plotX,
                        box.width * unrandom(index)
                    );
                    node.plotY = pick(
                        node.plotY,
                        box.height * unrandom(nodesLength + index)
                    );

                    node.dispX = 0;
                    node.dispY = 0;
                }
            );

            layout.quadTree = layout.createQuadTree();
            layout.quadTree.render(series[0].chart);

            // Render elements in initial positions:
            series.forEach(function (s) {
                s.render();
            });

            // Algorithm:
            function localLayout() {
                if (simulation.stopped) {
                    return true;
                }
                layout.quadTree.clear(series[0].chart);
                layout.quadTree = layout.createQuadTree();
                layout.quadTree.render(series[0].chart);
                // Barycenter forces:
                layout.applyBarycenterForces();

                // Repulsive forces:
                layout.applyRepulsiveForces();

                // Attractive forces:
                layout.applyAttractiveForces();

                // Limit to the plotting area and cool down:
                layout.applyLimits(simulation.temperature);

                // Cool down:
                simulation.temperature -= simulation.diffTemperature;

                series.forEach(function (s) {
                    s.render();
                });

                if (
                    simulation.maxIterations--
                ) {
                    simulation.run(0, 1, 1);
                } else {
                    simulation.stopped = true;
                }
            }

            // Animate it:
            layout.simulation = simulation = new H.Fx(
                mockAnimator,
                {
                    duration: 13,
                    easing: function () {},
                    complete: localLayout,
                    curAnim: {}
                }
            );
            layout.setK();
            layout.resetSimulation(options);

            simulation.run(0, 1, 1);
        },
        stop: function () {
            if (this.simulation) {
                this.simulation.stopped = true;
            }
        },
        setArea: function (x, y, w, h) {
            this.box = {
                left: x,
                top: y,
                width: w,
                height: h
            };
        },
        setK: function () {
            // Optimal distance between nodes,
            // available space around the node:
            this.k = this.options.linkLength ||
                Math.pow(
                    this.box.width * this.box.height / this.nodes.length,
                    0.4
                );
        },
        addNodes: function (nodes) {
            this.nodes = this.nodes.concat(nodes);
        },
        addLinks: function (links) {
            this.links = this.links.concat(links);
        },
        addSeries: function (series) {
            this.series.push(series);
        },
        clear: function () {
            this.nodes.length = 0;
            this.links.length = 0;
            this.series.length = 0;
            this.resetSimulation();
        },

        resetSimulation: function () {
            this.setMaxIterations();
            this.setTemperature();
            this.setDiffTemperature();
        },

        setMaxIterations: function () {
            if (this.simulation) {
                this.simulation.maxIterations =
                    this.options.maxIterations;
            }
        },

        setTemperature: function () {
            if (this.simulation) {
                this.simulation.temperature = Math.sqrt(this.nodes.length);
            }
        },

        setDiffTemperature: function () {
            if (this.simulation) {
                this.simulation.diffTemperature = this.simulation.temperature /
                    (this.options.maxIterations + 1);
            }
        },
        applyBarycenterForces: function () {
            var nodesLength = this.nodes.length,
                gravitationalConstant = this.options.gravitationalConstant,
                cx = 0,
                cy = 0;

            // Calculate center:
            this.nodes.forEach(function (node) {
                cx += node.plotX;
                cy += node.plotY;
            });

            this.barycenter = {
                x: cx,
                y: cy
            };

            // Apply forces:
            this.nodes.forEach(function (node) {
                var degree = node.getDegree(),
                    phi = degree * (1 + degree / 2);

                node.dispX = (cx / nodesLength - node.plotX) *
                    gravitationalConstant * phi;
                node.dispY = (cy / nodesLength - node.plotY) *
                    gravitationalConstant * phi;
            });
        },
        applyRepulsiveForces: function () {
            var layout = this,
                nodes = layout.nodes,
                options = layout.options,
                k = this.k;

            nodes.forEach(function (node) {
                nodes.forEach(function (repNode) {
                    var force,
                        distanceR,
                        distanceXY;

                    if (
                        // Node can not repulse itself:
                        node !== repNode &&
                        // Only close nodes affect each other:
                        /* layout.getDistR(node, repNode) < 2 * k && */
                        // Not dragged:
                        !node.fixedPosition
                    ) {
                        distanceXY = layout.getDistXY(node, repNode);
                        distanceR = layout.vectorLength(distanceXY);

                        if (distanceR !== 0) {
                            force = options.repulsiveForce.call(
                                layout, distanceR, k
                            );

                            node.dispX += (distanceXY.x / distanceR) * force;
                            node.dispY += (distanceXY.y / distanceR) * force;
                        }
                    }
                });
            });
        },
        applyAttractiveForces: function () {
            var layout = this,
                links = layout.links,
                options = this.options,
                k = this.k;

            links.forEach(function (link) {
                var distanceXY = layout.getDistXY(
                        link.fromNode,
                        link.toNode
                    ),
                    distanceR = layout.vectorLength(distanceXY),
                    force = options.attractiveForce.call(
                        layout, distanceR, k
                    );

                if (distanceR !== 0) {
                    if (!link.fromNode.fixedPosition) {
                        link.fromNode.dispX -= (distanceXY.x / distanceR) *
                            force;
                        link.fromNode.dispY -= (distanceXY.y / distanceR) *
                            force;
                    }

                    if (!link.toNode.fixedPosition) {
                        link.toNode.dispX += (distanceXY.x / distanceR) *
                            force;
                        link.toNode.dispY += (distanceXY.y / distanceR) *
                            force;
                    }
                }
            });
        },
        applyLimits: function (temperature) {
            var layout = this,
                options = layout.options,
                nodes = layout.nodes,
                box = layout.box;

            nodes.forEach(function (node) {
                if (node.fixedPosition) {
                    return;
                }

                // Friction:
                node.dispX += options.friction * node.dispX;
                node.dispY += options.friction * node.dispY;

                var distanceR = layout.vectorLength({
                    x: node.dispX,
                    y: node.dispY
                });

                // Place nodes:
                if (distanceR !== 0) {
                    node.plotX += node.dispX / distanceR *
                        Math.min(Math.abs(node.dispX), temperature);
                    node.plotY += node.dispY / distanceR *
                        Math.min(Math.abs(node.dispY), temperature);
                }

                /*
                TO DO: Consider elastic collision instead of stopping.
                o' means end position when hitting plotting area edge:

                - "inealstic":
                o
                 \
                ______
                |  o'
                |   \
                |    \

                - "elastic"/"bounced":
                o
                 \
                ______
                |  ^
                | / \
                |o'  \

                */

                // Limit X-coordinates:
                node.plotX = Math.round(
                    Math.max(
                        Math.min(
                            node.plotX,
                            box.width
                        ),
                        box.left
                    )
                );

                // Limit Y-coordinates:
                node.plotY = Math.round(
                    Math.max(
                        Math.min(
                            node.plotY,
                            box.height
                        ),
                        box.top
                    )
                );

                // Reset displacement:
                node.dispX = 0;
                node.dispY = 0;
            });
        },
        vectorLength: function (vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        },
        getDistR: function (nodeA, nodeB) {
            var distance = this.getDistXY(nodeA, nodeB);

            return Math.sqrt(
                distance.x * distance.x +
                distance.y * distance.y
            );
        },
        getDistXY: function (nodeA, nodeB) {
            var xDist = nodeA.plotX - nodeB.plotX,
                yDist = nodeA.plotY - nodeB.plotY;

            return {
                x: xDist,
                y: yDist,
                absX: Math.abs(xDist),
                absY: Math.abs(yDist)
            };
        }
    }
);
