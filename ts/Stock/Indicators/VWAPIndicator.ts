/* *
 *
 *  (c) 2010-2020 Paweł Dalek
 *
 *  Volume Weighted Average Price (VWAP) indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../../Core/Chart/Chart';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class VWAPIndicator extends SMAIndicator {
            public data: Array<VWAPIndicatorPoint>;
            public calculateVWAPValues<TLinkedSeries extends Series>(
                isOHLC: boolean,
                xValues: Array<number>,
                yValues: (
                    Array<number>|Array<[number, number, number, number]>
                ),
                volumeSeries: Series,
                period: number
            ): IndicatorValuesObject<TLinkedSeries>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: VWAPIndicatorParamsOptions,
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public options: VWAPIndicatorOptions;
            public pointClass: typeof VWAPIndicatorPoint;
            public points: Array<VWAPIndicatorPoint>;
        }

        interface VWAPIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            volumeSeriesID?: string;
        }

        class VWAPIndicatorPoint extends SMAIndicatorPoint {
            public series: VWAPIndicator;
        }

        interface VWAPIndicatorOptions extends SMAIndicatorOptions {
            params?: VWAPIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            vwap: typeof VWAPIndicator;
        }
    }
}

import U from '../../Core/Utilities.js';
const {
    error,
    isArray,
    seriesType
} = U;

/**
 * The Volume Weighted Average Price (VWAP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vwap
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.VWAPIndicator>('vwap', 'sma',
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
    {
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
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        /**
         * Returns the final values of the indicator ready to be presented on a
         * chart
         * @private
         * @param {Highcharts.VWAPIndicator} this indicator
         * @param {Highcharts.Series} series - series for indicator
         * @param {object} params - params
         * @return {object} - computed VWAP
         **/
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            this: Highcharts.VWAPIndicator,
            series: TLinkedSeries,
            params: Highcharts.VWAPIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var indicator = this,
                chart: Chart = series.chart,
                xValues: Array<number> = (series.xData as any),
                yValues: (
                    Array<number>|Array<[number, number, number, number]>
                ) = (series.yData as any),
                period: number = (params.period as any),
                isOHLC = true,
                volumeSeries: Highcharts.Series;

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
        },
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
        calculateVWAPValues: function <
            TLinkedSeries extends Highcharts.Series
        > (
            isOHLC: boolean,
            xValues: Array<number>,
            yValues: (Array<number>|Array<[number, number, number, number]>),
            volumeSeries: Highcharts.Series,
            period: number
        ): Highcharts.IndicatorValuesObject<TLinkedSeries> {
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
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    });

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
