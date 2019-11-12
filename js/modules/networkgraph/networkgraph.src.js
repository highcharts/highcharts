/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2019 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../parts/Globals.js';
/**
 * Formatter callback function.
 *
 * @callback Highcharts.SeriesNetworkgraphDataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.SeriesNetworkgraphDataLabelsFormatterContextObject|Highcharts.DataLabelsFormatterContextObject} this
 *        Data label context to format
 *
 * @return {string}
 *         Formatted data label text
 */
/**
 * Context for the formatter function.
 *
 * @interface Highcharts.SeriesNetworkgraphDataLabelsFormatterContextObject
 * @extends Highcharts.DataLabelsFormatterContextObject
 * @since 7.0.0
 */ /**
* The color of the node.
* @name Highcharts.SeriesNetworkgraphDataLabelsFormatterContextObject#color
* @type {Highcharts.ColorString}
* @since 7.0.0
*/ /**
* The point (node) object. The node name, if defined, is available through
* `this.point.name`. Arrays: `this.point.linksFrom` and `this.point.linksTo`
* contains all nodes connected to this point.
* @name Highcharts.SeriesNetworkgraphDataLabelsFormatterContextObject#point
* @type {Highcharts.Point}
* @since 7.0.0
*/ /**
* The ID of the node.
* @name Highcharts.SeriesNetworkgraphDataLabelsFormatterContextObject#key
* @type {string}
* @since 7.0.0
*/
import U from '../../parts/Utilities.js';
var defined = U.defined, pick = U.pick;
import '../../parts/Options.js';
import '../../mixins/nodes.js';
import './layouts.js';
import './draggable-nodes.js';
var addEvent = H.addEvent, seriesType = H.seriesType, seriesTypes = H.seriesTypes, Point = H.Point, Series = H.Series, dragNodesMixin = H.dragNodesMixin;
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.networkgraph
 *
 * @extends Highcharts.Series
 */
