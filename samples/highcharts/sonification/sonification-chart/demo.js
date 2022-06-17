var el = function (id) {
    return document.getElementById(id);
};

var chart = Highcharts.chart('container', {
    sonification: {
        afterSeriesWait: 1500,
        masterVolume: 0.5,
        defaultInstrumentOptions: {
            mapping: {
                mapping: {
                    pitch: {
                        min: 'c3',
                        max: 'c6'
                    }
                }
            }
        },
        globalTracks: [{
            // Speak name after each series
            type: 'speech',
            mapping: {
                text: '{point.series.name}',
                rate: 1.7,
                volume: 0.3,
                playDelay: 700
            },
            activeWhen: function (context) {
                return context.point.index ===
                    context.point.series.points.length - 1;
            }
        }]
    },
    series: [{
        sonification: {
            tracks: [{ /* Default track */ }, {
                // Notification track
                instrument: 'vibraphone',
                mapping: {
                    pitch: ['c6', 'g6'],
                    playDelay: 250,
                    volume: 0.2,
                    pan: 0
                },
                activeWhen: function (context) {
                    return context.point.x === 7;
                }
            }]
        },
        data: [1, 4, 5, 2, 8, 12, 6, 4]
    }, {
        data: [2, 3, 5, 4, 2, 2]
    }]
});

el('chart').onclick = function () {
    chart.sonify();
};

el('series').onclick = function () {
    chart.series[0].sonify();
};

el('point').onclick = function () {
    chart.series[0].points[5].sonify();
};
