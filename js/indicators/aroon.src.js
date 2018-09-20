'use strict';
import H from '../parts/Globals.js';
import multipleLinesMixin from '../mixins/multipe-lines.js';

// Utils

// Index of element with minimal value from array
function minIndexInArray(arr) {
    var minValue = Math.min.apply(null, arr);
    return arr.lastIndexOf(minValue);
}

// Index of element with maximal value from array
function maxIndexInArray(arr) {
    var maxValue = Math.max.apply(null, arr);
    return arr.lastIndexOf(maxValue);
}


H.seriesType('aroon', 'sma',
    /**
     * Aroon. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js`.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/aroon
     *                     Aroon
     * @since 7.0.0
     * @excluding
     *             allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
     *             showInNavigator,navigatorOptions,pointInterval,
     *             pointIntervalUnit,pointPlacement,pointRange,pointStart
     * @optionparent plotOptions.aroon
     */
    {
        /**
         * Paramters used in calculation of aroon series points.
         * @excluding periods, index
         */
        params: {
            /**
             * Period for Aroon indicator
             *
             * @default 14
             * @type {number}
             * @since 7.0.0
             * @product highstock
             */
            period: 14
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Aroon Up: {point.y}<br/>Aroon Down: {point.aroonDown}<br/>'
        },
        /**
         * aroonDown line options.
         *
         * @since 7.0.0
         * @product highstock
         */
        aroonDown: {
            /**
             * Styles for an aroonDown line.
             *
             * @since 7.0.0
             * @product highstock
             */
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 7.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.aroon.color](
                 * #plotOptions.aroon.color).
                 *
                 * @type {Highcharts.ColorString}
                 * @since 7.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    }, /** @lends Highcharts.Series.prototype */ H.merge(multipleLinesMixin, {
        nameComponents: ['period'],
        nameBase: 'Aroon',
        pointArrayMap: ['y', 'aroonDown'],
        pointValKey: 'y',
        linesApiNames: ['aroonDown'],
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                AR = [], // 0- date, 1- Aroon Up, 2- Aroon Down
                xData = [],
                yData = [],
                slicedY,
                low = 2,
                high = 1,
                aroonUp,
                aroonDown,
                xLow,
                xHigh,
                i;

            // For a N-period, we start from N-1 point, to calculate Nth point
            // That is why we later need to comprehend slice() elements list
            // with (+1)
            for (i = period - 1; i < yValLen; i++) {
                slicedY = yVal.slice(i - period + 1, i + 2);

                xLow = minIndexInArray(slicedY.map(function (elem) {
                    if (elem[low]) {
                        return elem[low];
                    }
                    return elem;
                }));

                xHigh = maxIndexInArray(slicedY.map(function (elem) {
                    if (elem[high]) {
                        return elem[high];
                    }
                    return elem;
                }));

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
            };
        }
    })
);

/**
 * A Aroon indicator. If the [type](#series.aroon.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.aroon
 * @excluding
 *              allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
 *              showInNavigator,navigatorOptions,pointInterval,
 *              pointIntervalUnit,pointPlacement,pointRange,pointStart
 * @product highstock
 * @apioption series.aroon
 */

/**
 * An array of data points for the series. For the `aroon` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.aroon.data
 */
