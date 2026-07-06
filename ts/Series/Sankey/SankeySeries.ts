/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart';
import type SankeyDataLabelOptions from './SankeyDataLabelOptions';
import type SankeyPointOptions from './SankeyPointOptions';
import type {
    SankeySeriesLevelOptions,
    SankeySeriesOptions
} from './SankeySeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import H from '../../Core/Globals.js';
import NodesComposition from '../NodesComposition.js';
import SankeyPoint from './SankeyPoint.js';
import SankeySeriesDefaults from './SankeySeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SankeyColumnComposition from './SankeyColumnComposition.js';
const {
    column: ColumnSeries,
    line: LineSeries
} = SeriesRegistry.seriesTypes;
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import TU from '../TreeUtilities.js';
const { getLevelOptions, getNodeWidth } = TU;
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import { composeTextPath } from '../../Extensions/TextPath.js';
import {
    clamp,
    crisp,
    extend,
    getAlignFactor,
    isNumber,
    isObject,
    merge,
    pick,
    relativeLength,
    stableSort
} from '../../Shared/Utilities.js';
composeTextPath(SVGElement);

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.sankey
 *
 * @augments Highcharts.Series
 */
class SankeySeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions = merge(
        ColumnSeries.defaultOptions,
        SankeySeriesDefaults
    );

    /**
     * Cubic-bezier control fraction approximating a quarter-circle, used for
     * the rounded corners of a circular link's outer bend.
     * @private
     */
    private static readonly CIRCULAR_LINK_BEZIER = 0.55;

    /**
     * Largest fraction of the column axis the circular edge reserves may
     * claim. Keeps room between the columns and bounds ring diameters on
     * plots with a short column axis, e.g. inverted landscape ones.
     * @private
     */
    private static readonly CIRCULAR_BEND_MAX_WIDTH = 0.6;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    protected static getDLOptions(
        params: {
            optionsPoint: SankeyPointOptions;
            level: SankeySeriesLevelOptions;
        }
    ): SankeyDataLabelOptions {
        const optionsPoint = (
                isObject(params.optionsPoint) ?
                    params.optionsPoint.dataLabels :
                    {}
            ),
            optionsLevel = (
                isObject(params.level) ?
                    params.level.dataLabels :
                    {}
            ),
            options = merge({
                style: {}
            }, optionsLevel, optionsPoint, {
                // Not a point option. zIndex is set for the data labels group.
                zIndex: optionsLevel?.zIndex
            });
        return options;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Flow-axis offsets centering columns that hold self-link rings, by
     * column index. #8218
     * @internal
     */
    public colCircOffsets: Array<number> = [];

    public colDistance!: number;

    public data!: Array<SankeyPoint>;

    /**
     * Reserved column-axis space for circular geometry reaching past the
     * first column. #8218
     * @internal
     */
    public firstColCircShift = 0;

    public group!: SVGElement;

    /**
     * Whether the data has circular dependencies.
     * @internal
     */
    public isDataCircular!: boolean;

    public mapOptionsToLevel?: (Record<string, SankeySeriesLevelOptions>|null);

    public nodeColumns?: Array<SankeyColumnComposition.ArrayComposition<SankeyPoint>>;

    public nodeLookup!: Record<string, SankeyPoint>;

    public nodePadding!: number;

    public nodes!: Array<SankeyPoint>;

    public nodeWidth!: number;

    public options!: SankeySeriesOptions;

    public points!: Array<SankeyPoint>;

    public translationFactor!: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create node columns by analyzing the nodes and the relations between
     * incoming and outgoing links.
     * @private
     */
    public createNodeColumns(): Array<SankeyColumnComposition.ArrayComposition<SankeyPoint>> {
        const columns: Array<SankeyColumnComposition.ArrayComposition<SankeyPoint>> = [];

        for (const node of this.nodes) {

            node.setNodeColumn();

            if (!columns[node.column as any]) {
                columns[node.column as any] =
                    SankeyColumnComposition.compose([], this);
            }

            columns[node.column as any].push(node);

        }

        // Fill in empty columns (#8865)
        for (let i = 0; i < columns.length; i++) {
            if (typeof columns[i] === 'undefined') {
                columns[i] =
                    SankeyColumnComposition.compose([], this);
            }
        }

        return columns;
    }

    /**
     * Order the nodes, starting with the root node(s). (#9818)
     * @private
     */
    public order(
        node: SankeyPoint,
        level: number,
        visited?: Set<SankeyPoint>
    ): void {
        const series = this;

        // Watch the visited nodes
        if (!visited) {
            visited = new Set();
        }

        // Prevents circular recursion, but updates level if a longer
        // path is found from a different branch
        if (typeof node.level === 'undefined' || node.level < level) {
            node.level = level;
            visited.add(node);
            for (const link of node.linksFrom) {
                if (
                    !link.isCircular &&
                    link.toNode &&
                    !visited.has(link.toNode)
                ) {
                    series.order(link.toNode, level + 1, visited);
                }
            }
            visited.delete(node);
        }
    }
    /**
     * Extend generatePoints by adding the nodes, which are Point objects
     * but pushed to the this.nodes array.
     * @private
     */
    public generatePoints(): void {
        NodesComposition.generatePoints.apply(this, arguments as any);

        if (this.useCircularLayout) {
            // Runs on every Sankey translate
            this.isDataCircular = this.markCircularLinks(this.points);
        }

        if (this.orderNodes) {
            for (const node of this.nodes) {
                // Identify the root node(s). Circular links, including
                // self-links, do not anchor a node.
                if (!node.linksTo.some((link): boolean => !link.isCircular)) {
                    // Start by the root node(s) and recursively set the level
                    // on all following nodes.
                    this.order(node, 0);
                }
            }
            stableSort(this.nodes, (a, b): number => (a.level - b.level));
        }
    }

    /**
     * Overridable function to get node padding, overridden in dependency
     * wheel series type.
     * @private
     */
    public getNodePadding(): number {

        let nodePadding = this.options.nodePadding || 0;

        // If the number of columns is so great that they will overflow with
        // the given nodePadding, we sacrifice the padding in order to
        // render all nodes within the plot area (#11917).
        if (this.nodeColumns) {
            const maxLength = this.nodeColumns.reduce(
                (acc, col): number => Math.max(acc, col.length),
                0
            );
            if (maxLength * nodePadding > (this.chart.plotSizeY || 0)) {
                nodePadding = (this.chart.plotSizeY || 0) / maxLength;
            }
        }

        return nodePadding;
    }

    /**
     * Define hasData function for non-cartesian series.
     * @private
     * @return {boolean}
     *         Returns true if the series has points at all.
     */
    public hasData(): boolean {
        return !!this.dataTable.rowCount;
    }

    /**
     * Return the presentational attributes.
     * @private
     */
    public pointAttribs(
        point?: SankeyPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        if (!point) {
            return {};
        }
        const series = this,
            level = point.isNode ? point.level : point.fromNode.level,
            levelOptions =
                (series.mapOptionsToLevel as any)[level || 0] || {},
            options = point.options,
            stateOptions = (
                levelOptions.states && levelOptions.states[state || '']
            ) || {},
            values: AnyRecord = [
                'colorByPoint',
                'borderColor',
                'borderWidth',
                'linkOpacity',
                'opacity'
            ].reduce((
                obj: AnyRecord,
                key: string
            ): AnyRecord => {
                obj[key] = pick(
                    stateOptions[key],
                    (options as any)[key],
                    levelOptions[key],
                    (series.options as any)[key]
                );
                return obj;
            }, {}),
            color = pick(
                stateOptions.color,
                options.color,
                values.colorByPoint ? point.color : levelOptions.color
            );

        // Node attributes
        if (point.isNode) {
            return {
                fill: color,
                stroke: values.borderColor,
                'stroke-width': values.borderWidth,
                opacity: values.opacity
            };
        }

        // Link attributes
        return {
            fill: color,
            'fill-opacity': values.linkOpacity
        };

    }
    public drawTracker(): void {
        ColumnSeries.prototype.drawTracker.call(this, this.points);
        ColumnSeries.prototype.drawTracker.call(this, this.nodes);
    }

    public drawPoints(): void {
        ColumnSeries.prototype.drawPoints.call(this, this.points);
        ColumnSeries.prototype.drawPoints.call(this, this.nodes);
    }

    public drawDataLabels(): void {
        ColumnSeries.prototype.drawDataLabels.call(this, this.points);
        ColumnSeries.prototype.drawDataLabels.call(this, this.nodes);
    }

    /**
     * Mark links that would close a directed cycle in from/to topology.
     * Circular links are ignored when assigning node columns. Self-links are
     * marked circular too, but do not count towards the return value since
     * they loop on their node and need no inter-column layout space.
     *
     * @param {Array<SankeyPoint>} points The points to check.
     * @return {boolean} Whether any circular layout is required.
     *
     * @internal
     */
    public markCircularLinks(points: Array<SankeyPoint>): boolean {
        const nodes = this.nodes;

        for (const point of points) {
            point.isCircular = false;
        }

        let hasSelfLinks = false;
        for (const node of nodes) {
            for (const link of node.linksFrom) {
                if (link.toNode === node) {
                    link.isCircular = true;
                    hasSelfLinks = true;
                }
            }
        }

        let hasCircularLink = false;

        // DFS marking links that point back into the path currently walked.
        // The back edge selected as circular follows the input data order.
        const visited = new Set<SankeyPoint>(),
            inStack = new Set<SankeyPoint>(),
            visit = (node: SankeyPoint): void => {
                visited.add(node);
                inStack.add(node);
                for (const link of node.linksFrom) {
                    const nextNode = link.toNode;

                    if (!nextNode || nextNode === node) {
                        continue;
                    }
                    if (!visited.has(nextNode)) {
                        visit(nextNode);
                    } else if (inStack.has(nextNode)) {
                        link.isCircular = true;
                        hasCircularLink = true;
                    }
                }
                inStack.delete(node);
            };

        for (const node of nodes) {
            if (!visited.has(node)) {
                visit(node);
            }
        }

        // Stack regular links above circular ones in each node's band, so the
        // order is independent of the input data order. Skip it when nothing
        // is circular, as the sort would then never reorder. #8218
        if (hasCircularLink || hasSelfLinks) {
            const flowFirst = (a: SankeyPoint, b: SankeyPoint): number =>
                (a.isCircular ? 1 : 0) - (b.isCircular ? 1 : 0);
            for (const node of nodes) {
                stableSort(node.linksFrom, flowFirst);
                stableSort(node.linksTo, flowFirst);
            }
        }

        return hasCircularLink;
    }

    /**
     * Run pre-translation by generating the nodeColumns.
     * @private
     */
    public translate(): void {

        this.isDataCircular = false;
        this.generatePoints();

        this.nodeColumns = this.createNodeColumns();

        const series = this,
            chart = this.chart,
            options = this.options,
            nodeColumns = this.nodeColumns,
            columnCount = nodeColumns.length;

        this.nodeWidth = getNodeWidth(this, columnCount);
        this.nodePadding = this.getNodePadding();

        // Find out how much space is needed.

        this.translationFactor = nodeColumns.reduce(
            (
                translationFactor: number,
                column: SankeyColumnComposition.ArrayComposition<SankeyPoint>
            ): number => Math.min(
                translationFactor,
                column.sankeyColumn.getTranslationFactor(series)
            ),
            Infinity
        );

        if (this.isDataCircular) {
            // Halve the scale so the circular links have room to wrap around
            // the diagram. #8218
            this.translationFactor /= 2;
        }

        this.firstColCircShift = 0;
        this.colCircOffsets = [];

        let lastColCircShift = 0;

        if (this.useCircularLayout) {
            // Scale down columns holding self-linked nodes, so their rings
            // fit the flow axis. #8218
            const colSelfWeights: Array<number> = [];

            for (const column of nodeColumns) {
                let selfWeight = 0;

                for (const node of column) {
                    let weight = 0;
                    for (const link of node.linksFrom) {
                        if (link.toNode === node) {
                            weight += link.weight || 0;
                        }
                    }
                    selfWeight = Math.max(selfWeight, weight);
                }
                colSelfWeights.push(selfWeight);

                if (selfWeight) {
                    const free = (chart.plotSizeY || 0) -
                            this.nodePadding * (column.length - 1) -
                            2 * this.nodeWidth,
                        needed = column.sankeyColumn.sum() + selfWeight;

                    if (free > 0 && needed * this.translationFactor > free) {
                        this.translationFactor = free / needed;
                    }
                }
            }

            // Track the column-axis reach of circular geometry past the edge
            // columns as `base + weight * translationFactor`: a wrap bend
            // reaches `linkHeight + bend` past its edge column, a ring side
            // `nodeWidth / 2 + linkHeight`. Held as per-side maxima of the
            // two parts, a slight over-reserve when wraps and rings mix on
            // one edge. #8218
            const bend = this.nodeWidth * (this.options.curveFactor ?? 0.33),
                lastCol = nodeColumns.length - 1;

            let firstBase = 0,
                firstWeight = 0,
                lastBase = 0,
                lastWeight = 0;

            for (const point of this.points) {
                if (!point.isCircular) {
                    continue;
                }
                const base = point.fromNode === point.toNode ?
                        this.nodeWidth / 2 :
                        bend,
                    weight = point.weight || 0;

                if (point.toNode.column === 0) {
                    firstBase = Math.max(firstBase, base);
                    firstWeight = Math.max(firstWeight, weight);
                }
                if (point.fromNode.column === lastCol) {
                    lastBase = Math.max(lastBase, base);
                    lastWeight = Math.max(lastWeight, weight);
                }
            }

            // The flow clamp above does not bound the column-axis extent of
            // the reaches, so cap them to a fraction of the column axis.
            // This keeps room between the columns and bounds ring diameters
            // on plots with a short column axis, e.g. inverted landscape
            // ones. #8218
            const budget = SankeySeries.CIRCULAR_BEND_MAX_WIDTH * (
                    (chart.plotSizeX || 0) - this.nodeWidth -
                    (options.borderWidth || 0)
                ),
                reachBase = firstBase + lastBase,
                reachWeight = firstWeight + lastWeight;

            if (
                reachWeight > 0 &&
                budget > reachBase &&
                reachBase + reachWeight * this.translationFactor > budget
            ) {
                this.translationFactor = (budget - reachBase) / reachWeight;
            }

            // The column top is aligned on the node bands alone, so shift
            // ringed columns the other way to align on band plus ring hang.
            // #8218
            const align = getAlignFactor(options.nodeAlignment || 'center');

            this.colCircOffsets = colSelfWeights.map((weight): number => (
                weight ?
                    -align * (2 * this.nodeWidth + Math.max(
                        weight * this.translationFactor,
                        options.minLinkWidth || 0
                    )) :
                    0
            ));

            // Reserve the reach at the final scale, shifting all columns
            // inward. Edges without circular links reserve nothing. #8218
            this.firstColCircShift = (firstBase || firstWeight) ?
                firstBase + Math.max(
                    firstWeight * this.translationFactor,
                    options.minLinkWidth || 0
                ) : 0;
            lastColCircShift = (lastBase || lastWeight) ?
                lastBase + Math.max(
                    lastWeight * this.translationFactor,
                    options.minLinkWidth || 0
                ) : 0;
        }

        this.colDistance =
            (
                (chart.plotSizeX || 0) - this.nodeWidth -
                (options.borderWidth || 0) -
                this.firstColCircShift - lastColCircShift
            ) / Math.max(1, nodeColumns.length - 1);

        // Calculate level options used in sankey and organization
        series.mapOptionsToLevel = getLevelOptions({
            // NOTE: if support for allowTraversingTree is added, then from
            // should be the level of the root node.
            from: 1,
            levels: options.levels,
            to: nodeColumns.length - 1, // Height of the tree
            defaults: {
                borderColor: options.borderColor,
                borderRadius: options.borderRadius, // Organization series
                borderWidth: options.borderWidth,
                color: series.color,
                colorByPoint: options.colorByPoint,
                // NOTE: if support for allowTraversingTree is added, then
                // levelIsConstant should be optional.
                levelIsConstant: true,
                linkColor: options.linkColor, // Organization series
                linkLineWidth: options.linkLineWidth, // Organization series
                linkOpacity: options.linkOpacity,
                states: options.states
            }
        });

        // First translate all nodes so we can use them when drawing links
        for (const column of nodeColumns) {
            for (const node of column) {
                series.translateNode(node, column);
            }
        }

        // Then translate links
        for (const node of this.nodes) {
            // Translate the links from this node
            for (const linkPoint of node.linksFrom) {
                // If weight is 0 - don't render the link path #12453,
                // render null points (for organization chart)
                if ((linkPoint.weight || linkPoint.isNull) && linkPoint.to) {
                    series.translateLink(linkPoint);
                    linkPoint.allowShadow = false;
                }
            }
        }
    }

    /**
     * Get the Y position of a link.
     * @internal
     */
    public getY(
        point: SankeyPoint,
        node: SankeyPoint,
        fromOrTo: string,
        linkHeight: number
    ): number {
        const linkTop =
            (node.offset(point, fromOrTo) || 0) * this.translationFactor;
        const y = Math.min(
            node.nodeY + linkTop,
            // Prevent links from spilling below the node (#12014)
            node.nodeY + (
                node.shapeArgs && node.shapeArgs.height || 0
            ) - linkHeight
        );

        return y;
    }

    /**
     * Build the ring path for a self-referencing link, and its centre for
     * anchoring the label and tooltip. #8218
     * @internal
     */
    public selfLinkPath(
        fromNode: SankeyPoint,
        fromY: number,
        linkHeight: number,
        nodeLeft: number,
        nodeW: number
    ): { cx: number, cy: number, d: SVGPath } {
        const ns = fromNode.shapeArgs,
            lh = Math.abs(linkHeight),
            nw = Math.abs(nodeW),
            dir = this.chart.inverted ? -1 : 1,
            nodeTop = (ns && isNumber(ns.y)) ?
                ns.y : Math.min(fromY, fromY + linkHeight),
            nodeBottom = (ns && isNumber(ns.y) && isNumber(ns.height)) ?
                ns.y + ns.height : Math.max(fromY, fromY + linkHeight),
            cx = nodeLeft + nodeW / 2,
            // Anchor both faces at the node's far band so the node sits at the
            // near edge and the loop hangs past it.
            yFace = (dir > 0 ? nodeBottom : nodeTop) - dir * lh,
            // Hole radius tracks the node width, not the band weight, so heavy
            // self-links don't balloon.
            rInner = nw,
            rOuter = rInner + lh,
            // Inset the opening by the node's border radius, so its rounded
            // corners don't leave thin gaps at the loop. Keep a minimal slot
            // so the arc endpoints stay distinct. #8218
            halfSlot = Math.max(
                0.5, nw / 2 - ((ns && isNumber(ns.r)) ? ns.r : 0)
            ),
            // Offset the centre so the outer circle passes through the face
            // anchors and the loop hangs past the node.
            cy = yFace + dir * Math.sqrt(
                Math.max(0, rOuter * rOuter - halfSlot * halfSlot)
            ),
            yInner = cy - dir * Math.sqrt(
                Math.max(0, rInner * rInner - halfSlot * halfSlot)
            ),
            sweep = dir > 0 ? 1 : 0;

        return {
            cx,
            cy,
            d: [
                ['M', cx + halfSlot, yFace],
                ['A', rOuter, rOuter, 0, 1, sweep, cx - halfSlot, yFace],
                ['L', cx - halfSlot, yInner],
                ['A', rInner, rInner, 0, 1, 1 - sweep, cx + halfSlot, yInner],
                ['Z']
            ]
        };
    }

    /**
     * Build the path for a link that points backwards: a circular back-edge,
     * or a link whose explicit `column` places the target left of the source.
     * Routed in natural flow coordinates, then mirrored for inverted charts.
     * #8218
     * @internal
     */
    public backwardLinkPath(
        fromY: number,
        toY: number,
        linkHeight: number,
        nodeLeft: number,
        right: number,
        nodeW: number
    ): SVGPath {
        const inverted = this.chart.inverted,
            bend = this.nodeWidth * (this.options.curveFactor ?? 0.33),
            plotSizeY = this.chart.plotSizeY || 0,
            colSign = inverted ? -1 : 1,
            lh = Math.abs(linkHeight),
            linkTop = Math.min(
                fromY,
                fromY + linkHeight,
                toY,
                toY + linkHeight
            ),
            linkBottom = Math.max(
                fromY,
                fromY + linkHeight,
                toY,
                toY + linkHeight
            ),
            natFromY = inverted ? plotSizeY - fromY : fromY,
            natToY = inverted ? plotSizeY - toY : toY,
            natLinkTop = Math.min(natFromY, natToY),
            natLinkBottom = Math.max(natFromY, natToY) + lh,
            naturalUp = natLinkTop >= lh + bend && (
                natFromY + natToY + lh < plotSizeY ||
                plotSizeY - natLinkBottom < lh + bend
            ),
            circularLinkUp = inverted ? !naturalUp : naturalUp,
            sign = circularLinkUp ? -1 : 1,
            innerY = circularLinkUp ?
                Math.max(lh, linkTop - bend) :
                Math.min(
                    plotSizeY - lh,
                    linkBottom + bend
                ),
            x1 = right - colSign * (bend + lh),
            x2 = right - colSign * bend,
            x3 = right,
            x4 = nodeLeft + nodeW,
            x5 = x4 + colSign * bend,
            x6 = x5 + colSign * lh,
            // Keep band edges consistent despite inverted linkHeight.
            farFromBend = sign * linkHeight < 0,
            fy1 = fromY + (farFromBend ? linkHeight : 0),
            fy2 = fromY + (farFromBend ? 0 : linkHeight),
            y5 = innerY,
            y6 = y5 + sign * lh,
            ty1 = toY + (farFromBend ? linkHeight : 0),
            ty2 = toY + (farFromBend ? 0 : linkHeight),
            // Round the inner corners with a radius that shrinks to fit when a
            // back-link stacks within a bend of its wrap channel. #8218
            rFrom = Math.min(bend, Math.abs(y5 - fy2) / 2),
            rTo = Math.min(bend, Math.abs(y5 - ty2) / 2),
            fy3 = fy2 + sign * rFrom,
            fyChan = y5 - sign * rFrom,
            tyInner = ty2 + sign * rTo,
            tyChan = y5 - sign * rTo,
            // Centre each outer corner's apex between the node face and the
            // channel edge so the bend is symmetrical. #8218
            apexFrom = (fy1 + y6) / 2,
            apexTo = (ty1 + y6) / 2,
            k = SankeySeries.CIRCULAR_LINK_BEZIER,
            cx = colSign * (bend + lh) * k,
            cyFrom = (apexFrom - fy1) * k,
            cyTo = (apexTo - ty1) * k;

        return [
            ['M', x4, fy1],
            ['C', x4 + cx, fy1, x6, apexFrom - cyFrom, x6, apexFrom],
            ['C', x6, apexFrom + cyFrom, x4 + cx, y6, x4, y6],
            ['L', x3, y6],
            ['C', x3 - cx, y6, x1, apexTo + cyTo, x1, apexTo],
            ['C', x1, apexTo - cyTo, x3 - cx, ty1, x3, ty1],
            ['L', x3, ty2],
            ['C', x2, ty2, x2, ty2, x2, tyInner],
            ['L', x2, tyChan],
            ['C', x2, y5, x2, y5, x3, y5],
            ['L', x4, y5],
            ['C', x5, y5, x5, y5, x5, fyChan],
            ['L', x5, fy3],
            ['C', x5, fy2, x5, fy2, x4, fy2],
            ['Z']
        ];
    }

    /**
     * Run translation operations for one link.
     * @internal
     */
    public translateLink(
        point: SankeyPoint,
        linkToY?: number
    ): void {
        const fromNode = point.fromNode,
            toNode = point.toNode,
            chart = this.chart,
            { inverted } = chart,
            translationFactor = this.translationFactor,
            options = this.options,
            linkColorMode = pick(point.linkColorMode, options.linkColorMode),
            curvy = (
                (chart.inverted ? -this.colDistance : this.colDistance) *
                (options.curveFactor ?? 0.33)
            ),
            nodeLeft = fromNode.nodeX,
            right = toNode.nodeX,
            outgoing = point.outgoing;

        let linkHeight = Math.max(
                (point.weight || 0) * translationFactor,
                this.options.minLinkWidth || 0
            ),
            fromY = this.getY(point, fromNode, 'linksFrom', linkHeight),
            toY = linkToY || this.getY(point, toNode, 'linksTo', linkHeight),
            nodeW = this.nodeWidth,
            straight = right > nodeLeft + nodeW;

        if (chart.inverted) {
            fromY = (chart.plotSizeY || 0) - fromY;
            toY = (chart.plotSizeY || 0) - toY;
            nodeW = -nodeW;
            linkHeight = -linkHeight;
            straight = nodeLeft > right;
        }

        point.shapeType = 'path';
        point.linkBase = [
            fromY,
            fromY + linkHeight,
            toY,
            toY + linkHeight
        ];

        // Ring centre of a self-link, used to anchor its label/tooltip below.
        let ringCx: (number|undefined),
            ringCy: (number|undefined);

        if (
            this.useCircularLayout &&
            fromNode === toNode &&
            typeof toY === 'number'
        ) {
            const ring = this.selfLinkPath(
                fromNode, fromY, linkHeight, nodeLeft, nodeW
            );

            ringCx = ring.cx;
            ringCy = ring.cy;
            point.shapeArgs = { d: ring.d };

        // Links going from left to right
        } else if (straight && typeof toY === 'number') {
            point.shapeArgs = {
                d: [
                    ['M', nodeLeft + nodeW, fromY],
                    [
                        'C',
                        nodeLeft + nodeW + curvy,
                        fromY,
                        right - curvy,
                        toY,
                        right,
                        toY
                    ],
                    ['L', right + (outgoing ? nodeW : 0), toY + linkHeight / 2],
                    ['L', right, toY + linkHeight],
                    [
                        'C',
                        right - curvy,
                        toY + linkHeight,
                        nodeLeft + nodeW + curvy,
                        fromY + linkHeight,
                        nodeLeft + nodeW, fromY + linkHeight
                    ],
                    ['Z']
                ]
            };

        // Handle links that point backwards: circular back-edges, and links
        // whose explicit `column` places the target left of the source. #8218.
        } else if (typeof toY === 'number') {
            point.shapeArgs = {
                d: this.backwardLinkPath(
                    fromY, toY, linkHeight, nodeLeft, right, nodeW
                )
            };
        }

        // Place data labels in the middle - on the ring centre for a self-link,
        // otherwise mid-way along the link band.
        point.dlBox = (isNumber(ringCx) && isNumber(ringCy)) ? {
            x: ringCx,
            y: ringCy - linkHeight / 2,
            height: linkHeight,
            width: 0
        } : {
            x: nodeLeft + (right - nodeLeft + nodeW) / 2,
            y: fromY + (toY - fromY) / 2,
            height: linkHeight,
            width: 0
        };

        // And set the tooltip anchor in the middle
        point.tooltipPos = chart.inverted ? [
            (chart.plotSizeY || 0) - point.dlBox.y - linkHeight / 2,
            (chart.plotSizeX || 0) - point.dlBox.x
        ] : [
            point.dlBox.x,
            point.dlBox.y + linkHeight / 2
        ];

        // Pass test in drawPoints. plotX/Y needs to be defined for dataLabels.
        // #15863
        point.y = point.plotY = 1;
        point.x = point.plotX = 1;

        if (!point.options.color) {
            if (linkColorMode === 'from') {
                point.color = fromNode.color;
            } else if (linkColorMode === 'to') {
                point.color = toNode.color;
            } else if (linkColorMode === 'gradient') {
                const fromColor = color(fromNode.color).get(),
                    toColor = color(toNode.color).get();
                point.color = {
                    linearGradient: {
                        x1: 1,
                        x2: 0,
                        y1: 0,
                        y2: 0
                    },
                    stops: [
                        [0, inverted ? fromColor : toColor],
                        [1, inverted ? toColor : fromColor]
                    ]
                };
            }
        }
    }

    /**
     * Run translation operations for one node.
     * @internal
     */
    public translateNode(
        node: SankeyPoint,
        column: SankeyColumnComposition.ArrayComposition<SankeyPoint>
    ): void {
        const translationFactor = this.translationFactor,
            chart = this.chart,
            options = this.options,
            { borderRadius, borderWidth = 0 } = options,
            sum = node.getSum(),
            nodeHeight = Math.max(
                Math.round(sum * translationFactor),
                this.options.minLinkWidth || 0
            ),
            nodeWidth = Math.round(this.nodeWidth),
            nodeOffset = column.sankeyColumn.offset(node, translationFactor),
            // Crisp the final top (ring offset included) so the shift can't
            // reintroduce a subpixel node edge.
            fromNodeTop = crisp(
                pick(
                    nodeOffset?.absoluteTop,
                    (
                        column.sankeyColumn.top(translationFactor) +
                        (nodeOffset?.relativeTop || 0)
                    )
                ) + (this.colCircOffsets[node.column || 0] || 0),
                borderWidth
            ),
            left = crisp(
                this.firstColCircShift +
                    this.colDistance * (node.column || 0) +
                    borderWidth / 2,
                borderWidth
            ) + relativeLength(node.options[
                chart.inverted ?
                    'offsetVertical' :
                    'offsetHorizontal'
            ] || 0, nodeWidth),
            nodeLeft = chart.inverted ?
                (chart.plotSizeX || 0) - left :
                left;
        node.sum = sum;
        // If node sum is 0, don't render the rect #12453
        if (sum) {
            // Draw the node
            node.shapeType = 'roundedRect';

            node.nodeX = nodeLeft;
            node.nodeY = fromNodeTop;

            let x = nodeLeft,
                y = fromNodeTop,
                width = node.options.width || options.width || nodeWidth,
                height = node.options.height || options.height || nodeHeight;

            // Border radius should not greater than half the height of the node
            // #18956
            const r = clamp(
                relativeLength(
                    (
                        isObject(borderRadius) ?
                            borderRadius.radius :
                            borderRadius
                    ) || 0,
                    width
                ),
                0,
                nodeHeight / 2
            );

            if (chart.inverted) {
                x = nodeLeft - nodeWidth;
                y = (chart.plotSizeY || 0) - fromNodeTop - nodeHeight;
                width = node.options.height || options.height || nodeWidth;
                height = node.options.width || options.width || nodeHeight;
            }

            // Calculate data label options for the point
            node.dlOptions = {
                ...SankeySeries.getDLOptions({
                    level: (this.mapOptionsToLevel as any)[node.level],
                    optionsPoint: node.options
                }),
                zIndex: void 0
            };
            // Delete so it doesn't override anything on merge.
            delete node.dlOptions.zIndex;

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

            node.shapeArgs = {
                x,
                y,
                width,
                height,
                r,
                display: node.hasShape() ? '' : 'none'
            };
        } else {
            node.dlOptions = {
                enabled: false
            };
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface SankeySeries extends NodesComposition.SeriesComposition {
    animate(init?: boolean): void;
    createNode(id: string): SankeyPoint;
    destroy: NodesComposition.SeriesComposition['destroy'];
    forceDL: boolean;
    init(chart: Chart, options: SankeySeriesOptions): void;
    invertible: boolean;
    isCartesian: boolean;
    noSharedTooltip: boolean;
    orderNodes: boolean;
    pointArrayMap: Array<string>;
    pointClass: typeof SankeyPoint;
    remove: typeof ColumnSeries.prototype.remove;
    setData: NodesComposition.SeriesComposition['setData'];
    /**
     * Whether to lay out and render circular links. Disabled in series that
     * inherit sankey but have no circular layout (organization, arc diagram,
     * dependency wheel). #8218
     */
    useCircularLayout: boolean;
}

NodesComposition.compose(SankeyPoint, SankeySeries);

extend(SankeySeries.prototype, {
    animate: LineSeries.prototype.animate,
    // Create a single node that holds information on incoming and outgoing
    // links.
    createNode: NodesComposition.createNode as any,
    forceDL: true,
    invertible: true,
    isCartesian: false,
    orderNodes: true,
    noSharedTooltip: true,
    pointArrayMap: ['from', 'to', 'weight'],
    pointClass: SankeyPoint,
    searchPoint: H.noop,
    useCircularLayout: true
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        sankey: typeof SankeySeries;
    }
}

SeriesRegistry.registerSeriesType('sankey', SankeySeries);

/* *
 *
 *  Default Export
 *
 * */

export default SankeySeries;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * A node in a sankey diagram.
 *
 * @interface Highcharts.SankeyNodeObject
 * @extends Highcharts.Point
 * @product highcharts
 *//**
 * The color of the auto generated node.
 *
 * @name Highcharts.SankeyNodeObject#color
 * @type {Highcharts.ColorType}
 *//**
 * The color index of the auto generated node, especially for use in styled
 * mode.
 *
 * @name Highcharts.SankeyNodeObject#colorIndex
 * @type {number}
 *//**
 * An optional column index of where to place the node. The default behavior is
 * to place it next to the preceding node.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
 *      Specified node column
 *
 * @name Highcharts.SankeyNodeObject#column
 * @type {number}
 * @since 6.0.5
 *//**
 * The id of the auto-generated node, referring to the `from` or `to` setting of
 * the link.
 *
 * @name Highcharts.SankeyNodeObject#id
 * @type {string}
 *//**
 * The name to display for the node in data labels and tooltips. Use this when
 * the name is different from the `id`. Where the id must be unique for each
 * node, this is not necessary for the name.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/sankey/|Highcharts-Demo:}
 *         Sankey diagram with node options
 *
 * @name Highcharts.SankeyNodeObject#name
 * @type {string}
 * @product highcharts
 *//**
 * This option is deprecated, use
 * {@link Highcharts.SankeyNodeObject#offsetHorizontal} and
 * {@link Highcharts.SankeyNodeObject#offsetVertical} instead.
 *
 * The vertical offset of a node in terms of weight. Positive values shift the
 * node downwards, negative shift it upwards.
 *
 * If a percentage string is given, the node is offset by the percentage of the
 * node size plus `nodePadding`.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
 *         Specified node offset
 *
 * @deprecated 9.3.0
 * @name Highcharts.SankeyNodeObject#offset
 * @type {number|string}
 * @default 0
 * @since 6.0.5
 *//**
 * The horizontal offset of a node. Positive values shift the node right,
 * negative shift it left.
 *
 * If a percentage string is given, the node is offset by the percentage of the
 * node size.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
 *         Specified node offset
 *
 * @name Highcharts.SankeyNodeObject#offsetHorizontal
 * @type {number|string}
 * @since 9.3.0
 *//**
 * The vertical offset of a node. Positive values shift the node down,
 * negative shift it up.
 *
 * If a percentage string is given, the node is offset by the percentage of the
 * node size.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/sankey-node-column/|Highcharts-Demo:}
 *         Specified node offset
 *
 * @name Highcharts.SankeyNodeObject#offsetVertical
 * @type {number|string}
 * @since 9.3.0
 */

/**
 * Formatter callback function.
 *
 * @callback Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Data label context to format
 *
 * @return {string|undefined}
 *         Formatted data label text
 */

''; // Detach doclets above
