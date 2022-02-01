/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
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

import NodesComposition from '../NodesComposition.js';
import OrganizationSeries from '../Organization/OrganizationSeries.js';
import SankeyColumnComposition from '../Sankey/SankeyColumnComposition.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import TreegraphNode from './TreegraphNode.js';
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
const { merge, pick, addEvent, relativeLength, stableSort } = U;

import './TreegraphLayout.js';

interface LayoutAlgorythmParameters {
    ax: number;
    bx: number;
    ay: number;
    by: number;
}
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
     * A treegraph series is a diagram, which shows a relation of the paren
     *
     *
     * @extends      plotOptions.treegraph
     * @since        next
     * @product      highcharts
     * @requires     modules/sankey
     * @requires     modules/organization
     * @requires     modules/treegraph
     * @exclude      linkColor, linkLineWidth, linkRadius
     * @optionparent plotOptions.treegraph
     */
    public static defaultOptions: TreegraphSeriesOptions = merge(
        OrganizationSeries.defaultOptions,
        {
            layout: 'Walker',
            alignNodes: 'right',
            minLinkWidth: 1,
            reversed: false,
            borderWidth: 1,
            marker: {
                radius: 10,
                symbol: 'circle',
                fillOpacity: 1,
                states: {}
            },
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

    public nodeColumns: Array<
    SankeyColumnComposition.ArrayComposition<TreegraphNode>
    > = void 0 as any;

    public nodes: Array<TreegraphNode> = void 0 as any;

    public layoutModifier: LayoutAlgorythmParameters = void 0 as any;
    layoutAlgorythm: Highcharts.TreegraphLayout = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public init(): void {
        super.init.apply(this, arguments);
        if (H.treeLayouts[this.options.layout]) {
            this.layoutAlgorythm = new H.treeLayouts[this.options.layout]();
        } else {
            this.layoutAlgorythm = new H.treeLayouts.Walker();
        }
    }

    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     * @private
     */
    public generatePoints(): void {
        NodesComposition.generatePoints.apply(this, arguments as any);

        /**
         * Order the nodes, starting with the root node(s). (#9818)
         * @private
         */
        function order(node: TreegraphNode, level: number): void {
            // Prevents circular recursion:
            if (node.wasVisited) {
                throw Error('circular dependency deteceted');
            } else {
                level = node.level || level;
                node.level = level;
                (node as any).wasVisited = true;
                node.linksFrom.forEach(function (link: TreegraphPoint): void {
                    if (link.toNode) {
                        order(link.toNode, level + 1);
                    }
                });
            }
        }

        if (this.orderNodes) {
            this.nodes
                // Identify the root node(s)
                .filter(function (node: TreegraphNode): boolean {
                    return node.linksTo.length === 0;
                })
                // Start by the root node(s) and recursively set the level
                // on all following nodes.
                .forEach(function (node: TreegraphNode): void {
                    order(node, 0);
                });
            stableSort(
                this.nodes,
                function (a: TreegraphPoint, b: TreegraphPoint): number {
                    return a.level - b.level;
                }
            );
        }
    }

    private getLayoutModifiers(): LayoutAlgorythmParameters {
        const chart = this.chart,
            plotSizeX = chart.plotSizeX as number,
            plotSizeY = chart.plotSizeY as number;
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity,
            maxXSize = 0,
            minXSize = 0,
            maxYSize = 0,
            minYSize = 0;
        this.nodes.forEach((node: TreegraphNode): void => {
            const markerOptions = merge(
                this.options.marker,
                node.options.marker
            );
            const symbol = markerOptions.symbol;
            node.symbol = symbol;
            const nodeSizeY =
                symbol === 'circle' ?
                    (pick(markerOptions.radius) as number) * 2 :
                    (markerOptions.height as any);
            const nodeSizeX =
                symbol === 'circle' ?
                    (pick(markerOptions.radius) as number) * 2 :
                    (markerOptions.width as any);
            node.nodeSizeX = nodeSizeX;
            node.nodeSizeY = nodeSizeY;

            if (node.xPosition < minX) {
                minX = node.xPosition;
                minXSize = nodeSizeY as number;
            }
            if (node.xPosition > maxX) {
                maxX = node.xPosition;
                maxXSize = nodeSizeX as number;
            }
            if (node.yPosition < minY) {
                minY = node.yPosition;
                minYSize = nodeSizeY as number;
            }
            if (node.yPosition > maxY) {
                maxY = node.yPosition;
                maxYSize = nodeSizeY as number;
            }
        });

        let ay = maxY === minY ? 1 : (plotSizeY - minYSize) / (maxY - minY);
        let by = maxY === minY ? plotSizeY / 2 : -ay * minY;
        let ax = maxX === minX ? 1 : (plotSizeX - maxXSize) / (maxX - minX);
        let bx = maxX === minX ? plotSizeX / 2 : -ax * minX;
        return { ax, bx, ay, by };
    }

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
            options = this.options,
            nodeColumns = this.nodeColumns;

        this.nodePadding = this.getNodePadding();

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
        // }
        this.layoutAlgorythm.init(series);
        series.layoutModifier = this.getLayoutModifiers();

        // First translate all nodes so we can use them when drawing links
        this.nodes.forEach((node): void => {
            // To Change - wasVisited set to false to enable next generatePoints
            // run
            node.wasVisited = false;
            series.translateNode(node);
        });

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
        if (point && point.isNode) {
            const { opacity, ...attrs } = Series.prototype.pointAttribs.apply(
                this,
                arguments
            );
            return attrs;
        }
        return super.pointAttribs.apply(this, arguments);
    }

    /**
     * Run translation operations for one node.
     * @private
     */

    public translateNode(node: TreegraphNode): void {
        const chart = this.chart,
            plotSizeY = chart.plotSizeY as number,
            plotSizeX = chart.plotSizeX as number,
            { ax, bx, ay, by } = this.layoutModifier,
            x = ax * node.xPosition + bx,
            y = ay * node.yPosition + by,
            symbol = node.symbol,
            width = node.nodeSizeX,
            height = node.nodeSizeY,
            reversed = this.options.reversed,
            nodeX = chart.inverted ? plotSizeX - width - x : x,
            nodeY = reversed ? plotSizeY - height - y : y;

        node.shapeType = 'path';
        node.nodeX = node.plotX = nodeX;
        node.nodeY = node.plotY = nodeY;
        node.shapeArgs = {
            d: symbols[symbol || 'circle'](nodeX, nodeY, width, height),
            x: nodeX,
            y: nodeY,
            width,
            height
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
        this.nodes = originalNodes;
        return nodeColumns as unknown as Array<
        SankeyColumnComposition.ArrayComposition<TreegraphNode>
        >;
    }
}
// Handle showing and hiding of the points
addEvent(TreegraphSeries, 'click', function (e: any): void {
    const point = e.point as TreegraphNode;
    point.collapsed = !point.collapsed;

    collapseTreeFromPoint(point, point.collapsed);
    this.redraw();
});

function collapseTreeFromPoint(
    point: TreegraphNode,
    collapsed: boolean
): void {
    point.linksFrom.forEach((link: TreegraphPoint): void => {
        link.toNode.hidden = collapsed;
        link.update({ visible: !collapsed }, false);
        link.toNode.update({ visible: !collapsed }, false);
        collapseTreeFromPoint(link.toNode, link.toNode.collapsed || collapsed);
    });
}
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
