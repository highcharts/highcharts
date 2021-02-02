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
    StochasticOptions,
    StochasticParamsOptions
} from './StochasticOptions';
import type StochasticPoint from './StochasticPoint';

import MultipleLinesMixin from '../../../Mixins/MultipleLines.js';
import ReduceArrayMixin from '../../../Mixins/ReduceArray.js';
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
 * The Stochastic series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.stochastic
 *
 * @augments Highcharts.Series
 */
class StochasticIndicator extends SMAIndicator implements Highcharts.MultipleLinesMixin {
    /**
     * Stochastic oscillator. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/stochastic
     *         Stochastic oscillator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/stochastic
     * @optionparent plotOptions.stochastic
     */
    public static defaultOptions: StochasticOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding index, period
         */
        params: {
            /**
             * Periods for Stochastic oscillator: [%K, %D].
             *
             * @type    {Array<number,number>}
             * @default [14, 3]
             */
            periods: [14, 3]
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>%K: {point.y}<br/>%D: {point.smoothed}<br/>'
        },
        /**
         * Smoothed line options.
         */
        smoothedLine: {
            /**
             * Styles for a smoothed line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.stochastic.color
                 * ](#plotOptions.stochastic.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: void 0
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    } as StochasticOptions)

    public data: Array<StochasticPoint> = void 0 as any;
    public options: StochasticOptions = void 0 as any;
    public points: Array<StochasticPoint> = void 0 as any;

    public init(): void {
        SeriesRegistry.seriesTypes.sma.prototype.init.apply(this, arguments);

        // Set default color for lines:
        this.options = merge({
            smoothedLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    }

    public getValues <TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: StochasticParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var periodK: number = (params.periods as any)[0],
            periodD: number = (params.periods as any)[1],
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            // 0- date, 1-%K, 2-%D
            SO: Array<Array<(number|null)>> = [],
            xData: Array<number> = [],
            yData: Array<Array<(number|null)>> = [],
            slicedY: Array<Array<number>>,
            close = 3,
            low = 2,
            high = 1,
            CL: number,
            HL: number,
            LL: number,
            K: number,
            D: number|null = null,
            points: (
                IndicatorValuesObject<LineSeries>|
                undefined
            ),
            extremes: [number, number],
            i: number;


        // Stochastic requires close value
        if (
            yValLen < periodK ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4
        ) {
            return;
        }

        // For a N-period, we start from N-1 point, to calculate Nth point
        // That is why we later need to comprehend slice() elements list
        // with (+1)
        for (i = periodK - 1; i < yValLen; i++) {
            slicedY = yVal.slice(i - periodK + 1, i + 1);

            // Calculate %K
            extremes = ReduceArrayMixin.getArrayExtremes(slicedY, low as any, high as any);
            LL = extremes[0]; // Lowest low in %K periods
            CL = yVal[i][close] - LL;
            HL = extremes[1] - LL;
            K = CL / HL * 100;

            xData.push(xVal[i]);
            yData.push([K, null]);

            // Calculate smoothed %D, which is SMA of %K
            if (i >= (periodK - 1) + (periodD - 1)) {
                points = SeriesRegistry.seriesTypes.sma.prototype.getValues.call(this, ({
                    xData: xData.slice(-periodD),
                    yData: yData.slice(-periodD)
                } as any), {
                    period: periodD
                });
                D = (points as any).yData[0];
            }

            SO.push([xVal[i], K, D]);
            yData[yData.length - 1][1] = D;
        }

        return {
            values: SO,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

interface StochasticIndicator {
    linesApiNames: Array<string>;
    nameBase: string;
    nameComponents: Array<string>;
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof StochasticPoint;
    pointValKey: string;

    drawGraph: typeof MultipleLinesMixin.drawGraph;
    getTranslatedLinesNames: typeof MultipleLinesMixin.getTranslatedLinesNames;
    translate: typeof MultipleLinesMixin.translate;
    toYData: typeof MultipleLinesMixin.toYData;
}
extend(StochasticIndicator.prototype, {
    nameComponents: ['periods'],
    nameBase: 'Stochastic',
    pointArrayMap: ['y', 'smoothed'],
    parallelArrays: ['x', 'y', 'smoothed'],
    pointValKey: 'y',
    linesApiNames: ['smoothedLine'],

    drawGraph: MultipleLinesMixin.drawGraph,
    getTranslatedLinesNames: MultipleLinesMixin.getTranslatedLinesNames,
    translate: MultipleLinesMixin.translate,
    toYData: MultipleLinesMixin.toYData
});

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        stochastic: typeof StochasticIndicator;
    }
}

SeriesRegistry.registerSeriesType('stochastic', StochasticIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default StochasticIndicator;

/**
 * A Stochastic indicator. If the [type](#series.stochastic.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.stochastic
 * @since     6.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/stochastic
 * @apioption series.stochastic
 */

''; // to include the above in the js output
