// Create some data
var data = [];
for (var i = 0; i < 1000; ++i) {
    data.push(Math.sin(i / 50) * 3 + Math.random() - 0.5);
}

Highcharts.chart('container', {
    title: {
        text: 'Click series to sonify'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: data,
        cursor: 'pointer',
        events: {
            click: function () {
                // Sonify the series when clicked
                this.sonify({
                    duration: 3000,
                    pointPlayTime: 'x',
                    instruments: [{
                        instrument: 'triangleMajor',
                        instrumentMapping: {
                            volume: 0.6,
                            duration: 50,
                            pan: 'x',
                            frequency: 'y'
                        },
                        instrumentOptions: {
                            minFrequency: 200,
                            maxFrequency: 2000
                        }
                    }]
                });
            }
        }
    }]
});
