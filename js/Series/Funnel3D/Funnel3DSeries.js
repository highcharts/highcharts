/* *
 *
 *  Highcharts funnel3d series module
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Kacper Madej
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
import Funnel3DPoint from './Funnel3DPoint.js';
import H from '../../Core/Globals.js';
var noop = H.noop;
import Math3D from '../../Extensions/Math3D.js';
var perspective = Math3D.perspective;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, ColumnSeries = SeriesRegistry.seriesTypes.column;
import U from '../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, pick = U.pick, relativeLength = U.relativeLength;
import './Funnel3DComposition.js';
/* *
 *
 *  Class
 *
 * */
/**
 * The funnel3d series type.
 *
 * @constructor seriesTypes.funnel3d
 * @augments seriesTypes.column
 * @requires highcharts-3d
 * @requires modules/cylinder
 * @requires modules/funnel3d
 */
var Funnel3DSeries = /** @class */ (function (_super) {
    __extends(Funnel3DSeries, _super);
    function Funnel3DSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.center = void 0;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    Funnel3DSeries.prototype.alignDataLabel = function (point, _dataLabel, options) {
        var series = this, dlBoxRaw = point.dlBoxRaw, inverted = series.chart.inverted, below = point.plotY > pick(series.translatedThreshold, series.yAxis.len), inside = pick(options.inside, !!series.options.stacking), dlBox = {
            x: dlBoxRaw.x,
            y: dlBoxRaw.y,
            height: 0
        };
        options.align = pick(options.align, !inverted || inside ? 'center' : below ? 'right' : 'left');
        options.verticalAlign = pick(options.verticalAlign, inverted || inside ? 'middle' : below ? 'top' : 'bottom');
        if (options.verticalAlign !== 'top') {
            dlBox.y += dlBoxRaw.bottom /
                (options.verticalAlign === 'bottom' ? 1 : 2);
        }
        dlBox.width = series.getWidthAt(dlBox.y);
        if (series.options.reversed) {
            dlBox.width = dlBoxRaw.fullWidth - dlBox.width;
        }
        if (inside) {
            dlBox.x -= dlBox.width / 2;
        }
        else {
            // swap for inside
            if (options.align === 'left') {
                options.align = 'right';
                dlBox.x -= dlBox.width * 1.5;
            }
            else if (options.align === 'right') {
                options.align = 'left';
                dlBox.x += dlBox.width / 2;
            }
            else {
                dlBox.x -= dlBox.width / 2;
            }
        }
        point.dlBox = dlBox;
        ColumnSeries.prototype.alignDataLabel.apply(series, arguments);
    };
    /**
     * Override default axis options with series required options for axes.
     * @private
     */
    Funnel3DSeries.prototype.bindAxes = function () {
        Series.prototype.bindAxes.apply(this, arguments);
        extend(this.xAxis.options, {
            gridLineWidth: 0,
            lineWidth: 0,
            title: null,
            tickPositions: []
        });
        extend(this.yAxis.options, {
            gridLineWidth: 0,
            title: null,
            labels: {
                enabled: false
            }
        });
    };
    /**
     * @private
     */
    Funnel3DSeries.prototype.translate = function () {
        Series.prototype.translate.apply(this, arguments);
        var sum = 0, series = this, chart = series.chart, options = series.options, reversed = options.reversed, ignoreHiddenPoint = options.ignoreHiddenPoint, plotWidth = chart.plotWidth, plotHeight = chart.plotHeight, cumulative = 0, // start at top
        center = options.center, centerX = relativeLength(center[0], plotWidth), centerY = relativeLength(center[1], plotHeight), width = relativeLength(options.width, plotWidth), tempWidth, getWidthAt, height = relativeLength(options.height, plotHeight), neckWidth = relativeLength(options.neckWidth, plotWidth), neckHeight = relativeLength(options.neckHeight, plotHeight), neckY = (centerY - height / 2) + height - neckHeight, data = series.data, fraction, tooltipPos, 
        //
        y1, y3, y5, 
        //
        h, shapeArgs;
        // Return the width at a specific y coordinate
        series.getWidthAt = getWidthAt = function (y) {
            var top = (centerY - height / 2);
            return (y > neckY || height === neckHeight) ?
                neckWidth :
                neckWidth + (width - neckWidth) *
                    (1 - (y - top) / (height - neckHeight));
        };
        // Expose
        series.center = [centerX, centerY, height];
        series.centerX = centerX;
        /*
            * Individual point coordinate naming:
            *
            *  _________centerX,y1________
            *  \                         /
            *   \                       /
            *    \                     /
            *     \                   /
            *      \                 /
            *        ___centerX,y3___
            *
            * Additional for the base of the neck:
            *
            *       |               |
            *       |               |
            *       |               |
            *        ___centerX,y5___
            */
        // get the total sum
        data.forEach(function (point) {
            if (!ignoreHiddenPoint || point.visible !== false) {
                sum += point.y;
            }
        });
        data.forEach(function (point) {
            // set start and end positions
            y5 = null;
            fraction = sum ? point.y / sum : 0;
            y1 = centerY - height / 2 + cumulative * height;
            y3 = y1 + fraction * height;
            tempWidth = getWidthAt(y1);
            h = y3 - y1;
            shapeArgs = {
                // for fill setter
                gradientForSides: pick(point.options.gradientForSides, options.gradientForSides),
                x: centerX,
                y: y1,
                height: h,
                width: tempWidth,
                z: 1,
                top: {
                    width: tempWidth
                }
            };
            tempWidth = getWidthAt(y3);
            shapeArgs.bottom = {
                fraction: fraction,
                width: tempWidth
            };
            // the entire point is within the neck
            if (y1 >= neckY) {
                shapeArgs.isCylinder = true;
            }
            else if (y3 > neckY) {
                // the base of the neck
                y5 = y3;
                tempWidth = getWidthAt(neckY);
                y3 = neckY;
                shapeArgs.bottom.width = tempWidth;
                shapeArgs.middle = {
                    fraction: h ? (neckY - y1) / h : 0,
                    width: tempWidth
                };
            }
            if (reversed) {
                shapeArgs.y = y1 = centerY + height / 2 -
                    (cumulative + fraction) * height;
                if (shapeArgs.middle) {
                    shapeArgs.middle.fraction = 1 -
                        (h ? shapeArgs.middle.fraction : 0);
                }
                tempWidth = shapeArgs.width;
                shapeArgs.width = shapeArgs.bottom.width;
                shapeArgs.bottom.width = tempWidth;
            }
            point.shapeArgs = extend(point.shapeArgs, shapeArgs);
            // for tooltips and data labels context
            point.percentage = fraction * 100;
            point.plotX = centerX;
            if (reversed) {
                point.plotY = centerY + height / 2 -
                    (cumulative + fraction / 2) * height;
            }
            else {
                point.plotY = (y1 + (y5 || y3)) / 2;
            }
            // Placement of tooltips and data labels in 3D
            tooltipPos = perspective([{
                    x: centerX,
                    y: point.plotY,
                    z: reversed ?
                        -(width - getWidthAt(point.plotY)) / 2 :
                        -(getWidthAt(point.plotY)) / 2
                }], chart, true)[0];
            point.tooltipPos = [tooltipPos.x, tooltipPos.y];
            // base to be used when alignment options are known
            point.dlBoxRaw = {
                x: centerX,
                width: getWidthAt(point.plotY),
                y: y1,
                bottom: shapeArgs.height,
                fullWidth: width
            };
            if (!ignoreHiddenPoint || point.visible !== false) {
                cumulative += fraction;
            }
        });
    };
    /**
     * A funnel3d is a 3d version of funnel series type. Funnel charts are
     * a type of chart often used to visualize stages in a sales project,
     * where the top are the initial stages with the most clients.
     *
     * It requires that the `highcharts-3d.js`, `cylinder.js` and
     * `funnel3d.js` module are loaded.
     *
     * @sample highcharts/demo/funnel3d/
     *         Funnel3d
     *
     * @extends      plotOptions.column
     * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
     *               dataSorting, boostBlending
     * @product      highcharts
     * @since        7.1.0
     * @requires     highcharts-3d
     * @requires     modules/cylinder
     * @requires     modules/funnel3d
     * @optionparent plotOptions.funnel3d
     */
    Funnel3DSeries.defaultOptions = merge(ColumnSeries.defaultOptions, {
        /** @ignore-option */
        center: ['50%', '50%'],
        /**
         * The max width of the series compared to the width of the plot area,
         * or the pixel width if it is a number.
         *
         * @type    {number|string}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        width: '90%',
        /**
         * The width of the neck, the lower part of the funnel. A number defines
         * pixel width, a percentage string defines a percentage of the plot
         * area width.
         *
         * @type    {number|string}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        neckWidth: '30%',
        /**
         * The height of the series. If it is a number it defines
         * the pixel height, if it is a percentage string it is the percentage
         * of the plot area height.
         *
         * @type    {number|string}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        height: '100%',
        /**
         * The height of the neck, the lower part of the funnel. A number
         * defines pixel width, a percentage string defines a percentage
         * of the plot area height.
         *
         * @type    {number|string}
         * @sample  {highcharts} highcharts/demo/funnel3d/ Funnel3d demo
         * @product highcharts
         */
        neckHeight: '25%',
        /**
         * A reversed funnel has the widest area down. A reversed funnel with
         * no neck width and neck height is a pyramid.
         *
         * @product highcharts
         */
        reversed: false,
        /**
         * By deafult sides fill is set to a gradient through this option being
         * set to `true`. Set to `false` to get solid color for the sides.
         *
         * @product highcharts
         */
        gradientForSides: true,
        animation: false,
        edgeWidth: 0,
        colorByPoint: true,
        showInLegend: false,
        dataLabels: {
            align: 'right',
            crop: false,
            inside: false,
            overflow: 'allow'
        }
    });
    return Funnel3DSeries;
}(ColumnSeries));
extend(Funnel3DSeries.prototype, {
    pointClass: Funnel3DPoint,
    translate3dShapes: noop
});
SeriesRegistry.registerSeriesType('funnel3d', Funnel3DSeries);
/* *
 *
 *  Default Export
 *
 * */
export default Funnel3DSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A `funnel3d` series. If the [type](#series.funnel3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/funnel3d/
 *         Funnel3d demo
 *
 * @since     7.1.0
 * @extends   series.funnel,plotOptions.funnel3d
 * @excluding allAreas,boostThreshold,colorAxis,compare,compareBase
 * @product   highcharts
 * @requires  highcharts-3d
 * @requires  modules/cylinder
 * @requires  modules/funnel3d
 * @apioption series.funnel3d
 */
/**
 * An array of data points for the series. For the `funnel3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.funnel3d.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         y: 2,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         y: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<number>|*>}
 * @extends   series.column.data
 * @product   highcharts
 * @apioption series.funnel3d.data
 */
/**
 * By deafult sides fill is set to a gradient through this option being
 * set to `true`. Set to `false` to get solid color for the sides.
 *
 * @type      {boolean}
 * @product   highcharts
 * @apioption series.funnel3d.data.gradientForSides
 */
''; // keeps doclets above in transpiled file
