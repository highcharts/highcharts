/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
const {
    pick
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class AroonIndicator
            extends SMAIndicator implements MultipleLinesIndicator {
            public data: Array<AroonIndicatorPoint>;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: AroonIndicatorParamsOptions
            ): IndicatorValuesObject<TLinkedSeries>;
            public linesApiNames: MultipleLinesMixin['linesApiNames'];
            public nameBase: string;
            public options: AroonIndicatorOptions;
            public pointArrayMap: MultipleLinesMixin['pointArrayMap'];
            public pointClass: typeof AroonIndicatorPoint;
            public points: Array<AroonIndicatorPoint>;
            public pointValKey: MultipleLinesMixin['pointValKey'];
            public drawGraph: MultipleLinesMixin['drawGraph'];
            public getTranslatedLinesNames: MultipleLinesMixin[
                'getTranslatedLinesNames'
            ];
        }

        interface AroonIndicatorOptions
            extends SMAIndicatorOptions, MultipleLinesIndicatorOptions {
            aroonDown?: Dictionary<CSSObject>;
            marker?: PointMarkerOptionsObject;
            params?: AroonIndicatorParamsOptions;
            tooltip?: TooltipOptions;
        }

        interface AroonIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            period?: number;
        }

        class AroonIndicatorPoint extends SMAIndicatorPoint {
            public series: AroonIndicator;
        }

        interface SeriesTypesDictionary {
            aroon: typeof AroonIndicator;
        }
    }
}


import multipleLinesMixin from '../mixins/multipe-lines.js';

/* eslint-disable valid-jsdoc */
// Utils

// Index of element with extreme value from array (min or max)
/**
 * @private
 */
function getExtremeIndexInArray(arr: Array<number>, extreme: string): number {
    var extremeValue = arr[0],
        valueIndex = 0,
        i: (number|undefined);

    for (i = 1; i < arr.length; i++) {
        if (
            extreme === 'max' && arr[i] >= extremeValue ||
            extreme === 'min' && arr[i] <= extremeValue
        ) {
            extremeValue = arr[i];
            valueIndex = i;
        }
    }

    return valueIndex;
}
/* eslint-enable valid-jsdoc */

/**
 * The Aroon series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroon
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.AroonIndicator>(
    'aroon',
    'sma',
    /**
     * Aroon. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/aroon
     *         Aroon
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/aroon
     * @optionparent plotOptions.aroon
     */
    {
        /**
         * Paramters used in calculation of aroon series points.
         *
         * @excluding periods, index
         */
        params: {
            /**
             * Period for Aroon indicator
             */
            period: 25
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Aroon Up: {point.y}<br/>Aroon Down: {point.aroonDown}<br/>'
        },
        /**
         * aroonDown line options.
         */
        aroonDown: {
            /**
             * Styles for an aroonDown line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.aroon.color](#plotOptions.aroon.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: void 0
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    H.merge(multipleLinesMixin, {
        nameBase: 'Aroon',
        pointArrayMap: ['y', 'aroonDown'],
        pointValKey: 'y',
        linesApiNames: ['aroonDown'],
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.AroonIndicatorParamsOptions
        ): Highcharts.IndicatorValuesObject<TLinkedSeries> {
            var period = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen = yVal ? yVal.length : 0,
                // 0- date, 1- Aroon Up, 2- Aroon Down
                AR: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<Array<number>> = [],
                slicedY: Array<Array<number>>,
                low = 2,
                high = 1,
                aroonUp: number,
                aroonDown: number,
                xLow: number,
                xHigh: number,
                i: number;

            // For a N-period, we start from N-1 point, to calculate Nth point
            // That is why we later need to comprehend slice() elements list
            // with (+1)
            for (i = period - 1; i < yValLen; i++) {
                slicedY = yVal.slice(i - period + 1, i + 2);

                xLow = getExtremeIndexInArray(slicedY.map(
                    function (elem): number {
                        return pick(elem[low], (elem as any));
                    }), 'min');

                xHigh = getExtremeIndexInArray(slicedY.map(
                    function (elem): number {
                        return pick(elem[high], (elem as any));
                    }), 'max');

                aroonUp = (xHigh / period) * 100;
                aroonDown = (xLow / period) * 100;

                if (xVal[i + 1]) {
                    AR.push([xVal[i + 1], aroonUp, aroonDown]);
                    xData.push(xVal[i + 1]);
                    yData.push([aroonUp, aroonDown]);
                }
            }

            return {
                values: AR,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    })
);

/**
 * A Aroon indicator. If the [type](#series.aroon.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroon
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @apioption series.aroon
 */

''; // to avoid removal of the above jsdoc
