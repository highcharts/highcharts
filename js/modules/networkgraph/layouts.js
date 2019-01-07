/**
 * Networkgraph series
 *
 * (c) 2010-2019 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';

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

        this.setInitialRendering(true);
    }
};

H.extend(
    /**
    * Reingold-Fruchterman algorithm from
    * "Graph Drawing by Force-directed Placement" paper.
    */
    H.layouts['reingold-fruchterman'].prototype,
    {
        run: function () {
            var layout = this,
                series = this.series,
                options = this.options;

            if (layout.initialRendering) {
                layout.initPositions();

                // Render elements in initial positions:
                series.forEach(function (s) {
                    s.render();
                });
            }

            // Algorithm:
            function localLayout() {
                // Barycenter forces:
                layout.applyBarycenterForces();

                // Repulsive forces:
                layout.applyRepulsiveForces();

                // Attractive forces:
                layout.applyAttractiveForces();

                // Limit to the plotting area and cool down:
                layout.applyLimits(layout.temperature);

                // Cool down:
                layout.temperature -= layout.diffTemperature;
                layout.prevSystemTemperature = layout.systemTemperature;
                layout.systemTemperature = layout.getSystemTemperature();

                if (options.enableSimulation) {
                    series.forEach(function (s) {
                        s.render();
                    });
                    if (
                        layout.maxIterations-- &&
                        !layout.isStable()
                    ) {
                        layout.simulation = H.win.requestAnimationFrame(
                            localLayout
                        );
                    } else {
                        layout.simulation = false;
                    }
                }
            }

            layout.setK();
            layout.resetSimulation(options);

            if (options.enableSimulation) {
                // Animate it:
                layout.simulation = H.win.requestAnimationFrame(localLayout);
            } else {
                // Synchronous rendering:
                while (
                    layout.maxIterations-- &&
                    !layout.isStable()
                ) {
                    localLayout();
                }
                series.forEach(function (s) {
                    s.render();
                });
            }
        },
        stop: function () {
            if (this.simulation) {
                H.win.cancelAnimationFrame(this.simulation);
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
            nodes.forEach(function (node) {
                if (this.nodes.indexOf(node) === -1) {
                    this.nodes.push(node);
                }
            }, this);
        },
        removeNode: function (node) {
            var index = this.nodes.indexOf(node);

            if (index !== -1) {
                this.nodes.splice(index, 1);
            }
        },
        removeLink: function (link) {
            var index = this.links.indexOf(link);

            if (index !== -1) {
                this.links.splice(index, 1);
            }
        },
        addLinks: function (links) {
            links.forEach(function (link) {
                if (this.links.indexOf(link) === -1) {
                    this.links.push(link);
                }
            }, this);
        },
        addSeries: function (series) {
            if (this.series.indexOf(series) === -1) {
                this.series.push(series);
            }
        },
        clear: function () {
            this.nodes.length = 0;
            this.links.length = 0;
            this.series.length = 0;
            this.resetSimulation();
        },

        resetSimulation: function () {
            this.forcedStop = false;
            this.systemTemperature = 0;
            this.setMaxIterations();
            this.setTemperature();
            this.setDiffTemperature();
        },

        setMaxIterations: function (maxIterations) {
            this.maxIterations = pick(
                maxIterations,
                this.options.maxIterations
            );
        },

        setTemperature: function () {
            this.temperature = Math.sqrt(this.nodes.length);
        },

        setDiffTemperature: function () {
            this.diffTemperature = this.temperature /
                (this.options.maxIterations + 1);
        },
        setInitialRendering: function (enable) {
            this.initialRendering = enable;
        },
        initPositions: function () {
            var initialPositions = this.options.initialPositions;

            if (H.isFunction(initialPositions)) {
                initialPositions.call(this);
            } else if (initialPositions === 'circle') {
                this.setCircularPositions();
            } else {
                this.setRandomPositions();
            }
        },
        setCircularPositions: function () {
            var box = this.box,
                nodes = this.nodes,
                nodesLength = nodes.length + 1,
                angle = 2 * Math.PI / nodesLength,
                rootNodes = nodes.filter(function (node) {
                    return node.linksTo.length === 0;
                }),
                sortedNodes = [],
                visitedNodes = {};

            function addToNodes(node) {
                node.linksFrom.forEach(function (link) {
                    if (!visitedNodes[link.toNode.id]) {
                        visitedNodes[link.toNode.id] = true;
                        sortedNodes.push(link.toNode);
                        addToNodes(link.toNode);
                    }
                });
            }

            // Start with identified root nodes an sort the nodes by their
            // hierarchy. In trees, this ensures that branches don't cross
            // eachother.
            rootNodes.forEach(function (rootNode) {
                sortedNodes.push(rootNode);
                addToNodes(rootNode);
            });

            // Cyclic tree, no root node found
            if (!sortedNodes.length) {
                sortedNodes = nodes;

            // Dangling, cyclic trees
            } else {
                nodes.forEach(function (node) {
                    if (sortedNodes.indexOf(node) === -1) {
                        sortedNodes.push(node);
                    }
                });
            }

            // Initial positions are laid out along a small circle, appearing
            // as a cluster in the middle
            sortedNodes.forEach(function (node, index) {
                node.plotX = pick(
                    node.plotX,
                    box.width / 2 + Math.cos(index * angle)
                );
                node.plotY = pick(
                    node.plotY,
                    box.height / 2 + Math.sin(index * angle)
                );

                node.dispX = 0;
                node.dispY = 0;
            });
        },
        setRandomPositions: function () {
            var box = this.box,
                nodes = this.nodes,
                nodesLength = nodes.length + 1;

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
                if (link.fromNode && link.toNode) {
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
                }
            });
        },
        applyLimits: function (temperature) {
            var layout = this,
                options = layout.options,
                nodes = layout.nodes,
                box = layout.box,
                distanceR;

            nodes.forEach(function (node) {
                if (node.fixedPosition) {
                    return;
                }

                // Friction:
                node.dispX += options.friction * node.dispX;
                node.dispY += options.friction * node.dispY;

                distanceR = node.temperature = layout.vectorLength({
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
        isStable: function () {
            return Math.abs(
                this.systemTemperature -
                this.prevSystemTemperature
            ) === 0;
        },
        getSystemTemperature: function () {
            return this.nodes.reduce(function (value, node) {
                return value + node.temperature;
            }, 0);
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
