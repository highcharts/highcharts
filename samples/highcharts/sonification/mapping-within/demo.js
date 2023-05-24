var chart = Highcharts.chart('container', {
    title: {
        text: 'Change mapping.pitch.within'
    },

    subtitle: {
        text: 'Are we mapping within the chart, the yAxis, or each series?'
    },

    sonification: {
        duration: 7000
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },

    yAxis: [{
        height: '40%',
        top: '0%',
        offset: 0,
        tickAmount: 2,
        lineWidth: 2,
        title: {
            text: 'Axis 1'
        }
    }, {
        height: '40%',
        top: '60%',
        offset: 0,
        tickAmount: 2,
        lineWidth: 2,
        title: {
            text: 'Axis 2'
        }
    }],

    xAxis: {
        crosshair: {
            enabled: true
        }
    },

    series: [{
        data: [50, 55, 60, 65, 80, 85, 90]
    }, {
        data: [8, 9, 10, 13, 15, 16, 17],
        yAxis: 1
    }, {
        data: [2, 3, 4, 4, 4, 5, 5],
        yAxis: 1
    }]
});


function within(within) {
    return function () {
        if (chart.sonification.isPlaying()) {
            chart.sonification.cancel();
        } else {
            chart.update({
                sonification: {
                    defaultInstrumentOptions: {
                        mapping: {
                            pitch: {
                                within: within
                            }
                        }
                    }
                }
            }, false);
            chart.sonify();
        }
    };
}
document.getElementById('withinChart').onclick = within('chart');
document.getElementById('withinYAxis').onclick = within('yAxis');
document.getElementById('withinSeries').onclick = within('series');