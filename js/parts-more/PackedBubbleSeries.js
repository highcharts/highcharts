/**
 * (c) 2010-2018 Grzegorz Blachlinski, Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Color.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../modules/networkgraph/networkgraph.src.js';


var seriesType = H.seriesType,
    defined = H.defined,
    pick = H.pick,
    addEvent = H.addEvent,
    Chart = H.Chart,
    color = H.Color;


H.networkgraphIntegrations.packedbubble = {

    repulsiveForceFunction: function (d, k, node) {
        // node.radius + repNode.radius?
        return Math.min(d, node.marker.radius + 5);
    },
    barycenter: function () {
        var layout = this,
            gravitationalConstant = layout.options.gravitationalConstant,
            box = layout.box,
            nodes = layout.nodes,
            chart,
            bBox,
            seriesPoint;
        nodes.forEach(function (node) {
            seriesPoint = {
                plotX: box.width / 2,
                plotY: box.height / 2
            };
            if (!layout.options.mixSeries) {
                if (!node.parentNode) {
                    seriesPoint = node.series.seriesPoint;
                } else {
                // TODO add updated flag - not update multiple
                // times during the same iteration
                    chart = node.series.chart;
                    bBox = node.series.group.element.getBBox();
                    node.series.seriesRadius =
                        node.series.seriesPoint.marker.radius =
                            Math.min(
                                10 * Math.sqrt(node.series.systemMass * 3) + 10,
                                bBox ?
                                    Math.max(
                                        Math.sqrt(
                                            Math.pow(bBox.width, 2) +
                                            Math.pow(bBox.height, 2)
                                        ) / 2,
                                        10
                                    ) :
                                    10 * Math.sqrt(
                                        node.series.systemMass * 3
                                    ) + 10
                            );
                    if (!node.series.seriesPoint.gr) {
                        node.series.seriesPoint.gr = chart.renderer.circle(
                            node.series.seriesPoint.plotX + chart.plotLeft,
                            node.series.seriesPoint.plotY + chart.plotTop,
                            node.series.seriesRadius
                        ).attr({
                            fill: color(
                                node.series.color
                            ).brighten(0.4).get(),
                            stroke: color(node.series.color).get(),
                            'stroke-width': 1
                        }).add();
                    } else {
                        node.series.seriesPoint.gr.attr({
                            x: node.series.seriesPoint.plotX + chart.plotLeft,
                            y: node.series.seriesPoint.plotY + chart.plotTop,
                            r: node.series.seriesRadius
                        });
                    }
                }
            }
            if (!node.fixedPosition) {
                node.plotX -= (node.plotX - seriesPoint.plotX) *
                gravitationalConstant / (node.mass * Math.sqrt(nodes.length));
                node.plotY -= (node.plotY - seriesPoint.plotY) *
                gravitationalConstant / (node.mass * Math.sqrt(nodes.length));
            }
        });
    },
    repulsive: function (node, force, distanceXY, repNode) {
        var factor = force * this.diffTemperature / node.mass / node.degree;
        if (!node.fixedPosition) {
            node.plotX += distanceXY.x * factor;
            node.plotY += distanceXY.y * factor;
            node.repulsiveChangeX += distanceXY.x * factor;
            node.repulsiveChangeY += distanceXY.x * factor;
        }
        if (!repNode.fixedPosition) {
            repNode.plotX -= distanceXY.x * factor;
            repNode.plotY -= distanceXY.y * factor;
            repNode.repulsiveChangeX -= distanceXY.x * factor;
            repNode.repulsiveChangeY -= distanceXY.x * factor;
        }
    },
    integrate: function (layout, node) {
        var friction = -layout.options.friction,
            maxSpeed = layout.options.maxSpeed,
            prevX = node.prevX,
            prevY = node.prevY,
            // Apply friciton:
            diffX = (node.plotX + node.dispX - prevX) * friction,
            diffY = (node.plotY + node.dispY - prevY) * friction;

        // Apply max speed:
        diffX = Math.sign(diffX) * Math.min(maxSpeed, Math.abs(diffX));
        diffY = Math.sign(diffY) * Math.min(maxSpeed, Math.abs(diffY));

        // Store for the next iteration:
        node.prevX = node.plotX + node.dispX;
        node.prevY = node.plotY + node.dispY;

        // Update positions:
        node.plotX += diffX;
        node.plotY += diffY;

        node.temperature = layout.vectorLength({
            x: diffX,
            y: diffY
        });
    },
    getK: H.noop
};

H.extend(
    H.layouts['reingold-fruchterman'].prototype,
    {
        clearNodes: function () {
            var seriesPoint;
            this.nodes.forEach(function (node) {
                seriesPoint = node.series && node.series.seriesPoint;
                if (seriesPoint && seriesPoint.gr) {
                    node.series.seriesPoint.gr.destroy();
                    delete node.series.seriesPoint.gr;
                }
            });
            this.nodes.length = 0;
        },
        addNodes: function (nodes) {
            nodes.forEach(function (node) {
                if (this.nodes.indexOf(node) === -1) {
                    this.nodes.push(node);
                }
            }, this);
        },
        setCircularPositions: function () {
            var layout = this,
                box = layout.box,
                nodes = layout.nodes,
                nodesLength = nodes.length + 1,
                angle = 2 * Math.PI / nodesLength,
                seriesPoint,
                radius = layout.options.initialPositionRadius;
            nodes.forEach(function (node, index) {
                seriesPoint = {
                    plotX: box.width / 2,
                    plotY: box.height / 2
                };
                if (
                    !node.parentNode &&
                    node.series &&
                    node.series.seriesPoint &&
                    node.series.seriesPoint.plotX
                ) {
                    seriesPoint = node.series.seriesPoint;
                }
                node.plotX = node.prevX = pick(
                    node.plotX,
                    seriesPoint.plotX +
                    radius * Math.cos(node.index || index * angle)
                );

                node.plotY = node.prevY =
                    pick(
                        node.plotY,
                        seriesPoint.plotY +
                        radius * Math.sin(node.index || index * angle)
                    );

                node.dispX = 0;
                node.dispY = 0;
            });
        },
        repulsiveForces: function () {
            var layout = this,
                force,
                distanceR,
                distanceXY,
                bubblePadding = layout.options.bubblePadding;
            layout.nodes.forEach(function (node) {
                node.repulsiveChangeX = 0;
                node.repulsiveChangeY = 0;
                node.degree = node.mass;
                node.neighbours = 0;
                layout.nodes.forEach(function (repNode) {
                    force = 0;
                    if (
                        // Node can not repulse itself:
                        node !== repNode &&
                        // Only close nodes affect each other:
                        /* layout.getDistR(node, repNode) < 2 * k && */
                        // Not dragged:
                        !node.fixedPosition &&
                        (
                            layout.options.seriesInteraction ||
                            node.series === repNode.series
                        )
                    ) {
                        distanceXY = layout.getDistXY(node, repNode);
                        distanceR = (
                            layout.vectorLength(distanceXY) -
                            (
                                node.marker.radius +
                                repNode.marker.radius +
                                bubblePadding
                            )
                        );
                        // TODO padding configurable
                        if (distanceR < 0) {
                            node.degree += 0.01;
                            node.neighbours++;
                            force = layout.repulsiveForce(
                                -distanceR / Math.sqrt(node.neighbours),
                                layout.k,
                                node,
                                repNode
                            );
                        }

                        layout.force(
                            'repulsive',
                            node,
                            force * repNode.mass,
                            distanceXY,
                            repNode,
                            distanceR
                        );
                    }
                });
            });
        },
        applyLimitBox: function (node, box) {
            var layout = this,
                distanceXY,
                distanceR;
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
            /*
             Apply repulsive limits for two objects
             * an example based on parentNodes and nodes
             */

            // parentLimit should be used together
            // with seriesInteraction: false for now
            if (!node.parentNode && layout.options.parentLimit) {
                distanceXY = layout.getDistXY(node, node.series.seriesPoint);
                distanceR = (
                    node.series.seriesRadius -
                    node.marker.radius -
                    layout.vectorLength(distanceXY)
                );
                if (distanceR < 0 && distanceR > -2 * node.marker.radius) {
                    node.plotX -= distanceXY.x * 0.01;
                    node.plotY -= distanceXY.y * 0.01;
                }
            }

            // Limit X-coordinates:
            node.plotX = Math.max(
                Math.min(
                    node.plotX,
                    box.width - node.marker.radius
                ),
                box.left + node.marker.radius
            );

            // Limit Y-coordinates:
            node.plotY = Math.max(
                Math.min(
                    node.plotY,
                    box.height - node.marker.radius
                ),
                box.top + node.marker.radius
            );
        }
    }
);


