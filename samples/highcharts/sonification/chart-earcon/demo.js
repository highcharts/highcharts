const chart = Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Sonify series in order'
    },
    subtitle: {
        text: 'An earcon notification plays on the highest point in each series'
    },
    sonification: {
        duration: 11000,
        afterSeriesWait: 1100,
        events: {
            onEnd: function () {
                document.getElementById('sonify').style.visibility = 'visible';
                document.getElementById('overlay').style.visibility = 'visible';
                document.getElementById('stop').style.visibility = 'hidden';
            }
        },
        // A global track that always applies - we use this one for the Earcon
        // notifications by activating it when we want it.
        globalTracks: [{
            type: 'instrument',
            instrument: 'vibraphone',
            showPlayMarker: false,
            mapping: {
                pitch: ['g6', 'g6'],
                playDelay: 60,
                gapBetweenNotes: 100
            },
            activeWhen: function (context) {
                const point = context.point,
                    series = point.series;
                // Return true when this point is the max point in its series
                return point.y === Math.max.apply(Math, series.points.map(
                    function (p) {
                        return p.y;
                    }
                ));
            }
        }]
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
    chart.sonification.cancel();
    document.getElementById('sonify').style.visibility = 'visible';
    document.getElementById('overlay').style.visibility = 'visible';
    document.getElementById('stop').style.visibility = 'hidden';
};
