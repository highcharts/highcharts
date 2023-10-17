/* *
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

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    TrendLineOptions,
    TrendLineParamsOptions
} from './TrendLineOptions';
import type TrendLinePoint from './TrendLinePoint';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const { sma: SMAIndicator } = SeriesRegistry.seriesTypes;
import U from '../../../Core/Utilities.js';
const {
    extend,
    merge,
    isArray,
    pushUnique
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Trend line series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trendline
 *
 * @augments Highcharts.Series
 */
class TrendLineIndicator extends SMAIndicator {

    /* *
     *
     *  Static Properties
     *
     * */

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
    public static defaultOptions: TrendLineOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding period
         */
        params: {
            period: void 0, // unchangeable period, do not inherit (#15362)
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             *
             * @default 3
             */
            index: 3
        }
    } as TrendLineOptions);

    /* *
     *
     *   Properties
     *
     * */

    public data: Array<TrendLinePoint> = void 0 as any;
    public options: TrendLineOptions = void 0 as any;
    public points: Array<TrendLinePoint> = void 0 as any;
    public updateAllPoints?: boolean = true;

    /* *
     *
     *  Functions
     *
     * */

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: TrendLineParamsOptions
    ): IndicatorValuesObject<TLinkedSeries> {
        const xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            LR: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            uniqueXVal: Array<number> = [],
            index: number = (params.index as any);

        // Generate an array of unique xValues
        xVal.forEach((x: number): void => {
            pushUnique(uniqueXVal, x);
        });

        let uniqueXLen: number = uniqueXVal.length,
            sumX = (uniqueXLen - 1) * uniqueXLen / 2,
            sumY = 0,
            sumXY = 0,
            sumX2 =
                ((uniqueXLen - 1) * (uniqueXLen) * (2 * uniqueXLen - 1)) / 6,
            alpha: number,
            i: number,
            y: number,
            xValues = uniqueXVal,
            yValues = yVal;

        // If there are duplicates, adjust the xVal and yVal arrays to uniqe
        // set of xVal and averaged yVal (for duplicates of X), #19793.
        if (uniqueXLen !== xVal.length) {
            const xyPairs = {} as any;
            yValues = [];

            xVal.forEach((x, i): void => {
                if (!xyPairs[x]) {
                    xyPairs[x] = [yVal[i]];
                } else {
                    xyPairs[x] = [...xyPairs[x], yVal[i]];
                }
            });

            // Calculate the averages for yVal
            for (const key in xyPairs) {
                if (xyPairs[key].length > 1) {
                    const sum =
                        xyPairs[key].reduce((a: number, b: number): number =>
                            a + b
                        , 0);

                    const avgY = sum / xyPairs[key].length;
                    yValues.push(avgY as any);
                } else {
                    yValues.push(xyPairs[key][0]);
                }
            }
        }

        // Get sums:
        for (i = 0; i < uniqueXLen; i++) {
            y = isArray(yValues[i]) ? yValues[i][index] : (yValues[i] as any);
            sumY += y;
            sumXY += i * y;
        }

        // Get slope and offset:
        alpha = (uniqueXLen * sumXY - sumX * sumY) /
            (uniqueXLen * sumX2 - sumX * sumX);

        if (isNaN(alpha)) {
            alpha = 0;
        }

        const beta = (sumY - alpha * sumX) / uniqueXLen;

        // Calculate linear regression:
        for (i = 0; i < uniqueXLen; i++) {
            y = alpha * i + beta;

            // Prepare arrays required for getValues() method
            LR[i] = [xValues[i], y];
            xData[i] = xValues[i];
            yData[i] = y;
        }

        return {
            xData: xData,
            yData: yData,
            values: LR
        } as IndicatorValuesObject<TLinkedSeries>;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface TrendLineIndicator {
    nameBase: string;
    nameComponents: Array<string>;
    pointClass: typeof TrendLinePoint;
}

extend(TrendLineIndicator.prototype, {
    nameBase: 'Trendline',
    nameComponents: (false as any)
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        trendline: typeof TrendLineIndicator;
    }
}

SeriesRegistry.registerSeriesType('trendline', TrendLineIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default TrendLineIndicator;

/* *
 *
 *  API Options
 *
 * */

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
