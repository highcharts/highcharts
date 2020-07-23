// Set up a simple chart
var chart = Highcharts.chart('container', {
    title: {
        text: 'Scatter series sonified together'
    },
    legend: {
        enabled: false
    },
    sonification: {
        duration: 5000,
        order: ['columnSeries', ['scatterSeriesA', 'scatterSeriesB']],
        defaultInstrumentOptions: {
            instrument: 'triangleMajor',
            minFrequency: 220,
            maxFrequency: 2200,
            mapping: {
                volume: 0.8,
                duration: 250,
                pan: 'x'
            }
        }
    },
    series: [{
        type: 'column',
        id: 'columnSeries',
        data: [1, 2, 4, 5, 7, 9, 7, 5]
    }, {
        type: 'scatter',
        id: 'scatterSeriesA',
        data: [4, null, 7, 11, 13, 13],
        sonification: {
            instruments: [{
                instrument: 'sineMajor',
                mapping: {
                    pan: -1
                }
            }]
        }
    }, {
        type: 'scatter',
        id: 'scatterSeriesB',
        data: [2, 3, 9, 9, 11, 11, 9],
        sonification: {
            instruments: [{
                mapping: {
                    volume: 0.4,
                    pan: 1
                }
            }]
        }
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.sonify();
};
