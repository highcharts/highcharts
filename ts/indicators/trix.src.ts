/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class TRIXIndicator extends TEMAIndicator {
            public data: Array<TRIXIndicatorPoint>;
            public init(): void;
            public getTemaPoint(
                xVal: Array<number>,
                tripledPeriod: number,
                EMAlevels: EMAIndicatorLevelsObject,
                i: number
            ): ([number, (number|null)]|undefined);
            public options: TRIXIndicatorOptions;
            public pointClass: typeof TRIXIndicatorPoint;
            public points: Array<TRIXIndicatorPoint>;
        }

        interface TRIXIndicatorParamsOptions
            extends TEMAIndicatorParamsOptions {
            // for inheritance
        }

        class TRIXIndicatorPoint extends TEMAIndicatorPoint {
            public series: TRIXIndicator;
        }

        interface TRIXIndicatorOptions extends TEMAIndicatorOptions {
            params?: TRIXIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            trix: typeof TRIXIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    correctFloat
} = U;

import requiredIndicator from '../mixins/indicator-required.js';

var TEMA = H.seriesTypes.tema;

/**
 * The TRIX series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trix
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.TRIXIndicator>(
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
        init: function (this: Highcharts.TRIXIndicator): void {
            var args = arguments,
                ctx = this;

            requiredIndicator.isParentLoaded(
                (TEMA as any),
                'tema',
                ctx.type,
                function (indicator: Highcharts.Indicator): undefined {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                }
            );
        },
        // TRIX is calculated using TEMA so we just extend getTemaPoint method.
        getTemaPoint: function (
            xVal: Array<number>,
            tripledPeriod: number,
            EMAlevels: Highcharts.EMAIndicatorLevelsObject,
            i: number
        ): ([number, (number|null)]|undefined) {
            if (i > tripledPeriod) {
                var TRIXPoint: ([number, (number|null)]|undefined) = [
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

''; // to include the above in the js output
