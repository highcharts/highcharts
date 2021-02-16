/* *
 *
 *  (c) 2010-2021 Paweł Dalek
 *
 *  Volume Weighted Average Price (VWAP) indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../../Core/Chart/Chart';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    VWAPOptions,
    VWAPParamsOptions
} from './VWAPOptions';
import type VWAPPoint from './VWAPPoint';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    error,
    isArray,
    merge
} = U;

/* *
 *
 * Class
 *
 * */

/**
 * The Volume Weighted Average Price (VWAP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vwap
 *
 * @augments Highcharts.Series
 */

class VWAPIndicator extends SMAIndicator {
    /**
     * Volume Weighted Average Price indicator.
     *
     * This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/vwap
     *         Volume Weighted Average Price indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/vwap
     * @optionparent plotOptions.vwap
     */
    public static defaultOptions: VWAPOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding index
         */
        params: {
            period: 30,
            /**
             * The id of volume series which is mandatory. For example using
             * OHLC data, volumeSeriesID='volume' means the indicator will be
             * calculated using OHLC and volume values.
             */
            volumeSeriesID: 'volume'
        }
    } as VWAPOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<VWAPPoint> = void 0 as any;
    public points: Array<VWAPPoint> = void 0 as any;
    public options: VWAPOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: VWAPParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var indicator = this,
            chart: Chart = series.chart,
            xValues: Array<number> = (series.xData as any),
            yValues: (
                Array<number>|Array<[number, number, number, number]>
            ) = (series.yData as any),
            period: number = (params.period as any),
            isOHLC = true,
            volumeSeries: TLinkedSeries;

        // Checks if volume series exists
        if (!(volumeSeries = (
            chart.get(params.volumeSeriesID as any)) as any
        )) {
            error(
                'Series ' +
                params.volumeSeriesID +
                ' not found! Check `volumeSeriesID`.',
                true,
                chart
            );
            return;
        }

        // Checks if series data fits the OHLC format
        if (!(isArray(yValues[0]))) {
            isOHLC = false;
        }

        return indicator.calculateVWAPValues(
            isOHLC,
            xValues,
            yValues,
            volumeSeries,
            period
        );
    }

    /**
     * Main algorithm used to calculate Volume Weighted Average Price (VWAP)
     * values
     * @private
     * @param {boolean} isOHLC - says if data has OHLC format
     * @param {Array<number>} xValues - array of timestamps
     * @param {Array<number|Array<number,number,number,number>>} yValues -
     * array of yValues, can be an array of a four arrays (OHLC) or array of
     * values (line)
     * @param {Array<*>} volumeSeries - volume series
     * @param {number} period - number of points to be calculated
     * @return {object} - Object contains computed VWAP
     **/
    public calculateVWAPValues<TLinkedSeries extends LineSeries>(
        isOHLC: boolean,
        xValues: Array<number>,
        yValues: (Array<number>|Array<[number, number, number, number]>),
        volumeSeries: TLinkedSeries,
        period: number
    ): IndicatorValuesObject<TLinkedSeries> {
        var volumeValues: Array<number> = (volumeSeries.yData as any),
            volumeLength: number = (volumeSeries.xData as any).length,
            pointsLength: number = xValues.length,
            cumulativePrice: Array<number> = [],
            cumulativeVolume: Array<number> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            VWAP: Array<Array<number>> = [],
            commonLength: number,
            typicalPrice: number,
            cPrice: number,
            cVolume: number,
            i: number,
            j: number;

        if (pointsLength <= volumeLength) {
            commonLength = pointsLength;
        } else {
            commonLength = volumeLength;
        }

        for (i = 0, j = 0; i < commonLength; i++) {
            // Depending on whether series is OHLC or line type, price is
            // average of the high, low and close or a simple value
            typicalPrice = isOHLC ?
                (((yValues[i] as any)[1] + (yValues[i] as any)[2] +
                (yValues[i] as any)[3]) / 3) :
                (yValues[i] as any);
            typicalPrice *= volumeValues[i];

            cPrice = j ?
                (cumulativePrice[i - 1] + typicalPrice) :
                typicalPrice;
            cVolume = j ?
                (cumulativeVolume[i - 1] + volumeValues[i]) :
                volumeValues[i];

            cumulativePrice.push(cPrice);
            cumulativeVolume.push(cVolume);

            VWAP.push([xValues[i], (cPrice / cVolume)]);
            xData.push(VWAP[i][0]);
            yData.push(VWAP[i][1]);

            j++;

            if (j === period) {
                j = 0;
            }
        }

        return {
            values: VWAP,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface VWAPIndicator {
    pointClass: typeof VWAPPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        vwap: typeof VWAPIndicator;
    }
}

SeriesRegistry.registerSeriesType('vwap', VWAPIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default VWAPIndicator;

/**
 * A `Volume Weighted Average Price (VWAP)` series. If the
 * [type](#series.vwap.type) option is not specified, it is inherited from
 * [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.vwap
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/vwap
 * @apioption series.vwap
 */

''; // to include the above in the js output
