/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Chart/Chart';
import type Templating from '../../Templating';
import type {
    PlotBandLabelOptions,
    PlotBandOptions
} from './PlotBandOptions';
import type {
    PlotLineLabelOptions,
    PlotLineOptions
} from './PlotLineOptions';
import type SVGAttributes from '../../Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Renderer/SVG/SVGElement';
import type SVGPath from '../../Renderer/SVG/SVGPath';

import Axis from '../Axis.js';
import { Palette } from '../../Color/Palettes.js';
import PlotLineOrBandAxis from './PlotLineOrBandAxis.js';
import U from '../../Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    defined,
    destroyObjectProperties,
    erase,
    fireEvent,
    merge,
    objectEach,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The object wrapper for plot lines and plot bands
 *
 * @class
 * @name Highcharts.PlotLineOrBand
 *
 * @param {Highcharts.Axis} axis
 * Related axis.
 *
 * @param {Highcharts.AxisPlotLinesOptions|Highcharts.AxisPlotBandsOptions} [options]
 * Options to use.
 */
class PlotLineOrBand {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Composes `PlotLineOrBand` with `Axis` and `Chart`.
     *
     * @param {Highcharts.Chart} ChartClass
     * Chart class to compose.
     *
     * @param {Highcharts.Axis} AxisClass
     * Axis class to compose.
     *
     * @internal
     */
    public static compose<T extends typeof Axis>(
        ChartClass: Chart,
        AxisClass: T
    ): (T&typeof PlotLineOrBandAxis.Composition) {

        addEvent(ChartClass, 'afterInit', function (): void {
            this.labelCollectors.push((): SVGElement[] => {
                const labels: SVGElement[] = [];

                for (const axis of this.axes) {

                    for (const { label, options } of axis.plotLinesAndBands) {
                        if (label && !(
                            options as PlotBandOptions)?.label?.allowOverlap
                        ) {
                            labels.push(label);
                        }
                    }
                }

                return labels;
            });
        });


        return PlotLineOrBandAxis.compose(PlotLineOrBand, AxisClass);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        axis: PlotLineOrBandAxis.Composition,
        options: (PlotBandOptions|PlotLineOptions)
    ) {
        /**
         * Related axis.
         *
         * @name Highcharts.PlotLineOrBand#axis
         * @type {Highcharts.Axis}
         */
        this.axis = axis;
        /**
         * Options of the plot line or band.
         *
         * @name Highcharts.PlotLineOrBand#options
         * @type {AxisPlotBandsOptions|AxisPlotLinesOptions}
         */
        this.options = options;
        this.id = options.id;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Related axis.
     *
     * @name Highcharts.PlotLineOrBand#axis
     * @type {Highcharts.Axis}
     */
    public axis: PlotLineOrBandAxis.Composition;

    /**
     * The id of the plot line or plot band.
     *
     * @name Highcharts.PlotLineOrBand#id
     * @type {string}
     */
    public id?: string;

    /** @internal */
    public isActive?: boolean;

    /** @internal */
    public eventsAdded?: boolean;

    /**
     * SVG element of the label.
     *
     * @name Highcharts.PlotLineOrBand#label
     * @type {Highcharts.SVGElement}
     */
    public label?: SVGElement;

    /**
     * Options of the plot line or band.
     *
     * @name Highcharts.PlotLineOrBand#options
     * @type {AxisPlotBandsOptions|AxisPlotLinesOptions}
     */
    public options: (PlotBandOptions|PlotLineOptions);

    /**
     * SVG element of the plot line or band.
     *
     * @name Highcharts.PlotLineOrBand#svgElem
     * @type {Highcharts.SVGElement}
     */
    public svgElem?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable no-invalid-this, valid-jsdoc */

    /**
     * Render the plot line or plot band. If it is already existing,
     * move it.
     * @internal
     * @function Highcharts.PlotLineOrBand#render
     */
    public render(): (PlotLineOrBand|undefined) {
        fireEvent(this, 'render');

        const { axis, options } = this,
            { horiz, logarithmic } = axis,
            { color, events, zIndex = 0 } = options,
            { renderer, time } = axis.chart,
            groupAttribs: SVGAttributes = {},

            // These properties only exist on either band or line
            to = time.parse((options as PlotBandOptions).to),
            from = time.parse((options as PlotBandOptions).from),
            value = time.parse((options as PlotLineOptions).value),
            borderWidth = (options as PlotBandOptions).borderWidth;

        let optionsLabel = options.label,
            { label, svgElem } = this,
            path: SVGPath|undefined = [],
            group;

        const isBand = defined(from) && defined(to),
            isLine = defined(value),
            isNew = !svgElem,
            attribs: SVGAttributes = {
                'class': 'highcharts-plot-' + (isBand ? 'band ' : 'line ') +
                    (options.className || '')
            };

        let groupName = isBand ? 'bands' : 'lines';

        // Set the presentational attributes
        if (!axis.chart.styledMode) {
            if (isLine) {
                attribs.stroke = color || Palette.neutralColor40;
                attribs['stroke-width'] = pick(
                    (options as PlotLineOptions).width,
                    1
                );
                if ((options as PlotLineOptions).dashStyle) {
                    attribs.dashstyle = (options as PlotLineOptions).dashStyle;
                }

            } else if (isBand) { // Plot band
                attribs.fill = color || Palette.highlightColor10;
                if (borderWidth) {
                    attribs.stroke = (options as PlotBandOptions).borderColor;
                    attribs['stroke-width'] = borderWidth;
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
        if (!svgElem) {
            /**
             * SVG element of the plot line or band.
             *
             * @name Highcharts.PlotLineOrBand#svgElem
             * @type {Highcharts.SVGElement}
             */
            this.svgElem = svgElem = renderer
                .path()
                .attr(attribs)
                .add(group);
        }

        // Set the path or return
        if (defined(value)) { // Plot line
            path = axis.getPlotLinePath({
                value: logarithmic?.log2lin(value) ?? value,
                lineWidth: svgElem.strokeWidth(),
                acrossPanes: options.acrossPanes
            });
        } else if (defined(from) && defined(to)) { // Plot band
            path = axis.getPlotBandPath(
                logarithmic?.log2lin(from) ?? from,
                logarithmic?.log2lin(to) ?? to,
                options
            );
        } else {
            return;
        }


        // Common for lines and bands. Add events only if they were not added
        // before.
        if (!this.eventsAdded && events) {
            objectEach(events, (_event, eventType): void => {
                svgElem?.on(
                    eventType,
                    (e: any): void => {
                        events[eventType].apply(this, [e]);
                    }
                );
            });
            this.eventsAdded = true;
        }
        if ((isNew || !svgElem.d) && path?.length) {
            svgElem.attr({ d: path });
        } else if (svgElem) {
            if (path) {
                svgElem.show();
                svgElem.animate({ d: path });
            } else if (svgElem.d) {
                svgElem.hide();
                if (label) {
                    this.label = label = label.destroy();
                }
            }
        }

        // The plot band/line label
        if (
            optionsLabel &&
            (defined(optionsLabel.text) || defined(optionsLabel.formatter)) &&
            path?.length &&
            axis.width > 0 &&
            axis.height > 0 &&
            !path.isFlat
        ) {
            // Apply defaults
            optionsLabel = merge({
                align: horiz && isBand ? 'center' : void 0,
                x: horiz ? !isBand && 4 : 10,
                verticalAlign: !horiz && isBand ? 'middle' : void 0,
                y: horiz ? isBand ? 16 : 10 : isBand ? 6 : -4,
                rotation: horiz && !isBand ? 90 : 0,
                ...(isBand ? { inside: true } : {})
            } as PlotLineLabelOptions, optionsLabel);

            this.renderLabel(optionsLabel, path, isBand, zIndex);

        // Move out of sight
        } else if (label) {
            label.hide();
        }

        // Chainable
        return this;
    }

    /**
     * Render and align label for plot line or band.
     * @internal
     * @function Highcharts.PlotLineOrBand#renderLabel
     */
    public renderLabel(
        optionsLabel: (PlotBandLabelOptions|PlotLineLabelOptions),
        path: SVGPath,
        isBand?: boolean,
        zIndex?: number
    ): void {
        const plotLine = this,
            axis = plotLine.axis,
            renderer = axis.chart.renderer,
            inside = (optionsLabel as PlotBandLabelOptions).inside;

        let label = plotLine.label;

        // Add the SVG element
        if (!label) {
            /**
             * SVG element of the label.
             *
             * @name Highcharts.PlotLineOrBand#label
             * @type {Highcharts.SVGElement}
             */
            plotLine.label = label = renderer
                .text(
                    this.getLabelText(optionsLabel),
                    0,
                    0,
                    optionsLabel.useHTML
                )
                .attr({
                    align: optionsLabel.textAlign || optionsLabel.align,
                    rotation: optionsLabel.rotation,
                    'class': 'highcharts-plot-' + (isBand ? 'band' : 'line') +
                        '-label ' + (optionsLabel.className || ''),
                    zIndex
                });

            if (!axis.chart.styledMode) {
                label.css(merge({
                    // To allow theming, and in lack of a general place to set
                    // default options for plot lines and bands, default to the
                    // title color. If we expose the palette, we should use that
                    // instead.
                    color: axis.chart.options.title?.style?.color,
                    fontSize: '0.8em',
                    textOverflow: (isBand && !inside) ? '' : 'ellipsis'
                }, optionsLabel.style));
            }

            label.add();
        }

        // Get the bounding box and align the label
        // #3000 changed to better handle choice between plotband or plotline
        const xBounds = path.xBounds ||
                [path[0][1], path[1][1], (isBand ? path[2][1] : path[0][1])],
            yBounds = path.yBounds ||
                [path[0][2], path[1][2], (isBand ? path[2][2] : path[0][2])],
            x = arrayMin(xBounds),
            y = arrayMin(yBounds),
            bBoxWidth = arrayMax(xBounds) - x;

        label.align(optionsLabel, false, {
            x,
            y,
            width: bBoxWidth,
            height: arrayMax(yBounds) - y
        });

        label.alignAttr.y -= renderer.fontMetrics(label).b;

        if (
            !label.alignValue ||
            label.alignValue === 'left' ||
            defined(inside)
        ) {
            label.css({
                width: (
                    optionsLabel.style?.width || (
                        (
                            !isBand ||
                            !inside
                        ) ? (
                                label.rotation === 90 ?
                                    axis.height - (
                                        label.alignAttr.y -
                                        axis.top
                                    ) : (
                                        optionsLabel.clip ?
                                            axis.width :
                                            axis.chart.chartWidth
                                    ) - (label.alignAttr.x - axis.left)
                            ) :
                            bBoxWidth
                    )
                ) + 'px'
            });
        }

        label.show(true);
    }

    /**
     * Get label's text content.
     * @internal
     * @function Highcharts.PlotLineOrBand#getLabelText
     */
    public getLabelText(
        optionsLabel: (PlotBandLabelOptions|PlotLineLabelOptions)
    ): string | undefined {
        return defined(optionsLabel.formatter) ?
            (optionsLabel.formatter as
              Templating.FormatterCallback<PlotLineOrBand>)
                .call(this) :
            optionsLabel.text;
    }

    /**
     * Remove the plot line or band.
     *
     * @function Highcharts.PlotLineOrBand#destroy
     */
    public destroy(): void {
        // Remove it from the lookup
        erase(this.axis.plotLinesAndBands, this);

        delete (this as Partial<this>).axis;
        destroyObjectProperties(this);
    }

    /* eslint-enable no-invalid-this, valid-jsdoc */

}

/* *
 *
 *  Class Namespace
 *
 * */

/** @internal */
namespace PlotLineOrBand {

    /* *
     *
     *  Declarations
     *
     * */

    export type Axis = PlotLineOrBandAxis.Composition;

}

/* *
 *
 *  Default Export
 *
 * */

export default PlotLineOrBand;

/* *
 *
 *  API Options
 *
 * */

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

('');

/* *
 *
 *  API Options
 *
 * */

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
 * Flag to decide if plotBand should be rendered across all panes.
 *
 * @since     7.1.2
 * @product   highstock
 * @type      {boolean}
 * @default   true
 * @apioption xAxis.plotBands.acrossPanes
 */

/**
 * Border color for the plot band. Also requires `borderWidth` to be set.
 *
 * @type      {Highcharts.ColorString}
 * @apioption xAxis.plotBands.borderColor
 */

/**
 * Border radius for the plot band. Applies only to gauges. Can be a pixel
 * value or a percentage, for example `50%`.
 *
 * @type      {number|string}
 * @since 11.4.2
 * @sample    {highcharts} highcharts/xaxis/plotbands-gauge-borderradius
 *            Angular gauge with rounded plot bands
 * @apioption xAxis.plotBands.borderRadius
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
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @default   ${palette.highlightColor10}
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
 * @apioption xAxis.plotBands.events
 */

/**
 * Click event on a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotBands.events.click
 */

/**
 * Mouse move event on a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotBands.events.mousemove
 */

/**
 * Mouse out event on the corner of a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotBands.events.mouseout
 */

/**
 * Mouse over event on a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotBands.events.mouseover
 */

/**
 * The start position of the plot band in axis units.
 *
 * On datetime axes, the value can be given as a timestamp or a date string.
 *
 * @sample {highcharts} highcharts/xaxis/plotbands-color/
 *         Datetime axis
 * @sample {highcharts} highcharts/xaxis/plotbands-from/
 *         Categorized axis
 * @sample {highstock} stock/xaxis/plotbands/
 *         Plot band on Y axis
 *
 * @type      {number|string}
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
 * On datetime axes, the value can be given as a timestamp or a date string.
 *
 * @sample {highcharts} highcharts/xaxis/plotbands-color/
 *         Datetime axis
 * @sample {highcharts} highcharts/xaxis/plotbands-from/
 *         Categorized axis
 * @sample {highstock} stock/xaxis/plotbands/
 *         Plot band on Y axis
 *
 * @type      {number|string}
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
 * @type      {Highcharts.AlignValue}
 * @default   center
 * @since     2.1
 * @apioption xAxis.plotBands.label.align
 */

/**
 * Whether or not the label can be hidden if it overlaps with another label.
 *
 * @sample {highcharts} highcharts/xaxis/plotbands-label-allowoverlap/
 *         A Plotband label overlapping another
 *
 * @type      {boolean}
 * @default   undefined
 * @since     11.4.8
 * @apioption xAxis.plotBands.label.allowOverlap
 */

/**
 * Wether or not the text of the label can exceed the width of the label.
 *
 * @type      {boolean}
 * @product   highcharts highstock gantt
 * @sample {highcharts} highcharts/xaxis/plotbands-label-textwidth/
 *         Displaying text with text-wrapping/ellipsis, or the full text.
 *
 * @default   true
 * @since     11.4.6
 * @apioption xAxis.plotBands.label.inside
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
 * @type       {Highcharts.AlignValue}
 * @since      2.1
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
 * @type       {Highcharts.VerticalAlignValue}
 * @default    top
 * @since      2.1
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
 * @sample {highcharts} highcharts/xaxis/plotlines-color/
 *         Basic plot line
 * @sample {highcharts} highcharts/series-solidgauge/labels-auto-aligned/
 *         Solid gauge plot line
 * @apioption xAxis.plotLines
 */

/**
 * Flag to decide if plotLine should be rendered across all panes.
 *
 * @sample {highstock} stock/xaxis/plotlines-acrosspanes/
 *         Plot lines on different panes
 *
 * @since     7.1.2
 * @product   highstock
 * @type      {boolean}
 * @default   true
 * @apioption xAxis.plotLines.acrossPanes
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
 * @default   ${palette.neutralColor40}
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
 * @type      {Highcharts.DashStyleValue}
 * @default   Solid
 * @since     1.2
 * @apioption xAxis.plotLines.dashStyle
 */

/**
 * An object defining mouse events for the plot line. Supported
 * properties are `click`, `mouseover`, `mouseout`, `mousemove`.
 *
 * @sample {highcharts} highcharts/xaxis/plotlines-events/
 *         Mouse events demonstrated
 *
 * @since     1.2
 * @apioption xAxis.plotLines.events
 */

/**
 * Click event on a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotLines.events.click
 */

/**
 * Mouse move event on a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotLines.events.mousemove
 */

/**
 * Mouse out event on the corner of a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotLines.events.mouseout
 */

/**
 * Mouse over event on a plot band.
 *
 * @type      {Highcharts.EventCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotLines.events.mouseover
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
 * On datetime axes, the value can be given as a timestamp or a date string.
 *
 * @sample {highcharts} highcharts/xaxis/plotlines-color/
 *         Between two categories on X axis
 * @sample {highstock} stock/xaxis/plotlines/
 *         Plot line on Y axis
 *
 * @type      {number|string}
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
 * @default   2
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
 * Text labels for the plot lines
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
 * @type       {Highcharts.AlignValue}
 * @default    left
 * @since      2.1
 * @apioption  xAxis.plotLines.label.align
 */

/**
 * Whether or not the label can be hidden if it overlaps with another label.
 *
 * @type      {boolean}
 * @default   undefined
 * @since     11.4.8
 * @apioption xAxis.plotBands.label.allowOverlap
 */

/**
 * Whether to hide labels that are outside the plot area.
 *
 * @type      {boolean}
 * @default   false
 * @since 10.3.3
 * @apioption xAxis.plotLines.labels.clip
 */

/**
 * Callback JavaScript function to format the label. Useful properties like
 * the value of plot line or the range of plot band (`from` & `to`
 * properties) can be found in `this.options` object.
 *
 * @sample {highcharts} highcharts/xaxis/plotlines-plotbands-label-formatter
 *         Label formatters for plot line and plot band.
 * @type      {Highcharts.FormatterCallbackFunction<Highcharts.PlotLineOrBand>}
 * @apioption xAxis.plotLines.label.formatter
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
 * @type      {Highcharts.AlignValue}
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
 * @type       {Highcharts.VerticalAlignValue}
 * @default    {highcharts} top
 * @default    {highstock} top
 * @since      2.1
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
 * @type      {Array<*>}
 * @extends   xAxis.plotBands
 * @apioption yAxis.plotBands
 */

/**
 * @type      {Array<*>}
 * @extends   xAxis.plotLines
 * @apioption yAxis.plotLines
 */

(''); // Keeps doclets above in JS file
