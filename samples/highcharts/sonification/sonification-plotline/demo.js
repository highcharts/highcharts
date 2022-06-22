var chart = Highcharts.chart('container', {
    sonification: {
        masterVolume: 0.5,
        showPlayMarker: true,
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    min: 'c3',
                    max: 'c6'
                }
            }
        },
        globalContextTracks: [{
            instrument: 'piano',
            valueInterval: 0.5, // Play for every 0.5 X-value
            mapping: {
                pitch: {
                    mapTo: 'y',
                    value: 10
                },
                volume: 0.1
            }
        }, {
            instrument: 'shaker',
            timeInterval: 100, // Play every 100 milliseconds
            activeWhen: {
                min: 3,
                max: 7
            },
            mapping: {
                volume: 0.1
            }
        }]
    },
    yAxis: {
        plotLines: [{
            value: 10,
            color: '#d22',
            dashStyle: 'shortDash',
            width: 2
        }]
    },
    xAxis: {
        plotBands: [{
            from: 3,
            to: 7,
            color: 'rgba(50, 135, 50, 0.2)'
        }],
        crosshair: true
    },
    series: [{
        data: [1, 4, 5, 2, 8, 12, 6, 4, 2, 2, 1, 5]
    }]
});

document.getElementById('chart').onclick = function () {
    if (chart.sonification.isPlaying()) {
        chart.sonification.cancel();
    } else {
        chart.sonify();
    }
};
