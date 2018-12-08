/* *
 * Sankey diagram module
 *
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../mixins/nodes.js';

var defined = H.defined,
    seriesType = H.seriesType,
    pick = H.pick,
    Point = H.Point;

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.sankey
 *
 * @augments Highcharts.Series
 */
seriesType('sankey', 'column'

/**
 * A sankey diagram is a type of flow diagram, in which the width of the
 * link between two nodes is shown proportionally to the flow quantity.
 *
 * @sample highcharts/demo/sankey-diagram/
 *         Sankey diagram
 * @sample highcharts/plotoptions/sankey-inverted/
 *         Inverted sankey diagram
 * @sample highcharts/plotoptions/sankey-outgoing
 *         Sankey diagram with outgoing links
 *
 * @extends      plotOptions.column
 * @since        6.0.0
 * @product      highcharts
 * @excluding    animationLimit, boostThreshold, borderColor, borderRadius,
 *               borderWidth, crisp, cropThreshold, depth, edgeColor, edgeWidth,
 *               findNearestPointBy, grouping, groupPadding, groupZPadding,
 *               maxPointWidth, negativeColor, pointInterval, pointIntervalUnit,
 *               pointPadding, pointPlacement, pointRange, pointStart,
 *               pointWidth, shadow, softThreshold, stacking, threshold,
 *               zoneAxis, zones
 * @optionparent plotOptions.sankey
 */
, {
    colorByPoint: true,
    /**
     * Higher numbers makes the links in a sankey diagram render more curved.
     * A `curveFactor` of 0 makes the lines straight.
     */
    curveFactor: 0.33,
    /**
     * Options for the data labels appearing on top of the nodes and links. For
     * sankey charts, data labels are visible for the nodes by default, but
     * hidden for links. This is controlled by modifying the `nodeFormat`, and
     * the `format` that applies to links and is an empty string by default.
     */
    dataLabels: {
        enabled: true,
        backgroundColor: 'none', // enable padding
        crop: false,
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _nodes_ in the sankey diagram. By default
         * the `nodeFormatter` returns `{point.name}`.
         *
         * @type {string}
         */
        nodeFormat: undefined,

        /**
         * Callback to format data labels for _nodes_ in the sankey diagram.
         * The `nodeFormat` option takes precedence over the `nodeFormatter`.
         *
         * @type  {Highcharts.FormatterCallbackFunction<object>}
         * @since 6.0.2
         */
        nodeFormatter: function () {
            return this.point.name;
        },
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _links_ in the sankey diagram. Defaults
         * to an empty string returned from the `formatter`, in effect disabling
         * the labels.
         *
         * @type {string}
         */
        format: undefined,
        /**
         * Callback to format data labels for _links_ in the sankey diagram.
         * The `format` option takes precedence over the `formatter`.
         *
         * @type  {Highcharts.FormatterCallbackFunction<Highcharts.SeriesDataLabelsFormatterContextObject>}
         * @since 6.0.2
         */
        formatter: function () {
            return '';
        },
        inside: true
    },
    /**
     * Opacity for the links between nodes in the sankey diagram.
     */
    linkOpacity: 0.5,
    /**
     * The pixel width of each node in a sankey diagram, or the height in case
     * the chart is inverted.
     */
    nodeWidth: 20,
    /**
     * The padding between nodes in a sankey diagram, in pixels.
     */
    nodePadding: 10,
    showInLegend: false,
    states: {
        hover: {
            /**
             * Opacity for the links between nodes in the sankey diagram in
             * hover mode.
             */
            linkOpacity: 1
        }
    },
    tooltip: {
        /**
         * A callback for defining the format for _nodes_ in the sankey chart's
         * tooltip, as opposed to links.
         *
         * @type      {Highcharts.FormatterCallbackFunction<object>}
         * @since     6.0.2
         * @apioption plotOptions.sankey.tooltip.nodeFormatter
         */

        /**
         * Whether the tooltip should follow the pointer or stay fixed on the
         * item.
         */
        followPointer: true,

        headerFormat:
            '<span style="font-size: 10px">{series.name}</span><br/>',
        pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: <b>{point.weight}</b><br/>',
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _nodes_ in tooltip of a sankey diagram
         * series, as opposed to links.
         */
        nodeFormat: '{point.name}: <b>{point.sum}</b><br/>'
    }

}, {
    isCartesian: false,
    forceDL: true,
    // Create a single node that holds information on incoming and outgoing
    // links.
    createNode: H.NodesMixin.createNode,

    // Create a node column.
    createNodeColumn: function () {
        var chart = this.chart,
            column = [],
            nodePadding = this.options.nodePadding;

        column.sum = function () {
            var sum = 0;
            this.forEach(function (node) {
                sum += node.getSum();
            });
            return sum;
        };
        // Get the offset in pixels of a node inside the column.
        column.offset = function (node, factor) {
            var offset = 0;
            for (var i = 0; i < column.length; i++) {
                if (column[i] === node) {
                    return offset + (node.options.offset || 0);
                }
                offset += column[i].getSum() * factor + nodePadding;
            }
        };

        // Get the column height in pixels.
        column.top = function (factor) {
            var height = 0;
            for (var i = 0; i < column.length; i++) {
                if (i > 0) {
                    height += nodePadding;
                }
                height += column[i].getSum() * factor;
            }
            return (chart.plotSizeY - height) / 2;
        };

        return column;
    },

    // Create node columns by analyzing the nodes and the relations between
    // incoming and outgoing links.
    createNodeColumns: function () {
        var columns = [];
        this.nodes.forEach(function (node) {
            var fromColumn = -1,
                i,
                point;

            if (!H.defined(node.options.column)) {
                // No links to this node, place it left
                if (node.linksTo.length === 0) {
                    node.column = 0;

                // There are incoming links, place it to the right of the
                // highest order column that links to this one.
                } else {
                    for (i = 0; i < node.linksTo.length; i++) {
                        point = node.linksTo[0];
                        if (point.fromNode.column > fromColumn) {
                            fromColumn = point.fromNode.column;
                        }
                    }
                    node.column = fromColumn + 1;
                }
            }

            if (!columns[node.column]) {
                columns[node.column] = this.createNodeColumn();
            }

            columns[node.column].push(node);

        }, this);

        // Fill in empty columns (#8865)
        for (var i = 0; i < columns.length; i++) {
            if (columns[i] === undefined) {
                columns[i] = this.createNodeColumn();
            }
        }

        return columns;
    },


    // Return the presentational attributes.
    pointAttribs: function (point, state) {

        var opacity = this.options.linkOpacity,
            color = point.color;

        if (state) {
            opacity = this.options.states[state].linkOpacity || opacity;
            color = this.options.states[state].color || point.color;
        }

        return {
            fill: point.isNode ?
                color :
                H.color(color).setOpacity(opacity).get()
        };
    },

    // Extend generatePoints by adding the nodes, which are Point objects but
    // pushed to the this.nodes array.
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

            point.name = point.name || point.options.id; // for use in formats

        }, this);
    },

    // Run pre-translation by generating the nodeColumns.
    translate: function () {
        if (!this.processedXData) {
            this.processData();
        }
        this.generatePoints();

        this.nodeColumns = this.createNodeColumns();

        var chart = this.chart,
            inverted = chart.inverted,
            options = this.options,
            left = 0,
            nodeWidth = options.nodeWidth,
            nodeColumns = this.nodeColumns,
            colDistance = (chart.plotSizeX - nodeWidth) /
                (nodeColumns.length - 1),
            curvy = (
                (inverted ? -colDistance : colDistance) *
                options.curveFactor
            ),
            factor = Infinity;

        // Find out how much space is needed. Base it on the translation
        // factor of the most spaceous column.
        this.nodeColumns.forEach(function (column) {
            var height = chart.plotSizeY -
                (column.length - 1) * options.nodePadding;

            factor = Math.min(factor, height / column.sum());
        });

        this.nodeColumns.forEach(function (column) {
            column.forEach(function (node) {
                var sum = node.getSum(),
                    height = sum * factor,
                    fromNodeTop = (
                        column.top(factor) +
                        column.offset(node, factor)
                    ),
                    nodeLeft = inverted ?
                        chart.plotSizeX - left :
                        left;

                node.sum = sum;

                // Draw the node
                node.shapeType = 'rect';
                if (!inverted) {
                    node.shapeArgs = {
                        x: nodeLeft,
                        y: fromNodeTop,
                        width: nodeWidth,
                        height: height
                    };
                } else {
                    node.shapeArgs = {
                        x: nodeLeft - nodeWidth,
                        y: chart.plotSizeY - fromNodeTop - height,
                        width: nodeWidth,
                        height: height
                    };
                }
                node.shapeArgs.display = node.hasShape() ? '' : 'none';

                // Pass test in drawPoints
                node.plotY = 1;

                // Draw the links from this node
                node.linksFrom.forEach(function (point) {
                    var linkHeight = point.weight * factor,
                        fromLinkTop = node.offset(point, 'linksFrom') *
                            factor,
                        fromY = fromNodeTop + fromLinkTop,
                        toNode = point.toNode,
                        toColTop = nodeColumns[toNode.column].top(factor),
                        toY = (
                            toColTop +
                            (toNode.offset(point, 'linksTo') * factor) +
                            nodeColumns[toNode.column].offset(
                                toNode,
                                factor
                            )
                        ),
                        nodeW = nodeWidth,
                        right = toNode.column * colDistance,
                        outgoing = point.outgoing,
                        straight = right > nodeLeft;

                    if (inverted) {
                        fromY = chart.plotSizeY - fromY;
                        toY = chart.plotSizeY - toY;
                        right = chart.plotSizeX - right;
                        nodeW = -nodeW;
                        linkHeight = -linkHeight;
                        straight = nodeLeft > right;
                    }

                    point.shapeType = 'path';

                    // Links going from left to right
                    if (straight) {
                        point.shapeArgs = {
                            d: [
                                'M', nodeLeft + nodeW, fromY,
                                'C', nodeLeft + nodeW + curvy, fromY,
                                right - curvy, toY,
                                right, toY,
                                'L',
                                right + (outgoing ? nodeW : 0),
                                toY + linkHeight / 2,
                                'L',
                                right,
                                toY + linkHeight,
                                'C', right - curvy, toY + linkHeight,
                                nodeLeft + nodeW + curvy, fromY + linkHeight,
                                nodeLeft + nodeW, fromY + linkHeight,
                                'z'
                            ]
                        };

                    // Experimental: Circular links pointing backwards. In
                    // v6.1.0 this breaks the rendering completely, so even this
                    // experimental rendering is an improvement. #8218.
                    // @todo
                    // - Make room for the link in the layout
                    // - Automatically determine if the link should go up or
                    //   down.
                    } else {
                        var bend = 20,
                            vDist = chart.plotHeight - fromY - linkHeight,
                            x1 = right - bend - linkHeight,
                            x2 = right - bend,
                            x3 = right,
                            x4 = nodeLeft + nodeW,
                            x5 = x4 + bend,
                            x6 = x5 + linkHeight,
                            fy1 = fromY,
                            fy2 = fromY + linkHeight,
                            fy3 = fy2 + bend,
                            y4 = fy3 + vDist,
                            y5 = y4 + bend,
                            y6 = y5 + linkHeight,
                            ty1 = toY,
                            ty2 = ty1 + linkHeight,
                            ty3 = ty2 + bend,
                            cfy1 = fy2 - linkHeight * 0.7,
                            cy2 = y5 + linkHeight * 0.7,
                            cty1 = ty2 - linkHeight * 0.7,
                            cx1 = x3 - linkHeight * 0.7,
                            cx2 = x4 + linkHeight * 0.7;

                        point.shapeArgs = {
                            d: [
                                'M', x4, fy1,
                                'C', cx2, fy1, x6, cfy1, x6, fy3,
                                'L', x6, y4,
                                'C', x6, cy2, cx2, y6, x4, y6,
                                'L', x3, y6,
                                'C', cx1, y6, x1, cy2, x1, y4,
                                'L', x1, ty3,
                                'C', x1, cty1, cx1, ty1, x3, ty1,
                                'L', x3, ty2,
                                'C', x2, ty2, x2, ty2, x2, ty3,
                                'L', x2, y4,
                                'C', x2, y5, x2, y5, x3, y5,
                                'L', x4, y5,
                                'C', x5, y5, x5, y5, x5, y4,
                                'L', x5, fy3,
                                'C', x5, fy2, x5, fy2, x4, fy2,
                                'z'
                            ]
                        };

                    }

                    // Place data labels in the middle
                    point.dlBox = {
                        x: nodeLeft + (right - nodeLeft + nodeW) / 2,
                        y: fromY + (toY - fromY) / 2,
                        height: linkHeight,
                        width: 0
                    };
                    // Pass test in drawPoints
                    point.y = point.plotY = 1;

                    if (!point.color) {
                        point.color = node.color;
                    }
                });
            });
            left += colDistance;

        }, this);
    },
    // Extend the render function to also render this.nodes together with the
    // points.
    render: function () {
        var points = this.points;
        this.points = this.points.concat(this.nodes);
        H.seriesTypes.column.prototype.render.call(this);
        this.points = points;
    },
    animate: H.Series.prototype.animate,


    destroy: function () {
        // Nodes must also be destroyed (#8682, #9300)
        this.data = [].concat(this.points, this.nodes);
        H.Series.prototype.destroy.call(this);
    }
}, {
    getClassName: function () {
        return (this.isNode ? 'highcharts-node ' : 'highcharts-link ') +
            Point.prototype.getClassName.call(this);
    },
    isValid: function () {
        return this.isNode || typeof this.weight === 'number';
    }
});


