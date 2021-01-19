/* *
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
import OrganizationSeries from '../Organization/OrganizationSeries.js';
import SankeySeries from '../Sankey/SankeySeries.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, colProto = _a.column.prototype, orgProto = _a.organization.prototype;
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
/**
 * treegraph series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.treegraph
 *
 * @augments Highcharts.Series
 */
var TreegraphSeries = /** @class */ (function (_super) {
    __extends(TreegraphSeries, _super);
    function TreegraphSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * General function to apply corner radius to a path - can be lifted to
     * renderer or utilities if we need it elsewhere.
     * @private
     */
    TreegraphSeries.pointsToPath = function (from, to, factor) {
        var middleX = (from.x + to.x) / 2, middleY = (from.y + to.y) / 2, arcPointX1 = (from.x + middleX) / (2 - factor), arcPointY1 = (from.y + middleY) / (2 - factor), arcPointX2 = (middleX + to.x) / (2 + factor), arcPointY2 = (middleY + to.y) / (2 + factor);
        return [
            ['M', from.x, from.y],
            ['Q', arcPointX1, arcPointY1, middleX, middleY],
            ['Q', arcPointX2, arcPointY2, to.x, to.y]
        ];
    };
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    TreegraphSeries.prototype.pointAttribs = function (point, state) {
        var series = this, attribs = orgProto.pointAttribs.call(this, point, state);
        if (point.isNode && series.options.nodeWidth) {
            attribs.r = series.options.nodeWidth / 2 || attribs.r;
        }
        return attribs;
    };
    TreegraphSeries.prototype.translateLink = function (point) {
        var fromNode = point.fromNode, toNode = point.toNode, crisp = Math.round(this.options.linkLineWidth) % 2 / 2, x1 = Math.floor(fromNode.shapeArgs.x) + crisp, hangingIndent = this.options.hangingIndent, toOffset = toNode.options.offset, percentOffset = /%$/.test(toOffset) && parseInt(toOffset, 10), linkOptions = this.options.link, inverted = this.chart.inverted;
        var y1 = Math.floor(fromNode.shapeArgs.y) + crisp, x2 = Math.floor(toNode.shapeArgs.x) + crisp, y2 = Math.floor(toNode.shapeArgs.y) + crisp, xMiddle;
        xMiddle = Math.floor(x2 +
            (inverted ? 1 : -1) *
                (this.colDistance - this.nodeWidth) / 2) + crisp;
        // Put the link on the side of the node when an offset is given. HR
        // node in the main demo.
        if (percentOffset &&
            (percentOffset >= 50 || percentOffset <= -50)) {
            xMiddle = x2 = Math.floor(x2 + (inverted ? -0.5 : 0.5) *
                toNode.shapeArgs.width) + crisp;
            y2 = toNode.shapeArgs.y;
            if (percentOffset > 0) {
                y2 += toNode.shapeArgs.height;
            }
        }
        if (toNode.hangsFrom === fromNode) {
            if (this.chart.inverted) {
                y1 = Math.floor(fromNode.shapeArgs.y +
                    fromNode.shapeArgs.height -
                    hangingIndent / 2) + crisp;
                y2 = (toNode.shapeArgs.y +
                    toNode.shapeArgs.height);
            }
            else {
                y1 = Math.floor(fromNode.shapeArgs.y +
                    hangingIndent / 2) + crisp;
            }
            xMiddle = x2 = Math.floor(toNode.shapeArgs.x +
                toNode.shapeArgs.width / 2) + crisp;
        }
        point.plotY = 1;
        point.shapeType = 'path';
        if (linkOptions && linkOptions.type === 'straight') {
            point.shapeArgs = {
                d: OrganizationSeries.curvedPath([
                    ['M', x1, y1],
                    ['L', x2, y2]
                ], linkOptions.width)
            };
        }
        else if (linkOptions && linkOptions.type === 'curved') {
            point.shapeArgs = {
                d: TreegraphSeries.pointsToPath({
                    x: x1,
                    y: y1
                }, {
                    x: x2,
                    y: y2
                }, 0.1)
            };
        }
        else {
            point.shapeArgs = {
                d: OrganizationSeries.curvedPath([
                    ['M', x1, y1],
                    ['L', xMiddle, y1],
                    ['L', xMiddle, y2],
                    ['L', x2, y2]
                ], this.options.linkRadius)
            };
        }
    };
    /**
     * Run translation operations for one node.
     * @private
     */
    TreegraphSeries.prototype.translateNode = function (node, column) {
        var translationFactor = this.translationFactor, chart = this.chart, options = this.options, sum = node.getSum(), height = Math.max(Math.round(sum * translationFactor), this.options.minLinkWidth), crisp = Math.round(options.borderWidth) % 2 / 2, nodeOffset = column.offset(node, translationFactor), fromNodeTop = Math.floor(pick(nodeOffset.absoluteTop, (column.top(translationFactor) +
            nodeOffset.relativeTop))) + crisp, left = Math.floor(this.colDistance * node.column +
            options.borderWidth / 2) + crisp, nodeLeft = chart.inverted ? chart.plotSizeX - left : left, nodeRadius = Math.round(this.nodeWidth) / 2;
        node.sum = sum;
        // If node sum is 0, don't render the rect #12453
        if (sum) {
            // Draw the node
            node.shapeType = 'circle';
            node.nodeX = nodeLeft;
            node.nodeY = fromNodeTop;
            if (!chart.inverted) {
                node.shapeArgs = {
                    x: nodeLeft + nodeRadius,
                    y: fromNodeTop + nodeRadius,
                    r: nodeRadius
                };
            }
            else {
                node.shapeArgs = {
                    x: nodeLeft - nodeRadius * 2,
                    y: chart.plotSizeY - fromNodeTop - height,
                    width: node.options.height || options.height || nodeRadius * 2,
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
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * A treegraph series.
     *
     *
     * @extends      plotOptions.treegraph
     * @product      highcharts
     * @optionparent plotOptions.treegraph
     */
    TreegraphSeries.defaultOptions = merge(OrganizationSeries.defaultOptions, {
    // nothing here yet
    });
    return TreegraphSeries;
}(OrganizationSeries));
extend(TreegraphSeries.prototype, {
    alignDataLabel: colProto.alignDataLabel
});
SeriesRegistry.registerSeriesType('treegraph', TreegraphSeries);
/* *
 *
 *  Default Export
 *
 * */
export default TreegraphSeries;
/* *
 *
 *  API Options
 *
 * */
''; // gets doclets above into transpilat
