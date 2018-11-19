'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    EMA = H.seriesTypes.ema,
    correctFloat = H.correctFloat;

/**
* The TEMA series Type
*
* @constructor seriesTypes.tema
* @augments seriesTypes.ema
*/

H.seriesType('tema', 'ema',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set.
     *
     * Requires https://code.highcharts.com/stock/indicators/ema.js.
     *
     * @extends plotOptions.ema
     * @product highstock
     * @sample {highstock} stock/indicators/tema TEMA indicator
     * @excluding
     *      allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
     *      showInNavigator,navigatorOptions,pointInterval,
     *      pointIntervalUnit,pointPlacement,pointRange,pointStart,joinBy
     * @since 7.0.0
     * @optionparent plotOptions.tema
     */
    {}, {
        getValues: function (series, params) {
            var period = params.period,
                doubledPeriod = 2 * period,
                tripledPeriod = 3 * period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                EMApercent = (2 / (period + 1)),
                index = -1,
                sum = 0,
                ema = 0,
                SMA = 0,
                EmaArr = [],
                emaEMAArr = [],
                TEMA = [],
                xDataTema = [],
                yDataTema = [],
                calEMA,
                calDEMA,
                calTEMA,
                emaEMA,
                emaEMAEMA,
                i,
                TEMAPoint;

            // Check period, if bigger than EMA points length, skip
            if (yValLen < 3 * period - 2) {
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
                ema = EMA.prototype.calculateEma(
                    xVal,
                    yVal,
                    i,
                    EMApercent,
                    calEMA,
                    index,
                    SMA
                )[1];
                EmaArr.push(ema);
                calEMA = ema;

                // Summing first period points for ema(ema)
                if (i < doubledPeriod) {
                    sum += ema;
                }

                // Calculate dema
                if (i >= (doubledPeriod)) {
                    // First dema point
                    if (i === (doubledPeriod)) {
                        SMA = sum / period;
                        sum = 0;
                    }
                    ema = EmaArr[i - period - 1];
                    emaEMA = EMA.prototype.calculateEma(
                      [],
                      [ema],
                      1,
                      EMApercent,
                      calDEMA,
                      -1,
                      SMA
                    )[1];
                    emaEMAArr.push(emaEMA);
                    calDEMA = emaEMA;
                    // Summing first period points for ema(ema(ema))
                    if (i < tripledPeriod) {
                        sum += emaEMA;
                    }
                }
                // Calculate tema
                if (i >= (tripledPeriod)) {
                    // First tema point
                    if (i === (tripledPeriod)) {
                        SMA = sum / period;
                    }
                    ema = EmaArr[i - period - 2];
                    emaEMA = emaEMAArr[i - 2 * period - 1];
                    emaEMAEMA = EMA.prototype.calculateEma(
                      [],
                      [emaEMA],
                      1,
                      EMApercent,
                      calTEMA,
                      -1,
                      SMA
                    )[1];
                    TEMAPoint = [
                        xVal[i - 3],
                        correctFloat(3 * ema - 3 * emaEMA + emaEMAEMA)
                    ];
                    TEMA.push(TEMAPoint);
                    xDataTema.push(TEMAPoint[0]);
                    yDataTema.push(TEMAPoint[1]);
                    calTEMA = emaEMAEMA;
                }
            }

            // Calculate the last ema and emaEMA points
            ema = EmaArr[i - period - 1];
            emaEMA = EMA.prototype.calculateEma(
              [],
              [ema],
              1,
              EMApercent,
              calDEMA,
              -1,
              SMA
            )[1];
            emaEMAArr.push(emaEMA);

            // Calculate the last tema points
            ema = EmaArr[i - period - 2];
            emaEMA = emaEMAArr[i - 2 * period - 1];
            emaEMAEMA = EMA.prototype.calculateEma(
              [],
              [emaEMA],
              1,
              EMApercent,
              calTEMA,
              -1,
              SMA
            )[1];
            TEMAPoint = [
                xVal[i - 3],
                correctFloat(3 * ema - 3 * emaEMA + emaEMAEMA)
            ];
            TEMA.push(TEMAPoint);
            xDataTema.push(TEMAPoint[0]);
            yDataTema.push(TEMAPoint[1]);
            calTEMA = emaEMAEMA;

            i++;

            ema = EmaArr[i - period - 2];
            emaEMA = emaEMAArr[i - 2 * period - 1];
            emaEMAEMA = EMA.prototype.calculateEma(
              [],
              [emaEMA],
              1,
              EMApercent,
              calTEMA,
              -1,
              SMA
            )[1];
            TEMAPoint = [
                xVal[i - 3],
                correctFloat(3 * ema - 3 * emaEMA + emaEMAEMA)
            ];
            TEMA.push(TEMAPoint);
            xDataTema.push(TEMAPoint[0]);
            yDataTema.push(TEMAPoint[1]);

            return {
                values: TEMA,
                xData: xDataTema,
                yData: yDataTema
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
 * @apioption series.tema
 */

/**
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.tema.data
 */
