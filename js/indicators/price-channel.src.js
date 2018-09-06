'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import reduceArrayMixin from '../mixins/reduce-array.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var minInArray = reduceArrayMixin.minInArray,
    maxInArray = reduceArrayMixin.maxInArray,
    BB = H.seriesTypes.bb,
    parentLoaded = requiredIndicatorMixin.isParentIndicatorLoaded;

H.seriesType('pc', 'bb',
    /**
     * Price channel (PC). This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js`
     * and `stock/indicators/bollinger-bands.js` files.
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
        /**
         * @excluding
         *    index, standardDeviation
         */
        params: {},
        lineWidth: 1,
        topLine: {
            styles: {
                /**
                 * Color of the top line. If not set, it's inherited from
                 * [plotOptions.pc.color](#plotOptions.pc.color).
                 *
                 * @type {String}
                 * @since 7.0.0
                 * @product highstock
                 */
                lineColor: '${palette.colors}'.split(' ')[2]
            }
        },
        bottomLine: {
            styles: {
                /**
                 * Color of the bottom line. If not set, it's inherited from
                 * [plotOptions.pc.color](#plotOptions.pc.color).
                 *
                 * @type {String}
                 * @since 7.0.0
                 * @product highstock
                 */
                lineColor: '${palette.colors}'.split(' ')[8]
            }
        }
    }, /** @lends Highcharts.Series.prototype */ {
        nameBase: 'Price Channel',
        nameComponents: ['period'],
        init: function () {
            var args = arguments,
                ctx = this;

            parentLoaded(
                BB,
                'bollinger-bands',
                ctx.type,
                function (indicator) {
                    indicator.prototype.init.apply(ctx, args);
                }
            );
        },
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

            if (yValLen.length < period) {
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
