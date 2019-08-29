/* *
 *
 *  (c) 2010-2019 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Considers colorblindness and
 *  monochrome rendering.
 *
 * */

'use strict';

import Highcharts from '../parts/Globals.js';

Highcharts.theme = {
    colors: ['#FDD089', '#FF7F79', '#A0446E', '#251535'],

    colorAxis: {
        maxColor: '#60042E',
        minColor: '#FDD089'
    },

    plotOptions: {
        map: {
            nullColor: '#fefefc'
        }
    },

    navigator: {
        series: {
            color: '#FF7F79',
            lineColor: '#A0446E'
        }
    }
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
