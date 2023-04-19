Highcharts.chart('container', {
    chart: {
        type: 'bubble'
    },
    title: {
        text: 'Click points to sonify'
    },
    subtitle: {
        text: 'Duration represents bubble size, pitch is Y, stereo pan is X'
    },
    xAxis: {
        tickInterval: 1
    },
    legend: {
        enabled: false
    },
    sonification: {
        defaultInstrumentOptions: {
            instrument: 'flute',
            mapping: {
                // Panning is mapped to X by default
                // Pitch is mapped to Y by default, but set suitable range
                pitch: {
                    min: 'c3',
                    max: 'g6'
                },
                // Map duration to Z value (bubble size)
                noteDuration: {
                    mapTo: 'z',
                    min: 60,
                    max: 900
                },
                // Map time to point index. This makes the points play in the
                // order they are defined, one after the other, with equal
                // spacing. In this demo it does not matter much, since we only
                // play one point at a time anyway.
                time: 'index'
            },
            pointGrouping: {
                enabled: false
            }
        }
    },
    series: [{
        cursor: 'pointer',
        data: [
            [1, 1, 10],
            [2, 2, 12],
            [3.3, 2.5, 14],
            [4, 2.7, 12],
            [2.1, 3, 16],
            [4, 5, 12],
            [3, 6, 20],
            [1, 6, 10]
        ],
        minSize: 20,
        point: {
            events: {
                click: function () {
                    // Sonify the point when clicked
                    this.sonify();
                }
            }
        }
    }]
});
