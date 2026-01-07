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

import type SVGAttributes from './SVGAttributes';
import type CSSObject from '../CSSObject';

/* *
 *
 *  Declarations
 *
 * */

export interface ButtonThemeObject extends SVGAttributes {
    states?: ButtonThemeStatesObject;
    style?: CSSObject;
}

export interface ButtonThemeStatesObject {
    disabled?: SVGAttributes;
    hover?: SVGAttributes;
    select?: SVGAttributes;
}

/* *
 *
 *  Default Export
 *
 * */

export default ButtonThemeObject;
