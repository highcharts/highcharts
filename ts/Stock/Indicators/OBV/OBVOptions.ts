/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * On-Balance Volume (OBV) technical indicator. This series
 * requires the `linkedTo` option to be set and should be loaded after
 * the `stock/indicators/indicators.js` file. Through the `volumeSeriesID`
 * there also should be linked the volume series.
 *
 * @sample {highstock} stock/indicators/obv
 *         OBV indicator
 *
 * @extends      plotOptions.sma
 * @since        9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/obv
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @optionparent plotOptions.obv
 * @interface Highcharts.OBVOptions
 */
export interface OBVOptions extends SMAOptions {
    marker?: PointMarkerOptions;
    /**
     * @excluding index, period
     */
    params?: OBVParamsOptions;
}

export interface OBVParamsOptions extends SMAParamsOptions {
    index?: undefined;
    period?: undefined;
    /**
     * The id of another series to use its data as volume data for the
     * indicator calculation.
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default OBVOptions;
