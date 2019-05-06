/* *
 * Sankey diagram module
 *
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * A node in a sankey diagram.
 *
 * @interface Highcharts.SankeyNodeObject
 * @extends Highcharts.Point
 * @product highcharts
 *//**
 * The color of the auto generated node.
 *
 * @name Highcharts.SankeyNodeObject#color
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 *//**
 * The color index of the auto generated node, especially for use in styled
 * mode.
 *
 * @name Highcharts.SankeyNodeObject#colorIndex
 * @type {number}
 *//**
 * An optional column index of where to place the node. The default behaviour is
 * to place it next to the preceding node.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
 *      Specified node column
 *
 * @name Highcharts.SankeyNodeObject#column
 * @type {number}
 * @since 6.0.5
 *//**
 * The id of the auto-generated node, refering to the `from` or `to` setting of
 * the link.
 *
 * @name Highcharts.SankeyNodeObject#id
 * @type {string}
 *//**
 * The name to display for the node in data labels and tooltips. Use this when
 * the name is different from the `id`. Where the id must be unique for each
 * node, this is not necessary for the name.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/sankey/|Highcharts-Demo:}
 *         Sankey diagram with node options
 *
 * @name Highcharts.SankeyNodeObject#name
 * @type {string}
 * @product highcharts
 *//**
 * The vertical offset of a node in terms of weight. Positive values shift the
 * node downwards, negative shift it upwards.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
 *         Specified node offset
 *
 * @name Highcharts.SankeyNodeObject#offset
 * @type {number}
 * @default 0
 * @since 6.0.5
 */

/**
 * Options for the series data labels, appearing next to each data point.
 *
 * Since v6.2.0, multiple data labels can be applied to each single point by
 * defining them as an array of configs.
 *
 * In styled mode, the data labels can be styled with the
 * `.highcharts-data-label-box` and `.highcharts-data-label` class names.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-datalabels-enabled|Highcharts-Demo:}
 *      Data labels enabled
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-datalabels-multiple|Highcharts-Demo:}
 *      Multiple data labels on a bar series
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-datalabels|Highcharts-Demo:}
 *      Style mode example
 *
 * @interface Highcharts.SeriesSankeyDataLabelsOptionsObject
 * @extends Highcharts.DataLabelsOptionsObject
 *//**
 * The
 * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
 * specifying what to show for _nodes_ in the sankey diagram. By default the
 * `nodeFormatter` returns `{point.name}`.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-link-datalabels|Highcharts-Demo:}
 *      Node and link data labels
 *
 * @name Highcharts.SeriesSankeyDataLabelsOptionsObject#nodeFormat
 * @type {string|undefined}
 *//**
 * Callback to format data labels for _nodes_ in the sankey diagram. The
 * `nodeFormat` option takes precedence over the `nodeFormatter`.
 *
 * @name Highcharts.SeriesSankeyDataLabelsOptionsObject#nodeFormatter
 * @type {Highcharts.FormatterCallbackFunction<Highcharts.SankeyNodeObject>|undefined}
 * @default function () { return this.point.name; }
 * @since 6.0.2
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../mixins/nodes.js';
import mixinTreeSeries from '../mixins/tree-series.js';
// Note: replace this with destructuring assignment in the future
var getLevelOptions = mixinTreeSeries.getLevelOptions;


var defined = H.defined,
    isObject = H.isObject,
    merge = H.merge,
    seriesType = H.seriesType,
    pick = H.pick,
    Point = H.Point;

var getDLOptions = function getDLOptions(params) {
    var optionsPoint = (
            isObject(params.optionsPoint) ?
                params.optionsPoint.dataLabels :
                {}
        ),
        optionsLevel = (
            isObject(params.level) ?
                params.level.dataLabels :
                {}
        ),
        options = merge({
            style: {}
        }, optionsLevel, optionsPoint);
    return options;
};

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.sankey
 *
 * @augments Highcharts.Series
 */
