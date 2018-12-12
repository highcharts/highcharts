/**
 * Networkgraph series
 *
 * (c) 2010-2018 Paweł Fus
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';
import '../../parts/Options.js';
import '../../mixins/nodes.js';
import '/layouts.js';

var addEvent = H.addEvent,
    defined = H.defined,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    pick = H.pick,
    Chart = H.Chart,
    Point = H.Point,
    Series = H.Series;

/**
 * A networkgraph is a type of relationship chart, where connnections
 * (links) attracts nodes (points) and other nodes repulse each other.
 *
 * @extends      plotOptions.line
 * @product      highcharts
 * @sample       highcharts/demo/network-graph/
 *               Networkgraph
 * @since        7.0.0
 * @excluding    boostThreshold, animation, animationLimit, connectEnds,
 *               connectNulls, dragDrop, getExtremesFromAll, label, linecap,
 *               negativeColor, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointStart, softThreshold, stack, stacking,
 *               step, threshold, xAxis, yAxis, zoneAxis
 * @optionparent plotOptions.networkgraph
 */
seriesType('networkgraph', 'line', {
    marker: {
        enabled: true
    },
    dataLabels: {
        format: '{key}'
    },
    /**
     * Link style options
     */
    link: {
        /**
         * A name for the dash style to use for links.
         *
         * @type      {String}
         * @apioption plotOptions.networkgraph.link.dashStyle
         * @defaults  undefined
         */

        /**
         * Color of the link between two nodes.
         */
        color: 'rgba(100, 100, 100, 0.5)',
        /**
         * Width (px) of the link between two nodes.
         */
        width: 1
    },
    /**
     * Flag to determine if nodes are draggable or not.
     */
    draggable: true,
    layoutAlgorithm: {
        /**
         * Ideal length (px) of the link between two nodes. When not defined,
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
         * built-in options ("circle", "random") or a function where positions
         * should be set on each node (`this.nodes`) as `node.plotX` and
         * `node.plotY`
         *
         * @sample      highcharts/series-networkgraph/initial-positions/
         *              Initial positions with callback
         * @type        {String|Function}
         * @validvalue  ["circle", "random"]
         */
        initialPositions: 'circle',
        /**
         * Experimental. Enables live simulation of the algorithm
         * implementation. All nodes are animated as the forces applies on
         * them.
         *
         * @sample       highcharts/demo/network-graph/
         *               Live simulation enabled
         */
        enableSimulation: false,
        /**
         * Type of the algorithm used when positioning nodes.
         *
         * @validvalue  ["reingold-fruchterman"]
         */
        type: 'reingold-fruchterman',
        /**
         * Max number of iterations before algorithm will stop. In general,
         * algorithm should find positions sooner, but when rendering huge
         * number of nodes, it is recommended to increase this value as
         * finding perfect graph positions can require more time.
         */
        maxIterations: 1000,
        /**
         * Gravitational const used in the barycenter force of the algorithm.
         *
         * @sample      highcharts/series-networkgraph/forces/
         *              Custom forces
         */
        gravitationalConstant: 0.0625,
        /**
         * Friction applied on forces to prevent nodes rushing to fast to the
         * desired positions.
         */
        friction: -0.981,
        /**
         * Repulsive force applied on a node. Passed are two arguments:
         * - `d` - which is current distance between two nodes
         * - `k` - which is desired distance between two nodes
         *
         * @sample      highcharts/series-networkgraph/forces/
         *              Custom forces
         * @type        {Function}
         * @default function (d, k) { return k * k / d; }
         */
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
        /**
         * Attraction force applied on a node which is conected to another node
         * by a link. Passed are two arguments:
         * - `d` - which is current distance between two nodes
         * - `k` - which is desired distance between two nodes
         *
         * @sample      highcharts/series-networkgraph/forces/
         *              Custom forces
         * @type        {Function}
         * @default function (d, k) { return k * k / d; }
         */
        attractiveForce: function (d, k) {
            /*
            basic, not recommended:
            return d / k;
            */
            return d * d / k;
        }
    },
    showInLegend: false
}, {
    isNetworkgraph: true,
    drawGraph: null,
    isCartesian: false,
    requireSorting: false,
    directTouch: true,
    noSharedTooltip: true,
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    drawTracker: H.TrackerMixin.drawTrackerPoint,
    // Animation is run in `series.simulation`.
    animate: null,
    /**
     * Create a single node that holds information on incoming and outgoing
     * links.
     */
    createNode: H.NodesMixin.createNode,

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


        if (this.options.nodes) {
            this.options.nodes.forEach(
                function (nodeOptions) {
                    if (!nodeLookup[nodeOptions.id]) {
                        nodeLookup[nodeOptions.id] = this
                            .createNode(nodeOptions.id);
                    }
                },
                this
            );
        }
    },

    /**
     * Run pre-translation by generating the nodeColumns.
     */
    translate: function () {
        if (!this.processedXData) {
            this.processData();
        }
        this.generatePoints();

        this.deferLayout();

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

    deferLayout: function () {
        var layoutOptions = this.options.layoutAlgorithm,
            graphLayoutsStorage = this.chart.graphLayoutsStorage,
            chartOptions = this.chart.options.chart,
            layout;

        if (!this.visible) {
            return;
        }

        if (!graphLayoutsStorage) {
            this.chart.graphLayoutsStorage = graphLayoutsStorage = {};
        }

        layout = graphLayoutsStorage[layoutOptions.type];

        if (!layout) {
            layoutOptions.enableSimulation = !defined(chartOptions.forExport) ?
                layoutOptions.enableSimulation :
                !chartOptions.forExport;

            graphLayoutsStorage[layoutOptions.type] = layout =
                new H.layouts[layoutOptions.type](layoutOptions);
        }

        this.layout = layout;

        layout.setArea(0, 0, this.chart.plotWidth, this.chart.plotHeight);
        layout.addSeries(this);
        layout.addNodes(this.nodes);
        layout.addLinks(this.points);
    },

    /**
     * Extend the render function to also render this.nodes together with
     * the points.
     */
    render: function () {
        var points = this.points,
            hoverPoint = this.chart.hoverPoint,
            dataLabels = [];

        // Render markers:
        this.points = this.nodes;
        seriesTypes.line.prototype.render.call(this);
        this.points = points;

        points.forEach(function (point) {
            point.renderLink();
            point.redrawLink();
        });

        if (hoverPoint && hoverPoint.series === this) {
            this.redrawHalo(hoverPoint);
        }

        this.nodes.forEach(function (node) {
            if (node.dataLabel) {
                dataLabels.push(node.dataLabel);
            }
        });
        H.Chart.prototype.hideOverlappingLabels(dataLabels);
    },

    /*
     * Draggable mode:
     */
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
    },
    onMouseMove: function (point, event) {
        if (point.fixedPosition) {
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
        if (point.fixedPosition) {
            this.layout.run();
            delete point.fixedPosition;
        }
    },
    destroy: function () {
        this.nodes.forEach(function (node) {
            node.destroy();
        });
        return Series.prototype.destroy.apply(this, arguments);
    }
}, {
    getDegree: function () {
        var deg = this.isNode ? this.linksFrom.length + this.linksTo.length : 0;
        return deg === 0 ? 1 : deg;
    },
    // Links:
    getLinkAttribues: function () {
        var linkOptions = this.series.options.link;

        return {
            'stroke-width': linkOptions.width,
            stroke: linkOptions.color,
            dashstyle: linkOptions.dashStyle
        };
    },
    renderLink: function () {
        if (!this.graphic) {
            this.graphic = this.series.chart.renderer
                .path(
                    this.getLinkPath(this.fromNode, this.toNode)
                )
                .attr(this.getLinkAttribues())
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
        if (this.isNode) {
            this.linksFrom.forEach(
                function (linkFrom) {
                    if (linkFrom.graphic) {
                        linkFrom.graphic = linkFrom.graphic.destroy();
                    }
                }
            );
        }

        return Point.prototype.destroy.apply(this, arguments);
    }
});

addEvent(seriesTypes.networkgraph, 'updatedData', function () {
    if (this.layout) {
        this.layout.stop();
    }
});

addEvent(seriesTypes.networkgraph.prototype.pointClass, 'remove', function () {
    if (this.isNode && this.series.layout) {
        this.series.layout.removeNode(this);
    } else {
        this.series.layout.removeLink(this);
    }
});

/*
 * Multiple series support:
 */
// Clear previous layouts
addEvent(Chart, 'predraw', function () {
    if (this.graphLayoutsStorage) {
        H.objectEach(
            this.graphLayoutsStorage,
            function (layout) {
                layout.stop();
            }
        );
    }
});
addEvent(Chart, 'render', function () {
    if (this.graphLayoutsStorage) {
        H.setAnimation(false, this);
        H.objectEach(
            this.graphLayoutsStorage,
            function (layout) {
                layout.run();
            }
        );
    }
});

/*
 * Draggable mode:
 */
addEvent(
    seriesTypes.networkgraph.prototype.pointClass,
    'mouseOver',
    function () {
        H.css(this.series.chart.container, { cursor: 'move' });
    }
);
addEvent(
    seriesTypes.networkgraph.prototype.pointClass,
    'mouseOut',
    function () {
        H.css(this.series.chart.container, { cursor: 'default' });
    }
);
addEvent(
    Chart,
    'load',
    function () {
        var chart = this,
            unbinders = [];

        unbinders.push(
            addEvent(
                chart.container,
                'mousedown',
                function (event) {
                    var point = chart.hoverPoint;

                    if (
                        point &&
                        point.series &&
                        point.series.isNetworkgraph &&
                        point.series.options.draggable
                    ) {
                        point.series.onMouseDown(point, event);
                        unbinders.push(
                             addEvent(
                                chart.container,
                                'mousemove',
                                function (e) {
                                    return point.series.onMouseMove(point, e);
                                }
                            )
                        );
                        unbinders.push(
                             addEvent(
                                chart.container.ownerDocument,
                                'mouseup',
                                function (e) {
                                    return point.series.onMouseUp(point, e);
                                }
                            )
                        );
                    }
                }
            )
        );

        addEvent(chart, 'destroy', function () {
            unbinders.forEach(function (unbind) {
                unbind();
            });
        });
    }
);

/**
 * A `networkgraph` series. If the [type](#series.networkgraph.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.networkgraph
 * @excluding boostThreshold, animation, animationLimit, connectEnds,
 *            connectNulls, dragDrop, getExtremesFromAll, label, linecap,
 *            negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking,
 *            step, threshold, xAxis, yAxis, zoneAxis
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
 *         to: 'Category2'
 *     }, {
 *         from: 'Category1',
 *         to: 'Category3'
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array|Number>}
 * @extends   series.line.data
 * @excluding drilldown,marker,x,y,draDrop
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
