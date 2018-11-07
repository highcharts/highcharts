'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    seriesType = H.seriesType,
    UNDEFINED;

// Utils:
function accumulateAverage(points, xVal, yVal, i) {
    var xValue = xVal[i],
        yValue = yVal[i];

    points.push([xValue, yValue]);
}

function getTR(currentPoint, prevPoint) {
    var pointY = currentPoint,
        prevY = prevPoint,
        HL = pointY[1] - pointY[2],
        HCp = prevY === UNDEFINED ? 0 : Math.abs(pointY[1] - prevY[3]),
        LCp = prevY === UNDEFINED ? 0 : Math.abs(pointY[2] - prevY[3]),
        TR = Math.max(HL, HCp, LCp);

    return TR;
}

function populateAverage(points, xVal, yVal, i, period, prevATR) {
    var x = xVal[i - 1],
        TR = getTR(yVal[i - 1], yVal[i - 2]),
        y;

    y = (((prevATR * (period - 1)) + TR) / period);

    return [x, y];
}
/**
 * The ATR series type.
 *
 * @constructor seriesTypes.atr
 * @augments seriesTypes.sma
 */
seriesType('atr', 'sma',
    /**
     * Average true range indicator (ATR). This series requires `linkedTo`
     * option to be set.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/atr ATR indicator
     * @since 6.0.0
     * @optionparent plotOptions.atr
     */
    {
        params: {
            period: 14
        }
    }, {
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                xValue = xVal[0],
                yValue = yVal[0],
                range = 1,
                prevATR = 0,
                TR = 0,
                ATR = [],
                xData = [],
                yData = [],
                point, i, points;

            points = [[xValue, yValue]];

            if (
                (xVal.length <= period) || !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return false;
            }

            for (i = 1; i <= yValLen; i++) {

                accumulateAverage(points, xVal, yVal, i);

                if (period < range) {
                    point = populateAverage(
                        points,
                        xVal,
                        yVal,
                        i,
                        period,
                        prevATR
                    );
                    prevATR = point[1];
                    ATR.push(point);
                    xData.push(point[0]);
                    yData.push(point[1]);

                } else if (period === range) {
                    prevATR = TR / (i - 1);
                    ATR.push([xVal[i - 1], prevATR]);
                    xData.push(xVal[i - 1]);
                    yData.push(prevATR);
                    range++;
                } else {
                    TR += getTR(yVal[i - 1], yVal[i - 2]);
                    range++;
                }
            }

            return {
                values: ATR,
                xData: xData,
                yData: yData
            };
        }

    });

/**
 * A `ATR` series. If the [type](#series.atr.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.atr
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.atr
 */

/**
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.atr.data
 */
