'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import './atr.src.js';

var ATR = H.seriesTypes.atr;

/**
 * The NATR series type.
 *
 * @constructor seriesTypes.natr
 * @augments seriesTypes.sma
 */
H.seriesType('natr', 'sma',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set.
     *
     * @extends plotOptions.atr
     * @product highstock
     * @sample {highstock} stock/indicators/natr NATR indicator
     * @since 7.0.0
     * @optionparent plotOptions.natr
     */
    {
        tooltip: {
            valueSuffix: '%'
        }
    }, {
        getValues: function (series, params) {
            var atrData = ATR.prototype.getValues.apply(this, arguments),
                atrLength = atrData.values.length,
                period = params.period - 1,
                yVal = series.yData,
                i = 0;

            for (; i < atrLength; i++) {
                atrData.yData[i] = atrData.values[i][1] / yVal[period][3] * 100;
                atrData.values[i][1] = atrData.yData[i];
                period++;
            }

            return atrData;
        }

    });

/**
 * A `NATR` series. If the [type](#series.natr.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.natr
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.natr
 */

/**
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.atr.data
 * @product highstock
 * @apioption series.natr.data
 */
