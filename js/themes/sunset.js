/* *
 *
 *  (c) 2010-2020 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast theme for Highcharts. Considers colorblindness and
 *  monochrome rendering.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Highcharts from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var setOptions = U.setOptions;
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
setOptions(Highcharts.theme);
