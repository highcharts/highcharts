/* *
 *
 *  (c) 2010-2023 Mateusz Bernacik
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

/* *
 *
 *  Constants
 *
 * */

/**
 * The navigator is a small series below the main series, displaying
 * a view of the entire data set. It provides tools to zoom in and
 * out on parts of the data as well as panning across the dataset.
 *
 * @product      highstock gantt
 * @optionparent navigator
 */
const StandaloneNavigatorDefaults = {
    height: 50,
    tooltip: {
        enabled: false
    },
    navigator: {
        enabled: true
    },
    scrollbar: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    yAxis: {
        height: 0,
        visible: false
    },
    xAxis: {
        visible: false
    },
    title: {
        text: null
    },
    chart: {
        spacing: [0, 0, 0, 0],
        margin: [0, 0, 0, 0]
    },
    plotOptions: {
        series: {
            states: {
                hover: {
                    enabled: false
                }
            },
            marker: {
                enabled: false
            }
        }
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default StandaloneNavigatorDefaults;

/* *
 *
 *  API Options
 *
 * */

/**
 * Maximum range which can be set using the navigator's handles.
 * Opposite of [xAxis.minRange](#xAxis.minRange).
 *
 * @sample {highstock} stock/navigator/maxrange/
 *         Defined max and min range
 *
 * @type      {number}
 * @since     6.0.0
 * @product   highstock gantt
 * @apioption xAxis.maxRange
 */

(''); // keeps doclets above in JS file
