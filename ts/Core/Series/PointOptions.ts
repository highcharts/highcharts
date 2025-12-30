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
    mouseOut?: PointMouseOutCallbackFunction;
    mouseOver?: PointMouseOverCallbackFunction;
    remove?: PointRemoveCallbackFunction;

    /**
     * Fires when the point is selected either programmatically or following a
     * click on the point. One parameter, `event`, is passed to the function.
     * Returning `false` cancels the operation.
     */
    select?: PointSelectCallbackFunction;

    /**
     * Fires when the point is unselected either programmatically or following a
     * click on the point. One parameter, `event`, is passed to the function.
     * Returning `false` cancels the operation.
     */
    unselect?: PointUnselectCallbackFunction;

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
     * @type {Highcharts.PointOptionsType}
     */
    options?: PointTypeOptions;
}

export interface PointMarkerOptions {
    enabled?: boolean;
    enabledThreshold?: number;
    fillColor?: ColorType;
    fillOpacity?: number;
    height?: number;
    lineColor?: ColorType;
    lineWidth?: number;
    radius?: number;
    radiusPlus?: number;
    states?: PointMarkerStatesOptions<PointMarkerOptions>;
    symbol?: SymbolKey;
    width?: number;
}

/**
 * Helper interface for point types to add options to all point options.
 *
 * Use the `declare module './PointOptions'` pattern to overload the interface
 * in this definition file.
 */
export interface PointOptions {
    className?: string;
    color?: ColorType;
    colorIndex?: number;
    custom?: AnyRecord;

    /**
     * The individual point events.
     */
    events?: PointEventsOptions;
    id?: string;
    index?: number;
    legendIndex?: number;
    marker?: PointMarkerOptions;
    name?: string;
    selected?: boolean;
    visible?: boolean;
    x?: number|string;
    y?: null|number;
    legendSymbolColor?: ColorType;
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
    animation?: (boolean|DeepPartial<AnimationOptions>);
    enabled?: boolean;
    fillColor?: ColorType;
    lineColor?: ColorType;
    lineWidth?: number;
    lineWidthPlus?: number;
    opacity?: number;
}

export interface PointMarkerStateInactiveOptions extends StateInactiveOptions {
    opacity?: number;
}

export interface PointMarkerStateNormalOptions extends StateNormalOptions {
    animation?: (boolean|DeepPartial<AnimationOptions>);
    opacity?: number;
}

export interface PointMarkerStatesOptions<T extends PointMarkerOptions> extends StatesOptions {
    hover?: PointMarkerStateHoverOptions & StateGenericOptions<T>;
    inactive?: PointMarkerStateInactiveOptions & StateGenericOptions<T>;
    normal?: PointMarkerStateNormalOptions & StateGenericOptions<T>;
    select?: PointMarkerStateSelectOptions & StateGenericOptions<T>;
}

export interface PointMarkerStateSelectOptions extends StateSelectOptions {
    enabled?: boolean;
    fillColor?: ColorType;
    lineColor?: ColorType;
    lineWidth?: number;
    opacity?: number;
    radius?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PointOptions;
