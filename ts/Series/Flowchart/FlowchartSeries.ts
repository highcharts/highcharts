/* *
 *
 *  Flowchart series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Tord Vikestad
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
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    FlowchartNodeShape,
    FlowchartShapeSize
} from './FlowchartSymbols';
import type FlowchartSeriesOptions from './FlowchartSeriesOptions';
import type {
    FlowchartLayoutPosition
} from './FlowchartLayout';
import type PointerEvent from '../../Core/PointerEvent';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import DragNodesComposition from '../DragNodesComposition.js';
import FlowchartLayout from './FlowchartLayout.js';
import FlowchartPoint from './FlowchartPoint.js';
import FlowchartSeriesDefaults from './FlowchartSeriesDefaults.js';
import FlowchartSymbols from './FlowchartSymbols.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
const {
    series: Series,
    seriesTypes: {
        networkgraph: NetworkgraphSeries
    }
} = SeriesRegistry;
import {
    addEvent,
    extend,
    isArray,
    merge,
    splat
} from '../../Shared/Utilities.js';

const {
    shapeSize,
    symbolByShape
} = FlowchartSymbols;

/* *
 *
 *  Constants
 *
 * */

/**
 * The class a waypoint marker carries, used both to style it and to find the
 * previous render's markers again.
 * @internal
 */
const waypointClassName = 'highcharts-flowchart-waypoint';

/**
 * Where a node with no solved position ends up: an unlinked node never enters
 * the layout's graph, so there is nothing to derive a position from.
 * @internal
 */
const unpositioned: FlowchartLayoutPosition = { x: 0.5, y: 0.5 };

/**
 * How far the pointer has to travel before a press counts as a drag rather
 * than a click, in pixels.
 * @internal
 */
const dragThreshold = 5;

/* *
 *
 *  Class
 *
 * */

/**
 * @internal
 * @class
 * @name Highcharts.seriesTypes.flowchart
 *
 * @augments Highcharts.seriesTypes.networkgraph
 */
