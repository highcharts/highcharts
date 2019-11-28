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

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            crossLabel?: SVGElement;
            setCompare(compare?: string, redraw?: boolean): void;
            panningState?: AxisPanningState;
        }
        interface Chart {
            _labelPanes?: Dictionary<Axis>;
        }
        interface Options {
            isStock?: boolean;
        }
        interface Point {
            change?: number;
        }
        interface Series {
            clipBox?: BBoxObject;
            compareValue?: number;
            modifyValue?(value?: number, point?: Point): (number|undefined);
            setCompare(compare?: string): void;
        }
        interface SeriesOptions {
            compare?: string;
            compareBase?: (0|100);
            compareStart?: boolean;
        }
        interface SVGRenderer {
            crispPolyLine(points: SVGPathArray, width: number): SVGPathArray;
        }
        interface VMLRenderer {
            crispPolyLine(points: VMLPathArray, width: number): VMLPathArray;
        }
        interface AxisPanningState {
            startMin: number;
            startMax: number;
        }
        class StockChart extends Chart {
        }
        function stockChart(): StockChart;
    }
}

import U from './Utilities.js';
const {
    arrayMax,
    arrayMin,
    clamp,
    defined,
    extend,
    isNumber,
    isString,
    pick,
    splat
} = U;

import './Chart.js';
import './Axis.js';
import './Point.js';
import './Pointer.js';
import './Series.js';
import './SvgRenderer.js';
// Has a dependency on Navigator due to the use of
// defaultOptions.navigator
import './Navigator.js';
// Has a dependency on Scrollbar due to the use of
// defaultOptions.scrollbar
import './Scrollbar.js';
// Has a dependency on RangeSelector due to the use of
// defaultOptions.rangeSelector
import './RangeSelector.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    Chart = H.Chart,
    format = H.format,
    merge = H.merge,
    Point = H.Point,
    Renderer = H.Renderer,
    Series = H.Series,
    SVGRenderer = H.SVGRenderer,
    VMLRenderer = H.VMLRenderer,

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

/* eslint-disable no-invalid-this, valid-jsdoc */

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
H.StockChart = H.stockChart = function (
    a: (string|Highcharts.HTMLDOMElement|Highcharts.Options),
    b?: (Highcharts.ChartCallbackFunction|Highcharts.Options),
    c?: Highcharts.ChartCallbackFunction
): Highcharts.StockChart {
    var hasRenderToArg = isString(a) || (a as any).nodeName,
        options = arguments[hasRenderToArg ? 1 : 0],
        userOptions = options,
        // to increase performance, don't merge the data
        seriesOptions = options.series,
        defaultOptions = H.getOptions(),
        opposite,
        panning = options.chart && options.chart.panning,
        // Always disable startOnTick:true on the main axis when the navigator
        // is enabled (#1090)
        navigatorEnabled = pick(
            options.navigator && options.navigator.enabled,
            (defaultOptions.navigator as any).enabled,
            true
        ),
        verticalPanningEnabled = panning && /y/.test(panning.type),
        disableStartOnTick = {
            startOnTick: false,
            endOnTick: false
        };

    // apply X axis options to both single and multi y axes
    options.xAxis = splat(options.xAxis || {}).map(function (
        xAxisOptions: Highcharts.XAxisOptions,
        i: number
    ): Highcharts.XAxisOptions {
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
            } as Highcharts.XAxisOptions,
            defaultOptions.xAxis, // #3802
            defaultOptions.xAxis && (defaultOptions.xAxis as any)[i], // #7690
            xAxisOptions, // user options
            { // forced options
                type: 'datetime',
                categories: null
            },
            (navigatorEnabled ? disableStartOnTick : null) as any
        );
    });

    // apply Y axis options to both single and multi y axes
    options.yAxis = splat(options.yAxis || {}).map(function (
        yAxisOptions: Highcharts.YAxisOptions,
        i: number
    ): Highcharts.YAxisOptions {
        opposite = pick(yAxisOptions.opposite, true);
        return merge(
            { // defaults
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
                    yAxisOptions.type === 'category'
                ),

                title: {
                    text: null
                }
            },
            defaultOptions.yAxis, // #3802
            defaultOptions.yAxis && (defaultOptions.yAxis as any)[i], // #7690
            yAxisOptions, // user options
            (verticalPanningEnabled ? disableStartOnTick : null) as any
        );
    });

    options.series = null;

    options = merge(
        {
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
                enabled: pick((defaultOptions.scrollbar as any).enabled, true)
            },
            rangeSelector: {
                // #4988 - check if setOptions was called
                enabled: pick(
                    (defaultOptions.rangeSelector as any).enabled,
                    true
                )
            },
            title: {
                text: null
            },
            tooltip: {
                split: pick((defaultOptions.tooltip as any).split, true),
                crosshairs: true
            },
            legend: {
                enabled: false
            }

        },

        options, // user's options

        { // forced options
            isStock: true // internal flag
        }
    );

    options.series = userOptions.series = seriesOptions;

    return hasRenderToArg ?
        new Chart(a as any, options, c) :
        new Chart(options, b as any);
} as any;

