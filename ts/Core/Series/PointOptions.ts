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
import type { DeepPartial } from '../../Shared/Types';
import type { EventCallback } from '../Callback';
import type Point from './Point';
import type PointerEvent from '../PointerEvent';
import type { PointTypeOptions } from './PointType';
import type {
    StateGenericOptions,
    StateHoverOptions,
    StateInactiveOptions,
    StateNormalOptions,
    StateSelectOptions,
    StatesOptions
} from './StatesOptions';
import type { SymbolKey } from '../Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

// TODO: PointEventsOptions and its children seems big enough for its own file

/**
 * Events for each single point.
 *
 * Helper interface for series types to add options to all series events
 * options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface PointEventsOptions {
    /**
     * Fires when a point is clicked. One parameter, `event`, is passed
     * to the function, containing common event information.
     *
     * If the `series.allowPointSelect` option is true, the default
     * action for the point's click event is to toggle the point's
     * select state. Returning `false` cancels this action.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-click/
     * Click marker to alert values
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-click-column/
     * Click column
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-click-url/
     * Go to URL
     *
     * @sample {highmaps} maps/plotoptions/series-point-events-click/
     * Click marker to display values
     *
     * @sample {highmaps} maps/plotoptions/series-point-events-click-url/
     * Go to URL
     */
    click?: PointClickCallbackFunction;

    /**
     * Fires when the mouse leaves the area close to the point. One
     * parameter, `event`, is passed to the function, containing common
     * event information.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
     * Show values in the chart's corner on mouse over
     */
    mouseOut?: PointMouseOutCallbackFunction;

    /**
     * Fires when the mouse enters the area close to the point. One
     * parameter, `event`, is passed to the function, containing common
     * event information.
     *
     * Returning `false` cancels the default behavior, which is to show a
     * tooltip for the point.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/
     * Show values in the chart's corner on mouse over
     */
    mouseOver?: PointMouseOverCallbackFunction;

    /**
     * Fires when the point is removed using the `.remove()` method. One
     * parameter, `event`, is passed to the function. Returning `false`
     * cancels the operation.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-remove/
     * Remove point and confirm
     *
     * @since 1.2.0
     */
    remove?: PointRemoveCallbackFunction;

    /**
     * Fires when the point is selected either programmatically or
     * following a click on the point. One parameter, `event`, is passed
     * to the function. Returning `false` cancels the operation.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-select/
     * Report the last selected point
     *
     * @sample {highmaps} maps/plotoptions/series-allowpointselect/
     * Report select and unselect
     *
     * @since 1.2.0
     */
    select?: PointSelectCallbackFunction;

    /**
     * Fires when the point is unselected either programmatically or
     * following a click on the point. One parameter, `event`, is passed
     * to the function. Returning `false` cancels the operation.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-unselect/
     * Report the last unselected point
     *
     * @sample {highmaps} maps/plotoptions/series-allowpointselect/
     * Report select and unselect
     *
     * @since 1.2.0
     */
    unselect?: PointUnselectCallbackFunction;

    /**
     * Fires when the point is updated programmatically through the
     * `.update()` method. One parameter, `event`, is passed to the
     * function. The new point options can be accessed through
     * `event.options`. Returning `false` cancels the operation.
     *
     * @sample {highcharts} highcharts/plotoptions/series-point-events-update/
     * Confirm point updating
     *
     * @since 1.2.0
     */
    update?: PointUpdateCallbackFunction;
}

/**
 * Function callback when a series point is clicked. Return false to cancel the
 * action.
 *
 * @callback Highcharts.PointClickCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        The point where the event occurred.
 *
 * @param {Highcharts.PointClickEvent} event
 *        Event arguments.
 */
export type PointClickCallbackFunction = EventCallback<Point, PointClickEvent>;

/**
 * Gets fired when the mouse leaves the area close to the point.
 *
 * @callback Highcharts.PointMouseOutCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occurred.
 *
 * @param {global.PointerEvent} event
 *        Event that occurred.
 */
export type PointMouseOutCallbackFunction = EventCallback<Point, PointerEvent>;

/**
 * Gets fired when the mouse enters the area close to the point.
 *
 * @callback Highcharts.PointMouseOverCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occurred.
 *
 * @param {global.Event} event
 *        Event that occurred.
 */
