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
    id?: string;
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
    type?: string;
    visible?: boolean;
    xAxis?: (number|string);
    yAxis?: (number|string);
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
