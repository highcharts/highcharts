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

import type DataGroupingOptions from
    '../../../Extensions/DataGrouping/DataGroupingOptions';
import type DataLabelOptions from '../../../Core/Series/DataLabelOptions';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type VBPIndicator from './VBPIndicator';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Volume By Price indicator.
 *
 * This series requires `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/volume-by-price
 *         Volume By Price indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/volume-by-price
 * @optionparent plotOptions.vbp
 * @interface Highcharts.VBPOptions
 */
export interface VBPOptions extends SMAOptions {
    animationLimit?: number;
    crisp?: boolean;
    dataGrouping?: DataGroupingOptions;
    dataLabels?: DataLabelOptions;
    enableMouseTracking?: boolean;
    params?: VBPParamsOptions;
    pointPadding?: number;
    volumeDivision?: VBPIndicator.VBPIndicatorStyleOptions;
    zIndex?: number;
    zoneLines?: VBPIndicator.VBPIndicatorStyleOptions;
}

export interface VBPParamsOptions extends SMAParamsOptions {
    /**
     * The number of price zones.
     *
     * @default 12
     */
    ranges: number;
    /**
     * The id of volume series which is mandatory. For example using
     * OHLC data, volumeSeriesID='volume' means the indicator will be
     * calculated using OHLC and volume values.
     *
     * @default volume
     */
    volumeSeriesID: string;

    /* *
     *
     *  Excluded
     *
     * */

    index?: undefined;
    period?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default VBPOptions;
