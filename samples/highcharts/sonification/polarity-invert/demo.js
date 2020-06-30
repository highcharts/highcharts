Highcharts.chart('container', {
    title: {
        text: 'Click on series to sonify'
    },
    legend: {
        enabled: false
    },
    sonification: {
        defaultInstrumentOptions: {
            instrument: 'triangleMajor',
            minFrequency: 523, // C5
            maxFrequency: 1047, // C6
            mapping: {
                pan: 'x'
            }
        },
        events: {
            onPointStart: function (e, point) {
                point.onMouseOver();
            }
        }
    },
    plotOptions: {
        series: {
            marker: {
                radius: 8
            },
            cursor: 'pointer',
            events: {
                click: function () {
                    this.sonify();
                }
            }
        }
    },
    series: [{
        data: [523, 587, 659, 696, 784, 880, 988, 1046]
    }, {
        // Frequencies such that when played with inverse polarity,
        // the intervals correspond to the C5-C6 major scale
        data: [1046, 1569 - 587, 1569 - 659, 1569 - 696, 1569 - 784, 1569 - 880, 1569 - 988, 1569 - 1046],
        sonification: {
            instruments: [{
                mapping: {
                    frequency: '-y'
                }
            }]
        }
    }]
});
