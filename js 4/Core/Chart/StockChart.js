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
import A from '../Animation/AnimationUtilities.js';
var animObject = A.animObject;
import Axis from '../Axis/Axis.js';
import Chart from '../Chart/Chart.js';
import F from '../../Core/FormatUtilities.js';
var format = F.format;
import D from '../DefaultOptions.js';
var getOptions = D.getOptions;
import Series from '../Series/Series.js';
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, clamp = U.clamp, defined = U.defined, extend = U.extend, find = U.find, isNumber = U.isNumber, isString = U.isString, merge = U.merge, pick = U.pick, splat = U.splat;
import '../Pointer.js';
// Has a dependency on Navigator due to the use of
// defaultOptions.navigator
import '../Navigator.js';
// Has a dependency on Scrollbar due to the use of
// defaultOptions.scrollbar
import '../Scrollbar.js';
// Has a dependency on RangeSelector due to the use of
// defaultOptions.rangeSelector
import '../../Extensions/RangeSelector.js';
/* *
 *
 *  Class
 *
 * */
/**
 * Stock-optimized chart. Use {@link Highcharts.Chart|Chart} for common charts.
 *
 * @requires modules/stock
 *
 * @class
 * @name Highcharts.StockChart
 * @extends Highcharts.Chart
 */
var StockChart = /** @class */ (function (_super) {
    __extends(StockChart, _super);
    function StockChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Initializes the chart. The constructor's arguments are passed on
     * directly.
     *
     * @function Highcharts.StockChart#init
     *
     * @param {Highcharts.Options} userOptions
     *        Custom options.
     *
     * @param {Function} [callback]
     *        Function to run when the chart has loaded and and all external
     *        images are loaded.
     *
     *
     * @emits Highcharts.StockChart#event:init
     * @emits Highcharts.StockChart#event:afterInit
     */
    StockChart.prototype.init = function (userOptions, callback) {
        var defaultOptions = getOptions(), xAxisOptions = userOptions.xAxis, yAxisOptions = userOptions.yAxis, 
        // Always disable startOnTick:true on the main axis when the
        // navigator is enabled (#1090)
        navigatorEnabled = pick(userOptions.navigator && userOptions.navigator.enabled, defaultOptions.navigator.enabled, true);
        // Avoid doing these twice
        userOptions.xAxis = userOptions.yAxis = void 0;
        var options = merge({
            chart: {
                panning: {
                    enabled: true,
                    type: 'x'
                },
                pinchType: 'x'
            },
            navigator: {
                enabled: navigatorEnabled
            },
            scrollbar: {
                // #4988 - check if setOptions was called
                enabled: pick((defaultOptions.scrollbar &&
                    defaultOptions.scrollbar.enabled), true)
            },
            rangeSelector: {
                // #4988 - check if setOptions was called
                enabled: pick(defaultOptions.rangeSelector.enabled, true)
            },
            title: {
                text: null
            },
            tooltip: {
                split: pick(defaultOptions.tooltip.split, true),
                crosshairs: true
            },
            legend: {
                enabled: false
            }
        }, userOptions, // user's options
        {
            isStock: true // internal flag
        });
        userOptions.xAxis = xAxisOptions;
        userOptions.yAxis = yAxisOptions;
        // apply X axis options to both single and multi y axes
        options.xAxis = splat(userOptions.xAxis || {}).map(function (xAxisOptions, i) {
            return merge(getDefaultAxisOptions('xAxis', xAxisOptions), defaultOptions.xAxis, // #3802
            // #7690
            defaultOptions.xAxis && defaultOptions.xAxis[i], xAxisOptions, // user options
            getForcedAxisOptions('xAxis', userOptions));
        });
        // apply Y axis options to both single and multi y axes
        options.yAxis = splat(userOptions.yAxis || {}).map(function (yAxisOptions, i) {
            return merge(getDefaultAxisOptions('yAxis', yAxisOptions), defaultOptions.yAxis, // #3802
            // #7690
            defaultOptions.yAxis && defaultOptions.yAxis[i], yAxisOptions // user options
            );
        });
        _super.prototype.init.call(this, options, callback);
    };
    /**
     * Factory for creating different axis types.
     * Extended to add stock defaults.
     *
     * @private
     * @function Highcharts.StockChart#createAxis
     * @param {string} type
     * An axis type.
     * @param {Chart.CreateAxisOptionsObject} options
     * The axis creation options.
     */
    StockChart.prototype.createAxis = function (type, options) {
        options.axis = merge(getDefaultAxisOptions(type, options.axis), options.axis, getForcedAxisOptions(type, this.userOptions));
        return _super.prototype.createAxis.call(this, type, options);
    };
    return StockChart;
}(Chart));
/* eslint-disable no-invalid-this, valid-jsdoc */
(function (StockChart) {
    /**
     * Factory function for creating new stock charts. Creates a new
     * {@link Highcharts.StockChart|StockChart} object with different default
     * options than the basic Chart.
     *
     * @example
     * let chart = Highcharts.stockChart('container', {
     *     series: [{
     *         data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
     *         pointInterval: 24 * 60 * 60 * 1000
     *     }]
     * });
     *
     * @function Highcharts.stockChart
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     *        The DOM element to render to, or its id.
     *
     * @param {Highcharts.Options} options
     *        The chart options structure as described in the
     *        [options reference](https://api.highcharts.com/highstock).
     *
     * @param {Highcharts.ChartCallbackFunction} [callback]
     *        A function to execute when the chart object is finished loading
     *        and rendering. In most cases the chart is built in one thread,
     *        but in Internet Explorer version 8 or less the chart is sometimes
     *        initialized before the document is ready, and in these cases the
     *        chart object will not be finished synchronously. As a
     *        consequence, code that relies on the newly built Chart object
     *        should always run in the callback. Defining a
     *        [chart.events.load](https://api.highcharts.com/highstock/chart.events.load)
     *        handler is equivalent.
     *
     * @return {Highcharts.StockChart}
     *         The chart object.
     */
    function stockChart(a, b, c) {
        return new StockChart(a, b, c);
    }
    StockChart.stockChart = stockChart;
})(StockChart || (StockChart = {}));
/**
 * Get stock-specific default axis options.
 *
 * @private
 * @function getDefaultAxisOptions
 */
