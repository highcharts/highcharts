const chart = Highcharts.chart('container', {
    chart: {
        inverted: true
    },
    plotOptions: {
        series: {
            animation: false
        }
    },
    scrollbar: {
        buttonsEnabled: true,
        enabled: true
    },
    series: [{
        type: 'columnrange',
        data: [
            'C_4',
            'C_4',
            'E_4',
        ].map(noteToTone),
        sonification: {
            enabled: true
        }
    }],
    xAxis: {
        gridLineWidth: 1,
        reversed: false,
        visible: false
    },
    yAxis: {
        gridLineWidth: 0
    }
});

function noteToTone(note, index) {

    if (typeof note !== 'string') {
        return;
    }

    let {tone, octave, duration} = note.split('_');

    duration = duration || 1;

    return {
        x: {
            4: {
                C: 261.626,
                'C#': 277.183,
                Db: 277.183,
                D: 293.665,
                'D#': 311.127,
                Eb: 311.127,
                E: 329.628,
                F: 349.228,
                'F#': 369.994,
                Gb: 369.994,
                G: 391.995,
                'G#': 415.305,
                Ab: 415.305,
                A: 440,
                'A#': 466.164,
                Bb: 466.164,
                B: 493.883,
            },
            5: {
                C: 523.251
            }
        }[octave]?.[tone],
        low: index,
        high: index + duration * 0.9
    };
}
