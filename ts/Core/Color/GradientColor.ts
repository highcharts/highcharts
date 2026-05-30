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

import type Color from './Color';
import type ColorType from './ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface GradientColor {
    linearGradient?: LinearGradientColor;
    radialGradient?: RadialGradientColor;
    stops: Array<GradientColorStop>;
}

export interface GradientColorStop {
    0: number;
    1: ColorType;
    color?: Color;
}

export interface LinearGradientColor {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface RadialGradientColor {
    cx: number;
    cy: number;
    r: number;
}

/* *
 *
 *  Export
 *
 * */

export default GradientColor;
