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
    SankeySeriesOptions,
    SankeySeriesTooltipOptions
} from './SankeySeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type TooltipOptions from '../../Core/TooltipOptions';

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
    isNumber,
    isObject,
    merge,
    pick,
    relativeLength,
    stableSort
} from '../../Shared/Utilities.js';
composeTextPath(SVGElement);

/**
 * Visit the flow-axis coordinates of M/L/C path segments, stored at even
 * indexes from 2.
 * @internal
 */
function eachSegmentY(
    d: (string|SVGPath|undefined),
    visit: (segment: SVGPath.Segment, i: number) => void
): void {
    if (!d || typeof d === 'string') {
        return;
    }
    for (const segment of d) {
        for (let i = 2; i < segment.length; i += 2) {
            visit(segment, i);
        }
    }
}

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
     * Bend radius of circular links, in pixels.
     * @private
     */
    private static readonly CIRCULAR_LINK_BEND = 20;

    /**
     * Clearance between a circular link and the node it bends around, in
     * pixels.
     * @private
     */
    private static readonly CIRCULAR_LINK_MARGIN = 8;

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

    public colDistance!: number;

    public data!: Array<SankeyPoint>;

    public group!: SVGElement;

    public mapOptionsToLevel?: (Record<string, SankeySeriesLevelOptions>|null);

    public nodeColumns?: Array<SankeyColumnComposition.ArrayComposition<SankeyPoint>>;

    public nodeLookup!: Record<string, SankeyPoint>;

    public nodePadding!: number;

    public nodes!: Array<SankeyPoint>;

    public nodeWidth!: number;

    public options!: SankeySeriesOptions;

    public points!: Array<SankeyPoint>;

    public translationFactor!: number;

    /**
     * Whether to use circular layout.
     * @internal
     */
    public useCircularLayout!: boolean;

    /**
     * Whether the data has circular dependencies.
     * @internal
     */
    public isDataCircular!: boolean;

    // The merged tooltip options also carry the node-related members from
    // the series-level defaults.
    declare public tooltipOptions: (
        TooltipOptions & Pick<
            SankeySeriesTooltipOptions,
            'nodeFormat'|'nodeFormatter'|'nodeSelfLinkFormat'
        >
    );

    /**
     * Reserved column-axis space for the circular bend on the first column.
     * @internal
     */
    public firstColCircShift = 0;

    /**
     * Vertical node offset used to center simple reciprocal links.
     * @internal
     */
    public circularNodeTopOffset = 0;

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
            // Runs on every Sankey translate, so keep the cycle check linear
            // and allocation-light for the common non-circular case.
            this.isDataCircular = this.markCircularLinks(this.points);
        }

        if (this.orderNodes) {
            for (const node of this.nodes) {
                // Identify the root node(s). Circular links, including
                // hidden self-links, do not anchor a node. The check
                // short-circuits on the first regular incoming link.
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
            if (maxLength * nodePadding > (this.chart.plotSizeY as any)) {
                nodePadding = (this.chart.plotSizeY as any) / maxLength;
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
     * Mark links that would close a directed cycle in from/to topology, and
     * sum the hidden self-link weight per node. Circular links are ignored
     * when assigning node columns. Self-links are marked circular too, but
     * do not count towards the return value since they render as hidden
     * paths and need no circular layout space.
     *
     * @param {Array<SankeyPoint>} points The points to check.
     * @return {boolean} Whether any circular layout is required, i.e. any
     * back edge between two distinct nodes was found.
     *
     * @internal
     */
    public markCircularLinks(points: Array<SankeyPoint>): boolean {
        // The node topology (`this.nodes`, `node.linksFrom`) was just built
        // by NodesComposition.generatePoints, in input data order.
        const nodes = this.nodes;

        for (const point of points) {
            point.isCircular = false;
        }

        for (const node of nodes) {
            let selfLinkWeight = 0;

            // Self-links are marked circular (they are hidden and surfaced
            // via the node tooltip), but only proper back edges require
            // circular layout space.
            for (const link of node.linksFrom) {
                if (link.toNode === node) {
                    link.isCircular = true;
                    selfLinkWeight += link.weight || 0;
                }
            }
            node.selfLinkWeight = selfLinkWeight;
        }

        const visited = new Set<SankeyPoint>(),
            nodesInStack = new Set<SankeyPoint>(),
            // Iterative DFS to avoid stack overflow on large graphs. Each
            // frame tracks the node and an index into its outgoing links so
            // we can resume after recursing into a child. The back edge
            // selected as circular follows the input data order.
            stack: Array<{ node: SankeyPoint, i: number }> = [];
        let hasCircularLink = false;

        for (const start of nodes) {
            if (visited.has(start)) {
                continue;
            }

            visited.add(start);
            nodesInStack.add(start);
            stack.push({ node: start, i: 0 });

            while (stack.length) {
                const frame = stack[stack.length - 1],
                    links = frame.node.linksFrom;

                if (frame.i >= links.length) {
                    nodesInStack.delete(frame.node);
                    stack.pop();
                    continue;
                }

                const link = links[frame.i++],
                    nextNode = link.toNode;

                if (!nextNode || nextNode === frame.node) {
                    continue;
                }

                if (!visited.has(nextNode)) {
                    visited.add(nextNode);
                    nodesInStack.add(nextNode);
                    stack.push({ node: nextNode, i: 0 });
                } else if (nodesInStack.has(nextNode)) {
                    link.isCircular = true;
                    hasCircularLink = true;
                }
            }
        }

        return hasCircularLink;
    }

    /**
     * The rendered height of a link, with the `minLinkWidth` floor applied.
     * @internal
     */
    public getLinkHeight(weight: number): number {
        return Math.max(
            weight * this.translationFactor,
            this.options.minLinkWidth || 0
        );
    }

    /**
     * Get the maximum weight of the circular links entering the first, or
     * leaving the last, column. Returns 0 when that column has no circular
     * links.
     * @internal
     */
    public getCircularLinkMaxWeight(last?: boolean): number {
        const nodeColumns = this.nodeColumns;

        if (!nodeColumns) {
            return 0;
        }

        const column = last ?
            nodeColumns[nodeColumns.length - 1] : nodeColumns[0];

        let weight = 0;

        for (const node of column) {
            const links = last ? node.linksFrom : node.linksTo;

            for (const link of links) {
                if (link.isCircular && link.fromNode !== link.toNode) {
                    weight = Math.max(weight, link.weight || 0);
                }
            }
        }

        return weight;
    }

    /**
     * Scale circular data down when one circular link would otherwise
     * dominate the plot. This keeps simple reciprocal diagrams readable. On
     * plots too small to reserve any room, the constraints are skipped
     * rather than collapsing the scale to zero, so the diagram degrades to
     * overflow instead of disappearing.
     * @internal
     */
    public scaleCircularTranslationFactor(
        firstWeight: number,
        lastWeight: number
    ): void {
        const chart = this.chart,
            nodeColumns = this.nodeColumns,
            bend = SankeySeries.CIRCULAR_LINK_BEND,
            margin = bend + SankeySeries.CIRCULAR_LINK_MARGIN,
            firstH = firstWeight ? this.getLinkHeight(firstWeight) : 0,
            lastH = lastWeight ? this.getLinkHeight(lastWeight) : 0,
            maxBandY = Math.max(firstH, lastH);

        if (!maxBandY) {
            return;
        }

        let scale = 1;

        // Keep one circular band from dominating the flow axis.
        const yLimit = (chart.plotSizeY || 0) / 4;
        if (yLimit > 0 && maxBandY > yLimit) {
            scale = yLimit / maxBandY;
        }

        if (nodeColumns && nodeColumns.length >= 2) {
            const N = nodeColumns.length,
                availX = (chart.plotSizeX || chart.plotWidth) - this.nodeWidth,
                sides = (firstH > 0 ? 1 : 0) + (lastH > 0 ? 1 : 0);

            // Reserve column-axis room for outer circular bends.
            const totalRawHeight = firstH + lastH,
                maxShifts = availX * 0.6 - sides * margin;
            if (maxShifts > 0 && totalRawHeight * scale > maxShifts) {
                scale = Math.min(scale, maxShifts / totalRawHeight);
            }

            // Keep middle-column wraps clear of downstream nodes. A wrap
            // crosses middle gaps unless it spans the full diagram, on
            // either its from or its to side. Hidden self-links need no
            // room.
            let maxMiddleLh = 0;
            for (const point of this.points) {
                const { fromNode, toNode } = point;
                if (
                    point.isCircular &&
                    fromNode &&
                    toNode &&
                    fromNode !== toNode &&
                    (
                        (
                            isNumber(fromNode.column) &&
                            fromNode.column < N - 1
                        ) || (
                            isNumber(toNode.column) &&
                            toNode.column > 0
                        )
                    )
                ) {
                    maxMiddleLh = Math.max(
                        maxMiddleLh,
                        this.getLinkHeight(point.weight || 0)
                    );
                }
            }
            if (maxMiddleLh > 0) {
                const numerator = availX - (N - 1) * this.nodeWidth -
                        sides * margin - (N - 1) * bend,
                    denominator = (N - 1) * maxMiddleLh + firstH + lastH;
                if (numerator > 0 && numerator / denominator < scale) {
                    scale = numerator / denominator;
                }
            }
        }

        if (scale < 1) {
            this.translationFactor *= scale;
        }
    }

    /**
     * Get the Y extent of currently translated nodes and links.
     * @internal
     */
    public getLayoutYExtremes(): { min: number, max: number } {
        let min = Infinity,
            max = -Infinity;

        const addY = (y: unknown): void => {
            if (isNumber(y)) {
                min = Math.min(min, y);
                max = Math.max(max, y);
            }
        };

        for (const node of this.nodes) {
            const { shapeArgs } = node;

            if (
                shapeArgs &&
                isNumber(shapeArgs.y) &&
                isNumber(shapeArgs.height)
            ) {
                addY(shapeArgs.y);
                addY(shapeArgs.y + shapeArgs.height);
            }
        }

        for (const point of this.points) {
            eachSegmentY(
                point.shapeArgs?.d,
                (segment, i): void => addY(segment[i])
            );
        }

        return { min, max };
    }

    /**
     * Shift already translated circular data vertically without rerouting it.
     * @internal
     */
    public shiftCircularLayout(shift: number): void {
        const inverted = this.chart.inverted,
            tooltipIndex = inverted ? 0 : 1,
            // `nodeY` and `tooltipPos` live in flow space, which is mirrored
            // relative to the rendered `shapeArgs` space in inverted charts.
            flowShift = inverted ? -shift : shift;

        for (const node of this.nodes) {
            if (node.shapeArgs && isNumber(node.shapeArgs.y)) {
                node.shapeArgs.y += shift;
                node.nodeY += flowShift;
            }

            if (node.tooltipPos) {
                node.tooltipPos[tooltipIndex] += flowShift;
            }
        }

        for (const point of this.points) {
            eachSegmentY(point.shapeArgs?.d, (segment, i): void => {
                const y = segment[i];

                if (isNumber(y)) {
                    (segment as Array<string|number>)[i] = y + shift;
                }
            });

            if (point.linkBase) {
                for (let i = 0; i < point.linkBase.length; ++i) {
                    point.linkBase[i] += shift;
                }
            }

            if (point.dlBox) {
                point.dlBox.y += shift;
            }

            if (point.tooltipPos) {
                point.tooltipPos[tooltipIndex] += flowShift;
            }
        }
    }

    /**
     * Run pre-translation by generating the nodeColumns.
     * @private
     */
    public translate(): void {

        this.isDataCircular = false;
        this.firstColCircShift = 0;
        this.circularNodeTopOffset = 0;
        this.generatePoints();

        this.nodeColumns = this.createNodeColumns();

        const series = this,
            chart = this.chart,
            options = this.options,
            nodeColumns = this.nodeColumns,
            columnCount = nodeColumns.length;

        this.nodeWidth = getNodeWidth(this, columnCount);
        this.nodePadding = this.getNodePadding();

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

        let firstColCircLinkMaxH = 0,
            lastColCircLinkMaxH = 0;

        if (this.isDataCircular) {
            // Make some room for the circular links
            this.translationFactor = this.translationFactor / 2;

            const firstW = this.getCircularLinkMaxWeight(),
                lastW = this.getCircularLinkMaxWeight(true);

            this.scaleCircularTranslationFactor(firstW, lastW);
            firstColCircLinkMaxH = firstW ? this.getLinkHeight(firstW) : 0;
            lastColCircLinkMaxH = lastW ? this.getLinkHeight(lastW) : 0;
        }

        // The circular bend extends past col 0 / last col by
        // `linkHeight + bend + margin`. Reserve that space from the
        // column-axis range so ALL columns shift evenly inward, instead of
        // squeezing col 0 / last col against their neighbors.
        const margin = SankeySeries.CIRCULAR_LINK_BEND +
            SankeySeries.CIRCULAR_LINK_MARGIN;
        this.firstColCircShift = firstColCircLinkMaxH ?
            firstColCircLinkMaxH + margin : 0;
        const lastColCircShift = lastColCircLinkMaxH ?
            lastColCircLinkMaxH + margin : 0;

        this.colDistance =
            (
                (chart.plotSizeX as any) - this.nodeWidth -
                (options.borderWidth as any) -
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

        const translateNodesAndLinks = (): void => {
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
                    if (
                        (linkPoint.weight || linkPoint.isNull) &&
                        linkPoint.to
                    ) {
                        series.translateLink(linkPoint);
                        linkPoint.allowShadow = false;
                    }
                }
            }
        };

        translateNodesAndLinks();

        // Recenter the translated layout on the flow axis so the circular
        // bends are balanced within the plot. The measured extremes and the
        // shift both operate in `shapeArgs` space, which maps to the flow
        // axis in normal and inverted mode alike (bounded by `plotSizeY`).
        if (this.isDataCircular) {
            const firstPoint = this.points[0],
                secondPoint = this.points[1],
                simpleCircularData = (
                    this.nodes.length === 2 &&
                    this.points.length === 2 &&
                    !!firstPoint.isCircular !== !!secondPoint.isCircular &&
                    firstPoint.fromNode === secondPoint.toNode &&
                    firstPoint.toNode === secondPoint.fromNode
                ),
                plotFlowSize = chart.plotSizeY || 0,
                { min, max } = this.getLayoutYExtremes(),
                offset = isNumber(min) ?
                    (plotFlowSize - min - max) / 2 :
                    0,
                circularNodeTopOffset = simpleCircularData ?
                    offset :
                    Math.max(Math.min(offset, 0), -min);

            if (Math.abs(circularNodeTopOffset) > 1) {
                // Simple reciprocal data in normal mode re-routes through a
                // re-translate so the links re-pick their bend direction at
                // the centered position. Every other case (including all
                // inverted data) rigidly shifts the final geometry, which is
                // sign-correct in `shapeArgs` space.
                if (simpleCircularData && !chart.inverted) {
                    this.circularNodeTopOffset = circularNodeTopOffset;
                    translateNodesAndLinks();
                } else {
                    this.shiftCircularLayout(circularNodeTopOffset);
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
            options = this.options,
            linkColorMode = pick(point.linkColorMode, options.linkColorMode),
            curvy = (
                (chart.inverted ? -this.colDistance : this.colDistance) *
                (options.curveFactor as any)
            ),
            nodeLeft = fromNode.nodeX,
            right = toNode.nodeX,
            outgoing = point.outgoing;

        let linkHeight = this.getLinkHeight(point.weight || 0),
            fromY = this.getY(point, fromNode, 'linksFrom', linkHeight),
            toY = linkToY || this.getY(point, toNode, 'linksTo', linkHeight),
            nodeW = this.nodeWidth,
            straight = right > nodeLeft + nodeW;

        if (chart.inverted) {
            fromY = (chart.plotSizeY as any) - fromY;
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

        // Self-links render as hidden paths and their weight is surfaced in
        // the node tooltip instead. Skip the label, tooltip and color setup
        // below so nothing targets the invisible link, and clear any state
        // left over from a data update of a previously visible link - the
        // undefined plotY also makes drawPoints destroy a stale graphic.
        if (
            point.isCircular &&
            fromNode === toNode
        ) {
            point.shapeArgs = {
                d: []
            };
            point.plotX = point.plotY = void 0;
            point.dlBox = point.tooltipPos = void 0;
            return;
        }

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
            // Route in natural flow coordinates, then mirror inverted charts.
            const bend = SankeySeries.CIRCULAR_LINK_BEND,
                plotSizeY = chart.plotSizeY || 0,
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
                fy3 = fy2 + sign * bend,
                y5 = innerY,
                y4 = y5 - sign * bend,
                y6 = y5 + sign * lh,
                ty1 = toY + (farFromBend ? linkHeight : 0),
                ty2 = toY + (farFromBend ? 0 : linkHeight),
                ty3 = ty2 + sign * bend,
                cfy1 = fy2 + 0.7 * (fy1 - fy2),
                cy2 = y5 + sign * lh * 0.7,
                cty1 = ty2 + 0.7 * (ty1 - ty2),
                cx1 = x3 - colSign * lh * 0.7,
                cx2 = x4 + colSign * lh * 0.7;

            point.shapeArgs = {
                d: [
                    ['M', x4, fy1],
                    ['C', cx2, fy1, x6, cfy1, x6, y4],
                    ['C', x6, cy2, cx2, y6, x4, y6],
                    ['L', x3, y6],
                    ['C', cx1, y6, x1, cy2, x1, y4],
                    ['L', x1, ty3],
                    ['C', x1, cty1, cx1, ty1, x3, ty1],
                    ['L', x3, ty2],
                    ['C', x2, ty2, x2, ty2, x2, ty3],
                    ['L', x2, y4],
                    ['C', x2, y5, x2, y5, x3, y5],
                    ['L', x4, y5],
                    ['C', x5, y5, x5, y5, x5, y4],
                    ['L', x5, fy3],
                    ['C', x5, fy2, x5, fy2, x4, fy2],
                    ['Z']
                ]
            };
        }

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
                this.options.minLinkWidth as any
            ),
            nodeWidth = Math.round(this.nodeWidth),
            nodeOffset = column.sankeyColumn.offset(node, translationFactor),
            fromNodeTop = (
                crisp(pick(
                    (nodeOffset as any).absoluteTop,
                    (
                        column.sankeyColumn.top(translationFactor) +
                        (nodeOffset as any).relativeTop
                    )
                ), borderWidth) + this.circularNodeTopOffset
            ),
            left = crisp(
                this.firstColCircShift +
                    this.colDistance * (node.column as any) +
                    borderWidth / 2,
                borderWidth
            ) + relativeLength(node.options[
                chart.inverted ?
                    'offsetVertical' :
                    'offsetHorizontal'
            ] || 0, nodeWidth),
            nodeLeft = chart.inverted ?
                (chart.plotSizeX as any) - left :
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
                y = (chart.plotSizeY as any) - fromNodeTop - nodeHeight;
                width = node.options.height || options.height || nodeWidth;
                height = node.options.width || options.width || nodeHeight;
            }

            // A chart consisting of a single self-linked node has no flow to
            // lay out - center the node in the plot instead of pinning it to
            // a corner.
            if (
                this.nodes.length === 1 &&
                node.linksFrom.length > 0 &&
                node.linksFrom.every((link): boolean => (
                    !!link.isCircular &&
                    link.fromNode === link.toNode
                ))
            ) {
                x = ((chart.plotSizeX as any) - width) / 2;
                y = ((chart.plotSizeY as any) - height) / 2;
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
