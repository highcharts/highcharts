/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';


/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class PCIndicator extends SMAIndicator
            implements MultipleLinesIndicator {
            public data: Array<PCIndicatorPoint>;
            public getTranslatedLinesNames: MultipleLinesMixin[
                'getTranslatedLinesNames'
            ];
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: PCIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public linesApiNames: MultipleLinesMixin['linesApiNames'];
            public nameBase: string;
            public nameComponents: Array<string>;
            public options: PCIndicatorOptions;
            public pointArrayMap: Array<string>;
            public pointClass: typeof PCIndicatorPoint;
            public points: Array<PCIndicatorPoint>;
            public pointValKey: string;
        }

        interface PCIndicatorParamsOptions extends SMAIndicatorParamsOptions {
            // for inheritance
        }

        class PCIndicatorPoint extends SMAIndicatorPoint {
            public series: PCIndicator;
        }

        interface PCIndicatorOptions extends SMAIndicatorOptions,
            MultipleLinesIndicatorOptions {
            params?: PCIndicatorParamsOptions;
            bottomLine: Dictionary<CSSObject>;
            topLine: Dictionary<CSSObject>;
        }

        interface SeriesTypesDictionary {
            pc: typeof PCIndicator;
        }
    }
}

import '../parts/Utilities.js';
import reduceArrayMixin from '../mixins/reduce-array.js';
import multipleLinesMixin from '../mixins/multipe-lines.js';

var getArrayExtremes = reduceArrayMixin.getArrayExtremes,
    merge = H.merge;

/**
 * The Price Channel series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pc
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.PCIndicator>(
    'pc',
    'sma',
    /**
     * Price channel (PC). This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/price-channel
     *         Price Channel
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/price-channel
     * @optionparent plotOptions.pc
     */
    {
        /**
         * @excluding index
         */
        params: {
            period: 20
        },
        lineWidth: 1,
        topLine: {
            styles: {
                /**
                 * Color of the top line. If not set, it's inherited from
                 * [plotOptions.pc.color](#plotOptions.pc.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: '${palette.colors}'.split(' ')[2],
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1
            }
        },
        bottomLine: {
            styles: {
                /**
                 * Color of the bottom line. If not set, it's inherited from
                 * [plotOptions.pc.color](#plotOptions.pc.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: '${palette.colors}'.split(' ')[8],
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    merge(multipleLinesMixin, {
        pointArrayMap: ['top', 'middle', 'bottom'],
        pointValKey: 'middle',
        nameBase: 'Price Channel',
        nameComponents: ['period'],
        linesApiNames: ['topLine', 'bottomLine'],
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.PCIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                // 0- date, 1-top line, 2-middle line, 3-bottom line
                PC: Array<Array<number>> = [],
                // middle line, top line and bottom line
                ML: number,
                TL: number,
                BL: number,
                date: number,
                low = 2,
                high = 1,
                xData: Array<number> = [],
                yData: Array<Array<number>> = [],
                slicedY: Array<Array<number>>,
                extremes: [number, number],
                i: number;

            if (yValLen < period) {
                return;
            }

            for (i = period; i <= yValLen; i++) {
                date = xVal[i - 1];
                slicedY = yVal.slice(i - period, i);
                extremes = getArrayExtremes(slicedY, low, high);
                TL = extremes[1];
                BL = extremes[0];
                ML = (TL + BL) / 2;
                PC.push([date, TL, ML, BL]);
                xData.push(date);
                yData.push([TL, ML, BL]);
            }

            return {
                values: PC,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    })
);

/**
 * A Price channel indicator. If the [type](#series.pc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends      series,plotOptions.pc
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/price-channel
 * @apioption    series.pc
 */

''; // to include the above in the js output
