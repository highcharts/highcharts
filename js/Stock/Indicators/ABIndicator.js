/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import BaseSeries from '../../Core/Series/Series.js';
import MultipleLinesMixin from '../../Mixins/MultipleLines.js';
import U from '../../Core/Utilities.js';
var correctFloat = U.correctFloat, merge = U.merge;
// im port './SMAIndicator.js';
var SMA = BaseSeries.seriesTypes.sma;
/* eslint-disable valid-jsdoc */
/**
 * @private
 */
function getBaseForBand(low, high, factor) {
    return (((correctFloat(high - low)) /
        ((correctFloat(high + low)) / 2)) * 1000) * factor;
}
/**
 * @private
 */
function getPointUB(high, base) {
    return high * (correctFloat(1 + 2 * base));
}
/**
 * @private
 */
function getPointLB(low, base) {
    return low * (correctFloat(1 - 2 * base));
}
/* eslint-enable valid-jsdoc */
/**
 * The ABands series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.abands
 *
 * @augments Highcharts.Series
 */
BaseSeries.seriesType('abands', 'sma', 
/**
 * Acceleration bands (ABANDS). This series requires the `linkedTo` option
 * to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/acceleration-bands
 *         Acceleration Bands
 *
 * @extends      plotOptions.sma
 * @mixes        Highcharts.MultipleLinesMixin
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking,
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/acceleration-bands
 * @optionparent plotOptions.abands
 */
{
    params: {
        period: 20,
        /**
         * The algorithms factor value used to calculate bands.
         *
         * @product highstock
         */
        factor: 0.001,
        index: 3
    },
    lineWidth: 1,
    topLine: {
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1
        }
    },
    bottomLine: {
        styles: {
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
merge(MultipleLinesMixin, {
    pointArrayMap: ['top', 'middle', 'bottom'],
    pointValKey: 'middle',
    nameBase: 'Acceleration Bands',
    nameComponents: ['period', 'factor'],
    linesApiNames: ['topLine', 'bottomLine'],
    getValues: function (series, params) {
        var period = params.period, factor = params.factor, index = params.index, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // Upperbands
        UB = [], 
        // Lowerbands
        LB = [], 
        // ABANDS array structure:
        // 0-date, 1-top line, 2-middle line, 3-bottom line
        ABANDS = [], 
        // middle line, top line and bottom line
        ML, TL, BL, date, bandBase, pointSMA, ubSMA, lbSMA, low = 2, high = 1, xData = [], yData = [], slicedX, slicedY, i;
        if (yValLen < period) {
            return;
        }
        for (i = 0; i <= yValLen; i++) {
            // Get UB and LB values of every point. This condition
            // is necessary, because there is a need to calculate current
            // UB nad LB values simultaneously with given period SMA
            // in one for loop.
            if (i < yValLen) {
                bandBase = getBaseForBand(yVal[i][low], yVal[i][high], factor);
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
}));
/**
 * An Acceleration bands indicator. If the [type](#series.abands.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.abands
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            stacking, showInNavigator,
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/acceleration-bands
 * @apioption series.abands
 */
''; // to include the above in jsdoc
