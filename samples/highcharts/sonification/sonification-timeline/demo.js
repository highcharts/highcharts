var Instrument = Highcharts.sonification.SonificationInstrument,
    Speech = Highcharts.sonification.SonificationSpeaker,
    Timeline = Highcharts.sonification.SonificationTimeline,
    timeline;

function getTimeline() {
    var ctx = new AudioContext(),
        instr1 = new Instrument(ctx, ctx.destination, {
            synthPatch: JSON.parse(document.getElementById('synthPreset1').textContent),
            capabilities: {
                tremolo: true,
                filters: true
            }
        }),
        instr2 = new Instrument(ctx, ctx.destination, {
            synthPatch: JSON.parse(document.getElementById('synthPreset2').textContent)
        }),
        speaker = new Speech({
            lang: 'en-US',
            rate: 1.7,
            pitch: 1.2,
            volume: 0.2
        }),
        timeline = new Timeline();

    var speechChannel = timeline.addChannel('speech', speaker);
    [{
        time: 0,
        message: '1'
    }, {
        time: 0.5,
        message: '2'
    }, {
        time: 1,
        message: '3'
    }, {
        time: 1.5,
        message: '4'
    }, {
        time: 2,
        message: '5'
    }, {
        time: 2.5,
        message: '6'
    }, {
        time: 3,
        message: '7'
    }, {
        time: 3.5,
        message: '8'
    }].forEach(e => speechChannel.addEvent(e));


    var instrChannel1 = timeline.addChannel('instrument', instr1);
    [{
        time: 0.5,
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
        time: 1.5,
        instrumentEventOptions: {
            note: 'g3',
            pan: -0.5,
            lowpassFreq: 600
        }
    }, {
        time: 2.5,
        instrumentEventOptions: {
            note: 'c4',
            pan: 0,
            lowpassFreq: 1200,
            volume: 0.8,
            tremoloDepth: 0.5,
            tremoloSpeed: 0.6
        }
    }, {
        time: 3.5,
        instrumentEventOptions: {
            note: 'g4',
            pan: 0.5,
            lowpassFreq: 2400
        }
    }, {
        time: 4.5,
        instrumentEventOptions: {
            note: 'c5',
            pan: 1,
            tremoloSpeed: 0.3
        }
    }].forEach(e => instrChannel1.addEvent(e));


    var instrChannel2 = timeline.addChannel('instrument', instr2);
    [{
        time: 1,
        instrumentEventOptions: {
            note: 'd4',
            noteDuration: 400,
            pan: -1,
            volume: 0.3
        }
    }, {
        time: 2,
        instrumentEventOptions: {
            note: 'a3',
            pan: -0.5
        }
    }, {
        time: 3,
        instrumentEventOptions: {
            note: 'e4',
            pan: 0,
            volume: 0.5
        }
    }, {
        time: 4,
        instrumentEventOptions: {
            note: 'f5',
            pan: 0.75
        }
    }, {
        time: 4.5,
        instrumentEventOptions: {
            note: 'g5',
            pan: 1
        }
    }].forEach(e => instrChannel2.addEvent(e));

    return timeline;
}


document.getElementById('play').onclick = function () {
    timeline = timeline || getTimeline();
    timeline.play();
};

document.getElementById('playLast').onclick = function () {
    timeline = timeline || getTimeline();
    timeline.play(e => e.time > 2);
};
