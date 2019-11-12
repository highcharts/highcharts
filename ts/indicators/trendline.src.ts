/* *
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
        class TrendLineIndicator extends SMAIndicator {
            public data: Array<TrendLineIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: TrendLineIndicatorParamsOptions
            ): IndicatorValuesObject<TLinkedSeries>;
            public nameBase: string;
            public options: TrendLineIndicatorOptions;
            public pointClass: typeof TrendLineIndicatorPoint;
            public points: Array<TrendLineIndicatorPoint>;
        }

        interface TrendLineIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class TrendLineIndicatorPoint extends SMAIndicatorPoint {
            public series: TrendLineIndicator;
        }

        interface TrendLineIndicatorOptions extends SMAIndicatorOptions {
            params?: TrendLineIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            trendline: typeof TrendLineIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

var seriesType = H.seriesType;

/**
 * The Trend line series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trendline
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.TrendLineIndicator>(
    'trendline',
    'sma',
    /**
     * Trendline (linear regression) fits a straight line to the selected data
     * using a method called the Sum Of Least Squares. This series requires the
     * `linkedTo` option to be set.
     *
     * @sample stock/indicators/trendline
     *         Trendline indicator
     *
     * @extends      plotOptions.sma
     * @since        7.1.3
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/trendline
     * @optionparent plotOptions.trendline
     */
    {
        /**
         * @excluding period
         */
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             *
             * @default 3
             */
            index: 3
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Trendline',
        nameComponents: (false as any),
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.TrendLineIndicatorParamsOptions
        ): Highcharts.IndicatorValuesObject<TLinkedSeries> {
            var xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                LR: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                sumX = 0,
                sumY = 0,
                sumXY = 0,
                sumX2 = 0,
                xValLength: number = xVal.length,
                index: number = (params.index as any),
                alpha: number,
                beta: number,
                i: number,
                x: number,
                y: number;

            // Get sums:
            for (i = 0; i < xValLength; i++) {
                x = xVal[i];
                y = isArray(yVal[i]) ? yVal[i][index] : (yVal[i] as any);
                sumX += x;
                sumY += y;
                sumXY += x * y;
                sumX2 += x * x;
            }

            // Get slope and offset:
            alpha = (xValLength * sumXY - sumX * sumY) /
                (xValLength * sumX2 - sumX * sumX);

            if (isNaN(alpha)) {
                alpha = 0;
            }

            beta = (sumY - alpha * sumX) / xValLength;

            // Calculate linear regression:
            for (i = 0; i < xValLength; i++) {
                x = xVal[i];
                y = alpha * x + beta;

                // Prepare arrays required for getValues() method
                LR[i] = [x, y];
                xData[i] = x;
                yData[i] = y;
            }

            return {
                xData: xData,
                yData: yData,
                values: LR
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `TrendLine` series. If the [type](#series.trendline.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.trendline
 * @since     7.1.3
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/trendline
 * @apioption series.trendline
 */

''; // to include the above in the js output
