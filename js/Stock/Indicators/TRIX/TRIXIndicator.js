/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var TEMAIndicator = SeriesRegistry.seriesTypes.tema;
import U from '../../../Core/Utilities.js';
var correctFloat = U.correctFloat, merge = U.merge;
/**
 * The TRIX series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trix
 *
 * @augments Highcharts.Series
 */
var TRIXIndicator = /** @class */ (function (_super) {
    __extends(TRIXIndicator, _super);
    function TRIXIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    TRIXIndicator.prototype.init = function () {
        var args = arguments, ctx = this;
        RequiredIndicatorMixin.isParentLoaded(SeriesRegistry.seriesTypes.tema, 'tema', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    };
    // TRIX is calculated using TEMA so we just extend getTemaPoint method.
    TRIXIndicator.prototype.getTemaPoint = function (xVal, tripledPeriod, EMAlevels, i) {
        if (i > tripledPeriod) {
            var TRIXPoint = [
                xVal[i - 3],
                EMAlevels.prevLevel3 !== 0 ?
                    correctFloat(EMAlevels.level3 - EMAlevels.prevLevel3) /
                        EMAlevels.prevLevel3 * 100 : null
            ];
        }
        return TRIXPoint;
    };
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
    TRIXIndicator.defaultOptions = merge(TEMAIndicator.defaultOptions);
    return TRIXIndicator;
}(TEMAIndicator));
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
