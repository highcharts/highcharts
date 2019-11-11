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
        class MomentumIndicator extends SMAIndicator {
            public data: Array<MomentumIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: MomentumIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public nameBase: string;
            public options: MomentumIndicatorOptions;
            public pointClass: typeof MomentumIndicatorPoint;
            public points: Array<MomentumIndicatorPoint>;
        }

        interface MomentumIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class MomentumIndicatorPoint extends SMAIndicatorPoint {
            public series: MomentumIndicator;
        }

        interface MomentumIndicatorOptions extends SMAIndicatorOptions {
            params?: MomentumIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            momentum: typeof MomentumIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

var seriesType = H.seriesType;

/* eslint-disable require-jsdoc */

function populateAverage(
    points: Array<number>,
    xVal: Array<number>,
    yVal: Array<Array<number>>,
    i: number,
    period: number
): [number, number] {
    var mmY: number = yVal[i - 1][3] - yVal[i - period - 1][3],
        mmX: number = xVal[i - 1];

    points.shift(); // remove point until range < period

    return [mmX, mmY];
}

/* eslint-enable require-jsdoc */

/**
 * The Momentum series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.momentum
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.MomentumIndicator>(
    'momentum',
    'sma',
    /**
     * Momentum. This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/momentum
     *         Momentum indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/momentum
     * @optionparent plotOptions.momentum
     */
    {
        params: {
            period: 14
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Momentum',
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.MomentumIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                xValue: number = xVal[0],
                yValue: (Array<number>|number) = yVal[0],
                MM: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                index: any,
                i: number,
                points: Array<Array<number>>,
                MMPoint: [number, number];

            if (xVal.length <= period) {
                return;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                yValue = (yVal[0][3] as any);
            } else {
                return;
            }
            // Starting point
            points = [
                [xValue, (yValue as any)]
            ];


            // Calculate value one-by-one for each period in visible data
            for (i = (period + 1); i < yValLen; i++) {
                MMPoint = (populateAverage as any)(
                    points, xVal, yVal, i, period, index
                );
                MM.push(MMPoint);
                xData.push(MMPoint[0]);
                yData.push(MMPoint[1]);
            }

            MMPoint = (populateAverage as any)(
                points, xVal, yVal, i, period, index
            );
            MM.push(MMPoint);
            xData.push(MMPoint[0]);
            yData.push(MMPoint[1]);

            return {
                values: MM,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `Momentum` series. If the [type](#series.momentum.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.momentum
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/momentum
 * @apioption series.momentum
 */

''; // to include the above in the js output
