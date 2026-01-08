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
    /**
     * The default fill exists only to capture hover events.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default #ffffff
     */
    fill?: SVGAttributes['fill'];

    /**
     * Padding for the button.
     *
     * @default 5
     */
    padding?: SVGAttributes['padding'];

    /**
     * Default stroke for the buttons.
     *
     * @type {Highcharts.ColorString}
     * @default none
     */
    stroke?: SVGAttributes['stroke'];

    /**
     * Default stroke linecap for the buttons.
     *
     * @default round
     */
    'stroke-linecap'?: SVGAttributes['stroke-linecap'];

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
