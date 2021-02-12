/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Color from '../../Core/Color/Color.js';
import H from '../../Core/Globals.js';
import NodesMixin from '../../Mixins/Nodes.js';
import SankeyPoint from './SankeyPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, ColumnSeries = SeriesRegistry.seriesTypes.column;
import TreeSeriesMixin from '../../Mixins/TreeSeries.js';
var getLevelOptions = TreeSeriesMixin.getLevelOptions;
import U from '../../Core/Utilities.js';
var defined = U.defined, extend = U.extend, find = U.find, isObject = U.isObject, merge = U.merge, pick = U.pick, relativeLength = U.relativeLength, stableSort = U.stableSort;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.sankey
 *
 * @augments Highcharts.Series
 */
var SankeySeries = /** @class */ (function (_super) {
    __extends(SankeySeries, _super);
    function SankeySeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.colDistance = void 0;
        _this.data = void 0;
        _this.group = void 0;
        _this.nodeLookup = void 0;
        _this.nodePadding = void 0;
        _this.nodes = void 0;
        _this.nodeWidth = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.translationFactor = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Static Functions
     *
     * */
    // eslint-disable-next-line valid-jsdoc
    /**
     * @private
     */
    SankeySeries.getDLOptions = function (params) {
        var optionsPoint = (isObject(params.optionsPoint) ?
            params.optionsPoint.dataLabels :
            {}), optionsLevel = (isObject(params.level) ?
            params.level.dataLabels :
            {}), options = merge({
            style: {}
        }, optionsLevel, optionsPoint);
        return options;
    };
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Create a node column.
     * @private
     */
    SankeySeries.prototype.createNodeColumn = function () {
        var series = this, chart = this.chart, column = [];
        column.sum = function () {
            return this.reduce(function (sum, node) {
                return sum + node.getSum();
            }, 0);
        };
        // Get the offset in pixels of a node inside the column.
        column.offset = function (node, factor) {
            var offset = 0, totalNodeOffset, nodePadding = series.nodePadding;
            for (var i = 0; i < column.length; i++) {
                var sum = column[i].getSum();
                var height = Math.max(sum * factor, series.options.minLinkWidth);
                if (sum) {
                    totalNodeOffset = height + nodePadding;
                }
                else {
                    // If node sum equals 0 nodePadding is missed #12453
                    totalNodeOffset = 0;
                }
                if (column[i] === node) {
                    return {
                        relativeTop: offset + relativeLength(node.options.offset || 0, totalNodeOffset)
                    };
                }
                offset += totalNodeOffset;
            }
        };
        // Get the top position of the column in pixels.
        column.top = function (factor) {
            var nodePadding = series.nodePadding;
            var height = this.reduce(function (height, node) {
                if (height > 0) {
                    height += nodePadding;
                }
                var nodeHeight = Math.max(node.getSum() * factor, series.options.minLinkWidth);
                height += nodeHeight;
                return height;
            }, 0);
            return (chart.plotSizeY - height) / 2;
        };
        return column;
    };
    /**
     * Create node columns by analyzing the nodes and the relations between
     * incoming and outgoing links.
     * @private
     */
    SankeySeries.prototype.createNodeColumns = function () {
        var columns = [];
        this.nodes.forEach(function (node) {
            var fromColumn = -1, fromNode, i, point;
            if (!defined(node.options.column)) {
                // No links to this node, place it left
                if (node.linksTo.length === 0) {
                    node.column = 0;
                    // There are incoming links, place it to the right of the
                    // highest order column that links to this one.
                }
                else {
                    for (i = 0; i < node.linksTo.length; i++) {
                        point = node.linksTo[0];
                        if (point.fromNode.column > fromColumn) {
                            fromNode = point.fromNode;
                            fromColumn = fromNode.column;
                        }
                    }
                    node.column = fromColumn + 1;
                    // Hanging layout for organization chart
                    if (fromNode &&
                        fromNode.options.layout === 'hanging') {
                        node.hangsFrom = fromNode;
                        i = -1; // Reuse existing variable i
                        find(fromNode.linksFrom, function (link, index) {
                            var found = link.toNode === node;
                            if (found) {
                                i = index;
                            }
                            return found;
                        });
                        node.column += i;
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
            if (typeof columns[i] === 'undefined') {
                columns[i] = this.createNodeColumn();
            }
        }
        return columns;
    };
    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     * @private
     */
    SankeySeries.prototype.generatePoints = function () {
        NodesMixin.generatePoints.apply(this, arguments);
        /**
         * Order the nodes, starting with the root node(s). (#9818)
         * @private
         */
        function order(node, level) {
            // Prevents circular recursion:
            if (typeof node.level === 'undefined') {
                node.level = level;
                node.linksFrom.forEach(function (link) {
                    if (link.toNode) {
                        order(link.toNode, level + 1);
                    }
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
            stableSort(this.nodes, function (a, b) {
                return a.level - b.level;
            });
        }
    };
    /**
     * Overridable function to get node padding, overridden in dependency
     * wheel series type.
     * @private
     */
    SankeySeries.prototype.getNodePadding = function () {
        var nodePadding = this.options.nodePadding || 0;
        // If the number of columns is so great that they will overflow with
        // the given nodePadding, we sacrifice the padding in order to
        // render all nodes within the plot area (#11917).
        if (this.nodeColumns) {
            var maxLength = this.nodeColumns.reduce(function (acc, col) { return Math.max(acc, col.length); }, 0);
            if (maxLength * nodePadding > this.chart.plotSizeY) {
                nodePadding = this.chart.plotSizeY / maxLength;
            }
        }
        return nodePadding;
    };
    /**
     * Define hasData function for non-cartesian series.
     * @private
     * @return {boolean}
     *         Returns true if the series has points at all.
     */
    SankeySeries.prototype.hasData = function () {
        return !!this.processedXData.length; // != 0
    };
    /**
     * Return the presentational attributes.
     * @private
     */
    SankeySeries.prototype.pointAttribs = function (point, state) {
        if (!point) {
            return {};
        }
        var series = this, level = point.isNode ? point.level : point.fromNode.level, levelOptions = series.mapOptionsToLevel[level || 0] || {}, options = point.options, stateOptions = (levelOptions.states && levelOptions.states[state || '']) || {}, values = [
            'colorByPoint', 'borderColor', 'borderWidth', 'linkOpacity'
        ].reduce(function (obj, key) {
            obj[key] = pick(stateOptions[key], options[key], levelOptions[key], series.options[key]);
            return obj;
        }, {}), color = pick(stateOptions.color, options.color, values.colorByPoint ? point.color : levelOptions.color);
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
            fill: Color.parse(color).setOpacity(values.linkOpacity).get()
        };
    };
    /**
     * Extend the render function to also render this.nodes together with
     * the points.
     * @private
     */
    SankeySeries.prototype.render = function () {
        var points = this.points;
        this.points = this.points.concat(this.nodes || []);
        ColumnSeries.prototype.render.call(this);
        this.points = points;
    };
    /**
     * Run pre-translation by generating the nodeColumns.
     * @private
     */
    SankeySeries.prototype.translate = function () {
        var _this = this;
        // Get the translation factor needed for each column to fill up the
        // plot height
        var getColumnTranslationFactor = function (column) {
            var nodes = column.slice();
            var minLinkWidth = _this.options.minLinkWidth || 0;
            var exceedsMinLinkWidth;
            var factor = 0;
            var i;
            var remainingHeight = chart.plotSizeY -
                options.borderWidth - (column.length - 1) * series.nodePadding;
            // Because the minLinkWidth option doesn't obey the direct
            // translation, we need to run translation iteratively, check
            // node heights, remove those nodes affected by minLinkWidth,
            // check again, etc.
            while (column.length) {
                factor = remainingHeight / column.sum();
                exceedsMinLinkWidth = false;
                i = column.length;
                while (i--) {
                    if (column[i].getSum() * factor < minLinkWidth) {
                        column.splice(i, 1);
                        remainingHeight -= minLinkWidth;
                        exceedsMinLinkWidth = true;
                    }
                }
                if (!exceedsMinLinkWidth) {
                    break;
                }
            }
            // Re-insert original nodes
            column.length = 0;
            nodes.forEach(function (node) { return column.push(node); });
            return factor;
        };
        if (!this.processedXData) {
            this.processData();
        }
        this.generatePoints();
        this.nodeColumns = this.createNodeColumns();
        this.nodeWidth = relativeLength(this.options.nodeWidth, this.chart.plotSizeX);
        var series = this, chart = this.chart, options = this.options, nodeWidth = this.nodeWidth, nodeColumns = this.nodeColumns;
        this.nodePadding = this.getNodePadding();
        // Find out how much space is needed. Base it on the translation
        // factor of the most spaceous column.
        this.translationFactor = nodeColumns.reduce(function (translationFactor, column) { return Math.min(translationFactor, getColumnTranslationFactor(column)); }, Infinity);
        this.colDistance =
            (chart.plotSizeX - nodeWidth -
                options.borderWidth) / Math.max(1, nodeColumns.length - 1);
        // Calculate level options used in sankey and organization
        series.mapOptionsToLevel = getLevelOptions({
            // NOTE: if support for allowTraversingTree is added, then from
            // should be the level of the root node.
            from: 1,
            levels: options.levels,
            to: nodeColumns.length - 1,
            defaults: {
                borderColor: options.borderColor,
                borderRadius: options.borderRadius,
                borderWidth: options.borderWidth,
                color: series.color,
                colorByPoint: options.colorByPoint,
                // NOTE: if support for allowTraversingTree is added, then
                // levelIsConstant should be optional.
                levelIsConstant: true,
                linkColor: options.linkColor,
                linkLineWidth: options.linkLineWidth,
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
                // If weight is 0 - don't render the link path #12453,
                // render null points (for organization chart)
                if ((linkPoint.weight || linkPoint.isNull) && linkPoint.to) {
                    series.translateLink(linkPoint);
                    linkPoint.allowShadow = false;
                }
            });
        });
    };
    /**
     * Run translation operations for one link.
     * @private
     */
    SankeySeries.prototype.translateLink = function (point) {
        var getY = function (node, fromOrTo) {
            var _a;
            var linkTop = (node.offset(point, fromOrTo) *
                translationFactor);
            var y = Math.min(node.nodeY + linkTop, 
            // Prevent links from spilling below the node (#12014)
            node.nodeY + ((_a = node.shapeArgs) === null || _a === void 0 ? void 0 : _a.height) - linkHeight);
            return y;
        };
        var fromNode = point.fromNode, toNode = point.toNode, chart = this.chart, translationFactor = this.translationFactor, linkHeight = Math.max(point.weight * translationFactor, this.options.minLinkWidth), options = this.options, curvy = ((chart.inverted ? -this.colDistance : this.colDistance) *
            options.curveFactor), fromY = getY(fromNode, 'linksFrom'), toY = getY(toNode, 'linksTo'), nodeLeft = fromNode.nodeX, nodeW = this.nodeWidth, right = toNode.column * this.colDistance, outgoing = point.outgoing, straight = right > nodeLeft + nodeW;
        if (chart.inverted) {
            fromY = chart.plotSizeY - fromY;
            toY = (chart.plotSizeY || 0) - toY;
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
        if (straight && typeof toY === 'number') {
            point.shapeArgs = {
                d: [
                    ['M', nodeLeft + nodeW, fromY],
                    [
                        'C',
                        nodeLeft + nodeW + curvy,
                        fromY,
                        right - curvy,
                        toY,
                        right,
                        toY
                    ],
                    ['L', right + (outgoing ? nodeW : 0), toY + linkHeight / 2],
                    ['L', right, toY + linkHeight],
                    [
                        'C',
                        right - curvy,
                        toY + linkHeight,
                        nodeLeft + nodeW + curvy,
                        fromY + linkHeight,
                        nodeLeft + nodeW, fromY + linkHeight
                    ],
                    ['Z']
                ]
            };
            // Experimental: Circular links pointing backwards. In
            // v6.1.0 this breaks the rendering completely, so even
            // this experimental rendering is an improvement. #8218.
            // @todo
            // - Make room for the link in the layout
            // - Automatically determine if the link should go up or
            //   down.
        }
        else if (typeof toY === 'number') {
            var bend = 20, vDist = chart.plotHeight - fromY - linkHeight, x1 = right - bend - linkHeight, x2 = right - bend, x3 = right, x4 = nodeLeft + nodeW, x5 = x4 + bend, x6 = x5 + linkHeight, fy1 = fromY, fy2 = fromY + linkHeight, fy3 = fy2 + bend, y4 = fy3 + vDist, y5 = y4 + bend, y6 = y5 + linkHeight, ty1 = toY, ty2 = ty1 + linkHeight, ty3 = ty2 + bend, cfy1 = fy2 - linkHeight * 0.7, cy2 = y5 + linkHeight * 0.7, cty1 = ty2 - linkHeight * 0.7, cx1 = x3 - linkHeight * 0.7, cx2 = x4 + linkHeight * 0.7;
            point.shapeArgs = {
                d: [
                    ['M', x4, fy1],
                    ['C', cx2, fy1, x6, cfy1, x6, fy3],
                    ['L', x6, y4],
                    ['C', x6, cy2, cx2, y6, x4, y6],
                    ['L', x3, y6],
                    ['C', cx1, y6, x1, cy2, x1, y4],
                    ['L', x1, ty3],
                    ['C', x1, cty1, cx1, ty1, x3, ty1],
                    ['L', x3, ty2],
                    ['C', x2, ty2, x2, ty2, x2, ty3],
                    ['L', x2, y4],
                    ['C', x2, y5, x2, y5, x3, y5],
                    ['L', x4, y5],
                    ['C', x5, y5, x5, y5, x5, y4],
                    ['L', x5, fy3],
                    ['C', x5, fy2, x5, fy2, x4, fy2],
                    ['Z']
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
        // And set the tooltip anchor in the middle
        point.tooltipPos = chart.inverted ? [
            chart.plotSizeY - point.dlBox.y - linkHeight / 2,
            chart.plotSizeX - point.dlBox.x
        ] : [
            point.dlBox.x,
            point.dlBox.y + linkHeight / 2
        ];
        // Pass test in drawPoints
        point.y = point.plotY = 1;
        if (!point.color) {
            point.color = fromNode.color;
        }
    };
    /**
     * Run translation operations for one node.
     * @private
     */
    SankeySeries.prototype.translateNode = function (node, column) {
        var translationFactor = this.translationFactor, chart = this.chart, options = this.options, sum = node.getSum(), height = Math.max(Math.round(sum * translationFactor), this.options.minLinkWidth), crisp = Math.round(options.borderWidth) % 2 / 2, nodeOffset = column.offset(node, translationFactor), fromNodeTop = Math.floor(pick(nodeOffset.absoluteTop, (column.top(translationFactor) +
            nodeOffset.relativeTop))) + crisp, left = Math.floor(this.colDistance * node.column +
            options.borderWidth / 2) + crisp, nodeLeft = chart.inverted ?
            chart.plotSizeX - left :
            left, nodeWidth = Math.round(this.nodeWidth);
        node.sum = sum;
        // If node sum is 0, don't render the rect #12453
        if (sum) {
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
            }
            else {
                node.shapeArgs = {
                    x: nodeLeft - nodeWidth,
                    y: chart.plotSizeY - fromNodeTop - height,
                    width: node.options.height || options.height || nodeWidth,
                    height: node.options.width || options.width || height
                };
            }
            node.shapeArgs.display = node.hasShape() ? '' : 'none';
            // Calculate data label options for the point
            node.dlOptions = SankeySeries.getDLOptions({
                level: this.mapOptionsToLevel[node.level],
                optionsPoint: node.options
            });
            // Pass test in drawPoints
            node.plotY = 1;
            // Set the anchor position for tooltips
            node.tooltipPos = chart.inverted ? [
                chart.plotSizeY - node.shapeArgs.y - node.shapeArgs.height / 2,
                chart.plotSizeX - node.shapeArgs.x - node.shapeArgs.width / 2
            ] : [
                node.shapeArgs.x + node.shapeArgs.width / 2,
                node.shapeArgs.y + node.shapeArgs.height / 2
            ];
        }
        else {
            node.dlOptions = {
                enabled: false
            };
        }
    };
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
     *               crisp, cropThreshold, colorAxis, colorKey, depth, dragDrop,
     *               edgeColor, edgeWidth, findNearestPointBy, grouping,
     *               groupPadding, groupZPadding, maxPointWidth, negativeColor,
     *               pointInterval, pointIntervalUnit, pointPadding,
     *               pointPlacement, pointRange, pointStart, pointWidth,
     *               shadow, softThreshold, stacking, threshold, zoneAxis,
     *               zones, minPointLength, dataSorting, boostBlending
     * @requires     modules/sankey
     * @optionparent plotOptions.sankey
     */
    SankeySeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
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
         * @declare Highcharts.SeriesSankeyDataLabelsOptionsObject
         *
         * @private
         */
        dataLabels: {
            enabled: true,
            backgroundColor: 'none',
            crop: false,
            /**
             * The
             * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
             * specifying what to show for _nodes_ in the sankey diagram. By
             * default the `nodeFormatter` returns `{point.name}`.
             *
             * @sample highcharts/plotoptions/sankey-link-datalabels/
             *         Node and link data labels
             *
             * @type {string}
             */
            nodeFormat: void 0,
            // eslint-disable-next-line valid-jsdoc
            /**
             * Callback to format data labels for _nodes_ in the sankey diagram.
             * The `nodeFormat` option takes precedence over the
             * `nodeFormatter`.
             *
             * @type  {Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction}
             * @since 6.0.2
             */
            nodeFormatter: function () {
                return this.point.name;
            },
            format: void 0,
            // eslint-disable-next-line valid-jsdoc
            /**
             * @type {Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction}
             */
            formatter: function () {
                return;
            },
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
         * but not node and link options.
         *
         * @sample highcharts/demo/sunburst
         *         Sunburst chart
         *
         * @type      {Array<*>}
         * @since     7.1.0
         * @apioption plotOptions.sankey.levels
         */
        /**
         * Can set `borderColor` on all nodes which lay on the same level.
         *
         * @type      {Highcharts.ColorString}
         * @apioption plotOptions.sankey.levels.borderColor
         */
        /**
         * Can set `borderWidth` on all nodes which lay on the same level.
         *
         * @type      {number}
         * @apioption plotOptions.sankey.levels.borderWidth
         */
        /**
         * Can set `color` on all nodes which lay on the same level.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @apioption plotOptions.sankey.levels.color
         */
        /**
         * Can set `colorByPoint` on all nodes which lay on the same level.
         *
         * @type      {boolean}
         * @default   true
         * @apioption plotOptions.sankey.levels.colorByPoint
         */
        /**
         * Can set `dataLabels` on all points which lay on the same level.
         *
         * @extends   plotOptions.sankey.dataLabels
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
         * Can set `linkOpacity` on all points which lay on the same level.
         *
         * @type      {number}
         * @default   0.5
         * @apioption plotOptions.sankey.levels.linkOpacity
         */
        /**
         * Can set `states` on all nodes and points which lay on the same level.
         *
         * @extends   plotOptions.sankey.states
         * @apioption plotOptions.sankey.levels.states
         */
        /**
         * Opacity for the links between nodes in the sankey diagram.
         *
         * @private
         */
        linkOpacity: 0.5,
        /**
         * The minimal width for a line of a sankey. By default,
         * 0 values are not shown.
         *
         * @sample highcharts/plotoptions/sankey-minlinkwidth
         *         Sankey diagram with minimal link height
         *
         * @type      {number}
         * @since     7.1.3
         * @default   0
         * @apioption plotOptions.sankey.minLinkWidth
         *
         * @private
         */
        minLinkWidth: 0,
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
         * If the number of nodes is so great that it is possible to lay them
         * out within the plot area with the given `nodePadding`, they will be
         * rendered with a smaller padding as a strategy to avoid overflow.
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
             *
             * @declare Highcharts.SeriesStatesInactiveOptionsObject
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
                 * @type      {number}
                 * @apioption plotOptions.series.states.inactive.opacity
                 */
                opacity: 0.1,
                /**
                 * Animation when not hovering over the marker.
                 *
                 * @type      {boolean|Partial<Highcharts.AnimationOptionsObject>}
                 * @apioption plotOptions.series.states.inactive.animation
                 */
                animation: {
                    /** @internal */
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
            headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: <b>{point.weight}</b><br/>',
            /**
             * The
             * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
             * specifying what to show for _nodes_ in tooltip of a diagram
             * series, as opposed to links.
             */
            nodeFormat: '{point.name}: <b>{point.sum}</b><br/>'
        }
    });
    return SankeySeries;
}(ColumnSeries));
extend(SankeySeries.prototype, {
    animate: Series.prototype.animate,
    // Create a single node that holds information on incoming and outgoing
    // links.
    createNode: NodesMixin.createNode,
    destroy: NodesMixin.destroy,
    forceDL: true,
    invertible: true,
    isCartesian: false,
    orderNodes: true,
    pointArrayMap: ['from', 'to'],
    pointClass: SankeyPoint,
    searchPoint: H.noop,
    setData: NodesMixin.setData
});
SeriesRegistry.registerSeriesType('sankey', SankeySeries);
/* *
 *
 *  Default Export
 *
 * */
export default SankeySeries;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * A node in a sankey diagram.
 *
 * @interface Highcharts.SankeyNodeObject
 * @extends Highcharts.Point
 * @product highcharts
 */ /**
* The color of the auto generated node.
*
* @name Highcharts.SankeyNodeObject#color
* @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
*/ /**
* The color index of the auto generated node, especially for use in styled
* mode.
*
* @name Highcharts.SankeyNodeObject#colorIndex
* @type {number}
*/ /**
* An optional column index of where to place the node. The default behaviour is
* to place it next to the preceding node.
*
* @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
*      Specified node column
*
* @name Highcharts.SankeyNodeObject#column
* @type {number}
* @since 6.0.5
*/ /**
* The id of the auto-generated node, refering to the `from` or `to` setting of
* the link.
*
* @name Highcharts.SankeyNodeObject#id
* @type {string}
*/ /**
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
*/ /**
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
 * Formatter callback function.
 *
 * @callback Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.SeriesSankeyDataLabelsFormatterContextObject|Highcharts.PointLabelObject} this
 *        Data label context to format
 *
 * @return {string|undefined}
 *         Formatted data label text
 */
/**
 * Context for the node formatter function.
 *
 * @interface Highcharts.SeriesSankeyDataLabelsFormatterContextObject
 * @extends Highcharts.PointLabelObject
 */ /**
* The node object. The node name, if defined, is available through
* `this.point.name`.
* @name Highcharts.SeriesSankeyDataLabelsFormatterContextObject#point
* @type {Highcharts.SankeyNodeObject}
*/
''; // detach doclets above
/* *
 *
 *  API Options
 *
 * */
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
 *            threshold, zoneAxis, zones, dataSorting
 * @product   highcharts
 * @requires  modules/sankey
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
 * @declare   Highcharts.SeriesSankeyNodesOptionsObject
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
 * Individual data label for each node. The options are the same as
 * the ones for [series.sankey.dataLabels](#series.sankey.dataLabels).
 *
 * @extends   plotOptions.sankey.dataLabels
 * @apioption series.sankey.nodes.dataLabels
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
 * @declare   Highcharts.SeriesSankeyPointOptionsObject
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
''; // adds doclets above to transpiled file
