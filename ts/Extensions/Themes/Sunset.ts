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

import type { SeriesPlotOptionsType } from '../../Core/Series/Types';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const { setOptions } = U;

H.theme = {
    colors: ['#FDD089', '#FF7F79', '#A0446E', '#251535'],

    colorAxis: {
        maxColor: '#60042E',
        minColor: '#FDD089'
    },

    plotOptions: {
        map: {
            nullColor: '#fefefc'
        }
    } as SeriesPlotOptionsType,

    navigator: {
        series: {
            color: '#FF7F79',
            lineColor: '#A0446E'
        }
    }
};

// Apply the theme
setOptions(H.theme);
