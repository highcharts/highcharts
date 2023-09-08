// Add a custom instrument to the presets.
// ----------------------------------------------------------------------------
// See SynthPatch API docs for a more comprehensive set of options for the
// instrument.
Highcharts.sonification.InstrumentPresets.myCustomInstrument = {
    masterVolume: 1, // Global volume modifier for instrument

    noteGlideDuration: 0, // Milliseconds to glide between note frequencies

    masterAttackEnvelope: [ // Global attack envelope for the instrument
        { t: 1, vol: 0.5 }, // t = time in milliseconds, vol = volume
        { t: 17, vol: 1 },
        { t: 32, vol: 0.85 },
        { t: 76, vol: 0.7 }
    ],

    masterReleaseEnvelope: [ // Global release envelope for the instrument
        { t: 1, vol: 0.7 },
        { t: 34, vol: 0.2 },
        { t: 119, vol: 0 }
    ],

    eq: [
        // Global EQ settings for the instrument
        // Low Q means a wider EQ band
        { frequency: 150, Q: 0.6, gain: -12 },
        { frequency: 1000, gain: -2 },
        { frequency: 2000, gain: -16 },
        { frequency: 5000, gain: 8 },
        { frequency: 6000, gain: 10 },
        { frequency: 8000, Q: 0.8, gain: 12 }
    ],

    oscillators: [{
        // Can be sine, triangle, square, sawtooth, whitenoise, pulse
        type: 'sawtooth',
        volume: 1,
        // Multiplier for volume as pitch goes higher
        volumePitchTrackingMultiplier: 0.05,
        // Lowpass filter
        lowpass: { frequency: 17, frequencyPitchTrackingMultiplier: 100 },
        // Highpass filter, Q is resonance
        highpass: { frequency: 200, Q: 3 }
    }, {
        type: 'whitenoise',
        volume: 0.2,
        lowpass: { frequency: 4000, Q: 3 },
        highpass: { frequency: 2000, Q: 3 },
        // This oscillator functions as a volume modifier for oscillator #0
        vmOscillator: 0
    }]
};


// ----------------------------------------------------------------------------
// Create the chart and use the custom instrument
const chart = Highcharts.chart('container', {
    title: {
        text: 'Custom instrument',
        align: 'left',
        margin: 25
    },
    sonification: {
        duration: 3000,
        defaultInstrumentOptions: {
            // Reference it as you would any other instrument. Alternatively,
            // you can just pass the instrument options object directly.
            instrument: 'myCustomInstrument'
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [4, 5, 6, 5, 7, 8, 7, 9, 11, 13, 14, 11, 8,
            7, 5, 2, 2, 1, 6, 8, 9, 11]
    }]
});


document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
