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
    fadeOutDuration: 15, // Note fade-out-time in milliseconds

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
H.Chart.prototype.sonify = chartSonifyFunctions.chartSonify;
H.Chart.prototype.sonification = {
    pause: chartSonifyFunctions.pause,
    resume: chartSonifyFunctions.resume,
    rewind: chartSonifyFunctions.rewind,
    cancel: chartSonifyFunctions.cancel,
    getCurrentPoints: chartSonifyFunctions.getCurrentPoints,
    setCursor: chartSonifyFunctions.setCursor,
    resetCursor: chartSonifyFunctions.resetCursor,
    resetCursorEnd: chartSonifyFunctions.resetCursorEnd
};