seriesType('sankey', 'column',
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
     * @excluding    animationLimit, boostThreshold, borderRadius,
     *               crisp, cropThreshold, depth, edgeColor, edgeWidth,
     *               findNearestPointBy, grouping, groupPadding, groupZPadding,
     *               maxPointWidth, negativeColor, pointInterval,
     *               pointIntervalUnit, pointPadding, pointPlacement,
     *               pointRange, pointStart, pointWidth, shadow, softThreshold,
     *               stacking, threshold, zoneAxis, zones
     * @optionparent plotOptions.sankey
     */
    {
        borderWidth: 0,
        colorByPoint: true,
        /**
         * Higher numbers makes the links in a sankey diagram or dependency
         * wheelrender more curved. A `curveFactor` of 0 makes the lines
         * straight.
         *
         * @private
         */
        curveFactor: 0.33,
        /**
         * Options for the data labels appearing on top of the nodes and links.
         * For sankey charts, data labels are visible for the nodes by default,
         * but hidden for links. This is controlled by modifying the
         * `nodeFormat`, and the `format` that applies to links and is an empty
         * string by default.
         *
         * @type    {Highcharts.SeriesSankeyDataLabelsOptionsObject|Array<Highcharts.SeriesSankeyDataLabelsOptionsObject>}
         * @default {"enabled": true, "backgroundColor": "none", "crop": false, "nodeFormatter": function () { return this.point.name; }, "inside": true}
         *
         * @private
         */
        dataLabels: {
            /** @ignore-option */
            enabled: true,
            /**
             * enable padding
             * @ignore-option
             */
            backgroundColor: 'none',
            /** @ignore-option */
            crop: false,
            /** @ignore-option */
            nodeFormat: undefined,
            /** @ignore-option */
            nodeFormatter: function () {
                return this.point.name;
            },
            /** @ignore-option */
            format: undefined,
            /**
            /** @ignore-option */
            formatter: function () {},
            /** @ignore-option */
            inside: true
        },

        /**
         * @ignore-option
         *
         * @private
         */
        inactiveOtherPoints: true,

        /**
         * Set options on specific levels. Takes precedence over series options,
         * but not point options.
         *
         * @sample highcharts/demo/sunburst
         *         Sunburst chart
         *
         * @type      {Array<*>}
         * @since     7.1.0
         * @apioption plotOptions.sankey.levels
         */

        /**
         * Can set `borderColor` on all points which lies on the same level.
         *
         * @type      {Highcharts.ColorString}
         * @apioption plotOptions.sankey.levels.borderColor
         */

        /**
         * Can set `borderWidth` on all points which lies on the same level.
         *
         * @type      {number}
         * @apioption plotOptions.sankey.levels.borderWidth
         */

        /**
         * Can set `color` on all points which lies on the same level.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @apioption plotOptions.sankey.levels.color
         */

        /**
         * Can set `colorByPoint` on all points which lies on the same level.
         *
         * @type      {boolean}
         * @apioption plotOptions.sankey.levels.colorByPoint
         */

        /**
         * Can set `dataLabels` on all points which lies on the same level.
         *
         * @type      {object}
         * @apioption plotOptions.sankey.levels.dataLabels
         */

        /**
         * Decides which level takes effect from the options set in the levels
         * object.
         *
         * @type      {number}
         * @apioption plotOptions.sankey.levels.level
         */

        /**
         * Can set `linkOpacity` on all points which lies on the same level.
         *
         * @type      {number}
         * @apioption plotOptions.sankey.levels.linkOpacity
         */

        /**
         * Can set `states` on all points which lies on the same level.
         *
         * @type      {object}
         * @apioption plotOptions.sankey.levels.states
         */

        /**
         * Opacity for the links between nodes in the sankey diagram.
         *
         * @private
         */
        linkOpacity: 0.5,
        /**
         * The pixel width of each node in a sankey diagram or dependency wheel,
         * or the height in case the chart is inverted.
         *
         * @private
         */
        nodeWidth: 20,
        /**
         * The padding between nodes in a sankey diagram or dependency wheel, in
         * pixels.
         *
         * @private
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
            },
            /**
             * The opposite state of a hover for a single point node/link.
             */
            inactive: {
                /**
                 * Opacity for the links between nodes in the sankey diagram in
                 * inactive mode.
                 */
                linkOpacity: 0.1,
                /**
                 * Opacity of inactive markers.
                 *
                 * @apioption plotOptions.series.marker.states.inactive.opacity
                 * @type {number}
                 */
                opacity: 0.1,

                /**
                 * Animation when not hovering over the marker.
                 *
                 * @type {boolean|Highcharts.AnimationOptionsObject}
                 */
                animation: {
                    duration: 50
                }
            }
        },
        tooltip: {
            /**
             * A callback for defining the format for _nodes_ in the chart's
             * tooltip, as opposed to links.
             *
             * @type      {Highcharts.FormatterCallbackFunction<Highcharts.SankeyNodeObject>}
             * @since     6.0.2
             * @apioption plotOptions.sankey.tooltip.nodeFormatter
             */

            /**
             * Whether the tooltip should follow the pointer or stay fixed on
             * the item.
             */
            followPointer: true,

            headerFormat:
            '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: <b>{point.weight}</b><br/>',
            /**
             * The
             * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
             * specifying what to show for _nodes_ in tooltip of a diagram
             * series, as opposed to links.
             */
            nodeFormat: '{point.name}: <b>{point.sum}</b><br/>'
        }

    }, {
        isCartesian: false,
        invertable: true,
        forceDL: true,
        orderNodes: true,
        // Create a single node that holds information on incoming and outgoing
        // links.
        createNode: H.NodesMixin.createNode,
        setData: H.NodesMixin.setData,
        destroy: H.NodesMixin.destroy,

        // Overridable function to get node padding, overridden in dependency
        // wheel series type
        getNodePadding: function () {
            return this.options.nodePadding;
        },

        // Create a node column.
        createNodeColumn: function () {
            var chart = this.chart,
                column = [],
                nodePadding = this.getNodePadding();

            column.sum = function () {
                return this.reduce(function (sum, node) {
                    return sum + node.getSum();
                }, 0);
            };
            // Get the offset in pixels of a node inside the column.
            column.offset = function (node, factor) {
                var offset = 0,
                    totalNodeOffset;

                for (var i = 0; i < column.length; i++) {
                    totalNodeOffset = column[i].getSum() * factor + nodePadding;
                    if (column[i] === node) {
                        return {
                            relativeTop: offset + H.relativeLength(
                                node.options.offset || 0,
                                totalNodeOffset
                            )
                        };
                    }
                    offset += totalNodeOffset;
                }
            };

            // Get the column height in pixels.
            column.top = function (factor) {
                var height = this.reduce(function (height, node) {
                    if (height > 0) {
                        height += nodePadding;
                    }
                    height += node.getSum() * factor;
                    return height;
                }, 0);
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
                    fromNode,
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
                                fromNode = point.fromNode;
                                fromColumn = fromNode.column;
                            }
                        }
                        node.column = fromColumn + 1;

                        // Hanging layout for organization chart
                        if (fromNode.options.layout === 'hanging') {
                            node.hangsFrom = fromNode;
                            node.column += fromNode.linksFrom.findIndex(
                                function (link) {
                                    return link.toNode === node;
                                }
                            );
                        }
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

        // Define hasData function for non-cartesian series.
        // Returns true if the series has points at all.
        hasData: function () {
            return !!this.processedXData.length; // != 0
        },

        // Return the presentational attributes.
        pointAttribs: function (point, state) {
            var series = this,
                level = point.isNode ? point.level : point.fromNode.level,
                levelOptions = series.mapOptionsToLevel[level || 0] || {},
                options = point.options,
                stateOptions = (
                    levelOptions.states && levelOptions.states[state]
                ) || {},
                values = [
                    'colorByPoint', 'borderColor', 'borderWidth', 'linkOpacity'
                ].reduce(function (obj, key) {
                    obj[key] = pick(
                        stateOptions[key], options[key], levelOptions[key]
                    );
                    return obj;
                }, {}),
                color = pick(
                    stateOptions.color,
                    options.color,
                    values.colorByPoint ? point.color : levelOptions.color
                );

            // Node attributes
            if (point.isNode) {
                return {
                    fill: color,
                    stroke: values.borderColor,
                    'stroke-width': values.borderWidth
                };
            }

            // Link attributes
            return {
                fill: H.color(color).setOpacity(values.linkOpacity).get()
            };

        },

        // Extend generatePoints by adding the nodes, which are Point objects
        // but pushed to the this.nodes array.
        generatePoints: function () {
            H.NodesMixin.generatePoints.apply(this, arguments);

            // Order the nodes, starting with the root node(s) (#9818)
            function order(node, level) {
                if (node.level === undefined) { // Prevents circular recursion
                    node.level = level;
                    node.linksFrom.forEach(function (link) {
                        order(link.toNode, level + 1);
                    });
                }
            }

            if (this.orderNodes) {
                this.nodes
                    // Identify the root node(s)
                    .filter(function (node) {
                        return node.linksTo.length === 0;
                    })
                    // Start by the root node(s) and recursively set the level
                    // on all following nodes.
                    .forEach(function (node) {
                        order(node, 0);
                    });
                H.stableSort(this.nodes, function (a, b) {
                    return a.level - b.level;
                });
            }
        },

        // Run translation operations for one node
        translateNode: function (node, column) {
            var translationFactor = this.translationFactor,
                chart = this.chart,
                options = this.options,
                sum = node.getSum(),
                height = Math.round(sum * translationFactor),
                crisp = Math.round(options.borderWidth) % 2 / 2,
                nodeOffset = column.offset(node, translationFactor),
                fromNodeTop = Math.floor(pick(
                    nodeOffset.absoluteTop,
                    column.top(translationFactor) + nodeOffset.relativeTop
                )) + crisp,
                left = Math.floor(
                    this.colDistance * node.column +
                    options.borderWidth / 2
                ) + crisp,
                nodeLeft = chart.inverted ?
                    chart.plotSizeX - left :
                    left,
                nodeWidth = Math.round(this.nodeWidth);

            node.sum = sum;

            // Draw the node
            node.shapeType = 'rect';

            node.nodeX = nodeLeft;
            node.nodeY = fromNodeTop;
            if (!chart.inverted) {
                node.shapeArgs = {
                    x: nodeLeft,
                    y: fromNodeTop,
                    width: node.options.width || options.width || nodeWidth,
                    height: node.options.height || options.height || height
                };
            } else {
                node.shapeArgs = {
                    x: nodeLeft - nodeWidth,
                    y: chart.plotSizeY - fromNodeTop - height,
                    width: node.options.height || options.height || nodeWidth,
                    height: node.options.width || options.width || height
                };
            }

            node.shapeArgs.display = node.hasShape() ? '' : 'none';

            // Calculate data label options for the point
            node.dlOptions = getDLOptions({
                level: this.mapOptionsToLevel[node.level],
                optionsPoint: node.options
            });

            // Pass test in drawPoints
            node.plotY = 1;
        },

        // Run translation operations for one link
        translateLink: function (point) {
            var fromNode = point.fromNode,
                toNode = point.toNode,
                chart = this.chart,
                translationFactor = this.translationFactor,
                linkHeight = point.weight * translationFactor,
                options = this.options,
                fromLinkTop = fromNode.offset(point, 'linksFrom') *
                    translationFactor,
                curvy = (
                    (chart.inverted ? -this.colDistance : this.colDistance) *
                    options.curveFactor
                ),
                fromY = fromNode.nodeY + fromLinkTop,
                nodeLeft = fromNode.nodeX,
                toColTop = this.nodeColumns[toNode.column]
                    .top(translationFactor),
                toY = (
                    toColTop +
                    (toNode.offset(point, 'linksTo') * translationFactor) +
                    this.nodeColumns[toNode.column].offset(
                        toNode,
                        translationFactor
                    ).relativeTop
                ),
                nodeW = this.nodeWidth,
                right = toNode.column * this.colDistance,
                outgoing = point.outgoing,
                straight = right > nodeLeft;

            if (chart.inverted) {
                fromY = chart.plotSizeY - fromY;
                toY = chart.plotSizeY - toY;
                right = chart.plotSizeX - right;
                nodeW = -nodeW;
                linkHeight = -linkHeight;
                straight = nodeLeft > right;
            }

            point.shapeType = 'path';
            point.linkBase = [
                fromY,
                fromY + linkHeight,
                toY,
                toY + linkHeight
            ];

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
                        nodeLeft + nodeW + curvy,
                        fromY + linkHeight,
                        nodeLeft + nodeW, fromY + linkHeight,
                        'z'
                    ]
                };

            // Experimental: Circular links pointing backwards. In
            // v6.1.0 this breaks the rendering completely, so even
            // this experimental rendering is an improvement. #8218.
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
                point.color = fromNode.color;
            }

        },

        // Run pre-translation by generating the nodeColumns.
        translate: function () {
            if (!this.processedXData) {
                this.processData();
            }
            this.generatePoints();

            this.nodeColumns = this.createNodeColumns();
            this.nodeWidth = H.relativeLength(
                this.options.nodeWidth,
                this.chart.plotSizeX
            );

            var series = this,
                chart = this.chart,
                options = this.options,
                nodeWidth = this.nodeWidth,
                nodeColumns = this.nodeColumns,
                nodePadding = this.getNodePadding();

            // Find out how much space is needed. Base it on the translation
            // factor of the most spaceous column.
            this.translationFactor = nodeColumns.reduce(
                function (translationFactor, column) {
                    var height = chart.plotSizeY - options.borderWidth -
                    (column.length - 1) * nodePadding;

                    return Math.min(translationFactor, height / column.sum());
                },
                Infinity
            );
            this.colDistance =
                (chart.plotSizeX - nodeWidth - options.borderWidth) /
                    (nodeColumns.length - 1);

            // Calculate level options used in sankey and organization
            series.mapOptionsToLevel = getLevelOptions({
                // NOTE: if support for allowTraversingTree is added, then from
                // should be the level of the root node.
                from: 1,
                levels: options.levels,
                to: nodeColumns.length - 1, // Height of the tree
                defaults: {
                    borderColor: options.borderColor,
                    borderRadius: options.borderRadius, // organization series
                    borderWidth: options.borderWidth,
                    color: series.color,
                    colorByPoint: options.colorByPoint,
                    // NOTE: if support for allowTraversingTree is added, then
                    // levelIsConstant should be optional.
                    levelIsConstant: true,
                    linkColor: options.linkColor, // organization series
                    linkLineWidth: options.linkLineWidth, // organization series
                    linkOpacity: options.linkOpacity,
                    states: options.states
                }
            });

            // First translate all nodes so we can use them when drawing links
            nodeColumns.forEach(function (column) {

                column.forEach(function (node) {
                    series.translateNode(node, column);
                });

            }, this);

            // Then translate links
            this.nodes.forEach(function (node) {
                // Translate the links from this node
                node.linksFrom.forEach(function (linkPoint) {
                    series.translateLink(linkPoint);
                    linkPoint.allowShadow = false;
                });
            });
        },
        // Extend the render function to also render this.nodes together with
        // the points.
        render: function () {
            var points = this.points;

            this.points = this.points.concat(this.nodes || []);
            H.seriesTypes.column.prototype.render.call(this);
            this.points = points;
        },
        animate: H.Series.prototype.animate
    }, {
        applyOptions: function (options, x) {
            Point.prototype.applyOptions.call(this, options, x);

            // Treat point.level as a synonym of point.column
            if (defined(this.options.level)) {
                this.options.column = this.column = this.options.level;
            }
            return this;
        },
        setState: H.NodesMixin.setNodeState,
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
 * @excluding animationLimit, boostBlending, boostThreshold, borderColor,
 *            borderRadius, borderWidth, crisp, cropThreshold, dataParser,
 *            dataURL, depth, dragDrop, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, grouping, groupPadding,
 *            groupZPadding, label, maxPointWidth, negativeColor, pointInterval,
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
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
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
 * to place it next to the preceding node. Note that this option name is
 * counter intuitive in inverted charts, like for example an organization chart
 * rendered top down. In this case the "columns" are horizontal.
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
 * An optional level index of where to place the node. The default behaviour is
 * to place it next to the preceding node. Alias of `nodes.column`, but in
 * inverted sankeys and org charts, the levels are laid out as rows.
 *
 * @type      {number}
 * @since     7.1.0
 * @product   highcharts
 * @apioption series.sankey.nodes.level
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
 * In a horizontal layout, the vertical offset of a node in terms of weight.
 * Positive values shift the node downwards, negative shift it upwards. In a
 * vertical layout, like organization chart, the offset is horizontal.
 *
 * If a percantage string is given, the node is offset by the percentage of the
 * node size plus `nodePadding`.
 *
 * @sample highcharts/plotoptions/sankey-node-column/
 *         Specified node offset
 *
 * @type      {number|string}
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
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<*>}
 * @extends   series.line.data
 * @excluding dragDrop, drilldown, marker, x, y
 * @product   highcharts
 * @apioption series.sankey.data
 */

/**
 * The color for the individual _link_. By default, the link color is the same
 * as the node it extends from. The `series.fillOpacity` option also applies to
 * the points, so when setting a specific link color, consider setting the
 * `fillOpacity` to 1.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts
 * @apioption series.sankey.data.color
 */

/**
 * @type      {Highcharts.SeriesSankeyDataLabelsOptionsObject|Array<Highcharts.SeriesSankeyDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.sankey.data.dataLabels
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
 * @type      {number|null}
 * @product   highcharts
 * @apioption series.sankey.data.weight
 */
