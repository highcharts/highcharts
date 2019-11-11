/* *
 *
 *  Money Flow Index indicator for Highstock
 *
 *  (c) 2010-2019 Grzegorz Blachliński
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class MFIIndicator extends SMAIndicator {
            public data: Array<MFIIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: MFIIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public nameBase: string;
            public options: MFIIndicatorOptions;
            public pointClass: typeof MFIIndicatorPoint;
            public points: Array<MFIIndicatorPoint>;
        }

        interface MFIIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            volumeSeriesID?: string;
            decimals?: number;
        }

        class MFIIndicatorPoint extends SMAIndicatorPoint {
            public series: MFIIndicator;
        }

        interface MFIIndicatorOptions extends SMAIndicatorOptions {
            params?: MFIIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            mfi: typeof MFIIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

/* eslint-disable require-jsdoc */

// Utils:
function sumArray(array: Array<number>): number {

    return array.reduce(function (prev: number, cur: number): number {
        return prev + cur;
    });
}

function toFixed(a: number, n: number): number {
    return parseFloat(a.toFixed(n));
}

function calculateTypicalPrice(point: Array<number>): number {
    return (point[1] + point[2] + point[3]) / 3;
}

function calculateRawMoneyFlow(typicalPrice: number, volume: number): number {
    return typicalPrice * volume;
}

/* eslint-enable require-jsdoc */

/**
 * The MFI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.mfi
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.MFIIndicator>(
    'mfi',
    'sma',
    /**
     * Money Flow Index. This series requires `linkedTo` option to be set and
     * should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/mfi
     *         Money Flow Index Indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/mfi
     * @optionparent plotOptions.mfi
     */
    {
        /**
         * @excluding index
         */
        params: {
            period: 14,
            /**
             * The id of volume series which is mandatory.
             * For example using OHLC data, volumeSeriesID='volume' means
             * the indicator will be calculated using OHLC and volume values.
             */
            volumeSeriesID: 'volume',
            /**
             * Number of maximum decimals that are used in MFI calculations.
             */
            decimals: 4

        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Money Flow Index',
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.MFIIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                decimals: number = (params.decimals as any),
                // MFI starts calculations from the second point
                // Cause we need to calculate change between two points
                range = 1,
                volumeSeries: (Highcharts.Series|undefined) = (
                    series.chart.get((params.volumeSeriesID as any)) as any
                ),
                yValVolume: Array<number> = (
                    volumeSeries && (volumeSeries.yData as any)
                ),
                MFI: Array<Array<number>> = [],
                isUp = false,
                xData: Array<number> = [],
                yData: Array<number> = [],
                positiveMoneyFlow: Array<number> = [],
                negativeMoneyFlow: Array<number> = [],
                newTypicalPrice: number,
                oldTypicalPrice: number,
                rawMoneyFlow: number,
                negativeMoneyFlowSum: number,
                positiveMoneyFlowSum: number,
                moneyFlowRatio: number,
                MFIPoint: number,
                i: number;

            if (!volumeSeries) {
                H.error(
                    'Series ' +
                    params.volumeSeriesID +
                    ' not found! Check `volumeSeriesID`.',
                    true,
                    series.chart
                );
                return;
            }

            // MFI requires high low and close values
            if (
                (xVal.length <= period) || !isArray(yVal[0]) ||
                yVal[0].length !== 4 ||
                !yValVolume
            ) {
                return;
            }
            // Calculate first typical price
            newTypicalPrice = calculateTypicalPrice(yVal[range]);
            // Accumulate first N-points
            while (range < period + 1) {
                // Calculate if up or down
                oldTypicalPrice = newTypicalPrice;
                newTypicalPrice = calculateTypicalPrice(yVal[range]);
                isUp = newTypicalPrice >= oldTypicalPrice;
                // Calculate raw money flow
                rawMoneyFlow = calculateRawMoneyFlow(
                    newTypicalPrice,
                    yValVolume[range]
                );
                // Add to array
                positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
                negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
                range++;
            }
            for (i = range - 1; i < yValLen; i++) {
                if (i > range - 1) {
                    // Remove first point from array
                    positiveMoneyFlow.shift();
                    negativeMoneyFlow.shift();
                    // Calculate if up or down
                    oldTypicalPrice = newTypicalPrice;
                    newTypicalPrice = calculateTypicalPrice(yVal[i]);
                    isUp = newTypicalPrice > oldTypicalPrice;
                    // Calculate raw money flow
                    rawMoneyFlow = calculateRawMoneyFlow(
                        newTypicalPrice,
                        yValVolume[i]
                    );
                    // Add to array
                    positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
                    negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
                }

                // Calculate sum of negative and positive money flow:
                negativeMoneyFlowSum = sumArray(negativeMoneyFlow);
                positiveMoneyFlowSum = sumArray(positiveMoneyFlow);

                moneyFlowRatio = positiveMoneyFlowSum / negativeMoneyFlowSum;
                MFIPoint = toFixed(
                    100 - (100 / (1 + moneyFlowRatio)),
                    decimals
                );
                MFI.push([xVal[i], MFIPoint]);
                xData.push(xVal[i]);
                yData.push(MFIPoint);
            }

            return {
                values: MFI,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `MFI` series. If the [type](#series.mfi.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.mfi
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/mfi
 * @apioption series.mfi
 */

''; // to include the above in the js output
