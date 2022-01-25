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

/* *
 *
 *  Imports
 *
 * */

import type TreegraphPoint from './TreegraphPoint';
import type TreegraphSeriesOptions from './TreegraphSeriesOptions.js';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

import TreegraphNode from './TreegraphNode.js';
import OrganizationSeries from '../Organization/OrganizationSeries.js';
import SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import TU from '../TreeUtilities.js';
const { prototype: { symbols } } = SVGRenderer;
const { getLevelOptions } = TU;
const {
    seriesTypes: {
        organization: { prototype: orgProto },
        sankey: { prototype: sankeyProto }
    }
} = SeriesRegistry;

import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
import { Palette } from '../../Core/Color/Palettes';
const { merge, pick, addEvent, relativeLength } = U;

import './TreegraphLayout.js';
import RendererRegistry from '../../Core/Renderer/RendererRegistry';

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
class TreegraphSeries extends OrganizationSeries {
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
     * @exclude       linkColor, linkLineWidth, linkRadius
     * @product      highcharts
     * @requires     modules/sankey
     * @requires     modules/organization
     * @requires     modules/treegraph
     * @optionparent plotOptions.treegraph
     */
    public static defaultOptions: TreegraphSeriesOptions = merge(
        OrganizationSeries.defaultOptions,
        {
            radius: 10,
            alignNodes: 'right',
            minLinkWidth: 1,
            borderWidth: 1,
            siblingDistance: 20,
            link: {
                type: 'straight',
                width: 1,
                color: Palette.neutralColor80
            }
        }
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /* eslint-disable valid-jsdoc */
    public data: Array<TreegraphPoint> = void 0 as any;

    public options: TreegraphSeriesOptions = void 0 as any;

    public points: Array<TreegraphPoint> = void 0 as any;

    public siblingDistance: number = void 0 as any;

    public nodeColumns: Array<
    SankeyColumnComposition.ArrayComposition<TreegraphNode>
    > = void 0 as any;

    public nodes: Array<TreegraphNode> = void 0 as any;

    public layoutModifier: { ax: number; bx: number; ay: number; by: number } =
        void 0 as any;
    layoutAlgorythm: Highcharts.TreegraphLayout = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */
    public translate(): void {
        if (!this.processedXData) {
            this.processData();
        }
        this.generatePoints();

        this.nodeColumns = this.createNodeColumns();
        this.nodeWidth = relativeLength(
            this.options.nodeWidth as any,
            this.chart.plotSizeX as any
        );

        const series = this,
            chart = this.chart,
            plotSizeX = chart.plotSizeX as number,
            plotSizeY = chart.plotSizeY as number,
            options = this.options,
            nodeWidth = this.nodeWidth,
            nodeColumns = this.nodeColumns;

        this.nodePadding = this.getNodePadding();

        // Find out how much space is needed. Base it on the translation
        // factor of the most spaceous column.
        this.translationFactor = nodeColumns.reduce(
            (
                translationFactor: number,
                column: SankeyColumnComposition.ArrayComposition<TreegraphNode>
            ): number =>
                Math.min(
                    translationFactor,
                    column.sankeyColumn.getTranslationFactor(series)
                ),
            Infinity
        );

        let columns = (this as any).nodeColumns;
        let sumOfRadius = columns.reduce(
            (partialSum: number, column: any): number =>
                partialSum + column.maxRadius,
            0
        );

        (this as any).emptySpaceWidth =
            ((chart as any).plotSizeX - sumOfRadius * 2) /
            Math.max(1, nodeColumns.length - 1);

        this.colDistance =
            ((chart.plotSizeX as any) -
                nodeWidth -
                (options.borderWidth as any)) /
            Math.max(1, nodeColumns.length - 1);

        // Calculate level options used in sankey and organization
        series.mapOptionsToLevel = getLevelOptions({
            // NOTE: if support for allowTraversingTree is added, then from
            // should be the level of the root node.
            from: 1,
            levels: options.levels,
            to: nodeColumns.length - 1, // Height of the tree
            defaults: {
                borderColor: options.borderColor,
                borderRadius: options.borderRadius, // organization series
                borderWidth: options.borderWidth,
                color: series.color,
                colorByPoint: options.colorByPoint,
                // NOTE: if support for allowTraversingTree is added, then
                // levelIsConstant should be optional.
                levelIsConstant: true,
                linkColor: options.linkColor, // organization series
                linkLineWidth: options.linkLineWidth, // organization series
                linkOpacity: options.linkOpacity,
                states: options.states
            }
        });

        // if (this.layout) {
        const layoutAlgorythm = new H.treeLayouts.Walker();
        // }
        layoutAlgorythm.init(series);
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity,
            maxXRadius = 0,
            maxYRadius = 0,
            minXRadius = 0,
            minYRadius = 0;
            // TODO move this search to layout Algorythm
        series.nodes.forEach((node: TreegraphNode): void => {
            if (node.xPosition < minX) {
                minX = node.xPosition;
                minXRadius = pick(node.options.radius, series.options.radius);
            }
            if (node.xPosition > maxX) {
                maxX = node.xPosition;
                maxXRadius = pick(node.options.radius, series.options.radius);
            }
            if (node.yPosition < minY) {
                minY = node.yPosition;
                minYRadius = pick(node.options.radius, series.options.radius);
            }
            if (node.yPosition > maxY) {
                maxY = node.yPosition;
                maxYRadius = pick(node.options.radius, series.options.radius);
            }
        });

        let ay = (maxY === minY ?
            1 :
            (plotSizeY - 2 * minYRadius) / (maxY - minY));
        let by = (maxY === minY ? plotSizeY / 2 : -ay * minY);
        let ax = (maxX === minX ?
            1 :
            (plotSizeX - 2 * maxXRadius) / (maxX - minX));
        let bx = (maxX === minX ? plotSizeX / 2 : -ax * minX);

        series.layoutModifier = { ax, bx, ay, by };


        // First translate all nodes so we can use them when drawing links
        nodeColumns.forEach(function (
            this: TreegraphSeries,
            column: SankeyColumnComposition.ArrayComposition<TreegraphNode>
        ): void {
            column.forEach(function (node): void {
                series.translateNode(node, column);
            });
        },
        this);

        // Then translate links
        this.nodes.forEach(function (node): void {
            // Translate the links from this node
            node.linksFrom.forEach(function (linkPoint): void {
                // If weight is 0 - don't render the link path #12453,
                // render null points (for organization chart)
                if ((linkPoint.weight || linkPoint.isNull) && linkPoint.to) {
                    series.translateLink(linkPoint as TreegraphPoint);
                    linkPoint.allowShadow = false;
                }
            });
        });
    }
    public pointAttribs(
        point: TreegraphPoint,
        state: StatesOptionsKey
    ): SVGAttributes {
        const series = this,
            attribs = orgProto.pointAttribs.call(this, point, state);

        if (point.isNode) {
            attribs.r =
                point.options.radius || series.options.radius || attribs.r;
        }

        return attribs;
    }

    /**
     * Run translation operations for one node.
     * @private
     */

    public translateNode(
        node: TreegraphNode,
        column: SankeyColumnComposition.ArrayComposition<TreegraphNode>
    ): void {
        const translationFactor = this.translationFactor,
            chart = this.chart,
            options = this.options,
            crisp = (Math.round(options.borderWidth) % 2) / 2,
            nodeOffset = column.sankeyColumn.offset(
                node,
                translationFactor
            ) as any,
            plotSizeY = chart.plotSizeY as number,
            plotSizeX = chart.plotSizeX as number,
            fromNodeTop =
                Math.floor(
                    pick(
                        nodeOffset.absoluteTop,
                        column.sankeyColumn.top(translationFactor) +
                            nodeOffset.relativeTop
                    )
                ) + crisp;

        const previousColumn = (this as any).nodeColumns[node.column - 1];
        const emptySpaceWidth = (this as any).emptySpaceWidth;

        const xOffset = previousColumn ?
            previousColumn.xOffset +
                previousColumn.maxRadius * 2 +
                emptySpaceWidth :
            0;

        const nodeLeft = chart.inverted ?
            (plotSizeX as number) - xOffset :
            xOffset;
        node.sum = 1;

        // Draw the node
        node.shapeType = 'circle';
        node.nodeX = nodeLeft;
        node.nodeY = fromNodeTop;
        (column as any).xOffset = xOffset;

        const { ax, bx, ay, by } = this.layoutModifier,
            x = ax * node.xPosition + bx,
            y = ay * node.yPosition + by;

        // shapeArgs width and height set to 0 to align dataLabels correctly
        // in inverted chart
        node.shapeType = 'path';
        const markerOptions = merge(options.marker, node.options.marker);
        const symbol = markerOptions.symbol;
        const markerRadius = pick(
            node.options.radius,
            markerOptions.radius,
            this.options.radius
        );
        node.shapeArgs = {
            d: symbols[symbol || 'circle'](
                chart.inverted ? plotSizeX - markerRadius * 2 - x : x,
                y,
                // y - (markerRadius || height) / 2,
                markerRadius * 2,
                markerRadius * 2
            ),
            x: chart.inverted ? plotSizeX - markerRadius * 2 - x : x,
            y: y,
            width: markerRadius * 2,
            height: markerRadius * 2
        };
        node.shapeArgs.display = node.hasShape() ? '' : 'none';
        // Calculate data label options for the point
        node.dlOptions = TreegraphSeries.getDLOptions({
            level: (this.mapOptionsToLevel as any)[node.level],
            optionsPoint: node.options
        });
        // Pass test in drawPoints
        node.plotY = 1;
        // Set the anchor position for tooltips
        node.tooltipPos = chart.inverted ?
            [plotSizeY - y, plotSizeX - x] :
            [x, y];
    }

    public alignDataLabel(): void {
        sankeyProto.alignDataLabel.apply(this, arguments);
    }

    public createNodeColumns(): Array<
    SankeyColumnComposition.ArrayComposition<TreegraphNode>
    > {
        const originalNodes = this.nodes;
        this.nodes = this.nodes.filter((value: any): boolean => !value.hidden);
        const nodeColumns = super.createNodeColumns.apply(this, arguments);
        nodeColumns.forEach(function (column): void {
            column.sankeyColumn.getTranslationFactor = function (
                series
            ): number {
                const nodes = column.slice();
                const minLinkWidth = series.options.minLinkWidth || 0;
                let exceedsMinLinkWidth: boolean;
                let factor = 0;
                let i: number;
                // Will be changed after arcDiagram will be merged.
                let maxRadius = (column as any).maxRadius || 0;

                let remainingHeight =
                    (series.chart.plotSizeY as any) -
                    (series.options.borderWidth as any) -
                    (column.length - 1) * series.nodePadding;

                // Because the minLinkWidth option doesn't obey the direct
                // translation, we need to run translation iteratively,
                // check node heights, remove those nodes affected
                // by minLinkWidth, check again, etc.
                while (column.length) {
                    factor = remainingHeight / column.sankeyColumn.sum();
                    exceedsMinLinkWidth = false;
                    i = column.length;
                    while (i--) {
                        if (column[i].getSum() * factor < minLinkWidth) {
                            column.splice(i, 1);
                            remainingHeight -= minLinkWidth;
                            exceedsMinLinkWidth = true;
                        }

                        maxRadius = Math.max(
                            maxRadius,
                            pick(
                                (column[i].options as any).radius,
                                (column[i].series.options as any).radius,
                                0
                            )
                        );
                    }
                    if (!exceedsMinLinkWidth) {
                        break;
                    }
                }

                (column as any).maxRadius = maxRadius;

                // Re-insert original nodes
                column.length = 0;
                nodes.forEach((node): number => column.push(node));
                return factor;
            };
        });
        this.nodes = originalNodes;
        return nodeColumns as unknown as Array<
        SankeyColumnComposition.ArrayComposition<TreegraphNode>
        >;
    }
}
// Handle showing and hiding of the points
addEvent(TreegraphSeries, 'click', function (e: any): void {
    const point = e.point as TreegraphPoint;
    point.collapsed = !point.collapsed;

    collapseTreeFromPoint(point, point.collapsed);
    this.redraw();
});

function collapseTreeFromPoint(
    point: TreegraphPoint,
    collapsed: boolean
): void {
    point.linksFrom.forEach((link: any): void => {
        link.toNode.hidden = collapsed;
        link.update({ visible: !collapsed }, false);
        // to change
        link.toNode.update({ visible: !collapsed }, false);
        collapseTreeFromPoint(link.toNode, link.toNode.collapsed || collapsed);
    });
}
// TODO check for circular data
// TODO check drilldown support
/* *
 *
 *  Prototype Properties
 *
 * */

interface TreegraphSeries {
    inverted?: boolean;
    pointClass: typeof TreegraphNode;
}

/* *
 *
 *  Registry
 *
 * */

TreegraphSeries.prototype.pointClass = TreegraphNode;
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        treegraph: typeof TreegraphSeries;
    }
}
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

''; // gets doclets above into transpiled version
