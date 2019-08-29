/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Default theme for Windows High Contrast Mode.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

var theme = {
    chart: {
        backgroundColor: 'window'
    },
    title: {
        style: {
            color: 'windowText'
        }
    },
    subtitle: {
        style: {
            color: 'windowText'
        }
    },
    colorAxis: {
        minColor: 'windowText',
        maxColor: 'windowText',
        stops: null
    },
    colors: ['windowText'],
    xAxis: {
        gridLineColor: 'windowText',
        labels: {
            style: {
                color: 'windowText'
            }
        },
        lineColor: 'windowText',
        minorGridLineColor: 'windowText',
        tickColor: 'windowText',
        title: {
            style: {
                color: 'windowText'
            }
        }
    },
    yAxis: {
        gridLineColor: 'windowText',
        labels: {
            style: {
                color: 'windowText'
            }
        },
        lineColor: 'windowText',
        minorGridLineColor: 'windowText',
        tickColor: 'windowText',
        title: {
            style: {
                color: 'windowText'
            }
        }
    },
    tooltip: {
        backgroundColor: 'window',
        borderColor: 'windowText',
        style: {
            color: 'windowText'
        }
    },
    plotOptions: {
        series: {
            lineColor: 'windowText',
            fillColor: 'window',
            borderColor: 'windowText',
            edgeColor: 'windowText',
            borderWidth: 1,
            dataLabels: {
                connectorColor: 'windowText',
                color: 'windowText',
                style: {
                    color: 'windowText',
                    textOutline: 'none'
                }
            },
            marker: {
                lineColor: 'windowText',
                fillColor: 'windowText'
            }
        },
        pie: {
            color: 'window',
            colors: ['window'],
            borderColor: 'windowText',
            borderWidth: 1
        },
        boxplot: {
            fillColor: 'window'
        },
        candlestick: {
            lineColor: 'windowText',
            fillColor: 'window'
        },
        errorbar: {
            fillColor: 'window'
        }
    },
    legend: {
        backgroundColor: 'window',
        itemStyle: {
            color: 'windowText'
        },
        itemHoverStyle: {
            color: 'windowText'
        },
        itemHiddenStyle: {
            color: '#555'
        },
        title: {
            style: {
                color: 'windowText'
            }
        }
    },
    credits: {
        style: {
            color: 'windowText'
        }
    },
    labels: {
        style: {
            color: 'windowText'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: 'windowText'
        },
        activeDataLabelStyle: {
            color: 'windowText'
        }
    },
    navigation: {
        buttonOptions: {
            symbolStroke: 'windowText',
            theme: {
                fill: 'window'
            }
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: 'window',
            stroke: 'windowText',
            style: {
                color: 'windowText'
            },
            states: {
                hover: {
                    fill: 'window',
                    stroke: 'windowText',
                    style: {
                        color: 'windowText'
                    }
                },
                select: {
                    fill: '#444',
                    stroke: 'windowText',
                    style: {
                        color: 'windowText'
                    }
                }
            }
        },
        inputBoxBorderColor: 'windowText',
        inputStyle: {
            backgroundColor: 'window',
            color: 'windowText'
        },
        labelStyle: {
            color: 'windowText'
        }
    },
    navigator: {
        handles: {
            backgroundColor: 'window',
            borderColor: 'windowText'
        },
        outlineColor: 'windowText',
        maskFill: 'transparent',
        series: {
            color: 'windowText',
            lineColor: 'windowText'
        },
        xAxis: {
            gridLineColor: 'windowText'
        }
    },
    scrollbar: {
        barBackgroundColor: '#444',
        barBorderColor: 'windowText',
        buttonArrowColor: 'windowText',
        buttonBackgroundColor: 'window',
        buttonBorderColor: 'windowText',
        rifleColor: 'windowText',
        trackBackgroundColor: 'window',
        trackBorderColor: 'windowText'
    }
};

export default theme;
