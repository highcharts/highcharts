/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../mixins/nodes.js';
var base = H.seriesTypes.sankey.prototype;
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.dependencywheel
 *
 * @augments Highcharts.seriesTypes.sankey
 */
H.seriesType('dependencywheel', 'sankey', 
/**
 * A dependency wheel chart is a type of flow diagram, where all nodes are
 * laid out in a circle, and the flow between the are drawn as link bands.
 *
 * @sample highcharts/demo/dependency-wheel/
 *         Dependency wheel
 *
 * @extends      plotOptions.sankey
 * @since        7.1.0
 * @product      highcharts
 * @requires     modules/dependencywheel
 * @optionparent plotOptions.dependencywheel
 */
{
    /**
     * The center of the wheel relative to the plot area. Can be
     * percentages or pixel values. The default behaviour is to
     * center the wheel inside the plot area.
     *
     * @type    {Array<number|string|null>}
     * @default [null, null]
     * @product highcharts
     */
    center: [null, null],
    curveFactor: 0.6,
    /**
     * The start angle of the dependency wheel, in degrees where 0 is up.
     */
    startAngle: 0
}, {
    orderNodes: false,
    getCenter: H.seriesTypes.pie.prototype.getCenter,
    /* eslint-disable valid-jsdoc */
    /**
     * Dependency wheel has only one column, it runs along the perimeter.
     * @private
     */
    createNodeColumns: function () {
        var columns = [this.createNodeColumn()];
        this.nodes.forEach(function (node) {
            node.column = 0;
            columns[0].push(node);
        });
        return columns;
    },
    /**
     * Translate from vertical pixels to perimeter.
     * @private
     */
    getNodePadding: function () {
        return this.options.nodePadding / Math.PI;
    },
    createNode: function (id) {
        var node = base.createNode.call(this, id);
        node.index = this.nodes.length - 1;
        /**
         * Return the sum of incoming and outgoing links.
         * @private
         */
        node.getSum = function () {
            return node.linksFrom
                .concat(node.linksTo)
                .reduce(function (acc, link) {
                return acc + link.weight;
            }, 0);
        };
        /**
         * Get the offset in weight values of a point/link.
         * @private
         */
        node.offset = function (point) {
            var offset = 0, i, links = node.linksFrom.concat(node.linksTo), sliced;
            /**
             * @private
             */
            function otherNode(link) {
                if (link.fromNode === node) {
                    return link.toNode;
                }
                return link.fromNode;
            }
            // Sort and slice the links to avoid links going out of each
            // node crossing each other.
            links.sort(function (a, b) {
                return otherNode(a).index - otherNode(b).index;
            });
            for (i = 0; i < links.length; i++) {
                if (otherNode(links[i]).index > node.index) {
                    links = links.slice(0, i).reverse().concat(links.slice(i).reverse());
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
    /**
     * @private
     * @todo Override the refactored sankey translateLink and translateNode
     * functions instead of the whole translate function.
     */
    translate: function () {
        var options = this.options, factor = 2 * Math.PI /
            (this.chart.plotHeight + this.getNodePadding()), center = this.getCenter(), startAngle = (options.startAngle - 90) * H.deg2rad;
        base.translate.call(this);
        this.nodeColumns[0].forEach(function (node) {
            var shapeArgs = node.shapeArgs, centerX = center[0], centerY = center[1], r = center[2] / 2, innerR = r - options.nodeWidth, start = startAngle + factor * shapeArgs.y, end = startAngle +
                factor * (shapeArgs.y + shapeArgs.height);
            // Middle angle
            node.angle = start + (end - start) / 2;
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
                    var angle = factor * top, x = Math.cos(startAngle + angle) * (innerR + 1), y = Math.sin(startAngle + angle) * (innerR + 1), curveFactor = options.curveFactor;
                    // The distance between the from and to node along the
                    // perimeter. This affect how curved the link is, so
                    // that links between neighbours don't extend too far
                    // towards the center.
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
                        0,
                        1,
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
    },
    animate: function (init) {
        if (!init) {
            var duration = H.animObject(this.options.animation).duration, step = (duration / 2) / this.nodes.length;
            this.nodes.forEach(function (point, i) {
                var graphic = point.graphic;
                if (graphic) {
                    graphic.attr({ opacity: 0 });
                    setTimeout(function () {
                        graphic.animate({ opacity: 1 }, { duration: step });
                    }, step * i);
                }
            }, this);
            this.points.forEach(function (point) {
                var graphic = point.graphic;
                if (!point.isNode && graphic) {
                    graphic.attr({ opacity: 0 })
                        .animate({
                        opacity: 1
                    }, this.options.animation);
                }
            }, this);
            this.animate = null;
        }
    }
    /* eslint-enable valid-jsdoc */
}, 
// Point class
{
    setState: H.NodesMixin.setNodeState,
    /* eslint-disable valid-jsdoc */
    /**
     * Return a text path that the data label uses.
     * @private
     */
    getDataLabelPath: function (label) {
        var renderer = this.series.chart.renderer, shapeArgs = this.shapeArgs, upperHalf = this.angle < 0 || this.angle > Math.PI, start = shapeArgs.start, end = shapeArgs.end;
        if (!this.dataLabelPath) {
            this.dataLabelPath = renderer
                .arc({ open: true })
                // Add it inside the data label group so it gets destroyed
                // with the label
                .add(label);
        }
        this.dataLabelPath.attr({
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (shapeArgs.r +
                (this.dataLabel.options.distance || 0)),
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf
        });
        return this.dataLabelPath;
    },
    isValid: function () {
        // No null points here
        return true;
    }
    /* eslint-enable valid-jsdoc */
});
/**
 * A `dependencywheel` series. If the [type](#series.dependencywheel.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dependencywheel
 * @product   highcharts
 * @requires  modules/dependencywheel
 * @apioption series.dependencywheel
 */
/**
 * A collection of options for the individual nodes. The nodes in a dependency
 * diagram are auto-generated instances of `Highcharts.Point`, but options can
 * be applied here and linked by the `id`.
 *
 * @extends   series.sankey.nodes
 * @type      {Array<*>}
 * @product   highcharts
 * @excluding offset
 * @apioption series.dependencywheel.nodes
 */
/**
 * An array of data points for the series. For the `dependencywheel` series
 * type, points can be given in the following way:
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
 * @type      {Array<*>}
 * @extends   series.sankey.data
 * @product   highcharts
 * @excluding outgoing, dataLabels
 * @apioption series.dependencywheel.data
 */
/**
 * Individual data label for each node. The options are the same as
 * the ones for [series.dependencywheel.dataLabels](#series.dependencywheel.dataLabels).
 *
 * @apioption series.dependencywheel.nodes.dataLabels
 */
''; // adds doclets above to the transpiled file
