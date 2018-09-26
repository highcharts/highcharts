'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var BB = H.seriesTypes.bb,
    SMA = H.seriesTypes.sma,
    correctFloat = H.correctFloat,
    parentLoaded = requiredIndicatorMixin.isParentIndicatorLoaded;

function getBaseForBand(low, high, factor) {
    return ((
        (correctFloat(high - low)) /
        ((correctFloat(high + low)) / 2)
    ) * 1000) * factor;
}

function getPointUB(high, base) {
    return high * (correctFloat(1 + 2 * base));
}

function getPointLB(low, base) {
    return low * (correctFloat(1 - 2 * base));
}

H.seriesType('abands', 'bb',
    /**
     * Acceleration bands (ABANDS). This series requires the `linkedTo` option
     * to be set and should be loaded after the `stock/indicators/indicators.js`
     * and `stock/indicators/bollinger-bands.js` files.
     *
     * @extends plotOptions.bb
     * @product highstock
     * @sample {highstock} stock/indicators/acceleration-bands
     *        Acceleration Bands
     * @excluding
     *        allAreas, colorAxis, compare, compareBase, joinBy, keys, stacking,
     *        showInNavigator, navigatorOptions, pointInterval,
     *        pointIntervalUnit, pointPlacement, pointRange, pointStart, joinBy
     * @since 7.0.0
     * @optionparent plotOptions.abands
     */
    {
        /**
         * @excluding
         *    standardDeviation
         */
        params: {
            period: 20,
            /**
             * The algorithms factor value used to calculate bands.
             *
             * @type {Number}
             * @product highstock
             */
            factor: 0.001
        },
        lineWidth: 1
    }, /** @lends Highcharts.Series.prototype */ {
        nameBase: 'Acceleration Bands',
        nameComponents: ['period', 'factor'],
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
                factor = params.factor,
                index = params.index,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                UB = [], // Upperbands
                LB = [], // Lowerbands
                // ABANDS array structure:
                // 0-date, 1-top line, 2-middle line, 3-bottom line
                ABANDS = [],
                ML, TL, BL, // middle line, top line and bottom line
                date,
                bandBase,
                pointSMA,
                ubSMA,
                lbSMA,
                low = 2,
                high = 1,
                xData = [],
                yData = [],
                slicedX,
                slicedY,
                i;

            if (yValLen < period) {
                return false;
            }

            for (i = 0; i <= yValLen; i++) {
                // Get UB and LB values of every point. This condition
                // is necessary, because there is a need to calculate current
                // UB nad LB values simultaneously with given period SMA
                // in one for loop.
                if (i < yValLen) {
                    bandBase = getBaseForBand(
                        yVal[i][low],
                        yVal[i][high],
                        factor
                    );
                    UB.push(getPointUB(yVal[i][high], bandBase));
                    LB.push(getPointLB(yVal[i][low], bandBase));
                }
                if (i >= period) {
                    slicedX = xVal.slice(i - period, i);
                    slicedY = yVal.slice(i - period, i);
                    ubSMA = SMA.prototype.getValues.call(this, {
                        xData: slicedX,
                        yData: UB.slice(i - period, i)
                    }, {
                        period: period
                    });
                    lbSMA = SMA.prototype.getValues.call(this, {
                        xData: slicedX,
                        yData: LB.slice(i - period, i)
                    }, {
                        period: period
                    });
                    pointSMA = SMA.prototype.getValues.call(this, {
                        xData: slicedX,
                        yData: slicedY
                    }, {
                        period: period,
                        index: index
                    });
                    date = pointSMA.xData[0];
                    TL = ubSMA.yData[0];
                    BL = lbSMA.yData[0];
                    ML = pointSMA.yData[0];
                    ABANDS.push([date, TL, ML, BL]);
                    xData.push(date);
                    yData.push([TL, ML, BL]);
                }
            }

            return {
                values: ABANDS,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * An Acceleration bands indicator. If the [type](#series.pc.type) option
 * is not specified, it is inherited from[chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.abands
 * @excluding
 *          allAreas, colorAxis, compare, compareBase, data, dataParser,
 *          dataURLjoinBy, keys, stacking, showInNavigator, navigatorOptions,
 *          pointInterval, pointIntervalUnit, pointPlacement, pointRange,
 *          pointStart, joinBy
 * @product highstock
 * @optionparent series.abands
 */

/**
 * An array of data points for the series. For the `abands` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.abands.data
 */
