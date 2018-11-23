/**
 * (c) 2009-2018 Øystein Moseng
 *
 * Sonification module for Highcharts
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../../parts/Globals.js';
import Instrument from 'Instrument.js';
import instruments from 'instrumentDefinitions.js';

// Expose on Highcharts object
H.sonification = {
    Instrument: Instrument,
    instruments: instruments
};

