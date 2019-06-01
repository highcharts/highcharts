/* *
 * Networkgraph series
 *
 * (c) 2010-2019 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';
import 'integrations.js';
import 'QuadTree.js';

var pick = H.pick,
    defined = H.defined,
    addEvent = H.addEvent,
    Chart = H.Chart;

H.layouts = {
    'reingold-fruchterman': function () {
    }
};

H.extend(
    /**
     * Reingold-Fruchterman algorithm from
     * "Graph Drawing by Force-directed Placement" paper.
     * @private
     */
    H.layouts['reingold-fruchterman'].prototype,
    {
        init: function (options) {
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

            this.attractiveForce = pick(
                options.attractiveForce,
                this.integration.attractiveForceFunction
            );

            this.repulsiveForce = pick(
                options.repulsiveForce,
                this.integration.repulsiveForceFunction
            );

            this.approximation = options.approximation;
        },
        start: function () {
            var layout = this,
                series = this.series,
                options = this.options;


            layout.currentStep = 0;
            layout.forces = series[0] && series[0].forces || [];

            if (layout.initialRendering) {
                layout.initPositions();

                // Render elements in initial positions:
                series.forEach(function (s) {
                    s.render();
                });
            }

            layout.setK();
            layout.resetSimulation(options);

            if (options.enableSimulation) {
                layout.step();
            }
        },
        step: function () {
            var layout = this,
                series = this.series,
                options = this.options;

            // Algorithm:
            layout.currentStep++;

            if (layout.approximation === 'barnes-hut') {
                layout.createQuadTree();
                layout.quadTree.calculateMassAndCenter();
            }

            layout.forces.forEach(function (forceName) {
                layout[forceName + 'Forces'](layout.temperature);
            });

            // Limit to the plotting area and cool down:
            layout.applyLimits(layout.temperature);

            // Cool down the system:
            layout.temperature = layout.coolDown(
                layout.startTemperature,
                layout.diffTemperature,
                layout.currentStep
            );

            layout.prevSystemTemperature = layout.systemTemperature;
            layout.systemTemperature = layout.getSystemTemperature();
            if (options.enableSimulation) {
                series.forEach(function (s) {
                    // Chart could be destroyed during the simulation
                    if (s.chart) {
                        s.render();
                    }
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
                        function () {
                            layout.step();
                        }
                    );
                } else {
                    layout.simulation = false;
                }
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
            this.k = this.options.linkLength || this.integration.getK(this);
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
        createQuadTree: function () {
            this.quadTree = new H.QuadTree(
                this.box.left,
                this.box.top,
                this.box.width,
                this.box.height
            );

            this.quadTree.insertNodes(this.nodes);
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

                    node.dispX = 0;
                    node.dispY = 0;
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
                visitedNodes = {},
                radius = this.options.initialPositionRadius;

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
                    box.width / 2 + radius * Math.cos(index * angle)
                );
                node.plotY = node.prevY = pick(
                    node.plotY,
                    box.height / 2 + radius * Math.sin(index * angle)
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
        barycenterForces: function () {
            this.getBarycenter();
            this.force('barycenter');
        },
        getBarycenter: function () {
            var systemMass = 0,
                cx = 0,
                cy = 0;

            this.nodes.forEach(function (node) {
                cx += node.plotX * node.mass;
                cy += node.plotY * node.mass;

                systemMass += node.mass;
            });

            this.barycenter = {
                x: cx,
                y: cy,
                xFactor: cx / systemMass,
                yFactor: cy / systemMass
            };

            return this.barycenter;
        },
        barnesHutApproximation: function (node, quadNode) {
            var layout = this,
                distanceXY = layout.getDistXY(node, quadNode),
                distanceR = layout.vectorLength(distanceXY),
                goDeeper,
                force;

            if (node !== quadNode && distanceR !== 0) {
                if (quadNode.isInternal) {
                    // Internal node:
                    if (
                        quadNode.boxSize / distanceR < layout.options.theta &&
                        distanceR !== 0
                    ) {
                        // Treat as an external node:
                        force = layout.repulsiveForce(distanceR, layout.k);

                        layout.force(
                            'repulsive',
                            node,
                            force * quadNode.mass,
                            distanceXY,
                            distanceR
                        );
                        goDeeper = false;
                    } else {
                        // Go deeper:
                        goDeeper = true;
                    }
                } else {
                    // External node, direct force:
                    force = layout.repulsiveForce(distanceR, layout.k);

                    layout.force(
                        'repulsive',
                        node,
                        force * quadNode.mass,
                        distanceXY,
                        distanceR
                    );
                }
            }

            return goDeeper;
        },
        repulsiveForces: function () {
            var layout = this;

            if (layout.approximation === 'barnes-hut') {
                layout.nodes.forEach(function (node) {
                    layout.quadTree.visitNodeRecursive(
                        null,
                        function (quadNode) {
                            return layout.barnesHutApproximation(
                                node,
                                quadNode
                            );
                        }
                    );
                });
            } else {
                layout.nodes.forEach(function (node) {
                    layout.nodes.forEach(function (repNode) {
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
                                force = layout.repulsiveForce(
                                    distanceR,
                                    layout.k
                                );

                                layout.force(
                                    'repulsive',
                                    node,
                                    force * repNode.mass,
                                    distanceXY,
                                    distanceR
                                );
                            }
                        }
                    });
                });
            }
        },
        attractiveForces: function () {
            var layout = this,
                distanceXY,
                distanceR,
                force;

            layout.links.forEach(function (link) {
                if (link.fromNode && link.toNode) {
                    distanceXY = layout.getDistXY(
                        link.fromNode,
                        link.toNode
                    );
                    distanceR = layout.vectorLength(distanceXY);

                    if (distanceR !== 0) {
                        force = layout.attractiveForce(distanceR, layout.k);

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
        applyLimits: function () {
            var layout = this,
                nodes = layout.nodes;

            nodes.forEach(function (node) {
                if (node.fixedPosition) {
                    return;
                }

                layout.integration.integrate(layout, node);

                layout.applyLimitBox(node, layout.box);

                // Reset displacement:
                node.dispX = 0;
                node.dispY = 0;
            });
        },
        /**
         * External box that nodes should fall. When hitting an edge, node
         * should stop or bounce.
         * @private
         */
        applyLimitBox: function (node, box) {
            var radius = node.marker && node.marker.radius || 0;
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
                    box.width - radius
                ),
                box.left + radius
            );

            // Limit Y-coordinates:
            node.plotY = Math.max(
                Math.min(
                    node.plotY,
                    box.height - radius
                ),
                box.top + radius
            );
        },
        /**
         * From "A comparison of simulated annealing cooling strategies" by
         * Nourani and Andresen work.
         * @private
         */
        coolDown: function (temperature, temperatureStep, currentStep) {
            // Logarithmic:
            /*
            return Math.sqrt(this.nodes.length) -
                Math.log(
                    currentStep * layout.diffTemperature
                );
            */

            // Exponential:
            /*
            var alpha = 0.1;
            layout.temperature = Math.sqrt(layout.nodes.length) *
                Math.pow(alpha, layout.diffTemperature);
            */
            // Linear:
            return temperature - temperatureStep * currentStep;
        },
        isStable: function () {
            return Math.abs(
                this.systemTemperature -
                this.prevSystemTemperature
            ) < 0.00001 || this.temperature <= 0;
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

/* ************************************************************************** *
 * Multiple series support:
 * ************************************************************************** */
// Clear previous layouts
addEvent(Chart, 'predraw', function () {
    if (this.graphLayoutsLookup) {
        this.graphLayoutsLookup.forEach(
            function (layout) {
                layout.stop();
            }
        );
    }
});
addEvent(Chart, 'render', function () {
    var systemsStable,
        afterRender = false;

    function layoutStep(layout) {
        if (
            layout.maxIterations-- &&
            isFinite(layout.temperature) &&
            !layout.isStable() &&
            !layout.options.enableSimulation
        ) {
            // Hook similar to build-in addEvent, but instead of
            // creating whole events logic, use just a function.
            // It's faster which is important for rAF code.
            // Used e.g. in packed-bubble series for bubble radius
            // calculations
            if (layout.beforeStep) {
                layout.beforeStep();
            }

            layout.step();
            systemsStable = false;
            afterRender = true;
        }
    }

    if (this.graphLayoutsLookup) {
        H.setAnimation(false, this);
        // Start simulation
        this.graphLayoutsLookup.forEach(
            function (layout) {
                layout.start();
            }
        );

        // Just one sync step, to run different layouts similar to
        // async mode.
        while (!systemsStable) {
            systemsStable = true;
            this.graphLayoutsLookup.forEach(layoutStep);
        }

        if (afterRender) {
            this.series.forEach(function (s) {
                if (s && s.layout) {
                    s.render();
                }
            });
        }
    }
});
