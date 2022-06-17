var Instrument = Highcharts.sonification.SonificationInstrument,
    Speech = Highcharts.sonification.SonificationSpeaker,
    Timeline = Highcharts.sonification.SonificationTimeline,
    el = function (id) {
        return document.getElementById(id);
    },
    timeline,
    done = true;

function onEnd() {
    el('play').textContent = 'Play';
    el('playLast').textContent = 'Play last notes';
    done = true;
}


function getTimeline() {
    var ctx = new AudioContext(),
        instr1 = new Instrument(ctx, ctx.destination, {
            synthPatch: 'piano',
            capabilities: {
                tremolo: true,
                filters: true
            }
        }),
        instr2 = new Instrument(ctx, ctx.destination, {
            synthPatch: 'vibraphone'
        }),
        speaker = new Speech({
            language: 'en-US',
            rate: 1.7,
            pitch: 0.4,
            volume: 0.2
        }),
        timeline = new Timeline({
            onEnd: onEnd
        });

    var speechChannel = timeline.addChannel('speech', speaker);
    [{
        time: 0,
        message: '1'
    }, {
        time: 500,
        message: '2',
        speechOptions: { pitch: 1.6 }
    }, {
        time: 1000,
        message: '3',
        speechOptions: { pitch: 0.6 }
    }, {
        time: 1500,
        message: '4',
        speechOptions: { pitch: 0.9 }
    }, {
        time: 2000,
        message: '5',
        speechOptions: { pitch: 1.3 }
    }, {
        time: 2500,
        message: '6',
        speechOptions: { pitch: 1.7 }
    }, {
        time: 3000,
        message: '7',
        speechOptions: { pitch: 2 }
    }, {
        time: 3500,
        message: '8',
        speechOptions: { pitch: 2 }
    }].forEach(e => speechChannel.addEvent(e));


    var instrChannel1 = timeline.addChannel('instrument', instr1);
    [{
        time: 500,
        instrumentEventOptions: {
            note: 'c3',
            noteDuration: 300,
            pan: -1,
            volume: 0.8,
            tremoloDepth: 0.5,
            tremoloSpeed: 0.6,
            lowpassFreq: 300
        }
    }, {
        time: 1500,
        instrumentEventOptions: {
            note: 'g3',
            pan: -0.5,
            lowpassFreq: 600
        }
    }, {
        time: 2500,
        instrumentEventOptions: {
            note: 'c4',
            pan: 0,
            lowpassFreq: 1200,
            volume: 0.8,
            tremoloDepth: 0.5,
            tremoloSpeed: 0.6
        }
    }, {
        time: 3500,
        instrumentEventOptions: {
            note: 'g4',
            pan: 0.5,
            lowpassFreq: 2400
        }
    }, {
        time: 4500,
        instrumentEventOptions: {
            note: 'c5',
            pan: 1,
            tremoloSpeed: 0.3
        }
    }].forEach(e => instrChannel1.addEvent(e));


    var instrChannel2 = timeline.addChannel('instrument', instr2);
    [{
        time: 1000,
        instrumentEventOptions: {
            note: 'd4',
            noteDuration: 400,
            pan: -1,
            volume: 0.3
        }
    }, {
        time: 2000,
        instrumentEventOptions: {
            note: 'a3',
            pan: -0.5
        }
    }, {
        time: 3000,
        instrumentEventOptions: {
            note: 'e4',
            pan: 0,
            volume: 0.5
        }
    }, {
        time: 4000,
        instrumentEventOptions: {
            note: 'f5',
            pan: 0.75
        }
    }, {
        time: 4500,
        instrumentEventOptions: {
            note: 'g5',
            pan: 1
        }
    }].forEach(e => instrChannel2.addEvent(e));

    return timeline;
}

function onBtnClick(btn, textSuffix, filter) {
    var suffix = textSuffix || '';
    timeline = timeline || getTimeline();
    if (timeline.paused) {
        btn.textContent = 'Pause' + suffix;
        timeline.resume();
    } else if (done) {
        btn.textContent = 'Pause' + suffix;
        done = false;
        timeline.play(filter);
    } else {
        btn.textContent = 'Resume' + suffix;
        timeline.pause();
    }
}

el('play').onclick = function () {
    onBtnClick(this);
};

el('playLast').onclick = function () {
    onBtnClick(this, ' last notes', function (e) {
        return e.time > 2000;
    });
};
