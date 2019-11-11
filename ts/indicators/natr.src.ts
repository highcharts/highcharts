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
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: NATRIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
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
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.NATRIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var atrData: (
                    Highcharts.IndicatorValuesObject<Highcharts.Series>|
                    undefined
                ) = (
                    ATR.prototype.getValues.apply(this, arguments)
                ),
                atrLength: number = (atrData as any).values.length,
                period: number = (params.period as any) - 1,
                yVal: Array<Array<number>> = (series.yData as any),
                i = 0;

            if (!atrData) {
                return;
            }

            for (; i < atrLength; i++) {
                atrData.yData[i] = (
                    (atrData.values as any)[i][1] / yVal[period][3] * 100
                );
                atrData.values[i][1] = atrData.yData[i];
                period++;
            }

            return atrData as Highcharts.IndicatorValuesObject<TLinkedSeries>;
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
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/natr
 * @apioption series.natr
 */

''; // to include the above in the js output'
