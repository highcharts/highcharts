/**
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * Options for plot bands on axes.
 *
 * @typedef {Highcharts.XAxisPlotBandsOptions|Highcharts.YAxisPlotBandsOptions|Highcharts.ZAxisPlotBandsOptions} Highcharts.AxisPlotBandsOptions
 */

/**
 * Options for plot band labels on axes.
 *
 * @typedef {Highcharts.XAxisPlotBandsLabelOptions|Highcharts.YAxisPlotBandsLabelOptions|Highcharts.ZAxisPlotBandsLabelOptions} Highcharts.AxisPlotBandsLabelOptions
 */

/**
 * Options for plot lines on axes.
 *
 * @typedef {Highcharts.XAxisPlotLinesOptions|Highcharts.YAxisPlotLinesOptions|Highcharts.ZAxisPlotLinesOptions} Highcharts.AxisPlotLinesOptions
 */

/**
 * Options for plot line labels on axes.
 *
 * @typedef {Highcharts.XAxisPlotLinesLabelOptions|Highcharts.YAxisPlotLinesLabelOptions|Highcharts.ZAxisPlotLinesLabelOptions} Highcharts.AxisPlotLinesLabelOptions
 */

'use strict';

import H from './Globals.js';
import Axis from './Axis.js';
import './Utilities.js';

var arrayMax = H.arrayMax,
    arrayMin = H.arrayMin,
    defined = H.defined,
    destroyObjectProperties = H.destroyObjectProperties,
    erase = H.erase,
    merge = H.merge,
    pick = H.pick;

/**
 * The object wrapper for plot lines and plot bands
 *
 * @class
 * @name Highcharts.PlotLineOrBand
 *
 * @param {Highcharts.Axis} axis
 *
 * @param {Highcharts.AxisPlotLinesOptions|Highcharts.AxisPlotBandsOptions} options
 */
H.PlotLineOrBand = function (axis, options) {
    this.axis = axis;

    if (options) {
        this.options = options;
        this.id = options.id;
    }
};

