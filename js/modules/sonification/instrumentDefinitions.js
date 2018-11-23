/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Instrument definitions for sonification module.
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Instrument from 'Instrument.js';

var instruments = {
    sine: new Instrument(),
    square: new Instrument({ oscillator: { waveformShape: 'square' } }),
    triangle: new Instrument({ oscillator: { waveformShape: 'triangle' } }),
    sawtooth: new Instrument({ oscillator: { waveformShape: 'sawtooth' } })
};

export default instruments;
