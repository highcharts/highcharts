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

import type { Options } from '../../Core/Options';

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
const standaloneNavigatorDefaults: DeepPartial<Options> = {
    chart: {
        height: 70,
        margin: [0, 5, 0, 5]
    },
    legend: {
        enabled: false
    },
    navigator: {
        enabled: true
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
    },
    scrollbar: {
        enabled: true
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        height: 0,
        visible: false
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default standaloneNavigatorDefaults;

/* *
 *
 *  API Options
 *
 * */

(''); // keeps doclets above in JS file
