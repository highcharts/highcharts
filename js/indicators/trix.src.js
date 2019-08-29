/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicator from '../mixins/indicator-required.js';

var correctFloat = H.correctFloat,
    TEMA = H.seriesTypes.tema;

/**
 * The TRIX series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trix
 *
 * @augments Highcharts.Series
 */
H.seriesType(
    'trix',
    'tema',
    /**
     * Triple exponential average (TRIX) oscillator. This series requires
     * `linkedTo` option to be set.
     *
     * Requires https://code.highcharts.com/stock/indicators/ema.js
     * and https://code.highcharts.com/stock/indicators/tema.js.
     *
     * @sample {highstock} stock/indicators/trix
     *         TRIX indicator
     *
     * @extends      plotOptions.tema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @optionparent plotOptions.trix
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
                TEMA,
                'tema',
                ctx.type,
                function (indicator) {
                    indicator.prototype.init.apply(ctx, args);
                }
            );
        },
        // TRIX is calculated using TEMA so we just extend getTemaPoint method.
        getTemaPoint: function (
            xVal,
            tripledPeriod,
            EMAlevels,
            i
        ) {
            if (i > tripledPeriod) {
                var TRIXPoint = [
                    xVal[i - 3],
                    EMAlevels.prevLevel3 !== 0 ?
                        correctFloat(EMAlevels.level3 - EMAlevels.prevLevel3) /
                      EMAlevels.prevLevel3 * 100 : null
                ];
            }

            return TRIXPoint;
        }
    }
);

/**
 * A `TRIX` series. If the [type](#series.tema.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.tema
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @apioption series.trix
 */
