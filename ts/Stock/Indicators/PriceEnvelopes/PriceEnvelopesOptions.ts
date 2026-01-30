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

import type CSSObject from '../../../Core/Renderer/CSSObject';
import type ColorType from '../../../Core/Color/ColorType';
import type MultipleLinesComposition from '../MultipleLinesComposition';
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
 * Price envelopes indicator based on [SMA](#plotOptions.sma) calculations.
 * This series requires the `linkedTo` option to be set and should be loaded
 * after the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/price-envelopes
 *         Price envelopes
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-envelopes
 * @optionparent plotOptions.priceenvelopes
 * @interface Highcharts.PriceEnvelopesOptions
 */
export interface PriceEnvelopesOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    /**
     * Option for fill color between lines in Price Envelopes Indicator.
     *
     * @sample {highstock} stock/indicators/indicator-area-fill
     *      Background fill between lines.
     *
     * @type {Highcharts.Color}
     * @since 11.0.0
     * @apioption plotOptions.priceenvelopes.fillColor
     */
    fillColor?: ColorType;
    bottomLine?: Record<string, CSSObject>;
    params?: PriceEnvelopesParamsOptions;
    topLine?: Record<string, CSSObject>;
}

export interface PriceEnvelopesParamsOptions extends SMAParamsOptions {
    /**
     * Percentage above the moving average that should be displayed.
     * 0.1 means 110%. Relative to the calculated value.
     */
    topBand: number;
    /**
     * Percentage below the moving average that should be displayed.
     * 0.1 means 90%. Relative to the calculated value.
     */
    bottomBand: number;
    period: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PriceEnvelopesOptions;
