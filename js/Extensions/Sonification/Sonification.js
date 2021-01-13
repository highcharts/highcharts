/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Sonification module for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import O from '../../Core/Options.js';
var defaultOptions = O.defaultOptions;
import Point from '../../Core/Series/Point.js';
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, extend = U.extend, merge = U.merge;
import Instrument from './Instrument.js';
import instruments from './InstrumentDefinitions.js';
import Earcon from './Earcon.js';
import pointSonifyFunctions from './PointSonify.js';
import chartSonifyFunctions from './ChartSonify.js';
import utilities from './Utilities.js';
import TimelineClasses from './Timeline.js';
import sonificationOptions from './Options.js';
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
 */ /**
* Note fade-out-time in milliseconds. Most notes are faded out quickly by
* default if there is time. This is to avoid abrupt stops which will cause
* perceived clicks.
* @name Highcharts.SonificationObject#fadeOutDuration
* @type {number}
*/ /**
* Utility functions.
* @name Highcharts.SonificationObject#utilities
* @private
* @type {object}
*/ /**
* The Instrument class.
* @name Highcharts.SonificationObject#Instrument
* @type {Function}
*/ /**
* Predefined instruments, given as an object with a map between the instrument
* name and the Highcharts.Instrument object.
* @name Highcharts.SonificationObject#instruments
* @type {Object}
*/ /**
* The Earcon class.
* @name Highcharts.SonificationObject#Earcon
* @type {Function}
*/ /**
* The TimelineEvent class.
* @private
* @name Highcharts.SonificationObject#TimelineEvent
* @type {Function}
*/ /**
* The TimelinePath class.
* @private
* @name Highcharts.SonificationObject#TimelinePath
* @type {Function}
*/ /**
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
// Add default options
merge(true, defaultOptions, sonificationOptions);
// Chart specific
Point.prototype.sonify = pointSonifyFunctions.pointSonify;
Point.prototype.cancelSonify = pointSonifyFunctions.pointCancelSonify;
Series.prototype.sonify = chartSonifyFunctions.seriesSonify;
extend(Chart.prototype, {
    sonify: chartSonifyFunctions.chartSonify,
    pauseSonify: chartSonifyFunctions.pause,
    resumeSonify: chartSonifyFunctions.resume,
    rewindSonify: chartSonifyFunctions.rewind,
    cancelSonify: chartSonifyFunctions.cancel,
    getCurrentSonifyPoints: chartSonifyFunctions.getCurrentPoints,
    setSonifyCursor: chartSonifyFunctions.setCursor,
    resetSonifyCursor: chartSonifyFunctions.resetCursor,
    resetSonifyCursorEnd: chartSonifyFunctions.resetCursorEnd
});
/* eslint-disable no-invalid-this */
// Prepare charts for sonification on init
addEvent(Chart, 'init', function () {
    this.sonification = {};
});
// Update with chart/series/point updates
addEvent(Chart, 'update', function (e) {
    var newOptions = e.options.sonification;
    if (newOptions) {
        merge(true, this.options.sonification, newOptions);
    }
});
