'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicator from '../mixins/indicator-required.js';

var correctFloat = H.correctFloat,
    TEMA = H.seriesTypes.tema;

/**
* The TRIX series Type
*
* @constructor seriesTypes.trix
* @augments seriesTypes.tema
*/

H.seriesType('trix', 'tema',
    /**
     * Normalized average true range indicator (NATR). This series requires
     * `linkedTo` option to be set.
     *
     * Requires https://code.highcharts.com/stock/indicators/ema.js
     * and https://code.highcharts.com/stock/indicators/tema.js.
     *
     * @extends plotOptions.tema
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
        getPoint: function (
            xVal,
            tripledPeriod,
            EMAlevels,
            i
        ) {
            if (i > tripledPeriod) {
                var TRIXPoint = [
                    xVal[i - 3],
                    EMAlevels.prevEMAlevel3 !== 0 ?
                        correctFloat(EMAlevels.EMAlevel3 -
                        EMAlevels.prevEMAlevel3) /
                        EMAlevels.prevEMAlevel3 * 100 : null
                ];
            }

            return TRIXPoint;
        }
    });

/**
 * A `TRIX` series. If the [type](#series.tema.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.tema
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
