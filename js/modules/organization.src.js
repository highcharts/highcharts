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
        nodeWidth: 50,

        // @todo: Use palette
        linkColor: '#666666',
        linkLineWidth: 1
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
                ) + crisp;

            if (this.chart.inverted) {
                x1 -= fromNode.shapeArgs.width;
                x2 += toNode.shapeArgs.width;
            }

            point.plotY = 1;
            point.shapeType = 'path';
            point.shapeArgs = {
                d: [
                    'M', x1, y1,
                    'L', (x1 + x2) / 2, y1,
                    (x1 + x2) / 2, y2,
                    x2, y2
                ]
            };
        }
    }

);