export type PointMouseOverCallbackFunction = EventCallback<Point, PointerEvent>;

/**
 * Gets fired when the point is removed using the `.remove()` method.
 *
 * @callback Highcharts.PointRemoveCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occurred.
 *
 * @param {global.Event} event
 *        Event that occurred.
 */
export type PointRemoveCallbackFunction = EventCallback<Point, Event>;

/**
 * Gets fired when the point is selected either programmatically or following a
 * click on the point.
 *
 * @callback Highcharts.PointSelectCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occurred.
 *
 * @param {Highcharts.PointInteractionEventObject} event
 *        Event that occurred.
 */
export type PointSelectCallbackFunction =
    EventCallback<Point, PointInteractionEventObject>;

/**
 * Fires when the point is unselected either programmatically or following a
 * click on the point.
 *
 * @callback Highcharts.PointUnselectCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occurred.
 *
 * @param {Highcharts.PointInteractionEventObject} event
 *        Event that occurred.
 */
export type PointUnselectCallbackFunction =
    EventCallback<Point, PointInteractionEventObject>;

/**
 * Gets fired when the point is updated programmatically through the `.update()`
 * method.
 *
 * @callback Highcharts.PointUpdateCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occurred.
 *
 * @param {Highcharts.PointUpdateEventObject} event
 *        Event that occurred.
 */
export type PointUpdateCallbackFunction =
    EventCallback<Point, PointUpdateEvent>;

/**
 * Common information for a click event on a series point.
 */
export interface PointClickEvent extends PointerEvent {
    /**
     * Clicked point.
     */
    point: Point;
}

/**
 * Information about the select/unselect event.
 *
 * @interface Highcharts.PointInteractionEventObject
 * @extends global.Event
 */
export interface PointInteractionEventObject extends Event {
    accumulate: boolean;
}

/**
 * Information about the update event.
 *
 * @interface Highcharts.PointUpdateEventObject
 * @extends global.Event
 */
export interface PointUpdateEvent {
    /**
     * Options data of the update event.
     * @name Highcharts.PointUpdateEventObject#options
     */
    options?: PointTypeOptions;
}

export interface PointMarkerOptions {
    /**
     * Enable or disable the point marker. If `undefined`, the markers
     * are hidden when the data is dense, and shown for more widespread
     * data points.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-enabled/
     * Disabled markers
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-enabled-false/
     * Disabled in normal state but enabled on hover
     *
     * @sample {highstock} stock/plotoptions/series-marker/
     * Enabled markers
     *
     * @default {highcharts} undefined
     * @default {highstock} false
     */
    enabled?: boolean;

    /**
     * The threshold for how dense the point markers should be before
     * they are hidden, given that `enabled` is not defined. The number
     * indicates the horizontal distance between the two closest points
     * in the series, as multiples of the `marker.radius`. In other
     * words, the default value of 2 means points are hidden if
     * overlapping horizontally.
     *
     * @sample highcharts/plotoptions/series-marker-enabledthreshold
     * A higher threshold
     *
     * @since 6.0.5
     * @default 2
     */
    enabledThreshold?: number;

    /**
     * The fill color of the point marker. When `undefined`, the series'
     * or point's color is used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
     * White fill
     */
    fillColor?: ColorType;

    // Implemented only for selected series (bubble, treemap, arcdiagram)
    /** @internal */
    fillOpacity?: number;

    /**
     * Image markers only. Set the image width explicitly. When using
     * this option, a `width` must also be set.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/
     * Fixed width and height
     *
     * @sample {highstock} highcharts/plotoptions/series-marker-width-height/
     * Fixed width and height
     *
     * @since 4.0.4
     */
    height?: number;

    /**
     * The color of the point marker's outline. When `undefined`, the
     * series' or point's color is used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
     * Inherit from series color (undefined)
     *
     * @default ${palette.backgroundColor}
     */
    lineColor?: ColorType;

    /**
     * The width of the point marker's outline.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/
     * 2px blue marker
     *
     * @default 0
     */
    lineWidth?: number;

    /**
     * The radius of the point marker.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-radius/
     *         Bigger markers
     *
     * @default {highstock} 2
     * @default {highcharts} 4
     */
    radius?: number;

