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
    DeepPartial<Omit<T, ('states'|'data')>>
);

export interface StateHoverOptions {
    color?: ColorType;
    dashStyle?: DashStyleValue;
}

export interface StateInactiveOptions {
    color?: ColorType;
    dashStyle?: DashStyleValue;
}

export interface StateNormalOptions {
    color?: ColorType;
    dashStyle?: DashStyleValue;
}

export interface StateSelectOptions extends StateHoverOptions {
    color?: ColorType;
    dashStyle?: DashStyleValue;
}

export interface StatesOptions {
    hover?: StateHoverOptions;
    inactive?: StateInactiveOptions;
    normal?: StateNormalOptions;
    select?: StateSelectOptions;
}

export type StatesOptionsKey = (''|keyof StatesOptions);

/* *
 *
 *  Default Export
 *
 * */

export default StatesOptions;
