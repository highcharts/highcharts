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

import type {
    FlowchartDataOptions,
    FlowchartPointOptions
} from './FlowchartPointOptions';
import type { FlowchartNodeShape } from './FlowchartSymbols';
import type FlowchartSeries from './FlowchartSeries';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import FlowchartSymbols from './FlowchartSymbols.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: Point
        }
    },
    seriesTypes: {
        networkgraph: {
            prototype: {
                pointClass: NetworkgraphPoint
            }
        }
    }
} = SeriesRegistry;

const { shapeBoundaryDistance } = FlowchartSymbols;

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns a smooth SVG path (`M`, quadratic `Q` and a final `L`) that starts
 * and ends exactly on the first/last point in `points`, but only loosely
 * follows any points in between.
 *
 * Interpolating every point (with a Catmull-Rom spline, say) forces the curve
 * to pass exactly through each waypoint, which still produces visible zigzags
 * whenever three consecutive waypoints aren't already close to collinear,
 * since the curve has no freedom to round that corner off - it has to visit
 * it exactly.
 *
 * Instead, each interior waypoint is used as the *control* point of a
 * quadratic Bezier ending at the midpoint between it and the next waypoint, a
 * standard technique for smoothing a polyline into a curve that only needs to
 * hit its true endpoints: consecutive segments share their tangent direction
 * at every midpoint join (the curve is smooth, not just visually close),
 * while a sharp zigzag between waypoints gets rounded off instead of
 * reproduced. The final short stretch back to the real end point is a
 * straight line, but one that continues the same tangent the curve already
 * had, so it reads as part of the same smooth stroke rather than a kink.
 *
 * @internal
 */
function smoothLinkPath(points: Array<PositionObject>): SVGPath {
    if (points.length < 3) {
        return points.map((p, i): SVGPath.Segment => (
            i === 0 ? ['M', p.x, p.y] : ['L', p.x, p.y]
        ));
    }

    const path: SVGPath = [['M', points[0].x, points[0].y]];

    for (let i = 1; i < points.length - 1; i++) {
        const control = points[i],
            next = points[i + 1];

        path.push([
            'Q',
            control.x, control.y,
            (control.x + next.x) / 2, (control.y + next.y) / 2
        ]);
    }

    const last = points[points.length - 1];
    path.push(['L', last.x, last.y]);

    return path;
}

/**
 * A link's data label anchor: the midpoint of the *rendered curve's* middle
 * segment - not one of the raw waypoints it was built from, which for a link
 * with an odd number of waypoints is the actual waypoint the layout routed it
 * through (visibly wrong: the label would sit right on top of a node-sized
 * gap where nothing is drawn). Each segment's endpoint is always its last two
 * entries, whether it's a straight `L` (`[cmd, x, y]`) or a curved `Q`/`C`.
 *
 * @internal
 */