H.PlotLineOrBand.prototype = {

    /**
     * Render the plot line or plot band. If it is already existing,
     * move it.
     *
     * @private
     * @function Highcharts.PlotLineOrBand#render
     *
     * @return {Highcharts.PlotLineOrBand|undefined}
     */
    render: function () {

        H.fireEvent(this, 'render');

        var plotLine = this,
            axis = plotLine.axis,
            horiz = axis.horiz,
            options = plotLine.options,
            optionsLabel = options.label,
            label = plotLine.label,
            to = options.to,
            from = options.from,
            value = options.value,
            isBand = defined(from) && defined(to),
            isLine = defined(value),
            svgElem = plotLine.svgElem,
            isNew = !svgElem,
            path = [],
            color = options.color,
            zIndex = pick(options.zIndex, 0),
            events = options.events,
            attribs = {
                'class': 'highcharts-plot-' + (isBand ? 'band ' : 'line ') +
                    (options.className || '')
            },
            groupAttribs = {},
            renderer = axis.chart.renderer,
            groupName = isBand ? 'bands' : 'lines',
            group;

        // logarithmic conversion
        if (axis.isLog) {
            from = axis.log2lin(from);
            to = axis.log2lin(to);
            value = axis.log2lin(value);
        }

        // Set the presentational attributes
        if (!axis.chart.styledMode) {
            if (isLine) {
                attribs.stroke = color;
                attribs['stroke-width'] = options.width;
                if (options.dashStyle) {
                    attribs.dashstyle = options.dashStyle;
                }

            } else if (isBand) { // plot band
                if (color) {
                    attribs.fill = color;
                }
                if (options.borderWidth) {
                    attribs.stroke = options.borderColor;
                    attribs['stroke-width'] = options.borderWidth;
                }
            }
        }

        // Grouping and zIndex
        groupAttribs.zIndex = zIndex;
        groupName += '-' + zIndex;

        group = axis.plotLinesAndBandsGroups[groupName];
        if (!group) {
            axis.plotLinesAndBandsGroups[groupName] = group =
                renderer.g('plot-' + groupName)
                    .attr(groupAttribs).add();
        }

        // Create the path
        if (isNew) {
            /**
             * SVG element of the plot line or band.
             *
             * @name Highcharts.PlotLineOrBand#svgElement
             * @type {Highcharts.SVGElement}
             */
            plotLine.svgElem = svgElem =
                renderer
                    .path()
                    .attr(attribs).add(group);
        }


        // Set the path or return
        if (isLine) {
            path = axis.getPlotLinePath(value, svgElem.strokeWidth());
        } else if (isBand) { // plot band
            path = axis.getPlotBandPath(from, to, options);
        } else {
            return;
        }


        // common for lines and bands
        if (isNew && path && path.length) {
            svgElem.attr({ d: path });

            // events
            if (events) {
                H.objectEach(events, function (event, eventType) {
                    svgElem.on(eventType, function (e) {
                        events[eventType].apply(plotLine, [e]);
                    });
                });
            }
        } else if (svgElem) {
            if (path) {
                svgElem.show();
                svgElem.animate({ d: path });
            } else {
                svgElem.hide();
                if (label) {
                    plotLine.label = label = label.destroy();
                }
            }
        }

        // the plot band/line label
        if (
            optionsLabel &&
            defined(optionsLabel.text) &&
            path &&
            path.length &&
            axis.width > 0 &&
            axis.height > 0 &&
            !path.isFlat
        ) {
            // apply defaults
            optionsLabel = merge({
                align: horiz && isBand && 'center',
                x: horiz ? !isBand && 4 : 10,
                verticalAlign: !horiz && isBand && 'middle',
                y: horiz ? isBand ? 16 : 10 : isBand ? 6 : -4,
                rotation: horiz && !isBand && 90
            }, optionsLabel);

            this.renderLabel(optionsLabel, path, isBand, zIndex);

        } else if (label) { // move out of sight
            label.hide();
        }

        // chainable
        return plotLine;
    },

    /**
     * Render and align label for plot line or band.
     *
     * @private
     * @function Highcharts.PlotLineOrBand#renderLabel
     *
     * @param {Highcharts.AxisPlotLinesLabelOptions|Highcharts.AxisPlotBandsLabelOptions} optionsLabel
     *
     * @param {Highcharts.SVGPathArray} path
     *
     * @param {boolean} [isBand]
     *
     * @param {number} [zIndex]
     */
    renderLabel: function (optionsLabel, path, isBand, zIndex) {
        var plotLine = this,
            label = plotLine.label,
            renderer = plotLine.axis.chart.renderer,
            attribs,
            xBounds,
            yBounds,
            x,
            y;

        // add the SVG element
        if (!label) {
            attribs = {
                align: optionsLabel.textAlign || optionsLabel.align,
                rotation: optionsLabel.rotation,
                'class': 'highcharts-plot-' + (isBand ? 'band' : 'line') +
                    '-label ' + (optionsLabel.className || '')
            };

            attribs.zIndex = zIndex;

            /**
             * SVG element of the label.
             *
             * @name Highcharts.PlotLineOrBand#label
             * @type {Highcharts.SVGElement}
             */
            plotLine.label = label = renderer.text(
                    optionsLabel.text,
                    0,
                    0,
                    optionsLabel.useHTML
                )
                .attr(attribs)
                .add();

            if (!this.axis.chart.styledMode) {
                label.css(optionsLabel.style);
            }
        }

        // get the bounding box and align the label
        // #3000 changed to better handle choice between plotband or plotline
        xBounds = path.xBounds ||
            [path[1], path[4], (isBand ? path[6] : path[1])];
        yBounds = path.yBounds ||
            [path[2], path[5], (isBand ? path[7] : path[2])];

        x = arrayMin(xBounds);
        y = arrayMin(yBounds);

        label.align(optionsLabel, false, {
            x: x,
            y: y,
            width: arrayMax(xBounds) - x,
            height: arrayMax(yBounds) - y
        });
        label.show();
    },

    /**
     * Remove the plot line or band.
     *
     * @function Highcharts.PlotLineOrBand#destroy
     */
    destroy: function () {
        // remove it from the lookup
        erase(this.axis.plotLinesAndBands, this);

        delete this.axis;
        destroyObjectProperties(this);
    }
};