class FlowchartSeries extends NetworkgraphSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions = merge(
        NetworkgraphSeries.defaultOptions,
        FlowchartSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /** @internal */
    public static compose(
        ChartClass: typeof Chart
    ): void {
        DragNodesComposition.compose(ChartClass);
        FlowchartSymbols.compose(SVGRenderer);
    }

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<FlowchartPoint>;

    /**
     * There is no simulation to wait for, so data labels are never deferred.
     * @internal
     */
    public deferDataLabels: boolean = false;

    public nodes!: Array<FlowchartPoint>;

    public options!: FlowchartSeriesOptions;

    public points!: Array<FlowchartPoint>;

    /**
     * Measured label sizes, keyed by text and style. Sizing a shape means
     * measuring its label, which forces a layout on every measurement - so
     * repeated labels and repeated redraws reuse the same result.
     * @internal
     */
    public labelSizeCache?: Record<string, FlowchartShapeSize>;

    /**
     * Fractional positions the user has dragged internal waypoints to, keyed
     * by the layout's (stable, deterministic) waypoint id. Waypoints aren't
     * points, so their overrides can't live on one.
     * @internal
     */
    public waypointDragPos?: Record<string, PositionObject>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * The size a node's label renders at, so its shape can be grown to fit.
     *
     * Only the label's plain text is measured - a `dataLabels.formatter`
     * returning something else, or markup a format string expands to, is not
     * accounted for. The style is applied even in styled mode, where it does
     * not affect the rendered label: it is the best available estimate of the
     * label's font, and a shape that is a little too big is far less visible
     * than one its text spills out of.
     * @internal
     */
    private measureLabel(
        text: string,
        style?: CSSObject
    ): FlowchartShapeSize {
        const cache = this.labelSizeCache ||= {},
            cacheKey = text + '|' + JSON.stringify(style || {});

        if (!cache[cacheKey]) {
            const element = this.chart.renderer.text(text).add();

            if (style) {
                element.css(style);
            }

            const bBox = element.getBBox();
            element.destroy();

            cache[cacheKey] = {
                width: bBox.width,
                height: bBox.height
            };
        }

        return cache[cacheKey];
    }

    /**
     * The shape a node is drawn with: its own, if it names one this series
     * knows, otherwise the series-wide `nodeShape`.
     * @internal
     */
    private nodeShape(node: FlowchartPoint): FlowchartNodeShape {
        const shape = node.options.shape;

        if (shape && symbolByShape[shape]) {
            return shape;
        }

        const seriesShape = this.options.nodeShape;

        return seriesShape && symbolByShape[seriesShape] ?
            seriesShape :
            'rectangle';
    }

    /**
     * The style a node's label renders with: the series-wide data label
     * style, with the node's own on top.
     * @internal
     */
    private nodeLabelStyle(node: FlowchartPoint): CSSObject {
        return merge(
            splat(this.options.dataLabels || {})[0].style,
            splat(node.options.dataLabels || {})[0].style
        );
    }

    /**
     * Node labels sit inside a shape while link labels sit on the background
     * between two nodes, so the two are drawn with different options. The
     * link-only overrides are merged into the series options for the link
     * pass only, rather than into each link's own options, so a per-point
     * `dataLabels` still wins over them.
     * @internal
     */
    public drawDataLabels(): void {
        const options = this.options,
            dlOptions = options.dataLabels,
            linkDlOptions = options.link?.dataLabels;

        // Node labels, with the series options as they stand.
        Series.prototype.drawDataLabels.call(this, this.nodes);

        // Link labels. `linkTextPath` is handed to `textPath` the same way
        // the networkgraph series does it, so a label can follow its link.
        if (
            !isArray(dlOptions) &&
            (linkDlOptions || dlOptions?.linkTextPath)
        ) {
            options.dataLabels = merge(
                dlOptions,
                dlOptions?.linkTextPath ?
                    { textPath: dlOptions.linkTextPath } :
                    void 0,
                linkDlOptions
            );
        }

        Series.prototype.drawDataLabels.call(this, this.data);

        options.dataLabels = dlOptions;
    }

    /**
     * Run the whole layout once and assign final positions directly - there
     * is no force simulation to defer to.
     * @internal
     */
    public translate(): void {
        this.generatePoints();

        const chart = this.chart,
            solved = FlowchartLayout.solve(
                this.points.map((point): {from: string; to: string} => ({
                    from: point.from || '',
                    to: point.to || ''
                }))
            );

        // Sizing a node depends only on its label, not on where it ends up,
        // so it is resolved first - the pixel mapping below needs to know how
        // much room the outermost shapes take.
        let halfWidth = 0,
            halfHeight = 0;

        for (const node of this.nodes) {
            const shape = this.nodeShape(node),
                text = this.measureLabel(
                    node.name, this.nodeLabelStyle(node)
                ),
                box = shapeSize(shape, text.width, text.height),
                symbol = symbolByShape[shape];

            node.shape = shape;
            node.shapeWidth = box.width;
            node.shapeHeight = box.height;
            node.marker = merge(node.marker, { symbol });

            halfWidth = Math.max(halfWidth, box.width / 2);
            halfHeight = Math.max(halfHeight, box.height / 2);

            // A shape change has to replace the element, not just resize it -
            // an already rendered marker keeps the symbol it was created
            // with.
            if (node.graphic && node.graphic.symbolName !== symbol) {
                node.graphic = node.graphic.destroy();
            }
        }

        // The solver's positions are node *centers* spanning 0-1 with no
        // margin of their own, so they are inset here by half of the largest
        // node - enough for every node, since none is bigger than that - so
        // that no shape hangs over the edge of the plot area. A graph too big
        // to inset at all is spread over the full plot instead of being
        // squeezed into nothing.
        const inset = (
            available: number,
            half: number
        ): [number, number] => (
            available - 2 * half > 0 ?
                [half, available - 2 * half] :
                [0, available]
        );
        const [left, width] = inset(chart.plotWidth, halfWidth),
            [top, height] = inset(chart.plotHeight, halfHeight),
            toPixels = (pos: FlowchartLayoutPosition): PositionObject => ({
                x: left + pos.x * width,
                y: top + pos.y * height
            }),
            // Pixel position per id, waypoints included, so a link's route
            // and its end nodes can't disagree about where a node is.
            pixels: Record<string, PositionObject> = {};

        for (const id of Object.keys(solved.positions)) {
            pixels[id] = toPixels(solved.positions[id]);
        }

        // Honour manual drags: a node the user has moved carries a `dragPos`,
        // a fraction of the plot area so the drag survives a resize.
        // Overriding the position here - before nodes are placed *and* before
        // link waypoints are read from it below - makes both the node and
        // every link endpoint follow the drag, while the rest of the diagram
        // keeps the layout the solver computed.
        for (const node of this.nodes) {
            if (node.dragPos) {
                pixels[node.id] = {
                    x: node.dragPos.x * chart.plotWidth,
                    y: node.dragPos.y * chart.plotHeight
                };
            }
        }

        // The same, for dragged waypoints, which bends the affected link
        // through the moved position. Only ids this solve produced are
        // honoured; an old id from a previous data set is stale.
        const waypointDragPos = this.waypointDragPos;
        if (waypointDragPos) {
            for (const id of Object.keys(waypointDragPos)) {
                if (pixels[id]) {
                    pixels[id] = {
                        x: waypointDragPos[id].x * chart.plotWidth,
                        y: waypointDragPos[id].y * chart.plotHeight
                    };
                }
            }
        }

        const fallback = toPixels(unpositioned);

        for (const node of this.nodes) {
            const pixel = pixels[node.id] || fallback;

            node.plotX = pixel.x;
            node.plotY = pixel.y;
            node.isInside = true;
        }

        this.points.forEach((point, i): void => {
            const route = solved.routes[i];

            point.reversed = route.reversed;
            point.waypoints = route.waypointIds.map(
                (id): PositionObject => pixels[id] || fallback
            );
            // Keep the id chain alongside the pixel waypoints, so a waypoint
            // drag handle can map an interior waypoint back to the id it
            // overrides.
            point.waypointIds = route.waypointIds;
            point.shapeType = 'path';

            // Pass the test in `drawPoints`.
            point.y = 1;

            point.setLabelAnchor();
        });
    }

    /**
     * Nodes get the box computed for their shape and label in `translate()`,
     * instead of the networkgraph behaviour of a single `radius` producing a
     * fixed-size square.
     * @internal
     */
    public markerAttribs(
        point: FlowchartPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        if (!point.isNode || !point.shapeWidth || !point.shapeHeight) {
            return super.markerAttribs(point, state);
        }

        return {
            x: (point.plotX || 0) - point.shapeWidth / 2,
            y: (point.plotY || 0) - point.shapeHeight / 2,
            width: point.shapeWidth,
            height: point.shapeHeight
        };
    }

    /**
     * The networkgraph `setState` only re-renders once its force simulation
     * has settled. A flowchart has no simulation, so the layout is always
     * settled.
     * @internal
     */
    public setState(
        state?: StatesOptionsKey,
        inherit?: boolean
    ): void {
        if (inherit) {
            this.points = this.nodes.concat(this.data);
            Series.prototype.setState.apply(this, arguments as any);
            this.points = this.data;
        } else {
            Series.prototype.setState.apply(this, arguments as any);
        }

        if (!state) {
            this.render();
        }
    }

    /**
     * Render nodes and links as usual, then (re)draw the waypoint markers.
     * @internal
     */
    public render(): void {
        super.render();
        this.renderWaypoints();
    }

    /**
     * Drag a node. Replaces the networkgraph handler, whose final step nudges
     * a force simulation this series doesn't run. It moves the node to the
     * cursor (once past a small threshold, so a plain click still reads as a
     * click), records the position as a fraction for `translate()` to
     * preserve, and redraws just the node and its links rather than
     * re-solving the whole layout every frame.
     * @internal
     */
    public onMouseMove(
        point: FlowchartPoint,
        event: PointerEvent
    ): void {
        if (!point.fixedPosition || !point.inDragMode) {
            return;
        }

        const chart = this.chart,
            normalized = chart.pointer?.normalize(event) || event,
            diffX = point.fixedPosition.chartX - normalized.chartX,
            diffY = point.fixedPosition.chartY - normalized.chartY;

        if (
            Math.abs(diffX) <= dragThreshold &&
            Math.abs(diffY) <= dragThreshold
        ) {
            return;
        }

        const plotX = point.fixedPosition.plotX - diffX,
            plotY = point.fixedPosition.plotY - diffY;

        if (!chart.isInsidePlot(plotX, plotY)) {
            return;
        }

        point.plotX = plotX;
        point.plotY = plotY;
        point.hasDragged = true;
        point.dragPos = {
            x: plotX / chart.plotWidth,
            y: plotY / chart.plotHeight
        };

        this.redrawDraggedNode(point);
    }

    /**
     * Finish a drag. Replaces the networkgraph handler's simulation restart
     * with a no-op, and - if the pointer actually moved - arms a one-shot
     * flag so the click the browser fires next doesn't also register on the
     * node.
     * @internal
     */
    public onMouseUp(point: FlowchartPoint): void {
        if (!point.fixedPosition) {
            return;
        }

        if (point.hasDragged) {
            point.suppressClick = true;
            // The click fires synchronously right after mouseup; clear the
            // flag on the next tick so a later genuine click works.
            setTimeout((): void => {
                point.suppressClick = false;
            }, 0);
        }

        point.inDragMode = point.hasDragged = false;
        delete point.fixedPosition;
    }

    /**
     * Move a dragged node's shape, its labels and its connected links to the
     * node's new position, without re-running the layout solver. The endpoint
     * waypoint that *is* this node moves with it; interior waypoints (a long
     * link's bends) stay where the solver put them.
     * @internal
     */
    public redrawDraggedNode(node: FlowchartPoint): void {
        if (node.graphic) {
            node.graphic.attr(this.markerAttribs(node));
        }

        const endpoint: PositionObject = {
            x: node.plotX || 0,
            y: node.plotY || 0
        };

        for (const link of node.linksFrom) {
            link.waypoints[0] = endpoint;
            link.redrawLink();
        }

        for (const link of node.linksTo) {
            link.waypoints[link.waypoints.length - 1] = endpoint;
            link.redrawLink();
        }

        // Re-align labels (the node's, plus any link labels whose anchor
        // moved) to the updated positions, and keep the hover halo on the
        // node under the cursor.
        this.drawDataLabels();
        this.redrawHalo(node);
    }

    /**
     * Draw a marker at every internal waypoint a link is routed through - the
     * positions that make a long link bend, but that are otherwise invisible
     * since they never become series points.
     *
     * Rebuilt on every render so it stays in sync with `translate()` and can
     * be toggled live through `series.update()`. Old markers are cleared by
     * querying the DOM rather than by destroying a tracked array kept on the
     * series: `series.update()` deletes the series' own properties and
     * re-runs `init()` on the same instance, which would silently drop such
     * an array without destroying what it pointed to, orphaning the markers.
     * `this.group` is one of the few things `update()` deliberately preserves
     * across that reinit, so reading them back from there is what actually
     * survives.
     * @internal
     */
    public renderWaypoints(): void {
        const group = this.group;

        if (!group) {
            return;
        }

        group.element
            .querySelectorAll('.' + waypointClassName)
            .forEach((element): void => element.remove());

        const waypointOptions = this.options.waypoints;

        if (!waypointOptions?.enabled) {
            return;
        }

        const { renderer, styledMode } = this.chart,
            radius = waypointOptions.radius || 0,
            color = waypointOptions.color ||
                this.options.link?.color;

        for (const link of this.points) {
            const waypoints = link.waypoints || [],
                ids = link.waypointIds || [];

            // Interior waypoints only - the endpoints are real nodes.
            for (let i = 1; i < waypoints.length - 1; i++) {
                const marker = renderer
                    .circle(waypoints[i].x, waypoints[i].y, radius)
                    .addClass(waypointClassName, true)
                    .add(group);

                if (!styledMode) {
                    marker.attr({ fill: color, 'stroke-width': 0 });
                }

                if (ids[i] && this.options.draggable) {
                    marker.css({ cursor: 'move' });
                    this.bindWaypointDrag(marker, link, i, ids[i]);
                }
            }
        }
    }

    /**
     * Make a waypoint marker draggable. Unlike node dragging - which rides
     * the chart-level mousedown handler that only fires for real points - a
     * waypoint isn't a point, so its drag is wired straight onto the marker
     * element. Moving it bends just the one link the waypoint belongs to; the
     * position is stored, fractional, in `waypointDragPos` so `translate()`
     * keeps the bend on later redraws.
     * @internal
     */
    public bindWaypointDrag(
        marker: SVGElement,
        link: FlowchartPoint,
        index: number,
        id: string
    ): void {
        const series = this,
            chart = this.chart,
            doc = chart.container.ownerDocument;

        marker.on('mousedown', (downEvent: PointerEvent): void => {
            // Don't let the chart-level handler start a node drag.
            downEvent.stopPropagation?.();
            downEvent.preventDefault?.();

            const startEvent = chart.pointer?.normalize(downEvent) ||
                    downEvent,
                start = {
                    chartX: startEvent.chartX,
                    chartY: startEvent.chartY,
                    x: link.waypoints[index].x,
                    y: link.waypoints[index].y
                };

            const onMove = (moveEvent: PointerEvent): void => {
                const e = chart.pointer?.normalize(moveEvent) || moveEvent,
                    x = start.x + (e.chartX - start.chartX),
                    y = start.y + (e.chartY - start.chartY);

                if (!chart.isInsidePlot(x, y)) {
                    return;
                }

                link.waypoints[index] = { x, y };
                (series.waypointDragPos ||= {})[id] = {
                    x: x / chart.plotWidth,
                    y: y / chart.plotHeight
                };
                marker.attr({ x, y });
                link.redrawLink();
            };

            const unbindMove = addEvent(doc, 'mousemove', onMove),
                unbindUp = addEvent(doc, 'mouseup', (): void => {
                    unbindMove();
                    unbindUp();
                });
        });
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface FlowchartSeries {
    pointClass: typeof FlowchartPoint;
}
extend(FlowchartSeries.prototype, {
    pointArrayMap: ['from', 'to', 'text'],
    pointClass: FlowchartPoint
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        flowchart: typeof FlowchartSeries;
    }
}
SeriesRegistry.registerSeriesType('flowchart', FlowchartSeries);

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartSeries;