seriesType('networkgraph', 'line', 
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
 *               colorAxis, colorKey, connectNulls, dragDrop,
 *               getExtremesFromAll, label, linecap, negativeColor,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointStart, softThreshold, stack, stacking, step,
 *               threshold, xAxis, yAxis, zoneAxis
 * @requires     modules/networkgraph
 * @optionparent plotOptions.networkgraph
 */
{
    stickyTracking: false,
    /**
     * @ignore-option
     * @private
     */
    inactiveOtherPoints: true,
    marker: {
        enabled: true,
        states: {
            /**
             * The opposite state of a hover for a single point node.
             * Applied to all not connected nodes to the hovered one.
             *
             * @declare Highcharts.PointStatesInactiveOptionsObject
             */
            inactive: {
                /**
                 * Opacity of inactive markers.
                 */
                opacity: 0.3,
                /**
                 * Animation when not hovering over the node.
                 *
                 * @type {boolean|Highcharts.AnimationOptionsObject}
                 */
                animation: {
                    /** @internal */
                    duration: 50
                }
            }
        }
    },
    states: {
        /**
         * The opposite state of a hover for a single point link. Applied
         * to all links that are not comming from the hovered node.
         *
         * @declare Highcharts.SeriesStatesInactiveOptionsObject
         */
        inactive: {
            /**
             * Opacity of inactive links.
             */
            linkOpacity: 0.3,
            /**
             * Animation when not hovering over the node.
             *
             * @type {boolean|Highcharts.AnimationOptionsObject}
             */
            animation: {
                /** @internal */
                duration: 50
            }
        }
    },
    /**
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Networkgraph with labels on links
     * @sample highcharts/series-networkgraph/textpath-datalabels
     *         Networkgraph with labels around nodes
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Data labels moved into the nodes
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Data labels moved under the links
     *
     * @declare Highcharts.SeriesNetworkgraphDataLabelsOptionsObject
     *
     * @private
     */
    dataLabels: {
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _node_ in the networkgraph. In v7.0
         * defaults to `{key}`, since v7.1 defaults to `undefined` and
         * `formatter` is used instead.
         *
         * @type      {string}
         * @since     7.0.0
         * @apioption plotOptions.networkgraph.dataLabels.format
         */
        // eslint-disable-next-line valid-jsdoc
        /**
         * Callback JavaScript function to format the data label for a node.
         * Note that if a `format` is defined, the format takes precedence
         * and the formatter is ignored.
         *
         * @type  {Highcharts.SeriesNetworkgraphDataLabelsFormatterCallbackFunction}
         * @since 7.0.0
         */
        formatter: function () {
            return this.key;
        },
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _links_ in the networkgraph.
         * (Default: `undefined`)
         *
         * @type      {string}
         * @since     7.1.0
         * @apioption plotOptions.networkgraph.dataLabels.linkFormat
         */
        // eslint-disable-next-line valid-jsdoc
        /**
         * Callback to format data labels for _links_ in the sankey diagram.
         * The `linkFormat` option takes precedence over the
         * `linkFormatter`.
         *
         * @type  {Highcharts.SeriesNetworkgraphDataLabelsFormatterCallbackFunction}
         * @since 7.1.0
         */
        linkFormatter: function () {
            return (this.point.fromNode.name +
                '<br>' +
                this.point.toNode.name);
        },
        /**
         * Options for a _link_ label text which should follow link
         * connection. Border and background are disabled for a label that
         * follows a path.
         *
         * **Note:** Only SVG-based renderer supports this option. Setting
         * `useHTML` to true will disable this option.
         *
         * @extends plotOptions.networkgraph.dataLabels.textPath
         * @since   7.1.0
         */
        linkTextPath: {
            enabled: true
        },
        textPath: {
            enabled: false
        }
    },
    /**
     * Link style options
     * @private
     */
    link: {
        /**
         * A name for the dash style to use for links.
         *
         * @type      {string}
         * @apioption plotOptions.networkgraph.link.dashStyle
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
     * @private
     */
    draggable: true,
    layoutAlgorithm: {
        /**
         * Repulsive force applied on a node. Passed are two arguments:
         * - `d` - which is current distance between two nodes
         * - `k` - which is desired distance between two nodes
         *
         * In `verlet` integration, defaults to:
         * `function (d, k) { return (k - d) / d * (k > d ? 1 : 0) }`
         *
         * @see [layoutAlgorithm.integration](#series.networkgraph.layoutAlgorithm.integration)
         *
         * @sample highcharts/series-networkgraph/forces/
         *         Custom forces with Euler integration
         * @sample highcharts/series-networkgraph/cuboids/
         *         Custom forces with Verlet integration
         *
         * @type      {Function}
         * @default   function (d, k) { return k * k / d; }
         * @apioption plotOptions.networkgraph.layoutAlgorithm.repulsiveForce
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
         * @see [layoutAlgorithm.integration](#series.networkgraph.layoutAlgorithm.integration)
         *
         * @sample highcharts/series-networkgraph/forces/
         *         Custom forces with Euler integration
         * @sample highcharts/series-networkgraph/cuboids/
         *         Custom forces with Verlet integration
         *
         * @type      {Function}
         * @default   function (d, k) { return k * k / d; }
         * @apioption plotOptions.networkgraph.layoutAlgorithm.attractiveForce
         */
        /**
         * Ideal length (px) of the link between two nodes. When not
         * defined, length is calculated as:
         * `Math.pow(availableWidth * availableHeight / nodesLength, 0.4);`
         *
         * Note: Because of the algorithm specification, length of each link
         * might be not exactly as specified.
         *
         * @sample highcharts/series-networkgraph/styled-links/
         *         Numerical values
         *
         * @type      {number}
         * @apioption plotOptions.networkgraph.layoutAlgorithm.linkLength
         */
        /**
         * Initial layout algorithm for positioning nodes. Can be one of
         * built-in options ("circle", "random") or a function where
         * positions should be set on each node (`this.nodes`) as
         * `node.plotX` and `node.plotY`
         *
         * @sample highcharts/series-networkgraph/initial-positions/
         *         Initial positions with callback
         *
         * @type {"circle"|"random"|Function}
         */
        initialPositions: 'circle',
        /**
         * When `initialPositions` are set to 'circle',
         * `initialPositionRadius` is a distance from the center of circle,
         * in which nodes are created.
         *
         * @type    {number}
         * @default 1
         * @since   7.1.0
         */
        initialPositionRadius: 1,
        /**
         * Experimental. Enables live simulation of the algorithm
         * implementation. All nodes are animated as the forces applies on
         * them.
         *
         * @sample highcharts/demo/network-graph/
         *         Live simulation enabled
         */
        enableSimulation: false,
        /**
         * Barnes-Hut approximation only.
         * Deteremines when distance between cell and node is small enough
         * to caculate forces. Value of `theta` is compared directly with
         * quotient `s / d`, where `s` is the size of the cell, and `d` is
         * distance between center of cell's mass and currently compared
         * node.
         *
         * @see [layoutAlgorithm.approximation](#series.networkgraph.layoutAlgorithm.approximation)
         *
         * @since 7.1.0
         */
        theta: 0.5,
        /**
         * Verlet integration only.
         * Max speed that node can get in one iteration. In terms of
         * simulation, it's a maximum translation (in pixels) that node can
         * move (in both, x and y, dimensions). While `friction` is applied
         * on all nodes, max speed is applied only for nodes that move very
         * fast, for example small or disconnected ones.
         *
         * @see [layoutAlgorithm.integration](#series.networkgraph.layoutAlgorithm.integration)
         * @see [layoutAlgorithm.friction](#series.networkgraph.layoutAlgorithm.friction)
         *
         * @since 7.1.0
         */
        maxSpeed: 10,
        /**
         * Approximation used to calculate repulsive forces affecting nodes.
         * By default, when calculateing net force, nodes are compared
         * against each other, which gives O(N^2) complexity. Using
         * Barnes-Hut approximation, we decrease this to O(N log N), but the
         * resulting graph will have different layout. Barnes-Hut
         * approximation divides space into rectangles via quad tree, where
         * forces exerted on nodes are calculated directly for nearby cells,
         * and for all others, cells are treated as a separate node with
         * center of mass.
         *
         * @see [layoutAlgorithm.theta](#series.networkgraph.layoutAlgorithm.theta)
         *
         * @sample highcharts/series-networkgraph/barnes-hut-approximation/
         *         A graph with Barnes-Hut approximation
         *
         * @type       {string}
         * @validvalue ["barnes-hut", "none"]
         * @since      7.1.0
         */
        approximation: 'none',
        /**
         * Type of the algorithm used when positioning nodes.
         *
         * @type       {string}
         * @validvalue ["reingold-fruchterman"]
         */
        type: 'reingold-fruchterman',
        /**
         * Integration type. Available options are `'euler'` and `'verlet'`.
         * Integration determines how forces are applied on particles. In
         * Euler integration, force is applied direct as
         * `newPosition += velocity;`.
         * In Verlet integration, new position is based on a previous
         * posittion without velocity:
         * `newPosition += previousPosition - newPosition`.
         *
         * Note that different integrations give different results as forces
         * are different.
         *
         * In Highcharts v7.0.x only `'euler'` integration was supported.
         *
         * @sample highcharts/series-networkgraph/integration-comparison/
         *         Comparison of Verlet and Euler integrations
         *
         * @type       {string}
         * @validvalue ["euler", "verlet"]
         * @since      7.1.0
         */
        integration: 'euler',
        /**
         * Max number of iterations before algorithm will stop. In general,
         * algorithm should find positions sooner, but when rendering huge
         * number of nodes, it is recommended to increase this value as
         * finding perfect graph positions can require more time.
         */
        maxIterations: 1000,
        /**
         * Gravitational const used in the barycenter force of the
         * algorithm.
         *
         * @sample highcharts/series-networkgraph/forces/
         *         Custom forces with Euler integration
         */
        gravitationalConstant: 0.0625,
        /**
         * Friction applied on forces to prevent nodes rushing to fast to
         * the desired positions.
         */
        friction: -0.981
    },
    showInLegend: false
}, {
    /**
     * Array of internal forces. Each force should be later defined in
     * integrations.js.
     * @private
     */
    forces: ['barycenter', 'repulsive', 'attractive'],
    hasDraggableNodes: true,
    drawGraph: null,
    isCartesian: false,
    requireSorting: false,
    directTouch: true,
    noSharedTooltip: true,
    pointArrayMap: ['from', 'to'],
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    drawTracker: H.TrackerMixin.drawTrackerPoint,
    // Animation is run in `series.simulation`.
    animate: null,
    buildKDTree: H.noop,
    /**
     * Create a single node that holds information on incoming and outgoing
     * links.
     * @private
     */
    createNode: H.NodesMixin.createNode,
    destroy: function () {
        this.layout.removeElementFromCollection(this, this.layout.series);
        H.NodesMixin.destroy.call(this);
    },
    /* eslint-disable no-invalid-this, valid-jsdoc */
    /**
     * Extend init with base event, which should stop simulation during
     * update. After data is updated, `chart.render` resumes the simulation.
     * @private
     */
    init: function () {
        Series.prototype.init.apply(this, arguments);
        addEvent(this, 'updatedData', function () {
            if (this.layout) {
                this.layout.stop();
            }
        });
        return this;
    },
    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     * @private
     */
    generatePoints: function () {
        var node, i;
        H.NodesMixin.generatePoints.apply(this, arguments);
        // In networkgraph, it's fine to define stanalone nodes, create
        // them:
        if (this.options.nodes) {
            this.options.nodes.forEach(function (nodeOptions) {
                if (!this.nodeLookup[nodeOptions.id]) {
                    this.nodeLookup[nodeOptions.id] =
                        this.createNode(nodeOptions.id);
                }
            }, this);
        }
        for (i = this.nodes.length - 1; i >= 0; i--) {
            node = this.nodes[i];
            node.degree = node.getDegree();
            node.radius = pick(node.marker && node.marker.radius, this.options.marker && this.options.marker.radius, 0);
            // If node exists, but it's not available in nodeLookup,
            // then it's leftover from previous runs (e.g. setData)
            if (!this.nodeLookup[node.id]) {
                node.remove();
            }
        }
        this.data.forEach(function (link) {
            link.formatPrefix = 'link';
        });
        this.indexateNodes();
    },
    /**
     * Set index for each node. Required for proper `node.update()`.
     * Note that links are indexated out of the box in `generatePoints()`.
     *
     * @private
     */
    indexateNodes: function () {
        this.nodes.forEach(function (node, index) {
            node.index = index;
        });
    },
    /**
     * Extend the default marker attribs by using a non-rounded X position,
     * otherwise the nodes will jump from pixel to pixel which looks a bit
     * jaggy when approaching equilibrium.
     * @private
     */
    markerAttribs: function (point, state) {
        var attribs = Series.prototype.markerAttribs.call(this, point, state);
        // series.render() is called before initial positions are set:
        if (!defined(point.plotY)) {
            attribs.y = 0;
        }
        attribs.x = (point.plotX || 0) - (attribs.width / 2 || 0);
        return attribs;
    },
    /**
     * Run pre-translation and register nodes&links to the deffered layout.
     * @private
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
    /**
     * Defer the layout.
     * Each series first registers all nodes and links, then layout
     * calculates all nodes positions and calls `series.render()` in every
     * simulation step.
     *
     * Note:
     * Animation is done through `requestAnimationFrame` directly, without
     * `Highcharts.animate()` use.
     * @private
     */
    deferLayout: function () {
        var layoutOptions = this.options.layoutAlgorithm, graphLayoutsStorage = this.chart.graphLayoutsStorage, graphLayoutsLookup = this.chart.graphLayoutsLookup, chartOptions = this.chart.options.chart, layout;
        if (!this.visible) {
            return;
        }
        if (!graphLayoutsStorage) {
            this.chart.graphLayoutsStorage = graphLayoutsStorage = {};
            this.chart.graphLayoutsLookup = graphLayoutsLookup = [];
        }
        layout = graphLayoutsStorage[layoutOptions.type];
        if (!layout) {
            layoutOptions.enableSimulation =
                !defined(chartOptions.forExport) ?
                    layoutOptions.enableSimulation :
                    !chartOptions.forExport;
            graphLayoutsStorage[layoutOptions.type] = layout =
                new H.layouts[layoutOptions.type]();
            layout.init(layoutOptions);
            graphLayoutsLookup.splice(layout.index, 0, layout);
        }
        this.layout = layout;
        layout.setArea(0, 0, this.chart.plotWidth, this.chart.plotHeight);
        layout.addElementsToCollection([this], layout.series);
        layout.addElementsToCollection(this.nodes, layout.nodes);
        layout.addElementsToCollection(this.points, layout.links);
    },
    /**
     * Extend the render function to also render this.nodes together with
     * the points.
     * @private
     */
    render: function () {
        var points = this.points, hoverPoint = this.chart.hoverPoint, dataLabels = [];
        // Render markers:
        this.points = this.nodes;
        seriesTypes.line.prototype.render.call(this);
        this.points = points;
        points.forEach(function (point) {
            if (point.fromNode && point.toNode) {
                point.renderLink();
                point.redrawLink();
            }
        });
        if (hoverPoint && hoverPoint.series === this) {
            this.redrawHalo(hoverPoint);
        }
        if (this.chart.hasRendered &&
            !this.options.dataLabels.allowOverlap) {
            this.nodes.concat(this.points).forEach(function (node) {
                if (node.dataLabel) {
                    dataLabels.push(node.dataLabel);
                }
            });
            this.chart.hideOverlappingLabels(dataLabels);
        }
    },
    // Networkgraph has two separate collecions of nodes and lines, render
    // dataLabels for both sets:
    drawDataLabels: function () {
        var textPath = this.options.dataLabels.textPath;
        // Render node labels:
        Series.prototype.drawDataLabels.apply(this, arguments);
        // Render link labels:
        this.points = this.data;
        this.options.dataLabels.textPath =
            this.options.dataLabels.linkTextPath;
        Series.prototype.drawDataLabels.apply(this, arguments);
        // Restore nodes
        this.points = this.nodes;
        this.options.dataLabels.textPath = textPath;
    },
    // Return the presentational attributes.
    pointAttribs: function (point, state) {
        // By default, only `selected` state is passed on
        var pointState = state || point.state || 'normal', attribs = Series.prototype.pointAttribs.call(this, point, pointState), stateOptions = this.options.states[pointState];
        if (!point.isNode) {
            attribs = point.getLinkAttributes();
            // For link, get prefixed names:
            if (stateOptions) {
                attribs = {
                    // TO DO: API?
                    stroke: stateOptions.linkColor || attribs.stroke,
                    dashstyle: (stateOptions.linkDashStyle || attribs.dashstyle),
                    opacity: pick(stateOptions.linkOpacity, attribs.opacity),
                    'stroke-width': stateOptions.linkColor ||
                        attribs['stroke-width']
                };
            }
        }
        return attribs;
    },
    // Draggable mode:
    /**
     * Redraw halo on mousemove during the drag&drop action.
     * @private
     * @param {Highcharts.Point} point The point that should show halo.
     */
    redrawHalo: dragNodesMixin.redrawHalo,
    /**
     * Mouse down action, initializing drag&drop mode.
     * @private
     * @param {global.Event} event Browser event, before normalization.
     * @param {Highcharts.Point} point The point that event occured.
     */
    onMouseDown: dragNodesMixin.onMouseDown,
    /**
     * Mouse move action during drag&drop.
     * @private
     * @param {global.Event} event Browser event, before normalization.
     * @param {Highcharts.Point} point The point that event occured.
     */
    onMouseMove: dragNodesMixin.onMouseMove,
    /**
     * Mouse up action, finalizing drag&drop.
     * @private
     * @param {Highcharts.Point} point The point that event occured.
     */
    onMouseUp: dragNodesMixin.onMouseUp,
    /**
     * When state should be passed down to all points, concat nodes and
     * links and apply this state to all of them.
     * @private
     */
    setState: function (state, inherit) {
        if (inherit) {
            this.points = this.nodes.concat(this.data);
            Series.prototype.setState.apply(this, arguments);
            this.points = this.data;
        }
        else {
            Series.prototype.setState.apply(this, arguments);
        }
        // If simulation is done, re-render points with new states:
        if (!this.layout.simulation && !state) {
            this.render();
        }
    }
}, {
    setState: H.NodesMixin.setNodeState,
    /**
     * Basic `point.init()` and additional styles applied when
     * `series.draggable` is enabled.
     * @private
     */
    init: function () {
        Point.prototype.init.apply(this, arguments);
        if (this.series.options.draggable &&
            !this.series.chart.styledMode) {
            addEvent(this, 'mouseOver', function () {
                H.css(this.series.chart.container, { cursor: 'move' });
            });
            addEvent(this, 'mouseOut', function () {
                H.css(this.series.chart.container, { cursor: 'default' });
            });
        }
        return this;
    },
    /**
     * Return degree of a node. If node has no connections, it still has
     * deg=1.
     * @private
     * @return {number}
     */
    getDegree: function () {
        var deg = this.isNode ?
            this.linksFrom.length + this.linksTo.length :
            0;
        return deg === 0 ? 1 : deg;
    },
    // Links:
    /**
     * Get presentational attributes of link connecting two nodes.
     * @private
     * @return {Highcharts.SVGAttributes}
     */
    getLinkAttributes: function () {
        var linkOptions = this.series.options.link, pointOptions = this.options;
        return {
            'stroke-width': pick(pointOptions.width, linkOptions.width),
            stroke: (pointOptions.color || linkOptions.color),
            dashstyle: (pointOptions.dashStyle || linkOptions.dashStyle),
            opacity: pick(pointOptions.opacity, linkOptions.opacity, 1)
        };
    },
    /**
     * Render link and add it to the DOM.
     * @private
     */
    renderLink: function () {
        var attribs;
        if (!this.graphic) {
            this.graphic = this.series.chart.renderer
                .path(this.getLinkPath())
                .add(this.series.group);
            if (!this.series.chart.styledMode) {
                attribs = this.series.pointAttribs(this);
                this.graphic.attr(attribs);
                (this.dataLabels || []).forEach(function (label) {
                    if (label) {
                        label.attr({
                            opacity: attribs.opacity
                        });
                    }
                });
            }
        }
    },
    /**
     * Redraw link's path.
     * @private
     */
    redrawLink: function () {
        var path = this.getLinkPath(), attribs;
        if (this.graphic) {
            this.shapeArgs = {
                d: path
            };
            if (!this.series.chart.styledMode) {
                attribs = this.series.pointAttribs(this);
                this.graphic.attr(attribs);
                (this.dataLabels || []).forEach(function (label) {
                    if (label) {
                        label.attr({
                            opacity: attribs.opacity
                        });
                    }
                });
            }
            this.graphic.animate(this.shapeArgs);
            // Required for dataLabels:
            this.plotX = (path[1] + path[4]) / 2;
            this.plotY = (path[2] + path[5]) / 2;
        }
    },
    /**
     * Get mass fraction applied on two nodes connected to each other. By
     * default, when mass is equal to `1`, mass fraction for both nodes
     * equal to 0.5.
     * @private
     * @return {Highcharts.Dictionary<number>}
     *         For example `{ fromNode: 0.5, toNode: 0.5 }`
     */
    getMass: function () {
        var m1 = this.fromNode.mass, m2 = this.toNode.mass, sum = m1 + m2;
        return {
            fromNode: 1 - m1 / sum,
            toNode: 1 - m2 / sum
        };
    },
    /**
     * Get link path connecting two nodes.
     * @private
     * @return {Array<Highcharts.SVGPathArray>}
     *         Path: `['M', x, y, 'L', x, y]`
     */
    getLinkPath: function () {
        var left = this.fromNode, right = this.toNode;
        // Start always from left to the right node, to prevent rendering
        // labels upside down
        if (left.plotX > right.plotX) {
            left = this.toNode;
            right = this.fromNode;
        }
        return [
            'M',
            left.plotX,
            left.plotY,
            'L',
            right.plotX,
            right.plotY
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
    isValid: function () {
        return !this.isNode || defined(this.id);
    },
    /**
     * Common method for removing points and nodes in networkgraph. To
     * remove `link`, use `series.data[index].remove()`. To remove `node`
     * with all connections, use `series.nodes[index].remove()`.
     * @private
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call. When
     *        doing more operations on the chart, for example running
     *        `point.remove()` in a loop, it is best practice to set
     *        `redraw` to false and call `chart.redraw()` after.
     * @param {boolean|Highcharts.AnimationOptionsObject} [animation=false]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     * @return {void}
     */
    remove: function (redraw, animation) {
        var point = this, series = point.series, nodesOptions = series.options.nodes || [], index, i = nodesOptions.length;
        // For nodes, remove all connected links:
        if (point.isNode) {
            // Temporary disable series.points array, because
            // Series.removePoint() modifies it
            series.points = [];
            // Remove link from all nodes collections:
            []
                .concat(point.linksFrom)
                .concat(point.linksTo)
                .forEach(function (linkFromTo) {
                // Incoming links
                index = linkFromTo.fromNode.linksFrom.indexOf(linkFromTo);
                if (index > -1) {
                    linkFromTo.fromNode.linksFrom.splice(index, 1);
                }
                // Outcoming links
                index = linkFromTo.toNode.linksTo.indexOf(linkFromTo);
                if (index > -1) {
                    linkFromTo.toNode.linksTo.splice(index, 1);
                }
                // Remove link from data/points collections
                Series.prototype.removePoint.call(series, series.data.indexOf(linkFromTo), false, false);
            });
            // Restore points array, after links are removed
            series.points = series.data.slice();
            // Proceed with removing node. It's similar to
            // Series.removePoint() method, but doesn't modify other arrays
            series.nodes.splice(series.nodes.indexOf(point), 1);
            // Remove node options from config
            while (i--) {
                if (nodesOptions[i].id === point.options.id) {
                    series.options.nodes.splice(i, 1);
                    break;
                }
            }
            if (point) {
                point.destroy();
            }
            // Run redraw if requested
            series.isDirty = true;
            series.isDirtyData = true;
            if (redraw) {
                series.chart.redraw(redraw);
            }
        }
        else {
            series.removePoint(series.data.indexOf(point), redraw, animation);
        }
    },
    /**
     * Destroy point. If it's a node, remove all links coming out of this
     * node. Then remove point from the layout.
     * @private
     * @return {void}
     */
    destroy: function () {
        if (this.isNode) {
            this.linksFrom.concat(this.linksTo).forEach(function (link) {
                // Removing multiple nodes at the same time
                // will try to remove link between nodes twice
                if (link.destroyElements) {
                    link.destroyElements();
                }
            });
        }
        this.series.layout.removeElementFromCollection(this, this.series.layout[this.isNode ? 'nodes' : 'links']);
        return Point.prototype.destroy.apply(this, arguments);
    }
});
/**
 * A `networkgraph` series. If the [type](#series.networkgraph.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.networkgraph
 * @excluding boostThreshold, animation, animationLimit, connectEnds,
 *            connectNulls, dragDrop, getExtremesFromAll, label, linecap,
 *            negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking,
 *            step, threshold, xAxis, yAxis, zoneAxis
 * @product   highcharts
 * @requires  modules/networkgraph
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
 * @type      {Highcharts.SeriesNetworkgraphDataLabelsOptionsObject|Array<Highcharts.SeriesNetworkgraphDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.networkgraph.data.dataLabels
 */
/**
 * The node that the link runs from.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.networkgraph.data.from
 */
/**
 * The node that the link runs to.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.networkgraph.data.to
 */
/**
 * A collection of options for the individual nodes. The nodes in a
 * networkgraph diagram are auto-generated instances of `Highcharts.Point`,
 * but options can be applied here and linked by the `id`.
 *
 * @sample highcharts/series-networkgraph/data-options/
 *         Networkgraph diagram with node options
 *
 * @type      {Array<*>}
 * @product   highcharts
 * @apioption series.networkgraph.nodes
 */
/**
 * The id of the auto-generated node, refering to the `from` or `to` setting of
 * the link.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.networkgraph.nodes.id
 */
/**
 * The color of the auto generated node.
 *
 * @type      {Highcharts.ColorString}
 * @product   highcharts
 * @apioption series.networkgraph.nodes.color
 */
/**
 * The color index of the auto generated node, especially for use in styled
 * mode.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.networkgraph.nodes.colorIndex
 */
/**
 * The name to display for the node in data labels and tooltips. Use this when
 * the name is different from the `id`. Where the id must be unique for each
 * node, this is not necessary for the name.
 *
 * @sample highcharts/series-networkgraph/data-options/
 *         Networkgraph diagram with node options
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.networkgraph.nodes.name
 */
/**
 * Mass of the node. By default, each node has mass equal to it's marker radius
 * . Mass is used to determine how two connected nodes should affect
 * each other:
 *
 * Attractive force is multiplied by the ratio of two connected
 * nodes; if a big node has weights twice as the small one, then the small one
 * will move towards the big one twice faster than the big one to the small one
 * .
 *
 * @sample highcharts/series-networkgraph/ragdoll/
 *         Mass determined by marker.radius
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.networkgraph.nodes.mass
 */
/**
 * Individual data label for each node. The options are the same as
 * the ones for [series.networkgraph.dataLabels](#series.networkgraph.dataLabels).
 *
 * @type      {Highcharts.SeriesNetworkgraphDataLabelsOptionsObject|Array<Highcharts.SeriesNetworkgraphDataLabelsOptionsObject>}
 *
 * @apioption series.networkgraph.nodes.dataLabels
 */
''; // adds doclets above to transpiled file
