Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Click series to sonify'
    },
    subtitle: {
        text: 'Earcon on red point'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                radius: 7
            },
            events: {
                click: function () {
                    // Sonify the series when clicked
                    this.sonify({
                        duration: 2000,
                        pointPlayTime: 'x',
                        instruments: [{
                            instrument: 'sineMajor',
                            instrumentMapping: {
                                volume: 0.8,
                                duration: 250,
                                pan: 'x',
                                frequency: 'y'
                            }
                        }],
                        earcons: [{
                            // Define the earcon we want to play
                            earcon: new Highcharts.sonification.Earcon({
                                instruments: [{
                                    instrument: 'triangleMajor',
                                    playOptions: {
                                        // Play a rising frequency
                                        frequency: function (time) {
                                            return time * 1760;
                                        },
                                        duration: 200,
                                        volume: 0.5
                                    }
                                }]
                            }),
                            // Play this earcon on a certain point
                            onPoint: 'specialPoint'
                        }]
                    });
                }
            }
        }
    },
    series: [{
        data: [1, 2, 4, 5, {
            y: 7,
            color: '#a11',
            id: 'specialPoint'
        }, 9, 11, 13]
    }]
});
