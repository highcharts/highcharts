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

import type ColorType from '../Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface StateClassWithOptions {}

export type StateGenericOptions<T extends { options: Record<string, any> }> = (
    DeepPartial<Omit<T['options'], ('states'|'data')>>
);

export interface StateHoverOptions {
    color?: ColorType;
    dashStyle?: Highcharts.DashStyleValue;
}

export interface StateInactiveOptions {
    // nothing here yet
}

export interface StateNormalOptions {
    // nothing here yet
}

export interface StateSelectOptions extends StateHoverOptions {
    // nothing here yet
}

export type StatesOptionsKey = (''|keyof StatesOptions);

export interface StatesOptions {
    hover?: StateHoverOptions;
    inactive?: StateInactiveOptions;
    normal?: StateNormalOptions;
    select?: StateSelectOptions;
}

/* *
 *
 *  Export
 *
 * */

export default StatesOptions;