/**
 * A packed bubble series is a two dimensional series type, where each point
 * renders a value in X, Y position. Each point is drawn as a bubble
 * where the bubbles don't overlap with each other and the radius
 * of the bubble related to the value.
 * Requires `highcharts-more.js`.
 *
 * @extends plotOptions.bubble
 * @excluding minSize,maxSize,connectNulls,keys,sizeByAbsoluteValue,
 * step,zMin,zMax,sizeBy,connectEnds
 * @product highcharts
 * @sample {highcharts} highcharts/demo/packed-bubble/
 *         Packed-bubble chart
 * @since 7.0.0
 * @optionparent plotOptions.packedbubble
 */

seriesType('packedbubble', 'bubble',
    {
        /**
         * Minimum bubble size. Bubbles will automatically size between the
         * `minSize` and `maxSize` to reflect the `z` value of each bubble.
         * Can be either pixels (when no unit is given), or a percentage of
         * the smallest one of the plot width and height.
         *
         * @type    {Number|String}
         * @sample  {highcharts} highcharts/plotoptions/bubble-size/ Bubble size
         * @since   3.0
         * @product highcharts highstock
         */
        minSize: '10%',
        /**
         * Maximum bubble size. Bubbles will automatically size between the
         * `minSize` and `maxSize` to reflect the `z` value of each bubble.
         * Can be either pixels (when no unit is given), or a percentage of
         * the smallest one of the plot width and height.
         *
         * @type    {Number|String}
         * @sample  {highcharts} highcharts/plotoptions/bubble-size/
         *          Bubble size
         * @since   3.0
         * @product highcharts highstock
         */
        maxSize: '50%',
        sizeBy: 'area',
        zoneAxis: 'y',
        tooltip: {
            pointFormat: 'Value: {point.value}'
        },
        draggable: true,
        isPackedBbl: true,
        useSimulation: false,
        dataLabels: {
            formatter: function () {
                return this.point.value;
            },
            allowOverlap: true
        },
        layoutAlgorithm: {
            /**
             * Repulsive force applied on a node. Passed are two arguments:
             * - `d` - which is current distance between two nodes
             * - `k` - which is desired distance between two nodes
             *
             * In `verlet` integration, defaults to:
             * `function (d, k) { return (k - d) / d * (k > d ? 1 : 0) }`
             *
             * @see         [layoutAlgorithm.integration](#series.networkgraph.layoutAlgorithm.integration)
             * @apioption   plotOptions.networkgraph.layoutAlgorithm.repulsiveForce
             * @sample      highcharts/series-networkgraph/forces/
             *              Custom forces with Euler integration
             * @sample      highcharts/series-networkgraph/cuboids/
             *              Custom forces with Verlet integration
             * @type        {Function}
             * @default function (d, k) { return k * k / d; }
             */

            /**
             * Attraction force applied on a node which is conected to another
             * node by a link. Passed are two arguments:
             * - `d` - which is current distance between two nodes
             * - `k` - which is desired distance between two nodes
             *
             * In `verlet` integration, defaults to:
             * `function (d, k) { return (k - d) / d; }`
             *
             * @see         [layoutAlgorithm.integration](#series.networkgraph.layoutAlgorithm.integration)
             * @apioption   plotOptions.networkgraph.layoutAlgorithm.attractiveForce
             * @sample      highcharts/series-networkgraph/forces/
             *              Custom forces with Euler integration
             * @sample      highcharts/series-networkgraph/cuboids/
             *              Custom forces with Verlet integration
             * @type        {Function}
             * @default function (d, k) { return k * k / d; }
             */

            /**
             * Ideal length (px) of the link between two nodes.
             * When not defined,
             * length is calculated as:
             * `Math.pow(availableWidth * availableHeight / nodesLength, 0.4);`
             *
             * Note: Because of the algorithm specification, length of each link
             * might be not exactly as specified.
             *
             * @type      {number}
             * @apioption series.networkgraph.layoutAlgorithm.linkLength
             * @sample    highcharts/series-networkgraph/styled-links/
             *            Numerical values
             * @defaults  undefined
             */

            /**
             * Initial layout algorithm for positioning nodes. Can be one of
             * built-in options ("circle", "random") or a function where
             * positions should be set on each node (`this.nodes`)
             *  as `node.plotX` and `node.plotY`
             *
             * @sample      highcharts/series-networkgraph/initial-positions/
             *              Initial positions with callback
             * @type        {String|Function}
             * @validvalue  ["circle", "random"]
             */
            initialPositions: 'circle',
            initialPositionRadius: 20,
            bubblePadding: 5,
            // experimental
            parentLimit: true,
            seriesInteraction: false,
            /**
             * Experimental. Enables live simulation of the algorithm
             * implementation. All nodes are animated as the forces applies on
             * them.
             *
             * @sample       highcharts/demo/network-graph/
             *               Live simulation enabled
             */
            enableSimulation: true,
            /**
             * Barnes-Hut approximation only.
             * Deteremines when distance between cell and node
             * is small enough to
             * caculate forces. Value of `theta` is compared
             * directly with quotient
             * `s / d`, where `s` is the size of the cell, and `d` is distance
             * between center of cell's mass and currently compared node.
             *
             * @see         [layoutAlgorithm.approximation](#series.networkgraph.layoutAlgorithm.approximation)
             * @since       7.1.0
             */
            theta: 0,
            /**
             * Approximation used to calculate repulsive forces affecting nodes.
             * By default, when calculateing net force, nodes are
             * compared against each other,
             * which gives O(N^2) complexity. Using Barnes-Hut
             * approximation, we decrease this to O(N log N), but the resulting
             * graph will have different layout.
             * Barnes-Hut approximation divides
             * space into rectangles via quad tree,
             * where forces exerted on nodes
             * are calculated directly for nearby cells, and for all others,
             * cells are treated as a separate node with center of mass.
             *
             * @see         [layoutAlgorithm.theta](#series.networkgraph.layoutAlgorithm.theta)
             * @validvalue  ["barnes-hut", "none"]
             * @since       7.1.0
             */
            approximation: 'none',
            /**
             * Type of the algorithm used when positioning nodes.
             *
             * @validvalue  ["reingold-fruchterman"]
             */
            type: 'reingold-fruchterman',
            /**
             * Integration type. Available options are `'euler'` and `'verlet'`.
             * Integration determines how forces are applied
             * on particles. In Euler
             * integration, force is applied direct as
             * `newPosition += velocity;`.
             * In Verlet integration, new position
             * is based on a previous posittion
             * without velocity:
             * `newPosition += previousPosition - newPosition`.
             *
             * Note that different integrations give different results as forces
             * are different.
             *
             * In Highcharts v7.0.x only `'euler'` integration was supported.
             *
             * @since       7.1.0
             * @sample      highcharts/series-networkgraph/forces/
             *              Custom forces with Euler integration
             * @validvalue  ["euler", "verlet"]
             */
            integration: 'packedbubble',
            /**
             * Max number of iterations before algorithm will stop. In general,
             * algorithm should find positions sooner, but when rendering huge
             * number of nodes, it is recommended to increase this value as
             * finding perfect graph positions can require more time.
             */
            maxIterations: 1000,
            mixSeries: false,
            maxSpeed: 5,
            /**
             * Gravitational const used in the barycenter
             * force of the algorithm.
             *
             * @sample      highcharts/series-networkgraph/forces/
             *              Custom forces with Euler integration
             */
            gravitationalConstant: 0.0325,
            /**
             * Friction applied on forces to prevent nodes rushing to fast to
             * the desired positions.
             */
            friction: -0.981
        }
    }, {
        forces: ['barycenter', 'repulsive'],
        pointArrayMap: ['value'],
        pointValKey: 'value',
        isCartesian: false,
        axisTypes: [],
        /**
         * Create a single array of all points from all series
         *
         * @param {Array} Array of all series objects
         * @return {Array} Returns the array of all points.
         *
         */
        accumulateAllPoints: function (series) {

            var chart = series.chart,
                allDataPoints = [],
                i, j;

            for (i = 0; i < chart.series.length; i++) {

                series = chart.series[i];

                if (series.visible || !chart.options.chart.ignoreHiddenSeries) {

                    // add data to array only if series is visible
                    for (j = 0; j < series.yData.length; j++) {
                        allDataPoints.push([
                            null, null,
                            series.yData[j],
                            series.index,
                            j,
                            {
                                id: j,
                                marker: {
                                    radius: 0
                                }
                            }
                        ]);
                    }
                }
            }

            return allDataPoints;
        },
        init: function () {

            H.Series.prototype.init.apply(this, arguments);

            // When one series is modified, the others need to be recomputed
            H.addEvent(this, 'updatedData', function () {
                var self = this;
                this.chart.series.forEach(function (s) {
                    if (s.type === self.type) {
                        s.isDirty = true;
                    }
                });
            });

            return this;
        },
        alignDataLabel: H.Series.prototype.alignDataLabel,
        deferLayout: function () {
            var series = this,
                layoutOptions = series.options.layoutAlgorithm,
                points = series.points,
                graphLayoutsStorage = series.chart.graphLayoutsStorage,
                graphLayoutsLookup = series.chart.graphLayoutsLookup,
                chartOptions = series.chart.options.chart,
                layout,
                nodeAdded,
                seriesLayout,
                NetworkPoint = H.seriesTypes.networkgraph.prototype.pointClass;

            series.nodes = points;
            series.nodes.forEach(function (node) {
                node.mass = Math.max(node.marker.radius / 10, 1);
                node.degree = 1;
                node.collisionNmb = 1;
            });

            if (!series.visible) {
                return;
            }

            if (!graphLayoutsStorage) {
                series.chart.graphLayoutsStorage = graphLayoutsStorage = {};
                series.chart.graphLayoutsLookup = graphLayoutsLookup = [];
            }

            layout = graphLayoutsStorage[layoutOptions.type];

            if (!layout) {
                layoutOptions.enableSimulation =
                    !defined(chartOptions.forExport) ?
                        layoutOptions.enableSimulation :
                        !chartOptions.forExport;

                graphLayoutsStorage[layoutOptions.type] = layout =
                    new H.layouts[layoutOptions.type](layoutOptions);
                graphLayoutsLookup.splice(layout.index, 0, layout);

            }

            series.layout = layout;

            layout.setArea(
                0, 0, series.chart.plotWidth, series.chart.plotHeight
            );
            layout.addSeries(series);
            layout.addNodes(series.nodes);
            layout.addLinks([]);
            series.points = points;

            if (!layoutOptions.mixSeries) {
                seriesLayout = graphLayoutsStorage[
                    layoutOptions.type + '-series'
                ];
                if (!seriesLayout) {
                    graphLayoutsStorage[layoutOptions.type + '-series'] =
                        seriesLayout =
                            new H.layouts[layoutOptions.type](
                                H.merge(
                                    layoutOptions,
                                    {
                                        enableSimulation: true,
                                        maxIterations: 400,
                                        maxSpeed: 50,
                                        initialPositionRadius: 100,
                                        seriesInteraction: true
                                    }
                                )
                            );
                    graphLayoutsLookup.splice(
                        seriesLayout.index, 0, seriesLayout
                    );
                }
                series.seriesLayout = seriesLayout;
                series.systemMass = 0;

                series.points.forEach(function (p) {
                    series.systemMass += p.mass;
                });
                series.seriesRadius = series.systemMass / 3 + 10;
                seriesLayout.nodes.forEach(function (node) {
                    if (node.seriesIndex === series.index) {
                        nodeAdded = true;
                    }
                });
                seriesLayout.setArea(
                    0, 0, series.chart.plotWidth, series.chart.plotHeight
                );
                if (!nodeAdded) {
                    var seriesPoint = (
                        new NetworkPoint()
                    ).init(
                        this,
                        {
                            mass: series.seriesRadius / 2,
                            marker: {
                                radius: series.seriesRadius
                            },
                            degree: series.seriesRadius,
                            parentNode: true,
                            seriesIndex: series.index
                        }
                    );
                    if (series.seriesPoint) {
                        seriesPoint.plotX = series.seriesPoint.plotX;
                        seriesPoint.plotY = series.seriesPoint.plotY;
                    }
                    series.seriesPoint = seriesPoint;

                    seriesLayout.addSeries(series);
                    seriesLayout.addNodes([seriesPoint]);
                    seriesLayout.addLinks([]);
                }
            }
        },
        /**
         * Extend the base translate method to handle bubble size,
         * and correct positioning them
         */
        translate: function () {

            var series = this,
                chart = series.chart,
                data = series.data,
                index = series.index,
                point,
                radius,
                positions,
                i,
                useSimulation = series.options.useSimulation;

            this.processedXData = this.xData;
            this.generatePoints();

            // merged data is an array with all of the data from all series
            if (!defined(chart.allDataPoints)) {
                chart.allDataPoints = series.accumulateAllPoints(series);
                // calculate radius for all added data
                series.getPointRadius();
            }

            // after getting initial radius, calculate bubble positions
            positions = this.placeBubbles(chart.allDataPoints);


            if (!useSimulation) {
                series.options.draggable = false;
                // Set the shape and arguments to be picked up in drawPoints
                for (i = 0; i < positions.length; i++) {

                    if (positions[i][3] === index) {

                        // update the series points with the val from positions
                        // array
                        point = data[positions[i][4]];
                        radius = positions[i][2];
                        point.plotX = positions[i][0] - chart.plotLeft +
                          chart.diffX;
                        point.plotY = positions[i][1] - chart.plotTop +
                          chart.diffY;

                        point.marker = H.extend(point.marker, {
                            radius: radius,
                            width: 2 * radius,
                            height: 2 * radius
                        });
                    }
                }
            } else {
                // Set the shape and arguments to be picked up in drawPoints
                for (i = 0; i < chart.allDataPoints.length; i++) {

                    if (chart.allDataPoints[i][3] === index) {

                        // update the series points with the val from positions
                        // array
                        point = data[chart.allDataPoints[i][4]];
                        radius = chart.allDataPoints[i][2];
                        point.marker = H.extend(point.marker, {
                            radius: radius,
                            width: 2 * radius,
                            height: 2 * radius
                        });
                    }
                }
                this.deferLayout();
            }
        },
        /**
         * Check if two bubbles overlaps.
         * @param {Array} first bubble
         * @param {Array} second bubble
         *
         * @return {Boolean} overlap or not
         *
         */
        checkOverlap: function (bubble1, bubble2) {
            var diffX = bubble1[0] - bubble2[0], // diff of X center values
                diffY = bubble1[1] - bubble2[1], // diff of Y center values
                sumRad = bubble1[2] + bubble2[2]; // sum of bubble radius

            return (
                Math.sqrt(diffX * diffX + diffY * diffY) -
                Math.abs(sumRad)
            ) < -0.001;
        },
        /* Function that is adding one bubble based on positions and sizes
         * of two other bubbles, lastBubble is the last added bubble,
         * newOrigin is the bubble for positioning new bubbles.
         * nextBubble is the curently added bubble for which we are
         * calculating positions
         *
         * @param {Array} The closest last bubble
         * @param {Array} New bubble
         * @param {Array} The closest next bubble
         *
         * @return {Array} Bubble with correct positions
         *
         */
        positionBubble: function (lastBubble, newOrigin, nextBubble) {
            var sqrt = Math.sqrt,
                asin = Math.asin,
                acos = Math.acos,
                pow = Math.pow,
                abs = Math.abs,
                distance = sqrt( // dist between lastBubble and newOrigin
                    pow((lastBubble[0] - newOrigin[0]), 2) +
                    pow((lastBubble[1] - newOrigin[1]), 2)
                ),
                alfa = acos(
                    // from cosinus theorem: alfa is an angle used for
                    // calculating correct position
                    (
                        pow(distance, 2) +
                        pow(nextBubble[2] + newOrigin[2], 2) -
                        pow(nextBubble[2] + lastBubble[2], 2)
                    ) / (2 * (nextBubble[2] + newOrigin[2]) * distance)
                ),

                beta = asin( // from sinus theorem.
                    abs(lastBubble[0] - newOrigin[0]) /
                    distance
                ),
                // providing helping variables, related to angle between
                // lastBubble and newOrigin
                gamma = (lastBubble[1] - newOrigin[1]) < 0 ? 0 : Math.PI,
                // if new origin y is smaller than last bubble y value
                // (2 and 3 quarter),
                // add Math.PI to final angle

                delta = (lastBubble[0] - newOrigin[0]) *
                (lastBubble[1] - newOrigin[1]) < 0 ?
                    1 : -1, // (1st and 3rd quarter)
                finalAngle = gamma + alfa + beta * delta,
                cosA = Math.cos(finalAngle),
                sinA = Math.sin(finalAngle),
                posX = newOrigin[0] + (newOrigin[2] + nextBubble[2]) * sinA,
                // center of new origin + (radius1 + radius2) * sinus A
                posY = newOrigin[1] - (newOrigin[2] + nextBubble[2]) * cosA;
            return [
                posX,
                posY,
                nextBubble[2],
                nextBubble[3],
                nextBubble[4]
            ]; // the same as described before
        },
        /**
         * This is the main function responsible
         * for positioning all of the bubbles
         * allDataPoints - bubble array, in format [pixel x value,
         * pixel y value, radius,
         * related series index, related point index]
         *
         * @param {Array} All points from all series
         *
         * @return {Array} Positions of all bubbles
         *
         */
        placeBubbles: function (allDataPoints) {

            var series = this,
                checkOverlap = series.checkOverlap,
                positionBubble = series.positionBubble,
                bubblePos = [],
                stage = 1,
                j = 0,
                k = 0,
                calculatedBubble,
                sortedArr,
                arr = [],
                i;

            // sort all points
            sortedArr = allDataPoints.sort(function (a, b) {
                return b[2] - a[2];
            });

            if (sortedArr.length === 1) {
                // if length is 1,return only one bubble
                arr = [
                    0, 0,
                    sortedArr[0][0],
                    sortedArr[0][1],
                    sortedArr[0][2]
                ];
            } else if (sortedArr.length) {

                // create first bubble in the middle of the chart
                bubblePos.push([
                    [
                        0, // starting in 0,0 coordinates
                        0,
                        sortedArr[0][2], // radius
                        sortedArr[0][3], // series index
                        sortedArr[0][4]
                    ] // point index
                ]); // 0 level bubble

                bubblePos.push([
                    [
                        0,
                        0 - sortedArr[1][2] - sortedArr[0][2],
                        // move bubble above first one
                        sortedArr[1][2],
                        sortedArr[1][3],
                        sortedArr[1][4]
                    ]
                ]); // 1 level 1st bubble

                // first two already positioned so starting from 2
                for (i = 2; i < sortedArr.length; i++) {
                    sortedArr[i][2] = sortedArr[i][2] || 1;
                    // in case if radius is calculated as 0.
                    calculatedBubble = positionBubble(
                        bubblePos[stage][j],
                        bubblePos[stage - 1][k],
                        sortedArr[i]
                    ); // calculate initial bubble position

                    if (checkOverlap(calculatedBubble, bubblePos[stage][0])) {
                        /* if new bubble is overlapping with first bubble
                         * in current level (stage)
                         */

                        bubblePos.push([]);
                        k = 0;
                        /* reset index of bubble, used for
                         * positioning the bubbles
                         * around it, we are starting from first bubble in next
                         * stage because we are changing level to higher
                         */
                        bubblePos[stage + 1].push(
                            positionBubble(
                                bubblePos[stage][j],
                                bubblePos[stage][0],
                                sortedArr[i]
                            )
                        );
                        // (last added bubble, 1. from curr stage, new bubble)
                        stage++; // the new level is created, above current one
                        j = 0; // set the index of bubble in current level to 0
                    } else if (
                        stage > 1 && bubblePos[stage - 1][k + 1] &&
                        checkOverlap(
                            calculatedBubble, bubblePos[stage - 1][k + 1]
                        )
                    ) {
                        /* if new bubble is overlapping with one of the previous
                         * stage bubbles, it means that - bubble, used for
                         * positioning the bubbles around it has changed
                         * so we need to recalculate it
                         */
                        k++;
                        bubblePos[stage].push(
                            positionBubble(
                                bubblePos[stage][j],
                                bubblePos[stage - 1][k],
                                sortedArr[i]
                            )
                        );
                        // (last added bubble, prev stage bubble, new bubble)
                        j++;
                    } else { // simply add calculated bubble
                        j++;
                        bubblePos[stage].push(calculatedBubble);
                    }
                }
                series.chart.stages = bubblePos;
                // it may not be necessary but adding it just in case -
                // it is containing all of the bubble levels

                series.chart.rawPositions = [].concat.apply([], bubblePos);
                // bubble positions merged into one array

                series.resizeRadius();
                arr = series.chart.rawPositions;

            }
            return arr;
        },
        /**
         * The function responsible for resizing the bubble radius.
         * In shortcut: it is taking the initially
         * calculated positions of bubbles. Then it is calculating the min max
         * of both dimensions, creating something in shape of bBox.
         * The comparison of bBox and the size of plotArea
         * (later it may be also the size set by customer) is giving the
         * value how to recalculate the radius so it will match the size
         */
        resizeRadius: function () {

            var chart = this.chart,
                positions = chart.rawPositions,
                min = Math.min,
                max = Math.max,
                plotLeft = chart.plotLeft,
                plotTop = chart.plotTop,
                chartHeight = chart.plotHeight,
                chartWidth = chart.plotWidth,
                minX, maxX, minY, maxY,
                radius,
                bBox,
                spaceRatio,
                smallerDimension,
                i;

            minX = minY = Number.POSITIVE_INFINITY; // set initial values
            maxX = maxY = Number.NEGATIVE_INFINITY;

            for (i = 0; i < positions.length; i++) {
                radius = positions[i][2];
                minX = min(minX, positions[i][0] - radius);
                // (x center-radius) is the min x value used by specific bubble
                maxX = max(maxX, positions[i][0] + radius);
                minY = min(minY, positions[i][1] - radius);
                maxY = max(maxY, positions[i][1] + radius);
            }

            bBox = [maxX - minX, maxY - minY];
            spaceRatio = [
                (chartWidth - plotLeft) / bBox[0],
                (chartHeight - plotTop) / bBox[1]
            ];

            smallerDimension = min.apply([], spaceRatio);

            if (Math.abs(smallerDimension - 1) > 1e-10) {
                // if bBox is considered not the same width as possible size
                for (i = 0; i < positions.length; i++) {
                    positions[i][2] *= smallerDimension;
                }
                this.placeBubbles(positions);
            } else {
                /** if no radius recalculation is needed, we need to position
                 * the whole bubbles in center of chart plotarea
                 * for this, we are adding two parameters,
                 * diffY and diffX, that are related to differences
                 * between the initial center and the bounding box
                 */
                chart.diffY = chartHeight / 2 +
                    plotTop - minY - (maxY - minY) / 2;
                chart.diffX = chartWidth / 2 +
                    plotLeft - minX - (maxX - minX) / 2;
            }
        },

        calculateZExtremes: function () {
            var series = this,
                chart = series.chart,
                zMin = series.yData[0],
                zMax = series.yData[0];

            chart.series.forEach(function (s) {
                zMax = Math.max(zMax, Math.max.apply(this, s.yData));
                zMin = Math.min(zMin, Math.min.apply(this, s.yData));
            });
            return [zMin, zMax];
        },
        /**
         * Calculate radius of bubbles in series.
         */
        getPointRadius: function () { // bubbles array

            var series = this,
                chart = series.chart,
                plotWidth = chart.plotWidth,
                plotHeight = chart.plotHeight,
                seriesOptions = series.options,
                smallestSize = Math.min(plotWidth, plotHeight),
                extremes = {},
                radii = [],
                allDataPoints = chart.allDataPoints,
                minSize,
                maxSize,
                value,
                radius, zExtremes;
            ['minSize', 'maxSize'].forEach(function (prop) {
                var length = parseInt(seriesOptions[prop], 10),
                    isPercent = /%$/.test(seriesOptions[prop]);
                extremes[prop] = isPercent ?
                    smallestSize * length / 100 :
                    length * Math.sqrt(allDataPoints.length);
            });
            chart.minRadius = minSize = extremes.minSize /
                Math.sqrt(allDataPoints.length);
            chart.maxRadius = maxSize = extremes.maxSize /
                Math.sqrt(allDataPoints.length);
            zExtremes = this.calculateZExtremes();

            (allDataPoints || []).forEach(function (point, i) {
                value = point[2];
                radius = series.getRadius(
                    zExtremes[0],
                    zExtremes[1],
                    minSize,
                    maxSize,
                    value
                );
                if (radius === 0) {
                    radius = null;
                }
                allDataPoints[i][2] = radius;
                radii.push(radius);
            });
            this.radii = radii;
        },
        redrawHalo: function (point) {
            if (point && this.halo) {
                this.halo.attr({
                    d: point.haloPath(
                        this.options.states.hover.halo.size
                    )
                });
            }
        },
        onMouseDown: function (point, event) {
            var normalizedEvent = this.chart.pointer.normalize(event);

            point.fixedPosition = {
                chartX: normalizedEvent.chartX,
                chartY: normalizedEvent.chartY,
                plotX: point.plotX,
                plotY: point.plotY
            };

            point.inDragMode = true;
        },
        onMouseMove: function (point, event) {
            if (point.fixedPosition && point.inDragMode) {
                var series = this,
                    chart = series.chart,
                    normalizedEvent = chart.pointer.normalize(event),
                    diffX = point.fixedPosition.chartX - normalizedEvent.chartX,
                    diffY = point.fixedPosition.chartY - normalizedEvent.chartY,
                    newPlotX,
                    newPlotY;

                // At least 5px to apply change (avoids simple click):
                if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
                    newPlotX = point.fixedPosition.plotX - diffX;
                    newPlotY = point.fixedPosition.plotY - diffY;

                    if (chart.isInsidePlot(newPlotX, newPlotY)) {
                        point.plotX = newPlotX;
                        point.plotY = newPlotY;

                        series.redrawHalo();

                        if (!series.layout.simulation) {
                            // Start new simulation:
                            if (!series.layout.enableSimulation) {
                                // Run only one iteration to speed things up:
                                series.layout.setMaxIterations(1);
                            }
                            // When dragging nodes, we don't need to calculate
                            // initial positions and rendering nodes:
                            series.layout.setInitialRendering(false);
                            series.layout.run();
                            // Restore defaults:
                            series.layout.setInitialRendering(true);
                        } else {
                            // Extend current simulation:
                            series.layout.resetSimulation();
                        }
                    }
                }
            }
        },
        onMouseUp: function (point) {
            if (point.fixedPosition && !point.removed) {
                var distanceXY,
                    distanceR,
                    layout = this.layout,
                    seriesLayout = this.seriesLayout;
                if (seriesLayout) {
                    seriesLayout.nodes.forEach(function (node) {
                        if (point && point.marker) {
                            distanceXY = layout.getDistXY(point, node);
                            distanceR = (
                                layout.vectorLength(distanceXY) -
                                node.marker.radius -
                                point.marker.radius
                            );
                            if (distanceR < 0) {
                                node.series.addPoint({
                                    x: point.x,
                                    value: point.value,
                                    plotX: point.plotX,
                                    plotY: point.plotY
                                }, false);
                                layout.nodes.splice(
                                    layout.nodes.indexOf(point), 1
                                );
                                point.series.removePoint(point.index);
                            }
                        }
                    });
                }
                layout.run();
                point.inDragMode = false;
                if (!this.options.fixedDraggable) {
                    delete point.fixedPosition;
                }
            }
        }
    }, {
        getDegree: function () {
            return 1;
        }
    });

