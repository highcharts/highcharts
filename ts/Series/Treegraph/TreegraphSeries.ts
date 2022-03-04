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

import type TreegraphSeriesOptions from './TreegraphSeriesOptions.js';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';

import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import TreegraphNode from './TreegraphNode.js';
import TreegraphPoint from './TreegraphPoint.js';
import TU from '../TreeUtilities.js';
const { prototype: { symbols } } = SVGRenderer;
const { getLevelOptions } = TU;

import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const { merge, pick, addEvent, isArray } = U;

import './TreegraphLayout.js';
import type Point from '../../Core/Series/Point';
import TreemapSeries from '../Treemap/TreemapSeries.js';
import OrganizationSeries from '../Organization/OrganizationSeries.js';
import TreegraphLink from './TreegraphLink.js';
import { Palette } from '../../Core/Color/Palettes.js';
import ColumnSeries from '../Column/ColumnSeries.js';

interface LayoutModifiers {
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
 * The Treegraph series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.treegraph
 *
 * @augments Highcharts.Series
 */
class TreegraphSeries extends TreemapSeries {
    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A treegraph series is a diagram, which shows a relation between ancestors
     * and descendants with a clear parent - child relation.
     * The best examples of the dataStructures, which best reflect this chart
     * are e.g. genealogy tree or directory scructure.
     *
     *
     * @extends      plotOptions.treegraph
     * @since        next
     * @product      highcharts
     * @requires     modules/treegraph
     * @exclude     layoutAlgorithm, dashStyle, linecap, lineWidth, negativeColor,
     *              threshold, zones, zoneAxis
     * @optionparent plotOptions.treegraph
     */
    public static defaultOptions: TreegraphSeriesOptions = merge(
        TreemapSeries.defaultOptions,
        {
            /**
             * The option to choose the layout alogrythm, which should be used
             * to calculate the positions of the nodes.
             *
             *
             * @sample highcharts/demo/treegraph-chart
             *         Treegraph chart
             *
             * @type {'Walker'}
             * @since next
             * @default 'Walker'
             * @product highcharts
             */
            layout: 'Walker' as const,
            /**
             * Whether the first node should be placed on the opposite side of
             * the `plotArea`. By default, the oldest child is positioned on the
             * bottom (left in the inverted chart).
             *
             * @type {boolean}
             * @since next
             * @default false
             * @product highcharts
             *
             * @sample highcharts/series-treegraph/reversed-nodes
             *         Treegraph series with reversed nodes.
             */
            reversed: false,
            /**
             * @extends   plotOptions.series.marker
             * @excluding enabled, enabledThreshold
             */
            marker: {
                style: {
                    cursor: 'pointer'
                },
                radius: 10,
                lineWidth: 0,
                symbol: 'circle',
                fillOpacity: 1,
                states: {}
            },
            link: {
                /**
                 * The color of the links between nodes.
                 *
                 * @type {Highcharts.ColorString}
                 * @private
                 */
                color: Palette.neutralColor60,
                /**
                 * The line width of the links connecting nodes, in pixels.
                 * @type {number} width in pixels
                 * @default 1
                 *
                 * @sample   highcharts/series-organization/link-options
                 *           Square links
                 *
                 * @private
                 */
                lineWidth: 1,
                /**
                 * Radius for the rounded corners of the links between nodes.
                 * Works for `default` link type.
                 *
                 * @sample   highcharts/series-organization/link-options
                 *           Square links
                 *
                 * @private
                 */
                radius: 10,
                /**
                 * Type of the link shape.
                 *
                 * @sample   highcharts/series-organization/different-link-types
                 *           Different link types
                 *
                 * @type {'default' | 'curved' | 'straight'}
                 * @default 'default'
                 * @product highcharts
                 *
                 */
                type: 'curved' as const
                /**
                 * Modifier of the shape of the curved link. Works best for
                 * values between 0 and 1, where 0 is a straight line, and 1 is
                 * a shape close to the default one.
                 *
                 * @default 0.5
                 * @type {number}
                 * @since next
                 * @product highcharts
                 * @apioption series.organization.link.offset
                 *
                 */
            },
            /**
             * @extends plotOptions.series.tooltip
             * @exclude pointFormat, pointFormatter
             */
            tooltip: {
                /**
                 * The HTML of the point's line in the tooltip. Variables are
                 * enclosed by curly brackets. Available variables are
                 * `point.x`,  `point.y`, `series.name` and `series.color` and
                 * other properties on the same form. Furthermore, `point.y` can
                 * be extended by the `tooltip.valuePrefix` and
                 * `tooltip.valueSuffix` variables. This can also be overridden
                 * for each series, which makes it a good hook for displaying
                 * units. In styled mode, the dot is colored by a class name
                 * rather than the point color.
                 *
                 * @type {string}
                 * @since next
                 * @default '{point.fromNode.name} \u2192 {point.toNode.name}'
                 * @product highcharts
                 *
                 */
                linkFormat: '{point.fromNode.id} \u2192 {point.toNode.id}',
                pointFormat: '{point.id}'
                /**
                 * A callback function for formatting the HTML output for a
                 * single point in the tooltip. Like the `linkFormatter` string,
                 * but with more flexibility.
                 *
                 * @type {Highcharts.FormatterCallbackFunction.<Highcharts.Point>}
                 * @apioption series.treegraph.tooltip.linkFormatter
                 *
                 */
            },
            /**
             * Options for the data labels appearing on top of the nodes and
             * links. For treegraph charts, data labels are visible for the
             * nodes by default, but hidden for links. This is controlled by
             * modifying the `nodeFormat`, and the `format` that applies to
             * links and is an empty string by default.
             *
             * @declare Highcharts.SeriesTreegraphDataLabelsOptionsObject
             *
             * @private
             */
            dataLabels: {
                /**
                 * Options for a _link_ label text which should follow link
                 * connection. Border and background are disabled for a label
                 * that follows a path.
                 *
                 * **Note:** Only SVG-based renderer supports this option.
                 * Setting `useHTML` to true will disable this option.
                 *
                 * @extends plotOptions.treegraph.dataLabels.linkTextPath
                 * @since   next
                 *
                 *
                 * @sample highcharts/series-treegraph/link-text-path
                 *         Treegraph series with link text path dataLabels.
                 */
                linkTextPath: {
                    attributes: {
                        startOffset: '50%'
                    }
                },
                enabled: true,
                formatter: function (this: Point.PointLabelObject): string {
                    return this.point.id;
                },
                linkFormat: ''
            }
        } as TreegraphSeriesOptions
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

    public layoutModifier: LayoutModifiers = void 0 as any;

    public nodeMap: Record<string, TreegraphNode.Node> = void 0 as any;

    public tree: TreegraphNode.Node = void 0 as any;

    public nodeList: Array<TreegraphNode.Node> = [];

    public layoutAlgorythm: Highcharts.TreegraphLayout = void 0 as any;

    public links: Array<TreegraphLink> = [];

    /* *
     *
     *  Functions
     *
     * */

    public init(): void {
        super.init.apply(this, arguments);
        if (this.options.layout && H.treeLayouts[this.options.layout]) {
            this.layoutAlgorythm = new H.treeLayouts[this.options.layout]();
        } else {
            this.layoutAlgorythm = new H.treeLayouts.Walker();
        }
    }

    /**
     * Calculate `a` and `b` parameters of linear transformation, where
     * `finalPosition = a * calculatedPosition + b`.
     *
     * @return {LayoutModifiers} `a` and `b` parameter for x and y direction.
     */
    private getLayoutModifiers(): LayoutModifiers {
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
        this.points.forEach((point: TreegraphPoint): void => {
            const node = point.node;
            const markerOptions = merge(
                    this.options.marker,
                    point.options.marker
                ),
                symbol = markerOptions.symbol,
                nodeSizeY = symbol === 'circle' ?
                    (pick(markerOptions.radius) as number) * 2 :
                    (pick(
                        markerOptions.height as number,
                        (markerOptions.radius as number) * 2)
                    ),
                nodeSizeX = symbol === 'circle' ?
                    (markerOptions.radius as number) * 2 :
                    (pick(
                        markerOptions.width as number,
                        (markerOptions.radius as any) * 2)
                    );
            node.nodeSizeX = nodeSizeX;
            node.nodeSizeY = nodeSizeY;

            if (node.xPosition <= minX) {
                minX = node.xPosition;
                minXSize = Math.max(nodeSizeX as number, minXSize);
            }
            if (node.xPosition >= maxX) {
                maxX = node.xPosition;
                maxXSize = Math.max(nodeSizeX as number, maxXSize);
            }
            if (node.yPosition <= minY) {
                minY = node.yPosition;
                minYSize = Math.max(nodeSizeY as number, minYSize);
            }
            if (node.yPosition >= maxY) {
                maxY = node.yPosition;
                maxYSize = Math.max(nodeSizeY as number, maxYSize);
            }
        });

        // Calculate the values of linear transformation, which will later be
        // applied as `nodePosition = a * x + b` for each direction.
        const ay = maxY === minY ?
                1 :
                (plotSizeY - (minYSize + maxYSize) / 2) / (maxY - minY),
            by = maxY === minY ? plotSizeY / 2 : -ay * minY + minYSize / 2,
            ax = maxX === minX ?
                1 :
                (plotSizeX - (maxXSize + maxXSize) / 2) / (maxX - minX),
            bx = maxX === minX ? plotSizeX / 2 : -ax * minX + minXSize / 2;

        return { ax, bx, ay, by };
    }

    getLinks(): TreegraphLink[] {
        const series = this;
        const links = [] as TreegraphLink[];
        this.data.forEach((point): void => {
            if (point.node.parent) {
                const link = new series.LinkClass().init(
                    series,
                    point.options,
                    void 0,
                    point
                );
                links.push(link);
                point.linkToParent = link;
            }
        });
        return links;
    }

    public buildTree(
        id: string,
        index: number,
        level: number,
        list: Record<string, number[]>,
        parent?: string
    ): this['tree'] {
        let point = this.points[index];
        level = (point && point.level) || level;
        return super.buildTree.call(this, id, index, level, list, parent);
    }

    /**
     * Run pre-translation by generating the nodeColumns.
     * @private
     */
    public translate(): void {
        let series = this,
            options = series.options,
            // NOTE: updateRootId modifies series.
            rootId = TU.updateRootId(series),
            rootNode,
            tree: TreegraphNode.Node;
        // Call prototype function
        Series.prototype.translate.call(series);

        // @todo Only if series.isDirtyData is true
        tree = series.tree = series.getTree();

        series.links.forEach((link): void => {
            link.destroy();
        });
        series.links = series.getLinks();
        rootNode = series.nodeMap[rootId];

        if (rootId !== '' && (!rootNode || !rootNode.children.length)) {
            series.setRootNode('', false);
            rootId = series.rootNode;
            rootNode = series.nodeMap[rootId];
        }

        series.mapOptionsToLevel = getLevelOptions<this>({
            from: rootNode.level + 1,
            levels: options.levels,
            to: tree.height,
            defaults: {
                levelIsConstant: series.options.levelIsConstant,
                colorByPoint: options.colorByPoint
            }
        }) as any;

        series.setTreeValues(tree);

        this.layoutAlgorythm.calculatePositions(series);
        series.layoutModifier = this.getLayoutModifiers();

        this.points.forEach((point): void => {
            this.translateNode(point);
        });

        this.links.forEach((link): void => {
            this.translateLink(link);
        });
    }

    public translateLink(link: TreegraphLink): void {
        OrganizationSeries.prototype.translateLink.apply(this, arguments);
        if (link.dlBox) {
            link.tooltipPos = this.chart.inverted ? [
                (this.chart.plotSizeY as any) - link.dlBox.y,
                (this.chart.plotSizeX as any) - link.dlBox.x
            ] : [
                link.dlBox.x,
                link.dlBox.y
            ];
            link.dlBox.centerX = link.dlBox.x;
        }
    }

    /**
     * Treegraph has two separate collecions of nodes and lines,
     * render dataLabels for both sets.
     */
    public drawDataLabels(): void {
        if (this.options.dataLabels) {

            const textPath = (this.options.dataLabels as any).textPath;

            // Render node labels.
            super.drawDataLabels.apply(this, arguments);

            // Render link labels.
            const points = this.points;
            this.points = this.links as any;
            (this as any).options.dataLabels.textPath = (
                this as any
            ).options.dataLabels.linkTextPath;
            Series.prototype.drawDataLabels.apply(this, arguments);

            // Restore nodes.
            this.points = this.points.concat(points);
            (this as any).options.dataLabels.textPath = textPath;
        }
    }

    /**
     * Return the presentational attributes.
     * @private
     */
    public pointAttribs(
        point: TreegraphPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        const series = this,
            attribs = Series.prototype.pointAttribs.call(series, point, state),
            levelOptions =
                (series.mapOptionsToLevel as any)[
                    (point.node && point.node.level) || 0
                ] || {},
            pointOptions = point.options,
            stateOptions =
                (levelOptions.states && levelOptions.states[state as any]) ||
                {};
        function getPropFromOptions(...args: string[]): unknown {
            let returnValues = [] as any;
            [
                stateOptions,
                pointOptions,
                levelOptions,
                series.options
            ].forEach((option): void => {
                let value = option;
                for (let i = 0; i < args.length; i++) {
                    if (
                        typeof value[args[i]] !== 'undefined' &&
                        value[args[i]] !== null
                    ) {
                        value = value[args[i]];
                    } else {
                        value = void 0;
                        return;
                    }
                }
                returnValues.push(value);
            });

            return pick.apply({}, returnValues);
        }

        const borderRadius = getPropFromOptions('borderRadius') as number,
            linkColor = getPropFromOptions('link', 'color') as string,
            linkLineWidth = getPropFromOptions('link', 'lineWidth') as number;

        if (point.isLink) {
            attribs.stroke = linkColor;
            attribs['stroke-width'] = linkLineWidth;
            delete attribs.fill;
        } else {
            if (borderRadius) {
                attribs.r = borderRadius;
            }
        }
        return attribs;
    }

    public drawPoints(): void {
        super.drawPoints.apply(this, arguments);
        const points = this.points;
        this.points = this.links as any;
        ColumnSeries.prototype.drawPoints.apply(this, arguments);
        this.points = points;
    }
    /**
     * Run translation operations for one node.
     * @private
     */
    public translateNode(point: TreegraphPoint): void {
        const chart = this.chart,
            node = point.node,
            plotSizeY = chart.plotSizeY as number,
            plotSizeX = chart.plotSizeX as number,
            { ax, bx, ay, by } = this.layoutModifier,
            x = ax * node.xPosition + bx,
            y = ay * node.yPosition + by,
            markerOptions = merge(this.options.marker, point.options.marker),
            symbol = markerOptions.symbol,
            height = node.nodeSizeY,
            width = node.nodeSizeX,
            reversed = this.options.reversed,
            nodeX = node.x = (chart.inverted ?
                plotSizeX - width / 2 - x :
                x - width / 2),
            nodeY = node.y = (!reversed ?
                plotSizeY - y - height / 2 :
                y - height / 2);

        point.shapeType = 'path';
        point.plotX = nodeX;
        point.plotY = nodeY;
        point.shapeArgs = {
            d: symbols[symbol || 'circle'](nodeX, nodeY, width, height),
            x: nodeX,
            y: nodeY,
            width,
            height
        };

        // Set the anchor position for tooltip.
        point.tooltipPos = chart.inverted ?
            [nodeY, x] :
            [nodeX + width / 2, nodeY];
        // To prevent error in generatePoints this property needs to be reset
        // to false.
    }
}

// Handle showing and hiding of the points
addEvent(TreegraphSeries, 'click', function (e: any): void {
    const node = e.point.node as TreegraphNode.Node;
    node.collapsed = !node.collapsed;

    collapseTreeFromPoint(node, node.collapsed);
    this.redraw();
});

/**
 * Recurive function, which sets node's  and each nodes' children parameter
 * 'hidden' to be equal to passed `collapsed` value.

 * @param point {TreegraphNode} point which should be collapsed
 * @param collapsed {boolean}
 */
function collapseTreeFromPoint(
    node: TreegraphNode.Node,
    collapsed: boolean
): void {
    node.children.forEach(function (child: TreegraphNode.Node): void {
        child.hidden = collapsed;
        if (child.point.linkToParent) {
            child.point.update({ visible: false }, false);
            collapseTreeFromPoint(child.point.node, child.collapsed);
        }
    });
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface TreegraphSeries {
    inverted?: boolean;
    pointClass: typeof TreegraphPoint;
    NodeClass: typeof TreegraphNode.Node;
    LinkClass: typeof TreegraphLink;

}

/* *
 *
 *  Registry
 *
 * */

TreegraphSeries.prototype.pointClass = TreegraphPoint;
TreegraphSeries.prototype.NodeClass = TreegraphNode.Node;
TreegraphSeries.prototype.LinkClass = TreegraphLink;
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

/**
 * An `treegraph` series. If the [type](#series.treegraph.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.treegraph
 * @exclude   dataSorting, boostThreshold, boostBlending, curveFactor,
 *            connectEnds, connectNulls, colorAxis, colorKey, dataSorting,
 *            dragDrop, getExtremesFromAll, nodePadding, centerInCategory,
 *            pointInterval, pointIntervalUnit, pointPlacement,
 *            pointStart, relativeXValue, softThreshold, stack,
 *            stacking, step, xAxis, yAxis
 * @product   highcharts
 * @requires  modules/treegraph
 * @apioption series.treegraph
 */


/**
 * @extends   plotOptions.series.marker
 * @excluding enabled, enabledThreshold
 * @apioption series.treegraph.marker
 */

/**
 * @type      {Highcharts.SeriesTreegraphDataLabelsOptionsObject|Array<Highcharts.SeriesTreegraphDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.treegraph.data.dataLabels
 */

/**
 *
 *
 * @sample highcharts/series-treegraph/node-level
 *         Treegraph series with node's level modified.
 * @apioption series.treegraph.nodes.level
 */

/**
 * An array of data points for the series. For the `treegraph` series type,
 * points can be given in the following ways:
 *
 * 1. The array of arrays, with `keys` property, which defines how the fields in
 *     array should be interpretated
 *    ```js
 *       keys: ['from', 'to'],
 *       data: [
 *           ['Category1', 'Category2'],
 *           ['Category2', 'Category3']
 *       ]
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the
 *    series' [turboThreshold](#series.area.turboThreshold),
 *    this option is not available.
 *    The data of the treegraph series needs to be formatted in such a way, that
 *    there are no circular dependencies on the nodes, and there is a single
 *    root node.
 *  ```js
 *     data: [{
 *         from: 'Category1',
 *         to: 'Category2'
 *     }, {
 *         from: 'Category1',
 *         to: 'Category3',
 *     }]
 *  ```
 *
 * @type      {Array<*>}
 * @extends   series.treemap.data
 * @product   highcharts
 * @excluding outgoing, dataLabels, weight
 * @apioption series.treegraph.data
 */
''; // gets doclets above into transpiled version
