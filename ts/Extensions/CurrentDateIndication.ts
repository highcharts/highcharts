/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
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

import type {
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type ColorString from '../Core/Color/ColorString';
import type CSSObject from '../Core/Renderer/CSSObject';
import type DashStyleValue from '../Core/Renderer/DashStyleValue';
import type { PlotBandLabelOptions } from '../Core/Axis/PlotLineOrBand/PlotBandOptions';
import type {
    PlotLineLabelOptions,
    PlotLineOptions
} from '../Core/Axis/PlotLineOrBand/PlotLineOptions';
import type Templating from '../Core/Templating';
import type Time from '../Core/Time';

import Axis from '../Core/Axis/Axis.js';
import H from '../Core/Globals.js';
const { composed } = H;
import { Palette } from '../Core/Color/Palettes.js';
import PlotLineOrBand from '../Core/Axis/PlotLineOrBand/PlotLineOrBand.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    merge,
    pushUnique,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Axis/AxisOptions' {
    interface AxisOptions {
        currentDateIndicator?: (boolean|CurrentDateIndicatorOptions);
    }
}

interface CurrentDateIndicatorLabelOptions {

    /**
     * Horizontal alignment of the label. Can be one of 'left', 'center' or
     * 'right'.
     */
    align?: AlignValue;

    /**
     * Format of the label. This options is passed as the first argument to
     * [dateFormat](/class-reference/Highcharts.Time#dateFormat) function.
     *
     * @type      {string|Intl.DateTimeFormatOptions}
     * @product   gantt
     * @apioption xAxis.currentDateIndicator.label.format
     */
    format?: Time.DateTimeFormat;

    /**
     * Callback JavaScript function to format the label.
     */
    formatter?: Templating.FormatterCallback<PlotLineOrBand>;

    /**
     * Rotation of the time marker label in degrees.
     */
    rotation?: number;

    /**
     * CSS styles for the label.
     *
     * @see In [styled mode](https://www.highcharts.com/docs/chart-design-and-style/style-by-css),
     *      the labels are styled by the
     *      `.highcharts-current-date-indicator .highcharts-plot-line-label`
     *      class.
     */
    style?: CSSObject;

    /**
     * The text to display for the label.
     */
    text?: string;

    /**
     * The text alignment for the label. While `align` determines where the
     * texts anchor point is placed within the plot band, `textAlign` determines
     * how the text is aligned against its anchor point. Can be one of 'left',
     * 'center' or 'right'. Defaults to the same as the `align` option.
     */
    textAlign?: AlignValue;

    /**
     * Whether to use HTML to render the label.
     */
    useHTML?: boolean;

    /**
     * Vertical alignment of the label. Can be one of 'top', 'middle' or
     * 'bottom'.
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * Horizontal position of the label.
     */
    x?: number;

    /**
     * Vertical position of the label.
     */
    y?: number;

}
interface CurrentDateIndicatorOptions {

    /** @internal */
    acrossPanes?: boolean;

    /**
     * A custom class name to apply to the indicator.
     */
    className?: string;

    /**
     * The color of the indicator.
     */
    color?: ColorString;

    /**
     * The dash style of the indicator.
     */
    dashStyle?: DashStyleValue;

    /**
     * An object defining mouse events for the plot line. Supported properties
     * are `click`, `mouseover`, `mouseout`, `mousemove`.
     */
    events?: any;

    /**
     * An id for the plot line. Starting with v6.2 it is possible to advance the
     * plot line by calling {@link Axis#removePlotLine} or {@link Axis#addPlotLine}
     * with the same id.
     */
    id?: string;

    /**
     * A configuration object for the label.
     */
    label?: CurrentDateIndicatorLabelOptions;

    /**
     * The width of the indicator.
     */
    width?: number;

    /**
     * The z index of the plot line within the chart.
     */
    zIndex?: number;

}

/* *
 *
 *  Constants
 *
 * */

/**
 * Show an indicator on the axis for the current date and time. Can be a
 * boolean or a configuration object similar to
 * [xAxis.plotLines](#xAxis.plotLines).
 *
 * @sample gantt/current-date-indicator/demo
 *         Current date indicator enabled
 * @sample gantt/current-date-indicator/object-config
 *         Current date indicator with custom options
 *
 * @declare   Highcharts.CurrentDateIndicatorOptions
 * @type      {boolean|CurrentDateIndicatorOptions}
 * @default   true
 * @extends   xAxis.plotLines
 * @excluding value
 * @product   gantt
 * @apioption xAxis.currentDateIndicator
 */
const defaultOptions: CurrentDateIndicatorOptions = {
    color: Palette.highlightColor20,
    width: 2,
    /**
     * @declare Highcharts.AxisCurrentDateIndicatorLabelOptions
     */
    label: {
        /**
         * Format of the label. This options is passed as the first argument to
         * [dateFormat](/class-reference/Highcharts.Time#dateFormat) function.
         *
         * @type      {string|Intl.DateTimeFormatOptions}
         * @product   gantt
         * @apioption xAxis.currentDateIndicator.label.format
         */
        format: '%[abdYHM]',
        formatter: function (
            this: PlotLineOrBand,
            value?: number,
            format?: string
        ): string {
            return this.axis.chart.time.dateFormat(format || '', value, true);
        },
        rotation: 0,
        /**
         * @type {Highcharts.CSSObject}
         */
        style: {
            /** @internal */
            fontSize: '0.7em'
        }
    }
};

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function compose(
    AxisClass: typeof Axis,
    PlotLineOrBandClass: typeof PlotLineOrBand
): void {

    if (pushUnique(composed, 'CurrentDateIndication')) {
        addEvent(AxisClass, 'afterSetOptions', onAxisAfterSetOptions);

        addEvent(PlotLineOrBandClass, 'render', onPlotLineOrBandRender);

        wrap(
            PlotLineOrBandClass.prototype,
            'getLabelText',
            wrapPlotLineOrBandGetLabelText
        );
    }

}

/**
 * @private
 */
function onAxisAfterSetOptions(this: Axis): void {
    const options = this.options,
        cdiOptions = options.currentDateIndicator;


    if (cdiOptions) {
        const plotLineOptions: PlotLineOptions =
            typeof cdiOptions === 'object' ?
                merge(defaultOptions, cdiOptions) :
                merge(defaultOptions);

        plotLineOptions.value = Date.now();
        plotLineOptions.className = 'highcharts-current-date-indicator';

        if (!options.plotLines) {
            options.plotLines = [];
        }

        options.plotLines.push(plotLineOptions);
    }
}

/**
 * @private
 */
function onPlotLineOrBandRender(this: PlotLineOrBand): void {
    // If the label already exists, update its text
    if (this.label) {
        this.label.attr({
            text: this.getLabelText((this.options as any).label)
        });
    }
}

/**
 * @private
 */
function wrapPlotLineOrBandGetLabelText(
    this: PlotLineOrBand,
    defaultMethod: Function,
    defaultLabelOptions: (PlotBandLabelOptions|PlotLineLabelOptions)
): string {
    const options = this.options;

    if (
        options &&
        options.className &&
        options.className.indexOf('highcharts-current-date-indicator') !== -1 &&
        options.label &&
        typeof options.label.formatter === 'function'
    ) {

        (options as any).value = Date.now();
        return (options as any).label.formatter
            .call(this, (options as any).value, (options as any).label.format);
    }
    return defaultMethod.call(this, defaultLabelOptions);
}

/* *
 *
 *  Default Export
 *
 * */

const CurrentDateIndication = {
    compose
};

export default CurrentDateIndication;