// Handle som Stock-specific series defaults, override the plotOptions before
// series options are handled.
addEvent(Series, 'setOptions', function (
    this: Highcharts.Series,
    e: { plotOptions: Highcharts.PlotOptions }
): void {
    var series = this,
        overrides;

    /**
     * @private
     */
    function is(type: string): boolean {
        return H.seriesTypes[type] && series instanceof H.seriesTypes[type];
    }
    if (this.chart.options.isStock) {

        if (is('column') || is('columnrange')) {
            overrides = {
                borderWidth: 0,
                shadow: false
            };

        } else if (is('line') && !is('scatter') && !is('sma')) {
            overrides = {
                marker: {
                    enabled: false,
                    radius: 2
                }
            };
        }
        if (overrides) {
            e.plotOptions[this.type] = merge(
                e.plotOptions[this.type],
                overrides
            );
        }
    }
});

// Override the automatic label alignment so that the first Y axis' labels
// are drawn on top of the grid line, and subsequent axes are drawn outside
addEvent(Axis, 'autoLabelAlign', function (
    this: Highcharts.Axis,
    e: Event
): void {
    var chart = this.chart,
        options = this.options,
        panes = chart._labelPanes = chart._labelPanes || {},
        key,
        labelOptions = this.options.labels;

    if (this.chart.options.isStock && this.coll === 'yAxis') {
        key = options.top + ',' + options.height;
        // do it only for the first Y axis of each pane
        if (!panes[key] && (labelOptions as any).enabled) {
            if ((labelOptions as any).x === 15) { // default
                (labelOptions as any).x = 0;
            }
            if (typeof (labelOptions as any).align === 'undefined') {
                (labelOptions as any).align = 'right';
            }
            panes[key] = this;
            (e as any).align = 'right';

            e.preventDefault();
        }
    }
});

// Clear axis from label panes (#6071)
addEvent(Axis, 'destroy', function (this: Highcharts.Axis): void {
    var chart = this.chart,
        key = this.options && (this.options.top + ',' + this.options.height);

    if (key && chart._labelPanes && chart._labelPanes[key] === this) {
        delete chart._labelPanes[key];
    }
});