    /** @internal */
    radiusPlus?: number;

    /**
     * States for a single point marker.
     */
    states?: PointMarkerStatesOptions<PointMarkerOptions>;

    /**
     * A predefined shape or symbol for the marker. When undefined, the
     * symbol is pulled from options.symbols. Other possible values are
     * `'circle'`, `'square'`,`'diamond'`, `'triangle'` and
     * `'triangle-down'`.
     *
     * Additionally, the URL to a graphic can be given on this form:
     * `'url(graphic.png)'`. Note that for the image to be applied to
     * exported charts, its URL needs to be accessible by the export
     * server.
     *
     * Custom callbacks for symbol path generation can also be added to
     * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
     * used by its method name, as shown in the demo.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
     * Predefined, graphic and custom markers
     *
     * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
     * Predefined, graphic and custom markers
     *
     * @sample {highmaps} maps/demo/mappoint-mapmarker
     * Using the mapmarker symbol for points
     */
    symbol?: SymbolKey;

    /**
     * Image markers only. Set the image width explicitly. When using
     * this option, a `height` must also be set.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/
     * Fixed width and height
     *
     * @sample {highstock} highcharts/plotoptions/series-marker-width-height/
     * Fixed width and height
     *
     * @since 4.0.4
     */
    width?: number;
}

/**
 * Helper interface for point types to add options to all point options.
 *
 * Use the `declare module './PointOptions'` pattern to overload the interface
 * in this definition file.
 */
export interface PointOptions {
    /**
     * An additional, individual class name for the data point's graphic
     * representation. Changes to a point's color will also be reflected in a
     * chart's legend and tooltip.
     *
     * @sample {highcharts} highcharts/css/point-series-classname
     * Series and point class name
     *
     * @since 5.0.0
     */
    className?: string;

    /**
     * Individual color for the point. By default the color is pulled from
     * the global `colors` array.
     *
     * In styled mode, the `color` option doesn't take effect. Instead, use
     * `colorIndex`.
     *
     * @sample {highcharts} highcharts/point/color/
     * Mark the highest point
     */
    color?: ColorType;

    /**
     * A specific color index to use for the point, so its graphic
     * representations are given the class name `highcharts-color-{n}`. In
     * styled mode this will change the color of the graphic. In non-styled
     * mode, the color is set by the `fill` attribute, so the change in class
     * name won't have a visual effect by default.
     *
     * Since v11, CSS variables on the form `--highcharts-color-{n}` make
     * changing the color scheme very convenient.
     *
     * @sample {highcharts} highcharts/css/colorindex/
     * Series and point color index
     *
     * @since 5.0.0
     * @product highcharts gantt
     */
    colorIndex?: number;

    /**
     * A reserved subspace to store options and values for customized
     * functionality. Here you can add additional data for your own event
     * callbacks and formatter callbacks.
     *
     * @sample {highcharts} highcharts/point/custom/
     * Point and series with custom data
     */
    custom?: AnyRecord;

    /**
     * The individual point events.
     */
    events?: PointEventsOptions;

    /**
     * An id for the point. This can be used after render time to get a
     * pointer to the point object through `chart.get()`.
     *
     * @sample {highcharts} highcharts/point/id/
     * Remove an id'd point
     *
     * @since 1.2.0
     */
    id?: string;

    /** @internal */
    index?: number;

    // Implemented only for selected series with legendType: 'point'.
    /** @internal */
    legendIndex?: number;

    // Implemented only for selected series with legendType: 'point'.
    /** @internal */
    legendSymbolColor?: ColorType;

    /**
     * Options for the point markers of line-like series.
     *
     * @product highcharts highstock highmaps
     */
    marker?: PointMarkerOptions;

    /**
     * The name of the point as shown in the legend, tooltip, dataLabels, etc.
     *
     * @see [xAxis.uniqueNames](#xAxis.uniqueNames)
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     * Point names
     */
    name?: string;

    /**
     * Whether the data point is selected initially.
     *
     * @default false
     */
    selected?: boolean;

    /** @internal */
    visible?: boolean;

    /**
     * The x value of the point.
     *
     * For datetime axes, a number value is the timestamp in milliseconds since
     * 1970, while a date string is parsed according to the [current time zone]
     * (https://api.highcharts.com/highcharts/time.timezone) of the
     * chart. Date strings are supported since v12.
     *
     * @product highcharts highstock
     */
    x?: number|string;

