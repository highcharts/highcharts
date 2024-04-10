const chart = Highcharts.chart('container', {
    title: {
        text: 'Speak values',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    sonification: {
        duration: 10000
    },
    series: [{
        sonification: {
            tracks: [{
                instrument: 'vibraphone',
                mapping: {
                    pitch: {
                        min: 'c3',
                        max: 'g6'
                    },
                    volume: 0.9
                }
            }, {
                type: 'speech',
                mapping: {
                    text: '{point.y}',
                    rate: 2,
                    volume: 0.3,
                    pitch: 'y',
                    playDelay: 250
                }
            }]
        },
        data: [4, 5, 6, 5, 7, 8, 7, 9, 11, 13, 14, 11, 8]
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
