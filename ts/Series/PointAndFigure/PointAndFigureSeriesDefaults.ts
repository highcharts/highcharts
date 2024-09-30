/* *
 *
 *  (c) 2010-2024 Kamil Musiałowski
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

import type PointAndFigureSeriesOptions from './PointAndFigureSeriesOptions';

const PointAndFigureSeriesDefaults: PointAndFigureSeriesOptions = {
    boxSize: '2%',
    reversalAmount: 3,
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
          '<b> {series.name}</b><br/>' +
          'Close: {point.y}<br/>',
        headerFormat: ''
    },
    turboThreshold: 0,
    groupPadding: 0.2,
    pointPadding: 0.1,
    pointRange: null,
    dataGrouping: {
        groupAll: true,
        enabled: true,
        forced: true
    },
    markerUp: {
        symbol: 'cross',
        lineColor: '#00FF00',
        lineWidth: 2
    },
    marker: {
        symbol: 'circle',
        fillColor: 'transparent',
        lineColor: '#FF0000',
        lineWidth: 2
    }

};

''; // Keeps doclets above detached

/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSeriesDefaults;
