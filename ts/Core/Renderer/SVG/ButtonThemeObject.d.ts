/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
