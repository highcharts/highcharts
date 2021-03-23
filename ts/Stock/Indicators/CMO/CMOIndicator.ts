/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    CMOOptions,
    CMOParamsOptions
} from './CMOOptions';
import type CMOPoint from './CMOPoint';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    isNumber,
    merge
} = U;

/* eslint-enable require-jsdoc */

/**
 * The CMO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cmo
 *
 * @augments Highcharts.Series
 */
class CMOIndicator extends SMAIndicator {
    /**
     * Chande Momentum Oscilator (CMO) technical indicator. This series
     * requires the `linkedTo` option to be set and should be loaded after
     * the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/cmo
     *         CMO indicator
     *
     * @extends      plotOptions.sma
     * @since        next
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/cmo
     * @optionparent plotOptions.cmo
     */
    public static defaultOptions: CMOOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            period: 20,
            index: 3
        }
    } as CMOOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<CMOPoint> = void 0 as any;
    public options: CMOOptions = void 0 as any;
    public points: Array<CMOPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public calculateSums(
        period: number,
        i: number,
        values: Array<number>
    ): { sumOfLowerValues: number; sumOfHigherValues: number } {
        let sumOfLowerValues = 0,
            sumOfHigherValues = 0;


        for (let j = i; j > i - period; j--) {
            if (values[j] > values[j - 1]) {
                sumOfHigherValues += values[j] - values[j - 1];
            } else if (values[j] < values[j - 1]) {
                sumOfLowerValues += values[j - 1] - values[j];
            }
        }

        return { sumOfLowerValues, sumOfHigherValues };
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: CMOParamsOptions
    ): IndicatorValuesObject<TLinkedSeries> | undefined {
        const period = params.period as any,
            xVal: Array<number> = series.xData as any,
            yVal: Array<number> | Array<Array<number>> = series.yData as any,
            yValLen: number = yVal ? yVal.length : 0,
            CMO: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [];
        let i: number,
            index = params.index as number,
            values: Array<number>;

        if (xVal.length < period) {
            return;
        }

        if (isNumber(yVal[0])) {
            values = yVal as Array<number>;
        } else {
            // in case of the situation, where the series type has data length
            // shorter then 4 (HLC, range), this ensures that we are not trying
            // to reach the index out of bounds
            index = Math.min(index, yVal[0].length - 1);
            values = (yVal as Array<Array<number>>).map((value: Array<number>): number => value[index]);
        }

        for (i = period; i < yValLen; i++) {
            const { sumOfLowerValues, sumOfHigherValues } = this.calculateSums(period, i, values),
                x = xVal[i],
                y = 100 * (sumOfHigherValues - sumOfLowerValues) / (sumOfHigherValues + sumOfLowerValues);

            xData.push(x);
            yData.push(y);
            CMO.push([x, y]);
        }

        return {
            values: CMO,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface CMOIndicator {
    pointClass: typeof CMOPoint;
}

/* *
 *
 *  Registry
 *
 * */
declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        cmo: typeof CMOIndicator;
    }
}

SeriesRegistry.registerSeriesType('cmo', CMOIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default CMOIndicator;

/**
 * A `CMO` series. If the [type](#series.cmo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cmo
 * @since     next
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/cmo
 * @apioption series.cmo
 */

''; // to include the above in the js output
