/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type Series from '../../../Core/Series/Series';
import type {
    WilliamsROptions,
    WilliamsRParamsOptions
} from './WilliamsROptions';
import type WilliamsRPoint from './WilliamsRPoint';

import ReduceArrayMixin from '../../../Mixins/ReduceArray.js';
const {
    getArrayExtremes
} = ReduceArrayMixin;
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    extend,
    isArray,
    merge
} = U;

/**
 * The Williams %R series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.williamsr
 *
 * @augments Highcharts.Series
 */
class WilliamsRIndicator extends SMAIndicator {
    /**
     * Williams %R. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/williams-r
     *         Williams %R
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/williams-r
     * @optionparent plotOptions.williamsr
     */
    public static defaultOptions: WilliamsROptions = merge(SMAIndicator.defaultOptions, {
        /**
         * Paramters used in calculation of Williams %R series points.
         * @excluding index
         */
        params: {
            /**
             * Period for Williams %R oscillator
             */
            period: 14
        }
    } as WilliamsROptions)

    public data: Array<WilliamsRPoint> = void 0 as any;
    public options: WilliamsROptions = void 0 as any;
    public points: Array<WilliamsRPoint> = void 0 as any;

    public getValues <TLinkedSeries extends Series>(
        this: WilliamsRIndicator,
        series: TLinkedSeries,
        params: WilliamsRParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var period: number = params.period as any,
            xVal: Array<number> = series.xData as any,
            yVal: Array<Array<number>> = series.yData as any,
            yValLen = yVal ? yVal.length : 0,
            WR = [], // 0- date, 1- Williams %R
            xData = [],
            yData = [],
            slicedY: Array<Array<number>>,
            close = 3,
            low = 2,
            high = 1,
            extremes: Array<number>,
            R: number,
            HH: number, // Highest high value in period
            LL: number, // Lowest low value in period
            CC: number, // Current close value
            i: number;

        // Williams %R requires close value
        if (
            xVal.length < period ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4
        ) {
            return;
        }

        // For a N-period, we start from N-1 point, to calculate Nth point
        // That is why we later need to comprehend slice() elements list
        // with (+1)
        for (i = period - 1; i < yValLen; i++) {
            slicedY = yVal.slice(i - period + 1, i + 1);
            extremes = getArrayExtremes(slicedY, low as any, high as any);

            LL = extremes[0];
            HH = extremes[1];
            CC = yVal[i][close];

            R = ((HH - CC) / (HH - LL)) * -100;

            if (xVal[i]) {
                WR.push([xVal[i], R]);
                xData.push(xVal[i]);
                yData.push(R);
            }
        }

        return {
            values: WR,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

interface WilliamsRIndicator {
    pointClass: typeof WilliamsRPoint;
}
extend(WilliamsRIndicator.prototype, {
    nameBase: 'Williams %R'
});

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        williamsr: typeof WilliamsRIndicator;
    }
}

SeriesRegistry.registerSeriesType('williamsr', WilliamsRIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default WilliamsRIndicator;

/**
 * A `Williams %R Oscillator` series. If the [type](#series.williamsr.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.williamsr
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/williams-r
 * @apioption series.williamsr
 */

''; // adds doclets above to the transpiled file
