/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Chart.js';
import './Axis.js';
import './Point.js';
import './Pointer.js';
import './Series.js';
import './SvgRenderer.js';
var addEvent = H.addEvent,
    arrayMax = H.arrayMax,
    arrayMin = H.arrayMin,
    Axis = H.Axis,
    Chart = H.Chart,
    defined = H.defined,
    each = H.each,
    extend = H.extend,
    format = H.format,
    grep = H.grep,
    inArray = H.inArray,
    isNumber = H.isNumber,
    isString = H.isString,
    map = H.map,
    merge = H.merge,
    pick = H.pick,
    Point = H.Point,
    Renderer = H.Renderer,
    Series = H.Series,
    splat = H.splat,
    SVGRenderer = H.SVGRenderer,
    VMLRenderer = H.VMLRenderer,
    wrap = H.wrap,


    seriesProto = Series.prototype,
    seriesInit = seriesProto.init,
    seriesProcessData = seriesProto.processData,
    pointTooltipFormatter = Point.prototype.tooltipFormatter;


/**
 * Compare the values of the series against the first non-null, non-
 * zero value in the visible range. The y axis will show percentage
 * or absolute change depending on whether `compare` is set to `"percent"`
 * or `"value"`. When this is applied to multiple series, it allows
 * comparing the development of the series against each other. Adds
 * a `change` field to every point object.
 *
 * @type {String}
 * @see [compareBase](#plotOptions.series.compareBase),
 *      [Axis.setCompare()](/class-reference/Highcharts.Axis#setCompare)
 * @sample {highstock} stock/plotoptions/series-compare-percent/ Percent
 * @sample {highstock} stock/plotoptions/series-compare-value/ Value
 * @default undefined
 * @since 1.0.1
 * @product highstock
 * @apioption plotOptions.series.compare
 */

/**
 * Defines if comparison should start from the first point within the visible
 * range or should start from the first point <b>before</b> the range.
 * In other words, this flag determines if first point within the visible range
 * will have 0% (`compareStart=true`) or should have been already calculated
 * according to the previous point (`compareStart=false`).
 *
 * @type {Boolean}
 * @sample {highstock} stock/plotoptions/series-comparestart/
 *         Calculate compare within visible range
 * @default false
 * @since 6.0.0
 * @product highstock
 * @apioption plotOptions.series.compareStart
 */

/**
 * When [compare](#plotOptions.series.compare) is `percent`, this option
 * dictates whether to use 0 or 100 as the base of comparison.
 *
 * @validvalue [0, 100]
 * @type {Number}
 * @sample {highstock} / Compare base is 100
 * @default 0
 * @since 5.0.6
 * @product highstock
 * @apioption plotOptions.series.compareBase
 */

/**
 * Factory function for creating new stock charts. Creates a new {@link Chart|
 * Chart} object with different default options than the basic Chart.
 *
 * @function #stockChart
 * @memberof Highcharts
 *
 * @param  {String|HTMLDOMElement} renderTo
 *         The DOM element to render to, or its id.
 * @param  {Options} options
 *         The chart options structure as described in the {@link
 *         https://api.highcharts.com/highstock|options reference}.
 * @param  {Function} callback
 *         A function to execute when the chart object is finished loading and
 *         rendering. In most cases the chart is built in one thread, but in
 *         Internet Explorer version 8 or less the chart is sometimes
 *         initialized before the document is ready, and in these cases the
 *         chart object will not be finished synchronously. As a consequence,
 *         code that relies on the newly built Chart object should always run in
 *         the callback. Defining a {@link https://api.highcharts.com/highstock/chart.events.load|
 *         chart.event.load} handler is equivalent.
 *
 * @return {Chart}
 *         The chart object.
 *
 * @example
 * var chart = Highcharts.stockChart('container', {
 *     series: [{
 *         data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *         pointInterval: 24 * 60 * 60 * 1000
 *     }]
 * });
 */
