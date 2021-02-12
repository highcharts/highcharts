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
import Axis from '../Axis/Axis.js';
import Chart from '../Chart/Chart.js';
import H from '../Globals.js';
import palette from '../../Core/Color/Palette.js';
import Point from '../Series/Point.js';
var pointTooltipFormatter = Point.prototype.tooltipFormatter;
import Series from '../Series/Series.js';
var _a = Series.prototype, seriesInit = _a.init, seriesProcessData = _a.processData;
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, arrayMax = U.arrayMax, arrayMin = U.arrayMin, clamp = U.clamp, defined = U.defined, extend = U.extend, find = U.find, format = U.format, getOptions = U.getOptions, isNumber = U.isNumber, isString = U.isString, merge = U.merge, pick = U.pick, splat = U.splat;
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
/* eslint-disable no-invalid-this, valid-jsdoc */
/* *
 *
 *  Factory
 *
 * */
/**
 * Factory function for creating new stock charts. Creates a new
 * {@link Highcharts.Chart|Chart} object with different default options than the
 * basic Chart.
 *
 * @example
 * var chart = Highcharts.stockChart('container', {
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
 *        A function to execute when the chart object is finished loading and
 *        rendering. In most cases the chart is built in one thread, but in
 *        Internet Explorer version 8 or less the chart is sometimes
 *        initialized before the document is ready, and in these cases the
 *        chart object will not be finished synchronously. As a consequence,
 *        code that relies on the newly built Chart object should always run in
 *        the callback. Defining a
 *        [chart.events.load](https://api.highcharts.com/highstock/chart.events.load)
 *        handler is equivalent.
 *
 * @return {Highcharts.Chart}
 *         The chart object.
 */
