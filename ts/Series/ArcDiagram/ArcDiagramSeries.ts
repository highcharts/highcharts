/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021 Piotr Madej, Grzegorz Blachliński
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

import type ArcDiagramSeriesOptions from './ArcDiagramSeriesOptions';
import type SankeySeriesType from '../Sankey/SankeySeries';
import DependencyWheelPoint from '../DependencyWheel/DependencyWheelPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
const {
    seriesTypes: {
        sankey: SankeySeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
import ArcDiagramPoint from './ArcDiagramPoint';
import SankeyPoint from '../Sankey/SankeyPoint';
const {
    extend,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.arcdiagram
 *
 * @augments Highcharts.seriesTypes.sankey
 */
class ArcDiagramSeries extends SankeySeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     *  Arc diagram series is a chart drawing style in which
     *  the vertices of the chart are positioned along a line
     *  on the Euclidean plane and the edges are drawn as a semicircle
     *  in one of the two half-planes delimited by the line,
     *  or as smooth curves formed by sequences of semicircles.
     *
     * @sample highcharts/demo/dependency-wheel/
     *         Dependency wheel
     *
     * @extends      plotOptions.sankey
     * @exclude      dataSorting
     * @since        7.1.0
     * @product      highcharts
     * @requires     modules/arc-diagram
     * @optionparent plotOptions.dependencywheel
     */
    public static defaultOptions: ArcDiagramSeriesOptions = merge(SankeySeries.defaultOptions, {
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
        nodeShape: 'circle',
        equalNodes: false,

        /**
         * The start angle of the dependency wheel, in degrees where 0 is up.
         */
        startAngle: 0
    } as ArcDiagramSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<ArcDiagramPoint> = void 0 as any;

    public options: ArcDiagramSeriesOptions = void 0 as any;

    public nodeColumns: Array<SankeyColumnComposition.ArrayComposition<SankeyPoint>> = void 0 as any;

    public nodes: Array<ArcDiagramPoint> = void 0 as any;

    public points: Array<ArcDiagramPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */
    public createNodeColumns(): Array<SankeyColumnComposition.ArrayComposition<ArcDiagramPoint>> {
        const series = this,
            chart = series.chart,
            // column needs casting, to much methods required at the same time
            column = SankeyColumnComposition.compose([], this) as SankeyColumnComposition.ArrayComposition<ArcDiagramPoint>;

        column.sankeyColumn.maxLength = chart.inverted ?
            chart.plotHeight : chart.plotWidth;

        // Get the translation factor needed for each column to fill up the
        // plot height
        column.sankeyColumn.getTranslationFactor = (
            series: ArcDiagramSeries
        ): number => {
            const nodes = column.slice(),
                minLinkWidth = this.options.minLinkWidth || 0;

            let skipPoint: boolean,
                factor = 0,
                i: number,
                radius,
                maxRadius: number = 0,
                scale = 1,
                additionalSpace = 0,
                remainingWidth =
                    (chart.plotSizeX || 0) -
                    (series.options.borderWidth || 0) -
                    (column.length - 1) *
                    series.nodePadding;

            // Because the minLinkWidth option doesn't obey the direct
            // translation, we need to run translation iteratively, check
            // node heights, remove those nodes affected by minLinkWidth,
            // check again, etc.
            while (column.length) {
                factor = remainingWidth / column.sankeyColumn.sum();
                skipPoint = false;
                i = column.length;
                while (i--) {
                    radius = (column[i].getSum()) * factor * scale;

                    let plotArea = Math.min(chart.plotHeight, chart.plotWidth);

                    if (radius > plotArea) {
                        scale = Math.min(plotArea / radius, scale);
                    } else if (radius < minLinkWidth) {
                        column.splice(i, 1);
                        remainingWidth -= minLinkWidth;
                        radius = minLinkWidth;
                        skipPoint = true;
                    }
                    additionalSpace += radius * (1 - scale) / 2;
                    maxRadius = Math.max(maxRadius, radius);
                }
                if (!skipPoint) {
                    break;
                }
            }

            // Re-insert original nodes
            column.length = 0;
            nodes.forEach((node): void => {
                (node as any).scale = scale;
                column.push(node);
            });
            column.sankeyColumn.maxRadius = maxRadius;
            column.sankeyColumn.scale = scale;
            column.sankeyColumn.additionalSpace = additionalSpace;
            return factor;
        };

        column.sankeyColumn.offset = function (
            node: ArcDiagramPoint,
            factor: number
        ): (Record<string, number>|undefined) {
            const equalNodes = node.series.options.equalNodes;
            let offset = column.sankeyColumn.additionalSpace || 0,
                totalNodeOffset,
                nodePadding = series.nodePadding,
                maxRadius = Math.min(
                    chart.plotWidth,
                    chart.plotHeight,
                    (column.sankeyColumn.maxLength || 0) /
                        series.nodes.length - nodePadding
                );

            for (let i = 0; i < column.length; i++) {
                const sum = column[i].getSum() *
                    (column.sankeyColumn.scale || 0);
                const width = equalNodes ?
                    maxRadius :
                    Math.max(
                        sum * factor,
                        series.options.minLinkWidth || 0
                    );

                if (sum) {
                    totalNodeOffset = width + nodePadding;
                } else {
                    // If node sum equals 0 nodePadding is missed #12453
                    totalNodeOffset = 0;
                }
                if (column[i] === node) {
                    return {
                        relativeLeft: offset + relativeLength(
                            node.options.offset || 0,
                            totalNodeOffset
                        )
                    };
                }
                offset += totalNodeOffset;
            }
        };

        // Add nodes directly to the column right after it's creation
        series.nodes.forEach(function (
            node: ArcDiagramPoint
        ): void {
            node.column = 0;
            column.push(node);
        });
        return [column];
    }

    /**
     * Run translation operations for one link.
     * @private
     */
    public translateLink(point: ArcDiagramPoint): void {
        const fromNode = point.fromNode,
            toNode = point.toNode,
            chart = this.chart,
            translationFactor = this.translationFactor,
            pointOptions = point.options,
            seriesOptions = this.options,
            linkWeight = pick(
                pointOptions.linkWeight,
                seriesOptions.linkWeight,
                Math.max(
                    (point.weight || 0) *
                    translationFactor *
                    (fromNode as any).scale,
                    (this.options.minLinkWidth || 0)
                )),
            centeredLinks = (point.series.options as any).centeredLinks,
            nodeTop = fromNode.nodeY;

        const getX = (
            node: ArcDiagramPoint,
            fromOrTo: string
        ): number => {
            const linkLeft = (
                (node.offset(point, fromOrTo) as any) *
                translationFactor
            );
            const x = Math.min(
                node.nodeX + linkLeft,
                // Prevent links from spilling below the node (#12014)
                node.nodeX + (
                    node.shapeArgs && node.shapeArgs.height || 0
                ) - linkWeight
            );
            return x;
        };

        let fromX = centeredLinks ?
                fromNode.nodeX +
                    ((fromNode.shapeArgs.height || 0) - linkWeight) / 2 :
                getX(fromNode, 'linksFrom'),
            toX = centeredLinks ? toNode.nodeX +
                ((toNode.shapeArgs.height || 0) - linkWeight) / 2 :
                getX(toNode, 'linksTo'),
            bottom = nodeTop,
            linkWidth = linkWeight;

        if (fromX > toX) {
            [fromX, toX] = [toX, fromX];
        }

        if ((chart as any).options.chart.reversed) {
            [fromX, toX] = [toX, fromX];
            bottom = (chart.plotSizeY || 0) - bottom;
            linkWidth = -linkWidth;
        }

        point.shapeType = 'path';
        point.linkBase = [
            fromX,
            fromX + linkWeight,
            toX,
            toX + linkWeight
        ];

        const majorRadius = (
            (toX + linkWeight - fromX) / Math.abs(toX + linkWeight - fromX)
        ) * pick(
            (point.series.options as any).majorRadius,
            Math.min(
                Math.abs(toX + linkWeight - fromX) / 2,
                fromNode.nodeY - Math.abs(linkWeight)
            )
        );

        point.shapeArgs = {
            d: [
                ['M', fromX, bottom],
                [
                    'A',
                    (toX + linkWeight - fromX) / 2,
                    majorRadius,
                    0,
                    0,
                    1,
                    toX + linkWeight,
                    bottom
                ],
                ['L', toX, bottom],
                [
                    'A',
                    (toX - fromX - linkWeight) / 2,
                    majorRadius - linkWeight,
                    0,
                    0,
                    0,
                    fromX + linkWeight,
                    bottom
                ],
                ['Z']
            ]
        } as any;

        point.dlBox = {
            x: nodeTop + (bottom - nodeTop) / 2,
            y: fromX + (toX - fromX) / 2,
            height: linkWeight,
            width: 0
        };

        // And set the tooltip anchor in the middle
        point.tooltipPos = chart.inverted ? [
            (chart.plotSizeY || 0) - point.dlBox.y - linkWeight / 2,
            (chart.plotSizeX || 0) - point.dlBox.x
        ] : [
            point.dlBox.x,
            point.dlBox.y + linkWeight / 2
        ];

        // Pass test in drawPoints
        point.y = point.plotY = 1;

        if (!point.color) {
            point.color = fromNode.color;
        }

    }

    /**
     * Run translation operations for one node.
     * @private
     */
    public translateNode(
        node: ArcDiagramPoint,
        column: SankeyColumnComposition.ArrayComposition<ArcDiagramPoint>
    ): void {
        const translationFactor = this.translationFactor,
            chart = this.chart,
            maxNodesLength = chart.inverted ?
                chart.plotWidth : chart.plotHeight,
            options = this.options,
            maxRadius = Math.min(
                chart.plotWidth,
                chart.plotHeight,
                maxNodesLength / node.series.nodes.length - this.nodePadding
            ),
            sum = node.getSum() * (column.sankeyColumn.scale || 0),
            equalNodes = (node.series.options as any).equalNodes,
            nodeHeight = equalNodes ?
                maxRadius :
                Math.max(
                    sum * translationFactor,
                    this.options.minLinkWidth || 0
                ),
            crisp = Math.round(options.borderWidth || 0) % 2 / 2,
            nodeOffset = column.sankeyColumn.offset(node, translationFactor),
            fromNodeLeft = Math.floor(pick(
                (nodeOffset as any).absoluteLeft,
                (
                    column.sankeyColumn.left(translationFactor) +
                    (nodeOffset as any).relativeLeft
                )
            )) + crisp,
            top = (options as any).centerPos ? // POC for centering the nodes
                parseInt((options as any).centerPos, 10) *
                (
                    (
                        chart.inverted ?
                            chart.plotWidth : chart.plotHeight
                    ) -
                    Math.min(
                        maxRadius / 2,
                        (column.sankeyColumn.scale || 0) *
                            (column.sankeyColumn.maxRadius || 0) / 2
                    )
                ) / 100 :
                (chart.inverted ?
                    chart.plotWidth : chart.plotHeight) - (Math.floor(
                    this.colDistance * (node.column || 0) +
                    (options.borderWidth || 0) / 2
                ) + crisp +
                (column.sankeyColumn.scale || 0) *
                    (column.sankeyColumn.maxRadius || 0) / 2
                );
        node.sum = sum;
        // If node sum is 0, don’t render the rect #12453
        if (sum) {
            // Draw the node
            node.shapeType = (node.series.options as any).nodeShape;
            node.nodeX = fromNodeLeft;
            node.nodeY = top;

            let x = fromNodeLeft,
                y = top,
                width = node.options.width || options.width || nodeHeight,
                height = node.options.height || options.height || nodeHeight;

            if ((chart as any).options.chart.reversed) {
                y = (chart.plotSizeY || 0) - top;
                if (chart.inverted) {
                    y = (chart.plotSizeY || 0) - top;
                }
            }

            // Calculate data label options for the point
            node.dlOptions = SankeySeries.getDLOptions({
                level: (this.mapOptionsToLevel as any)[node.level],
                optionsPoint: node.options
            });

            // Pass test in drawPoints
            node.plotX = 1;
            node.plotY = 1;

            // Set the anchor position for tooltips
            node.tooltipPos = chart.inverted ? [
                (chart.plotSizeY || 0) - y - height / 2,
                (chart.plotSizeX || 0) - x - width / 2
            ] : [
                x + width / 2,
                y + height / 2
            ];

            if (node.shapeType === 'circle') {
                node.shapeArgs = {
                    x: x + width / 2,
                    y: y,
                    r: height / 2,
                    width: width,
                    height,
                    display: node.hasShape() ? '' : 'none'
                };

                node.dlBox = {
                    x: x + width / 2,
                    y: y,
                    height: 0,
                    width: 0
                };

            } else {
                node.shapeArgs = {
                    x,
                    y,
                    width,
                    height,
                    display: node.hasShape() ? '' : 'none'
                };
            }

        } else {
            node.dlOptions = {
                enabled: false
            };
        }
    }

    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface ArcDiagramSeries {
    orderNodes: boolean;
    pointClass: typeof DependencyWheelPoint;
}
extend(ArcDiagramSeries.prototype, {
    orderNodes: false
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        arcdiagram: typeof ArcDiagramSeries;
    }
}
ArcDiagramSeries.prototype.pointClass = DependencyWheelPoint;
SeriesRegistry.registerSeriesType('arcdiagram', ArcDiagramSeries);

/* *
 *
 *  Default Export
 *
 * */

export default ArcDiagramSeries;

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
