/* *
 *
 *  (c) 2016-2019 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Options {
            isGantt?: boolean;
        }
        function ganttChart(
            renderTo: (string|HTMLDOMElement),
            options: Options,
            callback?: ChartCallbackFunction
        ): Chart;
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray,
    splat = U.splat;

import './GanttSeries.js';

var merge = H.merge,
    Chart = H.Chart;

/**
 * Factory function for Gantt charts.
 *
 * @example
 * // Render a chart in to div#container
 * var chart = Highcharts.ganttChart('container', {
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
 *        Function to run when the chart has loaded and and all external images
 *        are loaded. Defining a
 *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
 *        handler is equivalent.
 *
 * @return {Highcharts.Chart}
 *         Returns the Chart object.
 */
H.ganttChart = function (
    renderTo: (string|Highcharts.HTMLDOMElement),
    options: Highcharts.Options,
    callback?: Highcharts.ChartCallbackFunction
): Highcharts.Chart {
    var hasRenderToArg = typeof renderTo === 'string' || renderTo.nodeName,
        seriesOptions = options.series,
        defaultOptions = H.getOptions(),
        defaultLinkedTo: number,
        userOptions = options;

    options = arguments[hasRenderToArg ? 1 : 0];

    // If user hasn't defined axes as array, make it into an array and add a
    // second axis by default.
    if (!isArray(options.xAxis)) {
        options.xAxis = [options.xAxis || {}, {}];
    }

    // apply X axis options to both single and multi x axes
    options.xAxis = options.xAxis.map(function (
        xAxisOptions: Highcharts.XAxisOptions,
        i: number
    ): Highcharts.XAxisOptions {
        if (i === 1) { // Second xAxis
            defaultLinkedTo = 0;
        }
        return merge<Highcharts.XAxisOptions>(
            defaultOptions.xAxis as any,
            { // defaults
                grid: {
                    enabled: true
                },
                opposite: true,
                linkedTo: defaultLinkedTo
            } as Highcharts.XAxisOptions,
            xAxisOptions, // user options
            { // forced options
                type: 'datetime'
            } as Highcharts.XAxisOptions
        );
    });

    // apply Y axis options to both single and multi y axes
    options.yAxis = (splat(options.yAxis || {})).map(function (
        yAxisOptions: Highcharts.YAxisOptions
    ): Highcharts.YAxisOptions {
        return merge<Highcharts.YAxisOptions>(
            defaultOptions.yAxis as any, // #3802
            { // defaults
                grid: {
                    enabled: true
                },

                staticScale: 50,

                reversed: true,

                // Set default type treegrid, but only if 'categories' is
                // undefined
                type: yAxisOptions.categories ? yAxisOptions.type : 'treegrid'
            } as Highcharts.YAxisOptions,
            yAxisOptions // user options
        );
    });

    options.series = null as any;

    options = merge(
        true,
        {
            chart: {
                type: 'gantt'
            },
            title: {
                text: null as any
            },
            legend: {
                enabled: false
            }
        } as Highcharts.Options,

        options, // user's options

        // forced options
        {
            isGantt: true
        } as Highcharts.Options
    );

    options.series = userOptions.series = seriesOptions;

    (options.series as any).forEach(function (series: Highcharts.Series): void {
        series.data.forEach(function (point: Highcharts.Point): void {
            H.seriesTypes.gantt.prototype.setGanttPointAliases(point as any);
        });
    });

    return hasRenderToArg ?
        new Chart(renderTo, options, callback) :
        new Chart(options as any, options); // @todo does not look correct
};
