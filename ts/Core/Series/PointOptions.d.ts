/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Animation/AnimationOptions';
import type ColorType from '../Color/ColorType';
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

/* *
 *
 *  Declarations
 *
 * */

export interface PointClickEvent extends PointerEvent {
    point: Point;
}

/**
 * Helper interface for series types to add options to all series events
 * options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface PointEventsOptions {
    click?: EventCallback<Point, PointClickEvent>;
    mouseOut?: EventCallback<Point, PointerEvent>;
    mouseOver?: EventCallback<Point, PointerEvent>;
    remove?: EventCallback<Point, Event>;
    select?: EventCallback<Point, PointSelectEvent>;
    unselect?: EventCallback<Point, PointUnselectEvent>;
    update?: EventCallback<Point, PointUpdateEvent>;
}

export interface PointMarkerOptions {
    enabled?: boolean;
    enabledThreshold?: number;
    fillColor?: ColorType;
    height?: number;
    lineColor?: ColorType;
    lineWidth?: number;
    radius?: number;
    radiusPlus?: number;
    states?: PointStatesOptions<Point>;
    symbol?: string;
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
    custom?: Record<string, any>;
    drilldown?: string;
    events?: PointEventsOptions;
    id?: string;
    index?: number;
    labelrank?: number;
    legendIndex?: number;
    marker?: PointMarkerOptions;
    name?: string;
    selected?: boolean;
    states?: PointStatesOptions<Point>;
    visible?: boolean;
    x?: number;
    y?: (null|number);
}

export interface PointSelectEvent extends Event {
    accumulate: boolean;
}

export type PointShortOptions = (
    number|
    string|
    Array<(number|string|null)>|
    null
);

export interface PointStateHoverOptions extends StateHoverOptions {
    animation?: (boolean|DeepPartial<AnimationOptions>);
    enabled?: boolean;
    fillColor?: ColorType;
    lineColor?: ColorType;
    lineWidth?: number;
    lineWidthPlus?: number;
    opacity?: number;
}

export interface PointStateInactiveOptions extends StateInactiveOptions {
    opacity?: number;
}

export interface PointStateNormalOptions extends StateNormalOptions {
    animation?: (boolean|DeepPartial<AnimationOptions>);
    opacity?: number;
}

export interface PointStatesOptions<T extends { options: Record<string, any> }> extends StatesOptions {
    hover?: PointStateHoverOptions&StateGenericOptions<T>;
    inactive?: PointStateInactiveOptions&StateGenericOptions<T>;
    normal?: PointStateNormalOptions&StateGenericOptions<T>;
    select?: PointStateSelectOptions&StateGenericOptions<T>;
}

export interface PointStateSelectOptions extends StateSelectOptions {
    enabled?: boolean;
    fillColor?: ColorType;
    lineColor?: ColorType;
    lineWidth?: number;
    opacity?: number;
    radius?: number;
}

export interface PointUnselectEvent extends Event {
    accumulate: boolean;
}

export interface PointUpdateEvent {
    options?: PointTypeOptions;
}

/* *
 *
 *  Export
 *
 * */

export default PointOptions;
