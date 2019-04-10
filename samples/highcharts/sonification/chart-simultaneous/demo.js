// Set up a simple chart
var chart = Highcharts.chart('container', {
    title: {
        text: 'Series sonified simultaneously'
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [1, 2, 4, 5, 7, 9, 7, 5]
    }, {
        data: [4, null, 7, 9, 13, 13]
    }]
});

// Click button to call chart.sonify()
document.getElementById('sonify').onclick = function () {
    chart.sonify({
        duration: 2000,
        order: 'simultaneous',
        pointPlayTime: 'x',
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
