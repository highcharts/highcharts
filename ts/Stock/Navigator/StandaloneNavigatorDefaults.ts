/* *
 *
 *  (c) 2010-2025 Mateusz Bernacik
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

const standaloneNavigatorDefaults: DeepPartial<Options> = {
    chart: {
        height: 70,
        margin: [0, 5, 0, 5]
    },
    exporting: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    navigator: {
        enabled: false
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
        enabled: false
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