    /**
     * The y value of the point.
     *
     * @product highcharts highstock
     */
    y?: null|number;
}

/**
 * The generic point options for all series.
 *
 * In TypeScript you have to extend `PointOptionsObject` with an additional
 * declaration to allow custom data options:
 *
 * ```
 * declare interface PointOptionsObject {
 *     customProperty: string;
 * }
 * ```
 *
 * @interface Highcharts.PointOptionsObject
 */
export type PointOptionsObject = PointOptions;

/**
 * Possible option types for a data point. Use `null` to indicate a gap.
 */
export type PointOptionsType = PointShortOptions | PointOptionsObject;

export type PointShortOptions = (
    number|
    string|
    Array<(number|string|null)>|
    null
);

export interface PointMarkerStateHoverOptions extends StateHoverOptions {
    /**
     * Animation when hovering over the marker.
     *
     * @default {"duration":150}
     */
    animation?: (boolean|DeepPartial<AnimationOptions>);

    /**
     * Enable or disable the point marker.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-enabled/
     * Disabled hover state
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The fill color of the marker in hover state. When
     * `undefined`, the series' or point's fillColor for normal
     * state is used.
     */
    fillColor?: ColorType;

    /**
     * The color of the point marker's outline. When
     * `undefined`, the series' or point's lineColor for normal
     * state is used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linecolor/
     * White fill color, black line color
     */
    lineColor?: ColorType;

    /**
     * The width of the point marker's outline. When
     * `undefined`, the series' or point's lineWidth for normal
     * state is used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linewidth/
     * 3px line width
     */
    lineWidth?: number;

    /**
     * The additional line width for a hovered point.
     *
     * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
     * 2 pixels wider on hover
     *
     * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
     * 2 pixels wider on hover
     *
     * @since 4.0.3
     * @default 1
     */
    lineWidthPlus?: number;

    /** @internal */
    opacity?: number;
}

export interface PointMarkerStateInactiveOptions extends StateInactiveOptions {
    /** @internal */
    opacity?: number;
}

export interface PointMarkerStateNormalOptions extends StateNormalOptions {
    /**
     * Animation when returning to normal state after hovering.
     *
     * @default true
     */
    animation?: (boolean|DeepPartial<AnimationOptions>);

    /** @internal */
    opacity?: number;
}

export interface PointMarkerStatesOptions<T extends PointMarkerOptions> extends StatesOptions {
    /**
     * The hover state for a single point marker.
     */
    hover?: PointMarkerStateHoverOptions & StateGenericOptions<T>;

    // Implemented only for networkgraph.
    /** @internal */
    inactive?: PointMarkerStateInactiveOptions & StateGenericOptions<T>;

    /**
     * The normal state of a single point marker. Currently only
     * used for setting animation when returning to normal state
     * from hover.
     */
    normal?: PointMarkerStateNormalOptions & StateGenericOptions<T>;

    /**
     * The appearance of the point marker when selected. In order to allow a
     * point to be selected, set the `series.allowPointSelect` option to true.
     */
    select?: PointMarkerStateSelectOptions & StateGenericOptions<T>;
}

export interface PointMarkerStateSelectOptions extends StateSelectOptions {
    /**
     * Enable or disable visible feedback for selection.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-enabled/
     * Disabled select state
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The fill color of the point marker.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-fillcolor/
     * Solid red discs for selected points
     *
     * @default ${palette.neutralColor20}
     */
    fillColor?: ColorType;

    /**
     * The color of the point marker's outline. When
     * `undefined`, the series' or point's color is used.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linecolor/
     * Red line color for selected points
     *
     * @default ${palette.neutralColor100}
     */
    lineColor?: ColorType;

    /**
     * The width of the point marker's outline.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-linewidth/
     * 3px line width for selected points
     *
     * @default 2
     */
    lineWidth?: number;

    /** @internal */
    opacity?: number;

    /**
     * The radius of the point marker. In hover state, it defaults to the normal
     * state's radius + 2.
     *
     * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-radius/
     * 10px radius for selected points
     */
    radius?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PointOptions;
