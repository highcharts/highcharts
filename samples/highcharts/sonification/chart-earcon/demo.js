var chart = Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Sonify series in order'
    },
    subtitle: {
        text: 'Earcon on highest point in series'
    },
    sonification: {
        duration: 7000,
        masterVolume: 0.3,
        defaultInstrumentOptions: {
            minFrequency: 220,
            maxFrequency: 2200,
            mapping: {
                duration: 200
            }
        },
        earcons: [{
            // Define the earcon we want to play
            earcon: new Highcharts.sonification.Earcon({
                instruments: [{
                    instrument: 'triangleMajor',
                    playOptions: {
                        // Play a quick rising frequency
                        frequency: function (time) {
                            return time * 1760 + 440;
                        },
                        volume: 0.3,
                        duration: 200
                    }
                }]
            }),
            // Play this earcon if this point is the highest in the series.
            condition: function (point) {
                var series = point.series;
                return point.y === Math.max.apply(Math, series.points.map(
                    function (p) {
                        return p.y;
                    }
                ));
            }
        }],
        events: {
            onPointStart: function (e, point) {
                point.onMouseOver();
            },
            onEnd: function () {
                document.getElementById('sonify').style.visibility = 'visible';
                document.getElementById('overlay').style.visibility = 'visible';
                document.getElementById('stop').style.visibility = 'hidden';
            }
        }
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    series: [{
        data: [1, 2, 4, 5, 7, 9, 11, 13]
    }, {
        data: [4, 5, 9, 5, 2, 1, 4, 6]
    }, {
        data: [2, 2, 2, 7, 9, 11, 13, 12]
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 450
            },
            chartOptions: {
                chart: {
                    spacingLeft: 3,
                    spacingRight: 5
                },
                yAxis: {
                    visible: false
                }
            }
        }]
    }
});


document.getElementById('sonify').onclick = function () {
    document.getElementById('sonify').style.visibility = 'hidden';
    document.getElementById('overlay').style.visibility = 'hidden';
    document.getElementById('stop').style.visibility = 'visible';
    chart.sonify();
    document.getElementById('stop').focus();
};

document.getElementById('stop').onclick = function () {
    chart.cancelSonify();
    document.getElementById('sonify').style.visibility = 'visible';
    document.getElementById('overlay').style.visibility = 'visible';
    document.getElementById('stop').style.visibility = 'hidden';
};
