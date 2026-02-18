/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

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
 * Awesome Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`
 *
 * @sample {highstock} stock/indicators/ao
 *         Awesome
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               params, pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ao
 * @interface Highcharts.AOOptions
 */
export interface AOOptions extends SMAOptions {
    /**
     * Color of the Awesome oscillator series bar that is greater than the
     * previous one. Note that if a `color` is defined, the `color`
     * takes precedence and the `greaterBarColor` is ignored.
     *
     * @sample {highstock} stock/indicators/ao/
     *         greaterBarColor
     *
     * @since 7.0.0
     */
    greaterBarColor?: ColorString;

    /**
     * Color of the Awesome oscillator series bar that is lower than the
     * previous one. Note that if a `color` is defined, the `color`
     * takes precedence and the `lowerBarColor` is ignored.
     *
     * @sample {highstock} stock/indicators/ao/
     *         lowerBarColor
     *
     * @since 7.0.0
     */
    lowerBarColor?: ColorString;

    threshold?: number;

    groupPadding?: number;

    pointPadding?: number;

    states?: SeriesStatesOptions<AOOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AOOptions;
