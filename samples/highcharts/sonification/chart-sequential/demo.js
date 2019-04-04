// Set up a simple chart
var chart = Highcharts.chart('container', {
    title: {
        text: 'Chart sonified in sequence'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [1, 2, 4, 5, 7, 9, 11, 13]
    }, {
        data: [4, 5, 7, 9]
    }]
});

// Click button to call chart.sonify()
document.getElementById('sonify').onclick = function () {
    chart.sonify({
        duration: 3000,
        order: 'sequential',
        pointPlayTime: 'x',
        afterSeriesWait: 1000,
        instruments: [{
            instrument: 'triangleMajor',
            instrumentMapping: {
                volume: 0.8,
                duration: 250,
                pan: 'x',
                frequency: 'y'
            },
            // Start at C5 note, end at C6
            instrumentOptions: {
                minFrequency: 520,
                maxFrequency: 1050
            }
        }]
    });
};
