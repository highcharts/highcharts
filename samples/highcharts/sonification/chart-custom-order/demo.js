// Set up a simple chart
var chart = Highcharts.chart('container', {
    title: {
        text: 'Scatter series sonified together'
    },
    legend: {
        enabled: false
    },
    series: [{
        type: 'column',
        id: 'columnSeries',
        data: [1, 2, 4, 5, 7, 9, 7, 5]
    }, {
        type: 'scatter',
        id: 'scatterSeriesA',
        data: [4, null, 7, 11, 13, 13]
    }, {
        type: 'scatter',
        id: 'scatterSeriesB',
        data: [2, 3, 9, 9, 11, 11, 9]
    }]
});

// Click button to call chart.sonify()
document.getElementById('sonify').onclick = function () {
    chart.sonify({
        duration: 5000,
        afterSeriesWait: 1000,
        order: ['columnSeries', ['scatterSeriesA', 'scatterSeriesB']],
        pointPlayTime: 'x',
        // We can use separate instrument options for each series
        seriesOptions: [{
            id: 'columnSeries',
            instruments: [{
                instrument: 'triangleMajor',
                instrumentMapping: {
                    volume: 0.8,
                    duration: 250,
                    pan: 'x',
                    frequency: 'y'
                }
            }]
        }, {
            id: 'scatterSeriesA',
            instruments: [{
                instrument: 'sineMajor',
                instrumentMapping: {
                    volume: 0.8,
                    duration: 250,
                    pan: -1,
                    frequency: 'y'
                }
            }]
        }, {
            id: 'scatterSeriesB',
            instruments: [{
                instrument: 'triangleMajor',
                instrumentMapping: {
                    volume: 0.4,
                    duration: 250,
                    pan: 1,
                    frequency: 'y'
                }
            }]
        }]
    });
};
