/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021-2026 Highsoft AS
 *  Author: Piotr Madej, Grzegorz Blachliński
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ArcDiagramSeriesOptions from './ArcDiagramSeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

import ArcDiagramPoint from './ArcDiagramPoint.js';
import ArcDiagramSeriesDefaults from './ArcDiagramSeriesDefaults.js';
import SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../Core/Utilities.js';
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import TextPath from '../../Extensions/TextPath.js';
TextPath.compose(SVGElement);

const { prototype: { symbols } } = SVGRenderer;
const {
    seriesTypes: {
        column: ColumnSeries,
        sankey: SankeySeries
    }
} = SeriesRegistry;
const {
    crisp,
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
 * @internal
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

    public static defaultOptions =
        merge(SankeySeries.defaultOptions, ArcDiagramSeriesDefaults);

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<ArcDiagramPoint>;

    public options!: ArcDiagramSeriesOptions;

    public nodeColumns!: Array<SankeyColumnComposition.ArrayComposition<ArcDiagramPoint>>;

    public nodes!: Array<ArcDiagramPoint>;

    public points!: Array<ArcDiagramPoint>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create node columns by analyzing the nodes and the relations between
     * incoming and outgoing links.
     * @internal
     */
    public createNodeColumns(): Array<SankeyColumnComposition.ArrayComposition<ArcDiagramPoint>> {
        const series = this,
            chart = series.chart,
            // Column needs casting, to much methods required at the same time
            column = SankeyColumnComposition.compose([] as Array<ArcDiagramPoint>, series);

        column.sankeyColumn.maxLength = chart.inverted ?
            chart.plotHeight : chart.plotWidth;

        // Get the translation factor needed for each column to fill up the plot
        // height
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
                    (
                        series.options.marker &&
                        series.options.marker.lineWidth || 0
                    ) -
                    (column.length - 1) *
                    series.nodePadding;

            // Because the minLinkWidth option doesn't obey the direct
            // translation, we need to run translation iteratively, check node
            // heights, remove those nodes affected by minLinkWidth, check
            // again, etc.
            while (column.length) {
                factor = remainingWidth / column.sankeyColumn.sum();
                skipPoint = false;
                i = column.length;
                while (i--) {
                    radius = (column[i].getSum()) * factor * scale;

                    const plotArea = Math.min(
                        chart.plotHeight,
                        chart.plotWidth
                    );

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
                node.scale = scale;
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
            const equalNodes = node.series.options.equalNodes,
                nodePadding = series.nodePadding,
                maxRadius = Math.min(
                    chart.plotWidth,
                    chart.plotHeight,
                    (column.sankeyColumn.maxLength || 0) /
                        series.nodes.length - nodePadding
                );
            let offset = column.sankeyColumn.additionalSpace || 0,
                totalNodeOffset;

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
     * @internal
     */
    public translateLink(point: ArcDiagramPoint): void {
        const series = this,
            fromNode = point.fromNode,
            toNode = point.toNode,
            chart = this.chart,
            translationFactor = series.translationFactor,
            pointOptions = point.options,
            seriesOptions = series.options,
            linkWeight = pick(
                pointOptions.linkWeight,
                seriesOptions.linkWeight,
                Math.max(
                    (point.weight || 0) *
                    translationFactor *
                    fromNode.scale,
                    (series.options.minLinkWidth || 0
                    )
                )),
            centeredLinks = point.series.options.centeredLinks,
            nodeTop = fromNode.nodeY;

        const getX = (
            node: ArcDiagramPoint,
            fromOrTo: string
        ): number => {
            const linkLeft = (
                (node.offset(point, fromOrTo) || 0) *
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
            bottom = nodeTop;

        if (fromX > toX) {
            [fromX, toX] = [toX, fromX];
        }

        if (seriesOptions.reversed) {
            [fromX, toX] = [toX, fromX];
            bottom = (chart.plotSizeY || 0) - bottom;
        }

        point.shapeType = 'path';
        point.linkBase = [
            fromX,
            fromX + linkWeight,
            toX,
            toX + linkWeight
        ];

        const linkRadius = (
            (toX + linkWeight - fromX) / Math.abs(toX + linkWeight - fromX)
        ) * pick(
            seriesOptions.linkRadius,
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
                    linkRadius,
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
                    linkRadius - linkWeight,
                    0,
                    0,
                    0,
                    fromX + linkWeight,
                    bottom
                ],
                ['Z']
            ]
        };

        point.dlBox = {
            x: fromX + (toX - fromX) / 2,
            y: bottom - linkRadius,
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
        point.x = point.plotX = 1;

        if (!point.color) {
            point.color = fromNode.color;
        }

    }

    /**
     * Run translation operations for one node.
     * @internal
     */
    public translateNode(
        node: ArcDiagramPoint,
        column: SankeyColumnComposition.ArrayComposition<ArcDiagramPoint>
    ): void {
        const series = this,
            translationFactor = series.translationFactor,
            chart = series.chart,
            maxNodesLength = chart.inverted ?
                chart.plotWidth : chart.plotHeight,
            options = series.options,
            maxRadius = Math.min(
                chart.plotWidth,
                chart.plotHeight,
                maxNodesLength / node.series.nodes.length - this.nodePadding
            ),
            sum = node.getSum() * (column.sankeyColumn.scale || 0),
            equalNodes = options.equalNodes,
            nodeHeight = equalNodes ?
                maxRadius :
                Math.max(
                    sum * translationFactor,
                    this.options.minLinkWidth || 0
                ),
            lineWidth = options.marker?.lineWidth || 0,
            nodeOffset = column.sankeyColumn.offset(node, translationFactor),
            fromNodeLeft = crisp(pick(
                nodeOffset && nodeOffset.absoluteLeft,
                (
                    (column.sankeyColumn.left(translationFactor) || 0) +
                    (nodeOffset && nodeOffset.relativeLeft || 0)
                )
            ), lineWidth),
            markerOptions = merge(options.marker, node.options.marker),
            symbol = markerOptions.symbol,
            markerRadius = markerOptions.radius,
            top = parseInt(options.offset ?? '100', 10) *
                (
                    (
                        chart.inverted ?
                            chart.plotWidth : chart.plotHeight
                    ) - (
                        crisp(
                            this.colDistance * (node.column || 0) +
                                (markerOptions.lineWidth || 0) / 2,
                            lineWidth
                        ) +
                        (column.sankeyColumn.scale || 0) *
                        (column.sankeyColumn.maxRadius || 0) / 2
                    )
                ) / 100;
        node.sum = sum;
        // If node sum is 0, don’t render the rect #12453
        if (sum) {
            // Draw the node
            node.nodeX = fromNodeLeft;
            node.nodeY = top;

            const x = fromNodeLeft,
                width = node.options.width || options.width || nodeHeight,
                height = node.options.height || options.height || nodeHeight;

            let y = top;

            if (options.reversed) {
                y = (chart.plotSizeY || 0) - top;
                if (chart.inverted) {
                    y = (chart.plotSizeY || 0) - top;
                }
            }

            if (this.mapOptionsToLevel) {
                // Calculate data label options for the point
                node.dlOptions = {
                    ...SankeySeries.getDLOptions({
                        level: this.mapOptionsToLevel[node.level],
                        optionsPoint: node.options
                    }),
                    zIndex: void 0
                };
            }

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

            node.shapeType = 'path';
            node.shapeArgs = {
                d: symbols[symbol || 'circle'](
                    x,
                    y - (markerRadius || height) / 2,
                    markerRadius || width,
                    markerRadius || height
                ),
                width: markerRadius || width,
                height: markerRadius || height
            };

            node.dlBox = {
                x: x + width / 2,
                y: y,
                height: 0,
                width: 0
            };
        } else {
            node.dlOptions = {
                enabled: false
            };
        }
    }
    // Networkgraph has two separate collecions of nodes and lines, render
    // dataLabels for both sets:
    public drawDataLabels(): void {
        if (this.options.dataLabels) {
            const textPath = this.options.dataLabels.textPath;

            // Render node labels:
            ColumnSeries.prototype.drawDataLabels.call(this, this.nodes);

            // Render link labels:

            this.options.dataLabels.textPath =
                this.options.dataLabels.linkTextPath;
            ColumnSeries.prototype.drawDataLabels.call(this, this.data);

            // Restore nodes

            this.options.dataLabels.textPath = textPath;
        }
    }

    public pointAttribs(
        point?: ArcDiagramPoint,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        state?: StatesOptionsKey
    ): SVGAttributes {
        if (point && point.isNode) {
            const { ...attrs } = Series.prototype.pointAttribs
                .apply(this, arguments);
            return attrs;
        }
        return super.pointAttribs.apply(this, arguments);
    }

    public markerAttribs(
        point: ArcDiagramPoint
    ): SVGAttributes {
        if (point.isNode) {
            return super.markerAttribs.apply(this, arguments);
        }
        return {};
    }
    /* eslint-enable valid-jsdoc */
}

/* *
 *
 *  Prototype Properties
 *
 * */

/** @internal */
interface ArcDiagramSeries {
    orderNodes: false;
    pointClass: typeof ArcDiagramPoint;
}
extend(ArcDiagramSeries.prototype, {
    orderNodes: false
});

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        arcdiagram: typeof ArcDiagramSeries;
    }
}
ArcDiagramSeries.prototype.pointClass = ArcDiagramPoint;
SeriesRegistry.registerSeriesType('arcdiagram', ArcDiagramSeries);

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ArcDiagramSeries;
