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
import O from '../../Core/Options.js';
var defaultOptions = O.defaultOptions;
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, ColumnSeries = _a.column, OHLCSeries = _a.ohlc;
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Code
 *
 * */
/**
 * A candlestick chart is a style of financial chart used to describe price
 * movements over time.
 *
 * @sample stock/demo/candlestick/
 *         Candlestick chart
 *
 * @extends      plotOptions.ohlc
 * @excluding    borderColor,borderRadius,borderWidth
 * @product      highstock
 * @optionparent plotOptions.candlestick
 */
/**
 * The candlestick series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.candlestick
 *
 * @augments Highcharts.seriesTypes.ohlc
 */
var CandlestickSeries = /** @class */ (function (_super) {
    __extends(CandlestickSeries, _super);
    function CandlestickSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Postprocess mapping between options and SVG attributes
     *
     * @private
     * @function Highcharts.seriesTypes.candlestick#pointAttribs
     */
    CandlestickSeries.prototype.pointAttribs = function (point, state) {
        var attribs = ColumnSeries.prototype.pointAttribs.call(this, point, state), options = this.options, isUp = point.open < point.close, stroke = options.lineColor || this.color, color = point.color || this.color, // (#14826)
        stateOptions;
        attribs['stroke-width'] = options.lineWidth;
        attribs.fill = point.options.color ||
            (isUp ? (options.upColor || color) : color);
        attribs.stroke = point.options.lineColor ||
            (isUp ? (options.upLineColor || stroke) : stroke);
        // Select or hover states
        if (state) {
            stateOptions = options.states[state];
            attribs.fill = stateOptions.color || attribs.fill;
            attribs.stroke = stateOptions.lineColor || attribs.stroke;
            attribs['stroke-width'] =
                stateOptions.lineWidth || attribs['stroke-width'];
        }
        return attribs;
    };
    /**
     * Draw the data points.
     *
     * @private
     * @function Highcharts.seriesTypes.candlestick#drawPoints
     * @return {void}
     */
    CandlestickSeries.prototype.drawPoints = function () {
        var series = this, points = series.points, chart = series.chart, reversedYAxis = series.yAxis.reversed;
        points.forEach(function (point) {
            var graphic = point.graphic, plotOpen, plotClose, topBox, bottomBox, hasTopWhisker, hasBottomWhisker, crispCorr, crispX, path, halfWidth, isNew = !graphic;
            if (typeof point.plotY !== 'undefined') {
                if (!graphic) {
                    point.graphic = graphic = chart.renderer.path()
                        .add(series.group);
                }
                if (!series.chart.styledMode) {
                    graphic
                        .attr(series.pointAttribs(point, (point.selected && 'select'))) // #3897
                        .shadow(series.options.shadow);
                }
                // Crisp vector coordinates
                crispCorr = (graphic.strokeWidth() % 2) / 2;
                // #2596:
                crispX = Math.round(point.plotX) - crispCorr;
                plotOpen = point.plotOpen;
                plotClose = point.plotClose;
                topBox = Math.min(plotOpen, plotClose);
                bottomBox = Math.max(plotOpen, plotClose);
                halfWidth = Math.round(point.shapeArgs.width / 2);
                hasTopWhisker = reversedYAxis ?
                    bottomBox !== point.yBottom :
                    Math.round(topBox) !==
                        Math.round(point.plotHigh);
                hasBottomWhisker = reversedYAxis ?
                    Math.round(topBox) !==
                        Math.round(point.plotHigh) :
                    bottomBox !== point.yBottom;
                topBox = Math.round(topBox) + crispCorr;
                bottomBox = Math.round(bottomBox) + crispCorr;
                // Create the path. Due to a bug in Chrome 49, the path is
                // first instanciated with no values, then the values
                // pushed. For unknown reasons, instanciating the path array
                // with all the values would lead to a crash when updating
                // frequently (#5193).
                path = [];
                path.push(['M', crispX - halfWidth, bottomBox], ['L', crispX - halfWidth, topBox], ['L', crispX + halfWidth, topBox], ['L', crispX + halfWidth, bottomBox], ['Z'], // Ensure a nice rectangle #2602
                ['M', crispX, topBox], [
                    'L',
                    // #460, #2094
                    crispX,
                    hasTopWhisker ?
                        Math.round(reversedYAxis ?
                            point.yBottom :
                            point.plotHigh) :
                        topBox
                ], ['M', crispX, bottomBox], [
                    'L',
                    // #460, #2094
                    crispX,
                    hasBottomWhisker ?
                        Math.round(reversedYAxis ?
                            point.plotHigh :
                            point.yBottom) :
                        bottomBox
                ]);
                graphic[isNew ? 'attr' : 'animate']({ d: path })
                    .addClass(point.getClassName(), true);
            }
        });
        /* eslint-enable valid-jsdoc */
    };
    /* *
     *
     * Static properties
     *
     * */
    CandlestickSeries.defaultOptions = merge(OHLCSeries.defaultOptions, defaultOptions.plotOptions, {
        /**
         * The specific line color for up candle sticks. The default is to
         * inherit the general `lineColor` setting.
         *
         * @sample {highstock} stock/plotoptions/candlestick-linecolor/
         *         Candlestick line colors
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     1.3.6
         * @product   highstock
         * @apioption plotOptions.candlestick.upLineColor
         */
        /**
         * @type      {Highcharts.DataGroupingApproximationValue|Function}
         * @default   ohlc
         * @product   highstock
         * @apioption plotOptions.candlestick.dataGrouping.approximation
         */
        states: {
            /**
             * @extends plotOptions.column.states.hover
             * @product highstock
             */
            hover: {
                /**
                 * The pixel width of the line/border around the candlestick.
                 *
                 * @product highstock
                 */
                lineWidth: 2
            }
        },
        /**
         * @extends plotOptions.ohlc.tooltip
         */
        tooltip: defaultOptions.plotOptions.ohlc.tooltip,
        /**
         * @type    {number|null}
         * @product highstock
         */
        threshold: null,
        /**
         * The color of the line/border of the candlestick.
         *
         * In styled mode, the line stroke can be set with the
         * `.highcharts-candlestick-series .highcahrts-point` rule.
         *
         * @see [upLineColor](#plotOptions.candlestick.upLineColor)
         *
         * @sample {highstock} stock/plotoptions/candlestick-linecolor/
         *         Candlestick line colors
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default #000000
         * @product highstock
         */
        lineColor: palette.neutralColor100,
        /**
         * The pixel width of the candlestick line/border. Defaults to `1`.
         *
         *
         * In styled mode, the line stroke width can be set with the
         * `.highcharts-candlestick-series .highcahrts-point` rule.
         *
         * @product highstock
         */
        lineWidth: 1,
        /**
         * The fill color of the candlestick when values are rising.
         *
         * In styled mode, the up color can be set with the
         * `.highcharts-candlestick-series .highcharts-point-up` rule.
         *
         * @sample {highstock} stock/plotoptions/candlestick-color/
         *         Custom colors
         * @sample {highstock} highcharts/css/candlestick/
         *         Colors in styled mode
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default #ffffff
         * @product highstock
         */
        upColor: palette.backgroundColor,
        /**
         * @product highstock
         */
        stickyTracking: true
    });
    return CandlestickSeries;
}(OHLCSeries));
SeriesRegistry.registerSeriesType('candlestick', CandlestickSeries);
/* *
 *
 * Default Export
 *
 * */
export default CandlestickSeries;
/* *
 *
 * API Options
 *
 * */
/**
 * A `candlestick` series. If the [type](#series.candlestick.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.candlestick
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.candlestick
 */
/**
 * An array of data points for the series. For the `candlestick` series
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
 *    [turboThreshold](#series.candlestick.turboThreshold), this option is not
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
 * @extends   series.ohlc.data
 * @excluding y
 * @product   highstock
 * @apioption series.candlestick.data
 */
''; // adds doclets above to transpilat
