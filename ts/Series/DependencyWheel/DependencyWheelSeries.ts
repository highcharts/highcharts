/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SankeyPointOptions from '../Sankey/SankeyPointOptions';
import type SankeySeriesType from '../Sankey/SankeySeries';
import type SankeySeriesOptions from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        pie: PieSeries,
        sankey: SankeySeries
    }
} = BaseSeries;
import H from '../../Core/Globals.js';
import NodesMixin from '../../Mixins/Nodes.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DependencyWheelPointOptions extends SankeyPointOptions {
        }
        interface DependencyWheelSeriesOptions extends SankeySeriesOptions {
            center?: Array<(number|string|null)>;
            startAngle?: number;
            states?: SeriesStatesOptions<DependencyWheelSeries>;
        }
    }
}

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.dependencywheel
 *
 * @augments Highcharts.seriesTypes.sankey
 */
class DependencyWheelSeries extends SankeySeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A dependency wheel chart is a type of flow diagram, where all nodes are
     * laid out in a circle, and the flow between the are drawn as link bands.
     *
     * @sample highcharts/demo/dependency-wheel/
     *         Dependency wheel
     *
     * @extends      plotOptions.sankey
     * @exclude      dataSorting
     * @since        7.1.0
     * @product      highcharts
     * @requires     modules/dependency-wheel
     * @optionparent plotOptions.dependencywheel
     */
    public static defaultOptions: Highcharts.DependencyWheelSeriesOptions = merge(SankeySeries.defaultOptions, {
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
    } as Highcharts.DependencyWheelSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<DependencyWheelPoint> = void 0 as any;

    public options: Highcharts.DependencyWheelSeriesOptions = void 0 as any;

    public nodeColumns: Array<DependencyWheelSeries.ColumnArray> = void 0 as any;

    public nodes: Array<DependencyWheelPoint> = void 0 as any;

    public points: Array<DependencyWheelPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public animate(init?: boolean): void {
        if (!init) {
            var duration = animObject(this.options.animation).duration,
                step = (duration / 2) / this.nodes.length;
            this.nodes.forEach(function (point, i): void {
                var graphic = point.graphic;
                if (graphic) {
                    graphic.attr({ opacity: 0 });
                    setTimeout(function (): void {
                        (graphic as any).animate(
                            { opacity: 1 },
                            { duration: step }
                        );
                    }, step * i);
                }
            }, this);
            this.points.forEach(function (point): void {
                var graphic = point.graphic;
                if (!point.isNode && graphic) {
                    graphic.attr({ opacity: 0 })
                        .animate({
                            opacity: 1
                        }, this.options.animation);
                }
            }, this);

        }
    }

    public createNode(id: string): DependencyWheelPoint {
        var node = SankeySeries.prototype.createNode.call(
            this,
            id
        ) as DependencyWheelPoint;
        node.index = this.nodes.length - 1;

        /**
         * Return the sum of incoming and outgoing links.
         * @private
         */
        node.getSum = function (
            this: DependencyWheelPoint
        ): number {
            return node.linksFrom
                .concat(node.linksTo)
                .reduce(function (
                    acc: number,
                    link: DependencyWheelPoint
                ): number {
                    return acc + (link.weight as any);
                }, 0);
        };

        /**
         * Get the offset in weight values of a point/link.
         * @private
         */
        node.offset = function (
            point: DependencyWheelPoint
        ): (number|undefined) {

            var offset = 0,
                i: number,
                links = node.linksFrom.concat(node.linksTo),
                sliced: (boolean|undefined);

            /**
             * @private
             */
            function otherNode(
                link: DependencyWheelPoint
            ): DependencyWheelPoint {
                if (link.fromNode === node) {
                    return link.toNode;
                }
                return link.fromNode;
            }

            // Sort and slice the links to avoid links going out of each
            // node crossing each other.
            links.sort(function (a, b): number {
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
                offset += links[i].weight as any;
            }
        };

        return node;
    }

    /**
     * Dependency wheel has only one column, it runs along the perimeter.
     * @private
     */
    public createNodeColumns(): Array<SankeySeriesType.ColumnArray> {
        var columns = [this.createNodeColumn()];
        this.nodes.forEach(function (
            node: DependencyWheelPoint
        ): void {
            node.column = 0;
            columns[0].push(node);
        });
        return columns;
    }

    /**
     * Translate from vertical pixels to perimeter.
     * @private
     */
    public getNodePadding(): number {
        return (this.options.nodePadding as any) / Math.PI;
    }

    /**
     * @private
     * @todo Override the refactored sankey translateLink and translateNode
     * functions instead of the whole translate function.
     */
    public translate(): void {

        var options = this.options,
            factor = 2 * Math.PI /
                (this.chart.plotHeight + this.getNodePadding()),
            center = this.getCenter(),
            startAngle = ((options.startAngle as any) - 90) * H.deg2rad;

        SankeySeries.prototype.translate.call(this);

        this.nodeColumns[0].forEach(function (node): void {
            // Don't render the nodes if sum is 0 #12453
            if (node.sum) {
                var shapeArgs = node.shapeArgs,
                    centerX = center[0],
                    centerY = center[1],
                    r = center[2] / 2,
                    innerR = r - (options.nodeWidth as any),
                    start = startAngle + factor * shapeArgs.y,
                    end = startAngle +
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
                node.linksFrom.forEach(function (point): void {
                    if (point.linkBase) {
                        var distance;
                        var corners = point.linkBase.map(function (
                            top: number,
                            i: number
                        ): Highcharts.Dictionary<number> {
                            var angle = factor * top,
                                x = Math.cos(startAngle + angle) * (innerR + 1),
                                y = Math.sin(startAngle + angle) * (innerR + 1),
                                curveFactor: number = options.curveFactor as any;

                            // The distance between the from and to node
                            // along the perimeter. This affect how curved
                            // the link is, so that links between neighbours
                            // don't extend too far towards the center.
                            distance = Math.abs(
                                point.linkBase[3 - i] * factor - angle
                            );
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
                            d: [[
                                'M',
                                corners[0].x, corners[0].y
                            ], [
                                'A',
                                innerR, innerR,
                                0,
                                0, // long arc
                                1, // clockwise
                                corners[1].x, corners[1].y
                            ], [
                                'C',
                                corners[1].cpX, corners[1].cpY,
                                corners[2].cpX, corners[2].cpY,
                                corners[2].x, corners[2].y
                            ], [
                                'A',
                                innerR, innerR,
                                0,
                                0,
                                1,
                                corners[3].x, corners[3].y
                            ], [
                                'C',
                                corners[3].cpX, corners[3].cpY,
                                corners[0].cpX, corners[0].cpY,
                                corners[0].x, corners[0].y
                            ]]
                        };
                    }

                });
            }
        });
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface DependencyWheelSeries {
    getCenter: typeof PieSeries.prototype.getCenter;
    orderNodes: boolean;
    pointClass: typeof DependencyWheelPoint;
}
extend(DependencyWheelSeries.prototype, {
    orderNodes: false,
    getCenter: PieSeries.prototype.getCenter
});

/* *
 *
 *  Namespace
 *
 * */

namespace DependencyWheelSeries {
    export interface ColumnArray<T = DependencyWheelPoint> extends SankeySeriesType.ColumnArray<T> {
        // nothing here yets
    }
}

/* *
 *
 *  Class
 *
 * */

class DependencyWheelPoint extends SankeySeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public angle: number = void 0 as any;

    public fromNode: DependencyWheelPoint = void 0 as any;

    public index: number = void 0 as any;

    public linksFrom: Array<DependencyWheelPoint> = void 0 as any;

    public linksTo: Array<DependencyWheelPoint> = void 0 as any;

    public options: Highcharts.DependencyWheelPointOptions = void 0 as any;

    public series: DependencyWheelSeries = void 0 as any;

    public shapeArgs: SVGAttributes = void 0 as any;

    public toNode: DependencyWheelPoint = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Return a text path that the data label uses.
     * @private
     */
    public getDataLabelPath(label: SVGElement): SVGElement {
        var renderer = this.series.chart.renderer,
            shapeArgs = this.shapeArgs,
            upperHalf = this.angle < 0 || this.angle > Math.PI,
            start = shapeArgs.start,
            end = shapeArgs.end;

        if (!this.dataLabelPath) {
            this.dataLabelPath = renderer
                .arc({
                    open: true,
                    longArc: Math.abs(Math.abs(start) - Math.abs(end)) < Math.PI ? 0 : 1
                })
                // Add it inside the data label group so it gets destroyed
                // with the label
                .add(label);
        }

        this.dataLabelPath.attr({
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (
                shapeArgs.r +
                ((this.dataLabel as any).options.distance || 0)
            ),
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf
        });

        return this.dataLabelPath;
    }

    public isValid(): boolean {
        // No null points here
        return true;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface DependencyWheelPoint {
    setState: typeof NodesMixin['setNodeState'];
}
extend(DependencyWheelPoint.prototype, {
    setState: NodesMixin.setNodeState
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        dependencywheel: typeof DependencyWheelSeries;
    }
}
DependencyWheelSeries.prototype.pointClass = DependencyWheelPoint;
BaseSeries.registerSeriesType('dependencywheel', DependencyWheelSeries);

/* *
 *
 *  Default Export
 *
 * */

export default DependencyWheelSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `dependencywheel` series. If the [type](#series.dependencywheel.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dependencywheel
 * @exclude   dataSorting
 * @product   highcharts
 * @requires  modules/sankey
 * @requires  modules/dependency-wheel
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
