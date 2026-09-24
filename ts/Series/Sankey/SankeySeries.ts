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
 * @internal
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
     * Largest fraction of either plot axis circular geometry may claim.
     * @internal
     */
    private static readonly CIRCULAR_MAX_FACTOR = 0.6;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @internal
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

    /** @internal */
    public colDistance!: number;

    public data!: Array<SankeyPoint>;

    /**
     * Column-axis space reserved for circular geometry past the first
     * column.
     * @internal
     */
    public firstColCircShift = 0;

    /**
     * Flow-axis extent the columns lay out within, shrunk by what the
     * circular geometry claims. #8218
     * @internal
     */
    public flowHeight = 0;

    /**
     * Flow-axis start of that extent.
     * @internal
     */
    public flowTop = 0;

    public group!: SVGElement;

    /** @internal */
    public mapOptionsToLevel?: (Record<string, SankeySeriesLevelOptions>|null);

    /** @internal */
    public nodeColumns?: Array<SankeyColumnComposition.ArrayComposition<SankeyPoint>>;

    /** @internal */
    public nodeLookup!: Record<string, SankeyPoint>;

    /** @internal */
    public nodePadding!: number;

    /** @internal */
    public nodes!: Array<SankeyPoint>;

    /** @internal */
    public nodeWidth!: number;

    public options!: SankeySeriesOptions;

    public points!: Array<SankeyPoint>;

    /** @internal */
    public translationFactor!: number;

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
     * @internal
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
     * @internal
     */
    public generatePoints(): void {
        NodesComposition.generatePoints.apply(this, arguments as any);

        if (this.useCircularLayout) {
            // Runs on every Sankey translate
            this.markCircularLinks(this.points);
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
     * @internal
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
     * @internal
     * @return {boolean}
     *         Returns true if the series has points at all.
     */
    public hasData(): boolean {
        return !!this.dataTable.rowCount;
    }

    /**
     * Return the presentational attributes.
     * @internal
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
                obj[key] =
                    stateOptions[key] ??
                    (options as any)[key] ??
                    levelOptions[key] ??
                    (series.options as any)[key];
                return obj;
            }, {}),
            color = stateOptions.color ??
                options.color ??
                (values.colorByPoint ? point.color : levelOptions.color);

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
    /** @internal */
    public drawTracker(): void {
        ColumnSeries.prototype.drawTracker.call(this, this.points);
        ColumnSeries.prototype.drawTracker.call(this, this.nodes);
    }

    /** @internal */
    public drawPoints(): void {
        ColumnSeries.prototype.drawPoints.call(this, this.points);
        ColumnSeries.prototype.drawPoints.call(this, this.nodes);
    }

    /** @internal */
    public drawDataLabels(): void {
        ColumnSeries.prototype.drawDataLabels.call(this, this.points);
        ColumnSeries.prototype.drawDataLabels.call(this, this.nodes);
    }

    /**
     * Mark links that would close a directed cycle, which are then left out
     * of the column assignment. Self-links are marked too.
     *
     * @param {Array<SankeyPoint>} points The points to check.
     *
     * @internal
     */
    private markCircularLinks(points: Array<SankeyPoint>): void {
        const nodes = this.nodes;

        for (const point of points) {
            point.isCircular = false;
        }

        // DFS marking links that point back into the path currently walked.
        // The back edge selected as circular follows the input data order.
        const visited = new Set<SankeyPoint>(),
            inStack = new Set<SankeyPoint>(),
            visit = (node: SankeyPoint): void => {
                visited.add(node);
                inStack.add(node);
                for (const link of node.linksFrom) {
                    const nextNode = link.toNode;

                    if (!nextNode) {
                        continue;
                    }
                    if (!visited.has(nextNode)) {
                        visit(nextNode);

                    // Still on the walked path, so the link closes a cycle.
                    // A self-link lands here too, as its node is its own
                    // next node.
                    } else if (inStack.has(nextNode)) {
                        link.isCircular = true;
                    }
                }
                inStack.delete(node);
            };

        for (const node of nodes) {
            if (!visited.has(node)) {
                visit(node);
            }
        }
    }

    /**
     * Run pre-translation by generating the nodeColumns.
     * @internal
     */
    public translate(): void {

        this.generatePoints();

        this.nodeColumns = this.createNodeColumns();

        const series = this,
            chart = this.chart,
            options = this.options,
            nodeColumns = this.nodeColumns,
            columnCount = nodeColumns.length;

        this.nodeWidth = getNodeWidth(this, columnCount);
        this.nodePadding = this.getNodePadding();

        // The whole plot, until the circular geometry below claims its
        // share. #8218
        this.firstColCircShift = 0;
        this.flowTop = 0;
        this.flowHeight = chart.plotSizeY || 0;

        if (this.useCircularLayout) {
            for (const node of this.nodes) {
                node.wrapLap = 0;
            }
        }

        // Find out how much space is needed. Base it on the translation
        // factor of the most spacious column.
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

        let lastColCircShift = 0;

        if (this.useCircularLayout && this.wrapLanes(nodeColumns)) {
            lastColCircShift = this.circularShifts(nodeColumns);
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
     * Reserve the column-axis room the wrapping bands turn in. Returns the
     * last column's share; the first column's is left on the series. #8218
     * @internal
     */
    private circularShifts(
        nodeColumns: Array<
            SankeyColumnComposition.ArrayComposition<SankeyPoint>
        >
    ): number {
        const { chart, nodePadding, nodeWidth, options } = this,
            lastCol = nodeColumns.length - 1;

        // A turn reaches `bend + linkHeight` past the face it leaves. A
        // self-link turns from the centre line, so half a node width less.
        // #8218
        let firstShift = 0,
            lastShift = 0;

        for (const point of this.points) {
            const { fromNode, toNode } = point;

            // A link missing either end is no link at all, and `fromNode ===
            // toNode` would read two of those as a self-link. #8218
            if (!fromNode || !toNode) {
                continue;
            }
            const loops = fromNode === toNode;

            if (!isNumber(point.wrapLane) && !loops) {
                continue;
            }

            // The `wrapLanes` cap on the scale mirrors this reach. #8218
            const reach = nodePadding + this.wrapBend(point) +
                this.linkHeight(point) - (loops ? nodeWidth / 2 : 0);

            if (toNode.column === 0) {
                firstShift = Math.max(firstShift, reach);
            }
            if (fromNode.column === lastCol) {
                lastShift = Math.max(lastShift, reach);
            }
        }

        // Cap the reservation rather than the scale, or a short column
        // axis turns `colDistance` negative and inverts the order. #8218
        const reserved = firstShift + lastShift,
            allowed = SankeySeries.CIRCULAR_MAX_FACTOR * Math.max(
                0,
                (chart.plotSizeX || 0) - nodeWidth -
                (options.borderWidth || 0)
            );

        if (reserved > allowed) {
            firstShift *= allowed / reserved;
            lastShift *= allowed / reserved;
        }
        this.firstColCircShift = firstShift;

        return lastShift;
    }

    /**
     * Thickness of a link's band.
     * @internal
     */
    private linkHeight(point: SankeyPoint): number {
        return Math.max(
            (point.weight || 0) * this.translationFactor,
            this.options.minLinkWidth || 0
        );
    }

    /**
     * Radius a backward link turns on, before the band thickness. A
     * self-link turns on the node width, which leaves its loop a hole. #8218
     * @internal
     */
    private wrapBend(point: SankeyPoint): number {
        return this.nodeWidth * (
            point.fromNode === point.toNode ?
                1 :
                (this.options.curveFactor || 0)
        );
    }

    /**
     * How far a self-link's loop may reach either side of its node's centre
     * line. It bounds the loop both ways round, so a narrow axis shrinks it
     * instead of flattening it. #8218
     * @internal
     */
    private selfReach(node: SankeyPoint): number {
        const { chart, nodePadding, nodeWidth } = this,
            centre = node.nodeX +
                (chart.inverted ? -nodeWidth : nodeWidth) / 2;

        return Math.min(
            centre,
            (chart.plotSizeX || 0) - centre,
            this.colDistance - nodeWidth / 2 - nodePadding
        );
    }

    /**
     * Send every backward link to the top or the bottom lane stack, the
     * shallower one winning, and order each node's band to match. A
     * self-link laps its own node instead, claiming room inside its column.
     * The columns then lay out within what is left of the flow axis, so no
     * lane or lap shares space with a band. Returns whether any link needed
     * a lane. #8218
     * @internal
     */
    private wrapLanes(
        nodeColumns: Array<
            SankeyColumnComposition.ArrayComposition<SankeyPoint>
        >
    ): boolean {
        const { chart, nodePadding, nodeWidth, options, points } = this,
            depth = [0, 0],
            selfWeight = new Map<SankeyPoint, number>(),
            // Columns hug the edge their alignment names, so offer the
            // bands the other one first. #8218
            near = getAlignFactor(options.nodeAlignment || 'center') < 0.5 ?
                1 :
                0,
            // A self-link's two ends must land on the same offset, and a
            // band packs from the top either side, so it goes first. #8218
            laneSide = (point: SankeyPoint): number => (
                point.fromNode === point.toNode ? -2 :
                    isNumber(point.wrapLane) ? (point.wrapUp ? -1 : 1) : 0
            );

        let wraps = false,
            thickest: (SankeyPoint|undefined);

        for (const point of points) {
            const { fromNode, toNode } = point;

            point.wrapLane = void 0;

            // Every link drawn backwards needs a lane, whether a cycle put
            // it there or an explicit `column` did. A link missing either
            // end gets none. #8218
            if (
                !fromNode || !toNode ||
                (toNode.column || 0) > (fromNode.column || 0)
            ) {
                continue;
            }
            wraps = true;

            // A self-link claims room beside its own band, not a lane. Two
            // of them on one node share that room and so draw on top of
            // each other, which is expected. #8218
            if (fromNode === toNode) {
                selfWeight.set(
                    fromNode,
                    (selfWeight.get(fromNode) || 0) + (point.weight || 0)
                );
                // The lap's fixed part, which the solve below reads off the
                // column before it knows the scale.
                fromNode.wrapLap = 2 * nodeWidth;
                continue;
            }
            const side = depth[near] <= depth[1 - near] ? near : 1 - near;

            point.wrapUp = side === 0;
            point.wrapLane = 0;
            depth[side] += point.weight || 0;
            if ((point.weight || 0) > (thickest?.weight || 0)) {
                thickest = point;
            }
        }

        if (!wraps) {
            return false;
        }

        // Order each band by where its links are bound, so none has to cross
        // the band it sits on to reach its lane. Reorders `linksFrom` and
        // `linksTo`. #8218
        const bySide = (a: SankeyPoint, b: SankeyPoint): number =>
            laneSide(a) - laneSide(b);

        for (const node of this.nodes) {
            stableSort(node.linksFrom, bySide);
            stableSort(node.linksTo, bySide);
        }

        // Lanes and laps claim flow-axis space on the same scale as the node
        // bands, so solve for the scale where all three fit: fixed parts off
        // the extent, weighted parts off the divisor. #8218
        const plotSizeY = chart.plotSizeY || 0,
            gaps = Math.max(1, nodeColumns.length - 1),
            span = (chart.plotSizeX || 0) - nodeWidth -
                (options.borderWidth || 0),
            // Breathing room either side of a lane stack, capped so a short
            // flow axis is not reserved away entirely. Self-links lap inside
            // their column and need none. #8218
            pad = (depth[0] || depth[1]) ?
                Math.min(
                    2 * nodePadding,
                    SankeySeries.CIRCULAR_MAX_FACTOR * plotSizeY / 2
                ) :
                0,
            // What the heaviest turn at a plot edge reserves on the column
            // axis, split into its fixed and its weighted part.
            edgeFixed = thickest ? nodePadding + this.wrapBend(thickest) : 0,
            edgeWeight = thickest?.weight || 0;

        this.flowTop = pad;
        this.flowHeight = plotSizeY - 2 * pad;

        let factor = this.translationFactor;

        for (let i = 0; i < nodeColumns.length; i++) {
            const column = nodeColumns[i],
                sum = column.sankeyColumn.sum();

            if (!sum) {
                continue;
            }

            let weight = depth[0] + depth[1];

            if (selfWeight.size) {
                // A node width cannot give way, so cap what the laps claim,
                // or a wide node leaves its column no room for its own
                // bands. The loops then give way in their holes. #8218
                const lap = column.sankeyColumn.lapSum(),
                    allowed = SankeySeries.CIRCULAR_MAX_FACTOR * Math.max(
                        0,
                        this.flowHeight - (options.borderWidth || 0) -
                        (column.length - 1) * nodePadding
                    ),
                    // A self-loop turns both sides of its own node, so the
                    // gap to the next column has to hold its band plus a
                    // node width, or the loop closes over its own hole and
                    // comes out a blob. The turns at the plot edges come off
                    // the same span, and an edge column pays for its own
                    // outward turn as well. #8218
                    edge = i === 0 || i === nodeColumns.length - 1,
                    sides = edge ? 1 : 2,
                    lanes = edge ? gaps + 1 : gaps,
                    selfRoom = span - gaps * (nodeWidth + nodePadding) -
                        sides * edgeFixed -
                        (edge ? nodePadding + nodeWidth / 2 : 0);

                if (lap > allowed) {
                    for (const node of column) {
                        node.wrapLap = (node.wrapLap || 0) * allowed / lap;
                    }
                }

                for (const node of column) {
                    const self = selfWeight.get(node) || 0;

                    weight += self;
                    if (self && selfRoom > 0) {
                        factor = Math.min(
                            factor,
                            selfRoom / (self * lanes + sides * edgeWeight)
                        );
                    }
                }
            }

            factor = Math.min(
                factor,
                column.sankeyColumn.getTranslationFactor(this) * sum /
                    (sum + weight)
            );
        }

        // A turn needs the band's own thickness past each face, and what it
        // may reserve there is capped. Let the flow axis give way rather
        // than fill up, or a band too thick to turn in turns outside. #8218
        if (thickest) {
            const wrapRoom = SankeySeries.CIRCULAR_MAX_FACTOR *
                    (chart.plotSizeX || 0) -
                2 * (this.wrapBend(thickest) + nodePadding);

            if (wrapRoom > 0) {
                factor = Math.min(factor, wrapRoom / (thickest.weight || 1));
            }
        }

        // No column carries any weight, so there is nothing to lay out and
        // no scale to lay it out at. Leaving the extent alone keeps the
        // reserve out of `0 * Infinity`. #8218
        if (!isFinite(factor)) {
            return false;
        }
        this.translationFactor = factor;

        // Stack the lanes inwards from their plot edge, then hand the flow
        // axis whatever they left. Measuring the stacks in pixels rather
        // than in weight is what keeps `minLinkWidth` from inflating one
        // past its share. #8218
        const stack = [pad / 2, pad / 2];

        for (const point of points) {
            if (isNumber(point.wrapLane)) {
                const side = point.wrapUp ? 0 : 1;

                point.wrapLane = stack[side];
                stack[side] += this.linkHeight(point);
            }
        }

        this.flowTop = stack[0] + pad / 2;
        this.flowHeight = plotSizeY - this.flowTop - stack[1] - pad / 2;

        // Additive, so a lap the cap above shrank keeps what it was left.
        selfWeight.forEach((weight, node): void => {
            node.wrapLap = (node.wrapLap || 0) + weight * factor;
        });

        return true;
    }

    /**
     * Resolve a backward link's lane as its centre line and the direction it
     * lies in, so the path and the label anchor read the same one. #8218
     * @internal
     */
    private wrapChannel(
        point: SankeyPoint,
        linkHeight: number
    ): { centerY: number, sign: number } {
        const half = Math.abs(linkHeight) / 2,
            plotSizeY = this.chart.plotSizeY || 0;

        // A self-link laps its own node, so its lane sits beside that band,
        // a full turn away, closing the loop as a circle whose hole tracks
        // the node width. The lap is reserved at the flow-axis start of the
        // column, which an inverted chart mirrors to the far side. #8218
        if (point.fromNode === point.toNode) {
            const { shapeArgs } = point.fromNode,
                top = shapeArgs?.y ?? 0,
                bottom = top + (shapeArgs?.height ?? 0),
                up = !this.chart.inverted,
                // The lap, or the room to the plot edge in a series that
                // lays out no lap.
                room = this.useCircularLayout ?
                    (point.fromNode.wrapLap || 0) :
                    (up ? top : plotSizeY - bottom),
                // The turn is half the travel either way round, so the
                // column axis bounds it as much as the lap does, or the loop
                // keeps its height as it loses its width. #8218
                turn = Math.max(0, Math.min(
                    half + 2 * this.nodeWidth,
                    room - half,
                    2 * (this.selfReach(point.fromNode) - half)
                ));

            return up ?
                { centerY: top - turn, sign: -1 } :
                { centerY: bottom + turn, sign: 1 };
        }

        // An inverted chart mirrors the node faces, so the lane mirrors
        // with them. Left on its own side it would sit across the plot
        // from the face it serves, and the band would cross the whole flow
        // axis to reach it. #8218
        const lane = point.wrapLane || 0,
            up = this.chart.inverted ? !point.wrapUp : point.wrapUp;

        return up ?
            { centerY: lane + half, sign: -1 } :
            { centerY: plotSizeY - lane - half, sign: 1 };
    }

    /**
     * Build the path for a link that points backwards: a circular back-edge,
     * or a link whose explicit `column` places the target left of the source.
     * The band leaves both node faces, turns into its wrap lane, and runs
     * back along it. #8218
     * @internal
     */
    private backwardLinkPath(
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
            // A self-link has no span to cross, so both its faces sit on
            // the node's centre line, or the loop comes out an oval a node
            // wide. It turns on the node width, which gives it its hole.
            loops = point.fromNode === point.toNode,
            bend = this.wrapBend(point),
            fromX = loops ? nodeLeft + nodeW / 2 : nodeLeft + nodeW,
            toX = loops ? nodeLeft + nodeW / 2 : right,
            fromC = fromY + linkHeight / 2,
            toC = toY + linkHeight / 2,
            // A turn also reaches sideways, past the face it leaves, and
            // the columns only gave up what the shifts reserved - which a
            // short column axis caps. Keep the reach inside the plot, or a
            // thick band turns outside it. A self-link turns both sides of
            // its own node, so `selfReach` bounds it. #8218
            plotSizeX = this.chart.plotSizeX || 0,
            selfReach = loops ? this.selfReach(point.fromNode) : 0,
            reachFrom = loops ? selfReach :
                (colSign > 0 ? plotSizeX - fromX : fromX),
            reachTo = loops ? selfReach :
                (colSign > 0 ? toX : plotSizeX - toX),
            // The centre line leaves one face, turns into the lane, runs
            // along it and turns back to the other face. A turn needs twice
            // its radius of travel, so each side keeps what it can afford.
            radius = half + bend,
            rFrom = Math.min(
                radius,
                Math.abs(centerY - fromC) / 2,
                Math.max(0, reachFrom - half)
            ),
            rTo = Math.min(
                radius,
                Math.abs(centerY - toC) / 2,
                Math.max(0, reachTo - half)
            ),
            // Both edges are that centre line offset by half the thickness,
            // so each corner is two arcs about one centre - an even width
            // the whole way round. #8218
            outerFrom = rFrom + half,
            innerFrom = Math.max(0, rFrom - half),
            outerTo = rTo + half,
            innerTo = Math.max(0, rTo - half),
            fromTurn = fromC + sign * rFrom,
            toTurn = toC + sign * rTo,
            laneFrom = centerY - sign * rFrom,
            laneTo = centerY - sign * rTo,
            laneLead = centerY + sign * half,
            laneTail = centerY - sign * half,
            xFromOuter = fromX + colSign * outerFrom,
            xFromInner = fromX + colSign * innerFrom,
            xToOuter = toX - colSign * outerTo,
            xToInner = toX - colSign * innerTo,
            // Every corner turns one way going out, the other coming back.
            out = sign * colSign > 0 ? 1 : 0,
            back = 1 - out;

        return [
            ['M', fromX, fromC - sign * half],
            ['A', outerFrom, outerFrom, 0, 0, out, xFromOuter, fromTurn],
            ['L', xFromOuter, laneFrom],
            ['A', outerFrom, outerFrom, 0, 0, out, fromX, laneLead],
            ['L', toX, laneLead],
            ['A', outerTo, outerTo, 0, 0, out, xToOuter, laneTo],
            ['L', xToOuter, toTurn],
            ['A', outerTo, outerTo, 0, 0, out, toX, toC - sign * half],
            ['L', toX, toC + sign * half],
            ['A', innerTo, innerTo, 0, 0, back, xToInner, toTurn],
            ['L', xToInner, laneTo],
            ['A', innerTo, innerTo, 0, 0, back, toX, laneTail],
            ['L', fromX, laneTail],
            ['A', innerFrom, innerFrom, 0, 0, back, xFromInner, laneFrom],
            ['L', xFromInner, fromTurn],
            ['A', innerFrom, innerFrom, 0, 0, back, fromX, fromC + sign * half],
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
            linkColorMode = (point.linkColorMode ?? options.linkColorMode),
            curvy = (
                (chart.inverted ? -this.colDistance : this.colDistance) *
                (options.curveFactor || 0)
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

        // Label anchor for a wrapping link, set to its lane below.
        let wrapTop: (number|undefined);

        // Links going from left to right
        if (straight && typeof toY === 'number') {
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

            // The band runs along its lane, not between the columns. Half a
            // `linkHeight` back lands on the edge it is measured from. #8218
            if (this.useCircularLayout) {
                wrapTop = this.wrapChannel(point, linkHeight).centerY -
                    linkHeight / 2;
            }
        }

        // Place data labels in the middle - on the lane for a wrapping link,
        // otherwise mid-way along the link band.
        point.dlBox = {
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
            fromNodeTop = crisp(
                nodeOffset?.absoluteTop ?? (
                    column.sankeyColumn.top(translationFactor) +
                    (nodeOffset?.relativeTop || 0)
                ),
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

/** @internal */
interface SankeySeries extends NodesComposition.SeriesComposition {
    /** @internal */
    animate(init?: boolean): void;
    /** @internal */
    createNode(id: string): SankeyPoint;
    /** @internal */
    destroy: NodesComposition.SeriesComposition['destroy'];
    /** @internal */
    forceDL: boolean;
    /** @internal */
    init(chart: Chart, options: SankeySeriesOptions): void;
    /** @internal */
    invertible: boolean;
    /** @internal */
    isCartesian: boolean;
    /** @internal */
    noSharedTooltip: boolean;
    /** @internal */
    orderNodes: boolean;
    /** @internal */
    pointArrayMap: Array<string>;
    /** @internal */
    pointClass: typeof SankeyPoint;
    /** @internal */
    remove: typeof ColumnSeries.prototype.remove;
    /** @internal */
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

/** @internal */
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

/** @internal */
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
