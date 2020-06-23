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
                this.sonify();
            }
        },
        sonification: {
            duration: 3000,
            instruments: [{
                instrument: 'triangleMajor',
                minFrequency: 200,
                maxFrequency: 2000,
                mapping: {
                    volume: 0.6,
                    duration: 50,
                    pan: 'x'
                }
            }]
        }
    }]
});
