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
    FlowchartLayoutEdge,
    FlowchartLayoutGeometry,
    FlowchartLayoutSize,
    FlowchartLayoutSpacing,
    FlowchartLayoutTopology
} from './FlowchartLayout';
import type PointerEvent from '../../Core/PointerEvent';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type {
    NetworkgraphDataLabelsOptions
} from '../Networkgraph/NetworkgraphSeriesOptions';
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
    minLabelWidth,
    shapeSize,
    symbolByShape
} = FlowchartSymbols;

/* *
 *
 *  Declarations
 *
 * */

/**
 * The room the diagram needs, in layout units, including anything dragged out
 * beyond what the layout placed. The corner comes with it because a manual
 * placement can reach left of or above the layout's own origin.
 * @internal
 */
interface FlowchartContentExtent {
    height: number;
    minX: number;
    minY: number;
    width: number;
}

/**
 * A candidate placement: the layout, the room it needs and how much it has to
 * shrink to get that room.
 * @internal
 */
interface FlowchartFit {
    extent: FlowchartContentExtent;
    geometry: FlowchartLayoutGeometry;
    scale: number;
}

/**
 * A candidate placement together with the node boxes it was measured from, and
 * the label width cap that produced them.
 * @internal
 */
interface FlowchartContentFit extends FlowchartFit {
    labelWidth?: number;
    sizes: Record<string, FlowchartLayoutSize>;
}

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
 * A waypoint is a bend in a line rather than a box, so it contributes no size
 * of its own to the diagram's extent.
 * @internal
 */
const waypointExtent: FlowchartLayoutSize = { width: 0, height: 0 };

/**
 * How far the pointer has to travel before a press counts as a drag rather
 * than a click, in pixels.
 * @internal
 */
const dragThreshold = 5;

/**
 * Horizontal gap between two neighbouring nodes in the same layer, in pixels:
 * the one a diagram with room to spare gets, and the one it tightens to when
 * the plot area runs short. Held on top of each node's own width, so it is the
 * gap that is constant rather than the distance between centers.
 *
 * The minimum is deliberately not 0 - nodes that tighten until they touch read
 * as one shape rather than as a sequence of steps.
 * @internal
 */
const nodeSpacing = { max: 20, min: 4 };

/**
 * The same for the vertical gap between two layers, measured between the
 * tallest node above and the tallest below rather than between their centers.
 * @internal
 */
const layerSpacing = { max: 20, min: 4 };

/**
 * A floor on the shrink factor, low enough never to be reached in practice.
 * It only exists so a plot area of a handful of pixels cannot produce nodes of
 * zero or negative size.
 * @internal
 */
const minLayoutScale = 0.05;

/**
 * Bisection steps used to find the spacing that fills an axis without
 * overflowing it. Seven narrows the searched range - roughly 4 to 75px - to
 * about half a pixel, which is finer than the eye can follow while a chart is
 * being resized.
 * @internal
 */
const fitProbes = 7;

/**
 * How far a gap may grow past `nodeSpacing.max` and `layerSpacing.max` to fill
 * a plot area with room to spare, as a multiple of the node height.
 *
 * A ceiling is needed at all because filling a very roomy plot area with
 * nothing but gap strings small boxes out along very long links; at this
 * multiple the diagram opens up but still reads as a connected flow. Expressed
 * relative to the nodes rather than as a pixel count so it means the same thing
 * whatever size the labels come out at.
 * @internal
 */
const spacingFill = 1.5;

/**
 * Label width caps to try when the diagram is short of width, as a fraction of
 * the widest label's natural width. Two candidates: 0.7 takes most labels onto
 * a second line, 0.5 onto a third, and past that the longest single word is
 * usually what sets the width instead - see `fitContent()`.
 * @internal
 */
const labelWidthRatios = [0.7, 0.5];

/* *
 *
 *  Functions
 *
 * */

