/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type {
    NATROptions,
    NATRParamsOptions
} from './NATROptions';
import type NATRPoint from './NATRPoint';
import type Series from '../../../Core/Series/Series';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        atr: ATRIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    merge,
    extend
} = U;
/**
 * The NATR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.natr
 *
 * @augments Highcharts.Series
 */

class NATRIndicator extends ATRIndicator {
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
    public static defaultOptions: NATROptions = merge(ATRIndicator.defaultOptions, {
        tooltip: {
            valueSuffix: '%'
        }
    } as NATROptions);

    /**
     * @lends Highcharts.Series#
     */

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<NATRPoint> = void 0 as any;
    public points: Array<NATRPoint> = void 0 as any;
    public options: NATROptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getValues<TLinkedSeries extends Series>(
        series: TLinkedSeries,
        params: NATRParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var atrData: (
                IndicatorValuesObject<Series>|
                undefined
            ) = (
                ATRIndicator.prototype.getValues.apply(this, arguments)
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
}

/* *
 *
 *  Prototype Properties
 *
 * */
interface NATRIndicator {
    pointClass: typeof NATRPoint;
}

extend(NATRIndicator.prototype, {
    requiredIndicators: ['atr']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        natr: typeof NATRIndicator;
    }
}

SeriesRegistry.registerSeriesType('natr', NATRIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default NATRIndicator;

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
