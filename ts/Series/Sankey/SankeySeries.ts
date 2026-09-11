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
     * Largest fraction of the column axis that circular geometry may reserve
     * outside the edge columns. Keeps the columns on most of the axis, and
     * keeps a short column axis, e.g. an inverted landscape plot, from
     * inverting the layout.
     * @internal
     */
    private static readonly CIRCULAR_SHIFT_MAX_FACTOR = 0.6;

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

        for (const node of nodes) {
            for (const link of node.linksFrom) {
                if (link.toNode === node) {
                    link.isCircular = true;
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

        // Find out how much space is needed. Remember which column sets the
        // factor, so the wrap lanes below can rescale it exactly. #8218
        let flowColumnIndex = 0;

        this.translationFactor = nodeColumns.reduce(
            (
                translationFactor: number,
                column: SankeyColumnComposition.ArrayComposition<SankeyPoint>,
                index: number
            ): number => {
                const columnFactor =
                    column.sankeyColumn.getTranslationFactor(series);

                if (columnFactor < translationFactor) {
                    flowColumnIndex = index;
                    return columnFactor;
                }

                return translationFactor;
            },
            Infinity
        );

        this.firstColCircShift = 0;
        this.colCircOffsets = [];

        let lastColCircShift = 0;

        if (this.useCircularLayout) {
            // Wrapping links route outside the central flow, so the columns
            // cannot have the whole flow axis. Reserve what the two lane
            // stacks carry, then stack them at the settled scale. Reserving
            // twice the deeper stack keeps the margin symmetrical, which is
            // how the columns are centred. #8218
            const laneWeights = this.assignWrapSides(),
                reserve = 2 * Math.max(laneWeights[0], laneWeights[1]),
                flowColumn = nodeColumns[flowColumnIndex];

            if (reserve && flowColumn) {
                // The tightest column fills the flow axis at the current
                // factor, so that product is the room there is to divide.
                // Keep a node padding clear on both sides of either lane
                // stack, so the outermost lane does not sit against the plot
                // border and the innermost does not touch the columns. #8218
                const flowSum = flowColumn.sankeyColumn.sum(),
                    free = this.translationFactor * flowSum -
                        4 * this.nodePadding;

                if (flowSum && free > 0) {
                    this.translationFactor = free / (flowSum + reserve);
                }
            }

            this.stackWrapLanes();

            // Circular geometry claims room along the column axis, never on
            // the flow axis: the bands keep the same thickness they would
            // have without any circular links, and the paths are clamped to
            // the plot area where they route. #8218
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

            // The column top is aligned on the node bands alone, so shift
            // ringed columns the other way to align on band plus ring hang.
            // #8218
            const align = getAlignFactor(options.nodeAlignment || 'center');

            this.colCircOffsets = colSelfWeights.map((
                weight,
                index
            ): number => {
                if (!weight) {
                    return 0;
                }
                const lh = Math.max(
                    weight * this.translationFactor,
                    options.minLinkWidth || 0
                );

                return -align * (lh + 2 * this.ringHoleRadius(
                    nodeColumns[index].sankeyColumn.sum(), lh
                ));
            });

            // Reserve the reach at the final scale, shifting all columns
            // inward, plus a node padding so the turn does not run into the
            // side of the plot area. Edges without circular links reserve
            // nothing, and keep sitting flush as they always have. #8218
            this.firstColCircShift = (firstBase || firstWeight) ?
                this.nodePadding + firstBase + Math.max(
                    firstWeight * this.translationFactor,
                    options.minLinkWidth || 0
                ) : 0;
            lastColCircShift = (lastBase || lastWeight) ?
                this.nodePadding + lastBase + Math.max(
                    lastWeight * this.translationFactor,
                    options.minLinkWidth || 0
                ) : 0;

            // Cap the reservation instead of the scale, so heavy circular
            // links cannot drive `colDistance` negative and invert the
            // column order on a short column axis. #8218
            const axis = Math.max(
                    0,
                    (chart.plotSizeX || 0) - this.nodeWidth -
                    (options.borderWidth || 0)
                ),
                reserved = this.firstColCircShift + lastColCircShift,
                allowed = SankeySeries.CIRCULAR_SHIFT_MAX_FACTOR * axis;

            if (reserved > allowed) {
                const scale = allowed / reserved;

                this.firstColCircShift *= scale;
                lastColCircShift *= scale;
            }
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
            columns = this.nodeColumns,
            column = columns && columns[fromNode.column || 0],
            rInner = this.ringHoleRadius(
                column ? column.sankeyColumn.sum() : 0,
                linkHeight
            ),
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
     * Hole radius of a self-link's loop. Tracks the node width, but gives way
     * so that the node's column and the loop together fit the flow axis. The
     * band keeps the thickness its weight earns; only the hole shrinks. #8218
     *
     * @param {number} columnSum Summed weight of the node's column.
     * @param {number} linkHeight Thickness of the self-link's band.
     * @return {number} Hole radius in pixels.
     *
     * @internal
     */
    public ringHoleRadius(columnSum: number, linkHeight: number): number {
        const free = (this.chart.plotSizeY || 0) - Math.abs(linkHeight) -
            columnSum * this.translationFactor;

        return Math.max(0, Math.min(this.nodeWidth, free / 2));
    }

    /**
     * Send every backward link to the top or the bottom lane stack, the
     * shallower one winning each link so the two stay even. Returned in
     * weight, not pixels: the scale is not settled until the stacks are
     * known. #8218
     *
     * @return {Array<number>} Flow carried by the top and the bottom stack.
     *
     * @internal
     */
    public assignWrapSides(): Array<number> {
        const depth = [0, 0];

        let circular = false;

        for (const point of this.points) {
            if (!point.isCircular) {
                point.wrapLane = void 0;
                continue;
            }
            circular = true;

            if (point.fromNode === point.toNode) {
                point.wrapLane = void 0;
                continue;
            }
            const side = depth[0] <= depth[1] ? 0 : 1;

            point.wrapUp = side === 0;
            point.wrapLane = 0;
            depth[side] += point.weight || 0;
        }

        // Stack each node's band in the order the links leave it: the ones
        // routing above the flow on top, the flow itself in the middle, the
        // ones routing below at the bottom. A link attached on the far side
        // of its own band would have to cross it to reach its lane. #8218
        if (circular) {
            const laneSide = (point: SankeyPoint): number => {
                    if (!point.isCircular) {
                        return 0;
                    }
                    return point.wrapUp ? -1 : 1;
                },
                bySide = (a: SankeyPoint, b: SankeyPoint): number =>
                    laneSide(a) - laneSide(b);

            for (const node of this.nodes) {
                stableSort(node.linksFrom, bySide);
                stableSort(node.linksTo, bySide);
            }
        }

        return depth;
    }

    /**
     * Stack each backward link's lane inwards from the plot edge it routes
     * along, at the settled scale. Two lanes never share flow-axis space, so
     * the band of one is never drawn inside another. #8218
     * @internal
     */
    public stackWrapLanes(): void {
        const minLinkWidth = this.options.minLinkWidth || 0,
            plotSizeY = this.chart.plotSizeY || 0,
            // Start clear of the plot border, matching the reserve.
            depth = [this.nodePadding, this.nodePadding];

        for (const point of this.points) {
            if (!isNumber(point.wrapLane)) {
                continue;
            }
            const side = point.wrapUp ? 0 : 1;

            point.wrapLane = depth[side];
            depth[side] += Math.max(
                (point.weight || 0) * this.translationFactor,
                minLinkWidth
            );
        }

        // `minLinkWidth` can inflate the stacks past what the reserve made
        // room for. Compress them, the one place in the routing where that
        // decision is made. #8218
        const stacked = depth[0] + depth[1];

        if (stacked > plotSizeY && stacked > 0) {
            const scale = plotSizeY / stacked;

            for (const point of this.points) {
                if (isNumber(point.wrapLane)) {
                    point.wrapLane *= scale;
                }
            }
        }
    }

    /**
     * Resolve the wrap channel of a backward link from the lane assigned in
     * `stackWrapLanes`. Returned as the centre line of the lane and the
     * direction it lies in from the node faces, so the path and the label
     * anchor read the same lane. #8218
     * @internal
     */
    public wrapChannel(
        point: SankeyPoint,
        linkHeight: number
    ): { centerY: number, sign: number } {
        const half = Math.abs(linkHeight) / 2,
            lane = point.wrapLane || 0;

        return point.wrapUp ?
            { centerY: lane + half, sign: -1 } :
            { centerY: (this.chart.plotSizeY || 0) - lane - half, sign: 1 };
    }

    /**
     * Build the path for a link that points backwards: a circular back-edge,
     * or a link whose explicit `column` places the target left of the source.
     * The band leaves both node faces, turns into its wrap lane, and runs
     * back along it. #8218
     * @internal
     */
    public backwardLinkPath(
        point: SankeyPoint,
        fromY: number,
        toY: number,
        linkHeight: number,
        nodeLeft: number,
        right: number,
        nodeW: number
    ): SVGPath {
        const { centerY, sign } = this.wrapChannel(point, linkHeight),
            colSign = this.chart.inverted ? -1 : 1,
            half = Math.abs(linkHeight) / 2,
            bend = this.nodeWidth * (this.options.curveFactor ?? 0.33),
            // The centre line leaves one node face, turns into the lane, runs
            // along it, and turns back to the other face. Its four corners
            // are quarter circles of this radius, centred on the two faces.
            radius = half + bend,
            fromX = nodeLeft + nodeW,
            toX = right,
            // Face centres of the band at the two nodes.
            fromC = fromY + linkHeight / 2,
            toC = toY + linkHeight / 2,
            // A turn needs twice its radius of travel towards the lane. A
            // link attached right beside its own lane has less than that, so
            // each side keeps the radius it can afford. #8218
            rFrom = Math.min(radius, Math.abs(centerY - fromC) / 2),
            rTo = Math.min(radius, Math.abs(centerY - toC) / 2),
            // Both band edges are the same centre line offset by half its
            // thickness, so every corner is two arcs about one centre. That
            // is what keeps the band an even width the whole way round.
            outerFrom = rFrom + half,
            innerFrom = Math.max(0, rFrom - half),
            outerTo = rTo + half,
            innerTo = Math.max(0, rTo - half),
            fromTurn = fromC + sign * rFrom,
            toTurn = toC + sign * rTo,
            laneFrom = centerY - sign * rFrom,
            laneTo = centerY - sign * rTo,
            // The band edges where they meet the faces and the lane.
            fromLead = fromC - sign * half,
            fromTail = fromC + sign * half,
            toLead = toC - sign * half,
            toTail = toC + sign * half,
            laneLead = centerY + sign * half,
            laneTail = centerY - sign * half,
            xFromOuter = fromX + colSign * outerFrom,
            xFromInner = fromX + colSign * innerFrom,
            xToOuter = toX - colSign * outerTo,
            xToInner = toX - colSign * innerTo,
            // All four corners turn the same way going out, and the other
            // way coming back along the inner edge.
            out = sign * colSign > 0 ? 1 : 0,
            back = 1 - out;

        return [
            ['M', fromX, fromLead],
            ['A', outerFrom, outerFrom, 0, 0, out, xFromOuter, fromTurn],
            ['L', xFromOuter, laneFrom],
            ['A', outerFrom, outerFrom, 0, 0, out, fromX, laneLead],
            ['L', toX, laneLead],
            ['A', outerTo, outerTo, 0, 0, out, xToOuter, laneTo],
            ['L', xToOuter, toTurn],
            ['A', outerTo, outerTo, 0, 0, out, toX, toLead],
            ['L', toX, toTail],
            ['A', innerTo, innerTo, 0, 0, back, xToInner, toTurn],
            ['L', xToInner, laneTo],
            ['A', innerTo, innerTo, 0, 0, back, toX, laneTail],
            ['L', fromX, laneTail],
            ['A', innerFrom, innerFrom, 0, 0, back, xFromInner, laneFrom],
            ['L', xFromInner, fromTurn],
            ['A', innerFrom, innerFrom, 0, 0, back, fromX, fromTail],
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

        // Anchors for the label/tooltip below: the ring centre of a self-link,
        // or the top of a backward link's wrap channel.
        let ringCx: (number|undefined),
            ringCy: (number|undefined),
            wrapTop: (number|undefined);

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
                    point, fromY, toY, linkHeight, nodeLeft, right, nodeW
                )
            };

            // The band runs along its lane, not between the columns, so
            // anchor the label there. Stepping back by half a `linkHeight`
            // lands on the edge it is measured from, whichever way it runs.
            // #8218
            wrapTop = this.wrapChannel(point, linkHeight).centerY -
                linkHeight / 2;
        }

        // Place data labels in the middle - on the ring centre for a self-link,
        // on the wrap channel for a backward link, otherwise mid-way along the
        // link band.
        point.dlBox = (isNumber(ringCx) && isNumber(ringCy)) ? {
            x: ringCx,
            y: ringCy - linkHeight / 2,
            height: linkHeight,
            width: 0
        } : {
            x: nodeLeft + (right - nodeLeft + nodeW) / 2,
            y: isNumber(wrapTop) ? wrapTop : fromY + (toY - fromY) / 2,
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
