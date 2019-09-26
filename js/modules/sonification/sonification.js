/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Sonification module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
import U from '../../parts/Utilities.js';
var extend = U.extend;

import Instrument from './Instrument.js';
import instruments from './instrumentDefinitions.js';
import Earcon from './Earcon.js';
import pointSonifyFunctions from './pointSonify.js';
import chartSonifyFunctions from './chartSonify.js';
import utilities from './utilities.js';
import TimelineClasses from './Timeline.js';

// Expose on the Highcharts object

/**
 * Global classes and objects related to sonification.
 *
 * @requires module:modules/sonification
 *
 * @name Highcharts.sonification
 * @type {Highcharts.SonificationObject}
 */

/**
 * Global classes and objects related to sonification.
 *
 * @requires module:modules/sonification
 *
 * @interface Highcharts.SonificationObject
 *//**
 * Note fade-out-time in milliseconds. Most notes are faded out quickly by
 * default if there is time. This is to avoid abrupt stops which will cause
 * perceived clicks.
 * @name Highcharts.SonificationObject#fadeOutDuration
 * @type {number}
 *//**
 * Utility functions.
 * @name Highcharts.SonificationObject#utilities
 * @private
 * @type {object}
 *//**
 * The Instrument class.
 * @name Highcharts.SonificationObject#Instrument
 * @type {Function}
 *//**
 * Predefined instruments, given as an object with a map between the instrument
 * name and the Highcharts.Instrument object.
 * @name Highcharts.SonificationObject#instruments
 * @type {Object}
 *//**
 * The Earcon class.
 * @name Highcharts.SonificationObject#Earcon
 * @type {Function}
 *//**
 * The TimelineEvent class.
 * @private
 * @name Highcharts.SonificationObject#TimelineEvent
 * @type {Function}
 *//**
 * The TimelinePath class.
 * @private
 * @name Highcharts.SonificationObject#TimelinePath
 * @type {Function}
 *//**
 * The Timeline class.
 * @private
 * @name Highcharts.SonificationObject#Timeline
 * @type {Function}
 */
H.sonification = {
    fadeOutDuration: 20,

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
extend(H.Chart.prototype, {
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