H.StockChart = H.stockChart = function (a, b, c) {
    var hasRenderToArg = isString(a) || a.nodeName,
        options = arguments[hasRenderToArg ? 1 : 0],
        // to increase performance, don't merge the data
        seriesOptions = options.series,
        defaultOptions = H.getOptions(),
        opposite,

        // Always disable startOnTick:true on the main axis when the navigator
        // is enabled (#1090)
        navigatorEnabled = pick(
            options.navigator && options.navigator.enabled,
            defaultOptions.navigator.enabled,
            true
        ),
        disableStartOnTick = navigatorEnabled ? {
            startOnTick: false,
            endOnTick: false
        } : null,

        lineOptions = {

            marker: {
                enabled: false,
                radius: 2
            }
            // gapSize: 0
        },
        columnOptions = {
            shadow: false,
            borderWidth: 0
        };

    // apply X axis options to both single and multi y axes
    options.xAxis = map(splat(options.xAxis || {}), function (xAxisOptions, i) {
        return merge(
            { // defaults
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
            },
            defaultOptions.xAxis, // #3802
            defaultOptions.xAxis && defaultOptions.xAxis[i], // #7690
            xAxisOptions, // user options
            { // forced options
                type: 'datetime',
                categories: null
            },
            disableStartOnTick
        );
    });

    // apply Y axis options to both single and multi y axes
    options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions, i) {
        opposite = pick(yAxisOptions.opposite, true);
        return merge({ // defaults
            labels: {
                y: -2
            },
            opposite: opposite,

            /**
             * @default {highcharts} true
             * @default {highstock} false
             * @apioption yAxis.showLastLabel
             */
            showLastLabel: !!(
                // #6104, show last label by default for category axes
                yAxisOptions.categories ||
                yAxisOptions.type === 'category'
            ),

            title: {
                text: null
            }
        },
        defaultOptions.yAxis, // #3802
        defaultOptions.yAxis && defaultOptions.yAxis[i], // #7690
        yAxisOptions // user options
        );
    });

    options.series = null;

    options = merge(
        {
            chart: {
                panning: true,
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
            },

            plotOptions: {
                line: lineOptions,
                spline: lineOptions,
                area: lineOptions,
                areaspline: lineOptions,
                arearange: lineOptions,
                areasplinerange: lineOptions,
                column: columnOptions,
                columnrange: columnOptions,
                candlestick: columnOptions,
                ohlc: columnOptions
            }

        },

        options, // user's options

        { // forced options
            isStock: true // internal flag
        }
    );

    options.series = seriesOptions;

    return hasRenderToArg ?
        new Chart(a, options, c) :
        new Chart(options, b);
};

// Override the automatic label alignment so that the first Y axis' labels
// are drawn on top of the grid line, and subsequent axes are drawn outside
wrap(Axis.prototype, 'autoLabelAlign', function (proceed) {
    var chart = this.chart,
        options = this.options,
        panes = chart._labelPanes = chart._labelPanes || {},
        key,
        labelOptions = this.options.labels;
    if (this.chart.options.isStock && this.coll === 'yAxis') {
        key = options.top + ',' + options.height;
        // do it only for the first Y axis of each pane
        if (!panes[key] && labelOptions.enabled) {
            if (labelOptions.x === 15) { // default
                labelOptions.x = 0;
            }
            if (labelOptions.align === undefined) {
                labelOptions.align = 'right';
            }
            panes[key] = this;
            return 'right';
        }
    }
    return proceed.apply(this, [].slice.call(arguments, 1));
});

// Clear axis from label panes (#6071)
addEvent(Axis, 'destroy', function () {
    var chart = this.chart,
        key = this.options && (this.options.top + ',' + this.options.height);

    if (key && chart._labelPanes && chart._labelPanes[key] === this) {
        delete chart._labelPanes[key];
    }
});

