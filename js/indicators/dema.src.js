/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';

import U from '../parts/Utilities.js';
var isArray = U.isArray;

import requiredIndicatorMixin from '../mixins/indicator-required.js';

var EMAindicator = H.seriesTypes.ema,
    requiredIndicator = requiredIndicatorMixin,
    correctFloat = H.correctFloat;

/**
 * The DEMA series Type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dema
 *
 * @augments Highcharts.Series
 */
H.seriesType(
    'dema',
    'ema',
    /**
     * Double exponential moving average (DEMA) indicator. This series requires
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
     *
     * @sample {highstock} stock/indicators/dema
     *         DEMA indicator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @optionparent plotOptions.dema
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
        getValues: function (series, params) {
            var period = params.period,
                doubledPeriod = 2 * period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                index = -1,
                accumulatePeriodPoints = 0,
                SMA = 0,
                DEMA = [],
                xDataDema = [],
                yDataDema = [],
                EMA = 0,
                // EMA(EMA)
                EMAlevel2,
                // EMA of previous point
                prevEMA,
                prevEMAlevel2,
                // EMA values array
                EMAvalues = [],
                i,
                DEMAPoint;

            series.EMApercent = (2 / (period + 1));

            // Check period, if bigger than EMA points length, skip
            if (yValLen < 2 * period - 1) {
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
            for (i = period; i < yValLen + 2; i++) {
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
                    // Calculate DEMA
                    // First DEMA point
                    if (i === doubledPeriod) {
                        SMA = accumulatePeriodPoints / period;
                    }
                    EMA = EMAvalues[i - period - 1];
                    EMAlevel2 = this.getEMA(
                        [EMA],
                        prevEMAlevel2,
                        SMA
                    )[1];
                    DEMAPoint = [
                        xVal[i - 2],
                        correctFloat(2 * EMA - EMAlevel2)
                    ];
                    DEMA.push(DEMAPoint);
                    xDataDema.push(DEMAPoint[0]);
                    yDataDema.push(DEMAPoint[1]);
                    prevEMAlevel2 = EMAlevel2;
                }
            }

            return {
                values: DEMA,
                xData: xDataDema,
                yData: yDataDema
            };
        }
    }
);

/**
 * A `DEMA` series. If the [type](#series.ema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ema
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @apioption series.dema
 */
