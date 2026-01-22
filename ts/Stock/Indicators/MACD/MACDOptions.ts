/* *
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

import type ColorString from '../../../Core/Color/ColorString';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type {
    SeriesStatesOptions,
    SeriesZonesOptions
} from '../../../Core/Series/SeriesOptions';

/* *
*
*  Declarations
*
* */

export interface MACDGappedExtensionObject {
    options?: MACDGappedExtensionOptions;
}

export interface MACDGappedExtensionOptions {
    gapSize?: number;
}

/**
 * Moving Average Convergence Divergence (MACD). This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/macd
 *         MACD indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/macd
 * @optionparent plotOptions.macd
 * @interface Highcharts.MACDOptions
 */
export interface MACDOptions extends SMAOptions {
    params?: MACDParamsOptions;
    states?: SeriesStatesOptions<MACDOptions>;
    threshold?: number;
    groupPadding?: number;
    pointPadding?: number;
    minPointLength?: number;
    /**
     * The styles for signal line
     */
    signalLine?: MACDLineOptions;
    /**
     * The styles for macd line
     */
    macdLine?: MACDLineOptions;
}

export interface MACDParamsOptions extends SMAParamsOptions {
    period?: number;
    /**
     * The short period for indicator calculations.
     */
    shortPeriod?: number;
    /**
     * The long period for indicator calculations.
     */
    longPeriod?: number;
    /**
     * The base period for signal calculations.
     */
    signalPeriod?: number;
}

export interface MACDLineOptions {
    /**
     * @sample {highstock} stock/indicators/macd-zones
     *         Zones in MACD
     *
     * @extends plotOptions.macd.zones
     */
    zones?: Array<SeriesZonesOptions>;
    styles?: MACDLineStyleOptions;
}

export interface MACDLineStyleOptions extends CSSObject {
    /**
     * Pixel width of the line.
     */
    lineWidth?: number;
    /**
     * Color of the line.
     *
     * @type  {Highcharts.ColorString}
     */
    lineColor?: ColorString;
}

/* *
*
*  Default Export
*
* */

export default MACDOptions;
