/**
 * Networkgraph series
 *
 * (c) 2010-2019 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';
import 'integrations.js';

var pick = H.pick,
    defined = H.defined;

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

        this.integration = H.networkgraphIntegrations[options.integration];
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
                options = this.options,
                step = 0;

            if (layout.initialRendering) {
                layout.initPositions();

                // Render elements in initial positions:
                series.forEach(function (s) {
                    s.render();
                });
            }

            // Algorithm:
            function localLayout() {
                step++;

                // Barycenter forces:
                layout.applyBarycenterForces(layout.temperature);

                // Repulsive forces:
                layout.applyRepulsiveForces(layout.temperature);

                // Attractive forces:
                layout.applyAttractiveForces(layout.temperature);

                // Limit to the plotting area and cool down:
                layout.applyLimits(layout.temperature);

                // Cool down the system:
                layout.temperature = layout.coolDown(
                    layout.startTemperature,
                    layout.diffTemperature,
                    step
                );

                layout.prevSystemTemperature = layout.systemTemperature;
                layout.systemTemperature = layout.getSystemTemperature();

                if (options.enableSimulation) {
                    series.forEach(function (s) {
                        s.render();
                    });
                    if (
                        layout.maxIterations-- &&
                        isFinite(layout.temperature) &&
                        !layout.isStable()
                    ) {
                        if (layout.simulation) {
                            H.win.cancelAnimationFrame(layout.simulation);
                        }

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
                if (layout.simulation) {
                    H.win.cancelAnimationFrame(layout.simulation);
                }
                layout.simulation = H.win.requestAnimationFrame(localLayout);
            } else {
                // Synchronous rendering:
                while (
                    layout.maxIterations-- &&
                    isFinite(layout.temperature) &&
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
            this.temperature = this.startTemperature =
                Math.sqrt(this.nodes.length);
        },

        setDiffTemperature: function () {
            this.diffTemperature = this.startTemperature /
                (this.options.maxIterations + 1);
        },
        setInitialRendering: function (enable) {
            this.initialRendering = enable;
        },
        initPositions: function () {
            var initialPositions = this.options.initialPositions;

            if (H.isFunction(initialPositions)) {
                initialPositions.call(this);

                this.nodes.forEach(function (node) {
                    if (!defined(node.prevX)) {
                        node.prevX = node.plotX;
                    }
                    if (!defined(node.prevY)) {
                        node.prevY = node.plotY;
                    }
                });

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
                node.plotX = node.prevX = pick(
                    node.plotX,
                    box.width / 2 + Math.cos(index * angle)
                );
                node.plotY = node.prevY = pick(
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
                    node.plotX = node.prevX = pick(
                        node.plotX,
                        box.width * unrandom(index)
                    );
                    node.plotY = node.prevY = pick(
                        node.plotY,
                        box.height * unrandom(nodesLength + index)
                    );

                    node.dispX = 0;
                    node.dispY = 0;
                }
            );
        },
        force: function (name) {
            this.integration[name].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );
        },
        applyBarycenterForces: function () {
            this.getBarycenter();
            this.force('barycenter');
        },
        getBarycenter: function () {
            var nodesLength = this.nodes.length,
                cx = 0,
                cy = 0;

            this.nodes.forEach(function (node) {
                cx += node.plotX;
                cy += node.plotY;
            });

            this.barycenter = {
                x: cx,
                y: cy,
                xFactor: cx / nodesLength,
                yFactor: cy / nodesLength
            };

            return this.barycenter;
        },
        applyRepulsiveForces: function () {
            var layout = this,
                nodes = layout.nodes,
                options = layout.options,
                force,
                distanceR,
                distanceXY;

            nodes.forEach(function (node) {
                nodes.forEach(function (repNode) {
                    if (
                        // Node can not repulse itself:
                        node !== repNode &&
                        // Not dragged:
                        !node.fixedPosition
                    ) {

                        distanceXY = layout.getDistXY(node, repNode);
                        distanceR = layout.vectorLength(distanceXY);

                        if (distanceR !== 0) {
                            force = options.repulsiveForce.call(
                                layout, distanceR, layout.k
                            );

                            layout.force(
                                'repulsive',
                                node,
                                force,
                                distanceXY,
                                distanceR
                            );

                        }
                    }
                });
            });
        },
        applyAttractiveForces: function () {
            var layout = this,
                links = layout.links,
                options = this.options;

            links.forEach(function (link) {
                if (link.fromNode && link.toNode) {
                    var distanceXY = layout.getDistXY(
                            link.fromNode,
                            link.toNode
                        ),
                        distanceR = layout.vectorLength(distanceXY),
                        force = options.attractiveForce.call(
                            layout, distanceR, layout.k
                        );

                    if (distanceR !== 0) {
                        layout.force(
                            'attractive',
                            link,
                            force,
                            distanceXY,
                            distanceR
                        );
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
                if (options.integration === 'euler') {
                    node.dispX += node.dispX * options.friction;
                    node.dispY += node.dispY * options.friction;

                    distanceR = node.temperature = layout.vectorLength({
                        x: node.dispX,
                        y: node.dispY
                    });
                } else {
                    distanceR = 1;
                }

                // Place nodes:
                if (distanceR !== 0) {
                    if (options.integration === 'verlet') {
                        /*
                        Verlet without velocity:

                            x(n+1) = 2 * x(n) - x(n-1) + A(T) * deltaT ^ 2

                        where:
                            - x(n+1) - new position
                            - x(n) - current position
                            - x(n-1) - previous position

                        Assuming A(t) = 0 (no acceleration) and (deltaT = 1) we
                        get:

                            x(n+1) = x(n) + (x(n) - x(n-1))

                        where:
                            - (x(n) - x(n-1)) - position change

                        TO DO:
                        Consider Verlet with velocity to support additional
                        forces. Or even Time-Corrected Verlet by Jonathan
                        "lonesock" Dummer
                        */
                        var prevX = node.prevX,
                            prevY = node.prevY,
                            diffX = (node.plotX - prevX),
                            diffY = (node.plotY - prevY);

                        // Store for the next iteration:
                        node.prevX = node.plotX;
                        node.prevY = node.plotY;

                        // Update positions, apply friction:
                        node.plotX += diffX * -options.friction;
                        node.plotY += diffY * -options.friction;

                        node.temperature = layout.vectorLength({
                            x: diffX,
                            y: diffY
                        });

                    } else {
                        /*
                        Euler:
                        Basic form: x(n+1) = x(n) + v(n)

                        With Rengoild-Fruchterman we get:

                            x(n+1) = x(n) +
                                v(n) / length(v(n)) *
                                min(v(n), temperature(n))

                        where:
                            x(n+1) - next position
                            x(n) - current position
                            v(n) - velocity (comes from net force)
                            temperature(n) - current temperature

                        Issues:
                            Oscillations when force vector has the same
                            magnitude but opposite direction in the next step.

                        Actually "min(v(n), temperature(n))" replaces
                        simulated annealing.
                        */
                        node.plotX += node.dispX / distanceR *
                            Math.min(Math.abs(node.dispX), temperature);
                        node.plotY += node.dispY / distanceR *
                            Math.min(Math.abs(node.dispY), temperature);

                    }
                }
                layout.applyLimitBox(node, box);

                // Reset displacement:
                node.dispX = 0;
                node.dispY = 0;
            });
        },
        /**
         * External box that nodes should fall. When hitting an edge, node
         * should stop or bounce.
         */
        applyLimitBox: function (node, box) {
            /*
            TO DO: Consider elastic collision instead of stopping.
            o' means end position when hitting plotting area edge:

            - "inelastic":
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

            Euler sample:
            if (plotX < 0) {
                plotX = 0;
                dispX *= -1;
            }

            if (plotX > box.width) {
                plotX = box.width;
                dispX *= -1;
            }

            */
            // Limit X-coordinates:
            node.plotX = Math.max(
                Math.min(
                    node.plotX,
                    box.width
                ),
                box.left
            );

            // Limit Y-coordinates:
            node.plotY = Math.max(
                Math.min(
                    node.plotY,
                    box.height
                ),
                box.top
            );
        },
        /**
         * From "A comparison of simulated annealing cooling strategies" by
         * Nourani and Andresen work.
         */
        coolDown: function (temperature, temperatureStep, step) {
            // Logarithmic:
            /*
            return Math.sqrt(this.nodes.length) -
                Math.log(
                    step * layout.diffTemperature
                );
            */

            // Exponential:
            /*
            var alpha = 0.1;
            layout.temperature = Math.sqrt(layout.nodes.length) *
                Math.pow(alpha, layout.diffTemperature);
            */
            // Linear:
            return temperature - temperatureStep * step;
        },
        isStable: function () {
            return Math.abs(
                this.systemTemperature -
                this.prevSystemTemperature
            ) === 0 || this.temperature <= 0;
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

            return this.vectorLength(distance);
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
