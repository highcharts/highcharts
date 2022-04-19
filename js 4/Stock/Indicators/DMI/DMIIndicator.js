/* *
 *  (c) 2010-2021 Rafal Sebestjanski
 *
 *  Directional Movement Index (DMI) indicator for Highcharts Stock
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
import MultipleLinesComposition from '../MultipleLinesComposition.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var SMAIndicator = SeriesRegistry.seriesTypes.sma;
import U from '../../../Core/Utilities.js';
var correctFloat = U.correctFloat, extend = U.extend, isArray = U.isArray, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * The Directional Movement Index (DMI) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dmi
 *
 * @augments Highcharts.Series
 */
var DMIIndicator = /** @class */ (function (_super) {
    __extends(DMIIndicator, _super);
    function DMIIndicator() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.options = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    DMIIndicator.prototype.calculateDM = function (yVal, i, isPositiveDM) {
        var currentHigh = yVal[i][1], currentLow = yVal[i][2], previousHigh = yVal[i - 1][1], previousLow = yVal[i - 1][2];
        var DM;
        if (currentHigh - previousHigh > previousLow - currentLow) {
            // for +DM
            DM = isPositiveDM ? Math.max(currentHigh - previousHigh, 0) : 0;
        }
        else {
            // for -DM
            DM = !isPositiveDM ? Math.max(previousLow - currentLow, 0) : 0;
        }
        return correctFloat(DM);
    };
    DMIIndicator.prototype.calculateDI = function (smoothedDM, tr) {
        return smoothedDM / tr * 100;
    };
    DMIIndicator.prototype.calculateDX = function (plusDI, minusDI) {
        return correctFloat(Math.abs(plusDI - minusDI) / Math.abs(plusDI + minusDI) * 100);
    };
    DMIIndicator.prototype.smoothValues = function (accumulatedValues, currentValue, period) {
        return correctFloat(accumulatedValues - accumulatedValues / period + currentValue);
    };
    DMIIndicator.prototype.getTR = function (currentPoint, prevPoint) {
        return correctFloat(Math.max(
        // currentHigh - currentLow
        currentPoint[1] - currentPoint[2], 
        // currentHigh - previousClose
        !prevPoint ? 0 : Math.abs(currentPoint[1] - prevPoint[3]), 
        // currentLow - previousClose
        !prevPoint ? 0 : Math.abs(currentPoint[2] - prevPoint[3])));
    };
    DMIIndicator.prototype.getValues = function (series, params) {
        var period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, DMI = [], xData = [], yData = [];
        if (
        // Check period, if bigger than points length, skip
        (xVal.length <= period) ||
            // Only ohlc data is valid
            !isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        var prevSmoothedPlusDM = 0, prevSmoothedMinusDM = 0, prevSmoothedTR = 0, i;
        for (i = 1; i < yValLen; i++) {
            var smoothedPlusDM = void 0, smoothedMinusDM = void 0, smoothedTR = void 0, plusDM = void 0, // +DM
            minusDM = void 0, // -DM
            TR = void 0, plusDI = void 0, // +DI
            minusDI = void 0, // -DI
            DX = void 0;
            if (i <= period) {
                plusDM = this.calculateDM(yVal, i, true);
                minusDM = this.calculateDM(yVal, i);
                TR = this.getTR(yVal[i], yVal[i - 1]);
                // Accumulate first period values to smooth them later
                prevSmoothedPlusDM += plusDM;
                prevSmoothedMinusDM += minusDM;
                prevSmoothedTR += TR;
                // Get all values for the first point
                if (i === period) {
                    plusDI = this.calculateDI(prevSmoothedPlusDM, prevSmoothedTR);
                    minusDI = this.calculateDI(prevSmoothedMinusDM, prevSmoothedTR);
                    DX = this.calculateDX(prevSmoothedPlusDM, prevSmoothedMinusDM);
                    DMI.push([xVal[i], DX, plusDI, minusDI]);
                    xData.push(xVal[i]);
                    yData.push([DX, plusDI, minusDI]);
                }
            }
            else {
                // Calculate current values
                plusDM = this.calculateDM(yVal, i, true);
                minusDM = this.calculateDM(yVal, i);
                TR = this.getTR(yVal[i], yVal[i - 1]);
                // Smooth +DM, -DM and TR
                smoothedPlusDM = this.smoothValues(prevSmoothedPlusDM, plusDM, period);
                smoothedMinusDM = this.smoothValues(prevSmoothedMinusDM, minusDM, period);
                smoothedTR = this.smoothValues(prevSmoothedTR, TR, period);
                // Save current smoothed values for the next step
                prevSmoothedPlusDM = smoothedPlusDM;
                prevSmoothedMinusDM = smoothedMinusDM;
                prevSmoothedTR = smoothedTR;
                // Get all next points (except the first one calculated above)
                plusDI = this.calculateDI(prevSmoothedPlusDM, prevSmoothedTR);
                minusDI = this.calculateDI(prevSmoothedMinusDM, prevSmoothedTR);
                DX = this.calculateDX(prevSmoothedPlusDM, prevSmoothedMinusDM);
                DMI.push([xVal[i], DX, plusDI, minusDI]);
                xData.push(xVal[i]);
                yData.push([DX, plusDI, minusDI]);
            }
        }
        return {
            values: DMI,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Directional Movement Index (DMI).
     * This series requires the `linkedTo` option to be set and should
     * be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/dmi
     *         DMI indicator
     *
     * @extends      plotOptions.sma
     * @since 9.1.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/dmi
     * @optionparent plotOptions.dmi
     */
    DMIIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding index
         */
        params: {
            index: void 0 // unused index, do not inherit (#15362)
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color: {point.color}">' +
                '\u25CF</span><b> {series.name}</b><br/>' +
                '<span style="color: {point.color}">DX</span>: {point.y}<br/>' +
                '<span style="color: ' +
                '{point.series.options.plusDILine.styles.lineColor}">' +
                '+DI</span>: {point.plusDI}<br/>' +
                '<span style="color: ' +
                '{point.series.options.minusDILine.styles.lineColor}">' +
                '-DI</span>: {point.minusDI}<br/>'
        },
        /**
         * +DI line options.
         */
        plusDILine: {
            /**
             * Styles for the +DI line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: "#06b535" /* positiveColor */ // green-ish
            }
        },
        /**
         * -DI line options.
         */
        minusDILine: {
            /**
             * Styles for the -DI line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: "#f21313" /* negativeColor */ // red-ish
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    });
    return DMIIndicator;
}(SMAIndicator));
extend(DMIIndicator.prototype, {
    areaLinesNames: [],
    nameBase: 'DMI',
    linesApiNames: ['plusDILine', 'minusDILine'],
    pointArrayMap: ['y', 'plusDI', 'minusDI'],
    parallelArrays: ['x', 'y', 'plusDI', 'minusDI'],
    pointValKey: 'y'
});
MultipleLinesComposition.compose(DMIIndicator);
SeriesRegistry.registerSeriesType('dmi', DMIIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default DMIIndicator;
/**
 * The Directional Movement Index (DMI) indicator series.
 * If the [type](#series.dmi.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dmi
 * @since 9.1.0
 * @product   highstock
 * @excluding allAreas, colorAxis,  dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dmi
 * @apioption series.dmi
 */
''; // to include the above in the js output
