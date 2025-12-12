/* *
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

import CSSObject from '../../../Core/Renderer/CSSObject';
import type DataGroupingOptions from '../../../Extensions/DataGrouping/DataGroupingOptions';
import type TooltipOptions from '../../../Core/TooltipOptions';
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
 * Klinger oscillator. This series requires the `linkedTo` option to be set
 * and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/klinger
 *         Klinger oscillator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/klinger
 * @optionparent plotOptions.klinger
 * @interface Highcharts.KlingerOptions
 */
export interface KlingerOptions extends SMAOptions {
    /**
     * Parameters used in calculation of Klinger Oscillator.
     *
     * @excluding index, period
     */
    params?: KlingerParamsOptions;

    signalLine?: Record<string, CSSObject>;

    dataGrouping?: DataGroupingOptions;

    tooltip?: Partial<TooltipOptions>;
}

export interface KlingerParamsOptions extends SMAParamsOptions {
    /**
     * The fast period for indicator calculations.
     */
    fastAvgPeriod: number;

    /**
     * The slow period for indicator calculations.
     */
    slowAvgPeriod: number;

    /**
     * The base period for signal calculations.
     */
    signalPeriod: number;

    /**
     * The id of another series to use its data as volume data for the
     * indiator calculation.
     */
    volumeSeriesID?: string;
}

export default KlingerOptions;
