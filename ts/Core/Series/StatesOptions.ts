/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../Color/ColorType';
import type DashStyleValue from '../Renderer/DashStyleValue';
import type { DeepPartial } from '../../Shared/Types';
import type { PointMarkerOptions } from './PointOptions';
import type {
    SeriesOptions,
    SeriesStateHoverHaloOptions
} from './SeriesOptions';
import type { AnimationOptions } from '../Animation/AnimationOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface StateClassWithOptions {}

export type StateGenericOptions<T extends SeriesOptions | PointMarkerOptions> = (
    DeepPartial<Omit<T, ('states'|'data'|'nodes'| keyof StateOptionsBase)>>
);

// Internal notes: Used to ensure ColorType doesn't get loosened by DeepPartial,
// and all shared options.
export interface StateOptionsBase {
    animation?: (boolean|Partial<AnimationOptions>);
    color?: ColorType;
    dashStyle?: DashStyleValue;
    enabled?: boolean;
    fillColor?: ColorType;
    halo?: (boolean|SeriesStateHoverHaloOptions);
    lineColor?: ColorType;
    lineWidthPlus?: number;
}

export interface StateHoverOptions extends StateOptionsBase {}

export interface StateInactiveOptions extends StateOptionsBase {}

export interface StateNormalOptions extends StateOptionsBase {
    /**
     * General point marker's state options can also be disabled through
     * series.options.marker.enabled.
     */
    enabled?: StateOptionsBase['enabled'];
}

export interface StateSelectOptions extends StateHoverOptions {}

export interface StatesOptions {
    hover?: StateHoverOptions;
    inactive?: StateInactiveOptions;
    normal?: StateNormalOptions;
    select?: StateSelectOptions;
}

/**
 * Possible key values for the series state options.
 */
export type StatesOptionsKey = (''|keyof StatesOptions);

/**
 * Possible key values for the point state options.
 *
 * @typedef {"hover"|"inactive"|"normal"|"select"} Highcharts.PointStateValue
 */
export type PointStateValue = StatesOptionsKey;

/* *
 *
 *  Default Export
 *
 * */

export default StatesOptions;
