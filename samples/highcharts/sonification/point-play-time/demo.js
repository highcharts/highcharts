Highcharts.chart('container', {
    title: {
        text: 'Click series to sonify'
    },
    subtitle: {
        text: 'Points are played from bottom of y-axis and up'
    },
    chart: {
        type: 'scatter'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [
            [16, -5],
            [7, -4],
            [19, -3],
            [3, -2],
            [21, -1],
            [-2, 0],
            [7, 1],
            [-3, 2],
            [16, 3],
            [17, 4],
            [11, 5],
            [-1, 6]
        ],
        color: 'rgba(30, 30, 200, 0.7)',
        marker: {
            radius: 5
        },
        cursor: 'pointer',
        events: {
            click: function () {
                // Sonify the series when clicked
                this.sonify({
                    duration: 2600,
                    pointPlayTime: 'y',
                    instruments: [{
                        instrument: 'sineMajor',
                        instrumentMapping: {
                            // Fade in and out points
                            volume: function (point, extremes, time) {
                                return Math.sin(time * Math.PI);
                            },
                            duration: 150,
                            pan: 'x',
                            frequency: 'y'
                        }
                    }]
                });
            }
        }
    }]
});