// Object with members for extending the Axis prototype
H.extend(Axis.prototype, /** @lends Highcharts.Axis.prototype */ {

    /**
     * An array of colored bands stretching across the plot area marking an
     * interval on the axis.
     *
     * In styled mode, the plot bands are styled by the `.highcharts-plot-band`
     * class in addition to the `className` option.
     *
     * @productdesc {highcharts}
     * In a gauge, a plot band on the Y axis (value axis) will stretch along the
     * perimeter of the gauge.
     *
     * @type      {Array<*>}
     * @product   highcharts highstock gantt
     * @apioption xAxis.plotBands
     */

    /**
     * Border color for the plot band. Also requires `borderWidth` to be set.
     *
     * @type      {Highcharts.ColorString}
     * @apioption xAxis.plotBands.borderColor
     */

    /**
     * Border width for the plot band. Also requires `borderColor` to be set.
     *
     * @type      {number}
     * @default   0
     * @apioption xAxis.plotBands.borderWidth
     */

    /**
     * A custom class name, in addition to the default `highcharts-plot-band`,
     * to apply to each individual band.
     *
     * @type      {string}
     * @since     5.0.0
     * @apioption xAxis.plotBands.className
     */

    /**
     * The color of the plot band.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Color band
     * @sample {highstock} stock/xaxis/plotbands/
     *         Plot band on Y axis
     *
     * @type      {Highcharts.ColorString}
     * @apioption xAxis.plotBands.color
     */

    /**
     * An object defining mouse events for the plot band. Supported properties
     * are `click`, `mouseover`, `mouseout`, `mousemove`.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-events/
     *         Mouse events demonstrated
     *
     * @since     1.2
     * @context   PlotLineOrBand
     * @apioption xAxis.plotBands.events
     */

    /**
     * The start position of the plot band in axis units.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Datetime axis
     * @sample {highcharts} highcharts/xaxis/plotbands-from/
     *         Categorized axis
     * @sample {highstock} stock/xaxis/plotbands/
     *         Plot band on Y axis
     *
     * @type      {number}
     * @apioption xAxis.plotBands.from
     */

    /**
     * An id used for identifying the plot band in Axis.removePlotBand.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-id/
     *         Remove plot band by id
     * @sample {highstock} highcharts/xaxis/plotbands-id/
     *         Remove plot band by id
     *
     * @type      {string}
     * @apioption xAxis.plotBands.id
     */

    /**
     * The end position of the plot band in axis units.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Datetime axis
     * @sample {highcharts} highcharts/xaxis/plotbands-from/
     *         Categorized axis
     * @sample {highstock} stock/xaxis/plotbands/
     *         Plot band on Y axis
     *
     * @type      {number}
     * @apioption xAxis.plotBands.to
     */

    /**
     * The z index of the plot band within the chart, relative to other
     * elements. Using the same z index as another element may give
     * unpredictable results, as the last rendered element will be on top.
     * Values from 0 to 20 make sense.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-color/
     *         Behind plot lines by default
     * @sample {highcharts} highcharts/xaxis/plotbands-zindex/
     *         Above plot lines
     * @sample {highcharts} highcharts/xaxis/plotbands-zindex-above-series/
     *         Above plot lines and series
     *
     * @type      {number}
     * @since     1.2
     * @apioption xAxis.plotBands.zIndex
     */

    /**
     * Text labels for the plot bands
     *
     * @product   highcharts highstock gantt
     * @apioption xAxis.plotBands.label
     */

    /**
     * Horizontal alignment of the label. Can be one of "left", "center" or
     * "right".
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-align/
     *         Aligned to the right
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @type      {string}
     * @default   center
     * @since     2.1
     * @apioption xAxis.plotBands.label.align
     */

    /**
     * Rotation of the text label in degrees .
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/
     *         Vertical text
     *
     * @type      {number}
     * @default   0
     * @since     2.1
     * @apioption xAxis.plotBands.label.rotation
     */

    /**
     * CSS styles for the text label.
     *
     * In styled mode, the labels are styled by the
     * `.highcharts-plot-band-label` class.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-style/
     *         Blue and bold label
     *
     * @type      {Highcharts.CSSObject}
     * @since     2.1
     * @apioption xAxis.plotBands.label.style
     */

    /**
     * The string text itself. A subset of HTML is supported.
     *
     * @type      {string}
     * @since     2.1
     * @apioption xAxis.plotBands.label.text
     */

    /**
     * The text alignment for the label. While `align` determines where the
     * texts anchor point is placed within the plot band, `textAlign` determines
     * how the text is aligned against its anchor point. Possible values are
     * "left", "center" and "right". Defaults to the same as the `align` option.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/
     *         Vertical text in center position but text-aligned left
     *
     * @type       {string}
     * @since      2.1
     * @validvalue ["center", "left", "right"]
     * @apioption  xAxis.plotBands.label.textAlign
     */

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the labels.
     *
     * @type      {boolean}
     * @default   false
     * @since     3.0.3
     * @apioption xAxis.plotBands.label.useHTML
     */

    /**
     * Vertical alignment of the label relative to the plot band. Can be one of
     * "top", "middle" or "bottom".
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-verticalalign/
     *         Vertically centered label
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @type       {string}
     * @default    top
     * @since      2.1
     * @validvalue ["bottom", "middle",  "top"]
     * @apioption  xAxis.plotBands.label.verticalAlign
     */

    /**
     * Horizontal position relative the alignment. Default varies by
     * orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-align/
     *         Aligned 10px from the right edge
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @type      {number}
     * @since     2.1
     * @apioption xAxis.plotBands.label.x
     */

    /**
     * Vertical position of the text baseline relative to the alignment. Default
     * varies by orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-label-y/
     *         Label on x axis
     * @sample {highstock} stock/xaxis/plotbands-label/
     *         Plot band with labels
     *
     * @type      {number}
     * @since     2.1
     * @apioption xAxis.plotBands.label.y
     */

    /**
     * An array of lines stretching across the plot area, marking a specific
     * value on one of the axes.
     *
     * In styled mode, the plot lines are styled by the
     * `.highcharts-plot-line` class in addition to the `className` option.
     *
     * @type      {Array<*>}
     * @product   highcharts highstock gantt
     * @apioption xAxis.plotLines
     */

    /**
     * A custom class name, in addition to the default `highcharts-plot-line`,
     * to apply to each individual line.
     *
     * @type      {string}
     * @since     5.0.0
     * @apioption xAxis.plotLines.className
     */

    /**
     * The color of the line.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-color/
     *         A red line from X axis
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type      {Highcharts.ColorString}
     * @apioption xAxis.plotLines.color
     */

    /**
     * The dashing or dot style for the plot line. For possible values see
     * [this overview](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-dashstyle/
     *         Dash and dot pattern
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type       {string}
     * @default    Solid
     * @since      1.2
     * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot",
     *             "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot",
     *             "LongDashDot", "LongDashDotDot"]
     * @apioption  xAxis.plotLines.dashStyle
     */

    /**
     * An object defining mouse events for the plot line. Supported
     * properties are `click`, `mouseover`, `mouseout`, `mousemove`.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-events/
     *         Mouse events demonstrated
     *
     * @type      {*}
     * @since     1.2
     * @context   PlotLineOrBand
     * @apioption xAxis.plotLines.events
     */

    /**
     * An id used for identifying the plot line in Axis.removePlotLine.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-id/
     *         Remove plot line by id
     *
     * @type      {string}
     * @apioption xAxis.plotLines.id
     */

    /**
     * The position of the line in axis units.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-color/
     *         Between two categories on X axis
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type      {number}
     * @apioption xAxis.plotLines.value
     */

    /**
     * The width or thickness of the plot line.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-color/
     *         2px wide line from X axis
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type      {number}
     * @apioption xAxis.plotLines.width
     */

    /**
     * The z index of the plot line within the chart.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-zindex-behind/
     *         Behind plot lines by default
     * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above/
     *         Above plot lines
     * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above-all/
     *         Above plot lines and series
     *
     * @type      {number}
     * @since     1.2
     * @apioption xAxis.plotLines.zIndex
     */

    /**
     * Text labels for the plot bands
     *
     * @apioption xAxis.plotLines.label
     */

    /**
     * Horizontal alignment of the label. Can be one of "left", "center" or
     * "right".
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/
     *         Aligned to the right
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type       {string}
     * @default    left
     * @since      2.1
     * @validvalue ["center", "left", "right"]
     * @apioption  xAxis.plotLines.label.align
     */

    /**
     * Rotation of the text label in degrees. Defaults to 0 for horizontal plot
     * lines and 90 for vertical lines.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/
     *         Slanted text
     *
     * @type      {number}
     * @since     2.1
     * @apioption xAxis.plotLines.label.rotation
     */

    /**
     * CSS styles for the text label.
     *
     * In styled mode, the labels are styled by the
     * `.highcharts-plot-line-label` class.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-style/
     *         Blue and bold label
     *
     * @type      {Highcharts.CSSObject}
     * @since     2.1
     * @apioption xAxis.plotLines.label.style
     */

    /**
     * The text itself. A subset of HTML is supported.
     *
     * @type      {string}
     * @since     2.1
     * @apioption xAxis.plotLines.label.text
     */

    /**
     * The text alignment for the label. While `align` determines where the
     * texts anchor point is placed within the plot band, `textAlign` determines
     * how the text is aligned against its anchor point. Possible values are
     * "left", "center" and "right". Defaults to the same as the `align` option.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-textalign/
     *         Text label in bottom position
     *
     * @type      {string}
     * @since     2.1
     * @apioption xAxis.plotLines.label.textAlign
     */

    /**
     * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
     * to render the labels.
     *
     * @type      {boolean}
     * @default   false
     * @since     3.0.3
     * @apioption xAxis.plotLines.label.useHTML
     */

    /**
     * Vertical alignment of the label relative to the plot line. Can be
     * one of "top", "middle" or "bottom".
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/
     *         Vertically centered label
     *
     * @type       {string}
     * @default    {highcharts} top
     * @default    {highstock} top
     * @since      2.1
     * @validvalue ["top", "middle", "bottom"]
     * @apioption  xAxis.plotLines.label.verticalAlign
     */

    /**
     * Horizontal position relative the alignment. Default varies by
     * orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/
     *         Aligned 10px from the right edge
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type      {number}
     * @since     2.1
     * @apioption xAxis.plotLines.label.x
     */

    /**
     * Vertical position of the text baseline relative to the alignment. Default
     * varies by orientation.
     *
     * @sample {highcharts} highcharts/xaxis/plotlines-label-y/
     *         Label below the plot line
     * @sample {highstock} stock/xaxis/plotlines/
     *         Plot line on Y axis
     *
     * @type      {number}
     * @since     2.1
     * @apioption xAxis.plotLines.label.y
     */

    /**
     * An array of objects defining plot bands on the Y axis.
     *
     * @type      {Array<*>}
     * @extends   xAxis.plotBands
     * @apioption yAxis.plotBands
     */

    /**
     * In a gauge chart, this option determines the inner radius of the
     * plot band that stretches along the perimeter. It can be given as
     * a percentage string, like `"100%"`, or as a pixel number, like `100`.
     * By default, the inner radius is controlled by the [thickness](
     * #yAxis.plotBands.thickness) option.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-gauge
     *         Gauge plot band
     *
     * @type      {number|string}
     * @since     2.3
     * @product   highcharts
     * @apioption yAxis.plotBands.innerRadius
     */

    /**
     * In a gauge chart, this option determines the outer radius of the
     * plot band that stretches along the perimeter. It can be given as
     * a percentage string, like `"100%"`, or as a pixel number, like `100`.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-gauge
     *         Gauge plot band
     *
     * @type      {number|string}
     * @default   100%
     * @since     2.3
     * @product   highcharts
     * @apioption yAxis.plotBands.outerRadius
     */

    /**
     * In a gauge chart, this option sets the width of the plot band
     * stretching along the perimeter. It can be given as a percentage
     * string, like `"10%"`, or as a pixel number, like `10`. The default
     * value 10 is the same as the default [tickLength](#yAxis.tickLength),
     * thus making the plot band act as a background for the tick markers.
     *
     * @sample {highcharts} highcharts/xaxis/plotbands-gauge
     *         Gauge plot band
     *
     * @type      {number|string}
     * @default   10
     * @since     2.3
     * @product   highcharts
     * @apioption yAxis.plotBands.thickness
     */

    /**
     * An array of objects representing plot lines on the X axis
     *
     * @type      {Array<*>}
     * @extends   xAxis.plotLines
     * @apioption yAxis.plotLines
     */

    /**
     * Internal function to create the SVG path definition for a plot band.
     *
     * @function Highcharts.Axis#getPlotBandPath
     *
     * @param {number} from
     *        The axis value to start from.
     *
     * @param {number} to
     *        The axis value to end on.
     *
     * @return {Highcharts.SVGPathArray}
     *         The SVG path definition in array form.
     */
    getPlotBandPath: function (from, to) {
        var toPath = this.getPlotLinePath(to, null, null, true),
            path = this.getPlotLinePath(from, null, null, true),
            result = [],
            i,
            // #4964 check if chart is inverted or plotband is on yAxis
            horiz = this.horiz,
            plus = 1,
            isFlat,
            outside =
                (from < this.min && to < this.min) ||
                (from > this.max && to > this.max);

        if (path && toPath) {

            // Flat paths don't need labels (#3836)
            if (outside) {
                isFlat = path.toString() === toPath.toString();
                plus = 0;
            }

            // Go over each subpath - for panes in Highstock
            for (i = 0; i < path.length; i += 6) {

                // Add 1 pixel when coordinates are the same
                if (horiz && toPath[i + 1] === path[i + 1]) {
                    toPath[i + 1] += plus;
                    toPath[i + 4] += plus;
                } else if (!horiz && toPath[i + 2] === path[i + 2]) {
                    toPath[i + 2] += plus;
                    toPath[i + 5] += plus;
                }

                result.push(
                    'M',
                    path[i + 1],
                    path[i + 2],
                    'L',
                    path[i + 4],
                    path[i + 5],
                    toPath[i + 4],
                    toPath[i + 5],
                    toPath[i + 1],
                    toPath[i + 2],
                    'z'
                );
                result.isFlat = isFlat;
            }

        } else { // outside the axis area
            path = null;
        }

        return result;
    },

    /**
     * Add a plot band after render time.
     *
     * @sample highcharts/members/axis-addplotband/
     *         Toggle the plot band from a button
     *
     * @function Highcharts.Axis#addPlotBand
     *
     * @param {Highcharts.AxisPlotBandsOptions} options
     *        A configuration object for the plot band, as defined in
     *        [xAxis.plotBands](https://api.highcharts.com/highcharts/xAxis.plotBands).
     *
     * @return {Highcharts.PlotLineOrBand|undefined}
     *         The added plot band.
     */
    addPlotBand: function (options) {
        return this.addPlotBandOrLine(options, 'plotBands');
    },

    /**
     * Add a plot line after render time.
     *
     * @sample highcharts/members/axis-addplotline/
     *         Toggle the plot line from a button
     *
     * @function Highcharts.Axis#addPlotLine
     *
     * @param {Highcharts.AxisPlotLinesOptions} options
     *        A configuration object for the plot line, as defined in
     *        [xAxis.plotLines](https://api.highcharts.com/highcharts/xAxis.plotLines).
     *
     * @return {Highcharts.PlotLineOrBand|undefined}
     *         The added plot line.
     */
    addPlotLine: function (options) {
        return this.addPlotBandOrLine(options, 'plotLines');
    },

    /**
     * Add a plot band or plot line after render time. Called from addPlotBand
     * and addPlotLine internally.
     *
     * @private
     * @function Highcharts.Axis#addPlotBandOrLine
     *
     * @param {Highcharts.AxisPlotLinesOptions|Highcharts.AxisPlotBandsOptions} options
     *        The plotBand or plotLine configuration object.
     *
     * @param {"plotBands"|"plotLines"} [coll]
     *
     * @return {Highcharts.PlotLineOrBand|undefined}
     */
    addPlotBandOrLine: function (options, coll) {
        var obj = new H.PlotLineOrBand(this, options).render(),
            userOptions = this.userOptions;

        if (obj) { // #2189
            // Add it to the user options for exporting and Axis.update
            if (coll) {
                userOptions[coll] = userOptions[coll] || [];
                userOptions[coll].push(options);
            }
            this.plotLinesAndBands.push(obj);
        }

        return obj;
    },

    /**
     * Remove a plot band or plot line from the chart by id. Called internally
     * from `removePlotBand` and `removePlotLine`.
     *
     * @private
     * @function Highcharts.Axis#removePlotBandOrLine
     *
     * @param {string} id
     */
    removePlotBandOrLine: function (id) {
        var plotLinesAndBands = this.plotLinesAndBands,
            options = this.options,
            userOptions = this.userOptions,
            i = plotLinesAndBands.length;
        while (i--) {
            if (plotLinesAndBands[i].id === id) {
                plotLinesAndBands[i].destroy();
            }
        }
        ([
            options.plotLines || [],
            userOptions.plotLines || [],
            options.plotBands || [],
            userOptions.plotBands || []
        ]).forEach(function (arr) {
            i = arr.length;
            while (i--) {
                if (arr[i].id === id) {
                    erase(arr, arr[i]);
                }
            }
        });
    },

    /**
     * Remove a plot band by its id.
     *
     * @sample highcharts/members/axis-removeplotband/
     *         Remove plot band by id
     * @sample highcharts/members/axis-addplotband/
     *         Toggle the plot band from a button
     *
     * @function Highcharts.Axis#removePlotBand
     *
     * @param {string} id
     *        The plot band's `id` as given in the original configuration
     *        object or in the `addPlotBand` option.
     */
    removePlotBand: function (id) {
        this.removePlotBandOrLine(id);
    },

    /**
     * Remove a plot line by its id.
     *
     * @sample highcharts/xaxis/plotlines-id/
     *         Remove plot line by id
     * @sample highcharts/members/axis-addplotline/
     *         Toggle the plot line from a button
     *
     * @function Highcharts.Axis#removePlotLine
     *
     * @param {string} id
     *        The plot line's `id` as given in the original configuration
     *        object or in the `addPlotLine` option.
     */
    removePlotLine: function (id) {
        this.removePlotBandOrLine(id);
    }
});
