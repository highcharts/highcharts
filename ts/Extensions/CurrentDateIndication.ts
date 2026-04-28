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

import type ColorString from '../Core/Color/ColorString';
import type { PlotBandLabelOptions } from '../Core/Axis/PlotLineOrBand/PlotBandOptions';
import type {
    PlotLineLabelOptions,
    PlotLineOptions
} from '../Core/Axis/PlotLineOrBand/PlotLineOptions';
import type Time from '../Core/Time';

import Axis from '../Core/Axis/Axis.js';
import H from '../Core/Globals.js';
const { composed } = H;
import { Palette } from '../Core/Color/Palettes.js';
import PlotLineOrBand from '../Core/Axis/PlotLineOrBand/PlotLineOrBand.js';
import { addEvent, merge, pushUnique, wrap } from '../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Axis/AxisOptions' {
    interface AxisOptions {
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
         * @default true
         * @product gantt
         */
        currentDateIndicator?: (boolean|CurrentDateIndicatorOptions);
    }
}

interface CurrentDateIndicatorLabelOptions extends PlotLineLabelOptions {
    /**
     * Format of the label. This options is passed as the first argument to
     * [dateFormat](/class-reference/Highcharts.Time#dateFormat) function.
     *
     * @default '%[abdYHM]'
     */
    format?: Time.DateTimeFormat;

    /** @default 0 */
    rotation?: PlotLineLabelOptions['rotation'];
}

interface CurrentDateIndicatorOptions extends PlotLineOptions {

    /** @default ${palette.highlightColor20} */
    color?: ColorString;

    label?: CurrentDateIndicatorLabelOptions;

    /** @default 2 */
    width?: PlotLineOptions['width'];

    /* *
     *
     *  Excluded
     *
     * */

    /**
     * Internally overridden later to 'highcharts-current-date-indicator'.
     */
    className?: undefined;

    /**
     * Internally overridden later to the current timestamp.
     */
    value?: undefined;
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
 * @excluding className, value
 * @product   gantt
 * @apioption xAxis.currentDateIndicator
 */
const defaultOptions: CurrentDateIndicatorOptions = {
    /**
     * @type {Highcharts.ColorType}
     */
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
         * @default   %[abdYHM]
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

/** @internal */
export function composeCurrentDateIndication(
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

/** @internal */
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

        options.plotLines ??= [];
        options.plotLines.push(plotLineOptions);
    }
}

/** @internal */
function onPlotLineOrBandRender(this: PlotLineOrBand): void {
    // If the label already exists, update its text
    this.label?.attr({
        text: this.getLabelText(this.options.label || {})
    });
}

/** @internal */
function wrapPlotLineOrBandGetLabelText(
    this: PlotLineOrBand,
    defaultMethod: Function,
    defaultLabelOptions: (PlotBandLabelOptions|PlotLineLabelOptions)
): string {
    if (
        this.options.className &&
        this.options.className.indexOf(
            'highcharts-current-date-indicator'
        ) !== -1 &&
        typeof this.options.label?.formatter === 'function'
    ) {
        const options = this.options as PlotLineOptions;
        options.value = Date.now();
        return options.label?.formatter?.call(
            this,
            options.value,
            (options.label as any).format,
            this
        ) || '';
    }
    return defaultMethod.call(this, defaultLabelOptions);
}
