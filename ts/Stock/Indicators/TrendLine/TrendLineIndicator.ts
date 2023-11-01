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
    isArray
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
        const orgXVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            xVal: Array<number> = [],
            LR: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            index: number = params.index;

        let numerator = 0,
            denominator = 0,
            xValSum = 0,
            yValSum = 0,
            counter = 0;

        // Create an array of consecutive xValues, (don't remove duplicates)
        for (let i = 0; i < orgXVal.length; i++) {
            if (i === 0 || orgXVal[i] !== orgXVal[i - 1]) {
                counter++;
            }
            xVal.push(counter);
        }

        for (let i = 0; i < xVal.length; i++) {
            xValSum += xVal[i];
            yValSum += isArray(yVal[i]) ? yVal[i][index] : (yVal[i] as any);
        }

        const meanX = xValSum / xVal.length,
            meanY = yValSum / yVal.length;

        for (let i = 0; i < xVal.length; i++) {
            const y = isArray(yVal[i]) ? yVal[i][index] : (yVal[i] as any);
            numerator += (xVal[i] - meanX) * (y - meanY);
            denominator += Math.pow(xVal[i] - meanX, 2);
        }

        // Calculate linear regression:
        for (let i = 0; i < xVal.length; i++) {
            // Check if the xVal is already used
            if (orgXVal[i] === xData[xData.length - 1]) {
                continue;
            }
            const x = orgXVal[i],
                y = meanY + (numerator / denominator) * (xVal[i] - meanX);

            LR.push([x, y]);
            xData.push(x);
            yData.push(y);
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
