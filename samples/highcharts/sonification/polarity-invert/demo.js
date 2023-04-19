var chart = Highcharts.chart('container', {
    title: {
        text: 'Inverted pitch polarity',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    mapTo: '-y',
                    min: 'c2',
                    max: 'c7'
                }
            }
        }
    },
    series: [{
        data: [4, 5, 6, 5, 7, 9, 11, 13]
    }, {
        data: [1, 3, 4, 2]
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
