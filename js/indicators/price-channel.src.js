'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import reduceArrayMixin from '../mixins/reduce-array.js';

var minInArray = reduceArrayMixin.minInArray,
    maxInArray = reduceArrayMixin.maxInArray;


H.seriesType('pricechannel', 'bb',
    /**
     * Price channel (PC). This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @extends plotOptions.bb
     * @product highstock
     * @sample {highstock} stock/indicators/price-channel Price Channel
     * @excluding
     *        allAreas, colorAxis, compare, compareBase, joinBy, keys, stacking,
     *        showInNavigator, navigatorOptions, pointInterval,
     *        pointIntervalUnit, pointPlacement, pointRange, pointStart, joinBy
     * @since 7.0.0
     * @optionparent plotOptions.pc
     */
    {
        name: 'Price Channel (20)',
        /**
         * @excluding
         *    index, standardDeviation
         */
        params: {
        },
        lineWidth: 1,
        topLine: {
            styles: {
                lineColor: 'green'
            }
        },
        bottomLine: {
            styles: {
                lineColor: 'red'
            }
        }
    }, /** @lends Highcharts.Series.prototype */ {
        nameComponents: ['period'],
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                PC = [], // 0- date, 1-top line, 2-middle line, 3-bottom line
                ML, TL, BL, // middle line, top line and bottom line
                date,
                xData = [],
                yData = [],
                slicedY,
                i;

            if (xVal.length < period) {
                return false;
            }

            for (i = period; i <= yValLen; i++) {
                date = xVal[i - 1];
                slicedY = yVal.slice(i - period, i);
                TL = maxInArray(slicedY, 1);
                BL = minInArray(slicedY, 2);
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
    }
);

/**
 * A Price channel indicator. If the [type](#series.pc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.pc
 * @excluding
 *          allAreas, colorAxis, compare, compareBase, data, dataParser,
 *          dataURLjoinBy, keys, stacking, showInNavigator, navigatorOptions,
 *          pointInterval, pointIntervalUnit, pointPlacement, pointRange,
 *          pointStart, joinBy
 * @product highstock
 * @optionparent series.pc
 */

 /**
  * An array of data points for the series. For the `pc` series type,
  * points are calculated dynamically.
  *
  * @type {Array<Object|Array>}
  * @since 7.0.0
  * @extends series.line.data
  * @product highstock
  * @apioption series.pc.data
  */
