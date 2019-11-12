/* *
 *
 *  (c) 2010-2019 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Chaikin Money Flow indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * @private
 */
declare global {
    namespace Highcharts {
        class CMFIndicator extends SMAIndicator {
            public data: Array<CMFIndicatorPoint>;
            public nameBase: string;
            public options: CMFIndicatorOptions;
            public pointClass: typeof CMFIndicatorPoint;
            public points: Array<CMFIndicatorPoint>;
            public volumeSeries: Series;
            public linkedParent: Series;
            public yData: Array<Array<number>>;
            public getMoneyFlow<TLinkedSeries extends Series>(
                xData: (Array<number>|undefined),
                seriesYData: (
                    Array<(number|null|undefined)>|
                    Array<Array<(number | null | undefined)>>|
                    undefined
                ),
                volumeSeriesYData: Array<number>,
                period: number
            ): IndicatorValuesObject<TLinkedSeries>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: CMFIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public isValid(): boolean;
        }

        interface CMFIndicatorOptions extends SMAIndicatorOptions {
            params?: CMFIndicatorParamsOptions;
        }

        interface CMFIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            volumeSeriesID?: string;
        }

        class CMFIndicatorPoint extends SMAIndicatorPoint {
            public series: CMFIndicator;
        }

        interface SeriesTypesDictionary {
            cmf: typeof CMFIndicator;
        }
    }
}