function getDefaultAxisOptions(type, options) {
    if (type === 'xAxis') {
        return {
            minPadding: 0,
            maxPadding: 0,
            overscroll: 0,
            ordinal: true,
            title: {
                text: null
            },
            labels: {
                overflow: 'justify'
            },
            showLastLabel: true
        };
    }
    if (type === 'yAxis') {
        return {
            labels: {
                y: -2
            },
            opposite: pick(options.opposite, true),
            /**
             * @default {highcharts} true
             * @default {highstock} false
             * @apioption yAxis.showLastLabel
             *
             * @private
             */
            showLastLabel: !!(
            // #6104, show last label by default for category axes
            options.categories ||
                options.type === 'category'),
            title: {
                text: null
            }
        };
    }
    return {};
}
/**
 * Get stock-specific forced axis options.
 *
 * @private
 * @function getForcedAxisOptions
 */
function getForcedAxisOptions(type, chartOptions) {
    if (type === 'xAxis') {
        var defaultOptions = getOptions(), 
        // Always disable startOnTick:true on the main axis when the
        // navigator is enabled (#1090)
        navigatorEnabled = pick(chartOptions.navigator && chartOptions.navigator.enabled, defaultOptions.navigator.enabled, true);
        var axisOptions = {
            type: 'datetime',
            categories: void 0
        };
        if (navigatorEnabled) {
            axisOptions.startOnTick = false;
            axisOptions.endOnTick = false;
        }
        return axisOptions;
    }
    return {};
}
/* *
 *
 *  Compositions
 *
 * */
