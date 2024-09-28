const chart = Highcharts.chart('container', {
    title: {
        text: 'Timeline',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    tooltip: {
        shared: true
    },
    sonification: {
        duration: 3000,
        order: 'simultaneous'
    },
    series: [{
        data: [4, 5, 6, 5, 7, 9, 11, 13]
    }, {
        data: [1, 3, 4, 2]
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify(false, () => {
        // Play a note on end without setting an event handler in options
        chart.sonification.playNote('vibraphone', {
            note: 'g5', noteDuration: 400, volume: 0.7
        });
    });
};
