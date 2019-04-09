Highcharts.chart('container', {
    chart: {
        type: 'bubble'
    },
    title: {
        text: 'Click points to sonify'
    },
    subtitle: {
        text: 'Duration represents bubble size'
    },
    xAxis: {
        tickInterval: 1
    },
    legend: {
        enabled: false
    },
    series: [{
        cursor: 'pointer',
        data: [
            [1, 1, 10],
            [2, 2, 12],
            [3, 2, 14],
            [4, 2, 12],
            [2, 3, 16],
            [4, 5, 12],
            [3, 6, 20],
            [1, 6, 10]
        ],
        minSize: 20,
        point: {
            events: {
                click: function () {
                    // Sonify the point when clicked
                    this.sonify({
                        instruments: [{
                            instrument: 'triangleMajor',
                            instrumentMapping: {
                                volume: 0.8,
                                duration: 'z',
                                pan: 'x',
                                frequency: 'y'
                            },
                            // Set duration scale
                            instrumentOptions: {
                                minDuration: 200,
                                maxDuration: 1000
                            }
                        }, {
                            // Play a sound when we click the large bubbles
                            instrument: 'sine',
                            instrumentMapping: {
                                // Mute if point.z is not above 12
                                volume: function (point) {
                                    return point.z > 12 ? 0.7 : 0;
                                },
                                duration: 600,
                                pan: 'x',
                                // Play a rising frequency
                                frequency: function (point, extremes, time) {
                                    return Math.min(time * 1500, 1000);
                                }
                            }
                        }]
                    });
                }
            }
        }
    }]
});