/**
 * The CMF series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cmf
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.CMFIndicator>('cmf', 'sma',
    /**
     * Chaikin Money Flow indicator (cmf).
     *
     * @sample stock/indicators/cmf/
     *         Chaikin Money Flow indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @excluding    animationLimit
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/cmf
     * @optionparent plotOptions.cmf
     */
    {
        params: {
            period: 14,
            /**
             * The id of another series to use its data as volume data for the
             * indiator calculation.
             */
            volumeSeriesID: 'volume'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Chaikin Money Flow',
        /**
         * Checks if the series and volumeSeries are accessible, number of
         * points.x is longer than period, is series has OHLC data
         * @private
         * @param {Highcharts.CMFIndicator} this indicator to use.
         * @return {boolean} True if series is valid and can be computed,
         * otherwise false.
         */
        isValid: function (this: Highcharts.CMFIndicator): boolean {
            var chart: Highcharts.Chart = this.chart,
                options: Highcharts.CMFIndicatorOptions = this.options,
                series = this.linkedParent,
                volumeSeries: Highcharts.Series = (
                    this.volumeSeries ||
                    (
                        this.volumeSeries =
                        chart.get((options.params as any).volumeSeriesID) as any
                    )
                ),
                isSeriesOHLC: (boolean|undefined) = (
                    series &&
                    series.yData &&
                    (series.yData as any)[0].length === 4
                );

            /**
             * @private
             * @param {Highcharts.Series} serie to check length validity on.
             * @return {boolean|undefined} true if length is valid.
             */
            function isLengthValid(
                serie: Highcharts.Series
            ): (boolean|undefined) {
                return serie.xData &&
                    serie.xData.length >= (options.params as any).period;
            }

            return !!(
                series &&
                volumeSeries &&
                isLengthValid(series) &&
                isLengthValid(volumeSeries) && isSeriesOHLC
            );
        },

        /**
         * Returns indicator's data.
         * @private
         * @param {Highcharts.CMFIndicator} this indicator to use.
         * @param {Highcharts.Series} series to calculate values from
         * @param {Highcharts.CMFIndicatorParamsOptions} params to pass
         * @return {boolean|Highcharts.IndicatorNullableValuesObject} Returns false if the
         * indicator is not valid, otherwise returns Values object.
         */
        getValues: function<
            TLinkedSeries extends Highcharts.Series
        > (
            this: Highcharts.CMFIndicator,
            series: TLinkedSeries,
            params: Highcharts.CMFIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            if (!this.isValid()) {
                return;
            }

            return this.getMoneyFlow<TLinkedSeries>(
                series.xData,
                series.yData,
                (this.volumeSeries.yData as any),
                (params.period as any)
            );
        },

        /**
         * @private
         * @param {Array<number>} xData - x timestamp values
         * @param {Array<number>} seriesYData - yData of basic series
         * @param {Array<number>} volumeSeriesYData - yData of volume series
         * @param {number} period - indicator's param
         * @return {Highcharts.IndicatorNullableValuesObject} object containing computed money
         * flow data
         */
        getMoneyFlow: function<TLinkedSeries extends Highcharts.Series> (
            xData: Array<number>,
            seriesYData: TLinkedSeries['yData'],
            volumeSeriesYData: Array<number>,
            period: number
        ): Highcharts.IndicatorValuesObject<TLinkedSeries> {
            var len: number = (seriesYData as any).length,
                moneyFlowVolume: Array<(number|null)> = [],
                sumVolume = 0,
                sumMoneyFlowVolume = 0,
                moneyFlowXData: Array<number> = [],
                moneyFlowYData: Array<(number|null)> = [],
                values: Array<Array<(number|null)>> = [],
                i: number,
                point: [number, (number|null)],
                nullIndex = -1;

            /**
             * Calculates money flow volume, changes i, nullIndex vars from
             * upper scope!
             * @private
             * @param {Array<number>} ohlc - OHLC point
             * @param {number} volume - Volume point's y value
             * @return {number|null} - volume * moneyFlowMultiplier
             **/
            function getMoneyFlowVolume(
                ohlc: Array<number>,
                volume: number
            ): (number|null) {
                var high: number = ohlc[1],
                    low: number = ohlc[2],
                    close: number = ohlc[3],

                    isValid: boolean =
                        volume !== null &&
                        high !== null &&
                        low !== null &&
                        close !== null &&
                        high !== low;


                /**
                 * @private
                 * @param {number} h - High value
                 * @param {number} l - Low value
                 * @param {number} c - Close value
                 * @return {number} calculated multiplier for the point
                 **/
                function getMoneyFlowMultiplier(
                    h: number,
                    l: number,
                    c: number
                ): number {
                    return ((c - l) - (h - c)) / (h - l);
                }

                return isValid ?
                    getMoneyFlowMultiplier(high, low, close) * volume :
                    ((nullIndex = i), null);
            }


            if (period > 0 && period <= len) {
                for (i = 0; i < period; i++) {
                    moneyFlowVolume[i] = getMoneyFlowVolume(
                        (seriesYData as any)[i],
                        volumeSeriesYData[i]
                    );
                    sumVolume += volumeSeriesYData[i];
                    sumMoneyFlowVolume += (moneyFlowVolume[i] as any);
                }

                moneyFlowXData.push(xData[i - 1]);
                moneyFlowYData.push(
                    i - nullIndex >= period && sumVolume !== 0 ?
                        sumMoneyFlowVolume / sumVolume :
                        null
                );
                values.push([moneyFlowXData[0], moneyFlowYData[0]]);

                for (; i < len; i++) {
                    moneyFlowVolume[i] = getMoneyFlowVolume(
                        (seriesYData as any)[i],
                        volumeSeriesYData[i]
                    );

                    sumVolume -= volumeSeriesYData[i - period];
                    sumVolume += volumeSeriesYData[i];

                    sumMoneyFlowVolume -= (moneyFlowVolume[i - period] as any);
                    sumMoneyFlowVolume += (moneyFlowVolume[i] as any);

                    point = [
                        xData[i],
                        i - nullIndex >= period ?
                            sumMoneyFlowVolume / sumVolume :
                            null
                    ];

                    moneyFlowXData.push(point[0]);
                    moneyFlowYData.push(point[1]);
                    values.push([point[0], point[1]]);
                }
            }

            return {
                values: values,
                xData: moneyFlowXData,
                yData: moneyFlowYData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    });

/**
 * A `CMF` series. If the [type](#series.cmf.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cmf
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/cmf
 * @apioption series.cmf
 */

''; // adds doclet above to the transpiled file
