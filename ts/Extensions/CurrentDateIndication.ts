/* *
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type ColorString from '../Core/Color/ColorString';
import type CSSObject from '../Core/Renderer/CSSObject';
import type DashStyleValue from '../Core/Renderer/DashStyleValue';
import Axis from '../Core/Axis/Axis.js';
import palette from '../Core/Color/Palette.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface CurrentDateIndicatorLabelFormatterCallbackFunction {
            (value: number, format: string): string;
        }
        interface CurrentDateIndicatorLabelOptions {
            align?: AlignValue;
            format?: string;
            formatter?: FormatterCallbackFunction<PlotLineOrBand>;
            rotation?: number;
            style?: CSSObject;
            text?: string;
            textAlign?: AlignValue;
            useHTML?: boolean;
            verticalAlign?: VerticalAlignValue;
            x?: number;
            y?: number;
        }
        interface CurrentDateIndicatorOptions {
            acrossPanes?: boolean;
            className?: string;
            color?: ColorString;
            dashStyle?: DashStyleValue;
            events?: any;
            id?: string;
            label?: CurrentDateIndicatorLabelOptions;
            width?: number;
            zIndex?: number;
        }
        interface XAxisOptions {
            currentDateIndicator?: (boolean|CurrentDateIndicatorOptions);
        }
    }
}

import U from '../Core/Utilities.js';
const {
    addEvent,
    merge,
    wrap
} = U;

import PlotLineOrBand from '../Core/Axis/PlotLineOrBand.js';

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

const defaultOptions: Highcharts.CurrentDateIndicatorOptions = {
    color: palette.highlightColor20,
    width: 2,
    /**
     * @declare Highcharts.AxisCurrentDateIndicatorLabelOptions
     */
    label: {
        /**
         * Format of the label. This options is passed as the fist argument to
         * [dateFormat](/class-reference/Highcharts#dateFormat) function.
         *
         * @type      {string}
         * @default   %a, %b %d %Y, %H:%M
         * @product   gantt
         * @apioption xAxis.currentDateIndicator.label.format
         */
        format: '%a, %b %d %Y, %H:%M',
        formatter: function (
            this: PlotLineOrBand,
            value?: number,
            format?: string
        ): string {
            return this.axis.chart.time.dateFormat(format || '', value);
        },
        rotation: 0,
        /**
         * @type {Highcharts.CSSObject}
         */
        style: {
            /** @internal */
            fontSize: '10px'
        }
    }
};

/* eslint-disable no-invalid-this */

addEvent(Axis, 'afterSetOptions', function (): void {
    var options = this.options,
        cdiOptions = options.currentDateIndicator;


    if (cdiOptions) {
        const plotLineOptions: Highcharts.AxisPlotLinesOptions =
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

});

addEvent(PlotLineOrBand, 'render', function (): void {
    // If the label already exists, update its text
    if (this.label) {
        this.label.attr({
            text: this.getLabelText((this.options as any).label)
        });
    }
});

wrap(PlotLineOrBand.prototype, 'getLabelText', function (
    this: Highcharts.PlotLineOrBand,
    defaultMethod: Function,
    defaultLabelOptions: (
        Highcharts.AxisPlotLinesLabelOptions|
        Highcharts.AxisPlotBandsLabelOptions
    )
): string {
    var options = this.options;

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
});
