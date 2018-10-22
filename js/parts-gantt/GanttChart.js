/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import 'GanttSeries.js';

var each = H.each,
    map = H.map,
    merge = H.merge,
    splat = H.splat,
    Chart = H.Chart;

/**
 * The GanttChart class.
 * @class Highcharts.ganttChart
 * @memberOf Highcharts
 * @param {String|HTMLDOMElement} renderTo The DOM element to render to, or
 *                                         its id.
 * @param {ChartOptions}          options  The chart options structure.
 * @param {Function}              callback Function to run when the chart has
 *                                         loaded.
 */
H.ganttChart = function (renderTo, options, callback) {
    var hasRenderToArg = typeof renderTo === 'string' || renderTo.nodeName,
        seriesOptions = options.series,
        defaultOptions = H.getOptions(),
        defaultLinkedTo;
    options = arguments[hasRenderToArg ? 1 : 0];

    // If user hasn't defined axes as array, make it into an array and add a
    // second axis by default.
    if (!H.isArray(options.xAxis)) {
        options.xAxis = [options.xAxis || {}, {}];
    }

    // apply X axis options to both single and multi x axes
    options.xAxis = map(options.xAxis, function (xAxisOptions, i) {
        if (i === 1) { // Second xAxis
            defaultLinkedTo = 0;
        }
        return merge(
            defaultOptions.xAxis,
            { // defaults
                grid: {
                    enabled: true
                },
                opposite: true,
                linkedTo: defaultLinkedTo
            },
            xAxisOptions, // user options
            { // forced options
                type: 'datetime'
            }
        );
    });

    // apply Y axis options to both single and multi y axes
    options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
        return merge(
            defaultOptions.yAxis, // #3802
            { // defaults
                grid: {
                    enabled: true
                },

                staticScale: 50,

                reversed: true,

                // Set default type treegrid, but only if 'categories' is
                // undefined
                type: yAxisOptions.categories ? yAxisOptions.type : 'treegrid'
            },
            yAxisOptions // user options
        );
    });

    options.series = null;

    options = merge(
        {
            chart: {
                type: 'gantt'
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            }
        },

        options // user's options
    );

    options.series = seriesOptions;

    each(options.series, function (series) {
        each(series.data, function (point) {
            H.seriesTypes.gantt.prototype.setGanttPointAliases(point);
        });
    });

    return hasRenderToArg ?
        new Chart(renderTo, options, callback) :
        new Chart(options, options);
};
