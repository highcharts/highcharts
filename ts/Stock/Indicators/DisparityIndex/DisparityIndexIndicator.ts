/* *
 *  (c) 2010-2021 Rafal Sebestjanski
 *
 *  Disparity Index indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    DisparityIndexOptions,
    DisparityIndexParamsOptions
} from './DisparityIndexOptions';
import type DisparityIndexPoint from './DisparityIndexPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    correctFloat,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Disparity Index series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.disparityindex
 *
 * @augments Highcharts.Series
 */
class DisparityIndexIndicator extends SMAIndicator {
    /**
     * Disparity Index.
     * This series requires the `linkedTo` option to be set and should
     * be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/disparity-index
     *         Disparity Index indicator
     *
     * @extends      plotOptions.sma
     * @since        next
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/disparity-index
     * @optionparent plotOptions.disparityindex
     */
    public static defaultOptions: DisparityIndexOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            /**
             * The average used to calculate the Disparity Index indicator.
             * By default it uses SMA. To use other averages, e.g. EMA,
             * the stock/indicators/ema.js file needs to be loaded.
             */
            average: 'sma',
            index: 3,
            period: 14
        },
        marker: {
            enabled: false
        },
        dataGrouping: {
            approximation: 'averages'
        }
    } as DisparityIndexOptions);

    /* *
     *
     *  Functions
     *
     * */

    public calculateDisparityIndex(
        close: number,
        periodAverage: number
    ): number {
        return (close - periodAverage) / periodAverage * 100;
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: DisparityIndexParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const average: string = params.average,
            period: number = (params.period as any),
            index: number = (params.index as any),
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            disparityIndexPoint: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [];

        // Check period, if bigger than points length, skip
        if (xVal.length <= period) {
            return;
        }

        let i: number,
            sum = 0;

        for (i = 0; i < period - 1; i++) {
            sum += yVal[i][index];
        }

        for (i; i < yValLen; i++) {
            let averageValue: number;

            if (i >= period) {
                sum -= yVal[i - period][index];
            }

            sum += yVal[i][index];

            const SMA: number = sum / period,
                disparityIndexValue: number =
                    this.calculateDisparityIndex(yVal[i][index], SMA);

            disparityIndexPoint.push([
                xVal[i],
                disparityIndexValue
            ]);
            xData.push(xVal[i]);
            yData.push(disparityIndexValue);
        }

        return {
            values: disparityIndexPoint,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }

}

interface DisparityIndexIndicator {
    pointClass: typeof DisparityIndexPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        disparityindex: typeof DisparityIndexIndicator;
    }
}
SeriesRegistry.registerSeriesType('disparityindex', DisparityIndexIndicator);


/* *
 *
 *  Default Export
 *
 * */

export default DisparityIndexIndicator;

/**
 * The Disparity Index indicator series.
 * If the [type](#series.disparityindex.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.disparityindex
 * @since     next
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/disparity-index
 * @apioption series.disparityindex
 */

''; // to include the above in the js output
