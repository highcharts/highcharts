var colors = Highcharts.getOptions().colors;

Highcharts.chart('container', {
    chart: {
        type: 'area'
    },

    title: {
        text: ''
    },

    xAxis: {
        visible: false,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        visible: false
    },

    exporting: {
        enabled: false
    },

    plotOptions: {
        area: {
            label: {
                enabled: false
            },
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

Highcharts.chart('container2', {
    title: {
        text: ''
    },

    legend: {
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

    series: [{
        showInLegend: true,
        label: {
            enabled: false
        },
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
        }],
        dataLabels: {
            connectorColor: Highcharts.getOptions().colors[0],
            formatter: function () {
                var i = this.point.index;
                return i > 9 ?
                    'Custom pattern' : // For the last one, show custom label
                    'default-pattern-' + i; // Show default pattern label
            }
        }
    }]
});

function getColorPattern(i) {
    var colors = Highcharts.getOptions().colors,
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

Highcharts.chart('container3', {
    chart: {
        type: 'pie',
        style: {
            fontFamily: 'Roboto,Arial'
        }
    },

    title: {
        text: ''
    },

    exporting: {
        enabled: false
    },

    tooltip: {
        valueSuffix: '%',
        borderColor: '#8ae'
    },

    plotOptions: {
        series: {
            label: {
                enabled: false
            },
            dataLabels: {
                enabled: false,
                connectorColor: '#777',
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            },
            point: {
                events: {
                    click: function () {
                        window.location.href = this.website;
                    }
                }
            },
            cursor: 'pointer',
            borderWidth: 3
        }
    },

    series: [{
        name: 'Screen reader usage',
        data: [{
            name: 'NVDA',
            y: 40.6,
            color: getColorPattern(0),
            website: 'https://www.nvaccess.org',
            accessibility: {
                description: 'This is the most used desktop screen reader'
            }
        }, {
            name: 'JAWS',
            y: 40.1,
            color: getColorPattern(1),
            website: 'https://www.freedomscientific.com/Products/Blindness/JAWS'
        }, {
            name: 'VoiceOver',
            y: 12.9,
            color: getColorPattern(2),
            website: 'http://www.apple.com/accessibility/osx/voiceover'
        }, {
            name: 'ZoomText',
            y: 2,
            color: getColorPattern(3),
            website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader'
        }, {
            name: 'Other',
            y: 4.4,
            color: getColorPattern(4),
            website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php'
        }]
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            format: '<b>{point.name}</b>'
                        }
                    }
                }
            }
        }]
    }
});

Highcharts.chart('container4', {
    chart: {
        type: 'spline',
        style: {
            fontFamily: 'Roboto,Arial'
        }
    },

    exporting: {
        enabled: false
    },

    legend: {
        enabled: false,
        symbolWidth: 40
    },

    title: {
        text: ''
    },

    yAxis: {
        visible: false,
        title: {
            text: 'Percentage usage'
        }
    },

    xAxis: {
        visible: false,
        title: {
            text: 'Time'
        },
        accessibility: {
            description: 'Time from December 2010 to September 2019'
        },
        categories: ['December 2010', 'May 2012', 'January 2014', 'July 2015', 'October 2017', 'September 2019']
    },

    tooltip: {
        valueSuffix: '%',
        enabled: false
    },

    plotOptions: {
        series: {
            label: {
                enabled: false
            },
            point: {
                events: {
                    click: function () {
                        window.location.href = this.series.options.website;
                    }
                }
            },
            cursor: 'pointer'
        }
    },

    series: [{
        name: 'NVDA',
        data: [34.8, 43.0, 51.2, 41.4, 64.9, 72.4],
        website: 'https://www.nvaccess.org',
        color: colors[2],
        accessibility: {
            description: 'This is the most used screen reader in 2019'
        }
    }, {
        name: 'JAWS',
        data: [69.6, 63.7, 63.9, 43.7, 66.0, 61.7],
        website: 'https://www.freedomscientific.com/Products/Blindness/JAWS',
        dashStyle: 'ShortDashDot',
        color: colors[0]
    }, {
        name: 'VoiceOver',
        data: [20.2, 30.7, 36.8, 30.9, 39.6, 47.1],
        website: 'http://www.apple.com/accessibility/osx/voiceover',
        dashStyle: 'ShortDot',
        color: colors[1]
    }, {
        name: 'Narrator',
        data: [null, null, null, null, 21.4, 30.3],
        website: 'https://support.microsoft.com/en-us/help/22798/windows-10-complete-guide-to-narrator',
        dashStyle: 'Dash',
        color: colors[9]
    }, {
        name: 'ZoomText/Fusion',
        data: [6.1, 6.8, 5.3, 27.5, 6.0, 5.5],
        website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader',
        dashStyle: 'ShortDot',
        color: colors[5]
    }, {
        name: 'Other',
        data: [42.6, 51.5, 54.2, 45.8, 20.2, 15.4],
        website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php',
        dashStyle: 'ShortDash',
        color: colors[3]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 550
            },
            chartOptions: {
                legend: {
                    itemWidth: 150
                },
                xAxis: {
                    categories: ['Dec. 2010', 'May 2012', 'Jan. 2014', 'July 2015', 'Oct. 2017', 'Sep. 2019']
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    labels: {
                        format: '{value}%'
                    }
                }
            }
        }]
    }
});
