/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
/* *
 *
 *  Imports
 *
 * */
import HollowCandlestickPoint from './HollowCandlestickPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
import Axis from '../../Core/Axis/Axis.js';
var CandlestickSeries = SeriesRegistry.seriesTypes.candlestick;
var addEvent = U.addEvent, merge = U.merge;
/* *
 *
 *  Code
 *
 * */
/**
 * The hollowcandlestick series.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.hollowcandlestick
 *
 * @augments Highcharts.seriesTypes.candlestick
 */
var HollowCandlestickSeries = /** @class */ (function (_super) {
    __extends(HollowCandlestickSeries, _super);
    function HollowCandlestickSeries() {
        /* *
         *
         * Static properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.data = void 0;
        _this.hollowCandlestickData = [];
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /* eslint-disable valid-jsdoc */
    }
    /* *
     *
     * Functions
     *
     * */
    /**
     * Iterate through all points and get their type.
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#getPriceMovement
     *
     *
     */
    HollowCandlestickSeries.prototype.getPriceMovement = function () {
        var series = this, 
        // procesed and grouped data
        processedYData = series.allGroupedData || series.yData, hollowCandlestickData = this.hollowCandlestickData;
        if (!hollowCandlestickData.length &&
            processedYData &&
            processedYData.length) {
            // First point is allways bullish (transparent).
            hollowCandlestickData.push({
                isBullish: true,
                trendDirection: 'up'
            });
            for (var i = 1; i < processedYData.length; i++) {
                var dataPoint = processedYData[i], previousDataPoint = processedYData[i - 1];
                hollowCandlestickData.push(series.isBullish(dataPoint, previousDataPoint));
            }
        }
    };
    /**
     * Return line color based on candle type.
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#getLineColor
     *
     * @param {string} trendDirection
     * Type of candle direction (bearish/bullish)(down/up).
     *
     * @return {ColorType}
     * Line color
     */
    HollowCandlestickSeries.prototype.getLineColor = function (trendDirection) {
        var series = this;
        // Return line color based on trend direction
        return trendDirection === 'up' ?
            series.options.upColor || "#06b535" /* positiveColor */ :
            series.options.color || "#f21313" /* negativeColor */;
    };
    /**
     * Return fill color based on candle type.
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#getPointFill
     *
     * @param {HollowcandleInfo} hollowcandleInfo
     *        Information about the current candle.
     *
     * @return {ColorType}
     * Point fill color
     */
    HollowCandlestickSeries.prototype.getPointFill = function (hollowcandleInfo) {
        var series = this;
        // Return fill color only for bearish candles.
        if (hollowcandleInfo.isBullish) {
            return 'transparent';
        }
        return hollowcandleInfo.trendDirection === 'up' ?
            series.options.upColor || "#06b535" /* positiveColor */ :
            series.options.color || "#f21313" /* negativeColor */;
    };
    /**
     * @private
     * @function Highcarts.seriesTypes.hollowcandlestick#init
     */
    HollowCandlestickSeries.prototype.init = function () {
        _super.prototype.init.apply(this, arguments);
        this.hollowCandlestickData = [];
    };
    /**
     * Check if the candle is bearish or bullish. For bullish one, return true.
     * For bearish, return string depending on the previous point.
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#isBullish
     *
     * @param {Array<(number)>} dataPoint
     * Current point which we calculate.
     *
     * @param {Array<(number)>} previousDataPoint
     * Previous point.
     */
    HollowCandlestickSeries.prototype.isBullish = function (dataPoint, previousDataPoint) {
        return {
            // Compare points' open and close value.
            isBullish: dataPoint[0] <= dataPoint[3],
            // For bearish candles.
            trendDirection: dataPoint[3] < previousDataPoint[3] ? 'down' : 'up'
        };
    };
    /**
     * Add color and fill attribute for each point.
     *
     * @private
     *
     * @function Highcharts.seriesTypes.hollowcandlestick#pointAttribs
     *
     * @param {HollowCandlestickPoint} point
     * Point to which we are adding attributes.
     *
     * @param {StatesOptionsKey} state
     * Current point state.
     */
    HollowCandlestickSeries.prototype.pointAttribs = function (point, state) {
        var attribs = _super.prototype.pointAttribs.call(this, point, state), stateOptions;
        var index = point.index, hollowcandleInfo = this.hollowCandlestickData[index];
        attribs.fill = this.getPointFill(hollowcandleInfo) || attribs.fill;
        attribs.stroke = this.getLineColor(hollowcandleInfo.trendDirection) ||
            attribs.stroke;
        // Select or hover states
        if (state) {
            stateOptions = this.options.states[state];
            attribs.fill = stateOptions.color || attribs.fill;
            attribs.stroke = stateOptions.lineColor || attribs.stroke;
            attribs['stroke-width'] =
                stateOptions.lineWidth || attribs['stroke-width'];
        }
        return attribs;
    };
    /**
     * A hollow candlestick chart is a style of financial chart used to
     * describe price movements over time.
     *
     * @sample stock/demo/hollow-candlestick/
     *         Hollow Candlestick chart
     *
     * @extends      plotOptions.candlestick
     * @product      highstock
     * @requires     modules/hollowcandlestick
     * @optionparent plotOptions.hollowcandlestick
     */
    HollowCandlestickSeries.defaultOptions = merge(CandlestickSeries.defaultOptions, {
        /**
         * The fill color of the candlestick when the current
         * close is lower than the previous one.
         *
         * @sample stock/plotoptions/hollow-candlestick-color/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @product highstock
         */
        color: "#f21313" /* negativeColor */,
        dataGrouping: {
            groupAll: true,
            groupPixelWidth: 10
        },
        /**
         * The color of the line/border of the hollow candlestick when
         * the current close is lower than the previous one.
         *
         * @sample stock/plotoptions/hollow-candlestick-color/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @product highstock
         */
        lineColor: "#f21313" /* negativeColor */,
        /**
         * The fill color of the candlestick when the current
         * close is higher than the previous one.
         *
         * @sample stock/plotoptions/hollow-candlestick-color/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @product highstock
         */
        upColor: "#06b535" /* positiveColor */,
        /**
         * The color of the line/border of the hollow candlestick when
         * the current close is higher than the previous one.
         *
         * @sample stock/plotoptions/hollow-candlestick-color/
         *     Custom colors
         * @sample {highstock} highcharts/css/hollow-candlestick/
         *         Colors in styled mode
         *
         * @type    {ColorType}
         * @product highstock
         */
        upLineColor: "#06b535" /* positiveColor */
    });
    return HollowCandlestickSeries;
}(CandlestickSeries));
// Force to recalculate the hollowcandlestick data set after updating data.
addEvent(HollowCandlestickSeries, 'updatedData', function () {
    if (this.hollowCandlestickData.length) {
        this.hollowCandlestickData.length = 0;
    }
});
// After processing and grouping the data,
// check if the candle is bearish or bullish.
// Required for further calculation.
addEvent(Axis, 'postProcessData', function () {
    var axis = this, series = axis.series;
    series.forEach(function (series) {
        if (series.is('hollowcandlestick')) {
            var hollowcandlestickSeries = series;
            hollowcandlestickSeries.getPriceMovement();
        }
    });
});
/* *
 *
 *  Class Prototype
 *
 * */
HollowCandlestickSeries.prototype.pointClass = HollowCandlestickPoint;
SeriesRegistry.registerSeriesType('hollowcandlestick', HollowCandlestickSeries);
/* *
 *
 * Default Export
 *
 * */
export default HollowCandlestickSeries;
/* *
 *
 * API Options
 *
 * */
/**
 * A `hollowcandlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.hollowcandlestick
 * @excluding dataParser, dataURL, marker
 * @product   highstock
 * @apioption series.hollowcandlestick
 */
/**
 * An array of data points for the series. For the `hollowcandlestick` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 7, 2, 0, 4],
 *        [1, 1, 4, 2, 8],
 *        [2, 3, 3, 9, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.hollowcandlestick.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 9,
 *        high: 2,
 *        low: 4,
 *        close: 6,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 1,
 *        high: 4,
 *        low: 7,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.candlestick.data
 * @excluding y
 * @product   highstock
 * @apioption series.hollowcandlestick.data
 */
''; // adds doclets above to transpilat
