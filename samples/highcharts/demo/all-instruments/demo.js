const chart = Highcharts.chart('container', {
    title: {
        text: 'Audio Chart',
        align: 'left',
        margin: 15
    },
    legend: {
        enabled: false
    },
    sonification: {
        duration: 9500,
        afterSeriesWait: 1100,
        events: {
            // Announce first series before playing
            beforePlay: function (e) {
                e.chart.sonification.speak('Revenue');
            },
            // Announce second series after first one ends
            onSeriesEnd: function (e) {
                if (e.series.index === 0) {
                    e.series.chart.sonification.speak('Profit margin', {}, 150);
                }
            }
        },
        defaultInstrumentOptions: {
            mapping: {
                playDelay: 750, // Give room for beforePlay announcement
                noteDuration: 400
            }
        }
    },
    chart: {
        events: {
            render: function () {
                // Force tooltip below point for last portion of 1st series
                this.series[0].points.forEach(function (point) {
                    if (point.x >= new Date('2022').getTime()) {
                        point.ttBelow = true;
                    }
                });
            }
        }
    },
    accessibility: {
        landmarkVerbosity: 'one',
        point: {
            describeNull: false
        }
    },
    yAxis: [{
        top: '0%',
        height: '72%',
        title: {
            text: 'Revenue (millions)'
        },
        lineWidth: 1
    }, {
        top: '85%',
        height: '15%',
        offset: 0,
        title: {
            text: 'Profit margin'
        },
        labels: {
            format: '{text}%'
        },
        plotBands: [{
            from: 0,
            to: 30,
            color: '#f6f7f8'
        }]
    }],
    xAxis: {
        minPadding: 0.04,
        maxPadding: 0.04,
        accessibility: {
            rangeDescription: '2017 to 2024'
        }
    },
    plotOptions: {
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            }
        }
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    series: [{
        type: 'spline',
        sonification: {
            tracks: [{
                roundToMusicalNotes: false
            }]
        }
    }, {
        type: 'column',
        yAxis: 1,
        pointWidth: 30
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};

// Populate preset dropdown
Object.keys(
    Highcharts.sonification.InstrumentPresets
).forEach(function (preset) {
    const option = document.createElement('option');
    option.textContent = option.value = preset;
    document.getElementById('preset').appendChild(option);
});

document.getElementById('preset').onchange = function () {
    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                instrument: this.value
            }
        }
    }, false);
};
