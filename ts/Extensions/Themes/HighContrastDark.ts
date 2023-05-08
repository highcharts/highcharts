/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Øystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  Accessible high-contrast dark theme for Highcharts. Specifically tailored
 *  towards 3:1 contrast against black/off-black backgrounds. Neighboring
 *  colors are tested for color blindness.
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

import D from '../../Core/Defaults.js';
const { setOptions } = D;

/* *
 *
 *  Theme
 *
 * */

namespace HighContrastDarkTheme {

    /* *
     *
     *  Constants
     *
     * */

    const textBright = '#F0F0F3';

    export const options: DeepPartial<Options> = {
        colors: [
            '#67B9EE',
            '#CEEDA5',
            '#9F6AE1',
            '#FEA26E',
            '#6BA48F',
            '#EA3535',
            '#8D96B7',
            '#ECCA15',
            '#20AA09',
            '#E0C3E4'
        ],
        chart: {
            backgroundColor: '#1f1f20',
            plotBorderColor: '#606063'
        },

        title: {
            style: {
                color: textBright
            }
        },

        subtitle: {
            style: {
                color: textBright
            }
        },

        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: textBright
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: textBright

                }
            }
        },

        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: textBright
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: textBright
                }
            }
        },

        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: textBright
            }
        },

        plotOptions: {
            series: {
                dataLabels: {
                    color: textBright
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            },
            map: {
                nullColor: '#353535'
            }
        } as SeriesTypePlotOptions,

        legend: {
            backgroundColor: 'transparent',
            itemStyle: {
                color: textBright
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            },
            title: {
                style: {
                    color: '#D0D0D0'
                }
            }
        },

        credits: {
            style: {
                color: textBright
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: textBright
            },
            activeDataLabelStyle: {
                color: textBright
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#eee'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: textBright
                        }
                    },
                    select: {
                        fill: '#303030',
                        stroke: '#101010',
                        style: {
                            color: textBright
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: textBright
            },
            labelStyle: {
                color: textBright
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(180,180,255,0.2)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
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
        setOptions(options);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default HighContrastDarkTheme;
