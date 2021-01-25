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

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface InstrumentsDictionary extends Record<string, Instrument> {
            sawtooth: Instrument;
            sawtoothMajor: Instrument;
            sawtoothMusical: Instrument;
            sine: Instrument;
            sineMajor: Instrument;
            sineMusical: Instrument;
            square: Instrument;
            squareMajor: Instrument;
            squareMusical: Instrument;
            triangle: Instrument;
            triangleMajor: Instrument;
            triangleMusical: Instrument;
        }
        type InstrumentWaveform = keyof InstrumentsDictionary;
    }
}

import Instrument from './Instrument.js';
import utilities from './Utilities.js';

var instruments: Highcharts.InstrumentsDictionary = {} as any;

['sine', 'square', 'triangle', 'sawtooth'].forEach(function (
    waveform: Highcharts.InstrumentWaveform
): void {
    // Add basic instruments
    instruments[waveform] = new (Instrument as any)({
        oscillator: { waveformShape: waveform }
    });

    // Add musical instruments
    instruments[waveform + 'Musical'] = new (Instrument as any)({
        allowedFrequencies: utilities.musicalFrequencies,
        oscillator: { waveformShape: waveform }
    });

    // Add scaled instruments
    instruments[waveform + 'Major'] = new (Instrument as any)({
        allowedFrequencies: utilities.getMusicalScale([1, 3, 5, 6, 8, 10, 12]),
        oscillator: { waveformShape: waveform }
    });
});

export default instruments;
