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

import type ColorType from '../../../Core/Color/ColorType';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Keltner Channels. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js`,
 * `stock/indicators/atr.js`, and `stock/ema/.js`.
 *
 * @sample {highstock} stock/indicators/keltner-channels
 *         Keltner Channels
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart,showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/keltner-channels
 * @interface Highcharts.KeltnerChannelsOptions
 */
export interface KeltnerChannelsOptions extends SMAOptions {
    /**
     * Option for fill color between lines in Keltner Channels Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @since 9.3.2
     */
    fillColor?: ColorType;

    params?: KeltnerChannelsParamsOptions;

    /**
     * Bottom line options.
     */
    bottomLine?: Record<string, CSSObject>;

    /**
     * Top line options.
     *
     * @extends plotOptions.keltnerchannels.bottomLine
     */
    topLine?: Record<string, CSSObject>;
}

export interface KeltnerChannelsParamsOptions extends SMAParamsOptions {
    /**
     * The point index which indicator calculations will base. For
     * example using OHLC data, index=2 means the indicator will be
     * calculated using Low values.
     */
    index?: number;

    /**
     * The ATR period.
     */
    periodATR: number;

    /**
     * The ATR multiplier.
     */
    multiplierATR: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default KeltnerChannelsOptions;
