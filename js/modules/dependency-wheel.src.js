/* *
 * Experimental dependency wheel module
 *
 * (c) 2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../mixins/nodes.js';

var unsupportedSeriesType = H.seriesType;

var base = H.seriesTypes.sankey.prototype;

unsupportedSeriesType('dependencywheel', 'sankey', {
    center: [],
    curveFactor: 0.6,
    startAngle: 0
}, {
    orderNodes: false,
    getCenter: H.seriesTypes.pie.prototype.getCenter,

    // Dependency wheel has only one column, it runs along the perimeter
    createNodeColumns: function () {
        var columns = [this.createNodeColumn()];
        this.nodes.forEach(function (node) {
            node.column = 0;
            columns[0].push(node);
        });
        return columns;
    },

    // Translate from vertical pixels to perimeter
    getNodePadding: function () {
        return this.options.nodePadding / Math.PI;
    },

    createNode: function (id) {
        var node = base.createNode.call(this, id);
        node.index = this.nodes.length - 1;

        // Return the sum of incoming and outgoing links
        node.getSum = function () {
            return node.linksFrom.concat(node.linksTo)
                .reduce(function (acc, link) {
                    return acc + link.weight;
                }, 0);
        };

        // Get the offset in weight values of a point/link.
        node.offset = function (point) {

            var offset = 0,
                i,
                links = node.linksFrom.concat(node.linksTo),
                sliced;

            function otherNode(link) {
                if (link.fromNode === node) {
                    return link.toNode;
                }
                return link.fromNode;
            }

            // Sort and slice the links to avoid links going out of each node
            // crossing each other.
            links.sort(function (a, b) {
                return otherNode(a).index - otherNode(b).index;
            });
            for (i = 0; i < links.length; i++) {
                if (otherNode(links[i]).index > node.index) {
                    links = links.slice(0, i).reverse().concat(
                        links.slice(i).reverse()
                    );
                    sliced = true;
                    break;
                }
            }
            if (!sliced) {
                links.reverse();
            }

            for (i = 0; i < links.length; i++) {
                if (links[i] === point) {
                    return offset;
                }
                offset += links[i].weight;
            }
        };

        return node;
    },

    // @todo: Override the refactored sankey translateLink and translateNode
    // functions instead of the whole translate function
    translate: function () {

        var options = this.options,
            factor = 2 * Math.PI /
                (this.chart.plotHeight + this.getNodePadding()),
            center = this.getCenter(),
            startAngle = (options.startAngle - 90) * H.deg2rad;

        base.translate.call(this);

        this.nodeColumns[0].forEach(function (node) {
            var shapeArgs = node.shapeArgs,
                centerX = center[0],
                centerY = center[1],
                r = center[2] / 2,
                innerR = r - options.nodeWidth,
                start = startAngle + factor * shapeArgs.y,
                end = startAngle + factor * (shapeArgs.y + shapeArgs.height);

            node.shapeType = 'arc';
            node.shapeArgs = {
                x: centerX,
                y: centerY,
                r: r,
                innerR: innerR,
                start: start,
                end: end
            };

            node.dlBox = {
                x: centerX + Math.cos((start + end) / 2) * (r + innerR) / 2,
                y: centerY + Math.sin((start + end) / 2) * (r + innerR) / 2,
                width: 1,
                height: 1
            };

            // Draw the links from this node
            node.linksFrom.forEach(function (point) {
                var distance;
                var corners = point.linkBase.map(function (top, i) {
                    var angle = factor * top,
                        x = Math.cos(startAngle + angle) * (innerR + 1),
                        y = Math.sin(startAngle + angle) * (innerR + 1),
                        curveFactor = options.curveFactor;

                    // The distance between the from and to node along the
                    // perimeter. This affect how curved the link is, so that
                    // links between neighbours don't extend too far towards the
                    // center.
                    distance = Math.abs(point.linkBase[3 - i] * factor - angle);
                    if (distance > Math.PI) {
                        distance = 2 * Math.PI - distance;
                    }
                    distance = distance * innerR;
                    if (distance < innerR) {
                        curveFactor *= (distance / innerR);
                    }


                    return {
                        x: centerX + x,
                        y: centerY + y,
                        cpX: centerX + (1 - curveFactor) * x,
                        cpY: centerY + (1 - curveFactor) * y
                    };
                });

                point.shapeArgs = {
                    d: [
                        'M',
                        corners[0].x, corners[0].y,
                        'A',
                        innerR, innerR,
                        0,
                        0, // long arc
                        1, // clockwise
                        corners[1].x, corners[1].y,
                        'C',
                        corners[1].cpX, corners[1].cpY,
                        corners[2].cpX, corners[2].cpY,
                        corners[2].x, corners[2].y,
                        'A',
                        innerR, innerR,
                        0,
                        0,
                        1,
                        corners[3].x, corners[3].y,
                        'C',
                        corners[3].cpX, corners[3].cpY,
                        corners[0].cpX, corners[0].cpY,
                        corners[0].x, corners[0].y
                    ]
                };

            });

        });
    }
});
