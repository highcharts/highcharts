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

import type DependencyWheelSeriesOptions from '../DependencyWheel/DependencyWheelSeriesOptions';
import type SankeySeriesType from '../Sankey/SankeySeries';
import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import DependencyWheelPoint from '../DependencyWheel/DependencyWheelPoint.js';
import H from '../../Core/Globals.js';
const { deg2rad } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        pie: PieSeries,
        sankey: SankeySeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge,
    pick
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
     * @requires     modules/arc-diagram
     * @optionparent plotOptions.dependencywheel
     */
    public static defaultOptions: DependencyWheelSeriesOptions = merge(SankeySeries.defaultOptions, {
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
    } as DependencyWheelSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<DependencyWheelPoint> = void 0 as any;

    public options: DependencyWheelSeriesOptions = void 0 as any;

    public nodeColumns: Array<ArcDiagramSeries.ColumnArray> = void 0 as any;

    public nodes: Array<DependencyWheelPoint> = void 0 as any;

    public points: Array<DependencyWheelPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public createNode(id: string): DependencyWheelPoint {
        const node = SankeySeries.prototype.createNode.call(
            this,
            id
        ) as DependencyWheelPoint;

        return node;
    }

    /**
     * Dependency wheel has only one column, it runs along the perimeter.
     * @private
     */
    public createNodeColumns(): Array<SankeySeriesType.ColumnArray> {
        const columns = [this.createNodeColumn()];
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

        SankeySeries.prototype.translate.call(this);

        this.nodeColumns[0].forEach(function (node): void {
        });
    }

    /**
     * Run translation operations for one link.
     * @private
     */
    public translateLink(point: DependencyWheelPoint): void {

        const getY = (
            node: DependencyWheelPoint,
            fromOrTo: string
        ): number => {
            const linkTop = (
                (node.offset(point, fromOrTo) as any) *
                translationFactor
            );
            const y = Math.min(
                node.nodeY + linkTop,
                // Prevent links from spilling below the node (#12014)
                node.nodeY + (node.shapeArgs && node.shapeArgs.height || 0) - linkHeight
            );
            return y;
        };

        let fromNode = point.fromNode,
            toNode = point.toNode,
            chart = this.chart,
            translationFactor = this.translationFactor,
            linkHeight = pick((point.series.options as any).linkHeight, Math.max(
                (point.weight as any) * translationFactor,
                (this.options.minLinkWidth as any)
            )),
            centeredLinks = (point.series.options as any).centeredLinks,
            fromY = centeredLinks ?
                fromNode.nodeY +
                    ((fromNode.shapeArgs.height || 0) - linkHeight) / 2 :
                getY(fromNode, 'linksFrom'),
            toY = centeredLinks ? toNode.nodeY +
                ((fromNode.shapeArgs.height || 0) - linkHeight) / 2 :
                getY(toNode, 'linksTo'),
            nodeLeft = fromNode.nodeX,
            nodeW = this.nodeWidth,
            right = nodeLeft + nodeW,
            majorRadius,
            linkWidth = linkHeight;

        if (fromY > toY) {
            [fromY, toY] = [toY, fromY];
        }

        if (chart.inverted) {
            fromY = (chart.plotSizeY as any) - fromY;
            toY = (chart.plotSizeY || 0) - toY;
            right = right - 2 * nodeW;
            nodeW = -nodeW;
            linkHeight = -linkHeight;
        }

        if ((chart as any).options.chart.reversed) {
            [fromY, toY] = [toY, fromY];
            right = (chart.plotSizeX as any) - right;
            if (chart.inverted) {
                right -= nodeW;
            }
            linkWidth = -linkWidth;
        }

        point.shapeType = 'path';
        point.linkBase = [
            fromY,
            fromY + linkHeight,
            toY,
            toY + linkHeight
        ];

        majorRadius = pick(
            (point.series.options as any).majorRadius,
            Math.min((toY + linkHeight - fromY) / 2, chart.plotWidth / 2, chart.plotHeight / 2)
        );

        point.shapeArgs = {
            d: [
                ['M', right, fromY],
                [
                    'A',
                    majorRadius,
                    (toY + linkHeight - fromY) / 2,
                    0,
                    0,
                    1,
                    right,
                    toY + linkHeight
                ],
                ['L', right, toY],
                [
                    'A',
                    majorRadius - linkHeight,
                    (toY - fromY - linkHeight) / 2,
                    0,
                    0,
                    0,
                    right,
                    fromY + linkHeight
                ],
                ['Z']
            ]
        } as any;

        // Place data labels in the middle
        point.dlBox = {
            x: nodeLeft + (right - nodeLeft + nodeW) / 2,
            y: fromY + (toY - fromY) / 2,
            height: linkHeight,
            width: 0
        };

        // And set the tooltip anchor in the middle
        point.tooltipPos = chart.inverted ? [
            (chart.plotSizeY as any) - point.dlBox.y - linkHeight / 2,
            (chart.plotSizeX as any) - point.dlBox.x
        ] : [
            point.dlBox.x,
            point.dlBox.y + linkHeight / 2
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
        node: DependencyWheelPoint,
        column: ArcDiagramSeries.ColumnArray
    ): void {
        const translationFactor = this.translationFactor,
            chart = this.chart,
            maxNodesLength = chart.inverted ? chart.plotWidth : chart.plotHeight,
            options = this.options,
            centeredLinks = (node.series.options as any).centeredLinks,
            sum = node.getSum(),
            nodeHeight = centeredLinks ?
                maxNodesLength / node.series.nodes.length - this.nodePadding :
                Math.max(
                    Math.round(sum * translationFactor),
                    this.options.minLinkWidth as any
                ),
            crisp = Math.round(options.borderWidth as any) % 2 / 2,
            nodeOffset = column.offset(node, translationFactor),
            fromNodeTop = Math.floor(pick(
                (nodeOffset as any).absoluteTop,
                (
                    column.top(translationFactor) +
                    (nodeOffset as any).relativeTop
                )
            )) + crisp,
            left = Math.floor(
                this.colDistance * (node.column as any) +
                (options.borderWidth as any) / 2
            ) + crisp;
        let nodeWidth = Math.round(this.nodeWidth);

        let nodeLeft = chart.inverted ?
            (chart.plotSizeX as any) - left :
            left;

        node.sum = sum;
        // If node sum is 0, don’t render the rect #12453
        if (sum) {
            // Draw the node
            node.shapeType = 'rect';

            node.nodeX = nodeLeft;
            node.nodeY = fromNodeTop;

            let x = nodeLeft,
                y = fromNodeTop,
                width = node.options.width || options.width || nodeWidth,
                height = node.options.height || options.height || nodeHeight;

            if (chart.inverted) {
                x = nodeLeft - nodeWidth;
                y = (chart.plotSizeY as any) - fromNodeTop - nodeHeight;
                width = node.options.height || options.height || nodeWidth;
                height = node.options.width || options.width || nodeHeight;
                nodeWidth = -nodeWidth;
            }
            if ((chart as any).options.chart.reversed) {
                x = (chart.plotSizeX as any) - nodeLeft - nodeWidth;
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
                (chart.plotSizeY as any) - y - height / 2,
                (chart.plotSizeX as any) - x - width / 2
            ] : [
                x + width / 2,
                y + height / 2
            ];

            node.shapeArgs = {
                x,
                y,
                width,
                height,
                display: node.hasShape() ? '' : 'none'
            };
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
 *  Namespace
 *
 * */

namespace ArcDiagramSeries {
    export interface ColumnArray<T = DependencyWheelPoint> extends SankeySeriesType.ColumnArray<T> {
        // nothing here yets
    }
}

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
