/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
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
H.seriesType(
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
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                PC = [], // 0- date, 1-top line, 2-middle line, 3-bottom line
                ML, TL, BL, // middle line, top line and bottom line
                date,
                low = 2,
                high = 1,
                xData = [],
                yData = [],
                slicedY,
                extremes,
                i;

            if (yValLen < period) {
                return false;
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
            };
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
 * @optionparent series.pc
 */
