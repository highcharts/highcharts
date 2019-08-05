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
import U from '../parts/Utilities.js';
var isArray = U.isArray, splat = U.splat;
import 'GanttSeries.js';
var merge = H.merge, Chart = H.Chart;
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
H.ganttChart = function (renderTo, options, callback) {
    var hasRenderToArg = typeof renderTo === 'string' || renderTo.nodeName, seriesOptions = options.series, defaultOptions = H.getOptions(), defaultLinkedTo, userOptions = options;
    options = arguments[hasRenderToArg ? 1 : 0];
    // If user hasn't defined axes as array, make it into an array and add a
    // second axis by default.
    if (!isArray(options.xAxis)) {
        options.xAxis = [options.xAxis || {}, {}];
    }
    // apply X axis options to both single and multi x axes
    options.xAxis = options.xAxis.map(function (xAxisOptions, i) {
        if (i === 1) { // Second xAxis
            defaultLinkedTo = 0;
        }
        return merge(defaultOptions.xAxis, {
            grid: {
                enabled: true
            },
            opposite: true,
            linkedTo: defaultLinkedTo
        }, xAxisOptions, // user options
        {
            type: 'datetime'
        });
    });
    // apply Y axis options to both single and multi y axes
    options.yAxis = (splat(options.yAxis || {})).map(function (yAxisOptions) {
        return merge(defaultOptions.yAxis, // #3802
        {
            grid: {
                enabled: true
            },
            staticScale: 50,
            reversed: true,
            // Set default type treegrid, but only if 'categories' is
            // undefined
            type: yAxisOptions.categories ? yAxisOptions.type : 'treegrid'
        }, yAxisOptions // user options
        );
    });
    options.series = null;
    options = merge(true, {
        chart: {
            type: 'gantt'
        },
        title: {
            text: null
        },
        legend: {
            enabled: false
        }
    }, options, // user's options
    // forced options
    {
        isGantt: true
    });
    options.series = userOptions.series = seriesOptions;
    options.series.forEach(function (series) {
        series.data.forEach(function (point) {
            H.seriesTypes.gantt.prototype.setGanttPointAliases(point);
        });
    });
    return hasRenderToArg ?
        new Chart(renderTo, options, callback) :
        new Chart(options, options); // @todo does not look correct
};
