var chart = Highcharts.chart('container', {
    sonification: {
        order: 'simultaneous',
        duration: 4000,
        masterVolume: 0.5,
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    min: 'c3',
                    max: 'c5'
                }
            }
        }
    },
    tooltip: {
        shared: true
    },
    series: [{
        sonification: {
            tracks: [{
                mapping: {
                    pan: -1
                }
            }]
        },
        data: [1, 5, 8, 13, 17, 20, 25, 24, 25]
    }, {
        sonification: {
            tracks: [{
                mapping: {
                    pan: 1
                }
            }]
        },
        data: [null, 8, 13, 17, 17, 17, 13]
    }]
});


function afterNavigate(timeline, pointsPlayed) {
    var synth = window.speechSynthesis;
    if (!synth || !window.SpeechSynthesisUtterance) {
        return;
    }
    synth.cancel();
    var announcement = pointsPlayed.reduce(function (acc, cur) {
            const val = cur.y + ' ' + cur.series.name;
            return acc ? acc + ', ' + val : val;
        }, '') + '. X is ' + pointsPlayed[0].x,
        utterance = new window.SpeechSynthesisUtterance(announcement);
    utterance.rate = 2;
    utterance.volume = 0.4;
    synth.speak(utterance);
}

document.addEventListener('keydown', function (e) {
    var timeline = chart.sonification.timeline;
    if (e.code === 'KeyS') {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (chart.sonification.isPlaying()) {
            timeline.pause();
        } else if (timeline && timeline.isPaused) {
            timeline.resume();
        } else {
            chart.sonify();
        }
    } else if (e.code === 'KeyA') {
        chart.sonification.playAdjacent(false, afterNavigate);
    } else if (e.code === 'KeyD') {
        chart.sonification.playAdjacent(true, afterNavigate);
    } else if (e.code === 'Escape') {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
});

setInterval(function () {
    var timeline = chart.sonification.timeline;
    if (timeline) {
        document.getElementById('currentTime').textContent = Math.round(timeline.getCurrentTime() / 3700 * 100);
    }
}, 200);