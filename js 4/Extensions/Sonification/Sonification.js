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
/* *
 *
 *  Imports
 *
 * */
import D from '../../Core/DefaultOptions.js';
var defaultOptions = D.defaultOptions;
import U from '../../Core/Utilities.js';
var merge = U.merge;
import SU from './SonificationUtilities.js';
import sonificationOptions from './Options.js';
/* *
 *
 *  Functions
 *
 * */
// Expose on the Highcharts object
// Add default options
merge(true, defaultOptions, sonificationOptions);
var Sonification = {
    fadeOutDuration: 20,
    // Classes and functions
    utilities: SU
};
/* *
 *
 *  Default Export
 *
 * */
export default Sonification;
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
* @type {Object}
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
(''); // detach doclets above
