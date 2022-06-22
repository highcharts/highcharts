// Some demo data with spikes
var dataA = [],
    dataB = [],
    size = 50000;
for (var i = 0; i < size; ++i) {
    dataA.push(i % 10000 ? Math.sin(i / (size / 5)) * 100 + 1000 : 400);
    dataB.push(i % 17000 ? Math.sin(i / (size / 53)) * 20 + 100 : 2000);
}

// Set up an extra instrument for playing notification when
// attempting to navigate beyond chart.
var ax, instr;
try {
    ax = new AudioContext();
    instr = new Highcharts.sonification.SynthPatch(
        ax,
        Highcharts.sonification.InstrumentPresets.step
    );
    instr.startSilently();
    instr.connect(ax.destination);
// eslint-disable-next-line no-unused-vars
} catch (e) { /* ignore sonification unsupported */ }


// Make the chart
var chart = Highcharts.chart('container', {
    sonification: {
        order: 'simultaneous',
        duration: 5000,
        masterVolume: 0.5,
        events: {
            onBoundaryHit: function () {
                // Play a sound effect on navigation beyond chart
                if (instr) {
                    instr.playFreqAtTime(0, 1, 300);
                }
            }
        },
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
        if (timeline) {
            timeline.playAdjacent(false);
        }
    } else if (e.code === 'KeyD') {
        if (timeline) {
            timeline.playAdjacent(true);
        }
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
