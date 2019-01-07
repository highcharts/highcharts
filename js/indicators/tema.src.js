/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var isArray = H.isArray,
    EMAindicator = H.seriesTypes.ema,
    requiredIndicator = requiredIndicatorMixin,
    correctFloat = H.correctFloat;

/**
 * The TEMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.tema
 *
 * @augments Highcharts.Series
 */
H.seriesType(
    'tema',
    'ema',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
     *
     * Requires `https://code.highcharts.com/stock/indicators/ema.js`.
     *
     * @sample {highstock} stock/indicators/tema
     *         TEMA indicator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @optionparent plotOptions.tema
     */
    {},
    /**
     * @lends Highcharts.Series#
     */
    {
        init: function () {
            var args = arguments,
                ctx = this;

            requiredIndicator.isParentLoaded(
                EMAindicator,
                'ema',
                ctx.type,
                function (indicator) {
                    indicator.prototype.init.apply(ctx, args);
                }
            );
        },
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
        getPoint: function (
            xVal,
            tripledPeriod,
            EMAlevels,
            i
        ) {
            var TEMAPoint = [
                xVal[i - 3],
                correctFloat(
                    3 * EMAlevels.level1 -
                    3 * EMAlevels.level2 + EMAlevels.level3
                )
            ];

            return TEMAPoint;
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
                TEMA = [],
                xDataTema = [],
                yDataTema = [],
                // EMA of previous point
                prevEMA,
                prevEMAlevel2,
                // EMA values array
                EMAvalues = [],
                EMAlevel2values = [],
                i,
                TEMAPoint,
                // This object contains all EMA EMAlevels calculated like below
                // EMA = level1
                // EMA(EMA) = level2,
                // EMA(EMA(EMA)) = level3,
                EMAlevels = {};

            series.EMApercent = (2 / (period + 1));

            // Check period, if bigger than EMA points length, skip
            if (yValLen < 3 * period - 2) {
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

            // first point
            SMA = accumulatePeriodPoints / period;
            accumulatePeriodPoints = 0;

            // Calculate value one-by-one for each period in visible data
            for (i = period; i < yValLen + 3; i++) {
                if (i < yValLen + 1) {
                    EMAlevels.level1 = this.getEMA(
                        yVal,
                        prevEMA,
                        SMA,
                        index,
                        i
                    )[1];
                    EMAvalues.push(EMAlevels.level1);
                }
                prevEMA = EMAlevels.level1;

                // Summing first period points for ema(ema)
                if (i < doubledPeriod) {
                    accumulatePeriodPoints += EMAlevels.level1;
                } else {
                    // Calculate dema
                    // First dema point
                    if (i === doubledPeriod) {
                        SMA = accumulatePeriodPoints / period;
                        accumulatePeriodPoints = 0;
                    }
                    EMAlevels.level1 = EMAvalues[i - period - 1];
                    EMAlevels.level2 = this.getEMA(
                        [EMAlevels.level1],
                        prevEMAlevel2,
                        SMA
                    )[1];
                    EMAlevel2values.push(EMAlevels.level2);
                    prevEMAlevel2 = EMAlevels.level2;
                    // Summing first period points for ema(ema(ema))
                    if (i < tripledPeriod) {
                        accumulatePeriodPoints += EMAlevels.level2;
                    } else {
                        // Calculate tema
                        // First tema point
                        if (i === tripledPeriod) {
                            SMA = accumulatePeriodPoints / period;
                        }
                        if (i === yValLen + 1) {
                            // Calculate the last ema and emaEMA points
                            EMAlevels.level1 = EMAvalues[i - period - 1];
                            EMAlevels.level2 = this.getEMA(
                                [EMAlevels.level1],
                                prevEMAlevel2,
                                SMA
                            )[1];
                            EMAlevel2values.push(EMAlevels.level2);
                        }
                        EMAlevels.level1 = EMAvalues[i - period - 2];
                        EMAlevels.level2 = EMAlevel2values[i - 2 * period - 1];
                        EMAlevels.level3 = this.getEMA(
                            [EMAlevels.level2],
                            EMAlevels.prevLevel3,
                            SMA
                        )[1];
                        TEMAPoint = this.getPoint(
                            xVal,
                            tripledPeriod,
                            EMAlevels,
                            i
                        );
                        // Make sure that point exists (for TRIX oscillator)
                        if (TEMAPoint) {
                            TEMA.push(TEMAPoint);
                            xDataTema.push(TEMAPoint[0]);
                            yDataTema.push(TEMAPoint[1]);
                        }
                        EMAlevels.prevLevel3 = EMAlevels.level3;
                    }
                }
            }

            return {
                values: TEMA,
                xData: xDataTema,
                yData: yDataTema
            };
        }
    }
);

/**
 * A `TEMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ema
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @apioption series.tema
 */
