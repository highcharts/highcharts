Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },
    title: {
        text: 'Click points to sonify'
    },
    legend: {
        enabled: false
    },
    series: [{
        marker: {
            radius: 8
        },
        cursor: 'pointer',
        data: [
            1, 2, { y: 4, color: 'red' }, 5, 7, 9, 11, 13,
            { y: 6, color: 'red' }, 7, 1
        ],
        point: {
            events: {
                click: function () {
                    // Sonify the point when clicked
                    this.sonify({
                        instruments: [{
                            instrument: 'triangleMajor',
                            instrumentMapping: {
                                volume: function (point) {
                                    return point.color === 'red' ? 0.8 : 0.2;
                                },
                                duration: 200,
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
    }]
});
