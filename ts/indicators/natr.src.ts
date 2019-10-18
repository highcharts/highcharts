/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class NATRIndicator extends SMAIndicator {
            public data: Array<NATRIndicatorPoint>;
            public getValues(
                series: Series,
                params: NATRIndicatorParamsOptions
            ): IndicatorValuesObject;
            public options: NATRIndicatorOptions;
            public pointClass: typeof NATRIndicatorPoint;
            public points: Array<NATRIndicatorPoint>;
        }

        interface NATRIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class NATRIndicatorPoint extends SMAIndicatorPoint {
            public series: NATRIndicator;
        }

        interface NATRIndicatorOptions extends SMAIndicatorOptions {
            params?: NATRIndicatorParamsOptions;
            tooltip?: TooltipOptions;
        }

        interface SeriesTypesDictionary {
            natr: typeof NATRIndicator;
        }
    }
}

var ATR = H.seriesTypes.atr;

/**
 * The NATR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.natr
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.NATRIndicator>('natr', 'sma',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js` and `stock/indicators/atr.js`.
     *
     * @sample {highstock} stock/indicators/natr
     *         NATR indicator
     *
     * @extends      plotOptions.atr
     * @since        7.0.0
     * @product      highstock
     * @requires     modules/stock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/natr
     * @optionparent plotOptions.natr
     */
    {
        tooltip: {
            valueSuffix: '%'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        requiredIndicators: ['atr'],
        getValues: function (
            series: Highcharts.Series,
            params: Highcharts.NATRIndicatorParamsOptions
        ): Highcharts.IndicatorValuesObject {
            var atrData: Highcharts.IndicatorValuesObject = (
                    (ATR.prototype.getValues.apply(this, arguments) as any)
                ),
                atrLength: number = atrData.values.length,
                period: number = (params.period as any) - 1,
                yVal: Array<Array<number>> = (series.yData as any),
                i = 0;

            for (; i < atrLength; i++) {
                atrData.yData[i] = atrData.values[i][1] / yVal[period][3] * 100;
                atrData.values[i][1] = atrData.yData[i];
                period++;
            }

            return atrData;
        }

    });

/**
 * A `NATR` series. If the [type](#series.natr.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.natr
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  modules/stock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/natr
 * @apioption series.natr
 */

''; // to include the above in the js output'
