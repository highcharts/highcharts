Highcharts.chart('container', {
    title: {
        text: 'Click series to sonify'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                radius: 8
            },
            cursor: 'pointer',
            events: {
                click: function () {
                    // Sonify the series when clicked
                    this.sonify({
                        duration: 2200,
                        pointPlayTime: 'x',
                        instruments: [{
                            instrument: 'triangleMajor',
                            instrumentMapping: {
                                volume: 0.8,
                                duration: 250,
                                pan: 'x',
                                frequency: 'y'
                            },
                            // Start at C5 note, end at C6
                            instrumentOptions: {
                                minFrequency: 520,
                                maxFrequency: 1050
                            }
                        }]
                    });
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