/**
 * A `sankey` series. If the [type](#series.sankey.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sankey
 * @excluding animationLimit, boostThreshold, borderColor, borderRadius,
 *            borderWidth, crisp, cropThreshold, dataParser, dataURL, depth,
 *            edgeColor, edgeWidth, findNearestPointBy, grouping, groupPadding,
 *            groupZPadding, maxPointWidth, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPadding, pointPlacement, pointRange,
 *            pointStart, pointWidth, shadow, softThreshold, stacking,
 *            threshold, zoneAxis, zones
 * @product   highcharts
 * @apioption series.sankey
 */


/**
 * A collection of options for the individual nodes. The nodes in a sankey
 * diagram are auto-generated instances of `Highcharts.Point`, but options can
 * be applied here and linked by the `id`.
 *
 * @sample highcharts/css/sankey/
 *         Sankey diagram with node options
 *
 * @type      {Array<*>}
 * @product   highcharts
 * @apioption series.sankey.nodes
 */

/**
 * The id of the auto-generated node, refering to the `from` or `to` setting of
 * the link.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.nodes.id
 */

/**
 * The color of the auto generated node.
 *
 * @type      {Highcharts.ColorString}
 * @product   highcharts
 * @apioption series.sankey.nodes.color
 */

/**
 * The color index of the auto generated node, especially for use in styled
 * mode.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.sankey.nodes.colorIndex
 */

