// Create some data
var data = [];
for (var i = 0; i < 1000; ++i) {
    data.push(Math.sin(i / 50) * 3 + Math.random() - 0.5);
}

Highcharts.setOptions({
    lang: {
        accessibility: {
            chartContainerLabel: 'Big data sonification. Highcharts interactive chart.'
        }
    }
});

var chart = Highcharts.chart('container', {
    title: {
        text: 'Click series to sonify'
    },
    legend: {
        enabled: false
    },
    accessibility: {
        landmarkVerbosity: 'one'
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
            }],
            events: {
                onPointStart: function () {
                    document.getElementById('stop').style.visibility = 'visible';
                    document.getElementById('stop').focus();
                },
                onSeriesEnd: function () {
                    document.getElementById('stop').style.visibility = 'hidden';
                }
            }
        }
    }]
});

document.getElementById('stop').onclick = function () {
    chart.cancelSonify();
    document.getElementById('stop').style.visibility = 'hidden';
};
