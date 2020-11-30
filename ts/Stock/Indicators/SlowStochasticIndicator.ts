/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    StochasticOptions,
    StochasticParamsOptions
} from './Stochastic/StochasticOptions';
import type StochasticPoint from './Stochastic/StochasticPoint';
import type IndicatorValuesObject from './IndicatorValuesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        stochastic: StochasticIndicator
    }
} = BaseSeries;
const { seriesTypes } = BaseSeries;
import RequiredIndicatorMixin from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    isArray,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {

        interface SlowStochasticIndicatorParamsOptions
            extends StochasticParamsOptions {
            // for inheritance
        }

        class SlowStochasticIndicatorPoint extends StochasticPoint {
            public series: SlowStochasticIndicator;
        }

        interface SlowStochasticIndicatorOptions
            extends StochasticOptions, MultipleLinesIndicatorOptions {
            params?: SlowStochasticIndicatorParamsOptions;
        }
    }
}

/**
 * The Slow Stochastic series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.slowstochastic
 *
 * @augments Highcharts.Series
 */
class SlowStochasticIndicator extends StochasticIndicator {
    /**
     * Slow Stochastic oscillator. This series requires the `linkedTo` option
     * to be set and should be loaded after `stock/indicators/indicators.js`
     * and `stock/indicators/stochastic.js` files.
     *
     * @sample stock/indicators/slow-stochastic
     *         Slow Stochastic oscillator
     *
     * @extends      plotOptions.stochastic
     * @since        8.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/stochastic
     * @requires     stock/indicators/slowstochastic
     * @optionparent plotOptions.slowstochastic
     */
    public static defaultOptions: Highcharts.SlowStochasticIndicatorOptions =
    merge(StochasticIndicator.defaultOptions, {
        params: {
            /**
             * Periods for Slow Stochastic oscillator: [%K, %D, SMA(%D)].
             *
             * @type    {Array<number,number,number>}
             * @default [14, 3, 3]
             */
            periods: [14, 3, 3]
        }
    } as Highcharts.SlowStochasticIndicatorOptions)

    public init(): void {
        const args = arguments,
            ctx = this;

        RequiredIndicatorMixin.isParentLoaded(
            (seriesTypes.stochastic as any),
            'stochastic',
            ctx.type,
            function (indicator: Highcharts.Indicator): undefined {
                indicator.prototype.init.apply(ctx, args);
                return;
            }
        );
    }

    public getValues <TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: Highcharts.SlowStochasticIndicatorParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const periods: Array<number> = (params.periods as any),
            fastValues = seriesTypes.stochastic.prototype.getValues.call(
                this,
                series,
                params
            ) as any,
            slowValues = {
                values: [] as Array<Array<number>>,
                xData: [] as Array<number>,
                yData: [] as Array<Array<number>>
            };

        let i = 0;

        if (!fastValues) {
            return;
        }

        slowValues.xData = fastValues.xData.slice(periods[1] - 1);
        const fastYData = fastValues.yData.slice(periods[1] - 1);

        // Get SMA(%D)
        const smoothedValues: (
            undefined|IndicatorValuesObject<LineSeries>
        ) = seriesTypes.sma.prototype.getValues.call(
            this,
            ({
                xData: slowValues.xData,
                yData: fastYData
            } as any),
            {
                index: 1,
                period: periods[2]
            }
        );

        if (!smoothedValues) {
            return;
        }

        const xDataLen = slowValues.xData.length;

        // Format data
        for (; i < xDataLen; i++) {

            slowValues.yData[i] = [
                fastYData[i][1],
                smoothedValues.yData[i - periods[2] + 1] || null
            ];

            slowValues.values[i] = [
                slowValues.xData[i],
                fastYData[i][1],
                smoothedValues.yData[i - periods[2] + 1] || null
            ];
        }

        return slowValues as
            IndicatorValuesObject<TLinkedSeries>;
    }
}

interface SlowStochasticIndicator {
    nameBase: string;
}
extend(SlowStochasticIndicator.prototype, {
    nameBase: 'Slow Stochastic'
});

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        slowstochastic: typeof SlowStochasticIndicator;
    }
}

BaseSeries.registerSeriesType('slowstochastic', SlowStochasticIndicator);

/* *
 *
 *  Default Export
 *
 * */


export default SlowStochasticIndicator;
/**
 * A Slow Stochastic indicator. If the [type](#series.slowstochastic.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.slowstochastic
 * @since     8.0.0
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/stochastic
 * @requires  stock/indicators/slowstochastic
 * @apioption series.slowstochastic
 */

''; // to include the above in the js output
