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
import H from '../../../Core/Globals.js';
var noop = H.noop;
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, SMAIndicator = _a.sma, ColumnSeries = _a.column;
import U from '../../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, correctFloat = U.correctFloat, isArray = U.isArray;
/* *
 *
 *  Class
 *
 * */
/**
 * The AO series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ao
 *
 * @augments Highcharts.Series
 */
var AOIndicator = /** @class */ (function (_super) {
    __extends(AOIndicator, _super);
    function AOIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         *
         * Properties
         *
         */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /**
     *
     * Functions
     *
     */
    AOIndicator.prototype.drawGraph = function () {
        var indicator = this, options = indicator.options, points = indicator.points, userColor = indicator.userOptions.color, positiveColor = options.greaterBarColor, negativeColor = options.lowerBarColor, firstPoint = points[0], i;
        if (!userColor && firstPoint) {
            firstPoint.color = positiveColor;
            for (i = 1; i < points.length; i++) {
                if (points[i].y > points[i - 1].y) {
                    points[i].color = positiveColor;
                }
                else if (points[i].y < points[i - 1].y) {
                    points[i].color = negativeColor;
                }
                else {
                    points[i].color = points[i - 1].color;
                }
            }
        }
    };
    AOIndicator.prototype.getValues = function (series) {
        var shortPeriod = 5, longPeriod = 34, xVal = series.xData || [], yVal = series.yData || [], yValLen = yVal.length, AO = [], // 0- date, 1- Awesome Oscillator
        xData = [], yData = [], high = 1, low = 2, shortSum = 0, longSum = 0, shortSMA, // Shorter Period SMA
        longSMA, // Longer Period SMA
        awesome, shortLastIndex, longLastIndex, price, i, j;
        if (xVal.length <= longPeriod ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        for (i = 0; i < longPeriod - 1; i++) {
            price = (yVal[i][high] + yVal[i][low]) / 2;
            if (i >= longPeriod - shortPeriod) {
                shortSum = correctFloat(shortSum + price);
            }
            longSum = correctFloat(longSum + price);
        }
        for (j = longPeriod - 1; j < yValLen; j++) {
            price = (yVal[j][high] + yVal[j][low]) / 2;
            shortSum = correctFloat(shortSum + price);
            longSum = correctFloat(longSum + price);
            shortSMA = shortSum / shortPeriod;
            longSMA = longSum / longPeriod;
            awesome = correctFloat(shortSMA - longSMA);
            AO.push([xVal[j], awesome]);
            xData.push(xVal[j]);
            yData.push(awesome);
            shortLastIndex = j + 1 - shortPeriod;
            longLastIndex = j + 1 - longPeriod;
            shortSum = correctFloat(shortSum -
                (yVal[shortLastIndex][high] +
                    yVal[shortLastIndex][low]) / 2);
            longSum = correctFloat(longSum -
                (yVal[longLastIndex][high] +
                    yVal[longLastIndex][low]) / 2);
        }
        return {
            values: AO,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Awesome Oscillator. This series requires the `linkedTo` option to
     * be set and should be loaded after the `stock/indicators/indicators.js`
     *
     * @sample {highstock} stock/indicators/ao
     *         Awesome
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               params, pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ao
     * @optionparent plotOptions.ao
     */
    AOIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            // Index and period are unchangeable, do not inherit (#15362)
            index: void 0,
            period: void 0
        },
        /**
         * Color of the Awesome oscillator series bar that is greater than the
         * previous one. Note that if a `color` is defined, the `color`
         * takes precedence and the `greaterBarColor` is ignored.
         *
         * @sample {highstock} stock/indicators/ao/
         *         greaterBarColor
         *
         * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since 7.0.0
         */
        greaterBarColor: "#06b535" /* positiveColor */,
        /**
         * Color of the Awesome oscillator series bar that is lower than the
         * previous one. Note that if a `color` is defined, the `color`
         * takes precedence and the `lowerBarColor` is ignored.
         *
         * @sample {highstock} stock/indicators/ao/
         *         lowerBarColor
         *
         * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since 7.0.0
         */
        lowerBarColor: "#f21313" /* negativeColor */,
        threshold: 0,
        groupPadding: 0.2,
        pointPadding: 0.2,
        crisp: false,
        states: {
            hover: {
                halo: {
                    size: 0
                }
            }
        }
    });
    return AOIndicator;
}(SMAIndicator));
extend(AOIndicator.prototype, {
    nameBase: 'AO',
    nameComponents: false,
    // Columns support:
    markerAttribs: noop,
    getColumnMetrics: ColumnSeries.prototype.getColumnMetrics,
    crispCol: ColumnSeries.prototype.crispCol,
    translate: ColumnSeries.prototype.translate,
    drawPoints: ColumnSeries.prototype.drawPoints
});
SeriesRegistry.registerSeriesType('ao', AOIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default AOIndicator;
/**
 * An `AO` series. If the [type](#series.ao.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ao
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ao
 * @apioption series.ao
 */
''; // for including the above in the doclets