// Override getPlotLinePath to allow for multipane charts
wrap(Axis.prototype, 'getPlotLinePath', function (
    proceed,
    value,
    lineWidth,
    old,
    force,
    translatedValue
) {
    var axis = this,
        series = (
            this.isLinked && !this.series ?
                this.linkedParent.series :
                this.series
        ),
        chart = axis.chart,
        renderer = chart.renderer,
        axisLeft = axis.left,
        axisTop = axis.top,
        x1,
        y1,
        x2,
        y2,
        result = [],
        axes = [], // #3416 need a default array
        axes2,
        uniqueAxes,
        transVal;

    /**
     * Return the other axis based on either the axis option or on related
     * series.
     */
    function getAxis(coll) {
        var otherColl = coll === 'xAxis' ? 'yAxis' : 'xAxis',
            opt = axis.options[otherColl];

        // Other axis indexed by number
        if (isNumber(opt)) {
            return [chart[otherColl][opt]];
        }

        // Other axis indexed by id (like navigator)
        if (isString(opt)) {
            return [chart.get(opt)];
        }

        // Auto detect based on existing series
        return map(series, function (s) {
            return s[otherColl];
        });
    }

    // Ignore in case of colorAxis or zAxis. #3360, #3524, #6720
    if (axis.coll !== 'xAxis' && axis.coll !== 'yAxis') {
        return proceed.apply(this, [].slice.call(arguments, 1));
    }

    // Get the related axes based on series
    axes = getAxis(axis.coll);

    // Get the related axes based options.*Axis setting #2810
    axes2 = (axis.isXAxis ? chart.yAxis : chart.xAxis);
    each(axes2, function (A) {
        if (
            defined(A.options.id) ?
                A.options.id.indexOf('navigator') === -1 :
                true
        ) {
            var a = (A.isXAxis ? 'yAxis' : 'xAxis'),
                rax = (
                    defined(A.options[a]) ?
                        chart[a][A.options[a]] :
                        chart[a][0]
                );

            if (axis === rax) {
                axes.push(A);
            }
        }
    });


    // Remove duplicates in the axes array. If there are no axes in the axes
    // array, we are adding an axis without data, so we need to populate this
    // with grid lines (#2796).
    uniqueAxes = axes.length ?
        [] :
        [axis.isXAxis ? chart.yAxis[0] : chart.xAxis[0]]; // #3742
    each(axes, function (axis2) {
        if (
            inArray(axis2, uniqueAxes) === -1 &&
            // Do not draw on axis which overlap completely. #5424
            !H.find(uniqueAxes, function (unique) {
                return unique.pos === axis2.pos && unique.len === axis2.len;
            })
        ) {
            uniqueAxes.push(axis2);
        }
    });

    transVal = pick(translatedValue, axis.translate(value, null, null, old));
    if (isNumber(transVal)) {
        if (axis.horiz) {
            each(uniqueAxes, function (axis2) {
                var skip;

                y1 = axis2.pos;
                y2 = y1 + axis2.len;
                x1 = x2 = Math.round(transVal + axis.transB);

                // outside plot area
                if (
                    force !== 'pass' &&
                    (x1 < axisLeft || x1 > axisLeft + axis.width)
                ) {
                    if (force) {
                        x1 = x2 = Math.min(
                            Math.max(axisLeft, x1),
                            axisLeft + axis.width
                        );
                    } else {
                        skip = true;
                    }
                }
                if (!skip) {
                    result.push('M', x1, y1, 'L', x2, y2);
                }
            });
        } else {
            each(uniqueAxes, function (axis2) {
                var skip;

                x1 = axis2.pos;
                x2 = x1 + axis2.len;
                y1 = y2 = Math.round(axisTop + axis.height - transVal);

                // outside plot area
                if (
                    force !== 'pass' &&
                    (y1 < axisTop || y1 > axisTop + axis.height)
                ) {
                    if (force) {
                        y1 = y2 = Math.min(
                            Math.max(axisTop, y1),
                            axis.top + axis.height
                        );
                    } else {
                        skip = true;
                    }
                }
                if (!skip) {
                    result.push('M', x1, y1, 'L', x2, y2);
                }
            });
        }
    }
    return result.length > 0 ?
        renderer.crispPolyLine(result, lineWidth || 1) :
        null; // #3557 getPlotLinePath in regular Highcharts also returns null
});

