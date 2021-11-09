/* *
 *
 *   (c) 2010-2021 Highsoft AS
 *
 *  Author: Nancy Dillon
 *
 *  License: www.highcharts.com/license
 *
 *  Dark theme based on Highcharts brand system
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

import type Options from '../../Core/Options';
import type { SeriesTypePlotOptions } from '../../Core/Series/SeriesType';
import D from '../../Core/DefaultOptions.js';
const { setOptions } = D;
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const { createElement } = U;

/* *
 *
 *  Theme
 *
 * */

namespace BrandDarkTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<Options> = {
        colors: ['#8087E8', '#A3EDBA', '#F19E53', '#6699A1', '#E1D369', '#87B4E7', '#DA6D85', '#BBBAC5'],

        chart: {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#1f1836'],
                    [1, '#45445d']
                ]
            },
            style: {
                fontFamily: 'IBM Plex Sans, sans-serif'
            }
        },

        title: {
            style: {
                fontSize: '22px',
                fontWeight: '500',
                color: '#fff'
            }
        },

        subtitle: {
            style: {
                fontSize: '16px',
                fontWeight: '400',
                color: '#fff'
            }
        },

        credits: {
            style: {
                color: '#f0f0f0'
            }
        },

        caption: {
            style: {
                color: '#f0f0f0'
            }
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: '#f0f0f0',
            shadow: true
        },

        legend: {
            backgroundColor: 'transparent',
            itemStyle: {
                fontWeight: '400',
                fontSize: '12px',
                color: '#fff'
            },
            itemHoverStyle: {
                fontWeight: '700',
                color: '#fff'
            }
        },

        labels: {
            style: {
                color: '#707073'
            }
        },

        plotOptions: {
            series: {
                dataLabels: {
                    color: '#46465C',
                    style: {
                        fontSize: '13px'
                    }
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: null as any,
                upColor: '#DA6D85',
                upLineColor: '#DA6D85'
            },
            errorbar: {
                color: 'white'
            },
            dumbbell: {
                lowColor: '#f0f0f0'
            },
            map: {
                borderColor: 'rgba(200, 200, 200, 1)',
                nullColor: '#78758C'

            }
        } as SeriesTypePlotOptions,

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            },
            drillUpButton: {
                theme: {
                    fill: '#fff'
                }
            }
        },

        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '12px'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#fff'
                }
            }
        },

        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '12px'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#fff',
                    fontWeight: '300'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                style: {
                    color: '#f0f0f0',
                    stroke: 'transparent'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        style: {
                            color: '#fff'
                        },
                        'stroke-width': 1,
                        stroke: 'white'
                    },
                    select: {
                        fill: '#000003',
                        style: {
                            color: '#fff'
                        },
                        'stroke-width': 1,
                        stroke: 'white'
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#000003',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#A3EDBA',
                lineColor: '#A3EDBA'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        }
    };

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Apply the theme.
     */
    export function apply(): void {
        // Load the fonts
        createElement('link', {
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:200,300,400,600,700',
            rel: 'stylesheet',
            type: 'text/css'
        }, null as any, document.getElementsByTagName('head')[0]);

        // Apply the theme
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default BrandDarkTheme;
