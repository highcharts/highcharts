'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    seriesType = H.seriesType;

// Utils:
function accumulateAverage(points, xVal, yVal, i, index) {
    var xValue = xVal[i],
        yValue = index < 0 ? yVal[i] : yVal[i][index];

    points.push([xValue, yValue]);
}

function populateAverage(
    points,
    xVal,
    yVal,
    i,
    EMApercent,
    calEMA,
    index,
    SMA
) {
    var x = xVal[i - 1],
        yValue = index < 0 ? yVal[i - 1] : yVal[i - 1][index],
        y;

    y = calEMA === undefined ?
        SMA :
        ((yValue * EMApercent) + (calEMA * (1 - EMApercent)));

    return [x, y];
}
/**
 * The EMA series type.
 *
 * @constructor seriesTypes.ema
 * @augments seriesTypes.sma
 */
seriesType('ema', 'sma',
    /**
     * Exponential moving average indicator (EMA). This series requires the
     * `linkedTo` option to be set.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/ema
     *                        Exponential moving average indicator
     * @since 6.0.0
     * @optionparent plotOptions.ema
     */
    {
        params: {
            index: 0,
            period: 14
        }
    }, {
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                EMApercent = (2 / (period + 1)),
                range = 0,
                sum = 0,
                EMA = [],
                xData = [],
                yData = [],
                index = -1,
                points = [],
                SMA = 0,
                calEMA,
                EMAPoint,
                i;

            // Check period, if bigger than points length, skip
            if (xVal.length < period) {
                return false;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 0;
            }

            // Accumulate first N-points
            while (range < period) {
                accumulateAverage(points, xVal, yVal, range, index);
                sum += index < 0 ? yVal[range] : yVal[range][index];
                range++;
            }

            // first point
            SMA = sum / period;

            // Calculate value one-by-one for each period in visible data
            for (i = range; i < yValLen; i++) {
                EMAPoint = populateAverage(
                    points,
                    xVal,
                    yVal,
                    i,
                    EMApercent,
                    calEMA,
                    index,
                    SMA
                );
                EMA.push(EMAPoint);
                xData.push(EMAPoint[0]);
                yData.push(EMAPoint[1]);
                calEMA = EMAPoint[1];

                accumulateAverage(points, xVal, yVal, i, index);
            }

            EMAPoint = populateAverage(
                points,
                xVal,
                yVal,
                i,
                EMApercent,
                calEMA,
                index
            );
            EMA.push(EMAPoint);
            xData.push(EMAPoint[0]);
            yData.push(EMAPoint[1]);

            return {
                values: EMA,
                xData: xData,
                yData: yData
            };
        }
    });

/**
 * A `EMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.ema
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.ema
 */

/**
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.ema.data
 */
