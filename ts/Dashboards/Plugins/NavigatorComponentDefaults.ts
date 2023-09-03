/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Globals from '../Globals';
import type NavigatorComponentOptions from './NavigatorComponentOptions';

import Component from '../Components/Component.js';


/* *
 *
 *  Constants
 *
 * */


const NavigatorComponentDefaults:
Globals.DeepPartial<NavigatorComponentOptions> = {
    type: 'Navigator',
    chartOptions: {
        chart: {
            animation: false,
            height: 200,
            styledMode: true,
            type: 'column',
            zooming: {
                mouseWheel: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        navigator: {
            enabled: true,
            outlineWidth: 0,
            series: {
                animation: false,
                lineWidth: 0
            },
            xAxis: {
                endOnTick: true,
                gridZIndex: 4,
                labels: {
                    x: 1,
                    y: 22
                },
                opposite: true,
                showFirstLabel: true,
                showLastLabel: true,
                startOnTick: true,
                tickPosition: 'inside'
            },
            yAxis: {
                maxPadding: 0.5
            }
        },
        plotOptions: {
            series: {
                borderRadius: 0,
                marker: {
                    enabled: false
                },
                states: {
                    hover: {
                        enabled: false
                    }
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
            visible: false
        }
    },
    editableOptions: (Component.defaultOptions.editableOptions || []).concat()
};


/* *
 *
 *  Default Export
 *
 * */


export default NavigatorComponentDefaults;
