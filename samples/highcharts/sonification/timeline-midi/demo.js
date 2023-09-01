const Instrument = Highcharts.sonification.SonificationInstrument,
    Timeline = Highcharts.sonification.SonificationTimeline,
    el = function (id) {
        return document.getElementById(id);
    };
let    timeline1,
    timeline2,
    timeline3;

function makeTimeline1() {
    const ctx = new AudioContext(),
        instr = new Instrument(ctx, ctx.destination, {
            synthPatch: 'piano',
            capabilities: { pan: false },
            midiTrackName: 'First track'
        }),
        timeline = new Timeline();

    timeline.addChannel('instrument', instr, true, [{
        time: 0,
        instrumentEventOptions: {
            note: 'c3',
            noteDuration: 300,
            volume: 0.2
        }
    }, {
        time: 250,
        instrumentEventOptions: { note: 'd3', volume: 0.3 }
    }, {
        time: 500,
        instrumentEventOptions: { note: 'e3', volume: 0.4 }
    }, {
        time: 750,
        instrumentEventOptions: { note: 'f3', volume: 0.5 }
    }, {
        time: 1000,
        instrumentEventOptions: { note: 'g3', volume: 0.6 }
    }, {
        time: 1250,
        instrumentEventOptions: { note: 'a3', volume: 0.7 }
    }, {
        time: 1500,
        instrumentEventOptions: { note: 'b3', volume: 0.8 }
    }, {
        time: 1750,
        instrumentEventOptions: { note: 'c4', volume: 0.9 }
    }]);

    return timeline;
}


function makeTimeline2() {
    const ctx = new AudioContext(),
        instr1 = new Instrument(ctx, ctx.destination, {
            synthPatch: 'piano',
            capabilities: { pan: false },
            midiTrackName: 'First track'
        }),
        instr2 = new Instrument(ctx, ctx.destination, {
            synthPatch: 'saxophone',
            capabilities: { pan: false },
            midiTrackName: 'Second track'
        }),
        timeline = new Timeline();

    timeline.addChannel('instrument', instr1, true, [{
        time: 0,
        instrumentEventOptions: {
            note: 'c3',
            noteDuration: 600,
            volume: 0.3
        }
    }, {
        time: 300,
        instrumentEventOptions: { note: 'd3', volume: 0.5 }
    }, {
        time: 600,
        instrumentEventOptions: { note: 'e3', volume: 0.7 }
    }, {
        time: 900,
        instrumentEventOptions: { note: 'f3', volume: 0.9 }
    }, {
        time: 1350,
        instrumentEventOptions: { note: 'f4', volume: 0.4 }
    }, {
        time: 1800,
        instrumentEventOptions: { note: 'e4', volume: 0.9 }
    }]);

    timeline.addChannel('instrument', instr2, true, [{
        time: 150,
        instrumentEventOptions: {
            note: 'e3',
            noteDuration: 300,
            volume: 0.3
        }
    }, {
        time: 450,
        instrumentEventOptions: { note: 'f3', volume: 0.5 }
    }, {
        time: 750,
        instrumentEventOptions: { note: 'g3', volume: 0.7 }
    }, {
        time: 1050,
        instrumentEventOptions: { note: 'a3', volume: 0.9 }
    }, {
        time: 1390,
        instrumentEventOptions: { note: 'a4', volume: 0.3 }
    }, {
        time: 1830,
        instrumentEventOptions: { note: 'c4', volume: 0.4 }
    }]);

    return timeline;
}


function makeTimeline3() {
    const ctx = new AudioContext(),
        instr1 = new Instrument(ctx, ctx.destination, {
            synthPatch: 'piano',
            capabilities: {
                tremolo: true,
                filters: true
            },
            midiTrackName: 'First track'
        }),
        instr2 = new Instrument(ctx, ctx.destination, {
            synthPatch: 'vibraphone',
            capabilities: {
                tremolo: true
            },
            midiTrackName: 'Second track'
        }),
        timeline = new Timeline();

    timeline.addChannel('instrument', instr1, true, [{
        time: 0,
        instrumentEventOptions: {
            note: 'c3',
            noteDuration: 300,
            pan: -1,
            volume: 0.4,
            tremoloDepth: 0.5,
            tremoloSpeed: 0.6,
            lowpassFreq: 300
        }
    }, {
        time: 400,
        instrumentEventOptions: {
            note: 'g3',
            pan: -0.5,
            lowpassFreq: 600,
            volume: 0.2
        }
    }, {
        time: 800,
        instrumentEventOptions: {
            note: 'c4',
            pan: 0,
            lowpassFreq: 1200,
            volume: 0.8,
            tremoloDepth: 0.5,
            tremoloSpeed: 0.6
        }
    }, {
        time: 1200,
        instrumentEventOptions: {
            note: 'g4',
            pan: 0.5,
            lowpassFreq: 2400
        }
    }, {
        time: 1600,
        instrumentEventOptions: {
            note: 'c5',
            pan: 1,
            tremoloSpeed: 0.3
        }
    }]);

    timeline.addChannel('instrument', instr2, true, [{
        time: 600,
        instrumentEventOptions: {
            note: 'd4',
            noteDuration: 400,
            pan: -1,
            volume: 0.3,
            tremoloDepth: 0
        }
    }, {
        time: 1000,
        instrumentEventOptions: {
            note: 'a3',
            pan: -0.5
        }
    }, {
        time: 1400,
        instrumentEventOptions: {
            note: 'e4',
            pan: 0,
            volume: 0.8
        }
    }, {
        time: 1800,
        instrumentEventOptions: {
            note: 'f5',
            pan: 0.75,
            tremoloSpeed: 0.6,
            tremoloDepth: 0.4
        }
    }, {
        time: 2200,
        instrumentEventOptions: {
            note: 'c6',
            pan: 1,
            tremoloSpeed: 0.7,
            tremoloDepth: 0.7
        }
    }]);

    return timeline;
}

el('play1').onclick = function () {
    (timeline1 = timeline1 || makeTimeline1()).play();
};
el('midi1').onclick = function () {
    timeline1 = timeline1 || makeTimeline1();
    timeline1.downloadMIDI('timeline-simple');
};
el('play2').onclick = function () {
    (timeline2 = timeline2 || makeTimeline2()).play();
};
el('midi2').onclick = function () {
    timeline2 = timeline2 || makeTimeline2();
    timeline2.downloadMIDI('timeline-multi');
};
el('play3').onclick = function () {
    (timeline3 = timeline3 || makeTimeline3()).play();
};
el('midi3').onclick = function () {
    timeline3 = timeline3 || makeTimeline3();
    timeline3.downloadMIDI('timeline-advanced');
};
