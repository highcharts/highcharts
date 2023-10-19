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
            index: number = params.index || 3;

        let yValues: Array<number> = [];

        // If data is created from arrays (i.e OHLC), create a new array
        // consisting of series.yData[i][params.index] values.
        if (isArray(yVal[0])) {
            yVal.forEach((val): number => yValues.push(val[index]));
        } else {
            yValues = yVal as any;
        }
        // Generate an array of unique xValues
        xVal.forEach((x: number): boolean => pushUnique(uniqueXVal, x));

        let numerator = 0,
            denominator = 0,
            meanX = xVal.reduce((acc, x): number => acc + x, 0) / xVal.length,
            meanY =
                yValues.reduce((acc, y): number => acc + y, 0) / yValues.length;

        for (let i = 0; i < xVal.length; i++) {
            numerator += (xVal[i] - meanX) * (yValues[i] - meanY);
            denominator += Math.pow(xVal[i] - meanX, 2);
        }

        const alpha = numerator / denominator,
            beta = meanY - alpha * meanX;

        // Calculate linear regression:
        for (let i = 0; i < uniqueXVal.length; i++) {
            const x = uniqueXVal[i],
                y = alpha * x + beta;

            // Prepare arrays required for getValues() method
            LR[i] = [x, y];
            xData[i] = x;
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
