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
    AxisOptions,
    YAxisOptions
} from '../Axis/AxisOptions';
import type { DeepPartial } from '../../Shared/Types';
import type { HTMLDOMElement } from '../Renderer/DOMElementType';
import type Options from '../Options';

import Chart from './Chart.js';
import D from '../Defaults.js';
const { defaultOptions } = D;
import { Palette } from '../Color/Palettes.js';
import U from '../Utilities.js';
const {
    isArray,
    merge,
    splat
} = U;

/* *
 *
 * Declarations
 *
 * */

declare module '../Options' {
    interface Options {

        /** @internal */
        isGantt?: boolean;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * Gantt-optimized chart. Use {@link Highcharts.Chart|Chart} for common charts.
 *
 * @requires modules/gantt
 *
 * @class
 * @name Highcharts.GanttChart
 * @extends Highcharts.Chart
 */
class GanttChart extends Chart {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initializes the chart. The constructor's arguments are passed on
     * directly.
     *
     * @function Highcharts.GanttChart#init
     *
     * @param {Highcharts.Options} userOptions
     *        Custom options.
     *
     * @param {Function} [callback]
     *        Function to run when the chart has loaded and all external
     *        images are loaded.
     *
     *
     * @emits Highcharts.GanttChart#event:init
     * @emits Highcharts.GanttChart#event:afterInit
     */
    public init(
        userOptions: Partial<Options>,
        callback?: Chart.CallbackFunction
    ): void {
        const xAxisOptions = userOptions.xAxis,
            yAxisOptions = userOptions.yAxis;

        let defaultLinkedTo: number;

        // Avoid doing these twice
        userOptions.xAxis = userOptions.yAxis = void 0;

        const options = merge(
            true,
            {
                chart: {
                    type: 'gantt'
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                navigator: {
                    series: { type: 'gantt' },
                    // Bars were clipped, #14060.
                    yAxis: {
                        type: 'category'
                    }
                }
            } as Options,

            userOptions, // User's options

            // forced options
            {
                isGantt: true
            } as Options
        );

        userOptions.xAxis = xAxisOptions;
        userOptions.yAxis = yAxisOptions;

        // Apply X axis options to both single and multi x axes If user hasn't
        // defined axes as array, make it into an array and add a second axis by
        // default.
        options.xAxis = (
            !isArray(userOptions.xAxis) ?
                [userOptions.xAxis || {}, {}] :
                userOptions.xAxis
        ).map((
            xAxisOptions,
            i
        ): DeepPartial<AxisOptions> => {
            if (i === 1) { // Second xAxis
                defaultLinkedTo = 0;
            }
            return merge(
                // Defaults
                {
                    grid: {
                        borderColor: defaultOptions.xAxis?.grid?.borderColor ||
                            Palette.neutralColor20,
                        enabled: true
                    },
                    opposite: defaultOptions.xAxis?.opposite ??
                        xAxisOptions.opposite ??
                        true,
                    linkedTo: defaultLinkedTo
                },
                // User options
                xAxisOptions,
                // Forced options
                {
                    type: 'datetime'
                }
            );
        });

        // Apply Y axis options to both single and multi y axes
        options.yAxis = (splat(userOptions.yAxis || {})).map((
            yAxisOptions
        ): DeepPartial<YAxisOptions> => merge(
            // Defaults
            {
                grid: {
                    borderColor: defaultOptions.yAxis?.grid?.borderColor ||
                        Palette.neutralColor20,
                    enabled: true
                },

                staticScale: 50,

                reversed: true,

                // Set default type treegrid, but only if 'categories' is
                // undefined
                type: yAxisOptions.categories ? yAxisOptions.type : 'treegrid'

            },
            // User options
            yAxisOptions
        ));
        super.init(options, callback);
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/** @internal */
namespace GanttChart {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable jsdoc/check-param-names */

    /**
     * The factory function for creating new gantt charts. Creates a new {@link
     * Highcharts.GanttChart|GanttChart} object with different default options
     * than the basic Chart.
     *
     * @example
     * // Render a chart in to div#container
     * let chart = Highcharts.ganttChart('container', {
     *     title: {
     *         text: 'My chart'
     *     },
     *     series: [{
     *         data: ...
     *     }]
     * });
     *
     * @function Highcharts.ganttChart
     *
     * @param {string|Highcharts.HTMLDOMElement} renderTo
     *        The DOM element to render to, or its id.
     *
     * @param {Highcharts.Options} options
     *        The chart options structure.
     *
     * @param {Highcharts.ChartCallbackFunction} [callback]
     *        Function to run when the chart has loaded and all external
     *        images are loaded. Defining a
     *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
     *        handler is equivalent.
     *
     * @return {Highcharts.GanttChart}
     *         Returns the Chart object.
     */
    export function ganttChart(
        a: (string|HTMLDOMElement|Options),
        b?: (Chart.CallbackFunction|Options),
        c?: Chart.CallbackFunction
    ): GanttChart {
        return new GanttChart(a as any, b as any, c);
    }

    /* eslint-enable jsdoc/check-param-names */

}

/* *
 *
 *  Default Export
 *
 * */

export default GanttChart;
