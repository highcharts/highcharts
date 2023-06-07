var chart = Highcharts.chart('container', {
    title: {
        text: 'Series sonified simultaneously',
        align: 'left',
        margin: 25
    },

    subtitle: {
        text: 'Earcon when finished',
        align: 'left'
    },

    tooltip: {
        shared: true,
        valueDecimals: 3
    },

    sonification: {
        order: 'simultaneous',
        duration: 4000,
        events: {
            onEnd: function (e) {
                var s = e.chart.sonification;
                s.playNote('vibraphone', { note: 'G4' });
                s.playNote('vibraphone', { note: 'C4', pan: -1 });
                s.playNote('vibraphone', { note: 'E4', pan: 0 }, 200);
                s.playNote('vibraphone', { note: 'C5', pan: 1 }, 400);
            }
        }
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },

    xAxis: {
        crosshair: {
            enabled: true,
            width: 3,
            color: '#9088b0'
        }
    },

    series: [{
        sonification: {
            tracks: [{
                instrument: 'flute',
                mapping: {
                    pan: -1 // Pan this series left
                }
            }]
        },
        // Generate some data for series 1
        data: (function () {
            var data = [];
            for (var i = 0; i < 100; ++i) {
                data.push(Math.sin(i / 30) * 5);
            }
            return data;
        }())
    }, {
        sonification: {
            tracks: [{
                instrument: 'piano',
                mapping: {
                    pan: 1 // Pan this series right
                }
            }]
        },
        // Generate some data for series 2
        data: (function () {
            var data = [];
            for (var i = 0; i < 100; ++i) {
                data.push(Math.sin((i + 30) / 20) * 6);
            }
            return data;
        }())
    }]
});

// Click button to sonify or stop
document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
