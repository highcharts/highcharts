/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type TEMAIndicatorType from '../TEMA/TEMAIndicator';
import type {
    TRIXOptions,
    TRIXParamsOptions
} from './TRIXOptions';
import type TRIXPoint from './TRIXPoint';

import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        tema: TEMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    correctFloat,
    merge
} = U;

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
    public static defaultOptions: TRIXOptions = merge(TEMAIndicator.defaultOptions)

    public data: Array<TRIXPoint> = void 0 as any;
    public options: TRIXOptions = void 0 as any;
    public points: Array<TRIXPoint> = void 0 as any;

    public init(this: TRIXIndicator): void {
        var args = arguments,
            ctx = this;

        RequiredIndicatorMixin.isParentLoaded(
            (SeriesRegistry.seriesTypes.tema as any),
            'tema',
            ctx.type,
            function (indicator: Highcharts.Indicator): undefined {
                indicator.prototype.init.apply(ctx, args);
                return;
            }
        );
    }

    // TRIX is calculated using TEMA so we just extend getTemaPoint method.
    public getTemaPoint(
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
}

interface TRIXIndicator {
    pointClass: typeof TRIXPoint;
}

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        trix: typeof TRIXIndicator;
    }
}

SeriesRegistry.registerSeriesType('trix', TRIXIndicator);

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
