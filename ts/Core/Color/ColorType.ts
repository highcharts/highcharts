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

import type ColorString from './ColorString';
import type GradientColor from './GradientColor';

/* *
 *
 *  Declarations
 *
 * */

export interface ColorBase {
    // Nothing here yet
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
