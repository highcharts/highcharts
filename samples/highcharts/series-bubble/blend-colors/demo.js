const chart = Highcharts.chart('container', {

    xAxis: {
        minPadding: 0.5,
        maxPadding: 0.5
    },

    series: [{
        type: 'bubble',
        marker: {
            lineWidth: 0,
            states: {
                hover: {
                    enabled: false
                }
            }
        },
        opacity: 0.75,
        minSize: '55%',
        data: [
            [0, 0, 3],
            [1, 1, 3],
            [1.1, 1, 3],
            [1.3, 2, 3],
            [1.4, 1, 3]
        ],
        blendColors: [
            '#ff0000',
            '#ffff00',
            '#00ff00',
            '#00ffff',
            '#0000ff'
        ]
    }]
});

document.getElementById('btn-1').addEventListener('click', () => {
    chart.series[0].update({
        // Temperature shades
        blendColors: [
            '#ff0000',
            '#ffff00',
            '#00ff00',
            '#00ffff',
            '#0000ff'
        ]
    });
});

document.getElementById('btn-2').addEventListener('click', () => {
    chart.series[0].update({
        // Temperature shades
        blendColors: [
            [0.3, '#ff0000'],
            [0.6, '#ffff00'],
            [0.8, '#00ff00'],
            [0.9, '#00ffff'],
            [1, '#0000ff']
        ]
    });
});

document.getElementById('btn-3').addEventListener('click', () => {
    chart.series[0].update({
        blendColors: ['#ffff00', '#ff0001'] // fire shades
    });
});

document.getElementById('btn-4').addEventListener('click', () => {
    chart.series[0].update({
        blendColors: [[0.8, '#ffff00'], [1, '#ff0001']] // fire shades
    });
});