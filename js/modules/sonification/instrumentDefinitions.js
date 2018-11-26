/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Instrument definitions for sonification module.
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Instrument from 'Instrument.js';
import utilities from 'utilities.js';

var instruments = {

    // Basic instruments
    sine: new Instrument(),
    square: new Instrument({ oscillator: { waveformShape: 'square' } }),
    triangle: new Instrument({ oscillator: { waveformShape: 'triangle' } }),
    sawtooth: new Instrument({ oscillator: { waveformShape: 'sawtooth' } }),

    // Instrument with only musical notes
    triangleMusical: new Instrument({
        allowedFrequencies: utilities.musicalFrequencies,
        oscillator: {
            waveformShape: 'triangle'
        }
    }),

    // C-major scale instrument
    triangleMajor: new Instrument({
        allowedFrequencies: utilities.getMusicalScale([1, 3, 5, 6, 8, 10, 12]),
        oscillator: {
            waveformShape: 'triangle'
        }
    })

};

export default instruments;
