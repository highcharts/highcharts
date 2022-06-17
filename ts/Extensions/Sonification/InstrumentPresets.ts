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
            { frequency: 200, Q: 1, gain: -1 },
            { frequency: 400, Q: 1, gain: -14 },
            { frequency: 800, Q: 1, gain: 8 },
            { frequency: 1000, Q: 5, gain: -24 },
            { frequency: 1600, Q: 1, gain: 8 },
            { frequency: 2200, Q: 1, gain: -10 },
            { frequency: 5400, Q: 1, gain: 4 },
            { frequency: 12800, Q: 1, gain: -36 }
        ],
        oscillators: [{
            type: 'whitenoise',
            volume: 1,
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
            { frequency: 400, Q: 1, gain: -4 },
            { frequency: 800, Q: 1, gain: -12 },
            { frequency: 2400, Q: 1, gain: 4 },
            { frequency: 7200, Q: 1, gain: -20 },
            { frequency: 1000, Q: 5, gain: -12 },
            { frequency: 5400, Q: 1, gain: -32 },
            { frequency: 12800, Q: 1, gain: -14 }
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
            { frequency: 400, Q: 1, gain: -4 },
            { frequency: 1600, Q: 0.5, gain: 6 },
            { frequency: 2200, Q: 0.5, gain: 6 },
            { frequency: 6400, Q: 1, gain: 4 },
            { frequency: 12800, Q: 1, gain: 4 }
        ],
        oscillators: [{
            type: 'sine',
            volume: 1.5,
            volumePitchTrackingMultiplier: 0.07,
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

    // PIANO ----------------------------
    piano: {
        masterVolume: 0.5,
        masterAttackEnvelope: [
            { t: 1, vol: 0.71 },
            { t: 82, vol: 0.64 },
            { t: 149, vol: 0.26 },
            { t: 425, vol: 0 }
        ],
        eq: [
            { frequency: 200, Q: 1, gain: 4 },
            { frequency: 450, Q: 1, gain: 6 },
            { frequency: 1300, Q: 1, gain: 2 },
            { frequency: 2600, Q: 0.8, gain: 8 },
            { frequency: 3500, Q: 0.8, gain: 6 },
            { frequency: 6200, Q: 0.8, gain: 10 },
            { frequency: 8000, Q: 1, gain: -26 },
            { frequency: 10000, Q: 0.4, gain: -12 }
        ],
        oscillators: [{
            type: 'pulse',
            volume: 0.5,
            pulseWidth: 0.45,
            volumePitchTrackingMultiplier: 0.07,
            lowpass: {
                frequency: 4.5,
                frequencyPitchTrackingMultiplier: 900,
                Q: -2
            },
            highpass: {
                frequency: 370
            },
            attackEnvelope: [{ t: 1, vol: 1 }],
            releaseEnvelope: [
                { t: 1, vol: 1 },
                { t: 282, vol: 0.64 },
                { t: 597, vol: 0 }
            ]
        }, {
            type: 'whitenoise',
            volume: 1,
            lowpass: {
                frequency: 400
            },
            highpass: {
                frequency: 300
            },
            attackEnvelope: [
                { t: 1, vol: 1 },
                { t: 19, vol: 0 }
            ]
        }]
    }
};


/* *
 *
 *  Default Export
 *
 * */

export default InstrumentPresets;
