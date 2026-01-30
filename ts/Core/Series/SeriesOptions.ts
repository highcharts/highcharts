/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Animation/AnimationOptions';
import type ColorType from '../Color/ColorType';
import type { CursorValue } from '../Renderer/CSSObject';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type { DeepPartial } from '../../Shared/Types';
import type { EventCallback } from '../Callback';
import type Point from './Point';
import type {
    PointEventsOptions,
    PointMarkerOptions,
    PointOptions,
    PointShortOptions
} from './PointOptions';
import type Series from './Series';
import type ShadowOptionsObject from '../Renderer/ShadowOptionsObject';
import type {
    StateGenericOptions,
    StateHoverOptions,
    StateInactiveOptions,
    StateNormalOptions,
    StateSelectOptions,
    StatesOptions
} from './StatesOptions';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

export type NonPlotOptions = (
    'data'|'id'|'index'|'legendIndex'|'mapData'|'name'|'stack'|'treemap'|'type'|
    'xAxis'|'yAxis'|'zIndex'
);

export type PlotOptionsOf<T extends Series = Series> = (
    Omit<T['options'], NonPlotOptions>
);

/**
 * Options for `dataSorting`.
 *
 * @since 8.0.0
 */
export interface SeriesDataSortingOptions {
    /**
     * Enable or disable data sorting for the series. Use [xAxis.reversed](
     * #xAxis.reversed) to change the sorting order.
     *
     * @sample {highcharts} highcharts/datasorting/animation/
     *         Data sorting in scatter-3d
     * @sample {highcharts} highcharts/datasorting/labels-animation/
     *         Axis labels animation
     * @sample {highcharts} highcharts/datasorting/dependent-sorting/
     *         Dependent series sorting
     * @sample {highcharts} highcharts/datasorting/independent-sorting/
     *         Independent series sorting
     *
     * @since 8.0.0
     */
    enabled?: boolean;

    /**
     * Whether to allow matching points by name in an update. If this option
     * is disabled, points will be matched by order.
     *
     * @sample {highcharts} highcharts/datasorting/match-by-name/
     *         Enabled match by name
     *
     * @since 8.0.0
     */
    matchByName?: boolean;

    /**
     * Determines what data value should be used to sort by.
     *
     * @sample {highcharts} highcharts/datasorting/sort-key/
     *         Sort key as `z` value
     *
     * @since   8.0.0
     * @default y
     */
    sortKey?: string;
}

/**
 * Helper interface for series types to add options to all series events
 * options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface SeriesEventsOptions {
    /**
     * Fires after the series has finished its initial animation, or in case
     * animation is disabled, immediately as the series is displayed.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-afteranimate/
     *         Show label after animate
     * @sample {highstock} highcharts/plotoptions/series-events-afteranimate/
     *         Show label after animate
     *
     * @since   4.0
     * @product highcharts highstock gantt
     */
    afterAnimate?: SeriesAfterAnimateCallbackFunction;

    /**
     * Fires when the series is clicked. One parameter, `event`, is passed
     * to the function, containing common event information. Additionally,
     * `event.point` holds a pointer to the nearest point on the graph.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-click/
     *         Alert click info
     * @sample {highstock} stock/plotoptions/series-events-click/
     *         Alert click info
     * @sample {highmaps} maps/plotoptions/series-events-click/
     *         Display click info in subtitle
     */
    click?: SeriesClickCallbackFunction;

    /**
     * Fires when the series is hidden after chart generation time, either
     * by clicking the legend item or by calling `.hide()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-hide/
     *         Alert when the series is hidden by clicking the legend item
     *
     * @since 1.2.0
     */
    hide?: SeriesHideCallbackFunction;

    /**
     * Fires when the mouse leaves the graph. One parameter, `event`, is
     * passed to the function, containing common event information. If the
     * [stickyTracking](#plotOptions.series) option is true, `mouseOut`
     * doesn't happen before the mouse enters another graph or leaves the
     * plot area.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/
     *         With sticky tracking by default
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/
     *         Without sticky tracking
     */
    mouseOut?: SeriesMouseOutCallbackFunction;

    /**
     * Fires when the mouse enters the graph. One parameter, `event`, is
     * passed to the function, containing common event information.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/
     *         With sticky tracking by default
     * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/
     *         Without sticky tracking
     */
    mouseOver?: SeriesMouseOverCallbackFunction;

    /**
     * Fires when the series is shown after chart generation time, either
     * by clicking the legend item or by calling `.show()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-show/
     *         Alert when the series is shown by clicking the legend item.
     *
     * @since 1.2.0
     */
    show?: SeriesShowCallbackFunction;
}

/**
 * Function callback when a series has been animated.
 *
 * @param {Highcharts.Series} this
 *        The series where the event occurred.
 *
 * @param {Highcharts.SeriesAfterAnimateEventObject} event
 *        Event arguments.
 */
export type SeriesAfterAnimateCallbackFunction =
    EventCallback<Series, SeriesAfterAnimateEventObject>;

/**
 * Event information regarding completed animation of a series.
 */
export interface SeriesAfterAnimateEventObject {
    /**
     * Animated series.
     */
    target: Series;

