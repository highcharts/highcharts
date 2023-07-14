const chart = Highcharts.chart('container', {
    title: {
        text: 'Exam scores per class',
        align: 'left',
        margin: 30
    },
    subtitle: {
        text: 'Click each box to sonify on its own',
        align: 'left'
    },
    sonification: {
        showTooltip: false,
        duration: 22000
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    legend: {
        enabled: false
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    xAxis: {
        crosshair: {
            enabled: true
        }
    },
    yAxis: {
        max: 100,
        tickInterval: 25,
        title: {
            enabled: false
        },
        labels: {
            format: '{text}%'
        }
    },
    tooltip: {
        followPointer: true
    },
    colors: ['#8E4161', '#4F685F', '#A4604D', '#4C5270', '#6A040F',
        '#51574A', '#6F7D8C', '#824D5C', '#466365', '#7B6F72'],
    series: [{
        name: 'Exam scores',
        type: 'boxplot',
        medianWidth: 3,
        colorByPoint: true,
        stickyTracking: true,
        cursor: 'pointer',
        events: {
            click: function (e) {
                e.point.sonify();
            }
        },
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 'd2',
                        max: 'c7'
                    }
                }
            },
            // 6 tracks: Name + one track for each data point in the box plot
            tracks: [{
                type: 'speech',
                mapping: {
                    text: '{point.name}',
                    rate: 2,
                    volume: 0.3
                }
            }, {
                mapping: {
                    pitch: {
                        mapTo: 'low'
                    },
                    playDelay: 1300
                }
            }, {
                mapping: {
                    pitch: {
                        mapTo: 'q1'
                    },
                    playDelay: 1420
                }
            }, {
                mapping: {
                    pitch: {
                        mapTo: 'median'
                    },
                    playDelay: 1540
                }
            }, {
                mapping: {
                    pitch: {
                        mapTo: 'q3'
                    },
                    playDelay: 1660
                }
            }, {
                mapping: {
                    pitch: {
                        mapTo: 'high'
                    },
                    playDelay: 1780
                }
            }]
        }
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
