const chart = Highcharts.chart('container', {
    title: {
        text: 'Helsinki Average Monthly Temperature',
        align: 'left',
        margin: 25
    },

    sonification: {
        duration: 8000,
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    min: 'c3',
                    max: 'd6'
                }
            }
        },
        globalContextTracks: [{
            // A repeated piano note for the 0 plot line
            instrument: 'piano',
            valueInterval: 1 / 3, // Play 3 times for every X-value
            mapping: {
                pitch: {
                    mapTo: 'y',
                    value: 0 // Map to a fixed Y value
                },
                volume: 0.1
            }
        }, {
            // Percussion sound indicates the plot band
            instrument: 'shaker',
            activeWhen: {
                valueProp: 'x', // Active when X is between these values.
                min: 4,
                max: 9
            },
            timeInterval: 100, // Play every 100 milliseconds
            mapping: {
                volume: 0.1
            }
        }, {
            // Speak the plot band label
            type: 'speech',
            valueInterval: 1,
            activeWhen: {
                crossingUp: 4 // Active when crossing over x = 4
            },
            mapping: {
                text: 'Summer',
                rate: 2.5,
                volume: 0.3
            }
        }]
    },

    yAxis: {
        plotLines: [{
            value: 0,
            color: '#59D',
            dashStyle: 'shortDash',
            width: 2
        }],
        title: {
            enabled: false
        },
        labels: {
            format: '{text}°C'
        },
        gridLineWidth: 0
    },

    xAxis: {
        plotBands: [{
            from: 3.5,
            to: 8.5,
            color: '#EEFFF4',
            label: {
                text: 'Summer',
                align: 'left',
                x: 10
            }
        }],
        plotLines: [{
            value: 3.5,
            color: '#4EA291',
            width: 3
        }, {
            value: 8.5,
            color: '#4EA291',
            width: 3
        }],
        crosshair: true,
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
            'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    },

    legend: {
        enabled: false
    },

    tooltip: {
        valueSuffix: '°C'
    },

    series: [{
        name: 'Helsinki',
        data: [-5, -6, -2, 4, 10, 14, 17, 15, 10, 6, 0, -4],
        color: '#2F2D2E'
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