    /**
     * Event type.
     */
    type: 'afterAnimate';
}

/**
 * Function callback when a series is clicked. Return false to cancel toggle
 * actions.
 *
 * @param {Highcharts.Series} this
 *        The series where the event occurred.
 *
 * @param {Highcharts.SeriesClickEventObject} event
 *        Event arguments.
 */
export type SeriesClickCallbackFunction =
    EventCallback<Series, SeriesClickEventObject>;

/**
 * Common information for a click event on a series.
 *
 * @extends global.Event
 */
export interface SeriesClickEventObject {
    /**
     * Nearest point on the graph.
     */
    point: Point;
}

/**
 * Gets fired when the series is hidden after chart generation time, either by
 * clicking the legend item or by calling `.hide()`.
 *
 * @param {Highcharts.Series} this
 *        The series where the event occurred.
 *
 * @param {global.Event} event
 *        The event that occurred.
 */
export type SeriesHideCallbackFunction = EventCallback<Series, Event>;

/**
 * Gets fired when the mouse leaves the graph.
 *
 * @callback Highcharts.SeriesMouseOutCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occurred.
 *
 * @param {global.PointerEvent} event
 *        Event that occurred.
 */
export type SeriesMouseOutCallbackFunction =
    EventCallback<Series, PointerEvent>;

/**
 * Gets fired when the mouse enters the graph.
 *
 * @callback Highcharts.SeriesMouseOverCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occurred.
 *
 * @param {global.PointerEvent} event
 *        Event that occurred.
 */
export type SeriesMouseOverCallbackFunction =
    EventCallback<Series, PointerEvent>;

/**
 * Gets fired when the series is shown after chart generation time, either by
 * clicking the legend item or by calling `.show()`.
 *
 * @callback Highcharts.SeriesShowCallbackFunction
 *
 * @param {Highcharts.Series} this
 *        Series where the event occurred.
 *
 * @param {global.Event} event
 *        Event that occurred.
 */
export type SeriesShowCallbackFunction = EventCallback<Series, Event>;

