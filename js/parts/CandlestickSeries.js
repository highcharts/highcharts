/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var defaultPlotOptions = H.defaultPlotOptions, merge = H.merge, seriesType = H.seriesType, seriesTypes = H.seriesTypes;
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
var candlestickOptions = {
    /**
     * The specific line color for up candle sticks. The default is to inherit
     * the general `lineColor` setting.
     *
     * @sample {highstock} stock/plotoptions/candlestick-linecolor/
     *         Candlestick line colors
     *
     * @type      {Highcharts.ColorString}
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
    tooltip: defaultPlotOptions.ohlc.tooltip,
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
     * @type    {Highcharts.ColorString}
     * @default #000000
     * @product highstock
     */
    lineColor: '${palette.neutralColor100}',
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
    upColor: '${palette.backgroundColor}',
    /**
     * @product highstock
     */
    stickyTracking: true
};
/**
 * The candlestick series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.candlestick
 *
 * @augments Highcharts.seriesTypes.ohlc
 */
seriesType('candlestick', 'ohlc', merge(defaultPlotOptions.column, candlestickOptions), 
/**
 * @lends seriesTypes.candlestick
 */
{
    /* eslint-disable valid-jsdoc */
    /**
     * Postprocess mapping between options and SVG attributes
     *
     * @private
     * @function Highcharts.seriesTypes.candlestick#pointAttribs
     * @param {Highcharts.Point} point
     * @param {string} [state]
     * @return {Highcharts.SVGAttributes}
     */
    pointAttribs: function (point, state) {
        var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state), options = this.options, isUp = point.open < point.close, stroke = options.lineColor || this.color, stateOptions;
        attribs['stroke-width'] = options.lineWidth;
        attribs.fill = point.options.color ||
            (isUp ? (options.upColor || this.color) : this.color);
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
    },
    /**
     * Draw the data points.
     *
     * @private
     * @function Highcharts.seriesTypes.candlestick#drawPoints
     * @return {void}
     */
    drawPoints: function () {
        var series = this, points = series.points, chart = series.chart, reversedYAxis = series.yAxis.reversed;
        points.forEach(function (point) {
            var graphic = point.graphic, plotOpen, plotClose, topBox, bottomBox, hasTopWhisker, hasBottomWhisker, crispCorr, crispX, path, halfWidth, isNew = !graphic;
            if (point.plotY !== undefined) {
                if (!graphic) {
                    point.graphic = graphic = chart.renderer.path()
                        .add(series.group);
                }
                if (!series.chart.styledMode) {
                    graphic
                        .attr(series.pointAttribs(point, point.selected && 'select')) // #3897
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
                    Math.round(topBox) !== Math.round(point.plotHigh);
                hasBottomWhisker = reversedYAxis ?
                    Math.round(topBox) !== Math.round(point.plotHigh) :
                    bottomBox !== point.yBottom;
                topBox = Math.round(topBox) + crispCorr;
                bottomBox = Math.round(bottomBox) + crispCorr;
                // Create the path. Due to a bug in Chrome 49, the path is
                // first instanciated with no values, then the values
                // pushed. For unknown reasons, instanciating the path array
                // with all the values would lead to a crash when updating
                // frequently (#5193).
                path = [];
                path.push('M', crispX - halfWidth, bottomBox, 'L', crispX - halfWidth, topBox, 'L', crispX + halfWidth, topBox, 'L', crispX + halfWidth, bottomBox, 'Z', // Ensure a nice rectangle #2602
                'M', crispX, topBox, 'L', 
                // #460, #2094
                crispX, hasTopWhisker ?
                    Math.round(reversedYAxis ? point.yBottom : point.plotHigh) :
                    topBox, 'M', crispX, bottomBox, 'L', 
                // #460, #2094
                crispX, hasBottomWhisker ?
                    Math.round(reversedYAxis ? point.plotHigh : point.yBottom) :
                    bottomBox);
                graphic[isNew ? 'attr' : 'animate']({ d: path })
                    .addClass(point.getClassName(), true);
            }
        });
        /* eslint-enable valid-jsdoc */
    }
});
