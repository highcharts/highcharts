Highcharts.chart('container', {
    title: {
        text: 'Click on series to sonify'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            sonification: {
                instruments: [{
                    instrument: 'triangleMajor',
                    minFrequency: 523, // C5
                    maxFrequency: 1047, // C6
                    mapping: {
                        pan: 'x'
                    }
                }],
                events: {
                    onPointStart: function (e, point) {
                        point.onMouseOver();
                    }
                }
            },
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
