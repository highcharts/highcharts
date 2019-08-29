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
    series: [{
        data: [1, 2, 4, 5, 7, 9, 11, 13]
    }, {
        data: [4, 5, 9, 5, 2, 1, 4, 6]
    }, {
        data: [2, 2, 2, 7, 9, 11, 13, 12]
    }]
});


document.getElementById('sonify').onclick = function () {
    chart.sonify({
        duration: 7000,
        afterSeriesWait: 1000,
        order: 'sequential',
        pointPlayTime: 'x',
        instruments: [{
            instrument: 'sineMusical',
            instrumentMapping: {
                duration: 200,
                frequency: 'y',
                volume: 0.7
            }
        }],
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
        }]
    });
};
