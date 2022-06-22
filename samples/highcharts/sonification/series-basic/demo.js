Highcharts.chart('container', {
    title: {
        text: 'Click on series to sonify'
    },
    legend: {
        enabled: false
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    sonification: {
        showCrosshairOnly: true
    },
    xAxis: {
        crosshair: true
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
        data: [1, 2, 4, 5, 7, 9, 11, 13]
    }, {
        data: [4, 5, 7, 9, 11, 13, 11, 9]
    }]
});