function pathMidpoint(path: SVGPath): PositionObject {
    const end = (segment: SVGPath.Segment): PositionObject => ({
            x: segment[segment.length - 2] as number,
            y: segment[segment.length - 1] as number
        }),
        mid = Math.max(0, Math.floor((path.length - 2) / 2)),
        p0 = end(path[mid]),
        p1 = end(path[mid + 1] || path[mid]);

    return { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
}

/* *
 *
 *  Class
 *
 * */

/**
 * @internal
 * @class
 * @name Highcharts.seriesTypes.flowchart.prototype.pointClass
 *
 * @augments Highcharts.seriesTypes.networkgraph.prototype.pointClass
 */
class FlowchartPoint extends NetworkgraphPoint {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The arrowhead drawn at a link's `to` end. Links only.
     * @internal
     */
    public arrowGraphic?: SVGElement;

    /**
     * Fractional position a node was dragged to, so the drag survives a
     * resize. Nodes only.
     * @internal
     */
    public dragPos?: PositionObject;

    /**
     * Whether the pointer has moved far enough for the current press to count
     * as a drag. Nodes only.
     * @internal
     */
    public hasDragged?: boolean;

    /**
     * Whether this node is currently being dragged. Nodes only.
     * @internal
     */
    public inDragMode?: boolean;

    /**
     * A point is either a node or a link, so its options are one or the
     * other.
     */
    public options!: (FlowchartPointOptions&FlowchartDataOptions);

    /**
     * Whether the layout had to reverse this link to break a cycle. Links
     * only.
     * @internal
     */
    public reversed?: boolean;

    public series!: FlowchartSeries;

    /**
     * The resolved shape, and the box it needs, as computed in
     * `series.translate()`. Nodes only.
     * @internal
     */
    public shape?: FlowchartNodeShape;

    /** @internal */
    public shapeHeight?: number;

    /** @internal */
    public shapeWidth?: number;

    /**
     * One-shot guard set when a drag ends, so the click the browser fires
     * right after does not also register as a click on the node.
     * @internal
     */
    public suppressClick?: boolean;

    /**
     * The link's label, from `[from, to, text]` data or a `text` option.
     * Links only.
     * @internal
     */
    public text?: string;

    /**
     * Pixel positions the link is routed through, from its `from` node to its
     * `to` node. Links only.
     * @internal
     */
    public waypoints!: Array<PositionObject>;

    /**
     * The layout's ids for the same chain, so a waypoint marker can map an
     * interior waypoint back to the id it overrides. Links only.
     * @internal
     */
    public waypointIds!: Array<string>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Move `from` toward `to` by the node's own boundary distance along that
     * direction, so a link ends on the node's outline rather than at its
     * center. Direction only, not which end it is at, since
     * `shapeBoundaryDistance` uses absolute values and so doesn't care which
     * way it points.
     * @internal
     */
    private pullBack(
        from: PositionObject,
        to: PositionObject,
        node?: FlowchartPoint
    ): PositionObject {
        if (!node || !node.shape) {
            return from;
        }

        let dx = to.x - from.x,
            dy = to.y - from.y;

        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        dx /= len;
        dy /= len;

        const dist = shapeBoundaryDistance(
            node.shape,
            (node.shapeWidth || 0) / 2,
            (node.shapeHeight || 0) / 2,
            dx,
            dy
        );

        return { x: from.x + dx * dist, y: from.y + dy * dist };
    }

    /**
     * Presentational attributes of the link's line.
     *
     * A reversed link - a "back" edge the layout flipped in order to lay the
     * graph out as a directed acyclic graph, and that therefore renders
     * against the general top-to-bottom flow - picks up
     * [link.reversed](#plotOptions.flowchart.link.reversed) on top of the
     * regular link style. The link's own `color`/`dashStyle` still win, so
     * data can override the cue.
     * @internal
     */
    public getLinkAttributes(): SVGAttributes {
        const attribs = super.getLinkAttributes(),
            reversedOptions = this.series.options.link?.reversed;

        if (this.reversed && reversedOptions) {
            attribs.stroke = this.options.color ||
                reversedOptions.color ||
                attribs.stroke;
            attribs.dashstyle = this.options.dashStyle ||
                reversedOptions.dashStyle ||
                attribs.dashstyle;
        }

        // Every link needs some concrete dash style, not just the reversed
        // ones: a hover's hand-off from the active to the inactive state
        // animates every changed link attribute together, `dashstyle`
        // included, and unlike the numeric ones that setter has no defined
        // value to animate *from*, which throws (`value.toLowerCase` on an
        // in-between numeric tween value) partway through.
        attribs.dashstyle ||= 'Solid';

        return attribs;
    }

    /**
     * A smooth curve through the waypoints computed in `series.translate()`,
     * instead of a straight line between the two nodes. Interior waypoints
     * (from routing a link around the layers it spans) are only followed
     * loosely, so the curve can round off a zigzag instead of having to visit
     * every bend exactly.
     *
     * Both ends are pulled back from the node's center to its actual shape
     * boundary - the same math `getArrowPath()` uses for the arrow tip.
     * Without this, the line's endpoint sits at the center, so it visibly
     * runs *underneath* the node shape; normally hidden since the node is
     * drawn on top and fully opaque, it shows through the moment that opacity
     * drops - for example when every other node dims via the `inactive` state
     * while one of them is hovered.
     * @internal
     */
    public getLinkPath(): SVGPath {
        const wp = this.waypoints;

        if (!wp || wp.length < 2) {
            return [];
        }

        const trimmed = wp.slice();

        trimmed[0] = this.pullBack(wp[0], wp[1], this.fromNode);
        trimmed[trimmed.length - 1] = this.pullBack(
            wp[wp.length - 1], wp[wp.length - 2], this.toNode
        );

        return smoothLinkPath(trimmed);
    }

    /**
     * A closed triangle path pointing along the final waypoint segment, its
     * tip pulled back to the `toNode`'s outline rather than its center.
     * `smoothLinkPath`'s final segment is a straight line built to continue
     * the curve's existing tangent there, which is parallel to this same raw
     * segment - so this direction is correct for the curved path too, without
     * needing calculus.
     * @internal
     */
    public getArrowPath(): SVGPath {
        const wp = this.waypoints;

        if (!wp || wp.length < 2) {
            return [];
        }

        const { arrowLength = 0, arrowWidth = 0 } =
                this.series.options.link || {},
            tip = wp[wp.length - 1],
            prev = wp[wp.length - 2],
            node = this.toNode;

        let dx = tip.x - prev.x,
            dy = tip.y - prev.y;

        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        dx /= len;
        dy /= len;

        const pullBack = node && node.shape ?
                shapeBoundaryDistance(
                    node.shape,
                    (node.shapeWidth || 0) / 2,
                    (node.shapeHeight || 0) / 2,
                    dx,
                    dy
                ) :
                0,
            tipX = tip.x - dx * pullBack,
            tipY = tip.y - dy * pullBack,
            baseX = tipX - dx * arrowLength,
            baseY = tipY - dy * arrowLength,
            halfWidth = arrowWidth / 2;

        return [
            ['M', tipX, tipY],
            ['L', baseX - dy * halfWidth, baseY + dx * halfWidth],
            ['L', baseX + dy * halfWidth, baseY - dx * halfWidth],
            ['Z']
        ];
    }

    /**
     * Render the link's line, plus the arrowhead the networkgraph point has
     * no notion of.
     * @internal
     */
    public renderLink(): void {
        super.renderLink();

        const graphic = this.graphic;

        if (!graphic) {
            return;
        }

        if (!this.arrowGraphic) {
            this.arrowGraphic = this.series.chart.renderer
                .path()
                .addClass('highcharts-flowchart-arrow', true)
                .add(this.series.group);
        }

        // The line's opacity can change through more paths than just this
        // point's own code - the networkgraph hover handling
        // (`NodesComposition.setNodeState`) calls `Point.setState` directly on
        // a hovered node's connected links, bypassing any `setState` override
        // on this point entirely, and it decides per link whether to actually
        // change the opacity (a connected link stays at full opacity despite
        // the wider `inactive` state other links get) - a decision this class
        // has no independent way to reproduce correctly.
        //
        // Rather than re-deriving that decision (or its timing), wrap the line
        // graphic's own `attr`/`animate` once so *every* opacity change made
        // to the line - by anyone, however it gets there - is mirrored onto
        // the arrowhead through that exact same call: same target value, same
        // animation options (duration, easing), so the two always move
        // together instead of one guessing at or lagging behind the other.
        //
        // The flag lives on the graphic rather than on the point, so a
        // re-created line element gets wrapped again.
        if (!(graphic as AnyRecord).flowchartMirrorsOpacity) {
            (graphic as AnyRecord).flowchartMirrorsOpacity = true;

            (['attr', 'animate'] as const).forEach((method): void => {
                const original = (graphic as AnyRecord)[method]
                    .bind(graphic) as Function;

                (graphic as AnyRecord)[method] = (
                    params?: (string|SVGAttributes),
                    ...rest: Array<unknown>
                ): unknown => {
                    if (
                        this.arrowGraphic &&
                        params &&
                        typeof params === 'object' &&
                        'opacity' in params
                    ) {
                        (this.arrowGraphic as AnyRecord)[method](
                            { opacity: params.opacity },
                            ...rest
                        );
                    }
                    return original(params, ...rest);
                };
            });
        }
    }

    /**
     * Reposition the line, the arrowhead and the data label anchor. Not
     * inherited from the networkgraph point, which assumes an exact two-point
     * path when computing the label midpoint.
     * @internal
     */
    public redrawLink(): void {
        if (!this.graphic) {
            return;
        }

        const path = this.getLinkPath();
        this.shapeArgs = { d: path };

        let attribs: SVGAttributes|undefined;

        if (!this.series.chart.styledMode) {
            attribs = this.series.pointAttribs(this);
            this.graphic.attr(attribs);

            (this.dataLabels || []).forEach((label): void => {
                if (label) {
                    label.attr({ opacity: attribs?.opacity });
                }
            });
        }

        // Straight `attr` rather than `animate`: a bent path is rebuilt on
        // every drag frame, and there is no simulation stepping toward it.
        this.graphic.attr(this.shapeArgs);

        if (this.arrowGraphic) {
            // Opacity isn't set here - the wrapped `graphic.attr` installed
            // in `renderLink()` already mirrored it onto `arrowGraphic` from
            // the `graphic.attr(attribs)` call above, which carries the same
            // opacity.
            this.arrowGraphic.attr({
                d: this.getArrowPath(),
                fill: attribs?.stroke || 'inherit'
            });
        }

        this.setLabelAnchor(path);
    }

    /**
     * Anchor the link's data label to the middle of its rendered curve.
     *
     * `redrawLink()` recomputes this once the link is actually rendered, but
     * data labels can be drawn and aligned before that first happens - and
     * merely updating `plotX`/`plotY` later doesn't move an already-rendered
     * label. So `series.translate()` calls this too, to have a correct
     * position in place from the start; without one, the label gets stuck
     * where it was first placed until some unrelated redraw (a hover, say)
     * forces a fresh alignment.
     * @internal
     */
    public setLabelAnchor(path?: SVGPath): void {
        const d = path || this.getLinkPath();

        if (d.length > 1) {
            const mid = pathMidpoint(d);
            this.plotX = mid.x;
            this.plotY = mid.y;
        }
    }

    /**
     * Mirrors the networkgraph point's cleanup, minus its `series.layout`
     * bookkeeping - a flowchart never registers with a graph layout.
     * @internal
     */
    public destroy(): void {
        if (this.arrowGraphic) {
            this.arrowGraphic = this.arrowGraphic.destroy();
        }

        if (this.isNode) {
            this.linksFrom.concat(this.linksTo).forEach((link): void => {
                if (link.destroyElements) {
                    link.destroyElements();
                }
            });
        }

        return Point.prototype.destroy.apply(this, arguments as any);
    }

    /**
     * Styling hook for reversed links, so styled mode can tell a back edge
     * apart without relying on the presentational defaults.
     * @internal
     */
    public getClassName(): string {
        return super.getClassName() +
            (this.reversed ? ' highcharts-link-reversed' : '');
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface FlowchartPoint {
    fromNode: FlowchartPoint;
    linksFrom: Array<FlowchartPoint>;
    linksTo: Array<FlowchartPoint>;
    toNode: FlowchartPoint;
}

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartPoint;