// Remove accumulated data points to redistribute all of them again
// (i.e after hiding series by legend)

H.addEvent(H.Chart, 'beforeRedraw', function () {
    if (this.allDataPoints) {
        delete this.allDataPoints;
    }
});

/*
 * Draggable mode:
 */
addEvent(
    Chart,
    'load',
    function () {
        var chart = this,
            unbinders = [];

        if (chart.container) {
            unbinders.push(
                addEvent(
                    chart.container,
                    'mousedown',
                    function (event) {
                        var point = chart.hoverPoint;
                        if (
                            point &&
                            point.series &&
                            point.series.options.isPackedBbl &&
                            point.series.options.draggable
                        ) {
                            point.series.onMouseDown(point, event);
                            unbinders.push(addEvent( // add names for unbinders
                                chart.container,
                                'mousemove',
                                function (e) {
                                    return point.series.onMouseMove(point, e);
                                }
                            ));
                            unbinders.push(addEvent(
                                chart.container.ownerDocument,
                                'mouseup',
                                function (e) {
                                    unbinders[1]();
                                    unbinders[2]();
                                    unbinders = unbinders.slice(0, 1);
                                    return point.series.onMouseUp(point, e);
                                }
                            ));
                        }
                    }
                )
            );
        }

        addEvent(chart, 'destroy', function () {
            unbinders.forEach(function (unbind) {
                unbind();
            });
        });
    }
);

/**
 * A `packedbubble` series. If the [type](#series.packedbubble.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.packedbubble
 * @excluding dataParser,dataURL,stack
 * @product   highcharts highstock
 * @apioption series.packedbubble
 */

/**
 * An array of data points for the series. For the `packedbubble` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of `y` values.
 *
 *  ```js
 *     data: [5, 1, 20]
 *  ```
 *
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data points
 * exceeds the series' [turboThreshold](#series.packedbubble.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         y: 1,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         y: 5,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array>}
 * @extends   series.line.data
 * @excluding marker
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts
 * @apioption series.packedbubble.data
 */

/**
 * @excluding enabled,enabledThreshold,height,radius,width
 * @apioption series.packedbubble.marker
 */