// Override getPlotLinePath to allow for multipane charts
addEvent(Axis, 'getPlotLinePath', function (
    this: Highcharts.Axis,
    e: Event & Highcharts.AxisPlotLinePathOptionsObject
): void {
    var axis = this,
        series = (
            this.isLinked && !this.series ?
                (this.linkedParent as any).series :
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
        result = [] as Highcharts.SVGPathArray,
        axes = [], // #3416 need a default array
        axes2: Array<Highcharts.Axis>,
        uniqueAxes: Array<Highcharts.Axis>,
        translatedValue = e.translatedValue,
        value = e.value,
        force = e.force,
        transVal: number;

    /**
     * Return the other axis based on either the axis option or on related
     * series.
     * @private
     */
    function getAxis(coll: string): Array<Highcharts.Axis> {
        var otherColl = coll === 'xAxis' ? 'yAxis' : 'xAxis',
            opt = (axis.options as any)[otherColl];

        // Other axis indexed by number
        if (isNumber(opt)) {
            return [(chart as any)[otherColl][opt]];
        }

        // Other axis indexed by id (like navigator)
        if (isString(opt)) {
            return [chart.get(opt) as Highcharts.Axis];
        }

        // Auto detect based on existing series
        return series.map(function (s: Highcharts.Series): Highcharts.Axis {
            return (s as any)[otherColl];
        });
    }

    if (// For stock chart, by default render paths across the panes
        // except the case when `acrossPanes` is disabled by user (#6644)
        (chart.options.isStock && (e as any).acrossPanes !== false) &&
        // Ignore in case of colorAxis or zAxis. #3360, #3524, #6720
        axis.coll === 'xAxis' || axis.coll === 'yAxis'
    ) {

        e.preventDefault();

        // Get the related axes based on series
        axes = getAxis(axis.coll);

        // Get the related axes based options.*Axis setting #2810
        axes2 = (axis.isXAxis ? chart.yAxis : chart.xAxis);
        axes2.forEach(function (A: Highcharts.Axis): void {
            if (
                defined(A.options.id) ?
                    A.options.id.indexOf('navigator') === -1 :
                    true
            ) {
                var a = (A.isXAxis ? 'yAxis' : 'xAxis'),
                    rax = (
                        defined((A.options as any)[a]) ?
                            (chart as any)[a][(A.options as any)[a]] :
                            (chart as any)[a][0]
                    );

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
        axes.forEach(function (axis2: Highcharts.Axis): void {
            if (
                uniqueAxes.indexOf(axis2) === -1 &&
                // Do not draw on axis which overlap completely. #5424
                !H.find(uniqueAxes, function (
                    unique: Highcharts.Axis
                ): boolean {
                    return unique.pos === axis2.pos && unique.len === axis2.len;
                })
            ) {
                uniqueAxes.push(axis2);
            }
        });

        transVal = pick(
            translatedValue,
            axis.translate(value as any, null, null, (e as any).old) as any
        );
        if (isNumber(transVal)) {
            if (axis.horiz) {
                uniqueAxes.forEach(function (axis2: Highcharts.Axis): void {
                    var skip;

                    y1 = axis2.pos;
                    y2 = (y1 as any) + axis2.len;
                    x1 = x2 = Math.round(transVal + axis.transB);

                    // outside plot area
                    if (
                        force !== 'pass' &&
                        (x1 < axisLeft || x1 > axisLeft + axis.width)
                    ) {
                        if (force) {
                            x1 = x2 = clamp(
                                x1,
                                axisLeft,
                                axisLeft + axis.width
                            );
                        } else {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        result.push('M', x1, y1 as any, 'L', x2, y2);
                    }
                });
            } else {
                uniqueAxes.forEach(function (axis2: Highcharts.Axis): void {
                    var skip;

                    x1 = axis2.pos;
                    x2 = (x1 as any) + axis2.len;
                    y1 = y2 = Math.round(axisTop + axis.height - transVal);

                    // outside plot area
                    if (
                        force !== 'pass' &&
                        (y1 < axisTop || y1 > axisTop + axis.height)
                    ) {
                        if (force) {
                            y1 = y2 = clamp(
                                y1,
                                axisTop,
                                axisTop + axis.height
                            );
                        } else {
                            skip = true;
                        }
                    }
                    if (!skip) {
                        result.push('M', x1 as any, y1, 'L', x2, y2);
                    }
                });
            }
        }
        (e as any).path = result.length > 0 ?
            renderer.crispPolyLine(result as any, e.lineWidth || 1) :
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
SVGRenderer.prototype.crispPolyLine = function (
    this: Highcharts.SVGRenderer,
    points: Highcharts.SVGPathArray,
    width: number
): Highcharts.SVGPathArray {
    // points format: ['M', 0, 0, 'L', 100, 0]
    // normalize to a crisp line
    var i;

    for (i = 0; i < points.length; i = i + 6) {
        if (points[i + 1] === points[i + 4]) {
            // Substract due to #1129. Now bottom and left axis gridlines behave
            // the same.
            points[i + 1] = points[i + 4] =
                Math.round(points[i + 1] as any) - (width % 2 / 2);
        }
        if (points[i + 2] === points[i + 5]) {
            points[i + 2] = points[i + 5] =
                Math.round(points[i + 2] as any) + (width % 2 / 2);
        }
    }
    return points;
};
if ((Renderer as unknown) === VMLRenderer) {
    VMLRenderer.prototype.crispPolyLine = SVGRenderer.prototype.crispPolyLine;
}

// Wrapper to hide the label
addEvent(Axis, 'afterHideCrosshair', function (this: Highcharts.Axis): void {
    if (this.crossLabel) {
        this.crossLabel = this.crossLabel.hide();
    }
});

// Extend crosshairs to also draw the label
addEvent(Axis, 'afterDrawCrosshair', function (
    this: Highcharts.Axis,
    event: { e: Highcharts.PointerEventObject; point: Highcharts.Point }
): void {

    // Check if the label has to be drawn
    if (
        !defined((this.crosshair as any).label) ||
        !(this.crosshair as any).label.enabled ||
        !this.cross
    ) {
        return;
    }

    var chart = this.chart,
        options = (this.options.crosshair as any).label, // the label's options
        horiz = this.horiz, // axis orientation
        opposite = this.opposite, // axis position
        left = this.left, // left position
        top = this.top, // top position
        crossLabel = this.crossLabel, // the svgElement
        posx,
        posy,
        crossBox,
        formatOption = options.format,
        formatFormat = '',
        limit,
        align,
        tickInside = this.options.tickPosition === 'inside',
        snap = (this.crosshair as any).snap !== false,
        value,
        offset = 0,
        // Use last available event (#5287)
        e = event.e || (this.cross && this.cross.e),
        point = event.point,
        lin2log = this.lin2log,
        min,
        max;

    if (this.isLog) {
        min = lin2log(this.min as any);
        max = lin2log(this.max as any);
    } else {
        min = this.min;
        max = this.max;
    }

    align = (horiz ? 'center' : opposite ?
        (this.labelAlign === 'right' ? 'right' : 'left') :
        (this.labelAlign === 'left' ? 'left' : 'center'));

    // If the label does not exist yet, create it.
    if (!crossLabel) {
        crossLabel = this.crossLabel = chart.renderer
            .label(
                null as any,
                null as any,
                null as any,
                options.shape || 'callout'
            )
            .addClass(
                'highcharts-crosshair-label' + (
                    this.series[0] &&
                    ' highcharts-color-' + this.series[0].colorIndex
                )
            )
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
        }
    }

    if (horiz) {
        posx = snap ? (point.plotX as any) + left : e.chartX;
        posy = top + (opposite ? 0 : this.height);
    } else {
        posx = opposite ? this.width + left : 0;
        posy = snap ? (point.plotY as any) + top : e.chartY;
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
            format(formatOption, { value: value }, chart) :
            options.formatter.call(this, value),
        x: posx,
        y: posy,
        // Crosshair should be rendered within Axis range (#7219)
        visibility:
            (value as any) < (min as any) || (value as any) > (max as any) ?
                'hidden' :
                'visible'
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
seriesProto.init = function (this: Highcharts.Series): void {

    // Call base method
    seriesInit.apply(this, arguments as any);

    // Set comparison mode
    this.setCompare(this.options.compare as any);
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
seriesProto.setCompare = function (
    this: Highcharts.Series,
    compare?: string
): void {

    // Set or unset the modifyValue method
    this.modifyValue = (compare === 'value' || compare === 'percent') ?
        function (
            this: Highcharts.Series,
            value?: number,
            point?: Highcharts.Point
        ): (number|undefined) {
            var compareValue = this.compareValue;

            if (
                typeof value !== 'undefined' &&
                typeof compareValue !== 'undefined'
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
            return 0;
        } :
        null as any;

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
 *
 * @ignore
 * @function Highcharts.Series#processData
 */
seriesProto.processData = function (
    this: Highcharts.Series,
    force?: boolean
): (boolean|undefined) {
    var series = this,
        i,
        keyIndex = -1,
        processedXData,
        processedYData,
        compareStart = series.options.compareStart === true ? 0 : 1,
        length,
        compareValue;

    // call base method
    seriesProcessData.apply(this, arguments as any);

    if (series.xAxis && series.processedYData) { // not pies

        // local variables
        processedXData = series.processedXData;
        processedYData = series.processedYData;
        length = processedYData.length;

        // For series with more than one value (range, OHLC etc), compare
        // against close or the pointValKey (#4922, #3112, #9854)
        if (series.pointArrayMap) {
            keyIndex = series.pointArrayMap.indexOf(
                series.options.pointValKey || series.pointValKey || 'y'
            );
        }

        // find the first value for comparison
        for (i = 0; i < length - compareStart; i++) {
            compareValue = processedYData[i] && keyIndex > -1 ?
                (processedYData[i] as any)[keyIndex] :
                processedYData[i];
            if (
                isNumber(compareValue) &&
                (processedXData as any)[i + compareStart] >=
                (series.xAxis.min as any) &&
                compareValue !== 0
            ) {
                series.compareValue = compareValue;
                break;
            }
        }
    }

    return;
};

// Modify series extremes
addEvent(Series, 'afterGetExtremes', function (this: Highcharts.Series): void {
    if (this.modifyValue) {
        var extremes = [
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
Axis.prototype.setCompare = function (
    this: Highcharts.Axis,
    compare?: string,
    redraw?: boolean
): void {
    if (!this.isXAxis) {
        this.series.forEach(function (series: Highcharts.Series): void {
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
Point.prototype.tooltipFormatter = function (
    this: Highcharts.Point,
    pointFormat: string
): string {
    var point = this;
    const { numberFormatter } = point.series.chart;

    pointFormat = pointFormat.replace(
        '{point.change}',
        ((point.change as any) > 0 ? '+' : '') + numberFormatter(
            point.change as any,
            pick(point.series.tooltipOptions.changeDecimals, 2)
        )
    );

    return pointTooltipFormatter.apply(this, [pointFormat]);
};

/* ************************************************************************** *
 *  End value compare logic                                                   *
 * ************************************************************************** */


// Extend the Series prototype to create a separate series clip box. This is
// related to using multiple panes, and a future pane logic should incorporate
// this feature (#2754).
addEvent(Series, 'render', function (this: Highcharts.Series): void {
    var chart = this.chart,
        clipHeight;

    // Only do this on not 3d (#2939, #5904) nor polar (#6057) charts, and only
    // if the series type handles clipping in the animate method (#2975).
    if (
        !(chart.is3d && chart.is3d()) &&
        !chart.polar &&
        this.xAxis &&
        !this.xAxis.isRadial // Gauge, #6192
    ) {

        clipHeight = this.yAxis.len;

        // Include xAxis line width (#8031) but only if the Y axis ends on the
        // edge of the X axis (#11005).
        if (this.xAxis.axisLine) {
            var dist = chart.plotTop + chart.plotHeight -
                    (this.yAxis.pos as any) - this.yAxis.len,
                lineHeightCorrection = Math.floor(
                    this.xAxis.axisLine.strokeWidth() / 2
                );

            if (dist >= 0) {
                clipHeight -= Math.max(lineHeightCorrection - dist, 0);
            }
        }

        // First render, initial clip box
        if (!this.clipBox && this.animate) {
            this.clipBox = merge(chart.clipBox);
            this.clipBox.width = this.xAxis.len;
            this.clipBox.height = clipHeight;

        // On redrawing, resizing etc, update the clip rectangle
        } else if ((chart as any)[this.sharedClipKey as any]) {
            // animate in case resize is done during initial animation
            (chart as any)[this.sharedClipKey as any].animate({
                width: this.xAxis.len,
                height: clipHeight
            });

            // also change markers clip animation for consistency
            // (marker clip rects should exist only on chart init)
            if ((chart as any)[this.sharedClipKey + 'm']) {
                (chart as any)[this.sharedClipKey + 'm'].animate({
                    width: this.xAxis.len
                });
            }
        }
    }
});

addEvent(Chart, 'update', function (
    this: Highcharts.StockChart,
    e: { options: Highcharts.Options }
): void {
    var options = e.options;

    // Use case: enabling scrollbar from a disabled state.
    // Scrollbar needs to be initialized from a controller, Navigator in this
    // case (#6615)
    if ('scrollbar' in options && this.navigator) {
        merge(true, this.options.scrollbar, options.scrollbar);
        (this.navigator.update as any)({}, false);
        delete options.scrollbar;
    }
});

// Extend the Axis prototype to calculate start min/max values
// (including min/maxPadding). This is related to using vertical panning
// (#11315).
addEvent(Axis, 'afterSetScale', function (
    this: Highcharts.Axis
): void {
    var axis = this,
        panning = axis.chart.options.chart &&
            axis.chart.options.chart.panning;

    if (
        panning &&
        (panning.type === 'y' ||
        panning.type === 'xy') &&
        !axis.isXAxis &&
        !defined(axis.panningState)
    ) {

        var min = Number.MAX_VALUE,
            max = Number.MIN_VALUE;

        axis.series.forEach(function (series): void {
            min = Math.min(H.arrayMin(series.yData as any), min) -
                (axis.min && axis.dataMin ? axis.dataMin - axis.min : 0);
            max = Math.max(H.arrayMax(series.yData as any), max) +
                (axis.max && axis.dataMax ? axis.max - axis.dataMax : 0);
        });

        axis.panningState = {
            startMin: min,
            startMax: max
        };
    }
});
