/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Instrument definitions for sonification module.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Instrument from './Instrument.js';
import utilities from './Utilities.js';
var instruments = {};
['sine', 'square', 'triangle', 'sawtooth'].forEach(function (waveform) {
    // Add basic instruments
    instruments[waveform] = new Instrument({
        oscillator: { waveformShape: waveform }
    });
    // Add musical instruments
    instruments[waveform + 'Musical'] = new Instrument({
        allowedFrequencies: utilities.musicalFrequencies,
        oscillator: { waveformShape: waveform }
    });
    // Add scaled instruments
    instruments[waveform + 'Major'] = new Instrument({
        allowedFrequencies: utilities.getMusicalScale([1, 3, 5, 6, 8, 10, 12]),
        oscillator: { waveformShape: waveform }
    });
});
export default instruments;
