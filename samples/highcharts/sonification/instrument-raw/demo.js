const Instrument = Highcharts.sonification.SonificationInstrument;

document.getElementById('play').onclick = function () {
    const ctx = new AudioContext();
    const instr = new Instrument(ctx, ctx.destination, {
        synthPatch: Highcharts.sonification.InstrumentPresets.piano,
        capabilities: {
            tremolo: true,
            filters: true
        }
    });
    [
        { note: 'c4', noteDuration: 300, pan: -1, volume: 0.2, tremoloDepth: 0, tremoloSpeed: 0, lowpassFreq: 300, highpassFreq: 0 },
        { note: 'd4', pan: -0.7, volume: 0.2, tremoloDepth: 0.1, tremoloSpeed: 0.1, lowpassFreq: 300, highpassFreq: 100 },
        { note: 'e4', pan: -0.4, volume: 0.3, tremoloDepth: 0.2, tremoloSpeed: 0.15, lowpassFreq: 400, highpassFreq: 200 },
        { note: 'g4', pan: -0.2, volume: 0.4, tremoloDepth: 0.4, tremoloSpeed: 0.2, lowpassFreq: 800, highpassFreq: 300 },
        { note: 'c5', pan: 0, volume: 0.6, tremoloDepth: 0.6, tremoloSpeed: 0.5, lowpassFreq: 1600, highpassFreq: 400 },
        { note: 'g4', pan: 0.3, volume: 0.65, tremoloDepth: 0.6, tremoloSpeed: 0.5, lowpassFreq: 2400, highpassResonance: -1 },
        { note: 'f4', pan: 0.6, volume: 0.7, tremoloDepth: 0.6, tremoloSpeed: 0.6, lowpassFreq: 4000, highpassResonance: -3 },
        { note: 'e4', pan: 0.8, volume: 0.75, tremoloDepth: 0.7, tremoloSpeed: 0.6, lowpassFreq: 7000, highpassResonance: 0 },
        { note: 'c4', pan: 1, volume: 0.8, tremoloDepth: 0.7, tremoloSpeed: 0.75, lowpassFreq: 20000, highpassFreq: 0 }
    ].forEach((e, ix) =>
        instr.scheduleEventAtTime(ctx.currentTime + ix * 0.35, e));
};