/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin` of a line
 * graph.
 */
export type SeriesLinecapValue = ('butt'|'round'|'square');

/**
 * Helper interface for series types to add options to all series options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface SeriesOptions {
    /**
     * Allow this series' points to be selected by clicking on the graphic
     * (columns, point markers, pie slices, map areas etc).
     *
     * The selected points can be handled by point select and unselect
     * events, or collectively by the [getSelectedPoints
     * ](/class-reference/Highcharts.Chart#getSelectedPoints) function.
     *
     * And alternative way of selecting points is through dragging.
     *
     * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-line/
     *         Line
     * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-column/
     *         Column
     * @sample {highcharts} highcharts/plotoptions/series-allowpointselect-pie/
     *         Pie
     * @sample {highcharts} highcharts/chart/events-selection-points/
     *         Select a range of points through a drag selection
     * @sample {highmaps} maps/plotoptions/series-allowpointselect/
     *         Map area
     * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/
     *         Map bubble
     *
     * @since 1.2.0
     * @default false
     */
    allowPointSelect?: boolean;

    /**
     * Enable or disable the initial animation when a series is displayed.
     * The animation can also be set as a configuration object. Please
     * note that this option only applies to the initial animation of the
     * series itself. For other animations, see [chart.animation](
     * #chart.animation) and the animation parameter under the API methods.
     * The following properties are supported:
     *
     * - `defer`: The animation delay time in milliseconds.
     *
     * - `duration`: The duration of the animation in milliseconds. (Defaults to
     *   `1000`)
     *
     * - `easing`: Can be a string reference to an easing function set on
     *   the `Math` object or a function. See the _Custom easing function_
     *   demo below. (Defaults to `easeInOutSine`)
     *
     * Due to poor performance, animation is disabled in old IE browsers
     * for several chart types.
     *
     * @sample {highcharts} highcharts/plotoptions/series-animation-disabled/
     *         Animation disabled
     * @sample {highcharts} highcharts/plotoptions/series-animation-slower/
     *         Slower animation
     * @sample {highcharts} highcharts/plotoptions/series-animation-easing/
     *         Custom easing function
     * @sample {highstock} stock/plotoptions/animation-slower/
     *         Slower animation
     * @sample {highstock} stock/plotoptions/animation-easing/
     *         Custom easing function
     * @sample {highmaps} maps/plotoptions/series-animation-true/
     *         Animation enabled on map series
     * @sample {highmaps} maps/plotoptions/mapbubble-animation-false/
     *         Disabled on mapbubble series
     *
     * @type    {boolean|Highcharts.AnimationOptionsObject}
     * @default {highcharts} true
     * @default {highstock} true
     * @default {highmaps} false
     */
    animation?: (boolean|DeepPartial<AnimationOptions>);

    /**
     * For some series, there is a limit that shuts down animation
     * by default when the total number of points in the chart is too high.
     * For example, for a column chart and its derivatives, animation does
     * not run if there is more than 250 points totally. To disable this
     * cap, set `animationLimit` to `Infinity`. This option works if animation
     * is fired on individual points, not on a group of points like e.g. during
     * the initial animation.
     *
     * @sample {highcharts} highcharts/plotoptions/series-animationlimit/
     *         Animation limit on updating individual points
     */
    animationLimit?: number;

    /**
     * An additional class name to apply to the series' graphical elements.
     * This option does not replace default class names of the graphical
     * element. Changes to the series' color will also be reflected in a
     * chart's legend and tooltip.
     *
     * @sample {highcharts} highcharts/css/point-series-classname
     *         Series and point class name
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * Disable this option to allow series rendering in the whole plotting
     * area.
     *
     * **Note:** Clipping should be always enabled when
     * [chart.zoomType](#chart.zoomType) is set
     *
     * @sample {highcharts} highcharts/plotoptions/series-clip/
     *         Disabled clipping
     *
     * @since   3.0.0
     * @default true
     */
    clip?: boolean;

    /**
     * The main color of the series. In line type series it applies to the
     * line and the point markers unless otherwise specified. In bar type
     * series it applies to the bars unless a color is specified per point.
     * The default value is pulled from the `options.colors` array.
     *
     * In styled mode, the color can be defined by the
     * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
     * color can be set with the `.highcharts-series`,
     * `.highcharts-color-{n}`, `.highcharts-{type}-series` or
     * `.highcharts-series-{n}` class, or individual classes given by the
     * `className` option.
     *
     * @productdesc {highmaps}
     * In maps, the series color is rarely used, as most choropleth maps use
     * the color to denote the value of each point. The series color can
     * however be used in a map with multiple series holding categorized
     * data.
     *
     * @sample {highcharts} highcharts/plotoptions/series-color-general/
     *         General plot option
     * @sample {highcharts} highcharts/plotoptions/series-color-specific/
     *         One specific series
     * @sample {highcharts} highcharts/plotoptions/series-color-area/
     *         Area color
     * @sample {highcharts} highcharts/series/infographic/
     *         Pattern fill
     * @sample {highmaps} maps/demo/category-map/
     *         Category map by multiple series
     */
    color?: ColorType;
    colorByPoint?: boolean;

    /**
     * Styled mode only. A specific color index to use for the series, so its
     * graphic representations are given the class name `highcharts-color-{n}`.
     *
     * Since v11, CSS variables on the form `--highcharts-color-{n}` make
     * changing the color scheme very convenient.
     *
     * @sample {highcharts} highcharts/css/colorindex/
     * Series and point color index
     *
     * @since 5.0.0
     */
    colorIndex?: number;
    colors?: Array<ColorType>;

    /**
     * Whether to connect a graph line across null points, or render a gap
     * between the two points on either side of the null.
     *
     * In stacked area chart, if `connectNulls` is set to true,
     * null points are interpreted as 0.
     *
     * @sample {highcharts} highcharts/plotoptions/series-connectnulls-false/
     *         False by default
     * @sample {highcharts} highcharts/plotoptions/series-connectnulls-true/
     *         True
     *
     * @default false
     * @product highcharts highstock
     */
    connectNulls?: boolean;

    /**
     * When true, each point or column edge is rounded to its nearest pixel
     * in order to render sharp on screen. In some cases, when there are a
     * lot of densely packed columns, this leads to visible difference
     * in column widths or distance between columns. In these cases,
     * setting `crisp` to `false` may look better, even though each column
     * is rendered blurry.
     *
     * @sample {highcharts} highcharts/plotoptions/column-crisp-false/
     *         Crisp is false
     *
     * @since   5.0.10
     * @product highcharts highstock gantt
     * @default true
     */
    crisp?: boolean;

    /**
     * When the series contains less points than the crop threshold, all
     * points are drawn, even if the points fall outside the visible plot
     * area at the current zoom. The advantage of drawing all points
     * (including markers and columns), is that animation is performed on
     * updates. On the other hand, when the series contains more points than
     * the crop threshold, the series data is cropped to only contain points
     * that fall within the plot area. The advantage of cropping away
     * invisible points is to increase performance on large series.
     *
     * @since   2.2
     * @product highcharts highstock
     */
    cropThreshold?: number;

    /**
     * You can set the cursor to "pointer" if you have click events attached
     * to the series, to signal to the user that the points and lines can
     * be clicked.
     *
     * In styled mode, the series cursor can be set with the same classes
     * as listed under [series.color](#plotOptions.series.color).
     *
     * @sample {highcharts} highcharts/plotoptions/series-cursor-line/
     *         On line graph
     * @sample {highcharts} highcharts/plotoptions/series-cursor-column/
     *         On columns
     * @sample {highcharts} highcharts/plotoptions/series-cursor-scatter/
     *         On scatter markers
     * @sample {highstock} stock/plotoptions/cursor/
     *         Pointer on a line graph
     * @sample {highmaps} maps/plotoptions/series-allowpointselect/
     *         Map area
     * @sample {highmaps} maps/plotoptions/mapbubble-allowpointselect/
     *         Map bubble
     */
    cursor?: CursorValue;

    /**
     * A reserved subspace to store options and values for customized
     * functionality. Here you can add additional data for your own event
     * callbacks and formatter callbacks.
     *
     * @sample {highcharts} highcharts/point/custom/
     *         Point and series with custom data
     */
    custom?: any;

    /**
     * Name of the dash style to use for the graph, or for some series types
     * the outline of each shape.
     *
     * In styled mode, the
     * [stroke dash-array](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-dashstyle/)
     * can be set with the same classes as listed under
     * [series.color](#plotOptions.series.color).
     *
     * @sample {highcharts} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     * @sample {highcharts} highcharts/plotoptions/series-dashstyle/
     *         Chart suitable for printing in black and white
     * @sample {highstock} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     * @sample {highmaps} highcharts/plotoptions/series-dashstyle-all/
     *         Possible values demonstrated
     * @sample {highmaps} maps/plotoptions/series-dashstyle/
     *         Dotted borders on a map
     *
     * @since 2.1
     * @default 'Solid'
     */
    dashStyle?: DashStyleValue;

    data?: Array<(PointOptions|PointShortOptions)>;

    /**
     * Options for the series data sorting.
     *
     * @since   8.0.0
     * @product highcharts highstock
     */
    dataSorting?: SeriesDataSortingOptions;

    /**
     * Enable or disable the mouse tracking for a specific series. This
     * includes point tooltips and click events on graphs and points. For
     * large datasets it improves performance.
     *
     * @sample {highcharts} highcharts/plotoptions/series-enablemousetracking-false/
     *         No mouse tracking
     * @sample {highmaps} maps/plotoptions/series-enablemousetracking-false/
     *         No mouse tracking
     *
     * @default true
     */
    enableMouseTracking?: boolean;

    /**
     * General event handlers for the series items. These event hooks can
     * also be attached to the series at run time using the
     * `Highcharts.addEvent` function.
     */
    events?: SeriesEventsOptions;

    /**
     * Determines whether the series should look for the nearest point
     * in both dimensions or just the x-dimension when hovering the series.
     * Defaults to `'xy'` for scatter series and `'x'` for most other
     * series. If the data has duplicate x-values, it is recommended to
     * set this to `'xy'` to allow hovering over all points.
     *
     * Applies only to series types using nearest neighbor search (not
     * direct hover) for tooltip.
     *
     * @sample {highcharts} highcharts/series/findnearestpointby/
     *         Different hover behaviors
     * @sample {highstock} highcharts/series/findnearestpointby/
     *         Different hover behaviors
     * @sample {highmaps} highcharts/series/findnearestpointby/
     *         Different hover behaviors
     *
     * @since   5.0.10
     * @default 'x'
     */
    findNearestPointBy?: ('x'|'xy');

    /**
     * Whether to use the Y extremes of the total chart width or only the
     * zoomed area when zooming in on parts of the X axis. By default, the
     * Y axis adjusts to the min and max of the visible data. Cartesian
     * series only.
     *
     * @default false
     * @since   4.1.6
     * @product highcharts highstock gantt
     */
    getExtremesFromAll?: boolean;

    /**
     * An id for the series. This can be used after render time to get a pointer
     * to the series object through `chart.get()`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-id/
     *         Get series by id
     *
     * @since 1.2.0
     */
    id?: string;

    /**
     * The index of the series in the chart, affecting the internal index in the
     * `chart.series` array, the visible Z index as well as the order in the
     * legend.
     *
     * @since 2.3.0
     */
    index?: number;

    /**
     * Highlight only the hovered point and fade the remaining points.
     *
     * Scatter-type series require enabling the 'inactive' marker state and
     * adjusting opacity. Note that this approach could affect performance
     * with large datasets.
     *
     * @sample {highcharts} highcharts/plotoptions/series-inactiveotherpoints-enabled/
     *         Chart with inactiveOtherPoints option enabled.
     *
     * @default false
     */
    inactiveOtherPoints?: boolean;

    /** @internal */
    isInternal?: boolean;

    joinBy?: (string|Array<string>);
    kdNow?: boolean;

    /**
     * An array specifying which option maps to which key in the data point
     * array. This makes it convenient to work with unstructured data arrays
     * from different sources.
     *
     * @see [series.data](#series.line.data)
     *
     * @sample {highcharts|highstock} highcharts/series/data-keys/
     *         An extended data array with keys
     * @sample {highcharts|highstock} highcharts/series/data-nested-keys/
     *         Nested keys used to access object properties
     *
     * @since 4.1.6
     */
    keys?: Array<string>;

    /**
     * The line cap used for line ends and line joins on the graph.
     *
     * @productdesc {highcharts|highstock}
     * The SVG value used for the `stroke-linecap` and `stroke-linejoin`
     * of a line graph. Round means that lines are rounded in the ends and
     * bends.
     *
     * @sample highcharts/series-line/linecap/
     *         Line cap comparison
     *
     * @default 'round'
     * @since   3.0.7
     */
    linecap?: SeriesLinecapValue;

    lineColor?: ColorType;

    /**
     * Pixel width of the graph line.
     *
     * @see In styled mode, the line stroke-width can be set with the
     *      `.highcharts-graph` class name.
     *
     * @sample {highcharts} highcharts/plotoptions/series-linewidth-general/
     *         On all series
     * @sample {highcharts} highcharts/plotoptions/series-linewidth-specific/
     *         On one single series
     *
     * @product highcharts highstock
     * @default 2
     */
    lineWidth?: number;

    /**
     * The [id](#series.id) of another series to link to. Additionally,
     * the value can be ":previous" to link to the previous series. When
     * two series are linked, only the first one appears in the legend.
     * Toggling the visibility of this also toggles the linked series.
     *
     * If master series uses data sorting and linked series does not have
     * its own sorting definition, the linked series will be sorted in the
     * same order as the master one.
     *
     * If a `compare` value is not set on a linked series, it will be inherited
     * from the parent series.
     *
     * @sample {highcharts|highstock} highcharts/demo/arearange-line/
     *         Linked series
     *
     * @since   3.0
     * @product highcharts highstock gantt
     */
    linkedTo?: string;

    /**
     * Options for the point markers of line and scatter-like series. Properties
     * like `fillColor`, `lineColor` and `lineWidth` define the visual
     * appearance of the markers. The `symbol` option defines the shape. Other
     * series types, like column series, don't have markers, but have visual
     * options on the series level instead.
     *
     * In styled mode, the markers can be styled with the `.highcharts-point`,
     * `.highcharts-point-hover` and `.highcharts-point-select` class names.
     *
     * @sample {highmaps} maps/demo/mappoint-mapmarker
     *         Using the mapmarker symbol for points
     */
    marker?: PointMarkerOptions;

    /**
     * The name of the series as shown in the legend, tooltip etc.
     *
     * @sample {highcharts} highcharts/series/name/
     *         Series name
     *
     * @sample {highmaps} maps/demo/category-map/
     *         Series name
     */
    name?: string;

    /**
     * The color for the parts of the graph or points that are below the
     * [threshold](#plotOptions.series.threshold). Note that `zones` takes
     * precedence over the negative color. Using `negativeColor` is
     * equivalent to applying a zone with value of 0.
     *
     * @see In styled mode, a negative color is applied by setting this option
     *      to `true` combined with the `.highcharts-negative` class name.
     *
     * @sample {highcharts} highcharts/plotoptions/series-negative-color/
     *         Spline, area and column
     * @sample {highcharts} highcharts/plotoptions/arearange-negativecolor/
     *         Arearange
     * @sample {highcharts} highcharts/css/series-negative-color/
     *         Styled mode
     * @sample {highstock} highcharts/plotoptions/series-negative-color/
     *         Spline, area and column
     * @sample {highstock} highcharts/plotoptions/arearange-negativecolor/
     *         Arearange
     * @sample {highmaps} highcharts/plotoptions/series-negative-color/
     *         Spline, area and column
     * @sample {highmaps} highcharts/plotoptions/arearange-negativecolor/
     *         Arearange
     *
     * @since 3.0
     */
    negativeColor?: ColorType;

    /**
     * Whether or not data-points with the value of `null` should be
     * interactive. When this is set to `true`, tooltips may highlight these
     * points, and this option also enables keyboard navigation for such points.
     * Format options for such points include
     * [`nullFormat`](#tooltip.nullFormat) and
     * [`nullFormater`](#tooltip.nullFormatter). Works for these series: `line`,
     * `spline`, `area`, `area-spline`, `column`, `bar`, and* `timeline`.
     *
     * @sample {highcharts} highcharts/series/null-interaction/
     *         Chart with interactive `null` points
     *
     * @sample {highcharts} highcharts/series-timeline/null-interaction/
     *         Timeline series with `null` points
     *
     * @product highcharts highstock
     */
    nullInteraction?: boolean;

    /**
     * Opacity of a series parts: line, fill (e.g. area) and dataLabels.
     *
     * @see [states.inactive.opacity](#plotOptions.series.states.inactive.opacity)
     *
     * @since 7.1.0
     */
    opacity?: number;

    /**
     * Properties for each single point.
     */
    point?: SeriesPointOptions;

    /**
     * Possible values: `"on"`, `"between"`, `number`.
     *
     * In a column chart, when pointPlacement is `"on"`, the point will not
     * create any padding of the X axis. In a polar column chart this means
     * that the first column points directly north. If the pointPlacement is
     * `"between"`, the columns will be laid out between ticks. This is
     * useful for example for visualising an amount between two points in
     * time or in a certain sector of a polar chart.
     *
     * Since Highcharts 3.0.2, the point placement can also be numeric,
     * where 0 is on the axis value, -0.5 is between this value and the
     * previous, and 0.5 is between this value and the next. Unlike the
     * textual options, numeric point placement options won't affect axis
     * padding.
     *
     * Note that pointPlacement needs a [pointRange](
     * #plotOptions.series.pointRange) to work. For column series this is
     * computed, but for line-type series it needs to be set.
     *
     * For the `xrange` series type and gantt charts, if the Y axis is a
     * category axis, the `pointPlacement` applies to the Y axis rather than
     * the (typically datetime) X axis.
     *
     * Defaults to `undefined` in cartesian charts, `"between"` in polar
     * charts.
     *
     * @see [xAxis.tickmarkPlacement](#xAxis.tickmarkPlacement)
     *
     * @sample {highcharts|highstock} highcharts/plotoptions/series-pointplacement-between/
     *         Between in a column chart
     * @sample {highcharts|highstock} highcharts/plotoptions/series-pointplacement-numeric/
     *         Numeric placement for custom layout
     * @sample {highcharts|highstock} maps/plotoptions/heatmap-pointplacement/
     *         Placement in heatmap
     *
     * @since   2.3.0
     * @product highcharts highstock gantt
     */
    pointPlacement?: (number|string);

    /**
     * If no x values are given for the points in a series, `pointStart`
     * defines on what value to start. For example, if a series contains one
     * yearly value starting from 1945, set `pointStart` to 1945.
     *
     * The `pointStart` setting can be a number, or a datetime string that is
     * parsed according to the `time.timezone` setting.
     *
     * If combined with `relativeXValue`, an x value can be set on each
     * point. The x value from the point options is multiplied by
     * `pointInterval` and added to `pointStart` to produce a modified x
     * value.
     *
     * @sample {highcharts} highcharts/plotoptions/series-pointstart-linear/
     *         Linear
     * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/
     *         Datetime
     * @sample {highcharts} highcharts/plotoptions/series-relativexvalue/
     *         Relative x value
     * @sample {highstock} stock/plotoptions/pointinterval-pointstart/
     *         Using pointStart and pointInterval
     * @sample {highstock} stock/plotoptions/relativexvalue/
     *         Relative x value
     *
     * @default 0
     * @product highcharts highstock gantt
     */
    pointStart?: number;

    /**
     * When true, X values in the data set are relative to the current
     * `pointStart`, `pointInterval` and `pointIntervalUnit` settings. This
     * allows compression of the data for datasets with irregular X values.
     *
     * The real X values are computed on the formula `f(x) = ax + b`, where
     * `a` is the `pointInterval` (optionally with a time unit given by
     * `pointIntervalUnit`), and `b` is the `pointStart`.
     *
     * @sample {highcharts} highcharts/plotoptions/series-relativexvalue/
     *         Relative X value
     * @sample {highstock} stock/plotoptions/relativexvalue/
     *         Relative X value
     *
     * @default false
     * @product highcharts highstock
     */
    relativeXValue?: boolean;

    pointValKey?: string;

    /**
     * Whether to select the series initially. If `showCheckbox` is true,
     * the checkbox next to the series name in the legend will be checked
     * for a selected series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-selected/
     *         One out of two series selected
     *
     * @default false
     * @since   1.2.0
     */
    selected?: boolean;

    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the
     * shadow can be an object configuration containing `color`, `offsetX`,
     * `offsetY`, `opacity` and `width`.
     *
     * Note that in some cases, like stacked columns or other dense layouts, the
     * series may cast shadows on each other. In that case, the
     * `chart.seriesGroupShadow` allows applying a common drop shadow to the
     * whole series group.
     *
     * @sample {highcharts} highcharts/plotoptions/series-shadow/
     *         Shadow enabled
     *
     * @default false
     */
    shadow?: (boolean|Partial<ShadowOptionsObject>);

    /**
     * A collection of options for different series states.
     */
    states?: SeriesStatesOptions<SeriesOptions>;

    /**
     * Whether to apply steps to the line. Possible values are `left`,
     * `center` and `right`.
     *
     * @sample {highcharts} highcharts/plotoptions/line-step/
     *         Different step line options
     * @sample {highcharts} highcharts/plotoptions/area-step/
     *         Stepped, stacked area
     * @sample {highstock} stock/plotoptions/line-step/
     *         Step line
     *
     * @since   1.2.5
     * @product highcharts highstock
     */
    step?: SeriesStepValue;

    /**
     * Sticky tracking of mouse events. When true, the `mouseOut` event on a
     * series isn't triggered until the mouse moves over another series, or
     * out of the plot area. When false, the `mouseOut` event on a series is
     * triggered when the mouse leaves the area around the series' graph or
     * markers. This also implies the tooltip when not shared. When
     * `stickyTracking` is false and `tooltip.shared` is false, the tooltip
     * will be hidden when moving the mouse between series. Defaults to true
     * for line and area type series, but to false for columns, pies etc.
     *
     * **Note:** The boost module will force this option because of
     * technical limitations.
     *
     * @sample {highcharts} highcharts/plotoptions/series-stickytracking-true/
     *         True by default
     * @sample {highcharts} highcharts/plotoptions/series-stickytracking-false/
     *         False
     *
     * @default {highcharts} true
     * @default {highstock} true
     * @default {highmaps} false
     * @since   2.0
     */
    stickyTracking?: boolean;

    /**
     * When a series contains a `data` array that is longer than this, the
     * Series class looks for data configurations of plain numbers or arrays of
     * numbers. The first and last valid points are checked. If found, the rest
     * of the data is assumed to be the same. This saves expensive data checking
     * and indexing in long series, and makes data-heavy charts render faster.
     *
     * Set it to `0` disable.
     *
     * Note:
     * - In boost mode turbo threshold is forced. Only array of numbers or two
     *   dimensional arrays are allowed.
     * - In version 11.4.3 and earlier, if object configurations were passed
     *   beyond the turbo threshold, a warning was logged in the console and the
     *   data series didn't render.
     *
     * @since   2.2
     * @product highcharts highstock gantt
     * @default 1000
     */
    turboThreshold?: number;

    /**
     * The type of series, for example `line` or `column`. By default, the
     * series type is inherited from [chart.type](#chart.type), so unless the
     * chart is a combination of series types, there is no need to set it on the
     * series level.
     *
     * @sample {highcharts} highcharts/series/type/
     * Line and column in the same chart
     *
     * @sample highcharts/series/type-dynamic/
     * Dynamic types with button selector
     *
     * @sample {highmaps} maps/demo/mapline-mappoint/
     * Multiple types in the same map
     */
    type?: string;

    /**
     * Set the initial visibility of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-visible/
     *         Two series, one hidden and one visible
     * @sample {highstock} stock/plotoptions/series-visibility/
     *         Hidden series
     *
     * @default true
     */
    visible?: boolean;

    /**
     * When using dual or multiple x axes, this number defines which xAxis the
     * particular series is connected to. It refers to either the
     * {@link #xAxis.id|axis id}
     * or the index of the axis in the xAxis array, with 0 being the first.
     *
     * @default 0
     * @product highcharts highstock
     */
    xAxis?: (number|string);

    /**
     * When using dual or multiple y axes, this number defines which yAxis the
     * particular series is connected to. It refers to either the
     * {@link #yAxis.id|axis id}
     * or the index of the axis in the yAxis array, with 0 being the first.
     *
     * @sample {highcharts} highcharts/series/yaxis/
     * Apply the column series to the secondary Y axis
     *
     * @default 0
     * @product highcharts highstock
     */
    yAxis?: (number|string);

    /**
     * Define the visual z index of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-zindex-default/
     * With no z index, the series defined last are on top
     *
     * @sample {highcharts} highcharts/plotoptions/series-zindex/
     * With a z index, the series with the highest z index is on top
     *
     * @sample {highstock} highcharts/plotoptions/series-zindex-default/
     * With no z index, the series defined last are on top
     *
     * @sample {highstock} highcharts/plotoptions/series-zindex/
     * With a z index, the series with the highest z index is on top
     *
     * @product highcharts highstock
     */
    zIndex?: number;

    zoomEnabled?: boolean;

    /**
     * Defines the Axis on which the zones are applied.
     *
     * @see [zones](#plotOptions.series.zones)
     *
     * @sample {highcharts} highcharts/series/color-zones-zoneaxis-x/
     *         Zones on the X-Axis
     * @sample {highstock} highcharts/series/color-zones-zoneaxis-x/
     *         Zones on the X-Axis
     *
     * @default 'y'
     * @since   4.1.0
     * @product highcharts highstock
     */
    zoneAxis?: 'x'|'y'|'z';

    /**
     * An array defining zones within a series. Zones can be applied to the
     * X axis, Y axis or Z axis for bubbles, according to the `zoneAxis`
     * option. The zone definitions have to be in ascending order regarding
     * to the value.
     *
     * In styled mode, the color zones are styled with the
     * `.highcharts-zone-{n}` class, or custom classed from the `className`
     * option
     * ([view live demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/color-zones/)).
     *
     * @see [zoneAxis](#plotOptions.series.zoneAxis)
     *
     * @sample {highcharts} highcharts/series/color-zones-simple/
     *         Color zones
     * @sample {highstock} highcharts/series/color-zones-simple/
     *         Color zones
     *
     * @since   4.1.0
     * @product highcharts highstock
     */
    zones?: Array<SeriesZonesOptions>;
}

export interface SeriesPointOptions {
    /**
     * Events for each single point.
     */
    events?: PointEventsOptions;
}

export interface SeriesStateHoverHaloOptions {
    /**
     * A collection of SVG attributes to override the appearance
     * of the halo, for example `fill`, `stroke` and
     * `stroke-width`.
     *
     * @since   4.0
     * @product highcharts highstock
     */
    attributes?: SVGAttributes;

    brightness?: number;

    /**
     * Opacity for the halo unless a specific fill is overridden
     * using the `attributes` setting.
     *
     * @since   4.0
     * @product highcharts highstock
     * @default 0.25
     */
    opacity?: number;

    /**
     * The pixel size of the halo. For point markers this is the
     * radius of the halo. For pie slices it is the width of the
     * halo outside the slice. For bubbles it defaults to 5 and
     * is the width of the halo outside the bubble.
     *
     * @since   4.0
     * @product highcharts highstock
     * @default 10
     */
    size?: number;
}

export interface SeriesStateHoverOptions extends StateHoverOptions {
    /**
     * Animation setting for hovering the graph in line-type series.
     *
     * By default the hover state animates quickly in, and slowly back to
     * normal.
     *
     * @since   5.0.8
     * @product highcharts highstock
     * @default {"duration":150}
     */
    animation?: (boolean|DeepPartial<AnimationOptions>);

    brightness?: number;

    /**
     * Enable separate styles for the hovered series to visualize
     * that the user hovers either the series itself or the legend.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled/
     *         Line
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-column/
     *         Column
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-pie/
     *         Pie
     *
     * @default true
     * @since   1.2
     */
    enabled?: boolean;

    /**
     * Options for the halo appearing around the hovered point in
     * line-type series as well as outside the hovered slice in pie
     * charts. By default the halo is filled by the current point or
     * series color with an opacity of 0.25\. The halo can be
     * disabled by setting the `halo` option to `null`.
     *
     * In styled mode, the halo is styled with the
     * `.highcharts-halo` class, with colors inherited from
     * `.highcharts-color-{n}`.
     *
     * @sample {highcharts} highcharts/plotoptions/halo/
     *         Halo options
     * @sample {highstock} highcharts/plotoptions/halo/
     *         Halo options
     *
     * @since   4.0
     * @product highcharts highstock
     */
    halo?: (boolean|SeriesStateHoverHaloOptions);

    /**
     * Pixel width of the graph line. By default this property is
     * undefined, and the `lineWidthPlus` property dictates how much
     * to increase the linewidth from normal state.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidth/
     *         5px line on hover
     *
     * @product highcharts highstock
     */
    lineWidth?: number;

    /**
     * The additional line width for the graph of a hovered series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
     *         5 pixels wider
     * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
     *         5 pixels wider
     *
     * @since   4.0.3
     * @product highcharts highstock
     * @default 1
     */
    lineWidthPlus?: number;

    /**
     * In Highcharts 1.0, the appearance of all markers belonging
     * to the hovered series. For settings on the hover state of the
     * individual point, see
     * [marker.states.hover](#plotOptions.series.marker.states.hover).
     *
     * @deprecated
     *
     * @excluding states, symbol
     * @product   highcharts highstock
     */
    marker?: PointMarkerOptions;

    radius?: number;
    radiusPlus?: number;
    opacity?: number;
}

export interface SeriesStateInactiveOptions extends StateInactiveOptions {
    /**
     * The animation for entering the inactive state.
     *
     * @default {"duration":150}
     */
    animation?: (boolean|DeepPartial<AnimationOptions>);

    /**
     * Enable or disable the inactive state for a series
     *
     * @sample highcharts/plotoptions/series-states-inactive-disabled
     *         Disabled inactive state
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * Opacity of series elements (dataLabels, line, area).
     *
     * @default 0.2
     */
    opacity?: number;
}

export interface SeriesStateNormalOptions extends StateNormalOptions {
    /**
     * Animation when returning to normal state after hovering.
     *
     * @default true
     */
    animation?: (boolean|DeepPartial<AnimationOptions>);
}

export interface SeriesStateSelectOptions extends StateSelectOptions {
    enabled?: boolean;
}

export interface SeriesStatesOptions<T extends SeriesOptions> extends StatesOptions {
    /**
     * Options for the hovered series. These settings override the
     * normal state options when a series is moused over or touched.
     *
     * @declare Highcharts.SeriesStatesHoverOptionsObject
     */
    hover?: SeriesStateHoverOptions & StateGenericOptions<T>;

    /**
     * The opposite state of a hover for series.
     *
     * @sample highcharts/plotoptions/series-states-inactive-disabled
     *         Disabled inactive state
     */
    inactive?: SeriesStateInactiveOptions & StateGenericOptions<T>;

    /**
     * The normal state of a series, or for point items in column, pie
     * and similar series. Currently only used for setting animation
     * when returning to normal state from hover.
     */
    normal?: SeriesStateNormalOptions & StateGenericOptions<T>;

    /**
     * Specific options for point in selected states, after being
     * selected by
     * [allowPointSelect](#plotOptions.series.allowPointSelect)
     * or programmatically.
     *
     * @sample maps/plotoptions/series-allowpointselect/
     *         Allow point select demo
     *
     * @extends   plotOptions.series.states.hover
     * @excluding brightness
     * @default   {"animation":{"duration":0}}
     */
    select?: SeriesStateSelectOptions & StateGenericOptions<T>;
}

export type SeriesStepValue = ('center'|'left'|'right');

/**
 * An array defining zones within a series. Zones can be applied to the
 * X axis, Y axis or Z axis for bubbles, according to the `zoneAxis`
 * option. The zone definitions have to be in ascending order regarding
 * to the value.
 */
export interface SeriesZonesOptions {
    /**
     * Styled mode only. A custom class name for the zone.
     *
     * @sample highcharts/css/color-zones/
     *         Zones styled by class name
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * Defines the color of the series.
     *
     * @see [series color](#plotOptions.series.color)
     *
     * @since   4.1.0
     * @product highcharts highstock
     */
    color?: ColorType;

    /**
     * A name for the dash style to use for the graph.
     *
     * @see [plotOptions.series.dashStyle](#plotOptions.series.dashStyle)
     *
     * @sample {highcharts|highstock} highcharts/series/color-zones-dashstyle-dot/
     *         Dashed line indicates prognosis
     *
     * @since   4.1.0
     * @product highcharts highstock
     */
    dashStyle?: DashStyleValue;

    /**
     * Defines the fill color for the series (in area type series)
     *
     * @see [fillColor](#plotOptions.area.fillColor)
     *
     * @since   4.1.0
     * @product highcharts highstock
     */
    fillColor?: ColorType;

    /**
     * The value up to where the zone extends, if undefined the zones
     * stretches to the last value in the series.
     *
     * @since   4.1.0
     * @product highcharts highstock
     */
    value?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesOptions;
