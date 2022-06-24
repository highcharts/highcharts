/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Presets for SynthPatch.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type SynthPatch from './SynthPatch';

const InstrumentPresets: Record<string, SynthPatch.SynthPatchOptions> = {

    // PIANO ----------------------------
    piano: {
        masterVolume: 0.5,
        masterAttackEnvelope: [
            { t: 1, vol: 0.71 },
            { t: 40, vol: 0.79 },
            { t: 82, vol: 0.64 },
            { t: 149, vol: 0.26 },
            { t: 425, vol: 0 }
        ],
        eq: [
            { frequency: 200, gain: 4 },
            { frequency: 450, gain: 6 },
            { frequency: 1300, gain: 2 },
            { frequency: 2600, Q: 0.8, gain: 8 },
            { frequency: 3500, Q: 0.8, gain: 6 },
            { frequency: 6200, Q: 0.8, gain: 10 },
            { frequency: 8000, gain: -26 },
            { frequency: 10000, Q: 0.4, gain: -12 }
        ],
        oscillators: [{
            type: 'pulse',
            volume: 0.5,
            pulseWidth: 0.55,
            volumePitchTrackingMultiplier: 0.07,
            lowpass: {
                frequency: 4.5,
                frequencyPitchTrackingMultiplier: 900,
                Q: -2
            },
            highpass: { frequency: 370 },
            attackEnvelope: [{ t: 1, vol: 1 }],
            releaseEnvelope: [
                { t: 1, vol: 1 },
                { t: 282, vol: 0.64 },
                { t: 597, vol: 0 }
            ]
        }, {
            type: 'whitenoise',
            volume: 1,
            lowpass: { frequency: 400 },
            highpass: { frequency: 300 },
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 19, vol: 0 }
            ]
        }]
    },

    // FLUTE ----------------------------
    flute: {
        masterVolume: 0.95,
        noteGlideDuration: 40,
        masterAttackEnvelope: [
            { t: 0, vol: 0 },
            { t: 29, vol: 1 },
            { t: 76, vol: 0.48 },
            { t: 600, vol: 0.36 }
        ],
        masterReleaseEnvelope: [
            { t: 1, vol: 0.36 },
            { t: 24, vol: 0.15 },
            { t: 119, vol: 0 }
        ],
        eq: [
            { frequency: 150, Q: 0.6, gain: -10 },
            { frequency: 500, gain: 4 },
            { frequency: 1100, gain: -4 },
            { frequency: 2200, gain: -14 },
            { frequency: 5000, gain: 8 },
            { frequency: 6400, gain: 10 },
            { frequency: 8000, gain: 12 },
            { frequency: 10800, gain: 8 }
        ],
        oscillators: [{
            type: 'triangle',
            volume: 0.9,
            volumePitchTrackingMultiplier: 0.4,
            lowpass: {
                frequency: 12,
                frequencyPitchTrackingMultiplier: 100
            },
            highpass: {
                frequency: 200
            }
        }, {
            type: 'sine',
            fixedFrequency: 5,
            volume: 0.2,
            vmOscillator: 0,
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 48, vol: 0 },
                { t: 225, vol: 0.05 },
                { t: 600, vol: 0.77 }
            ]
        }, {
            type: 'whitenoise',
            volume: 0.12,
            lowpass: {
                frequency: 9000,
                Q: 3
            },
            highpass: {
                frequency: 6000,
                Q: 3
            },
            vmOscillator: 0,
            attackEnvelope: [
                { t: 0, vol: 0 },
                { t: 26, vol: 1 },
                { t: 93, vol: 0.8 }
            ]
        }]
    },

    // VIBRAPHONE -----------------------
    vibraphone: {
        masterVolume: 1,
        masterAttackEnvelope: [
            { t: 1, vol: 0 },
            { t: 10, vol: 0.63 },
            { t: 82, vol: 0.64 },
            { t: 149, vol: 0.26 },
            { t: 600, vol: 0 }
        ],
        eq: [
            { frequency: 200, Q: 0.8, gain: -12 },
            { frequency: 400, gain: -4 },
            { frequency: 1600, Q: 0.5, gain: 6 },
            { frequency: 2200, Q: 0.5, gain: 6 },
            { frequency: 6400, gain: 4 },
            { frequency: 12800, gain: 4 }
        ],
        oscillators: [{
            type: 'sine',
            volume: 1.5,
            volumePitchTrackingMultiplier: 0.0000001,
            attackEnvelope: [{ t: 1, vol: 1 }],
            releaseEnvelope: [
                { t: 1, vol: 1 },
                { t: 146, vol: 0.39 },
                { t: 597, vol: 0 }
            ]
        }, {
            type: 'whitenoise',
            volume: 0.03,
            volumePitchTrackingMultiplier: 2,
            lowpass: {
                frequency: 900
            },
            highpass: {
                frequency: 800
            },
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 9, vol: 0 }
            ]
        }, {
            type: 'sine',
            freqMultiplier: 4,
            volume: 0.15,
            volumePitchTrackingMultiplier: 0.03
        }, {
            type: 'sine',
            fixedFrequency: 3,
            volume: 6,
            fmOscillator: 0,
            releaseEnvelope: [
                { t: 1, vol: 1 },
                { t: 190, vol: 0.41 },
                { t: 600, vol: 0 }
            ]
        }, {
            type: 'sine',
            fixedFrequency: 6,
            volume: 3,
            fmOscillator: 2
        }, {
            type: 'sine',
            freqMultiplier: 9,
            volume: 0.0005,
            volumePitchTrackingMultiplier: 0.07,
            releaseEnvelope: [
                { t: 1, vol: 0.97 },
                { t: 530, vol: 0 }
            ]
        }]
    },

    // SAXOPHONE ------------------------
    saxophone: {
        masterVolume: 1,
        noteGlideDuration: 10,
        masterAttackEnvelope: [
            { t: 1, vol: 0.57 },
            { t: 35, vol: 1 },
            { t: 87, vol: 0.84 },
            { t: 111, vol: 0.6 },
            { t: 296, vol: 0.49 },
            { t: 600, vol: 0.58 }
        ],
        masterReleaseEnvelope: [
            { t: 1, vol: 0.58 },
            { t: 47, vol: 0.16 },
            { t: 119, vol: 0 }
        ],
        eq: [
            { frequency: 200, gain: -2 },
            { frequency: 600, gain: 2 },
            { frequency: 800, gain: -10 },
            { frequency: 1100, gain: -2 },
            { frequency: 2200, gain: -2 },
            { frequency: 3500, gain: 10 },
            { frequency: 12800, gain: 4 }
        ],
        oscillators: [{
            type: 'sawtooth',
            volume: 0.45,
            volumePitchTrackingMultiplier: 0.06,
            lowpass: {
                frequency: 18,
                frequencyPitchTrackingMultiplier: 200
            },
            highpass: {
                frequency: 300
            }
        }, {
            type: 'whitenoise',
            fixedFrequency: 1,
            volume: 0.4,
            highpass: {
                frequency: 7000
            },
            vmOscillator: 0,
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 51, vol: 1 },
                { t: 86, vol: 0.84 },
                { t: 500, vol: 0.78 }
            ]
        }, {
            type: 'sine',
            fixedFrequency: 4,
            volume: 2,
            fmOscillator: 0,
            attackEnvelope: [
                { t: 0, vol: 0 },
                { t: 15, vol: 0.94 },
                { t: 79, vol: 1 },
                { t: 172, vol: 0.47 },
                { t: 500, vol: 0.26 }
            ]
        }, {
            type: 'sine',
            fixedFrequency: 7,
            volume: 6,
            fmOscillator: 0,
            attackEnvelope: [
                { t: 0, vol: 0 },
                { t: 25, vol: 0.99 },
                { t: 85, vol: 0 },
                { t: 85, vol: 0 },
                { t: 387, vol: 0.02 },
                { t: 511, vol: 0.43 },
                { t: 600, vol: 0 }
            ]
        }]
    },

    // TRUMPET ------------------------
    trumpet: {
        masterVolume: 0.4,
        noteGlideDuration: 40,
        masterAttackEnvelope: [
            { t: 1, vol: 0 },
            { t: 17, vol: 1 },
            { t: 42, vol: 0.85 },
            { t: 76, vol: 1 },
            { t: 202, vol: 0.65 },
            { t: 226, vol: 0.86 },
            { t: 282, vol: 0.63 }
        ],
        masterReleaseEnvelope: [
            { t: 1, vol: 0.62 },
            { t: 34, vol: 0.14 },
            { t: 63, vol: 0.21 },
            { t: 96, vol: 0 }
        ],
        eq: [
            { frequency: 600, Q: 0.5, gain: 6 },
            { frequency: 200, Q: 0.6, gain: 6 },
            { frequency: 1500, Q: 0.7, gain: 14 },
            { frequency: 3200, Q: 2, gain: 8 },
            { frequency: 3800, Q: 0.8, gain: 10 },
            { frequency: 6200, gain: 12 },
            { frequency: 8400, gain: -20 },
            { frequency: 12800, Q: 0.5, gain: -18 }
        ],
        oscillators: [{
            type: 'sawtooth',
            volume: 0.15,
            pulseWidth: 0.5,
            volumePitchTrackingMultiplier: 0.5,
            lowpass: { frequency: 1900, Q: 3 }
        }, {
            type: 'sine',
            fixedFrequency: 6,
            volume: 0.2,
            vmOscillator: 0,
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 102, vol: 0.13 },
                { t: 556, vol: 0.24 }
            ]
        }, {
            type: 'whitenoise',
            volume: 0.45,
            highpass: { frequency: 7000, Q: 9 },
            vmOscillator: 0,
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 89, vol: 0.51 },
                { t: 577, vol: 0.29 }
            ]
        }, {
            type: 'sine',
            fixedFrequency: 5.7,
            volume: 20,
            fmOscillator: 0,
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 89, vol: 1 },
                { t: 137, vol: 0.46 },
                { t: 283, vol: 0.15 },
                { t: 600, vol: 0.28 }
            ]
        }]
    },

    // SAWSYNTH --------------------------
    sawsynth: {
        masterVolume: 0.3,
        noteGlideDuration: 40,
        masterAttackEnvelope: [
            { t: 0, vol: 0.6 },
            { t: 9, vol: 1 },
            { t: 102, vol: 0.48 }
        ],
        eq: [{ frequency: 200, gain: -6 }],
        oscillators: [{
            type: 'sawtooth',
            volume: 0.4,
            volumePitchTrackingMultiplier: 0.3
        }, {
            type: 'sawtooth',
            volume: 0.4,
            detune: 11,
            volumePitchTrackingMultiplier: 0.3
        }, {
            type: 'sawtooth',
            volume: 0.4,
            detune: -11,
            volumePitchTrackingMultiplier: 0.3
        }]
    },

    // SINE -----------------------------
    sine: {
        masterVolume: 1,
        oscillators: [{
            type: 'sine',
            volumePitchTrackingMultiplier: 0.07
        }]
    },

    // SINE GLIDE -----------------------
    sineGlide: {
        masterVolume: 1,
        noteGlideDuration: 100,
        oscillators: [{
            type: 'sine',
            volumePitchTrackingMultiplier: 0.07
        }]
    },

    // TRIANGLE -------------------------
    triangle: {
        masterVolume: 0.5,
        oscillators: [{
            type: 'triangle',
            volume: 1,
            volumePitchTrackingMultiplier: 0.07
        }]
    },

    // SAWTOOTH -------------------------
    sawtooth: {
        masterVolume: 0.4,
        oscillators: [{
            type: 'sawtooth',
            volume: 0.3,
            volumePitchTrackingMultiplier: 0.07
        }]
    },

    // SQUARE ---------------------------
    square: {
        masterVolume: 0.4,
        oscillators: [{
            type: 'square',
            volume: 0.2,
            volumePitchTrackingMultiplier: 0.07
        }]
    },

    // PERCUSSION INSTRUMENTS ----------
    chop: {
        masterVolume: 1,
        masterAttackEnvelope: [{ t: 1, vol: 1 }, { t: 44, vol: 0 }],
        oscillators: [{
            type: 'whitenoise',
            volume: 1,
            lowpass: { frequency: 600 },
            highpass: { frequency: 200 }
        }]
    },

    shaker: {
        masterVolume: 0.4,
        masterAttackEnvelope: [{ t: 1, vol: 1 }, { t: 44, vol: 0 }],
        oscillators: [{
            type: 'whitenoise',
            volume: 1,
            lowpass: { frequency: 6500 },
            highpass: { frequency: 5000 }
        }]
    },

    step: {
        masterVolume: 1,
        masterAttackEnvelope: [{ t: 1, vol: 1 }, { t: 44, vol: 0 }],
        eq: [
            { frequency: 200, gain: -1 },
            { frequency: 400, gain: -14 },
            { frequency: 800, gain: 8 },
            { frequency: 1000, Q: 5, gain: -24 },
            { frequency: 1600, gain: 8 },
            { frequency: 2200, gain: -10 },
            { frequency: 5400, gain: 4 },
            { frequency: 12800, gain: -36 }
        ],
        oscillators: [{
            type: 'whitenoise',
            volume: 1.5,
            lowpass: { frequency: 300 },
            highpass: { frequency: 100, Q: 6 }
        }]
    },

    shortnote: {
        masterVolume: 0.8,
        masterAttackEnvelope: [
            { t: 1, vol: 1 },
            { t: 15, vol: 0 }
        ],
        eq: [
            { frequency: 400, gain: -4 },
            { frequency: 800, gain: -12 },
            { frequency: 2400, gain: 4 },
            { frequency: 7200, gain: -20 },
            { frequency: 1000, Q: 5, gain: -12 },
            { frequency: 5400, gain: -32 },
            { frequency: 12800, gain: -14 }
        ],
        oscillators: [{
            type: 'sawtooth',
            volume: 0.6,
            lowpass: { frequency: 1000 }
        }, {
            type: 'whitenoise',
            volume: 0.2,
            lowpass: { frequency: 10000 },
            highpass: { frequency: 7000 },
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 10, vol: 0 }
            ]
        }, {
            type: 'whitenoise',
            volume: 1.3,
            lowpass: { frequency: 700, Q: 4 },
            highpass: { frequency: 250 }
        }]
    },

    // NOISE ----------------------------
    noise: {
        masterVolume: 0.3,
        oscillators: [{
            type: 'whitenoise'
        }]
    },

    // FILTERED NOISE -------------------
    filteredNoise: {
        masterVolume: 0.3,
        eq: [
            { frequency: 1600, gain: -8 },
            { frequency: 2200, gain: -4 }
        ],
        oscillators: [{
            type: 'whitenoise',
            lowpass: {
                frequency: 5,
                frequencyPitchTrackingMultiplier: 1300,
                Q: 6
            },
            highpass: {
                frequency: 5,
                frequencyPitchTrackingMultiplier: 300,
                Q: 6
            }
        }]
    },

    // WIND -------------------------------
    wind: {
        masterVolume: 0.75,
        noteGlideDuration: 250,
        masterReleaseEnvelope: [
            { t: 0, vol: 1 },
            { t: 124, vol: 0.24 },
            { t: 281, vol: 0 }
        ],
        oscillators: [{
            type: 'whitenoise',
            volume: 1,
            lowpass: {
                frequency: 100,
                frequencyPitchTrackingMultiplier: 6,
                Q: 23
            },
            highpass: {
                frequency: 170,
                frequencyPitchTrackingMultiplier: 6
            }
        }, {
            type: 'sine',
            freqMultiplier: 0.016,
            volume: 1000,
            fmOscillator: 0
        }]
    }

};


/* *
 *
 *  Default Export
 *
 * */

export default InstrumentPresets;
