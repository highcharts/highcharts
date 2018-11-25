
Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },
    title: {
        text: 'Click points to sonify'
    },
    series: [{
        marker: {
            radius: 8
        },
        cursor: 'pointer',
        data: [
            10, 14, 20, { y: 18, color: 'red' }, 21, 11, 7,
            { y: 15, color: 'red' }, 27, 2
        ],
        point: {
            events: {
                click: function () {
                    // Sonify the point when clicked
                    this.sonify({
                        instruments: [{
                            instrument: 'triangle',
                            instrumentMapping: {
                                volume: function (point) {
                                    return point.color === 'red' ? 0.2 : 0.8;
                                },
                                duration: 200,
                                pan: 'x',
                                frequency: 'y'
                            }
                        }]
                    });
                }
            }
        }
    }]
});
