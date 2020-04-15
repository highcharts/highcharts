/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import Point from './Point.js';
import U from './Utilities.js';
var seriesType = U.seriesType;
var seriesTypes = H.seriesTypes;
/**
 * The ohlc series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ohlc
 *
 * @augments Highcharts.Series
 */
seriesType('ohlc', 'column'
/**
 * An OHLC chart is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * @sample stock/demo/ohlc/
 *         OHLC chart
 *
 * @extends      plotOptions.column
 * @excluding    borderColor, borderRadius, borderWidth, crisp, stacking,
 *               stack
 * @product      highstock
 * @optionparent plotOptions.ohlc
 */
, {
    /**
     * The approximate pixel width of each group. If for example a series
     * with 30 points is displayed over a 600 pixel wide plot area, no
     * grouping is performed. If however the series contains so many points
     * that the spacing is less than the groupPixelWidth, Highcharts will
     * try to group it into appropriate groups so that each is more or less
     * two pixels wide. Defaults to `5`.
     *
     * @type      {number}
     * @default   5
     * @product   highstock
     * @apioption plotOptions.ohlc.dataGrouping.groupPixelWidth
     */
    /**
     * The pixel width of the line/border. Defaults to `1`.
     *
     * @sample {highstock} stock/plotoptions/ohlc-linewidth/
     *         A greater line width
     *
     * @type    {number}
     * @default 1
     * @product highstock
     *
     * @private
     */
    lineWidth: 1,
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '<b> {series.name}</b><br/>' +
            'Open: {point.open}<br/>' +
            'High: {point.high}<br/>' +
            'Low: {point.low}<br/>' +
            'Close: {point.close}<br/>'
    },
    threshold: null,
    states: {
        /**
         * @extends plotOptions.column.states.hover
         * @product highstock
         */
        hover: {
            /**
             * The pixel width of the line representing the OHLC point.
             *
             * @type    {number}
             * @default 3
             * @product highstock
             */
            lineWidth: 3
        }
    },
    /**
     * Determines which one of `open`, `high`, `low`, `close` values should
     * be represented as `point.y`, which is later used to set dataLabel
     * position and [compare](#plotOptions.series.compare).
     *
     * @sample {highstock} stock/plotoptions/ohlc-pointvalkey/
     *         Possible values
     *
     * @type       {string}
     * @default    close
     * @validvalue ["open", "high", "low", "close"]
     * @product    highstock
     * @apioption  plotOptions.ohlc.pointValKey
     */
    /**
     * @default   close
     * @apioption plotOptions.ohlc.colorKey
     */
    /**
     * Line color for up points.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @product   highstock
     * @apioption plotOptions.ohlc.upColor
     */
    stickyTracking: true
}, 
/**
 * @lends Highcharts.seriesTypes.ohlc
 */
{
    /* eslint-disable valid-jsdoc */
    directTouch: false,
    pointArrayMap: ['open', 'high', 'low', 'close'],
    toYData: function (point) {
        // return a plain array for speedy calculation
        return [point.open, point.high, point.low, point.close];
    },
    pointValKey: 'close',
    pointAttrToOptions: {
        stroke: 'color',
        'stroke-width': 'lineWidth'
    },
    /**
     * @private
     * @function Highcarts.seriesTypes.ohlc#init
     * @return {void}
     */
    init: function () {
        seriesTypes.column.prototype.init.apply(this, arguments);
        this.options.stacking = void 0; // #8817
    },
    /**
     * Postprocess mapping between options and SVG attributes
     *
     * @private
     * @function Highcharts.seriesTypes.ohlc#pointAttribs
     * @param {Highcharts.OHLCPoint} point
     * @param {string} state
     * @return {Highcharts.SVGAttributes}
     */
    pointAttribs: function (point, state) {
        var attribs = seriesTypes.column.prototype.pointAttribs.call(this, point, state), options = this.options;
        delete attribs.fill;
        if (!point.options.color &&
            options.upColor &&
            point.open < point.close) {
            attribs.stroke = options.upColor;
        }
        return attribs;
    },
    /**
     * Translate data points from raw values x and y to plotX and plotY
     *
     * @private
     * @function Highcharts.seriesTypes.ohlc#translate
     * @return {void}
     */
    translate: function () {
        var series = this, yAxis = series.yAxis, hasModifyValue = !!series.modifyValue, translated = [
            'plotOpen',
            'plotHigh',
            'plotLow',
            'plotClose',
            'yBottom'
        ]; // translate OHLC for
        seriesTypes.column.prototype.translate.apply(series);
        // Do the translation
        series.points.forEach(function (point) {
            [point.open, point.high, point.low, point.close, point.low]
                .forEach(function (value, i) {
                if (value !== null) {
                    if (hasModifyValue) {
                        value = series.modifyValue(value);
                    }
                    point[translated[i]] =
                        yAxis.toPixels(value, true);
                }
            });
            // Align the tooltip to the high value to avoid covering the
            // point
            point.tooltipPos[1] =
                point.plotHigh + yAxis.pos - series.chart.plotTop;
        });
    },
    /**
     * Draw the data points
     *
     * @private
     * @function Highcharts.seriesTypes.ohlc#drawPoints
     * @return {void}
     */
    drawPoints: function () {
        var series = this, points = series.points, chart = series.chart, 
        /**
         * Extend vertical stem to open and close values.
         */
        extendStem = function (path, halfStrokeWidth, openOrClose) {
            var start = path[0];
            var end = path[1];
            // We don't need to worry about crisp - openOrClose value
            // is already crisped and halfStrokeWidth should remove it.
            if (typeof start[2] === 'number') {
                start[2] = Math.max(openOrClose + halfStrokeWidth, start[2]);
            }
            if (typeof end[2] === 'number') {
                end[2] = Math.min(openOrClose - halfStrokeWidth, end[2]);
            }
        };
        points.forEach(function (point) {
            var plotOpen, plotClose, crispCorr, halfWidth, path, graphic = point.graphic, crispX, isNew = !graphic, strokeWidth;
            if (typeof point.plotY !== 'undefined') {
                // Create and/or update the graphic
                if (!graphic) {
                    point.graphic = graphic = chart.renderer.path()
                        .add(series.group);
                }
                if (!chart.styledMode) {
                    graphic.attr(series.pointAttribs(point, (point.selected && 'select'))); // #3897
                }
                // crisp vector coordinates
                strokeWidth = graphic.strokeWidth();
                crispCorr = (strokeWidth % 2) / 2;
                // #2596:
                crispX = Math.round(point.plotX) - crispCorr;
                halfWidth = Math.round(point.shapeArgs.width / 2);
                // the vertical stem
                path = [
                    ['M', crispX, Math.round(point.yBottom)],
                    ['L', crispX, Math.round(point.plotHigh)]
                ];
                // open
                if (point.open !== null) {
                    plotOpen = Math.round(point.plotOpen) + crispCorr;
                    path.push(['M', crispX, plotOpen], ['L', crispX - halfWidth, plotOpen]);
                    extendStem(path, strokeWidth / 2, plotOpen);
                }
                // close
                if (point.close !== null) {
                    plotClose = Math.round(point.plotClose) + crispCorr;
                    path.push(['M', crispX, plotClose], ['L', crispX + halfWidth, plotClose]);
                    extendStem(path, strokeWidth / 2, plotClose);
                }
                graphic[isNew ? 'attr' : 'animate']({ d: path })
                    .addClass(point.getClassName(), true);
            }
        });
    },
    animate: null // Disable animation
    /* eslint-enable valid-jsdoc */
}, 
/**
 * @lends Highcharts.seriesTypes.ohlc.prototype.pointClass.prototype
 */
{
    /* eslint-disable valid-jsdoc */
    /**
     * Extend the parent method by adding up or down to the class name.
     * @private
     * @function Highcharts.seriesTypes.ohlc#getClassName
     * @return {string}
     */
    getClassName: function () {
        return Point.prototype.getClassName.call(this) +
            (this.open < this.close ?
                ' highcharts-point-up' :
                ' highcharts-point-down');
    }
    /* eslint-enable valid-jsdoc */
});
/**
 * A `ohlc` series. If the [type](#series.ohlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ohlc
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.ohlc
 */
/**
 * An array of data points for the series. For the `ohlc` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4\.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 6, 5, 6, 7],
 *        [1, 9, 4, 8, 2],
 *        [2, 6, 3, 4, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.ohlc.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 3,
 *        high: 4,
 *        low: 5,
 *        close: 2,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 4,
 *        high: 3,
 *        low: 6,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.arearange.data
 * @excluding y, marker
 * @product   highstock
 * @apioption series.ohlc.data
 */
/**
 * The closing value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.ohlc.data.close
 */
/**
 * The opening value of each data point.
 *
 * @type      {number}
 * @product   highstock
 * @apioption series.ohlc.data.open
 */
''; // adds doclets above to transpilat
