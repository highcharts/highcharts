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
import multipleLinesMixin from '../../../Mixins/MultipleLines.js';
import requiredIndicator from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var AroonIndicator = SeriesRegistry.seriesTypes.aroon;
import U from '../../../Core/Utilities.js';
var extend = U.extend, merge = U.merge;
var AROON = SeriesRegistry.seriesTypes.aroon;
/* *
 *
 *  Class
 *
 * */
/**
 * The Aroon Oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroonoscillator
 *
 * @augments Highcharts.Series
 */
var AroonOscillatorIndicator = /** @class */ (function (_super) {
    __extends(AroonOscillatorIndicator, _super);
    function AroonOscillatorIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    AroonOscillatorIndicator.prototype.getValues = function (series, params) {
        // 0- date, 1- Aroon Oscillator
        var ARO = [], xData = [], yData = [], aroon, aroonUp, aroonDown, oscillator, i;
        aroon = AROON.prototype.getValues.call(this, series, params);
        for (i = 0; i < aroon.yData.length; i++) {
            aroonUp = aroon.yData[i][0];
            aroonDown = aroon.yData[i][1];
            oscillator = aroonUp - aroonDown;
            ARO.push([aroon.xData[i], oscillator]);
            xData.push(aroon.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: ARO,
            xData: xData,
            yData: yData
        };
    };
    AroonOscillatorIndicator.prototype.init = function () {
        var args = arguments, ctx = this;
        requiredIndicator.isParentLoaded(AROON, 'aroon', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    };
    /**
     * Aroon Oscillator. This series requires the `linkedTo` option to be set
     * and should be loaded after the `stock/indicators/indicators.js` and
     * `stock/indicators/aroon.js`.
     *
     * @sample {highstock} stock/indicators/aroon-oscillator
     *         Aroon Oscillator
     *
     * @extends      plotOptions.aroon
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, aroonDown, colorAxis, compare, compareBase,
     *               joinBy, keys, navigatorOptions, pointInterval,
     *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
     *               showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/aroon
     * @requires     stock/indicators/aroon-oscillator
     * @optionparent plotOptions.aroonoscillator
     */
    AroonOscillatorIndicator.defaultOptions = merge(AroonIndicator.defaultOptions, {
        /**
         * Paramters used in calculation of aroon oscillator series points.
         *
         * @excluding periods, index
         */
        params: {
            /**
             * Period for Aroon Oscillator
             *
             * @since   7.0.0
             * @product highstock
             */
            period: 25
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b>: {point.y}'
        }
    });
    return AroonOscillatorIndicator;
}(AroonIndicator));
extend(AroonOscillatorIndicator.prototype, merge(multipleLinesMixin, {
    nameBase: 'Aroon Oscillator',
    pointArrayMap: ['y'],
    pointValKey: 'y',
    linesApiNames: []
}));
SeriesRegistry.registerSeriesType('aroonoscillator', AroonOscillatorIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default AroonOscillatorIndicator;
/**
 * An `Aroon Oscillator` series. If the [type](#series.aroonoscillator.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroonoscillator
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, aroonDown, colorAxis, compare, compareBase, dataParser,
 *            dataURL, joinBy, keys, navigatorOptions, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @requires  stock/indicators/aroon-oscillator
 * @apioption series.aroonoscillator
 */
''; // adds doclet above to the transpiled file
