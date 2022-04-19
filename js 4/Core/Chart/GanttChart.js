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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Chart from './Chart.js';
import D from '../DefaultOptions.js';
var getOptions = D.getOptions;
import U from '../Utilities.js';
var isArray = U.isArray, merge = U.merge, splat = U.splat;
import '../../Series/Gantt/GanttSeries.js';
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
var GanttChart = /** @class */ (function (_super) {
    __extends(GanttChart, _super);
    function GanttChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
     *        Function to run when the chart has loaded and and all external
     *        images are loaded.
     *
     *
     * @emits Highcharts.GanttChart#event:init
     * @emits Highcharts.GanttChart#event:afterInit
     */
    GanttChart.prototype.init = function (userOptions, callback) {
        var defaultOptions = getOptions(), xAxisOptions = userOptions.xAxis, yAxisOptions = userOptions.yAxis;
        var defaultLinkedTo;
        // Avoid doing these twice
        userOptions.xAxis = userOptions.yAxis = void 0;
        var options = merge(true, {
            chart: {
                type: 'gantt'
            },
            title: {
                text: null
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
        }, userOptions, // user's options
        // forced options
        {
            isGantt: true
        });
        userOptions.xAxis = xAxisOptions;
        userOptions.yAxis = yAxisOptions;
        // apply X axis options to both single and multi x axes
        // If user hasn't defined axes as array, make it into an array and add a
        // second axis by default.
        options.xAxis = (!isArray(userOptions.xAxis) ?
            [userOptions.xAxis || {}, {}] :
            userOptions.xAxis).map(function (xAxisOptions, i) {
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
        options.yAxis = (splat(userOptions.yAxis || {})).map(function (yAxisOptions) {
            return merge(defaultOptions.yAxis, // #3802
            {
                grid: {
                    enabled: true
                },
                staticScale: 50,
                reversed: true,
                // Set default type treegrid, but only if 'categories' is
                // undefined
                type: yAxisOptions.categories ?
                    yAxisOptions.type : 'treegrid'
            }, yAxisOptions // user options
            );
        });
        _super.prototype.init.call(this, options, callback);
    };
    return GanttChart;
}(Chart));
/* eslint-disable valid-jsdoc */
(function (GanttChart) {
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
     *        Function to run when the chart has loaded and and all external
     *        images are loaded. Defining a
     *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
     *        handler is equivalent.
     *
     * @return {Highcharts.GanttChart}
     *         Returns the Chart object.
     */
    function ganttChart(a, b, c) {
        return new GanttChart(a, b, c);
    }
    GanttChart.ganttChart = ganttChart;
})(GanttChart || (GanttChart = {}));
export default GanttChart;
