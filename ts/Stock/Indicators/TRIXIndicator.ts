/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import type {
    TEMAOptions,
    TEMAParamsOptions
} from './TEMA/TEMAOptions';
import type TEMAPoint from './TEMA/TEMAPoint';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        tema: TEMAIndicator
    }
} = BaseSeries;
import type TEMAIndicatorType from './TEMA/TEMAIndicator';
import RequiredIndicatorMixin from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
const {
    correctFloat,
    extend,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {

        interface TRIXIndicatorParamsOptions
            extends TEMAParamsOptions {
            // for inheritance
        }

        class TRIXIndicatorPoint extends TEMAPoint {
            public series: TRIXIndicator;
        }

        interface TRIXIndicatorOptions extends TEMAOptions {
            params?: TRIXIndicatorParamsOptions;
        }
    }
}

/**
 * The TRIX series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trix
 *
 * @augments Highcharts.Series
 */
class TRIXIndicator extends TEMAIndicator {
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
    public static defaultOptions: Highcharts.TRIXIndicatorOptions = merge(TEMAIndicator.defaultOptions)
}

interface TRIXIndicator{
    data: Array<Highcharts.TRIXIndicatorPoint>;
    init(): void;
    getTemaPoint(
        xVal: Array<number>,
        tripledPeriod: number,
        EMAlevels: TEMAIndicatorType.EMALevelsObject,
        i: number
    ): [number, number];
    options: Highcharts.TRIXIndicatorOptions;
    pointClass: typeof Highcharts.TRIXIndicatorPoint;
    points: Array<Highcharts.TRIXIndicatorPoint>;
}
extend(TRIXIndicator.prototype, {
    init: function (this: TRIXIndicator): void {
        var args = arguments,
            ctx = this;

        RequiredIndicatorMixin.isParentLoaded(
            (BaseSeries.seriesTypes.tema as any),
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
        EMAlevels: TEMAIndicatorType.EMALevelsObject,
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
});

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        trix: typeof TRIXIndicator;
    }
}

BaseSeries.registerSeriesType('trix', TRIXIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default TRIXIndicator;

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
