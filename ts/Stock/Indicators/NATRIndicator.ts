/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from './IndicatorValuesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import type SMAIndicator from './SMA/SMAIndicator';
import type {
    SMAOptions,
    SMAParamsOptions
} from './SMA/SMAOptions';
import type SMAPoint from './SMA/SMAPoint';
import BaseSeries from '../../Core/Series/Series.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class NATRIndicator extends SMAIndicator {
            public data: Array<NATRIndicatorPoint>;
            public getValues<TLinkedSeries extends LineSeries>(
                series: TLinkedSeries,
                params: NATRIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public options: NATRIndicatorOptions;
            public pointClass: typeof NATRIndicatorPoint;
            public points: Array<NATRIndicatorPoint>;
        }

        interface NATRIndicatorParamsOptions extends SMAParamsOptions {
            // for inheritance
        }

        class NATRIndicatorPoint extends SMAPoint {
            public series: NATRIndicator;
        }

        interface NATRIndicatorOptions extends SMAOptions {
            params?: NATRIndicatorParamsOptions;
            tooltip?: TooltipOptions;
        }
    }
}

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        natr: typeof Highcharts.NATRIndicator;
    }
}

// im port './ATRIndicator.js';

var ATR = BaseSeries.seriesTypes.atr;

/**
 * The NATR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.natr
 *
 * @augments Highcharts.Series
 */
BaseSeries.seriesType<typeof Highcharts.NATRIndicator>('natr', 'sma',
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
        getValues: function<TLinkedSeries extends LineSeries> (
            series: TLinkedSeries,
            params: Highcharts.NATRIndicatorParamsOptions
        ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
            var atrData: (
                    IndicatorValuesObject<LineSeries>|
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

            return atrData as IndicatorValuesObject<TLinkedSeries>;
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
