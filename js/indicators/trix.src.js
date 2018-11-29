'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var correctFloat = H.correctFloat;

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
        getPoint: function (
          xVal,
          tripledPeriod,
          EMA,
          EMAlevel2,
          EMAlevel3,
          prevEMAlevel3,
          i
        ) {
            if (i > tripledPeriod) {
                var TRIXPoint = [
                    xVal[i - 3],
                    prevEMAlevel3 !== 0 ? correctFloat(EMAlevel3 -
                    prevEMAlevel3) / prevEMAlevel3 * 100 : null
                ];
            }

            return TRIXPoint;
        }
    });

/**
 * A `TEMA` series. If the [type](#series.tema.type) option is not
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
