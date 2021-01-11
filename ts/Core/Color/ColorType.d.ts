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

import type ColorString from './ColorString';
import type GradientColor from './GradientColor';

/* *
 *
 *  Declarations
 *
 * */

export interface ColorLike {
    // nothing here yet
}

export type ColorType = ColorTypeRegistry[keyof ColorTypeRegistry];

export interface ColorTypeRegistry {
    ColorString: ColorString;
    GradientColor: GradientColor;
}

/* *
 *
 *  Export
 *
 * */

export default ColorType;
