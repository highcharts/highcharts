/**
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var isArray = U.isArray, merge = U.merge, seriesType = U.seriesType;
import multipleLinesMixin from '../../Mixins/MultipleLines.js';
var SMA = H.seriesTypes.sma;
/* eslint-disable valid-jsdoc */
// Utils:
/**
 * @private
 */
function getStandardDeviation(arr, index, isOHLC, mean) {
    var variance = 0, arrLen = arr.length, std = 0, i = 0, value;
    for (; i < arrLen; i++) {
        value = (isOHLC ? arr[i][index] : arr[i]) - mean;
        variance += value * value;
    }
    variance = variance / (arrLen - 1);
    std = Math.sqrt(variance);
    return std;
}
/* eslint-enable valid-jsdoc */
/**
 * Bollinger Bands series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.bb
 *
 * @augments Highcharts.Series
 */
seriesType('bb', 'sma', 
/**
 * Bollinger bands (BB). This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample stock/indicators/bollinger-bands
 *         Bollinger bands
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/bollinger-bands
 * @optionparent plotOptions.bb
 */
{
    params: {
        period: 20,
        /**
         * Standard deviation for top and bottom bands.
         */
        standardDeviation: 2,
        index: 3
    },
    /**
     * Bottom line options.
     */
    bottomLine: {
        /**
         * Styles for a bottom line.
         */
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line. If not set, it's inherited from
             * [plotOptions.bb.color](#plotOptions.bb.color).
             *
             * @type  {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * Top line options.
     *
     * @extends plotOptions.bb.bottomLine
     */
    topLine: {
        styles: {
            lineWidth: 1,
            /**
             * @type {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
    },
    marker: {
        enabled: false
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
    nameComponents: ['period', 'standardDeviation'],
    linesApiNames: ['topLine', 'bottomLine'],
    init: function () {
        SMA.prototype.init.apply(this, arguments);
        // Set default color for lines:
        this.options = merge({
            topLine: {
                styles: {
                    lineColor: this.color
                }
            },
            bottomLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    },
    getValues: function (series, params) {
        var period = params.period, standardDeviation = params.standardDeviation, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, 
        // 0- date, 1-middle line, 2-top line, 3-bottom line
        BB = [], 
        // middle line, top line and bottom line
        ML, TL, BL, date, xData = [], yData = [], slicedX, slicedY, stdDev, isOHLC, point, i;
        if (xVal.length < period) {
            return;
        }
        isOHLC = isArray(yVal[0]);
        for (i = period; i <= yValLen; i++) {
            slicedX = xVal.slice(i - period, i);
            slicedY = yVal.slice(i - period, i);
            point = SMA.prototype.getValues.call(this, {
                xData: slicedX,
                yData: slicedY
            }, params);
            date = point.xData[0];
            ML = point.yData[0];
            stdDev = getStandardDeviation(slicedY, params.index, isOHLC, ML);
            TL = ML + standardDeviation * stdDev;
            BL = ML - standardDeviation * stdDev;
            BB.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }
        return {
            values: BB,
            xData: xData,
            yData: yData
        };
    }
}));
/**
 * A bollinger bands indicator. If the [type](#series.bb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.bb
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/bollinger-bands
 * @apioption series.bb
 */
''; // to include the above in the js output
