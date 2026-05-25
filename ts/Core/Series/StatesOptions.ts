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
import type SeriesOptions from './SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface StateClassWithOptions {}

export type StateGenericOptions<T extends SeriesOptions | PointMarkerOptions> = (
    DeepPartial<Omit<T, (('states'|'data') & keyof StateOptionsBase)>>
);

// Internal note: ensure ColorType doesn't get loosened by DeepPartial
export interface StateOptionsBase {
    color?: ColorType;
    dashStyle?: DashStyleValue;
    fillColor?: ColorType;
    lineColor?: ColorType;
}

export interface StateHoverOptions extends StateOptionsBase {}

export interface StateInactiveOptions extends StateOptionsBase {}

export interface StateNormalOptions extends StateOptionsBase {}

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
