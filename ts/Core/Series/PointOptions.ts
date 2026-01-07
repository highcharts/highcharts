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
    drag?: EventCallback<Point, AnyRecord>;
    dragStart?: EventCallback<Point, (MouseEvent&AnyRecord)>;
    drop?: EventCallback<Point, AnyRecord>;
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
    drilldown?: string;
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

export interface PointSelectEvent extends Event {
    accumulate: boolean;
}

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

export interface PointUnselectEvent extends Event {
    accumulate: boolean;
}

export interface PointUpdateEvent {
    options?: PointTypeOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default PointOptions;