// Handle som Stock-specific series defaults, override the plotOptions before
// series options are handled.
addEvent(Series, 'setOptions', function (e) {
    var overrides;
    if (this.chart.options.isStock) {
        if (this.is('column') || this.is('columnrange')) {
            overrides = {
                borderWidth: 0,
                shadow: false
            };
        }
        else if (!this.is('scatter') && !this.is('sma')) {
            overrides = {
                marker: {
                    enabled: false,
                    radius: 2
                }
            };
        }
        if (overrides) {
            e.plotOptions[this.type] = merge(e.plotOptions[this.type], overrides);
        }
    }
});
// Override the automatic label alignment so that the first Y axis' labels
// are drawn on top of the grid line, and subsequent axes are drawn outside
addEvent(Axis, 'autoLabelAlign', function (e) {
    var chart = this.chart, options = this.options, panes = chart._labelPanes = chart._labelPanes || {}, key, labelOptions = this.options.labels;
    if (this.chart.options.isStock && this.coll === 'yAxis') {
        key = options.top + ',' + options.height;
        // do it only for the first Y axis of each pane
        if (!panes[key] && labelOptions.enabled) {
            if (labelOptions.x === 15) { // default
                labelOptions.x = 0;
            }
            if (typeof labelOptions.align === 'undefined') {
                labelOptions.align = 'right';
            }
            panes[key] = this;
            e.align = 'right';
            e.preventDefault();
        }
    }
});
// Clear axis from label panes (#6071)
addEvent(Axis, 'destroy', function () {
    var chart = this.chart, key = this.options && (this.options.top + ',' + this.options.height);
    if (key && chart._labelPanes && chart._labelPanes[key] === this) {
        delete chart._labelPanes[key];
    }
});
// Override getPlotLinePath to allow for multipane charts
addEvent(Axis, 'getPlotLinePath', function (e) {
    var axis = this, series = (this.isLinked && !this.series ?
        this.linkedParent.series :
        this.series), chart = axis.chart, renderer = chart.renderer, axisLeft = axis.left, axisTop = axis.top, x1, y1, x2, y2, result = [], axes = [], // #3416 need a default array
    axes2, uniqueAxes, translatedValue = e.translatedValue, value = e.value, force = e.force, transVal;
    /**
     * Return the other axis based on either the axis option or on related
     * series.
     * @private
     */
    function getAxis(coll) {
        var otherColl = coll === 'xAxis' ? 'yAxis' : 'xAxis', opt = axis.options[otherColl];
        // Other axis indexed by number
        if (isNumber(opt)) {
            return [chart[otherColl][opt]];
        }
        // Other axis indexed by id (like navigator)
        if (isString(opt)) {
            return [chart.get(opt)];
        }
        // Auto detect based on existing series
        return series.map(function (s) {
            return s[otherColl];
        });
    }
    if ( // For stock chart, by default render paths across the panes
    // except the case when `acrossPanes` is disabled by user (#6644)
    (chart.options.isStock && e.acrossPanes !== false) &&
        // Ignore in case of colorAxis or zAxis. #3360, #3524, #6720
        axis.coll === 'xAxis' || axis.coll === 'yAxis') {
        e.preventDefault();
        // Get the related axes based on series
        axes = getAxis(axis.coll);
        // Get the related axes based options.*Axis setting #2810
        axes2 = (axis.isXAxis ? chart.yAxis : chart.xAxis);
        axes2.forEach(function (A) {
            if (defined(A.options.id) ?
                A.options.id.indexOf('navigator') === -1 :
                true) {
                var a = (A.isXAxis ? 'yAxis' : 'xAxis'), rax = (defined(A.options[a]) ?
                    chart[a][A.options[a]] :
                    chart[a][0]);
                if (axis === rax) {
                    axes.push(A);
                }
            }
        });
        // Remove duplicates in the axes array. If there are no axes in the axes
        // array, we are adding an axis without data, so we need to populate
        // this with grid lines (#2796).
        uniqueAxes = axes.length ?
            [] :
            [axis.isXAxis ? chart.yAxis[0] : chart.xAxis[0]]; // #3742
        axes.forEach(function (axis2) {
            if (uniqueAxes.indexOf(axis2) === -1 &&
                // Do not draw on axis which overlap completely. #5424
                !find(uniqueAxes, function (unique) {
                    return unique.pos === axis2.pos && unique.len === axis2.len;
                })) {
                uniqueAxes.push(axis2);
            }
        });
        transVal = pick(translatedValue, axis.translate(value, null, null, e.old));
        if (isNumber(transVal)) {
            if (axis.horiz) {
                uniqueAxes.forEach(function (axis2) {
                    var skip;
                    y1 = axis2.pos;
                    y2 = y1 + axis2.len;
                    x1 = x2 = Math.round(transVal + axis.transB);
                    // outside plot area
                    if (force !== 'pass' &&
                        (x1 < axisLeft || x1 > axisLeft + axis.width)) {
                        if (force) {
                            x1 = x2 = clamp(x1, axisLeft, axisLeft + axis.width);
                        }
                        else {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        result.push(['M', x1, y1], ['L', x2, y2]);
                    }
                });
            }
            else {
                uniqueAxes.forEach(function (axis2) {
                    var skip;
                    x1 = axis2.pos;
                    x2 = x1 + axis2.len;
                    y1 = y2 = Math.round(axisTop + axis.height - transVal);
                    // outside plot area
                    if (force !== 'pass' &&
                        (y1 < axisTop || y1 > axisTop + axis.height)) {
                        if (force) {
                            y1 = y2 = clamp(y1, axisTop, axisTop + axis.height);
                        }
                        else {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        result.push(['M', x1, y1], ['L', x2, y2]);
                    }
                });
            }
        }
        e.path = result.length > 0 ?
            renderer.crispPolyLine(result, e.lineWidth || 1) :
            // #3557 getPlotLinePath in regular Highcharts also returns null
            null;
    }
});
/**
 * Function to crisp a line with multiple segments
 *
 * @private
 * @function Highcharts.SVGRenderer#crispPolyLine
 */
SVGRenderer.prototype.crispPolyLine = function (points, width) {
    // points format: [['M', 0, 0], ['L', 100, 0]]
    // normalize to a crisp line
    for (var i = 0; i < points.length; i = i + 2) {
        var start = points[i], end = points[i + 1];
        if (start[1] === end[1]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            start[1] = end[1] =
                Math.round(start[1]) - (width % 2 / 2);
        }
        if (start[2] === end[2]) {
            start[2] = end[2] =
                Math.round(start[2]) + (width % 2 / 2);
        }
    }
    return points;
};
// Wrapper to hide the label
addEvent(Axis, 'afterHideCrosshair', function () {
    if (this.crossLabel) {
        this.crossLabel = this.crossLabel.hide();
    }
});
// Extend crosshairs to also draw the label
addEvent(Axis, 'afterDrawCrosshair', function (event) {
    // Check if the label has to be drawn
    if (!this.crosshair ||
        !this.crosshair.label ||
        !this.crosshair.label.enabled ||
        !this.cross ||
        !isNumber(this.min) ||
        !isNumber(this.max)) {
        return;
    }
    var chart = this.chart, log = this.logarithmic, options = this.crosshair.label, // the label's options
    horiz = this.horiz, // axis orientation
    opposite = this.opposite, // axis position
    left = this.left, // left position
    top = this.top, // top position
    crossLabel = this.crossLabel, // the svgElement
    posx, posy, crossBox, formatOption = options.format, formatFormat = '', limit, align, tickInside = this.options.tickPosition === 'inside', snap = this.crosshair.snap !== false, offset = 0, 
    // Use last available event (#5287)
    e = event.e || (this.cross && this.cross.e), point = event.point, min = this.min, max = this.max;
    if (log) {
        min = log.lin2log(min);
        max = log.lin2log(max);
    }
    align = (horiz ? 'center' : opposite ?
        (this.labelAlign === 'right' ? 'right' : 'left') :
        (this.labelAlign === 'left' ? 'left' : 'center'));
    // If the label does not exist yet, create it.
    if (!crossLabel) {
        crossLabel = this.crossLabel = chart.renderer
            .label('', 0, void 0, options.shape || 'callout')
            .addClass('highcharts-crosshair-label highcharts-color-' + (point ?
            point.series.colorIndex :
            this.series[0] && this.series[0].colorIndex))
            .attr({
            align: options.align || align,
            padding: pick(options.padding, 8),
            r: pick(options.borderRadius, 3),
            zIndex: 2
        })
            .add(this.labelGroup);
        // Presentational
        if (!chart.styledMode) {
            crossLabel
                .attr({
                fill: options.backgroundColor ||
                    point && point.series && point.series.color || // #14888
                    "#666666" /* neutralColor60 */,
                stroke: options.borderColor || '',
                'stroke-width': options.borderWidth || 0
            })
                .css(extend({
                color: "#ffffff" /* backgroundColor */,
                fontWeight: 'normal',
                fontSize: '11px',
                textAlign: 'center'
            }, options.style || {}));
        }
    }
    if (horiz) {
        posx = snap ? (point.plotX || 0) + left : e.chartX;
        posy = top + (opposite ? 0 : this.height);
    }
    else {
        posx = opposite ? this.width + left : 0;
        posy = snap ? (point.plotY || 0) + top : e.chartY;
    }
    if (!formatOption && !options.formatter) {
        if (this.dateTime) {
            formatFormat = '%b %d, %Y';
        }
        formatOption =
            '{value' + (formatFormat ? ':' + formatFormat : '') + '}';
    }
    // Show the label
    var value = snap ?
        (this.isXAxis ? point.x : point.y) :
        this.toValue(horiz ? e.chartX : e.chartY);
    // Crosshair should be rendered within Axis range (#7219). Also, the point
    // of currentPriceIndicator should be inside the plot area, #14879.
    var isInside = point ?
        point.series.isPointInside(point) :
        (isNumber(value) && value > min && value < max);
    var text = '';
    if (formatOption) {
        text = format(formatOption, { value: value }, chart);
    }
    else if (options.formatter && isNumber(value)) {
        text = options.formatter.call(this, value);
    }
    crossLabel.attr({
        text: text,
        x: posx,
        y: posy,
        visibility: isInside ? 'visible' : 'hidden'
    });
    crossBox = crossLabel.getBBox();
    // now it is placed we can correct its position
    if (isNumber(crossLabel.y)) {
        if (horiz) {
            if ((tickInside && !opposite) || (!tickInside && opposite)) {
                posy = crossLabel.y - crossBox.height;
            }
        }
        else {
            posy = crossLabel.y - (crossBox.height / 2);
        }
    }
    // check the edges
    if (horiz) {
        limit = {
            left: left - crossBox.x,
            right: left + this.width - crossBox.x
        };
    }
    else {
        limit = {
            left: this.labelAlign === 'left' ? left : 0,
            right: this.labelAlign === 'right' ?
                left + this.width :
                chart.chartWidth
        };
    }
    // left edge
    if (crossLabel.translateX < limit.left) {
        offset = limit.left - crossLabel.translateX;
    }
    // right edge
    if (crossLabel.translateX + crossBox.width >= limit.right) {
        offset = -(crossLabel.translateX + crossBox.width - limit.right);
    }
    // show the crosslabel
    crossLabel.attr({
        x: posx + offset,
        y: posy,
        // First set x and y, then anchorX and anchorY, when box is actually
        // calculated, #5702
        anchorX: horiz ?
            posx :
            (this.opposite ? 0 : chart.chartWidth),
        anchorY: horiz ?
            (this.opposite ? chart.chartHeight : 0) :
            posy + crossBox.height / 2
    });
});
/**
 * Based on the data grouping options decides whether
 * the data should be cropped while processing.
 *
 * @ignore
 * @function Highcharts.Series#forceCropping
 */
Series.prototype.forceCropping = function () {
    var chart = this.chart, options = this.options, dataGroupingOptions = options.dataGrouping, groupingEnabled = this.allowDG !== false && dataGroupingOptions &&
        pick(dataGroupingOptions.enabled, chart.options.isStock);
    return groupingEnabled;
};
addEvent(Chart, 'update', function (e) {
    var options = e.options;
    // Use case: enabling scrollbar from a disabled state.
    // Scrollbar needs to be initialized from a controller, Navigator in this
    // case (#6615)
    if ('scrollbar' in options && this.navigator) {
        merge(true, this.options.scrollbar, options.scrollbar);
        this.navigator.update({}, false);
        delete options.scrollbar;
    }
});
/* *
 *
 *  Default Export
 *
 * */
export default StockChart;
