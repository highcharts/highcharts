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
