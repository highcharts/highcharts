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

import type SVGAttributes from 'SVGAttributes';
import CSSObject from '../CSSObject';

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
 *  Export
 *
 * */

export default ButtonThemeObject;
