var chart = Highcharts.chart('container', {
    title: {
        text: 'Click on series to sonify'
    },
    legend: {
        enabled: false
    },
    accessibility: {
        landmarkVerbosity: 'one'
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
                        document.getElementById('stop').style.visibility = 'visible';
                        document.getElementById('stop').focus();
                    },
                    onSeriesEnd: function () {
                        document.getElementById('stop').style.visibility = 'hidden';
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

document.getElementById('stop').onclick = function () {
    chart.cancelSonify();
    document.getElementById('stop').style.visibility = 'hidden';
};
