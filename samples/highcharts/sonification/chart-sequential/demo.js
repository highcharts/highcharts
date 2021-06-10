// Set up a simple chart
var chart = Highcharts.chart('container', {
    title: {
        text: 'Chart sonified in sequence'
    },
    legend: {
        enabled: false
    },
    sonification: {
        events: {
            onPointStart: function (e, point) {
                point.onMouseOver();
            },
            onEnd: function () {
                document.getElementById('sonify').style.visibility = 'visible';
                document.getElementById('overlay').style.visibility = 'visible';
                document.getElementById('stop').style.visibility = 'hidden';
            }
        }
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    series: [{
        data: [1, 2, 4, 5, 7, 9, 11, 13]
    }, {
        data: [4, 5, 7, 9]
    }]
});

// Click button to call chart.sonify()
document.getElementById('sonify').onclick = function () {
    document.getElementById('sonify').style.visibility = 'hidden';
    document.getElementById('overlay').style.visibility = 'hidden';
    document.getElementById('stop').style.visibility = 'visible';
    chart.sonify({
        duration: 3000,
        order: 'sequential',
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
    document.getElementById('stop').focus();
};

document.getElementById('stop').onclick = function () {
    chart.cancelSonify();
    document.getElementById('sonify').style.visibility = 'visible';
    document.getElementById('overlay').style.visibility = 'visible';
    document.getElementById('stop').style.visibility = 'hidden';
};
