/**
 * Networkgraph series
 *
 * (c) 2010-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';

var defined = H.defined,
    extend = H.extend,
    seriesType = H.seriesType,
    pick = H.pick,
    Point = H.point;

/**
 * A networkgraph is a type of relationship chart, where connnections
 * (links) attracts nodes (points) and other nodes repulse each other.
 *
 * @extends      {plotOptions.line}
 * @product      highcharts
 * @sample       highcharts/demo/networkgraph/
 *               Networkgraph
 * @since        7.0.0
 * @excluding    boostThreshold
 * @optionparent plotOptions.networkgraph
 */
seriesType('networkgraph', 'line', {
    lineWidth: 5,
    showInLegend: false,
    tooltip: {
        followPointer: true
    },
    clip: false,
    marker: {
        enabled: true
    },
    dataLabels: {
        enabled: true,
        format: '{key}'
    },
    animationLimit: 1,
    linkColor: 'rgba(100, 100, 100, 0.5)',
    linkWidth: 1,
    layoutAlgorithm: {
        type: 'reingold-fruchterman',
        maxIterations: 100,
        repulsiveForce: function (d, k) {
            /*
            basic, not recommended:
            return k / d;
            */

            /*
            standard:
            return k * k / d;
            */

            /*
            grid-variant:
            return k * k / d * (2 * k - d > 0 ? 1 : 0);
            */

            return k * k / d;
        },
        attractiveForce: function (d, k) {
            /*
            basic, not recommended:
            return d / k;
            */
            return d * d / k;
        }
    }
}, {
    drawGraph: null,
    isCartesian: false,
    requireSorting: false,
    directTouch: true,
    noSharedTooltip: true,
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    drawTracker: H.TrackerMixin.drawTrackerPoint,
    /**
     * Create a single node that holds information on incoming and outgoing
     * links.
     */
    createNode: function (id) {

        function findById(nodes, id) {
            return H.find(nodes, function (node) {
                return node.id === id;
            });
        }

        var node = findById(this.nodes, id),
            PointClass = this.pointClass,
            options;

        if (!node) {
            options = this.options.nodes && findById(this.options.nodes, id);
            node = (new PointClass()).init(
                this,
                extend({
                    className: 'highcharts-node',
                    isNode: true,
                    id: id,
                    y: 1 // Pass isNull test
                }, options)
            );
            node.linksTo = [];
            node.linksFrom = [];
            node.formatPrefix = 'node';
            node.name = node.name || node.id; // for use in formats

            this.nodes.push(node);
        }
        return node;
    },

    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     */
    generatePoints: function () {
        var nodeLookup = {},
            chart = this.chart;

        H.Series.prototype.generatePoints.call(this);

        if (!this.nodes) {
            this.nodes = []; // List of Point-like node items
        }
        this.colorCounter = 0;

        // Reset links from previous run
        this.nodes.forEach(function (node) {
            node.linksFrom.length = 0;
            node.linksTo.length = 0;
        });

        // Create the node list and set up links
        this.points.forEach(function (point) {
            if (defined(point.from)) {
                if (!nodeLookup[point.from]) {
                    nodeLookup[point.from] = this.createNode(point.from);
                }
                nodeLookup[point.from].linksFrom.push(point);
                point.fromNode = nodeLookup[point.from];

                // Point color defaults to the fromNode's color
                if (chart.styledMode) {
                    point.colorIndex = pick(
                        point.options.colorIndex,
                        nodeLookup[point.from].colorIndex
                    );
                } else {
                    point.color =
                        point.options.color || nodeLookup[point.from].color;
                }

            }
            if (defined(point.to)) {
                if (!nodeLookup[point.to]) {
                    nodeLookup[point.to] = this.createNode(point.to);
                }
                nodeLookup[point.to].linksTo.push(point);
                point.toNode = nodeLookup[point.to];
            }

            point.name = point.name || point.id; // for use in formats
        }, this);
    },

    /**
     * Run pre-translation by generating the nodeColumns.
     */
    translate: function () {
        if (!this.processedXData) {
            this.processData();
        }
        this.generatePoints();

        this.layout(
            this.nodes,
            this.points,
            this.options.layoutAlgorithm
        );

        this.nodes.forEach(function (node) {
            // Draw the links from this node
            node.isInside = true;
            node.linksFrom.forEach(function (point) {

                point.shapeType = 'path';

                // Pass test in drawPoints
                point.y = 1;
            });
        });
    },

    layout: function (nodes, links, layoutAlgorithm) {
        if (H.isFunction(layoutAlgorithm)) {
            layoutAlgorithm.apply(this, arguments);
        } else {
            this.layouts[layoutAlgorithm.type].apply(this, arguments);
        }
    },

    /**
     * Extend the render function to also render this.nodes together with
     * the points.
     */
    render: function () {
        var points = this.points;
        // Render markers:
        this.points = this.nodes;
        H.seriesTypes.line.prototype.render.call(this);
        this.points = points;

        points.forEach(function (point) {
            point.renderLink();
            point.redrawLink();
        });
    },

    layouts: {
        /**
        * Reingold-Fruchterman algorithm from
        * "Graph Drawing by Force-directed Placement" paper.
        */
        'reingold-fruchterman': function (nodes, links, options) {
            var series = this,
                utils = series.utils,
                chart = series.chart,
                nodesLength = nodes.length + 1,
                // Used in initial positions:
                sqrtNodesLength = Math.ceil(Math.sqrt(nodesLength)),
                // Optimal distance between nodes,
                // available space around the node:
                k = options.k ||
                    Math.pow(
                        chart.plotWidth * chart.plotHeight / nodesLength,
                        0.33
                    ),
                maxIterations = options.maxIterations,
                // Cooling system, temperature decreases to 0
                temperature = Math.sqrt(nodesLength),
                diffTemperature = temperature / (maxIterations + 1),
                // Fake object which will imitate animations
                mockAnimator = {
                    style: {}
                },
                start = +new Date(),
                fx;

            // Initial positions:
            nodes.forEach(
                function (node, index) {
                    var xPos = index / nodesLength,
                        yPos = (index % sqrtNodesLength) / sqrtNodesLength;

                    node.plotX = pick(node.plotX, chart.plotWidth * xPos);
                    node.plotY = pick(node.plotY, chart.plotHeight * yPos);

                    node.dispX = 0;
                    node.dispY = 0;
                }
            );

            // Render elements in initial positions:
            series.render();
            // Disable built-in animations:
            H.setAnimation(false, chart);

            // Algorithm:
            function localLayout() {
                // Repulsive forces:
                utils.applyRepulsiveForces.call(series, nodes, k);

                // Attractive forces:
                utils.applyAttractiveForces.call(series, links, k);

                // Limit to the plotting area and cool down:
                utils.applyLimits.call(
                    series,
                    nodes,
                    temperature,
                    {
                        left: 0,
                        top: 0,
                        width: chart.plotWidth,
                        height: chart.plotHeight
                    }
                );

                // Cool down:
                temperature -= diffTemperature;

                series.render();
                if (maxIterations--) {
                    fx.run(0, 1, 1);
                } else {
                    fx.stopped = true;
                    chart.setSubtitle({
                        text: 'Animated in: ' +
                            (new Date().getTime() - start) + 'ms'
                    });
                }
            }

            // Animate it:
            fx = new H.Fx(
                mockAnimator, {
                    duration: 1000 / maxIterations,
                    easing: function () {},
                    complete: localLayout,
                    curAnim: {}
                }
            );

            fx.run(0, 1, 1);
        }
    },
    utils: {
        applyRepulsiveForces: function (nodes, k) {
            var utils = this.utils,
                options = this.options.layoutAlgorithm;

            nodes.forEach(function (node) {
                nodes.forEach(function (repNode) {
                    var force,
                        distanceR,
                        distanceXY;

                    if (
                        // Node can not repulse itself:
                        node !== repNode &&
                        // Only close nodes affect each other:
                        utils.getDistR(node, repNode) < 2 * k
                    ) {
                        distanceXY = utils.getDistXY(node, repNode);
                        distanceR = utils.vectorLength(distanceXY);

                        force = options.repulsiveForce.call(
                            this, distanceR, k
                        );

                        node.dispX += (distanceXY.x / distanceR) * force;
                        node.dispY += (distanceXY.y / distanceR) * force;
                    }
                });
            });
        },
        applyAttractiveForces: function (links, k) {
            var utils = this.utils,
                options = this.options.layoutAlgorithm;

            links.forEach(function (link) {
                var distanceXY = utils.getDistXY(
                        link.fromNode,
                        link.toNode
                    ),
                    distanceR = utils.vectorLength(distanceXY),
                    force = options.attractiveForce.call(
                        this, distanceR, k
                    );

                link.fromNode.dispX -= (distanceXY.x / distanceR) * force;
                link.fromNode.dispY -= (distanceXY.y / distanceR) * force;

                link.toNode.dispX += (distanceXY.x / distanceR) * force;
                link.toNode.dispY += (distanceXY.y / distanceR) * force;
            });
        },
        applyLimits: function (nodes, temperature, box) {
            var utils = this.utils;

            nodes.forEach(function (node) {
                var distanceR = utils.vectorLength({
                    x: node.dispX,
                    y: node.dispY
                });

                // Place nodes:
                node.plotX += node.dispX / distanceR *
                    Math.min(Math.abs(node.dispX), temperature);
                node.plotY += node.dispY / distanceR *
                    Math.min(Math.abs(node.dispY), temperature);

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

            if (xDist === 0) {
                xDist = 0.01;
            }

            if (yDist === 0) {
                yDist = 0.01;
            }

            return {
                x: xDist,
                y: yDist,
                absX: Math.abs(xDist),
                absY: Math.abs(yDist)
            };
        }
    }
}, {
    // Links:
    renderLink: function () {
        if (!this.graphic) {
            this.graphic = this.series.chart.renderer
                .path(
                    this.getLinkPath(this.fromNode, this.toNode)
                )
                .attr({
                    'stroke-width': this.options.linkWidth ||
                        this.series.options.linkWidth,
                    stroke: this.options.linkColor ||
                        this.series.options.linkColor
                })
                .add(this.series.group);
        }
    },
    redrawLink: function () {
        if (this.graphic) {
            this.graphic.animate({
                d: this.getLinkPath(this.fromNode, this.toNode)
            });
        }
    },
    getLinkPath: function (from, to) {
        return [
            'M',
            from.plotX,
            from.plotY,
            'L',
            to.plotX,
            to.plotY
        ];

        /*
        IDEA: different link shapes?
        return [
            'M',
            from.plotX,
            from.plotY,
            'Q',
            (to.plotX + from.plotX) / 2,
            (to.plotY + from.plotY) / 2 + 15,
            to.plotX,
            to.plotY
        ];*/
    },
    // Default utils:
    destroy: function () {
        this.linksFrom.forEach(
            function (linkFrom) {
                linkFrom.graphic = linkFrom.graphic.destroy();
            }
        );

        return Point.destroy.apply(this, arguments);
    }
});


/**
 * A `networkgraph` series. If the [type](#series.networkgraph.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.networkgraph
 * @excluding boostThreshold
 * @product   highcharts
 * @apioption series.networkgraph
 */

/**
 * An array of data points for the series. For the `networkgraph` series type,
 * points can be given in the following way:
 *
 * An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of
 * data points exceeds the series'
 * [turboThreshold](#series.area.turboThreshold), this option is not available.
 *
 *  ```js
 *     data: [{
 *         from: 'Category1',
 *         to: 'Category2',
 *         weight: 2
 *     }, {
 *         from: 'Category1',
 *         to: 'Category3',
 *         weight: 5
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array|Number>}
 * @extends   series.line.data
 * @excluding drilldown,marker,x,y
 * @sample    {highcharts} highcharts/chart/reflow-true/
 *            Numerical values
 * @sample    {highcharts} highcharts/series/data-array-of-arrays/
 *            Arrays of numeric x and y
 * @sample    {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *            Arrays of datetime x and y
 * @sample    {highcharts} highcharts/series/data-array-of-name-value/
 *            Arrays of point.name and y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts
 * @apioption series.networkgraph.data
 */


/**
 * The node that the link runs from.
 *
 * @type      {String}
 * @product   highcharts
 * @apioption series.networkgraph.data.from
 */

/**
 * The node that the link runs to.
 *
 * @type      {String}
 * @product   highcharts
 * @apioption series.networkgraph.data.to
 */

/**
 * The weight of the link.
 *
 * @type      {Number}
 * @product   highcharts
 * @apioption series.networkgraph.data.weight
 */
