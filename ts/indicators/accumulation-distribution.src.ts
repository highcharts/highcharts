/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class ADIndicator extends SMAIndicator {
            public data: Array<ADIndicatorPoint>;
            public nameBase: string;
            public nameComponents: Array<string>;
            public options: ADIndicatorOptions;
            public pointClass: typeof ADIndicatorPoint;
            public points: Array<ADIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: ADIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
        }

        class ADIndicatorPoint extends SMAIndicatorPoint {
            public series: ADIndicator
        }

        interface ADIndicatorOptions extends SMAIndicatorOptions {
            params?: ADIndicatorParamsOptions;
        }

        interface ADIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            volumeSeriesID?: string;
        }

        interface SeriesTypesDictionary {
            ad: typeof ADIndicator;
        }
    }
}

import '../parts/Utilities.js';

var seriesType = H.seriesType;

/* eslint-disable valid-jsdoc */
// Utils:
/**
 * @private
 */
function populateAverage(
    xVal: Array<number>,
    yVal: Array<Array<number>>,
    yValVolume: Array<number>,
    i: number
): Array<number> {
    var high = yVal[i][1],
        low = yVal[i][2],
        close = yVal[i][3],
        volume = yValVolume[i],
        adY = close === high && close === low || high === low ?
            0 :
            ((2 * close - low - high) / (high - low)) * volume,
        adX = xVal[i];

    return [adX, adY];
}
/* eslint-enable valid-jsdoc */

/**
 * The AD series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ad
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.ADIndicator>('ad', 'sma',
    /**
     * Accumulation Distribution (AD). This series requires `linkedTo` option to
     * be set.
     *
     * @sample stock/indicators/accumulation-distribution
     *         Accumulation/Distribution indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/accumulation-distribution
     * @optionparent plotOptions.ad
     */
    {
        params: {
            /**
             * The id of volume series which is mandatory.
             * For example using OHLC data, volumeSeriesID='volume' means
             * the indicator will be calculated using OHLC and volume values.
             *
             * @since 6.0.0
             */
            volumeSeriesID: 'volume'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameComponents: (false as any),
        nameBase: 'Accumulation/Distribution',
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.ADIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<(number|null|undefined)> = (series.yData as any),
                volumeSeriesID: string = (params.volumeSeriesID as any),
                volumeSeries: Highcharts.Series =
                    (series.chart.get(volumeSeriesID) as any),
                yValVolume = volumeSeries && volumeSeries.yData,
                yValLen = yVal ? yVal.length : 0,
                AD: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                len: (number|undefined),
                i: (number|undefined),
                ADPoint: Array<number>;

            if (
                xVal.length <= period &&
                yValLen &&
                (yVal[0] as any).length !== 4
            ) {
                return;
            }

            if (!volumeSeries) {
                H.error(
                    'Series ' +
                    volumeSeriesID +
                    ' not found! Check `volumeSeriesID`.',
                    true,
                    series.chart
                );
                return;
            }

            // i = period <-- skip first N-points
            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen; i++) {

                len = AD.length;
                ADPoint = (populateAverage as any)(
                    xVal, yVal, yValVolume, i, period
                );

                if (len > 0) {
                    ADPoint[1] += AD[len - 1][1];
                }

                AD.push(ADPoint);

                xData.push(ADPoint[0]);
                yData.push(ADPoint[1]);
            }

            return {
                values: AD,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    });

/**
 * A `AD` series. If the [type](#series.ad.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ad
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/accumulation-distribution
 * @apioption series.ad
 */

''; // add doclet above to transpiled file
