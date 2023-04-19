// Create some data
var data = [];
for (var i = 0; i < 1000; ++i) {
    data.push(Math.sin(i / 50) * 3 + Math.random() - 0.5);
}

// Show the chart
var chart = Highcharts.chart('container', {
    title: {
        text: 'Large dataset sonified',
        align: 'left',
        margin: 35
    },
    legend: {
        enabled: false
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    lang: {
        accessibility: {
            chartContainerLabel: 'Big data sonification. Highcharts interactive chart.'
        }
    },
    sonification: {
        events: {
            onPlay: function () {
                document.getElementById('btn').textContent = 'Stop';
            },
            onStop: function () {
                document.getElementById('btn').textContent = 'Play';
            }
        },
        defaultInstrumentOptions: {
            instrument: 'square',
            mapping: {
                lowpass: {
                    frequency: 2000
                },
                highpass: {
                    frequency: 200
                }
            }
        }
    },
    tooltip: {
        valueDecimals: 2
    },
    series: [{
        data: data
    }]
});

// Play/Stop button
document.getElementById('btn').onclick = function () {
    var btn = this;
    chart.toggleSonify(true, function () {
        btn.textContent = 'Play';
    });
};
