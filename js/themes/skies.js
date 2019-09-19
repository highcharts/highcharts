/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  Skies theme for Highcharts JS
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Highcharts from '../parts/Globals.js';
Highcharts.theme = {
    colors: ['#514F78', '#42A07B', '#9B5E4A', '#72727F', '#1F949A',
        '#82914E', '#86777F', '#42A07B'],
    chart: {
        className: 'skies',
        borderWidth: 0,
        plotShadow: true,
        plotBackgroundImage: 'https://www.highcharts.com/demo/gfx/skies.jpg',
        plotBackgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
                [0, 'rgba(255, 255, 255, 1)'],
                [1, 'rgba(255, 255, 255, 0)']
            ]
        },
        plotBorderWidth: 1
    },
    title: {
        style: {
            color: '#3E576F',
            font: '16px Lucida Grande, Lucida Sans Unicode,' +
                ' Verdana, Arial, Helvetica, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#6D869F',
            font: '12px Lucida Grande, Lucida Sans Unicode,' +
                ' Verdana, Arial, Helvetica, sans-serif'
        }
    },
    xAxis: {
        gridLineWidth: 0,
        lineColor: '#C0D0E0',
        tickColor: '#C0D0E0',
        labels: {
            style: {
                color: '#666',
                fontWeight: 'bold'
            }
        },
        title: {
            style: {
                color: '#666',
                font: '12px Lucida Grande, Lucida Sans Unicode,' +
                    ' Verdana, Arial, Helvetica, sans-serif'
            }
        }
    },
    yAxis: {
        alternateGridColor: 'rgba(255, 255, 255, .5)',
        lineColor: '#C0D0E0',
        tickColor: '#C0D0E0',
        tickWidth: 1,
        labels: {
            style: {
                color: '#666',
                fontWeight: 'bold'
            }
        },
        title: {
            style: {
                color: '#666',
                font: '12px Lucida Grande, Lucida Sans Unicode,' +
                    ' Verdana, Arial, Helvetica, sans-serif'
            }
        }
    },
    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: '#3E576F'
        },
        itemHoverStyle: {
            color: 'black'
        },
        itemHiddenStyle: {
            color: 'silver'
        }
    },
    labels: {
        style: {
            color: '#3E576F'
        }
    }
};
// Apply the theme
Highcharts.setOptions(Highcharts.theme);
