/* *
 *
 *   (c) 2010-2021 Highsoft AS
 *
 *  Author: Nancy Dillon
 *
 *  License: www.highcharts.com/license
 *
 *  Light theme based on Highcharts brand system
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

namespace BrandLightTheme {

    /* *
     *
     *  Constants
     *
     * */

    export const options: DeepPartial<Options> = {
        colors: ['#8087E8', '#A3EDBA', '#F19E53', '#6699A1', '#E1D369', '#87B4E7', '#DA6D85', '#BBBAC5'],
        chart: {
            backgroundColor: '#f0f0f0',
            style: {
                fontFamily: 'IBM Plex Sans, sans-serif'
            }
        },
        title: {
            style: {
                fontSize: '22px',
                fontWeight: '500',
                color: '#2F2B38'
            }
        },
        subtitle: {
            style: {
                fontSize: '16px',
                fontWeight: '400',
                color: '#2F2B38'
            }
        },
        tooltip: {
            borderWidth: 0,
            backgroundColor: '#46465C',
            style: {
                color: '#f0f0f0'
            },
            shadow: true
        },
        legend: {
            backgroundColor: 'transparent',
            itemStyle: {
                fontWeight: '400',
                fontSize: '12px',
                color: '#2F2B38'
            },
            itemHoverStyle: {
                fontWeight: '700',
                color: '#46465C'
            }
        },
        navigation: {
            buttonOptions: {
                symbolStroke: '#2F2B38',
                theme: {
                    fill: '#fff',
                    states: {
                        hover: {
                            fill: '#46465C'
                        },
                        select: {
                            fill: '#46465C'
                        }
                    }
                }
            }
        },
        labels: {
            style: {
                color: '#46465C'
            }
        },
        credits: {
            style: {
                color: '#46465C'
            }
        },
        drilldown: {
            activeAxisLabelStyle: {
                color: '#2F2B38'
            },
            activeDataLabelStyle: {
                color: '#2F2B38'
            },
            drillUpButton: {
                theme: {
                    fill: '#2F2B38',
                    style: {
                        color: '#fff'
                    }
                }
            }
        },
        colorAxis: {
            labels: {
                style: {
                    color: '#2F2B38'
                }
            }
        },
        xAxis: {
            gridLineColor: '#ccc',
            labels: {
                style: {
                    color: '#46465C',
                    fontSize: '12px'
                }
            },
            lineColor: '#ccc',
            minorGridLineColor: '#ebebeb',
            tickColor: '#ccc',
            title: {
                style: {
                    color: '#2F2B38'
                }
            }
        },
        yAxis: {
            gridLineColor: '#ccc',
            labels: {
                style: {
                    color: '#46465C',
                    fontSize: '12px'
                }
            },
            lineColor: '#ccc',
            minorGridLineColor: '#ebebeb',
            tickColor: '#ccc',
            tickWidth: 1,
            title: {
                style: {
                    color: '#2F2B38',
                    fontWeight: '300'
                }
            }
        },
        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#2F2B38',
                style: {
                    color: '#f0f0f0',
                    stroke: 'transparent'
                },
                states: {
                    hover: {
                        fill: '#46465C',
                        style: {
                            color: '#fff',
                            stroke: '#fff'
                        }
                    },
                    select: {
                        fill: '#46465C',
                        style: {
                            color: '#fff',
                            stroke: '#fff'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#f0f0f0',
            inputStyle: {
                backgroundColor: '#f0f0f0',
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
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    color: '#F0F0F3',
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
            }
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
            href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
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

export default BrandLightTheme;