function stockChart(a, b, c) {
    var hasRenderToArg = isString(a) || a.nodeName, options = arguments[hasRenderToArg ? 1 : 0], userOptions = options, 
    // to increase performance, don't merge the data
    seriesOptions = options.series, defaultOptions = getOptions(), opposite, 
    // Always disable startOnTick:true on the main axis when the navigator
    // is enabled (#1090)
    navigatorEnabled = pick(options.navigator && options.navigator.enabled, defaultOptions.navigator.enabled, true);
    // apply X axis options to both single and multi y axes
    options.xAxis = splat(options.xAxis || {}).map(function (xAxisOptions, i) {
        return merge({
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
        }, defaultOptions.xAxis, // #3802
        defaultOptions.xAxis && defaultOptions.xAxis[i], // #7690
        xAxisOptions, // user options
        {
            type: 'datetime',
            categories: null
        }, (navigatorEnabled ? {
            startOnTick: false,
            endOnTick: false
        } : null));
    });
    // apply Y axis options to both single and multi y axes
    options.yAxis = splat(options.yAxis || {}).map(function (yAxisOptions, i) {
        opposite = pick(yAxisOptions.opposite, true);
        return merge({
            labels: {
                y: -2
            },
            opposite: opposite,
            /**
             * @default {highcharts} true
             * @default {highstock} false
             * @apioption yAxis.showLastLabel
             *
             * @private
             */
            showLastLabel: !!(
            // #6104, show last label by default for category axes
            yAxisOptions.categories ||
                yAxisOptions.type === 'category'),
            title: {
                text: null
            }
        }, defaultOptions.yAxis, // #3802
        defaultOptions.yAxis && defaultOptions.yAxis[i], // #7690
        yAxisOptions // user options
        );
    });
    options.series = null;
    options = merge({
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
            enabled: pick(defaultOptions.scrollbar.enabled, true)
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
    }, options, // user's options
    {
        isStock: true // internal flag
    });
    options.series = userOptions.series = seriesOptions;
    return hasRenderToArg ?
        new Chart(a, options, c) :
        new Chart(options, b);
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
 * @param {Highcharts.SVGPathArray} points
 * @param {number} width
 * @return {Highcharts.SVGPathArray}
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
    if (!defined(this.crosshair.label) ||
        !this.crosshair.label.enabled ||
        !this.cross) {
        return;
    }
    var chart = this.chart, log = this.logarithmic, options = this.options.crosshair.label, // the label's options
    horiz = this.horiz, // axis orientation
    opposite = this.opposite, // axis position
    left = this.left, // left position
    top = this.top, // top position
    crossLabel = this.crossLabel, // the svgElement
    posx, posy, crossBox, formatOption = options.format, formatFormat = '', limit, align, tickInside = this.options.tickPosition === 'inside', snap = this.crosshair.snap !== false, value, offset = 0, 
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
            .label(null, null, null, options.shape || 'callout')
            .addClass('highcharts-crosshair-label' + (this.series[0] &&
            ' highcharts-color-' + this.series[0].colorIndex))
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
                    (this.series[0] && this.series[0].color) ||
                    palette.neutralColor60,
                stroke: options.borderColor || '',
                'stroke-width': options.borderWidth || 0
            })
                .css(extend({
                color: palette.backgroundColor,
                fontWeight: 'normal',
                fontSize: '11px',
                textAlign: 'center'
            }, options.style));
        }
    }
    if (horiz) {
        posx = snap ? point.plotX + left : e.chartX;
        posy = top + (opposite ? 0 : this.height);
    }
    else {
        posx = opposite ? this.width + left : 0;
        posy = snap ? point.plotY + top : e.chartY;
    }
    if (!formatOption && !options.formatter) {
        if (this.dateTime) {
            formatFormat = '%b %d, %Y';
        }
        formatOption =
            '{value' + (formatFormat ? ':' + formatFormat : '') + '}';
    }
    // Show the label
    value = snap ?
        point[this.isXAxis ? 'x' : 'y'] :
        this.toValue(horiz ? e.chartX : e.chartY);
    crossLabel.attr({
        text: formatOption ?
            format(formatOption, { value: value }, chart) :
            options.formatter.call(this, value),
        x: posx,
        y: posy,
        // Crosshair should be rendered within Axis range (#7219)
        visibility: value < min || value > max ?
            'hidden' :
            'visible'
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
/* ************************************************************************** *
 *  Start value compare logic                                                 *
 * ************************************************************************** */
/**
 * Extend series.init by adding a method to modify the y value used for plotting
 * on the y axis. This method is called both from the axis when finding dataMin
 * and dataMax, and from the series.translate method.
 *
 * @ignore
 * @function Highcharts.Series#init
 */
Series.prototype.init = function () {
    // Call base method
    seriesInit.apply(this, arguments);
    // Set comparison mode
    this.initCompare(this.options.compare);
};
/**
 * Highstock only. Set the
 * [compare](https://api.highcharts.com/highstock/plotOptions.series.compare)
 * mode of the series after render time. In most cases it is more useful running
 * {@link Axis#setCompare} on the X axis to update all its series.
 *
 * @function Highcharts.Series#setCompare
 *
 * @param {string} [compare]
 *        Can be one of `null` (default), `"percent"` or `"value"`.
 */
Series.prototype.setCompare = function (compare) {
    this.initCompare(compare);
    // Survive to export, #5485
    this.userOptions.compare = compare;
};
/**
 * @ignore
 * @function Highcharts.Series#initCompare
 *
 * @param {string} [compare]
 *        Can be one of `null` (default), `"percent"` or `"value"`.
 */
Series.prototype.initCompare = function (compare) {
    // Set or unset the modifyValue method
    this.modifyValue = (compare === 'value' || compare === 'percent') ?
        function (value, point) {
            var compareValue = this.compareValue;
            if (typeof value !== 'undefined' &&
                typeof compareValue !== 'undefined') { // #2601, #5814
                // Get the modified value
                if (compare === 'value') {
                    value -= compareValue;
                    // Compare percent
                }
                else {
                    value = 100 * (value / compareValue) -
                        (this.options.compareBase === 100 ? 0 : 100);
                }
                // record for tooltip etc.
                if (point) {
                    point.change = value;
                }
                return value;
            }
            return 0;
        } :
        null;
    // Mark dirty
    if (this.chart.hasRendered) {
        this.isDirty = true;
    }
};
/**
 * Extend series.processData by finding the first y value in the plot area,
 * used for comparing the following values
 *
 * @ignore
 * @function Highcharts.Series#processData
 */
Series.prototype.processData = function (force) {
    var series = this, i, keyIndex = -1, processedXData, processedYData, compareStart = series.options.compareStart === true ? 0 : 1, length, compareValue;
    // call base method
    seriesProcessData.apply(this, arguments);
    if (series.xAxis && series.processedYData) { // not pies
        // local variables
        processedXData = series.processedXData;
        processedYData = series.processedYData;
        length = processedYData.length;
        // For series with more than one value (range, OHLC etc), compare
        // against close or the pointValKey (#4922, #3112, #9854)
        if (series.pointArrayMap) {
            keyIndex = series.pointArrayMap.indexOf(series.options.pointValKey || series.pointValKey || 'y');
        }
        // find the first value for comparison
        for (i = 0; i < length - compareStart; i++) {
            compareValue = processedYData[i] && keyIndex > -1 ?
                processedYData[i][keyIndex] :
                processedYData[i];
            if (isNumber(compareValue) &&
                processedXData[i + compareStart] >=
                    series.xAxis.min &&
                compareValue !== 0) {
                series.compareValue = compareValue;
                break;
            }
        }
    }
    return;
};
// Modify series extremes
addEvent(Series, 'afterGetExtremes', function (e) {
    var dataExtremes = e.dataExtremes;
    if (this.modifyValue && dataExtremes) {
        var extremes = [
            this.modifyValue(dataExtremes.dataMin),
            this.modifyValue(dataExtremes.dataMax)
        ];
        dataExtremes.dataMin = arrayMin(extremes);
        dataExtremes.dataMax = arrayMax(extremes);
    }
});
/**
 * Highstock only. Set the compare mode on all series belonging to an Y axis
 * after render time.
 *
 * @see [series.plotOptions.compare](https://api.highcharts.com/highstock/series.plotOptions.compare)
 *
 * @sample stock/members/axis-setcompare/
 *         Set compoare
 *
 * @function Highcharts.Axis#setCompare
 *
 * @param {string} [compare]
 *        The compare mode. Can be one of `null` (default), `"value"` or
 *        `"percent"`.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart or to wait for a later call to
 *        {@link Chart#redraw}.
 */
Axis.prototype.setCompare = function (compare, redraw) {
    if (!this.isXAxis) {
        this.series.forEach(function (series) {
            series.setCompare(compare);
        });
        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }
};
/**
 * Extend the tooltip formatter by adding support for the point.change variable
 * as well as the changeDecimals option.
 *
 * @ignore
 * @function Highcharts.Point#tooltipFormatter
 *
 * @param {string} pointFormat
 */
Point.prototype.tooltipFormatter = function (pointFormat) {
    var point = this;
    var numberFormatter = point.series.chart.numberFormatter;
    pointFormat = pointFormat.replace('{point.change}', (point.change > 0 ? '+' : '') + numberFormatter(point.change, pick(point.series.tooltipOptions.changeDecimals, 2)));
    return pointTooltipFormatter.apply(this, [pointFormat]);
};
/* ************************************************************************** *
 *  End value compare logic                                                   *
 * ************************************************************************** */
// Extend the Series prototype to create a separate series clip box. This is
// related to using multiple panes, and a future pane logic should incorporate
// this feature (#2754).
addEvent(Series, 'render', function () {
    var chart = this.chart, clipHeight;
    // Only do this on not 3d (#2939, #5904) nor polar (#6057) charts, and only
    // if the series type handles clipping in the animate method (#2975).
    if (!(chart.is3d && chart.is3d()) &&
        !chart.polar &&
        this.xAxis &&
        !this.xAxis.isRadial // Gauge, #6192
    ) {
        clipHeight = this.yAxis.len;
        // Include xAxis line width (#8031) but only if the Y axis ends on the
        // edge of the X axis (#11005).
        if (this.xAxis.axisLine) {
            var dist = chart.plotTop + chart.plotHeight -
                this.yAxis.pos - this.yAxis.len, lineHeightCorrection = Math.floor(this.xAxis.axisLine.strokeWidth() / 2);
            if (dist >= 0) {
                clipHeight -= Math.max(lineHeightCorrection - dist, 0);
            }
        }
        // First render, initial clip box
        if (!this.clipBox && this.isDirty && !this.isDirtyData) {
            this.clipBox = merge(chart.clipBox);
            this.clipBox.width = this.xAxis.len;
            this.clipBox.height = clipHeight;
            // On redrawing, resizing etc, update the clip rectangle
        }
        else if (chart[this.sharedClipKey]) {
            // animate in case resize is done during initial animation
            chart[this.sharedClipKey].animate({
                width: this.xAxis.len,
                height: clipHeight
            });
            // also change markers clip animation for consistency
            // (marker clip rects should exist only on chart init)
            if (chart[this.sharedClipKey + 'm']) {
                chart[this.sharedClipKey + 'm'].animate({
                    width: this.xAxis.len
                });
            }
        }
    }
});
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
 *  Compatibility
 *
 * */
H.StockChart = H.stockChart = stockChart;
/* *
 *
 *  Default Export
 *
 * */
export default stockChart;
/* *
 *
 *  API Options
 *
 * */
/**
 * Compare the values of the series against the first non-null, non-
 * zero value in the visible range. The y axis will show percentage
 * or absolute change depending on whether `compare` is set to `"percent"`
 * or `"value"`. When this is applied to multiple series, it allows
 * comparing the development of the series against each other. Adds
 * a `change` field to every point object.
 *
 * @see [compareBase](#plotOptions.series.compareBase)
 * @see [Axis.setCompare()](/class-reference/Highcharts.Axis#setCompare)
 *
 * @sample {highstock} stock/plotoptions/series-compare-percent/
 *         Percent
 * @sample {highstock} stock/plotoptions/series-compare-value/
 *         Value
 *
 * @type      {string}
 * @since     1.0.1
 * @product   highstock
 * @apioption plotOptions.series.compare
 */
/**
 * Defines if comparison should start from the first point within the visible
 * range or should start from the first point **before** the range.
 *
 * In other words, this flag determines if first point within the visible range
 * will have 0% (`compareStart=true`) or should have been already calculated
 * according to the previous point (`compareStart=false`).
 *
 * @sample {highstock} stock/plotoptions/series-comparestart/
 *         Calculate compare within visible range
 *
 * @type      {boolean}
 * @default   false
 * @since     6.0.0
 * @product   highstock
 * @apioption plotOptions.series.compareStart
 */
/**
 * When [compare](#plotOptions.series.compare) is `percent`, this option
 * dictates whether to use 0 or 100 as the base of comparison.
 *
 * @sample {highstock} stock/plotoptions/series-comparebase/
 *         Compare base is 100
 *
 * @type       {number}
 * @default    0
 * @since      5.0.6
 * @product    highstock
 * @validvalue [0, 100]
 * @apioption  plotOptions.series.compareBase
 */
''; // keeps doclets above in transpiled file
