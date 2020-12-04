/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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
import type { EventCallback } from '../Callback';
import type ColorType from '../Color/ColorType';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type Point from './Point';
import type {
    PointEventsOptions,
    PointMarkerOptions,
    PointOptions,
    PointShortOptions
} from './PointOptions';
import type LineSeries from '../../Series/Line/LineSeries';
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

export interface SeriesAfterAnimateEvent {
    target: LineSeries;
    type: 'afterAnimate';
}

export interface SeriesClickEvent {
    point: Point;
}

/**
 * Helper interface for series types to add options to all series events
 * options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface SeriesEventsOptions {
    afterAnimate?: EventCallback<LineSeries, SeriesAfterAnimateEvent>;
    click?: EventCallback<LineSeries, SeriesClickEvent>;
    hide?: EventCallback<LineSeries, Event>;
    mouseOut?: EventCallback<LineSeries, PointerEvent>;
    mouseOver?: EventCallback<LineSeries, PointerEvent>;
    show?: EventCallback<LineSeries, Event>;
}

/**
 * Helper interface for series types to add options to all series options.
 *
 * Use the `declare module` pattern to overload the interface in this definition
 * file.
 */
export interface SeriesOptions {
    animation?: (boolean|DeepPartial<AnimationOptions>);
    color?: ColorType;
    colorIndex?: number;
    data?: Array<(PointOptions|PointShortOptions)>;
    enableMouseTracking?: boolean;
    events?: SeriesEventsOptions;
    id?: string;
    index?: number;
    /** @private */
    isInternal?: boolean;
    linkedTo?: string;
    marker?: PointMarkerOptions;
    name?: string;
    negativeColor?: ColorType;
    opacity?: number;
    point?: SeriesPointOptions;
    pointStart?: number;
    states?: SeriesStatesOptions<LineSeries>;
    turboThreshold?: number;
    type?: string;
    visible?: boolean;
    zones?: Array<SeriesZonesOptions>;
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
    opacity?: number;
}

export interface SeriesStateInactiveOptions extends StateInactiveOptions {
    // nothing here yet
}

export interface SeriesStateNormalOptions extends StateNormalOptions {
    // nothing here yet
}

export interface SeriesStateSelectOptions extends StateSelectOptions {
    // nothing here yet
}

export interface SeriesStatesOptions<T extends { options: Record<string, any> }> extends StatesOptions {
    hover?: SeriesStateHoverOptions&StateGenericOptions<T>;
    inactive?: SeriesStateInactiveOptions&StateGenericOptions<T>;
    normal?: SeriesStateNormalOptions&StateGenericOptions<T>;
    select?: SeriesStateSelectOptions&StateGenericOptions<T>;
}

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
 *  Export
 *
 * */

export default SeriesOptions;
