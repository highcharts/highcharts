/* *
 *
 *  (c) 2009-2024 Highsoft AS
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


import type Globals from '../../Globals';
import type Options from './NavigatorComponentOptions';

import Component from '../Component.js';


/* *
 *
 *  Constants
 *
 * */

const NavigatorComponentDefaults: Globals.DeepPartial<Options> = {
    type: 'Navigator',
    className: [
        Component.defaultOptions.className,
        `${Component.defaultOptions.className}-navigator`
    ].join(' '),
    chartOptions: {
        chart: {
            animation: false,
            height: 200,
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
                lineWidth: 0,
                colorIndex: 0
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
            visible: false,
            minRange: Number.MIN_VALUE
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
