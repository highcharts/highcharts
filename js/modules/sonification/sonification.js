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
import Earcon from 'Earcon.js';
import pointSonifyFunctions from 'pointSonify.js';
import chartSonifyFunctions from 'chartSonify.js';
import utilities from 'utilities.js';
import TimelineClasses from 'Timeline.js';

// Expose on the Highcharts object
H.sonification = {
    fadeOutDuration: 20, // Note fade-out-time in milliseconds

    // Classes and functions
    utilities: utilities,
    Instrument: Instrument,
    instruments: instruments,
    Earcon: Earcon,
    TimelineEvent: TimelineClasses.TimelineEvent,
    TimelinePath: TimelineClasses.TimelinePath,
    Timeline: TimelineClasses.Timeline
};

// Chart specific
H.Point.prototype.sonify = pointSonifyFunctions.pointSonify;
H.Point.prototype.cancelSonify = pointSonifyFunctions.pointCancelSonify;
H.Series.prototype.sonify = chartSonifyFunctions.seriesSonify;
H.extend(H.Chart.prototype, {
    sonify: chartSonifyFunctions.chartSonify,
    pauseSonify: chartSonifyFunctions.pause,
    resumeSonify: chartSonifyFunctions.resume,
    rewindSonify: chartSonifyFunctions.rewind,
    cancelSonify: chartSonifyFunctions.cancel,
    getCurrentSonifyPoints: chartSonifyFunctions.getCurrentPoints,
    setSonifyCursor: chartSonifyFunctions.setCursor,
    resetSonifyCursor: chartSonifyFunctions.resetCursor,
    resetSonifyCursorEnd: chartSonifyFunctions.resetCursorEnd,
    sonification: {}
});
