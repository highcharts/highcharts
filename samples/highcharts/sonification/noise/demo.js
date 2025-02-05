const Instrument = Highcharts.sonification.SonificationInstrument;

const containerElement = document.getElementById('container');
const playElement = document.getElementById('play');

const chart = Highcharts.chart(containerElement, {
    title: {
        text: 'Noise adjustment'
    },
    plotOptions: {
        series: {
            dragDrop: {
                draggableY: true,
                dragMaxY: 100,
                dragMinY: 0
            },
            marker: {
                enabled: true
            }
        }
    },
    series: [{
        data: (function () {
            const notes = [];

            for (let octave = -3; octave < 5; octave++) {
                for (let noteIndex = 0; noteIndex < 12; ++noteIndex) {
                    notes.push({
                        custom: {
                            note: [
                                'C', 'C#', 'D', 'D#', 'E', 'F',
                                'F#', 'G', 'G#', 'A', 'A#', 'B'
                            ][noteIndex]
                        },
                        x: (440 * Math.pow(2, octave + noteIndex / 12)),
                        y: 50
                    });
                }
            }

            return notes;
        }()),
        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                return `${this.custom.note}<br />${this.x} Hz<br />${this.y}%`;
            }
        }
    }],
    xAxis: {
        name: 'Frequency',
        type: 'logarithmic'
    },
    yAxis: {
        name: 'Volume',
        min: 0,
        max: 100
    }
});


playElement.onclick = function () {
    const ctx = new AudioContext();
    const instr = new Instrument(ctx, ctx.destination, {
        synthPatch: Highcharts.sonification.InstrumentPresets.piano,
        capabilities: {
            tremolo: true,
            filters: true
        }
    });
    [
        {
            note:
            'c4',
            noteDuration: 300,
            pan: -1,
            volume: chart.series[0].points[0].y,
            tremoloDepth: 0,
            tremoloSpeed: 0,
            lowpassFreq: 300,
            highpassFreq: 0
        },
        {
            note:
            'd4',
            pan: -0.7,
            volume: 0.2,
            tremoloDepth: 0.1,
            tremoloSpeed: 0.1,
            lowpassFreq: 300,
            highpassFreq: 100
        },
        {
            note:
            'e4',
            pan: -0.4,
            volume: 0.3,
            tremoloDepth: 0.2,
            tremoloSpeed: 0.15,
            lowpassFreq: 400,
            highpassFreq: 200
        },
        {
            note:
            'g4',
            pan: -0.2,
            volume: 0.4,
            tremoloDepth: 0.4,
            tremoloSpeed: 0.2,
            lowpassFreq: 800,
            highpassFreq: 300
        },
        {
            note:
            'c5',
            pan: 0,
            volume: 0.6,
            tremoloDepth: 0.6,
            tremoloSpeed: 0.5,
            lowpassFreq: 1600,
            highpassFreq: 400
        },
        {
            note:
            'g4',
            pan: 0.3,
            volume: 0.65,
            tremoloDepth: 0.6,
            tremoloSpeed: 0.5,
            lowpassFreq: 2400,
            highpassResonance: -1
        },
        {
            note:
            'f4',
            pan: 0.6,
            volume: 0.7,
            tremoloDepth: 0.6,
            tremoloSpeed: 0.6,
            lowpassFreq: 4000,
            highpassResonance: -3
        },
        {
            note:
            'e4',
            pan: 0.8,
            volume: 0.75,
            tremoloDepth: 0.7,
            tremoloSpeed: 0.6,
            lowpassFreq: 7000,
            highpassResonance: 0
        },
        {
            note:
            'c4',
            pan: 1,
            volume: 0.8,
            tremoloDepth: 0.7,
            tremoloSpeed: 0.75,
            lowpassFreq: 20000,
            highpassFreq: 0
        }
    ].forEach((e, ix) =>
        instr.scheduleEventAtTime(ctx.currentTime + ix * 0.35, e)
    );
};
