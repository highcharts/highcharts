Highcharts.theme = {
    colors: ['#d35400', '#2980b9', '#2ecc71', '#f1c40f', '#2c3e50', '#7f8c8d'],
    chart: {
        style: {
            fontFamily: 'Roboto'
        }
    },
    title: {
        align: 'left',
        style: {
            fontFamily: 'Roboto Condensed',
            fontWeight: 'bold'
        }
    },
    subtitle: {
        align: 'left',
        style: {
            fontFamily: 'Roboto Condensed'
        }
    },
    legend: {
        align: 'right',
        verticalAlign: 'bottom'
    },
    xAxis: {
        gridLineWidth: 1,
        gridLineColor: '#F3F3F3',
        lineColor: '#F3F3F3',
        minorGridLineColor: '#F3F3F3',
        tickColor: '#F3F3F3',
        tickWidth: 1
    },
    yAxis: {
        gridLineColor: '#F3F3F3',
        lineColor: '#F3F3F3',
        minorGridLineColor: '#F3F3F3',
        tickColor: '#F3F3F3',
        tickWidth: 1
    },
    plotOptions: {
        line: {
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidthPlus: 1
                }
            }
        },
        spline: {
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidthPlus: 1
                }
            }
        },
        area: {
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidthPlus: 1
                }
            }
        },
        areasplin: {
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidthPlus: 1
                }
            }
        }
    }
};

Highcharts.setOptions(Highcharts.theme);

Highcharts.chart('container', {
    title: {
        text: null
    },
    yAxis: {
        title: {
            text: null
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            turboThreshold: 0,
            borderWidth: 0,
            pointWidth: 4
        },
        treemap: {
            layoutAlgorithm: 'squarified'
        },
        bubble: {
            minSize: 5,
            maxSize: 25
        }
    },
    annotationsOptions: {
        enabledButtons: false
    },
    tooltip: {
        delayForDisplay: 10,
        shared: true,
        useHTML: true,
        headerFormat: '<small>\n  {point.x: %b %d}\n  <br/>\n</small>'
    },
    xAxis: {
        type: 'datetime',
        showLastLabel: false,
        dateTimeLabelFormats: {
            month: '%B'
        }
    }
});
