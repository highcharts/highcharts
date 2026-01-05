/* *
 *
 *  (c) 2010-2025 Highsoft AS
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
     * Enable or disable data sorting for the series.
     */
    enabled?: boolean;

    /**
     * Whether to allow matching points by name in an update.
     */
    matchByName?: boolean;

    /**
     * Determines what data value should be used to sort by.
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
    afterAnimate?: SeriesAfterAnimateCallbackFunction;
    click?: SeriesClickCallbackFunction;
    hide?: SeriesHideCallbackFunction;
    mouseOut?: SeriesMouseOutCallbackFunction;
    mouseOver?: SeriesMouseOverCallbackFunction;
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

export type SeriesFindNearestPointByValue = ('x'|'xy');

/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin` of a line
 * graph.
 */
export type SeriesLinecapValue = ('butt'|'round'|'square');

export type LegendSymbolType = ('areaMarker' | 'lineMarker' | 'rectangle');

/**
 * Helper interface for series types to add options to all series options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface SeriesOptions {
    allowPointSelect?: boolean;
    animation?: (boolean|DeepPartial<AnimationOptions>);
    className?: string;
    clip?: boolean;
    color?: ColorType;
    colorByPoint?: boolean;
    colorIndex?: number;
    colors?: Array<ColorType>;
    connectNulls?: boolean;
    crisp?: boolean;
    cursor?: CursorValue;
    dashStyle?: DashStyleValue;
    data?: Array<(PointOptions|PointShortOptions)>;
    dataSorting?: SeriesDataSortingOptions;
    enableMouseTracking?: boolean;
    events?: SeriesEventsOptions;
    findNearestPointBy?: SeriesFindNearestPointByValue;
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
    inactiveOtherPoints?: boolean;

    /** @internal */
    isInternal?: boolean;

    joinBy?: (string|Array<string>);
    kdNow?: boolean;
    keys?: Array<string>;
    linecap?: SeriesLinecapValue;
    lineColor?: ColorType;
    lineWidth?: number;
    linkedTo?: string;
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
    negativeColor?: ColorType;
    nullInteraction?: boolean;
    opacity?: number;
    point?: SeriesPointOptions;
    pointPlacement?: (number|string);
    pointStart?: number;
    relativeXValue?: boolean;
    pointValKey?: string;
    selected?: boolean;
    shadow?: (boolean|Partial<ShadowOptionsObject>);
    states?: SeriesStatesOptions<SeriesOptions>;
    step?: SeriesStepValue;
    stickyTracking?: boolean;
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
    zoneAxis?: 'x'|'y'|'z';
    zones?: Array<SeriesZonesOptions>;
    legendSymbol?: LegendSymbolType;
    legendSymbolColor?: ColorType;
}

export interface SeriesPointOptions {
    events?: PointEventsOptions;
}

export interface SeriesStateHoverHaloOptions {
    attributes?: SVGAttributes;
    brightness?: number;
    opacity?: number;
    size?: number;
}

export interface SeriesStateHoverOptions extends StateHoverOptions {
    animation?: (boolean|DeepPartial<AnimationOptions>);
    brightness?: number;
    enabled?: boolean;
    halo?: (boolean|SeriesStateHoverHaloOptions);
    lineWidth?: number;
    lineWidthPlus?: number;
    radius?: number;
    radiusPlus?: number;
    opacity?: number;
}

export interface SeriesStateInactiveOptions extends StateInactiveOptions {
    enabled?: boolean;
}

export interface SeriesStateNormalOptions extends StateNormalOptions {
    // Nothing here yet
}

export interface SeriesStateSelectOptions extends StateSelectOptions {
    enabled?: boolean;
}

export interface SeriesStatesOptions<T extends SeriesOptions> extends StatesOptions {
    hover?: SeriesStateHoverOptions & StateGenericOptions<T>;
    inactive?: SeriesStateInactiveOptions & StateGenericOptions<T>;
    normal?: SeriesStateNormalOptions & StateGenericOptions<T>;
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
    className?: string;
    color?: ColorType;
    dashStyle?: DashStyleValue;
    fillColor?: ColorType;
    value?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesOptions;
