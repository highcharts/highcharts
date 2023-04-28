const day = 1000 * 60 * 60 * 24;
let prevYear,
    yearCount = -1;

const say = function (msg) {
    const speaker = new Highcharts.sonification
        .SonificationSpeaker({
            language: 'en-US',
            rate: 2.5,
            volume: 0.4
        });
    setTimeout(() => speaker.say(msg), 300);
};

const chart = Highcharts.chart('container', {
    title: {
        text: 'Unemployment rate last 20 years',
        align: 'left'
    },
    subtitle: {
        text: 'Shown in percent of labor force',
        align: 'left'
    },
    chart: {
        type: 'spline',
        marginTop: 70
    },
    colors: ['#3d3f51', '#42858C', '#AD343E'],
    accessibility: {
        screenReaderSection: {
            axisRangeDateFormat: '%B %Y',
            beforeChartFormat: ''
        },
        point: {
            dateFormat: '%b %e, %Y',
            valueDescriptionFormat: '{value}{separator}{xDescription}'
        },
        series: {
            pointDescriptionEnabledThreshold: false
        }
    },
    sonification: {
        duration: 27000,
        afterSeriesWait: 1500,
        defaultInstrumentOptions: {
            mapping: {
                playDelay: 1000
            }
        },
        events: {
            onPlay: function (timeline) {
                // eslint-disable-next-line no-underscore-dangle
                if (!timeline._navigating) {
                    const curPoint = timeline.getCurrentPoint();
                    if (curPoint) {
                        say(curPoint.series.name);
                    }
                }
            },
            onSeriesEnd: function (series) {
                const newSeries = series.chart.series[series.index + 1];
                if (newSeries) {
                    say(newSeries.name);
                }
            }
        },
        globalContextTracks: [{
            instrument: 'chop',
            valueInterval: day,
            mapping: {
                volume: 0.4,
                playDelay: 1000
            },
            activeWhen: function (context) {
                const x = context.value,
                    year = new Date(x).getFullYear(),
                    newYear = year !== prevYear;
                prevYear = year;
                return newYear;
            }
        }, {
            type: 'speech',
            mapping: {
                text: function (context) {
                    const x = context.value,
                        year = new Date(x).getFullYear();
                    return '' + year;
                },
                rate: 2.5,
                volume: 0.3,
                playDelay: 1000
            },
            valueInterval: day * 10,
            activeWhen: function (context) {
                const x = context.value,
                    year = new Date(x).getFullYear(),
                    newYear = year !== prevYear;
                prevYear = year;
                if (newYear) {
                    ++yearCount;
                    return !(yearCount % 5);
                }
                return false;
            }
        }]
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            label: {
                connectorAllowed: true
            },
            marker: {
                enabled: false
            },
            cropThreshold: 10
        }
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    yAxis: {
        title: {
            text: null
        },
        accessibility: {
            description: 'Percent unemployment of labor force'
        },
        labels: {
            format: '{value:,.0f}%'
        }
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    tooltip: {
        valueSuffix: '%',
        stickOnContact: true
    },
    legend: {
        enabled: false
    }
});

chart.accessibility.addLineChartTextDescription();
chart.accessibility.addLineTrendControls();
