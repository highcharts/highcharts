const colors = Highcharts.getOptions().colors;

Highcharts.chart('container-area', {
    chart: {
        type: 'area'
    },

    title: {
        text: ''
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },

    lang: {
        accessibility: {
            chartContainerLabel: 'Area chart with patterns.'
        }
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<p>Area chart showing use of visual pattern fills.</p>'
        },
        landmarkVerbosity: 'one'
    },

    plotOptions: {
        area: {
            fillColor: {
                pattern: {
                    path: {
                        d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
                        strokeWidth: 3
                    },
                    width: 10,
                    height: 10,
                    opacity: 0.4
                }
            }
        }
    },

    legend: {
        enabled: false
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
        color: '#88e',
        fillColor: {
            pattern: {
                color: '#11d'
            }
        }
    }, {
        data: [null, null, null, null, null,
            43.1, 95.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        color: '#e88',
        fillColor: {
            pattern: {
                color: '#d11'
            }
        }
    }]
});

Highcharts.chart('container-col', {
    title: {
        text: ''
    },

    legend: {
        enabled: false
    },

    credits: {
        enabled: false
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    exporting: {
        enabled: false
    },

    lang: {
        accessibility: {
            chartContainerLabel: 'Column chart showing use of visual pattern fills.'
        }
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<p>Column chart showing use of patterns.</p>'
        },
        landmarkVerbosity: 'one'
    },

    series: [{
        type: 'column',
        borderColor: Highcharts.getOptions().colors[0],
        data: [{
            y: 1,
            color: {
                patternIndex: 0
            }
        }, {
            y: 1,
            color: {
                patternIndex: 1
            }
        }, {
            y: 1,
            color: {
                patternIndex: 2
            }
        }, {
            y: 1,
            color: {
                patternIndex: 3
            }
        }, {
            y: 1,
            color: {
                patternIndex: 4
            }
        }, {
            y: 1,
            color: {
                patternIndex: 5
            }
        }, {
            y: 1,
            color: {
                patternIndex: 6
            }
        }, {
            y: 1,
            color: {
                patternIndex: 7
            }
        }, {
            y: 1,
            color: {
                patternIndex: 8
            }
        }, {
            y: 1,
            color: {
                patternIndex: 9
            }
        }]
    }]
});

function getColorPattern(i) {
    const colors = Highcharts.getOptions().colors,
        patternColors = [colors[2], colors[0], colors[3], colors[1], colors[4]],
        patterns = [
            'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
            'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
            'M 1.5 0 L 1.5 5 M 4 0 L 4 5',
            'M 0 1.5 L 5 1.5 M 0 4 L 5 4',
            'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5'
        ];

    return {
        pattern: {
            path: patterns[i],
            color: patternColors[i],
            width: 5,
            height: 5
        }
    };
}


Highcharts.chart('container-pie', {
    chart: {
        type: 'pie'
    },

    title: {
        text: ''
    },

    exporting: {
        enabled: false
    },

    lang: {
        accessibility: {
            chartContainerLabel: 'Pie chart with patterns.'
        }
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<p>Pie chart showing use of visual pattern fills.</p>'
        },
        landmarkVerbosity: 'one'
    },

    tooltip: {
        valueSuffix: '%',
        borderColor: '#8ae'
    },

    credits: {
        enabled: false
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: false
            }
        }
    },

    series: [{
        data: [{
            y: 40.6,
            color: getColorPattern(0)
        }, {
            y: 40.1,
            color: getColorPattern(1)
        }, {
            y: 12.9,
            color: getColorPattern(2)
        }, {
            y: 2,
            color: getColorPattern(3)
        }, {
            y: 4.4,
            color: getColorPattern(4)
        }]
    }]
});

Highcharts.chart('container-line', {
    chart: {
        type: 'spline',
        style: {
            fontFamily: 'Roboto,Arial'
        }
    },

    exporting: {
        enabled: false
    },

    lang: {
        accessibility: {
            chartContainerLabel: 'Line chart with patterns.'
        }
    },

    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<p>Line chart showing use of dash styles</p>'
        },
        landmarkVerbosity: 'one'
    },

    legend: {
        enabled: false
    },

    credits: {
        enabled: false
    },

    title: {
        text: ''
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },
    series: [{
        data: [34.8, 43.0, 51.2, 41.4, 64.9, 72.4],
        color: colors[2]
    }, {
        data: [69.6, 63.7, 63.9, 43.7, 66.0, 61.7],
        dashStyle: 'ShortDashDot',
        color: colors[0]
    }, {
        data: [20.2, 30.7, 36.8, 30.9, 39.6, 47.1],
        dashStyle: 'ShortDot',
        color: colors[1]
    }, {
        data: [null, null, null, null, 21.4, 30.3],
        dashStyle: 'Dash',
        color: colors[9]
    }, {
        data: [6.1, 6.8, 5.3, 27.5, 6.0, 5.5],
        dashStyle: 'ShortDot',
        color: colors[5]
    }, {
        data: [42.6, 51.5, 54.2, 45.8, 20.2, 15.4],
        dashStyle: 'ShortDash',
        color: colors[3]
    }]
});
