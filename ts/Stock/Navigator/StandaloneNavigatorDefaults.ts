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
    tooltip: {
        enabled: false
    },
    navigator: {
        enabled: true
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
        text: ''
    },
    scrollbar: {
        enabled: true
    },
    chart: {
        margin: [0, 5, 0, 5]
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

export default standaloneNavigatorDefaults;

/* *
 *
 *  API Options
 *
 * */

(''); // keeps doclets above in JS file
