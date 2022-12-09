var chart = Highcharts.chart('container', {
    title: {
        text: 'Series sonified simultaneously'
    },
    tooltip: {
        shared: true
    },
    sonification: {
        order: 'simultaneous',
        duration: 4000
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
            enabled: true
        }
    },
    series: [{
        sonification: {
            tracks: [{
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
                instrument: 'trumpet', // Use a different instrument for this series
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
    if (chart.sonification.isPlaying()) {
        chart.sonification.cancel();
    } else {
        chart.sonify();
    }
};
