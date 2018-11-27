'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    EMAindicator = H.seriesTypes.ema,
    correctFloat = H.correctFloat;

/**
* The TRIX series Type
*
* @constructor seriesTypes.trix
* @augments seriesTypes.ema
*/

H.seriesType('trix', 'ema',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set.
     *
     * Requires https://code.highcharts.com/stock/indicators/ema.js.
     *
     * @extends plotOptions.ema
     * @product highstock
     * @sample {highstock} stock/indicators/trix TRIX indicator
     * @excluding
     *      allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
     *      showInNavigator,navigatorOptions,pointInterval,
     *      pointIntervalUnit,pointPlacement,pointRange,pointStart,joinBy
     * @since 7.0.0
     * @optionparent plotOptions.trix
     */
    {}, {
        getEMA: function (
            yVal,
            prevEMA,
            SMA,
            index,
            i,
            xVal
          ) {

            return EMAindicator.prototype.calculateEma(
                xVal || [],
                yVal,
                i === undefined ? 1 : i,
                this.chart.series[0].EMApercent,
                prevEMA,
                index === undefined ? -1 : index,
                SMA
            );
        },
        getValues: function (series, params) {
            var period = params.period,
                doubledPeriod = 2 * period,
                tripledPeriod = 3 * period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                index = -1,
                accumulatePeriodPoints = 0,
                SMA = 0,
                xDataTrix = [],
                yDataTrix = [],
                EMA = 0,
                // EMA(EMA)
                EMAlevel2,
                // EMA(EMA(EMA))
                EMAlevel3,
                // EMA of previous point
                prevEMA,
                prevEMAlevel2,
                prevEMAlevel3,
                // EMA values array
                EMAvalues = [],
                EMAlevel2values = [],
                i,
                TRIXPoint,
                TRIX = [];
            series.EMApercent = (2 / (period + 1));

            // Check period. We need at least 3*period-1 points to generate TRIX
            if (yValLen < 3 * period - 1) {
                return false;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 0;
            }

            // Accumulate first N-points
            accumulatePeriodPoints =
              EMAindicator.prototype.accumulatePeriodPoints(
                period,
                index,
                yVal
              );

            // first value of EMA
            SMA = accumulatePeriodPoints / period;
            accumulatePeriodPoints = 0;

            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen + 3; i++) {
                if (i < yValLen + 1) {
                    EMA = this.getEMA(
                        yVal,
                        prevEMA,
                        SMA,
                        index,
                        i
                    )[1];
                    EMAvalues.push(EMA);
                }
                prevEMA = EMA;

                // Summing first period points for EMA(EMA)
                if (i < doubledPeriod) {
                    accumulatePeriodPoints += EMA;
                } else {
                    // Calculate EMA(EMA)
                    // First EMA(EMA) value
                    if (i === doubledPeriod) {
                        SMA = accumulatePeriodPoints / period;
                        accumulatePeriodPoints = 0;
                    }
                    EMA = EMAvalues[i - period - 1];
                    EMAlevel2 = this.getEMA(
                        [EMA],
                        prevEMAlevel2,
                        SMA
                    )[1];
                    EMAlevel2values.push(EMAlevel2);
                    prevEMAlevel2 = EMAlevel2;
                    // Summing first period points for EMA(EMA(EMA))
                    if (i < tripledPeriod) {
                        accumulatePeriodPoints += EMAlevel2;
                    } else {
                        // Calculate EMA(EMA(EMA))
                        // First EMA(EMA(EMA)) point
                        if (i === tripledPeriod) {
                            SMA = accumulatePeriodPoints / period;
                        }
                        if (i === yValLen + 1) {
                            // Calculate the last EMA and EMA(EMA) points
                            EMA = EMAvalues[i - period - 1];
                            EMAlevel2 = this.getEMA(
                                [EMA],
                                prevEMAlevel2,
                                SMA
                            )[1];
                            EMAlevel2values.push(EMAlevel2);
                        }
                        EMA = EMAvalues[i - period - 2];
                        EMAlevel2 = EMAlevel2values[i - 2 * period - 1];
                        EMAlevel3 = this.getEMA(
                            [EMAlevel2],
                            prevEMAlevel3,
                            SMA
                        )[1];
                        // Calculate TRIX
                        if (i > tripledPeriod) {
                            TRIXPoint = [
                                xVal[i - 3],
                                prevEMAlevel3 !== 0 ? correctFloat(EMAlevel3 -
                                prevEMAlevel3) / prevEMAlevel3 * 100 : null
                            ];
                            TRIX.push(TRIXPoint);
                            xDataTrix.push(TRIXPoint[0]);
                            yDataTrix.push(TRIXPoint[1]);
                        }
                        prevEMAlevel3 = EMAlevel3;
                    }
                }
            }

            return {
                values: TRIX,
                xData: xDataTrix,
                yData: yDataTrix
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
 * @apioption series.trix
 */

/**
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.trix.data
 */
