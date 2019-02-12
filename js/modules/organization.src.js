/* *
 * X-range series module
 *
 * (c) 2010-2019 Torstein Honsi, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';

var base = H.seriesTypes.sankey.prototype;
H.seriesType(
    'orgchart',
    'sankey',
    {
        borderColor: '${palette.neutralColor60}',
        borderWidth: 1,
        hangingIndent: 20,
        linkColor: '${palette.neutralColor60}',
        linkLineWidth: 1,
        nodeWidth: 50
    },
    {
        inverted: true,
        pointAttribs: function (point, state) {
            var attribs = base.pointAttribs.call(this, point, state);

            if (!point.isNode) {
                attribs.stroke = this.options.linkColor;
                attribs['stroke-width'] = this.options.linkLineWidth;
                delete attribs.fill;
            }
            return attribs;
        },

        createNode: function (id) {
            var node = base.createNode
                .call(this, id);

            // All nodes in an org chart are equal width
            node.getSum = function () {
                return 1;
            };

            return node;

        },

        createNodeColumn: function () {
            var column = base.createNodeColumn.call(this);

            // Wrap the offset function so that the hanging node's children are
            // aligned to their parent
            H.wrap(column, 'offset', function (proceed, node, factor) {
                var offset = proceed.call(this, node, factor);

                // Modify the default output if the parent's layout is 'hanging'
                if (node.hangsFrom) {
                    return {
                        absoluteTop: node.hangsFrom.nodeY
                    };
                }

                return offset;
            });

            return column;
        },

        translateNode: function (node, column) {
            base.translateNode.call(this, node, column);

            if (node.hangsFrom) {
                node.shapeArgs.height -= this.options.hangingIndent;
                if (!this.chart.inverted) {
                    node.shapeArgs.y += this.options.hangingIndent;
                }
            }
        },

        translateLink: function (point) {
            var fromNode = point.fromNode,
                toNode = point.toNode,
                crisp = Math.round(this.options.linkLineWidth) % 2 / 2,
                x1 = Math.floor(
                    fromNode.shapeArgs.x + fromNode.shapeArgs.width
                ) + crisp,
                y1 = Math.floor(
                    fromNode.shapeArgs.y + fromNode.shapeArgs.height / 2
                ) + crisp,
                x2 = Math.floor(toNode.shapeArgs.x) + crisp,
                y2 = Math.floor(
                    toNode.shapeArgs.y + toNode.shapeArgs.height / 2
                ) + crisp,
                xMiddle = Math.floor((x1 + x2) / 2) + crisp,
                hangingIndent = this.options.hangingIndent;

            if (this.chart.inverted) {
                x1 -= fromNode.shapeArgs.width;
                x2 += toNode.shapeArgs.width;
            }

            if (toNode.hangsFrom === fromNode) {
                if (this.chart.inverted) {
                    y1 = Math.floor(
                        fromNode.shapeArgs.y +
                        fromNode.shapeArgs.height -
                        hangingIndent / 2
                    ) + crisp;
                } else {
                    y1 = Math.floor(
                        fromNode.shapeArgs.y +
                        hangingIndent / 2
                    ) + crisp;

                }
                xMiddle = x2 = Math.floor(
                    toNode.shapeArgs.x + toNode.shapeArgs.width / 2
                ) + crisp;
            }

            point.plotY = 1;
            point.shapeType = 'path';
            point.shapeArgs = {
                d: [
                    'M', x1, y1,
                    'L', xMiddle, y1,
                    xMiddle, y2,
                    x2, y2
                ]
            };
        }
    }

);
