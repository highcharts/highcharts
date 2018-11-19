'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    EMA = H.seriesTypes.ema,
    correctFloat = H.correctFloat;

/**
* The DEMA series Type
*
* @constructor seriesTypes.dema
* @augments seriesTypes.ema
*/

H.seriesType('dema', 'ema',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set.
     *
     * @extends plotOptions.ema
     * @product highstock
     * @sample {highstock} stock/indicators/dema DEMA indicator
     * @excluding
     *      allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
     *      showInNavigator,navigatorOptions,pointInterval,
     *      pointIntervalUnit,pointPlacement,pointRange,pointStart,joinBy
     * @since 7.0.0
     * @optionparent plotOptions.dema
     */
    {}, {
        getValues: function (series, params) {
            var period = params.period,
                doubledPeriod = 2 * period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                EMApercent = (2 / (period + 1)),
                ema = 0,
                index = -1,
                sum = 0,
                SMA = 0,
                DEMA = [],
                EmaArr = [],
                yDataEma = [],
                xDataDema = [],
                yDataDema = [],
                calEMA,
                calDEMA,
                emaEMA,
                i,
                EMAPoint,
                DEMAPoint;

            // Check period, if bigger than EMA points length, skip
            if (yValLen < 2 * period - 1) {
                return false;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 0;
            }

            // Accumulate first N-points
            sum = EMA.prototype.accumulatePeriodPoints(
              period,
              index,
              yVal
            );

            // first point
            SMA = sum / period;
            sum = 0;

            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen + 1; i++) {
                EMAPoint = EMA.prototype.calculateEma(
                    xVal,
                    yVal,
                    i,
                    EMApercent,
                    calEMA,
                    index,
                    SMA
                );
                EmaArr.push(EMAPoint);
                yDataEma.push(EMAPoint[1]);
                calEMA = EMAPoint[1];

                // Summing first period points for ema(ema)
                if (i < doubledPeriod) {
                    sum += EMAPoint[1];
                }

                // Calculate dema
                if (i >= (doubledPeriod)) {
                    // First dema point
                    if (i === (doubledPeriod)) {
                        SMA = sum / period;
                    }
                    ema = EmaArr[i - period - 1][1];
                    emaEMA = EMA.prototype.calculateEma(
                      [],
                      [ema],
                      1,
                      EMApercent,
                      calDEMA,
                      -1,
                      SMA
                    )[1];
                    DEMAPoint = [
                        xVal[i - 2],
                        correctFloat(2 * ema - emaEMA)
                    ];
                    DEMA.push(DEMAPoint);
                    xDataDema.push(DEMAPoint[0]);
                    yDataDema.push(DEMAPoint[1]);
                    calDEMA = emaEMA;
                }
            }

            // Calculate the last dema point
            ema = EmaArr[i - period - 1][1];
            emaEMA = EMA.prototype.calculateEma(
              [],
              [ema],
              1,
              EMApercent,
              calDEMA,
              -1,
              SMA
            )[1];
            DEMAPoint = [
                xVal[i - 2],
                correctFloat(2 * ema - emaEMA)
            ];
            DEMA.push(DEMAPoint);
            xDataDema.push(DEMAPoint[0]);
            yDataDema.push(DEMAPoint[1]);

            return {
                values: DEMA,
                xData: xDataDema,
                yData: yDataDema
            };
        }
    });

/**
 * A `EMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.ema
 * @excluding
 *          allAreas,colorAxis,compare,compareBase,data,dataParser,dataURL,
 *          joinBy,keys,stacking,showInNavigator,navigatorOptions,pointInterval,
 *          pointIntervalUnit,pointPlacement,pointRange,pointStart,joinBy
 * @product highstock
 * @apioption series.dema
 */

/**
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.dema.data
 */