// Function to crisp a line with multiple segments
SVGRenderer.prototype.crispPolyLine = function (points, width) {
    // points format: ['M', 0, 0, 'L', 100, 0]
    // normalize to a crisp line
    var i;
    for (i = 0; i < points.length; i = i + 6) {
        if (points[i + 1] === points[i + 4]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            points[i + 1] = points[i + 4] =
                Math.round(points[i + 1]) - (width % 2 / 2);
        }
        if (points[i + 2] === points[i + 5]) {
            points[i + 2] = points[i + 5] =
                Math.round(points[i + 2]) + (width % 2 / 2);
        }
    }
    return points;
};
/*= if (build.classic) { =*/
if (Renderer === VMLRenderer) {
    VMLRenderer.prototype.crispPolyLine = SVGRenderer.prototype.crispPolyLine;
}
/*= } =*/

// Wrapper to hide the label
wrap(Axis.prototype, 'hideCrosshair', function (proceed, i) {

    proceed.call(this, i);

    if (this.crossLabel) {
        this.crossLabel = this.crossLabel.hide();
    }
});

// Extend crosshairs to also draw the label
addEvent(Axis, 'afterDrawCrosshair', function (event) {

    // Check if the label has to be drawn
    if (
        !defined(this.crosshair.label) ||
        !this.crosshair.label.enabled ||
        !this.cross
    ) {
        return;
    }

    var chart = this.chart,
        options = this.options.crosshair.label,        // the label's options
        horiz = this.horiz,                            // axis orientation
        opposite = this.opposite,                    // axis position
        left = this.left,                            // left position
        top = this.top,                                // top position
        crossLabel = this.crossLabel,                // the svgElement
        posx,
        posy,
        crossBox,
        formatOption = options.format,
        formatFormat = '',
        limit,
        align,
        tickInside = this.options.tickPosition === 'inside',
        snap = this.crosshair.snap !== false,
        value,
        offset = 0,
        // Use last available event (#5287)
        e = event.e || (this.cross && this.cross.e),
        point = event.point,
        lin2log = this.lin2log,
        min,
        max;

    if (this.isLog) {
        min = lin2log(this.min);
        max = lin2log(this.max);
    } else {
        min = this.min;
        max = this.max;
    }

    align = (horiz ? 'center' : opposite ?
        (this.labelAlign === 'right' ? 'right' : 'left') :
        (this.labelAlign === 'left' ? 'left' : 'center'));

    // If the label does not exist yet, create it.
    if (!crossLabel) {
        crossLabel = this.crossLabel = chart.renderer.label(
                null,
                null,
                null,
                options.shape || 'callout'
            )
            .addClass('highcharts-crosshair-label' + (
                this.series[0] &&
                ' highcharts-color-' + this.series[0].colorIndex)
            )
            .attr({
                align: options.align || align,
                padding: pick(options.padding, 8),
                r: pick(options.borderRadius, 3),
                zIndex: 2
            })
            .add(this.labelGroup);

        /*= if (build.classic) { =*/
        // Presentational
        crossLabel
            .attr({
                fill: options.backgroundColor ||
                    (this.series[0] && this.series[0].color) ||
                    '${palette.neutralColor60}',
                stroke: options.borderColor || '',
                'stroke-width': options.borderWidth || 0
            })
            .css(extend({
                color: '${palette.backgroundColor}',
                fontWeight: 'normal',
                fontSize: '11px',
                textAlign: 'center'
            }, options.style));
        /*= } =*/
    }

    if (horiz) {
        posx = snap ? point.plotX + left : e.chartX;
        posy = top + (opposite ? 0 : this.height);
    } else {
        posx = opposite ? this.width + left : 0;
        posy = snap ? point.plotY + top : e.chartY;
    }

    if (!formatOption && !options.formatter) {
        if (this.isDatetimeAxis) {
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
            format(formatOption, { value: value }, chart.time) :
            options.formatter.call(this, value),
        x: posx,
        y: posy,
        // Crosshair should be rendered within Axis range (#7219)
        visibility: value < min || value > max ? 'hidden' : 'visible'
    });

    crossBox = crossLabel.getBBox();

    // now it is placed we can correct its position
    if (horiz) {
        if ((tickInside && !opposite) || (!tickInside && opposite)) {
            posy = crossLabel.y - crossBox.height;
        }
    } else {
        posy = crossLabel.y - (crossBox.height / 2);
    }

    // check the edges
    if (horiz) {
        limit = {
            left: left - crossBox.x,
            right: left + this.width - crossBox.x
        };
    } else {
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

/* ****************************************************************************
 * Start value compare logic                                                  *
 *****************************************************************************/

/**
 * Extend series.init by adding a method to modify the y value used for plotting
 * on the y axis. This method is called both from the axis when finding dataMin
 * and dataMax, and from the series.translate method.
 */
seriesProto.init = function () {

    // Call base method
    seriesInit.apply(this, arguments);

    // Set comparison mode
    this.setCompare(this.options.compare);
};

/**
 * Highstock only. Set the {@link
 * http://api.highcharts.com/highstock/plotOptions.series.compare|
 * compare} mode of the series after render time. In most cases it is more
 * useful running {@link Axis#setCompare} on the X axis to update all its
 * series.
 *
 * @function setCompare
 * @memberof Series.prototype
 *
 * @param  {String} compare
 *         Can be one of `null`, `"percent"` or `"value"`.
 */
seriesProto.setCompare = function (compare) {

    // Set or unset the modifyValue method
    this.modifyValue = (compare === 'value' || compare === 'percent') ?
        function (value, point) {
            var compareValue = this.compareValue;

            if (
                value !== undefined &&
                compareValue !== undefined
            ) { // #2601, #5814

                // Get the modified value
                if (compare === 'value') {
                    value -= compareValue;

                // Compare percent
                } else {
                    value = 100 * (value / compareValue) -
                        (this.options.compareBase === 100 ? 0 : 100);
                }

                // record for tooltip etc.
                if (point) {
                    point.change = value;
                }

                return value;
            }
        } :
        null;

    // Survive to export, #5485
    this.userOptions.compare = compare;

    // Mark dirty
    if (this.chart.hasRendered) {
        this.isDirty = true;
    }

};

/**
 * Extend series.processData by finding the first y value in the plot area,
 * used for comparing the following values
 */
seriesProto.processData = function () {
    var series = this,
        i,
        keyIndex = -1,
        processedXData,
        processedYData,
        compareStart = series.options.compareStart === true ? 0 : 1,
        length,
        compareValue;

    // call base method
    seriesProcessData.apply(this, arguments);

    if (series.xAxis && series.processedYData) { // not pies

        // local variables
        processedXData = series.processedXData;
        processedYData = series.processedYData;
        length = processedYData.length;

        // For series with more than one value (range, OHLC etc), compare
        // against close or the pointValKey (#4922, #3112)
        if (series.pointArrayMap) {
            // Use close if present (#3112)
            keyIndex = inArray('close', series.pointArrayMap);
            if (keyIndex === -1) {
                keyIndex = inArray(
                    series.pointValKey || 'y',
                    series.pointArrayMap
                );
            }
        }

        // find the first value for comparison
        for (i = 0; i < length - compareStart; i++) {
            compareValue = processedYData[i] && keyIndex > -1 ?
                processedYData[i][keyIndex] :
                processedYData[i];
            if (
                isNumber(compareValue) &&
                processedXData[i + compareStart] >= series.xAxis.min &&
                compareValue !== 0
            ) {
                series.compareValue = compareValue;
                break;
            }
        }
    }
};

/**
 * Modify series extremes
 */
wrap(seriesProto, 'getExtremes', function (proceed) {
    var extremes;

    proceed.apply(this, [].slice.call(arguments, 1));

    if (this.modifyValue) {
        extremes = [
            this.modifyValue(this.dataMin),
            this.modifyValue(this.dataMax)
        ];
        this.dataMin = arrayMin(extremes);
        this.dataMax = arrayMax(extremes);
    }
});

/**
 * Highstock only. Set the compare mode on all series belonging to an Y axis
 * after render time.
 *
 * @param  {String} compare
 *         The compare mode. Can be one of `null`, `"value"` or `"percent"`.
 * @param  {Boolean} [redraw=true]
 *         Whether to redraw the chart or to wait for a later call to {@link
 *         Chart#redraw},
 *
 * @function setCompare
 * @memberof Axis.prototype
 *
 * @see    {@link https://api.highcharts.com/highstock/series.plotOptions.compare|
 *         series.plotOptions.compare}
 *
 * @sample stock/members/axis-setcompare/
 *         Set compoare
 */
Axis.prototype.setCompare = function (compare, redraw) {
    if (!this.isXAxis) {
        each(this.series, function (series) {
            series.setCompare(compare);
        });
        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }
};

/**
 * Extend the tooltip formatter by adding support for the point.change variable
 * as well as the changeDecimals option
 */
Point.prototype.tooltipFormatter = function (pointFormat) {
    var point = this;

    pointFormat = pointFormat.replace(
        '{point.change}',
        (point.change > 0 ? '+' : '') + H.numberFormat(
            point.change,
            pick(point.series.tooltipOptions.changeDecimals, 2)
        )
    );

    return pointTooltipFormatter.apply(this, [pointFormat]);
};

/* ****************************************************************************
 * End value compare logic                                                    *
 *****************************************************************************/


/**
 * Extend the Series prototype to create a separate series clip box. This is
 * related to using multiple panes, and a future pane logic should incorporate
 * this feature (#2754).
 */
wrap(Series.prototype, 'render', function (proceed) {
    var clipHeight;
    // Only do this on not 3d (#2939, #5904) nor polar (#6057) charts, and only
    // if the series type handles clipping in the animate method (#2975).
    if (
        !(this.chart.is3d && this.chart.is3d()) &&
        !this.chart.polar &&
        this.xAxis &&
        !this.xAxis.isRadial // Gauge, #6192
    ) {
        // Include xAxis line width, #8031
        clipHeight = this.yAxis.len - (this.xAxis.axisLine ?
            Math.floor(this.xAxis.axisLine.strokeWidth() / 2) :
            0);

        // First render, initial clip box
        if (!this.clipBox && this.animate) {
            this.clipBox = merge(this.chart.clipBox);
            this.clipBox.width = this.xAxis.len;
            this.clipBox.height = clipHeight;

        // On redrawing, resizing etc, update the clip rectangle
        } else if (this.chart[this.sharedClipKey]) {
            this.chart[this.sharedClipKey].attr({
                width: this.xAxis.len,
                height: clipHeight
            });
        // #3111
        } else if (this.clipBox) {
            this.clipBox.width = this.xAxis.len;
            this.clipBox.height = clipHeight;
        }
    }
    proceed.call(this);
});

wrap(Chart.prototype, 'getSelectedPoints', function (proceed) {
    var points = proceed.call(this);

    each(this.series, function (serie) {
        // series.points - for grouped points (#6445)
        if (serie.hasGroupedData) {
            points = points.concat(grep(serie.points || [], function (point) {
                return point.selected;
            }));
        }
    });
    return points;
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
