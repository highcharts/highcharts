/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type BoxPlotSeriesOptions from './BoxPlotSeriesOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

const BoxPlotSeriesDefaults: BoxPlotSeriesOptions = {

    threshold: null,

    tooltip: {
        pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b>' +
            '{series.name}</b><br/>' +
            'Maximum: {point.high}<br/>' +
            'Upper quartile: {point.q3}<br/>' +
            'Median: {point.median}<br/>' +
            'Lower quartile: {point.q1}<br/>' +
            'Minimum: {point.low}<br/>'
    },

    whiskerLength: '50%',

    fillColor: Palette.backgroundColor,

    lineWidth: 1,

    medianWidth: 2,

    /*
    // States are not working and are removed from docs.
    // Refer to: #2340
    states: {
        hover: {
            brightness: -0.3
        }
    },
    */

    whiskerWidth: 2

};

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotSeriesDefaults;
