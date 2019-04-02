/* *
 *
 *  Test cases for highstock.d.ts
 *
 *  (c) 2018 Highsoft AS. All rights reserved.
 *
 * */

import * as Highcharts from 'highcharts/highstock';

test_seriesLine();
test_theme();

/**
 * Tests Highcharts.seriesTypes.line in a simple use case.
 */
function test_seriesLine() {
    const lineData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    Highcharts.stockChart('container', {
        chart: {
            borderWidth: 1
        },
        rangeSelector: {
            selected: 1
        },
        navigator: {
            series: {
                data: lineData
            }
        },
        series: [{
            type: 'line',
            data: lineData,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}

/**
 * Tests button theme options
 */
function test_theme() {
    Highcharts.stockChart('container', {
        rangeSelector: {
            buttonTheme: { // styles for the buttons
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                r: 8,
                style: {
                    color: '#039',
                    fontWeight: 'bold'
                },
                states: {
                    hover: {
                    },
                    select: {
                        fill: '#039',
                        style: {
                            color: 'white'
                        }
                    }
                    // disabled: { ... }
                }
            } as any,
            inputBoxBorderColor: 'gray',
            inputBoxWidth: 120,
            inputBoxHeight: 18,
            inputStyle: {
                color: '#039',
                fontWeight: 'bold'
            },
            labelStyle: {
                color: 'silver',
                fontWeight: 'bold'
            },
            selected: 1
        },
        chart: {
            resetZoomButton: {
                theme: {
                    states: {
                        hover: {
                            fill: '#c3d0db',
                            style: {
                                color: '#4285F4'
                            }
                        }
                    }
                } as any
            }
        },
        series: [{
            type: 'line',
            name: 'USD to EUR',
            data: []
        }]
    });
}