/**
 * An optional column index of where to place the node. The default behaviour is
 * to place it next to the preceding node.
 *
 * @sample highcharts/plotoptions/sankey-node-column/
 *         Specified node column
 *
 * @type      {number}
 * @since     6.0.5
 * @product   highcharts
 * @apioption series.sankey.nodes.column
 */

/**
 * The name to display for the node in data labels and tooltips. Use this when
 * the name is different from the `id`. Where the id must be unique for each
 * node, this is not necessary for the name.
 *
 * @sample highcharts/css/sankey/
 *         Sankey diagram with node options
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.nodes.name
 */

/**
 * The vertical offset of a node in terms of weight. Positive values shift the
 * node downwards, negative shift it upwards.
 *
 * @sample highcharts/plotoptions/sankey-node-column/
 *         Specified node offset
 *
 * @type      {number}
 * @default   0
 * @since     6.0.5
 * @product   highcharts
 * @apioption series.sankey.nodes.offset
 */

/**
 * An array of data points for the series. For the `sankey` series type,
 * points can be given in the following way:
 *
 * An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.area.turboThreshold),
 * this option is not available.
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
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<number|string>|*>}
 * @extends   series.line.data
 * @excluding drilldown, marker, x, y
 * @product   highcharts
 * @apioption series.sankey.data
 */

/**
 * The color for the individual _link_. By default, the link color is the same
 * as the node it extends from. The `series.fillOpacity` option also applies to
 * the points, so when setting a specific link color, consider setting the
 * `fillOpacity` to 1.
 *
 * @type      {Highcharts.ColorString}
 * @product   highcharts
 * @apioption series.sankey.data.color
 */

/**
 * The node that the link runs from.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.data.from
 */

/**
 * The node that the link runs to.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.data.to
 */

/**
 * Whether the link goes out of the system.
 *
 * @sample highcharts/plotoptions/sankey-outgoing
 *         Sankey chart with outgoing links
 *
 * @type      {boolean}
 * @default   false
 * @product   highcharts
 * @apioption series.sankey.data.outgoing
 */

/**
 * The weight of the link.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.sankey.data.weight
 */
