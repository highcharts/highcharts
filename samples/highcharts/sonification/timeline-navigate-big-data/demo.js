// Some demo data with spikes
var dataA = [],
    dataB = [],
    size = 50000;
for (var i = 0; i < size; ++i) {
    dataA.push(i % 10000 ? Math.sin(i / (size / 5)) * 100 + 1000 : 400);
    dataB.push(i % 17000 ? Math.sin(i / (size / 53)) * 20 + 100 : 2000);
}


// Make the chart
var chart = Highcharts.chart('container', {
    sonification: {
        order: 'simultaneous',
        duration: 5000,
        masterVolume: 0.5,
        defaultInstrumentOptions: {
            instrument: 'sine',
            roundToMusicalNotes: false,
            pointGrouping: {
                groupTimespan: 30 // Every 30ms is grouped together
            },
            mapping: {
                pitch: {
                    min: 'c3',
                    max: 'c7'
                }
            }
        }
    },
    tooltip: {
        shared: true,
        valueDecimals: 0
    },
    series: [{
        sonification: {
            tracks: [{
                mapping: {
                    pan: -1 // Pan this series left
                }
            }]
        },
        data: dataA
    }, {
        sonification: {
            tracks: [{
                mapping: {
                    pan: 1 // Pan this series right
                }
            }]
        },
        data: dataB
    }]
});


// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    var timeline = chart.sonification.timeline;
    if (e.code === 'KeyS') {
        if (chart.sonification.isPlaying()) {
            timeline.pause();
        } else if (timeline && timeline.isPaused) {
            timeline.resume();
        } else {
            chart.sonify();
        }
    } else if (e.code === 'KeyA') {
        chart.sonification.playAdjacent(false);
    } else if (e.code === 'KeyD') {
        chart.sonification.playAdjacent(true);
    }
});


// Update current time readout
setInterval(function () {
    var timeline = chart.sonification.timeline;
    if (timeline) {
        document.getElementById('currentTime').textContent =
            Math.round(timeline.getCurrentTime() / 4700 * 100);
    }
}, 200);