/**
 * The middle node height, the unit the spacing ceiling is expressed in.
 *
 * Median rather than mean so that one unusually tall node - a diamond drawn
 * around a long label is twice the height of the text - cannot raise the
 * ceiling for a diagram of otherwise ordinary boxes.
 * @internal
 */
function medianHeight(sizes: Record<string, FlowchartLayoutSize>): number {
    const heights = Object.keys(sizes)
        .map((id): number => sizes[id].height)
        .sort((a, b): number => a - b);

    return heights[Math.floor(heights.length / 2)] || 0;
}

/**
 * The networkgraph defaults, minus `layoutAlgorithm` - it configures the force
 * simulation this series never runs (see `deferLayout` below), so keeping it
 * out of `getOptions().plotOptions.flowchart` stops it being offered as the
 * handle for influencing a layout it cannot influence.
 *
 * Note this cannot be a `delete` on `NetworkgraphSeries.defaultOptions`
 * itself: `merge` with a single argument returns a deep copy, and it is the
 * copy that is mutated, so the networkgraph series keeps its own defaults
 * intact.
 * @internal
 */
const inheritedDefaults = merge(NetworkgraphSeries.defaultOptions);

delete inheritedDefaults.layoutAlgorithm;

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
        inheritedDefaults,
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
     * How much the laid out diagram had to be shrunk to fit the plot area, 1
     * when it fitted as measured. Node boxes are already scaled by it; label
     * text and arrowheads read it so they shrink in step.
     * @internal
     */
    public layoutScale: number = 1;

    /**
     * The width node labels were wrapped to in order to fit the diagram into a
     * plot area short of width, in pixels at full size, or undefined when the
     * labels were left at their natural width. See `fitContent()`.
     * @internal
     */
    public labelWidth?: number;

    /**
     * Where the laid out diagram's own top left corner sits in the plot area.
     *
     * Together with `layoutScale` this is the mapping every node position goes
     * through, and the one a manual drag has to be recorded against - see
     * `toLayoutPosition()`.
     * @internal
     */
    public layoutOrigin: PositionObject = { x: 0, y: 0 };

    /**
     * Resolved label font sizes in pixels, keyed by style, so scaling text does
     * not mean a DOM round-trip per redraw. Separate from `labelSizeCache`
     * because a font size is asked for per data label pass, not per node.
     * @internal
     */
    public fontSizeCache?: Record<string, number>;

    /**
     * The layered graph, alongside the links it was built from, so a resize
     * can reuse it instead of re-running crossing reduction. See
     * `getTopology()`.
     * @internal
     */
    public topologyCache?: {
        key: string;
        topology: FlowchartLayoutTopology;
    };

    /**
     * The layout-frame position of everything the layout placed, before any
     * manual nudge is added - the base a drag is measured against, and the
     * reason a nudge survives the layout re-flowing.
     * @internal
     */
    public layoutPositions: Record<string, PositionObject> = {};

    /**
     * How far the user dragged each internal waypoint from where the layout put
     * it, in the layout's own units, keyed by the layout's stable,
     * deterministic waypoint id. A displacement for the same reason
     * `FlowchartPoint.dragOffset` is; waypoints aren't points, so these can't
     * live on one.
     * @internal
     */
    public waypointDragOffset?: Record<string, PositionObject>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * A flowchart computes its own positions in `translate()`, so there is no
     * graph layout to defer to and no `layoutAlgorithm` to read.
     *
     * Overridden as a no-op rather than left merely unreachable: the
     * networkgraph implementation reads `layoutAlgorithm.type` without a guard,
     * and `layoutAlgorithm` is deliberately absent from this series' defaults,
     * so an unguarded call would throw. Replacing it means a future
     * `super.translate()` cannot quietly reintroduce a simulation either.
     * @internal
     */
    public deferLayout(): void {
        // Intentionally empty.
    }

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
     * Convert a plot-area pixel position into the frame the layout works in -
     * pixels relative to the diagram's own top left corner, before it is
     * scaled and centered.
     *
     * Manual positions have to be stored in that frame rather than as a
     * fraction of the plot area. The plot area stretches per axis, while the
     * diagram is scaled by a single factor - chosen by whichever axis binds -
     * and then re-centered. Recorded as a plot fraction, a dragged node
     * therefore answers a resize by a different rule than every node around
     * it: it cannot move on the axis that did not change, and it moves the
     * wrong distance on the one that did. In this frame it goes through the
     * identical mapping, so it holds its place in the diagram.
     * @internal
     */
    private toLayoutPosition(position: PositionObject): PositionObject {
        const origin = this.layoutOrigin,
            scale = this.layoutScale;

        return {
            x: (position.x - origin.x) / scale,
            y: (position.y - origin.y) / scale
        };
    }

    /**
     * Where the layout currently puts something, in its own frame - the base a
     * manual nudge is measured from and added back to.
     *
     * An unlinked node never enters the layout and so has no position of its
     * own; it takes the middle of the plot area, expressed in the same frame so
     * a nudge applies to it the same way.
     * @internal
     */
    private layoutBase(id: string): PositionObject {
        return this.layoutPositions[id] || this.toLayoutPosition({
            x: this.chart.plotWidth / 2,
            y: this.chart.plotHeight / 2
        });
    }

    /**
     * A layout position with a manual displacement added.
     * @internal
     */
    private nudge(
        base: PositionObject,
        offset: PositionObject
    ): PositionObject {
        return { x: base.x + offset.x, y: base.y + offset.y };
    }

    /**
     * A style's font size in pixels, whatever unit it was written in.
     *
     * Resolved off a throwaway element rather than parsed out of the option, so
     * `em` and `rem` come back as the pixel size they actually render at - a
     * scaled label has to be expressed absolutely, and `parseInt('0.7em')` is
     * zero.
     * @internal
     */
    private fontSize(style?: CSSObject): number {
        const cache = this.fontSizeCache ||= {},
            cacheKey = JSON.stringify(style || {});

        if (!cache[cacheKey]) {
            const renderer = this.chart.renderer,
                element = renderer.text('').add();

            if (style) {
                element.css(style);
            }

            cache[cacheKey] = renderer.fontMetrics(element).f;
            element.destroy();
        }

        return cache[cacheKey];
    }

    /**
     * Data label options adjusted to match the diagram as it was actually
     * fitted - the font size scaled if it had to shrink, and the width cap that
     * makes the text wrap into the box it was measured for - or the options
     * unchanged when neither applies.
     *
     * The cap takes the shrink factor as well. It was chosen against text at
     * full size, so scaling text and cap by the same factor reproduces exactly
     * the line breaks the node boxes were sized around; a full-size cap on
     * shrunken text would re-wrap onto fewer lines and leave the boxes too tall
     * for what they hold.
     * @internal
     */
    private scaleLabels(
        dlOptions?: NetworkgraphDataLabelsOptions,
        labelWidth?: number
    ): (NetworkgraphDataLabelsOptions|undefined) {
        const scale = this.layoutScale;

        if (!dlOptions || (scale >= 1 && !labelWidth)) {
            return dlOptions;
        }

        const style: CSSObject = {};

        if (scale < 1) {
            style.fontSize =
                (this.fontSize(dlOptions.style) * scale).toFixed(2) + 'px';
        }

        if (labelWidth && !dlOptions.style?.width) {
            style.width = (labelWidth * scale).toFixed(2) + 'px';
        }

        return merge(dlOptions, { style });
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
     * style, with the node's own on top, and a width cap if one is being
     * measured against.
     *
     * A width the config sets itself is the author's own wrapping decision, so
     * the cap search leaves it alone rather than overriding it.
     * @internal
     */
    private nodeLabelStyle(
        node: FlowchartPoint,
        labelWidth?: number
    ): CSSObject {
        const style = merge(
            splat(this.options.dataLabels || {})[0].style,
            splat(node.options.dataLabels || {})[0].style
        );

        if (labelWidth && !style.width) {
            style.width = labelWidth + 'px';
        }

        return style;
    }

    /**
     * The box each node needs, keyed by id: its label measured at the given
     * width cap, grown to whatever its shape has to add around the text.
     *
     * A node's size depends only on its own label and shape, not on where it
     * ends up, so it is resolved before the layout runs - which is the point,
     * because the layout needs those sizes to keep two wide nodes in the same
     * layer from landing on top of each other.
     * @internal
     */
    private nodeBoxes(
        labelWidth?: number
    ): Record<string, FlowchartLayoutSize> {
        const sizes: Record<string, FlowchartLayoutSize> = {};

        for (const node of this.nodes) {
            const text = this.measureLabel(
                node.name,
                this.nodeLabelStyle(node, labelWidth)
            );

            sizes[node.id] = shapeSize(
                this.nodeShape(node), text.width, text.height
            );
        }

        return sizes;
    }

    /**
     * The widest a node label comes out at its natural size - the top of the
     * range a width cap is chosen from.
     * @internal
     */
    private widestLabel(): number {
        let widest = 0;

        for (const node of this.nodes) {
            widest = Math.max(
                widest,
                this.measureLabel(node.name, this.nodeLabelStyle(node)).width
            );
        }

        return widest;
    }

    /**
     * Node labels sit inside a shape while link labels sit on the background
     * between two nodes, so the two are drawn with different options. The
     * link-only overrides are merged into the series options for the link
     * pass only, rather than into each link's own options, so a per-point
     * `dataLabels` still wins over them.
     *
     * Both passes get their font size scaled when the diagram had to be shrunk
     * to fit, so text keeps its proportion to the shape holding it. Applied
     * here rather than by re-measuring at the smaller size, which would change
     * the node boxes and so the layout that produced the scale in the first
     * place.
     *
     * Only the node pass takes the label width cap. It was chosen to narrow the
     * node boxes, and a link label sits on the background between two nodes
     * rather than inside a box, so wrapping one buys nothing and would only
     * break short branch labels onto needless second lines.
     * @internal
     */
    public drawDataLabels(): void {
        const options = this.options,
            dlOptions = options.dataLabels,
            linkDlOptions = options.link?.dataLabels,
            scalable = !isArray(dlOptions);

        // Node labels, with the series options as they stand.
        if (scalable) {
            options.dataLabels = this.scaleLabels(dlOptions, this.labelWidth);
        }

        Series.prototype.drawDataLabels.call(this, this.nodes);

        // Link labels. `linkTextPath` is handed to `textPath` the same way
        // the networkgraph series does it, so a label can follow its link.
        if (scalable && (linkDlOptions || dlOptions?.linkTextPath)) {
            options.dataLabels = this.scaleLabels(merge(
                dlOptions,
                dlOptions?.linkTextPath ?
                    { textPath: dlOptions.linkTextPath } :
                    void 0,
                linkDlOptions
            ));
        }

        Series.prototype.drawDataLabels.call(this, this.data);

        options.dataLabels = dlOptions;
    }

    /**
     * The best placement available for these links, choosing how wide labels
     * may be as well as how the diagram is spaced and scaled.
     *
     * A plot area that is short of room is nearly always short of *width* - a
     * flowchart grows downwards, so narrowing a chart is what bites - and what
     * makes a flowchart wide is its labels: a node box is its text plus
     * padding, and several shapes add more width on top of that. Capping the
     * label width wraps the text onto another line, spending height the diagram
     * usually has going spare on width it has run out of. That buys a bigger
     * diagram than shrinking everything would: on a 560px-wide chart it removes
     * the need to shrink at all.
     *
     * The caps are tried in turn rather than searched, because the result is
     * not monotonic in the cap. Past a point, wrapping makes boxes tall enough
     * that the height becomes the binding axis and the fit gets worse again -
     * and for the shapes whose width is a function of their height, a taller
     * box is a wider one. So each candidate is measured and the best kept.
     * @internal
     */
    private fitContent(topology: FlowchartLayoutTopology): FlowchartContentFit {
        const chart = this.chart,
            // The tightest packing allowed. Nothing fits closer, so whether a
            // set of boxes can be drawn at full size is settled here - which
            // makes this the one solve a candidate has to be judged on, rather
            // than a whole spacing search.
            tightest = {
                nodeSpacing: nodeSpacing.min,
                layerSpacing: layerSpacing.min
            };

        const natural = this.nodeBoxes(),
            naturalExtent = this.solveFit(topology, natural, tightest).extent;

        let sizes = natural,
            scale = this.fitScale(naturalExtent),
            labelWidth: (number|undefined);

        if (
            // Something to buy: it does not fit at full size as measured.
            scale < 1 &&
            // Wrapping costs height, so it can only help a diagram that is
            // short of width. One held back by its height would just get
            // worse.
            naturalExtent.width / chart.plotWidth >=
                naturalExtent.height / chart.plotHeight &&
            // An array of data label configs is left unscaled (see
            // `drawDataLabels`), so a cap applied here would never reach the
            // rendered label, and the boxes would be sized for a wrap that
            // never happens.
            !isArray(this.options.dataLabels)
        ) {
            const widest = this.widestLabel();

            for (const ratio of labelWidthRatios) {
                // Rounded so the same cap comes back on every redraw, which
                // keeps the measurement cache working across resizes.
                const cap = Math.round(
                    Math.max(minLabelWidth, widest * ratio)
                );

                // A line cannot be broken inside a word, so once the cap has
                // reached the longest one, a tighter cap produces the same
                // boxes.
                if (cap >= widest) {
                    break;
                }

                const capped = this.nodeBoxes(cap),
                    cappedScale = this.fitScale(
                        this.solveFit(topology, capped, tightest).extent
                    );

                if (cappedScale > scale) {
                    labelWidth = cap;
                    scale = cappedScale;
                    sizes = capped;
                }

                // Full size reached; a narrower cap cannot do better.
                if (scale >= 1) {
                    break;
                }
            }
        }

        return {
            labelWidth,
            sizes,
            ...this.fitGeometry(topology, sizes, scale)
        };
    }

    /**
     * One geometry pass: the layout at a given spacing, and the room it takes
     * up once anything dragged out of place is counted in.
     * @internal
     */
    private solveFit(
        topology: FlowchartLayoutTopology,
        sizes: Record<string, FlowchartLayoutSize>,
        spacing: FlowchartLayoutSpacing
    ): FlowchartFit {
        const geometry = FlowchartLayout.solveGeometry(
            topology, sizes, spacing
        );

        return {
            extent: this.contentExtent(geometry, sizes),
            geometry,
            scale: 1
        };
    }

    /**
     * The largest scale a given extent fits the plot area at - never
     * magnifying, and never collapsing to nothing.
     * @internal
     */
    private fitScale(extent: FlowchartContentExtent): number {
        const { plotWidth, plotHeight } = this.chart;

        return Math.max(
            minLayoutScale,
            Math.min(
                1,
                plotWidth / extent.width,
                plotHeight / extent.height
            )
        );
    }

    /**
     * Space a set of node boxes out to fill the plot area, having settled how
     * much the diagram has to shrink to fit it at all.
     *
     * Finds the widest gap between neighbours that still fits, anywhere between
     * the minimum that keeps them reading as separate shapes and a ceiling tied
     * to the node height. A plot area with room to spare therefore opens the
     * diagram up to fill it, and one that is short closes it up - the same
     * search covers both.
     *
     * The two axes are resolved independently, off the same passes, because
     * each spacing only moves its own axis: `nodeSpacing` sets the within-layer
     * separation and so the width, `layerSpacing` the distance between rows and
     * so the height. A wide but short plot area therefore closes up between
     * layers while spreading out within them, rather than shrinking away from
     * the width it has.
     *
     * `reference` is the scale the tightest packing of these same boxes needs -
     * what `fitContent()` chose them on. Spacing is judged at that scale, since
     * that is the scale everything will be drawn at.
     * @internal
     */
    private fitGeometry(
        topology: FlowchartLayoutTopology,
        sizes: Record<string, FlowchartLayoutSize>,
        reference: number
    ): FlowchartFit {
        const { plotWidth, plotHeight } = this.chart,
            solve = (spacing: FlowchartLayoutSpacing): FlowchartFit =>
                this.solveFit(topology, sizes, spacing);

        // The tightest packing allowed - the known-good end of the search, and
        // where `reference` was measured.
        const low = {
            nodeSpacing: nodeSpacing.min,
            layerSpacing: layerSpacing.min
        };

        // The far end: as far as a gap may grow to fill an axis with room going
        // spare. The node *height* sets the ceiling on both axes - heights
        // barely vary between nodes, while widths swing with label length,
        // which would leave the horizontal ceiling at the mercy of whatever the
        // longest label happens to be.
        const ceiling = spacingFill * medianHeight(sizes),
            high = {
                nodeSpacing: Math.max(nodeSpacing.max, ceiling),
                layerSpacing: Math.max(layerSpacing.max, ceiling)
            };

        // Widest spacing per axis that still fits at that scale.
        //
        // Searched rather than interpolated: the room a graph needs is
        // monotonic in its spacing but not linear in it, because the coordinate
        // sweeps redistribute nodes within whatever room they are given. A
        // straight line between two measurements overshoots badly enough that
        // almost every estimate has to be thrown away, which collapses the
        // stage into an abrupt jump from one end of the range to the other.
        //
        // Each axis answers for itself, off the same passes: both are probed at
        // once and each verdict moves only its own bound.
        for (let probe = 0; probe < fitProbes; probe++) {
            const mid = {
                    nodeSpacing:
                        (low.nodeSpacing + high.nodeSpacing) / 2,
                    layerSpacing:
                        (low.layerSpacing + high.layerSpacing) / 2
                },
                { extent } = solve(mid);

            if (extent.width * reference <= plotWidth) {
                low.nodeSpacing = mid.nodeSpacing;
            } else {
                high.nodeSpacing = mid.nodeSpacing;
            }

            if (extent.height * reference <= plotHeight) {
                low.layerSpacing = mid.layerSpacing;
            } else {
                high.layerSpacing = mid.layerSpacing;
            }
        }

        // `low` fits on both axes by construction: it started at the tightest
        // packing, which is what `reference` was measured from, and only ever
        // moved to a spacing whose own axis was measured to fit at it.
        const fit = solve(low);

        // Read the shrink factor off what was actually produced rather than off
        // the tightest packing, since the gap handed back above grew the
        // extent. This can only be the larger of the two - every spacing `low`
        // took was measured to fit at `reference` - so it never reintroduces an
        // overflow, and it keeps labels as large as they can be.
        fit.scale = this.fitScale(fit.extent);

        return fit;
    }

    /**
     * How much room the diagram needs, in layout units, counting anything the
     * user has dragged as part of it.
     *
     * The layout only knows about the nodes it placed, so its own box stops at
     * the outermost of those. A node pulled off to one side sits outside that
     * box, and fitting the box alone would leave the node hanging over the edge
     * of the plot area - where it is clipped away, since the series is clipped
     * to the plot. Including manual placements makes the fit account for them,
     * so they scale into view along with everything else.
     *
     * The box can now start left of or above the origin, which is why this
     * reports a corner as well as a size.
     * @internal
     */
    private contentExtent(
        geometry: FlowchartLayoutGeometry,
        sizes: Record<string, FlowchartLayoutSize>
    ): FlowchartContentExtent {
        // The layout's own box runs from the origin to its intrinsic size: it
        // was shifted so the leftmost shape's own edge sits at 0.
        let minX = 0,
            minY = 0,
            maxX = geometry.intrinsic.width,
            maxY = geometry.intrinsic.height;

        const include = (
            position: PositionObject,
            size: FlowchartLayoutSize
        ): void => {
            minX = Math.min(minX, position.x - size.width / 2);
            minY = Math.min(minY, position.y - size.height / 2);
            maxX = Math.max(maxX, position.x + size.width / 2);
            maxY = Math.max(maxY, position.y + size.height / 2);
        };

        for (const node of this.nodes) {
            const base = geometry.positions[node.id];

            // A node the layout never placed - one with no links - is centered
            // in the plot area rather than positioned in this frame, so it has
            // no meaningful extent to contribute.
            if (node.dragOffset && base) {
                include(
                    this.nudge(base, node.dragOffset),
                    sizes[node.id] || waypointExtent
                );
            }
        }

        const waypointDragOffset = this.waypointDragOffset;

        if (waypointDragOffset) {
            for (const id of Object.keys(waypointDragOffset)) {
                const base = geometry.positions[id];

                if (base) {
                    // A waypoint is a bend in a line, so it takes no room of
                    // its own - but it still has to stay in view.
                    include(
                        this.nudge(base, waypointDragOffset[id]),
                        waypointExtent
                    );
                }
            }
        }

        return {
            height: maxY - minY,
            minX,
            minY,
            width: maxX - minX
        };
    }

    /**
     * The layered graph for the current links, from cache when the links have
     * not changed.
     *
     * Worth caching because it is the expensive half of the layout - crossing
     * reduction counts inversions between every adjacent layer pair on every
     * sweep - while depending on nothing but the links themselves. A resize
     * changes how much room there is, not what connects to what, so it only
     * needs `solveGeometry()` re-run.
     * @internal
     */
    private getTopology(): FlowchartLayoutTopology {
        const edges = this.points.map(
                (point): FlowchartLayoutEdge => ({
                    from: point.from || '',
                    to: point.to || ''
                })
            ),
            // A link's endpoints are ids, so this identifies the graph
            // exactly. `\u0000` cannot occur in an id that came from a data
            // row, so no two different edge lists can produce one key.
            key = edges
                .map((edge): string => edge.from + '\u0000' + edge.to)
                .join('');

        if (!this.topologyCache || this.topologyCache.key !== key) {
            this.topologyCache = {
                key,
                topology: FlowchartLayout.solveTopology(edges)
            };
        }

        return this.topologyCache.topology;
    }

    /**
     * Run the layout and assign final positions directly - there is no force
     * simulation to defer to.
     *
     * Order matters here: labels are measured, and node boxes sized from them,
     * *before* the geometry runs, because the layout needs those sizes to space
     * a layer by what its nodes actually occupy.
     * @internal
     */
    public translate(): void {
        this.generatePoints();

        const chart = this.chart;

        // A node's shape depends on nothing but its own options, so it is
        // settled first: measuring the label needs it, to know how much shape
        // has to fit around the text.
        for (const node of this.nodes) {
            const shape = this.nodeShape(node),
                symbol = symbolByShape[shape];

            node.shape = shape;
            node.marker = merge(node.marker, { symbol });

            // A shape change has to replace the element, not just resize it -
            // an already rendered marker keeps the symbol it was created
            // with.
            if (node.graphic && node.graphic.symbolName !== symbol) {
                node.graphic = node.graphic.destroy();
            }
        }

        const topology = this.getTopology(),
            { extent, geometry, labelWidth, scale, sizes } =
                this.fitContent(topology);

        // Everything the layout produced is at the measured label size; a
        // shrunken diagram is that same layout scaled about its own top left
        // corner. Boxes, gaps and label text all take the one factor, so their
        // proportions - and the padding each shape keeps around its label -
        // hold at any size.
        //
        // The width labels were wrapped to is kept for the same reason: the
        // boxes below were measured against it, so the rendered label has to be
        // held to it too.
        this.labelWidth = labelWidth;
        this.layoutScale = scale;

        for (const node of this.nodes) {
            const box = sizes[node.id];

            node.shapeWidth = box.width * scale;
            node.shapeHeight = box.height * scale;
        }

        const width = extent.width * scale,
            height = extent.height * scale,
            // Center the diagram in the plot area. The extent is already sized
            // to hold every shape - including any the user dragged clear of the
            // layout - so centering is all the placement needed, with no margin
            // to guess at.
            //
            // A diagram still too big for the plot area - one that has hit the
            // shrink floor - is anchored top left instead. The series is
            // clipped to the plot area, so centering would cut content off
            // *both* ends; anchoring keeps the start of the flow, and the
            // direction to read it in, visible.
            left = Math.max(0, (chart.plotWidth - width) / 2),
            top = Math.max(0, (chart.plotHeight - height) / 2),
            // Pixel position per id, waypoints included, so a link's route
            // and its end nodes can't disagree about where a node is.
            pixels: Record<string, PositionObject> = {};

        // The one mapping from the layout's frame into the plot area. Manual
        // positions go through it too, so they cannot drift from the diagram.
        //
        // The extent's own corner is folded into the origin rather than
        // applied per position, which keeps this a plain scale-and-offset -
        // and so keeps `toLayoutPosition()` its exact inverse.
        const originX = left - extent.minX * scale,
            originY = top - extent.minY * scale,
            place = (pos: PositionObject): PositionObject => ({
                x: originX + pos.x * scale,
                y: originY + pos.y * scale
            });

        this.layoutOrigin = { x: originX, y: originY };
        this.layoutPositions = geometry.positions;

        for (const id of Object.keys(geometry.positions)) {
            pixels[id] = place(geometry.positions[id]);
        }

        // Honour manual drags. A node the user has moved carries a `dragOffset`
        // - how far it was pulled from where the layout put it - which is added
        // to wherever the layout puts it *now*, so the nudge survives the gaps
        // closing up or the diagram shrinking. Applied here, before nodes are
        // placed *and* before link waypoints are read from `pixels` below, so
        // the node and every link endpoint follow the drag together.
        for (const node of this.nodes) {
            if (node.dragOffset) {
                pixels[node.id] = place(
                    this.nudge(this.layoutBase(node.id), node.dragOffset)
                );
            }
        }

        // The same, for dragged waypoints, which bends the affected link
        // through the moved position. Only ids this solve produced are
        // honoured; an old id from a previous data set is stale.
        const waypointDragOffset = this.waypointDragOffset;
        if (waypointDragOffset) {
            for (const id of Object.keys(waypointDragOffset)) {
                if (geometry.positions[id]) {
                    pixels[id] = place(this.nudge(
                        geometry.positions[id], waypointDragOffset[id]
                    ));
                }
            }
        }

        // A node the layout never saw - one with no links at all - has no
        // position to take, so it goes in the middle of the plot area.
        const fallback: PositionObject = {
            x: chart.plotWidth / 2,
            y: chart.plotHeight / 2
        };

        for (const node of this.nodes) {
            const pixel = pixels[node.id] || fallback;

            node.plotX = pixel.x;
            node.plotY = pixel.y;
            node.isInside = true;
        }

        this.points.forEach((point, i): void => {
            const route = topology.routes[i];

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

        const dropped = this.toLayoutPosition({ x: plotX, y: plotY }),
            base = this.layoutBase(point.id);

        point.plotX = plotX;
        point.plotY = plotY;
        point.hasDragged = true;
        point.dragOffset = {
            x: dropped.x - base.x,
            y: dropped.y - base.y
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

        // `fixedDraggable` is deliberately not consulted here. In a
        // networkgraph it keeps a dragged node pinned against the simulation;
        // in a flowchart a drag is already permanent - recorded as
        // `point.dragPos` and reapplied by `translate()` - so honouring the
        // option would change nothing while implying a distinction that does
        // not exist.
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

                const dropped = series.toLayoutPosition({ x, y }),
                    base = series.layoutBase(id);

                (series.waypointDragOffset ||= {})[id] = {
                    x: dropped.x - base.x,
                    y: dropped.y - base.y
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
    // Named force functions for the simulation this series never runs, read
    // only by `ReingoldFruchtermanLayout`. Cleared the same way the
    // networkgraph series clears `animate` and `drawGraph`.
    forces: void 0,
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
