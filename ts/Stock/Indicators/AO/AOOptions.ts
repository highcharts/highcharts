/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

/* *
 *
 *  Imports
 *
 * */

import type AOIndicator from './AOIndicator';
import type ColorString from '../../../Core/Color/ColorString';
import type { SeriesStatesOptions } from '../../../Core/Series/SeriesOptions';
import type {
    SMAOptions
} from '../SMA/SMAOptions';

/* *
*
*  Declarations
*
* */

/**
 * Options for the Awesome Oscillator indicator.
 *
 * @interface Highcharts.AOOptions
 * @extends Highcharts.SMAOptions
 */
export interface AOOptions extends SMAOptions {
    /**
     * Color of the Awesome oscillator series bar that is greater than the
     * previous one. Note that if a `color` is defined, the `color` takes
     * precedence and the `greaterBarColor` is ignored.
     */
    greaterBarColor?: ColorString;

    /**
     * Padding between each column or bar, in x axis units.
     */
    groupPadding?: number;

    /**
     * Color of the Awesome oscillator series bar that is lower than the
     * previous one. Note that if a `color` is defined, the `color` takes
     * precedence and the `lowerBarColor` is ignored.
     */
    lowerBarColor?: ColorString;

    /**
     * Padding between each column value, in x axis units.
     */
    pointPadding?: number;

    states?: SeriesStatesOptions<AOIndicator>;

    /**
     * The threshold value that determines whether the bar is seen as positive
     * or negative.
     */
    threshold?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AOOptions;
